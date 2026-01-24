/**
 * Energy consumption bar chart
 * Shows energy usage by AI model for ESG analysis
 */
'use client';

import { Workload } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  workloads: Workload[];
}

export default function EnergyChart({ workloads }: Props) {
  // Aggregate energy by model
  const modelEnergy = workloads.reduce((acc, w) => {
    const existing = acc.find(m => m.name === w.model_name);
    const energy = w.energy_kwh || 0;
    
    if (existing) {
      existing.energy += energy;
    } else {
      acc.push({ name: w.model_name, energy: energy });
    }
    return acc;
  }, [] as { name: string; energy: number }[]);

  // Sort by energy (descending)
  modelEnergy.sort((a, b) => b.energy - a.energy);

  // Format energy values to 4 decimal places
  const chartData = modelEnergy.map(m => ({
    name: m.name,
    'Energy (kWh)': parseFloat(m.energy.toFixed(4))
  }));

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
          Estimated Energy Consumption by AI Model
        </h2>
        <span 
          style={{ 
            cursor: 'help',
            display: 'inline-block'
          }}
          title="Energy values are calculated using industry-average compute power estimates based on runtime and GPU usage."
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#6b7280">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </span>
      </div>
      
      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          No energy data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Energy (kWh)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: number) => [value.toFixed(4) + ' kWh', 'Energy']}
            />
            <Legend />
            <Bar dataKey="Energy (kWh)" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      )}
      
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: '#fef3c7', 
        borderRadius: '8px',
        fontSize: '13px',
        color: '#92400e'
      }}>
        <strong>ESG Note:</strong> Energy estimates help identify optimization opportunities. 
        Models with high energy consumption may benefit from efficiency improvements or 
        workload scheduling during off-peak hours.
      </div>
    </div>
  );
}
