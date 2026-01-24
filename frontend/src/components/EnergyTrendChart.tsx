/**
 * Energy Trend Chart - Time-Series Visualization
 * Shows cumulative energy consumption over time for sustainability analysis
 * Enhancement: Provides temporal insight for ESG reporting
 */
'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EnergyDataPoint {
  timestamp: string;
  time: string;
  totalEnergy: number;
}

interface Props {
  currentTotalEnergy: number;
}

export default function EnergyTrendChart({ currentTotalEnergy }: Props) {
  const [trendData, setTrendData] = useState<EnergyDataPoint[]>([]);

  useEffect(() => {
    // Add new data point when energy changes
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });

    setTrendData(prev => {
      // Keep last 20 data points for readability
      const newData = [
        ...prev,
        {
          timestamp: now.toISOString(),
          time: timeString,
          totalEnergy: parseFloat(currentTotalEnergy.toFixed(4))
        }
      ].slice(-20);
      
      return newData;
    });
  }, [currentTotalEnergy]);

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      {/* Chart Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
          Estimated Energy Trend (Real-Time)
        </h2>
        <span 
          style={{ 
            cursor: 'help',
            display: 'inline-block'
          }}
          title="Cumulative energy consumption over time. Updates every 5 seconds as AI workloads run."
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="#6b7280">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </span>
      </div>

      {/* Chart Description */}
      <div style={{ 
        fontSize: '13px', 
        color: '#6b7280', 
        marginBottom: '20px',
        lineHeight: '1.5'
      }}>
        Cumulative energy consumption showing growth as AI models run. 
        Useful for identifying peak usage periods and sustainability trends.
      </div>
      
      {trendData.length < 2 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px', 
          color: '#9ca3af',
          background: '#f9fafb',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
          <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>
            Building Energy Trend...
          </div>
          <div style={{ fontSize: '13px' }}>
            Data points will appear as workloads run (updates every 5 seconds)
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#d1d5db"
            />
            <YAxis 
              label={{ 
                value: 'Estimated Energy (kWh)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12, fill: '#6b7280' }
              }}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              stroke="#d1d5db"
            />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [value.toFixed(4) + ' kWh', 'Estimated Energy']}
              labelStyle={{ color: '#1f2937', fontWeight: 600 }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '13px', color: '#6b7280' }}
            />
            <Line 
              type="monotone" 
              dataKey="totalEnergy" 
              stroke="#0033a0" 
              strokeWidth={3}
              dot={{ fill: '#0033a0', r: 4 }}
              activeDot={{ r: 6 }}
              name="Cumulative Energy"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      
      {/* ESG Insight Note */}
      <div style={{ 
        marginTop: '20px', 
        padding: '16px', 
        background: '#f0f9ff', 
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#0c4a6e',
        lineHeight: '1.6'
      }}>
        <strong>💡 Sustainability Insight:</strong> Upward trends indicate active AI workloads. 
        Flat periods show no new energy consumption. Use this data to identify peak usage times 
        and optimize workload scheduling for reduced environmental impact.
      </div>
    </div>
  );
}
