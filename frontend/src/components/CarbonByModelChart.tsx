/**
 * Carbon emissions by AI model chart
 * Shows CO₂ footprint per model to identify carbon-intensive workloads
 */
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Workload {
  model_name: string;
  carbon_kg?: number;
}

interface Props {
  workloads: Workload[];
}

export default function CarbonByModelChart({ workloads }: Props) {
  // Aggregate carbon by model
  const modelCarbon = workloads.reduce((acc, w) => {
    const existing = acc.find(m => m.name === w.model_name);
    const carbon = w.carbon_kg || 0;
    
    if (existing) {
      existing.carbon += carbon;
    } else {
      acc.push({ name: w.model_name, carbon: carbon });
    }
    return acc;
  }, [] as { name: string; carbon: number }[]);

  // Sort by carbon (descending)
  modelCarbon.sort((a, b) => b.carbon - a.carbon);

  // Format for chart
  const chartData = modelCarbon.map(m => ({
    name: m.name,
    'CO₂ Emissions (kg)': parseFloat(m.carbon.toFixed(4))
  }));

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
        CO₂ Emissions by AI Model
      </h2>
      
      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          No carbon data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis 
                label={{ value: 'CO₂ (kg)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#6b7280' } }}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(4) + ' kg CO₂', 'Emissions']}
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="CO₂ Emissions (kg)" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* ESG Insight */}
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            background: '#f0fdf4', 
            borderRadius: '8px',
            fontSize: '13px',
            color: '#166534',
            lineHeight: '1.6'
          }}>
            <strong>💡 Climate Impact Insight:</strong> Models with higher CO₂ emissions are 
            optimization priorities. Consider workload scheduling, model efficiency improvements, 
            or deploying in regions with cleaner energy grids.
          </div>
        </>
      )}
    </div>
  );
}
