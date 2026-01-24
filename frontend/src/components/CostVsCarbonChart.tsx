/**
 * Cost vs Carbon Analysis Chart
 * Business decision support showing trade-offs
 */
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CostAnalysis {
  current_state: {
    total_carbon_kg: number;
    total_energy_kwh: number;
    estimated_cloud_cost_usd: number;
  };
  optimization_potential: {
    carbon_saving_kg: number;
    energy_saving_kwh: number;
    cost_savings_usd: number;
    implementation_cost_usd: number;
    net_savings_usd: number;
  };
  impact_metrics: {
    carbon_reduction_percentage: number;
    cost_reduction_percentage: number;
    cost_per_kg_carbon_saved: number;
    roi_months: number;
  };
  recommendation: {
    priority: string;
    message: string;
    action: string;
  };
}

interface Props {
  costAnalysis: CostAnalysis;
}

export default function CostVsCarbonChart({ costAnalysis }: Props) {
  // Safety check for data
  if (!costAnalysis || !costAnalysis.current_state) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        <div style={{ fontSize: '16px', fontWeight: 500 }}>Loading cost analysis...</div>
      </div>
    );
  }

  const { current_state, optimization_potential, impact_metrics, recommendation } = costAnalysis;

  // Prepare chart data
  const chartData = [
    {
      name: 'Current',
      'Carbon (kg CO₂)': current_state.total_carbon_kg,
      'Cost ($)': current_state.estimated_cloud_cost_usd
    },
    {
      name: 'After Optimization',
      'Carbon (kg CO₂)': current_state.total_carbon_kg - optimization_potential.carbon_saving_kg,
      'Cost ($)': current_state.estimated_cloud_cost_usd + optimization_potential.net_savings_usd
    }
  ];

  // Priority color
  const priorityColors: Record<string, string> = {
    'HIGH': '#059669',
    'MEDIUM': '#f59e0b',
    'LOW': '#6b7280',
    'MONITOR': '#9ca3af'
  };

  const priorityColor = priorityColors[recommendation.priority] || '#6b7280';

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '28px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: 600,
            color: '#1f2937' 
          }}>
            Cost vs Carbon Analysis
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
            Business decision support for sustainability trade-offs
          </p>
        </div>
        <div style={{
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          color: priorityColor,
          background: `${priorityColor}15`,
          border: `1px solid ${priorityColor}40`
        }}>
          {recommendation.priority} PRIORITY
        </div>
      </div>

      {/* Impact Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          padding: '16px', 
          background: '#f9fafb', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>
            Carbon Reduction
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#059669' }}>
            {impact_metrics.carbon_reduction_percentage.toFixed(1)}%
          </div>
        </div>
        <div style={{ 
          padding: '16px', 
          background: '#f9fafb', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>
            Cost Impact
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: optimization_potential.net_savings_usd < 0 ? '#059669' : '#dc2626' }}>
            {optimization_potential.net_savings_usd < 0 ? '-' : '+'} ${Math.abs(optimization_potential.net_savings_usd).toFixed(2)}
          </div>
        </div>
        <div style={{ 
          padding: '16px', 
          background: '#f9fafb', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>
            Cost per kg CO₂
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0033a0' }}>
            ${impact_metrics.cost_per_kg_carbon_saved.toFixed(2)}
          </div>
        </div>
        <div style={{ 
          padding: '16px', 
          background: '#f9fafb', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', fontWeight: 500 }}>
            ROI Payback
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#7c3aed' }}>
            {impact_metrics.roi_months.toFixed(1)} mo
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
          <Bar dataKey="Carbon (kg CO₂)" fill="#059669" />
          <Bar dataKey="Cost ($)" fill="#0033a0" />
        </BarChart>
      </ResponsiveContainer>

      {/* Recommendation */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', marginBottom: '6px' }}>
          Business Recommendation
        </div>
        <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6', marginBottom: '8px' }}>
          {recommendation.message}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
          → {recommendation.action}
        </div>
      </div>
    </div>
  );
}
