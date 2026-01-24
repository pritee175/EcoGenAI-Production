/**
 * Carbon emissions by region chart
 * Shows CO₂ distribution across cloud regions for climate impact analysis
 */
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Workload {
  cloud_region: string;
  carbon_kg?: number;
}

interface Props {
  workloads: Workload[];
}

const COLORS = {
  'EU': '#10b981',
  'US': '#34d399',
  'India': '#6ee7b7'
};

const CARBON_INTENSITY = {
  'EU': 0.25,
  'US': 0.40,
  'India': 0.70
};

export default function CarbonByRegionChart({ workloads }: Props) {
  // Aggregate carbon by region
  const regionData = workloads.reduce((acc, w) => {
    const existing = acc.find(r => r.name === w.cloud_region);
    const carbon = w.carbon_kg || 0;
    
    if (existing) {
      existing.value += carbon;
    } else {
      acc.push({ name: w.cloud_region, value: carbon });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
        CO₂ Emissions by Region
      </h2>
      
      {regionData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          No carbon data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value.toFixed(4) + ' kg CO₂', 'Emissions']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Carbon Intensity Reference */}
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            background: '#f0fdf4', 
            borderRadius: '8px',
            fontSize: '12px',
            color: '#166534'
          }}>
            <strong>Carbon Intensity Factors:</strong>
            <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {Object.entries(CARBON_INTENSITY).map(([region, intensity]) => (
                <div key={region}>
                  <strong>{region}:</strong> {intensity} kg CO₂/kWh
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
