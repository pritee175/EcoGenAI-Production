/**
 * Recommendation list component
 * Displays actionable sustainability recommendations with severity badges
 */
'use client';

interface Recommendation {
  workload_id: number;
  model_name: string;
  recommendation_type: string;
  title: string;
  message: string;
  estimated_carbon_saving_kg: number;
  severity: string;
  impact_description: string;
}

interface Props {
  recommendations: Recommendation[];
}

export default function RecommendationList({ recommendations }: Props) {
  // Severity styling
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return { 
          background: '#fee2e2', 
          color: '#dc2626', 
          border: '1px solid #fecaca',
          icon: '🔴'
        };
      case 'MEDIUM':
        return { 
          background: '#fef3c7', 
          color: '#f59e0b', 
          border: '1px solid #fde68a',
          icon: '🟡'
        };
      case 'LOW':
        return { 
          background: '#d1fae5', 
          color: '#059669', 
          border: '1px solid #a7f3d0',
          icon: '🟢'
        };
      default:
        return { 
          background: '#e5e7eb', 
          color: '#6b7280', 
          border: '1px solid #d1d5db',
          icon: '⚪'
        };
    }
  };

  // Recommendation type icons
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'REGION_OPTIMIZATION':
        return '🌍';
      case 'TIME_SCHEDULING':
        return '⏰';
      case 'MODEL_EFFICIENCY':
        return '🚀';
      case 'IDLE_DETECTION':
        return '💤';
      default:
        return '💡';
    }
  };

  // Format recommendation type for display
  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (recommendations.length === 0) {
    return (
      <div style={{ marginTop: '32px' }}>
        <h2 style={{ 
          margin: '0 0 20px', 
          fontSize: '22px', 
          fontWeight: 600,
          color: '#1f2937' 
        }}>
          Optimization Recommendations
        </h2>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '60px 40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
            No Optimization Opportunities Found
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Your AI workloads are currently optimized. Check back as new workloads are created.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Section Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '22px', 
          fontWeight: 600,
          color: '#1f2937' 
        }}>
          Optimization Recommendations
        </h2>
        <div style={{ 
          fontSize: '14px', 
          color: '#6b7280',
          fontWeight: 500
        }}>
          {recommendations.length} {recommendations.length === 1 ? 'recommendation' : 'recommendations'}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {recommendations.map((rec, index) => {
          const severityStyle = getSeverityStyle(rec.severity);
          const typeIcon = getTypeIcon(rec.recommendation_type);
          
          return (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              borderLeft: `4px solid ${severityStyle.color}`,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateX(4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
            >
              {/* Header Row */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <span style={{ fontSize: '32px', lineHeight: 1 }}>{typeIcon}</span>
                  <div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {rec.title}
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      {rec.model_name} • {formatType(rec.recommendation_type)}
                    </div>
                  </div>
                </div>
                
                {/* Severity Badge */}
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  ...severityStyle
                }}>
                  {severityStyle.icon} {rec.severity}
                </div>
              </div>

              {/* Message */}
              <div style={{ 
                fontSize: '14px', 
                color: '#374151', 
                lineHeight: '1.6',
                marginBottom: '16px',
                paddingLeft: '44px'
              }}>
                {rec.message}
              </div>

              {/* Impact Row */}
              <div style={{
                display: 'flex',
                gap: '24px',
                paddingLeft: '44px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#9ca3af',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}>
                    Potential Savings
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 700, 
                    color: '#059669'
                  }}>
                    {rec.estimated_carbon_saving_kg.toFixed(4)} kg CO₂
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#9ca3af',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}>
                    Impact
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    fontWeight: 500
                  }}>
                    {rec.impact_description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
