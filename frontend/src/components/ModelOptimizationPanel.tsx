/**
 * Model Optimization Panel
 * Shows advanced model efficiency recommendations
 */
'use client';

interface Optimization {
  total_opportunities: number;
  total_energy_saving_kwh: number;
  total_carbon_saving_kg: number;
  total_cost_savings_usd: number;
  by_type: Record<string, number>;
  recommendations: any[];
}

interface Props {
  optimization: Optimization;
}

export default function ModelOptimizationPanel({ optimization }: Props) {
  const typeIcons: Record<string, string> = {
    'MODEL_SIZING': '📏',
    'QUANTIZATION': '🔢',
    'DISTILLATION': '🧪',
    'PRUNING': '✂️'
  };

  const typeNames: Record<string, string> = {
    'MODEL_SIZING': 'Model Right-Sizing',
    'QUANTIZATION': 'Quantization',
    'DISTILLATION': 'Knowledge Distillation',
    'PRUNING': 'Model Pruning'
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Header */}
      <h3 style={{ 
        margin: '0 0 16px', 
        fontSize: '18px', 
        fontWeight: 600,
        color: '#1f2937' 
      }}>
        🚀 Model Efficiency Optimization
      </h3>

      {/* Summary */}
      <div style={{ 
        padding: '16px', 
        background: '#f9fafb', 
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
              Opportunities
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#7c3aed' }}>
              {optimization.total_opportunities}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
              Potential Savings
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#059669' }}>
              {optimization.total_carbon_saving_kg.toFixed(2)} kg CO₂
            </div>
          </div>
        </div>
      </div>

      {/* By Type */}
      {Object.keys(optimization.by_type).length > 0 ? (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '12px' }}>
            Optimization Types
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(optimization.by_type).map(([type, count]) => (
              <div key={type} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                background: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{typeIcons[type] || '💡'}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                    {typeNames[type] || type}
                  </span>
                </div>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 700, 
                  color: '#7c3aed',
                  padding: '2px 8px',
                  background: '#7c3aed15',
                  borderRadius: '4px'
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px 20px',
          color: '#9ca3af',
          fontSize: '13px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✨</div>
          <div>No optimization opportunities yet</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>
            Recommendations will appear as workloads accumulate data
          </div>
        </div>
      )}

      {/* View Details Link */}
      {optimization.total_opportunities > 0 && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a 
            href="/optimization" 
            style={{
              fontSize: '13px',
              color: '#7c3aed',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            View All Recommendations →
          </a>
        </div>
      )}
    </div>
  );
}
