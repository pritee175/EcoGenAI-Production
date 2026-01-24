/**
 * Governance Statistics Cards
 * Shows approval workflow metrics and realized savings
 */
'use client';

interface Statistics {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  executed_requests: number;
  approval_rate: number;
  execution_rate: number;
  total_carbon_savings_kg: number;
  total_energy_savings_kwh: number;
  total_cost_impact_usd: number;
}

interface Props {
  statistics: Statistics;
}

export default function GovernanceStatsCards({ statistics }: Props) {
  const cards = [
    {
      label: 'Total Action Requests',
      value: statistics.total_requests.toString(),
      subValue: `${statistics.pending_requests} pending`,
      color: '#7c3aed',
      icon: '📋',
      description: 'Sustainability actions requested'
    },
    {
      label: 'Approval Rate',
      value: `${statistics.approval_rate.toFixed(1)}%`,
      subValue: `${statistics.approved_requests} approved`,
      color: '#059669',
      icon: '✅',
      description: 'Actions approved by managers'
    },
    {
      label: 'Execution Rate',
      value: `${statistics.execution_rate.toFixed(1)}%`,
      subValue: `${statistics.executed_requests} executed`,
      color: '#0033a0',
      icon: '⚡',
      description: 'Approved actions implemented'
    },
    {
      label: 'Realized Carbon Savings',
      value: statistics.total_carbon_savings_kg.toFixed(4),
      unit: 'kg CO₂',
      color: '#10b981',
      icon: '🌱',
      description: 'From executed actions'
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
          Governance Overview
        </h2>
      </div>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px 20px',
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
              gap: '10px',
              marginBottom: '14px'
            }}>
              <span style={{ fontSize: '28px', lineHeight: 1 }}>{card.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '3px'
                }}>
                  {card.label}
                </div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {card.description}
                </div>
              </div>
            </div>
            
            {/* Card Value */}
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 700, 
              color: card.color,
              lineHeight: 1.2,
              marginBottom: '4px'
            }}>
              {card.value}
              {card.unit && (
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: '#6b7280',
                  marginLeft: '6px'
                }}>
                  {card.unit}
                </span>
              )}
            </div>
            
            {/* Sub Value */}
            {card.subValue && (
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
                marginTop: '6px',
                fontWeight: 500
              }}>
                {card.subValue}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
