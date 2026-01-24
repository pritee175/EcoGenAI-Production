/**
 * Optimization statistics cards for ESG dashboard
 * Executive-level KPIs showing potential sustainability savings
 */
'use client';

interface OptimizationSummary {
  total_recommendations: number;
  total_carbon_saving_kg: number;
  total_energy_saving_kwh: number;
  high_severity_count: number;
  medium_severity_count: number;
  low_severity_count: number;
}

interface Props {
  summary: OptimizationSummary;
}

export default function OptimizationStatsCards({ summary }: Props) {
  const cards = [
    { 
      label: 'Total Optimization Opportunities', 
      value: summary.total_recommendations.toString(), 
      unit: 'recommendations',
      color: '#0033a0',
      icon: '💡',
      description: 'Actionable sustainability insights'
    },
    { 
      label: 'Potential Carbon Savings', 
      value: summary.total_carbon_saving_kg.toFixed(4), 
      unit: 'kg CO₂',
      color: '#059669',
      icon: '🌱',
      description: 'Estimated emission reduction'
    },
    { 
      label: 'Potential Energy Savings', 
      value: summary.total_energy_saving_kwh.toFixed(4), 
      unit: 'kWh',
      color: '#f59e0b',
      icon: '⚡',
      description: 'Estimated energy reduction'
    }
  ];

  const severityCards = [
    {
      label: 'High Priority',
      value: summary.high_severity_count.toString(),
      color: '#dc2626',
      icon: '🔴',
      description: 'Significant savings potential'
    },
    {
      label: 'Medium Priority',
      value: summary.medium_severity_count.toString(),
      color: '#f59e0b',
      icon: '🟡',
      description: 'Moderate savings potential'
    },
    {
      label: 'Low Priority',
      value: summary.low_severity_count.toString(),
      color: '#10b981',
      icon: '🟢',
      description: 'Minor savings potential'
    }
  ];

  return (
    <div>
      {/* Section Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '22px', 
          fontWeight: 600,
          color: '#1f2937' 
        }}>
          Optimization Summary
        </h2>
      </div>
      
      {/* Main KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '28px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb',
            borderLeft: `4px solid ${card.color}`,
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          }}
          >
            {/* Card Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '32px', lineHeight: 1 }}>{card.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '13px', 
                  color: '#6b7280',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  {card.label}
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                  {card.description}
                </div>
              </div>
            </div>
            
            {/* Card Value */}
            <div style={{ 
              fontSize: '36px', 
              fontWeight: 700, 
              color: card.color,
              lineHeight: 1.2,
              marginBottom: '4px'
            }}>
              {card.value}
              {card.unit && (
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#6b7280',
                  marginLeft: '8px'
                }}>
                  {card.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Severity Breakdown */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginBottom: '16px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: 600,
          color: '#1f2937' 
        }}>
          Priority Breakdown
        </h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {severityCards.map((card, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{ fontSize: '28px', lineHeight: 1 }}>{card.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                fontWeight: 500,
                marginBottom: '4px'
              }}>
                {card.label}
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                color: card.color,
                lineHeight: 1
              }}>
                {card.value}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                {card.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
