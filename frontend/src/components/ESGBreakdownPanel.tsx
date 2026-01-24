/**
 * ESG Score Breakdown Panel
 * Shows contribution of each component to overall ESG score
 */
'use client';

interface Breakdown {
  carbon_efficiency_score: number;
  energy_efficiency_score: number;
  optimization_adoption_score: number;
  regional_sustainability_score: number;
  carbon_weight: number;
  energy_weight: number;
  optimization_weight: number;
  regional_weight: number;
  total_carbon_kg: number;
  total_energy_kwh: number;
  total_workloads: number;
  low_carbon_region_percentage: number;
  optimization_opportunities: number;
  recommendations_adopted: number;
}

interface Props {
  breakdown: Breakdown;
}

export default function ESGBreakdownPanel({ breakdown }: Props) {
  const components = [
    {
      name: 'Carbon Efficiency',
      score: breakdown.carbon_efficiency_score,
      weight: breakdown.carbon_weight * 100,
      color: '#059669',
      icon: '🌍',
      metric: `${breakdown.total_carbon_kg.toFixed(2)} kg CO₂`,
      description: 'Lower emissions = higher score'
    },
    {
      name: 'Energy Efficiency',
      score: breakdown.energy_efficiency_score,
      weight: breakdown.energy_weight * 100,
      color: '#f59e0b',
      icon: '⚡',
      metric: `${breakdown.total_energy_kwh.toFixed(2)} kWh`,
      description: 'Lower energy per workload = higher score'
    },
    {
      name: 'Optimization Adoption',
      score: breakdown.optimization_adoption_score,
      weight: breakdown.optimization_weight * 100,
      color: '#6366f1',
      icon: '🎯',
      metric: `${breakdown.recommendations_adopted}/${breakdown.optimization_opportunities} adopted`,
      description: 'More recommendations adopted = higher score'
    },
    {
      name: 'Regional Sustainability',
      score: breakdown.regional_sustainability_score,
      weight: breakdown.regional_weight * 100,
      color: '#10b981',
      icon: '📍',
      metric: `${breakdown.low_carbon_region_percentage.toFixed(0)}% low-carbon`,
      description: 'More workloads in clean regions = higher score'
    }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '28px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Header */}
      <h3 style={{ 
        margin: '0 0 24px', 
        fontSize: '20px', 
        fontWeight: 600,
        color: '#1f2937' 
      }}>
        Score Breakdown
      </h3>

      {/* Components */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {components.map((component, index) => (
          <div key={index} style={{
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            {/* Component Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{component.icon}</span>
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#1f2937'
                  }}>
                    {component.name}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#9ca3af',
                    marginTop: '2px'
                  }}>
                    Weight: {component.weight}%
                  </div>
                </div>
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                color: component.color
              }}>
                {component.score.toFixed(1)}
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              background: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                width: `${component.score}%`,
                height: '100%',
                background: component.color,
                transition: 'width 0.5s ease-out'
              }} />
            </div>

            {/* Metric and Description */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px'
            }}>
              <div style={{ color: '#6b7280', fontWeight: 500 }}>
                {component.metric}
              </div>
              <div style={{ color: '#9ca3af' }}>
                {component.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div style={{
        marginTop: '24px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
            Total Workloads
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
            {breakdown.total_workloads}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
            Optimization Opportunities
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
            {breakdown.optimization_opportunities}
          </div>
        </div>
      </div>
    </div>
  );
}
