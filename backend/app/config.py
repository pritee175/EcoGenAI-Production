"""
Configuration management for EcoGenAI platform
Handles database connections and environment variables
"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/ecogenai"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002"
    
    class Config:
        env_file = ".env"

settings = Settings()


# ============================================================================
# ENERGY ESTIMATION CONFIGURATION
# ============================================================================
# Industry-standard power coefficients for GenAI workload estimation
# These values represent average GPU power consumption per unit
# Source: Based on NVIDIA A100/H100 specifications and industry benchmarks
# ============================================================================

class EnergyConfig:
    """
    Energy estimation coefficients for ESG compliance
    
    These values are configurable to allow updates as hardware evolves
    or when more accurate telemetry becomes available.
    
    Power coefficients represent average kW per GPU under load.
    """
    
    # Power consumption per GPU (in kW)
    POWER_COEFFICIENTS = {
        "high": 0.5,    # High-compute models (GPT-4, large LLMs) - 500W per GPU
        "medium": 0.3,  # Medium-compute models (BERT, mid-size) - 300W per GPU
        "low": 0.15     # Low-compute models (inference-only) - 150W per GPU
    }
    
    # Model-to-coefficient mapping
    # Maps Allianz AI models to their compute intensity
    MODEL_POWER_MAPPING = {
        "ClaimsBot": "medium",      # Document processing
        "PolicyGPT": "high",        # Large language model
        "FraudAnalyzer": "medium",  # Pattern detection
        "DocumentQA": "medium",     # Question answering
        "RiskAssessor": "high"      # Complex risk modeling
    }
    
    # Default coefficient for unknown models
    DEFAULT_POWER_LEVEL = "medium"
    
    @classmethod
    def get_power_coefficient(cls, model_name: str) -> float:
        """
        Get power coefficient (kW per GPU) for a given model
        
        Args:
            model_name: Name of the AI model
            
        Returns:
            Power coefficient in kW per GPU
        """
        power_level = cls.MODEL_POWER_MAPPING.get(
            model_name, 
            cls.DEFAULT_POWER_LEVEL
        )
        return cls.POWER_COEFFICIENTS[power_level]
    
    @classmethod
    def calculate_energy(cls, model_name: str, gpu_count: int, 
                        runtime_hours: float) -> float:
        """
        Calculate energy consumption for a workload
        
        Formula: Energy (kWh) = Runtime (hours) × GPU Count × Power Coefficient (kW)
        
        Args:
            model_name: Name of the AI model
            gpu_count: Number of GPUs used
            runtime_hours: Runtime duration in hours
            
        Returns:
            Energy consumption in kWh
        """
        power_per_gpu = cls.get_power_coefficient(model_name)
        energy_kwh = runtime_hours * gpu_count * power_per_gpu
        return round(energy_kwh, 4)  # Round to 4 decimal places for precision

energy_config = EnergyConfig()


# ============================================================================
# CARBON INTENSITY CONFIGURATION
# ============================================================================
# Region-specific carbon intensity factors for CO₂ emissions calculation
# These values represent kg CO₂ emitted per kWh of electricity consumed
# Source: Based on regional electricity grid carbon intensity data
# ============================================================================

class CarbonConfig:
    """
    Carbon intensity factors for ESG carbon footprint calculation
    
    These values are configurable to reflect changes in regional energy mixes
    and to support accurate ESG reporting across different cloud regions.
    
    Carbon intensity represents kg CO₂ emitted per kWh of electricity.
    """
    
    # Carbon intensity factors by region (kg CO₂ / kWh)
    CARBON_INTENSITY = {
        "EU": 0.25,      # European Union - cleaner energy mix (renewables, nuclear)
        "US": 0.40,      # United States - mixed energy sources
        "India": 0.70    # India - higher fossil fuel dependency (coal)
    }
    
    # Default carbon intensity for unknown regions
    DEFAULT_CARBON_INTENSITY = 0.40  # Conservative global average
    
    @classmethod
    def get_carbon_intensity(cls, region: str) -> float:
        """
        Get carbon intensity factor for a given region
        
        Args:
            region: Cloud region name (EU, US, India)
            
        Returns:
            Carbon intensity in kg CO₂ per kWh
        """
        return cls.CARBON_INTENSITY.get(
            region, 
            cls.DEFAULT_CARBON_INTENSITY
        )
    
    @classmethod
    def calculate_carbon(cls, energy_kwh: float, region: str) -> float:
        """
        Calculate CO₂ emissions from energy consumption
        
        Formula: CO₂ (kg) = Energy (kWh) × Carbon Intensity (kg CO₂ / kWh)
        
        Args:
            energy_kwh: Energy consumption in kWh
            region: Cloud region name
            
        Returns:
            CO₂ emissions in kg
        """
        carbon_intensity = cls.get_carbon_intensity(region)
        carbon_kg = energy_kwh * carbon_intensity
        return round(carbon_kg, 4)  # Round to 4 decimal places for precision
    
    @classmethod
    def get_all_intensities(cls) -> dict:
        """
        Get all carbon intensity factors for transparency
        
        Returns:
            Dictionary of region: carbon_intensity pairs
        """
        return cls.CARBON_INTENSITY.copy()

carbon_config = CarbonConfig()
