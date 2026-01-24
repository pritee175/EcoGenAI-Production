/**
 * Region distribution chart
 * Shows GPU usage across cloud regions
 */
'use client';

import { Workload } from '@/services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Props {
  workloads: Workload[];
}

const COLORS = {
  'India': '#0033a0',
  'EU': '#005eb8',
  'US': '#00a3e0'
};

export default function RegionChart({ workloads }: Props) {
  // Aggregate GPU count by region
  const regionData = workloads.reduce((acc, w) => {
    const existing = acc.find(r => r.name === w.cloud_region);
    if (existing) {
      existing.value += w.gpu_count;
    } else {
      acc.push({ name: w.cloud_region, value: w.gpu_count });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: '0 0 20px', fontSize: '20px', color: '#1f2937' }}>
        GPU Distribution by Region
      </h2>
      
      {regionData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={regionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {regionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
