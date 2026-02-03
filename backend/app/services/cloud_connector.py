"""
Cloud Connector Service
Connects to AWS, Azure, GCP to monitor GPU workloads in real-time
This is the core service that makes EcoGenAI a persistent monitoring engine
"""
import json
from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from ..models.cloud_integration import CloudIntegration, CloudProvider, ConnectionStatus
from ..models.workload import AIWorkload, JobStatus, JobType
from ..models.energy import EnergyUsage
from ..models.carbon import CarbonEmission
from ..services.energy_calculator import EnergyCalculator
from ..services.carbon_calculator import CarbonCalculator

class CloudConnector:
    """
    Base class for cloud provider connectors
    Each cloud provider (AWS, Azure, GCP) will have its own implementation
    """
    
    @staticmethod
    def verify_credentials(provider: str, access_key: str, secret_key: str = None) -> Dict:
        """
        Verify cloud credentials are valid
        In production, this would make actual API calls to cloud providers
        
        Args:
            provider: Cloud provider name (aws, azure, gcp, internal)
            access_key: Access key or service account JSON
            secret_key: Secret key (for AWS/Azure)
            
        Returns:
            Dictionary with verification status and account details
        """
        # Simulated verification for demo
        # In production, replace with actual cloud SDK calls
        
        if provider == "aws":
            return CloudConnector._verify_aws(access_key, secret_key)
        elif provider == "azure":
            return CloudConnector._verify_azure(access_key, secret_key)
        elif provider == "gcp":
            return CloudConnector._verify_gcp(access_key)
        elif provider == "internal":
            return CloudConnector._verify_internal(access_key)
        else:
            return {"success": False, "error": "Unsupported cloud provider"}
    
    @staticmethod
    def _verify_aws(access_key: str, secret_key: str) -> Dict:
        """
        Verify AWS credentials using boto3
        In production: import boto3, create client, call sts.get_caller_identity()
        """
        # Simulated verification
        if len(access_key) < 10 or len(secret_key) < 10:
            return {"success": False, "error": "Invalid AWS credentials format"}
        
        return {
            "success": True,
            "account_id": "123456789012",
            "account_name": "Demo AWS Account",
            "regions": ["us-east-1", "us-west-2", "eu-west-1", "ap-south-1"]
        }
    
    @staticmethod
    def _verify_azure(client_id: str, client_secret: str) -> Dict:
        """
        Verify Azure credentials using azure-identity
        In production: from azure.identity import ClientSecretCredential
        """
        if len(client_id) < 10 or len(client_secret) < 10:
            return {"success": False, "error": "Invalid Azure credentials format"}
        
        return {
            "success": True,
            "subscription_id": "abcd-1234-efgh-5678",
            "tenant_name": "Demo Azure Tenant",
            "regions": ["eastus", "westus2", "westeurope", "southindia"]
        }
    
    @staticmethod
    def _verify_gcp(service_account_json: str) -> Dict:
        """
        Verify GCP service account credentials
        In production: from google.oauth2 import service_account
        """
        try:
            # Try to parse as JSON
            sa_data = json.loads(service_account_json)
            if "project_id" not in sa_data:
                return {"success": False, "error": "Invalid GCP service account JSON"}
            
            return {
                "success": True,
                "project_id": sa_data.get("project_id", "demo-project"),
                "project_name": "Demo GCP Project",
                "regions": ["us-central1", "us-west1", "europe-west1", "asia-south1"]
            }
        except json.JSONDecodeError:
            return {"success": False, "error": "Invalid JSON format for GCP service account"}
    
    @staticmethod
    def _verify_internal(api_key: str) -> Dict:
        """Verify internal infrastructure API key"""
        if len(api_key) < 10:
            return {"success": False, "error": "Invalid API key format"}
        
        return {
            "success": True,
            "infrastructure_name": "Internal Data Center",
            "regions": ["datacenter-1", "datacenter-2"]
        }
    
    @staticmethod
    def detect_gpu_workloads(integration: CloudIntegration, db: Session) -> List[Dict]:
        """
        Detect running GPU workloads from cloud provider
        This is called by the background scheduler every 30 seconds
        
        In production, this would:
        1. Query cloud provider APIs for GPU instances
        2. Check CloudWatch/Azure Monitor/GCP Monitoring for GPU utilization
        3. Detect new workloads and create AIWorkload records
        4. Update existing workloads with current status
        
        Args:
            integration: CloudIntegration record with credentials
            db: Database session
            
        Returns:
            List of detected workloads
        """
        detected_workloads = []
        
        if integration.provider == CloudProvider.AWS:
            detected_workloads = CloudConnector._detect_aws_workloads(integration, db)
        elif integration.provider == CloudProvider.AZURE:
            detected_workloads = CloudConnector._detect_azure_workloads(integration, db)
        elif integration.provider == CloudProvider.GCP:
            detected_workloads = CloudConnector._detect_gcp_workloads(integration, db)
        elif integration.provider == CloudProvider.INTERNAL:
            detected_workloads = CloudConnector._detect_internal_workloads(integration, db)
        
        # Update last sync time
        integration.last_sync_time = datetime.utcnow()
        integration.status = ConnectionStatus.CONNECTED
        db.commit()
        
        return detected_workloads
    
    @staticmethod
    def _detect_aws_workloads(integration: CloudIntegration, db: Session) -> List[Dict]:
        """
        Detect GPU workloads from AWS
        
        In production, this would:
        1. Use boto3 to query EC2 instances with GPU instance types (p3, p4, g4, etc.)
        2. Check SageMaker training jobs and endpoints
        3. Query CloudWatch for GPU utilization metrics
        4. Create AIWorkload records for new workloads
        
        Production implementation example:
        ```python
        import boto3
        
        ec2 = boto3.client('ec2',
            aws_access_key_id=integration.access_key,
            aws_secret_access_key=integration.secret_key
        )
        
        # Query GPU instances
        response = ec2.describe_instances(
            Filters=[
                {'Name': 'instance-state-name', 'Values': ['running']},
                {'Name': 'instance-type', 'Values': ['p3.*', 'p4.*', 'g4dn.*', 'g5.*']}
            ]
        )
        
        for reservation in response['Reservations']:
            for instance in reservation['Instances']:
                # Extract metadata
                instance_id = instance['InstanceId']
                instance_type = instance['InstanceType']
                region = instance['Placement']['AvailabilityZone'][:-1]
                launch_time = instance['LaunchTime']
                
                # Determine GPU count from instance type
                gpu_count = get_gpu_count_from_instance_type(instance_type)
                
                # Check if workload already exists
                existing = db.query(AIWorkload).filter(
                    AIWorkload.cloud_instance_id == instance_id
                ).first()
                
                if not existing:
                    # Create new workload
                    metadata = {
                        "model_name": f"AWS-{instance_type}",
                        "job_type": "inference",
                        "gpu_count": gpu_count,
                        "region": region,
                        "start_time": launch_time,
                        "cloud_instance_id": instance_id
                    }
                    CloudConnector.create_workload_from_cloud_metadata(metadata, integration, db)
        ```
        """
        # Simulated detection for demo
        # In production, replace with actual boto3 calls as shown above
        
        print(f"Monitoring AWS account {integration.provider_account_id}...")
        
        # For demo, we rely on the existing simulator
        # In production, this would create real workloads from AWS API
        
        return []
    
    @staticmethod
    def _detect_azure_workloads(integration: CloudIntegration, db: Session) -> List[Dict]:
        """
        Detect GPU workloads from Azure
        
        In production:
        1. Use Azure SDK to query VMs with GPU SKUs (NC, ND, NV series)
        2. Check Azure Machine Learning compute clusters
        3. Query Azure Monitor for GPU metrics
        
        Production implementation example:
        ```python
        from azure.identity import ClientSecretCredential
        from azure.mgmt.compute import ComputeManagementClient
        
        credential = ClientSecretCredential(
            tenant_id="your-tenant-id",
            client_id=integration.access_key,
            client_secret=integration.secret_key
        )
        
        compute_client = ComputeManagementClient(
            credential,
            integration.provider_account_id  # subscription_id
        )
        
        # Query all VMs
        for vm in compute_client.virtual_machines.list_all():
            vm_size = vm.hardware_profile.vm_size
            
            # Check if it's a GPU VM (NC, ND, NV series)
            if any(series in vm_size for series in ['NC', 'ND', 'NV']):
                # Extract metadata
                vm_id = vm.id
                region = vm.location
                
                # Determine GPU count from VM size
                gpu_count = get_gpu_count_from_vm_size(vm_size)
                
                # Check if workload exists
                existing = db.query(AIWorkload).filter(
                    AIWorkload.cloud_instance_id == vm_id
                ).first()
                
                if not existing:
                    metadata = {
                        "model_name": f"Azure-{vm_size}",
                        "job_type": "inference",
                        "gpu_count": gpu_count,
                        "region": region,
                        "start_time": datetime.utcnow(),
                        "cloud_instance_id": vm_id
                    }
                    CloudConnector.create_workload_from_cloud_metadata(metadata, integration, db)
        ```
        """
        print(f"Monitoring Azure subscription {integration.provider_account_id}...")
        return []
    
    @staticmethod
    def _detect_gcp_workloads(integration: CloudIntegration, db: Session) -> List[Dict]:
        """
        Detect GPU workloads from GCP - REAL IMPLEMENTATION
        Queries Compute Engine for GPU instances
        """
        print(f"🔍 Monitoring GCP project {integration.provider_account_id}...")
        
        try:
            from google.oauth2 import service_account
            from googleapiclient import discovery
            import json
            
            # Parse service account JSON
            sa_info = json.loads(integration.access_key)
            credentials = service_account.Credentials.from_service_account_info(sa_info)
            
            compute = discovery.build('compute', 'v1', credentials=credentials)
            project = integration.provider_account_id
            
            detected_workloads = []
            
            # List all zones
            try:
                zones_result = compute.zones().list(project=project).execute()
            except Exception as e:
                print(f"⚠️  Could not list zones: {e}")
                return []
            
            for zone in zones_result.get('items', []):
                zone_name = zone['name']
                
                try:
                    # List instances in this zone
                    instances_result = compute.instances().list(
                        project=project,
                        zone=zone_name
                    ).execute()
                    
                    for instance in instances_result.get('items', []):
                        # Check if instance has GPUs
                        guest_accelerators = instance.get('guestAccelerators', [])
                        
                        if guest_accelerators and instance.get('status') == 'RUNNING':
                            instance_id = instance['id']
                            instance_name = instance['name']
                            gpu_count = sum(acc['acceleratorCount'] for acc in guest_accelerators)
                            gpu_type = guest_accelerators[0].get('acceleratorType', 'unknown').split('/')[-1]
                            region = zone_name[:-2]  # Remove zone letter (e.g., us-central1-a -> us-central1)
                            
                            # Check if workload already exists
                            existing = db.query(AIWorkload).filter(
                                AIWorkload.cloud_instance_id == str(instance_id)
                            ).first()
                            
                            if not existing:
                                print(f"✅ Found GPU instance: {instance_name} ({gpu_count}× {gpu_type} in {zone_name})")
                                
                                metadata = {
                                    "model_name": f"GCP-{instance_name}",
                                    "job_type": "inference",
                                    "gpu_count": gpu_count,
                                    "gpu_type": gpu_type,
                                    "region": region,
                                    "start_time": datetime.utcnow(),
                                    "cloud_instance_id": str(instance_id)
                                }
                                
                                workload = CloudConnector.create_workload_from_cloud_metadata(metadata, integration, db)
                                detected_workloads.append(workload.to_dict())
                            else:
                                # Update existing workload status
                                if existing.status != JobStatus.RUNNING:
                                    existing.status = JobStatus.RUNNING
                                    db.commit()
                                    
                except Exception as e:
                    print(f"⚠️  Error checking zone {zone_name}: {e}")
                    continue
            
            if detected_workloads:
                print(f"✅ Detected {len(detected_workloads)} GPU workload(s) from GCP")
            else:
                print(f"ℹ️  No GPU instances found in GCP project {project}")
            
            return detected_workloads
            
        except Exception as e:
            print(f"❌ Error detecting GCP workloads: {e}")
            return []
    
    @staticmethod
    def _detect_internal_workloads(integration: CloudIntegration, db: Session) -> List[Dict]:
        """
        Detect GPU workloads from internal infrastructure
        
        In production:
        1. Query internal GPU cluster management system (Kubernetes, Slurm, etc.)
        2. Parse system logs for GPU job submissions
        3. Monitor NVIDIA DCGM metrics
        """
        return []
    
    @staticmethod
    def create_workload_from_cloud_metadata(metadata: Dict, integration: CloudIntegration, db: Session) -> AIWorkload:
        """
        Create AIWorkload record from cloud provider metadata
        
        Args:
            metadata: Cloud provider metadata (instance type, region, GPU count, etc.)
            integration: CloudIntegration record
            db: Database session
            
        Returns:
            Created AIWorkload record
        """
        workload = AIWorkload(
            model_name=metadata.get("model_name", "CloudDetectedModel"),
            job_type=JobType.INFERENCE if metadata.get("job_type") == "inference" else JobType.TRAINING,
            gpu_count=metadata.get("gpu_count", 1),
            cloud_region=metadata.get("region", "unknown"),
            cloud_instance_id=metadata.get("cloud_instance_id"),
            start_time=metadata.get("start_time", datetime.utcnow()),
            runtime_seconds=0.0,
            status=JobStatus.RUNNING
        )
        
        db.add(workload)
        db.commit()
        db.refresh(workload)
        
        # Initialize energy and carbon tracking
        energy_record = EnergyUsage(
            workload_id=workload.id,
            energy_kwh=0.0
        )
        db.add(energy_record)
        
        carbon_record = CarbonEmission(
            workload_id=workload.id,
            region=workload.cloud_region,
            energy_kwh=0.0,
            carbon_kg=0.0
        )
        db.add(carbon_record)
        
        db.commit()
        
        print(f"✓ Created workload from {integration.provider.value}: {workload.model_name} ({workload.gpu_count} GPUs in {workload.cloud_region})")
        
        return workload
