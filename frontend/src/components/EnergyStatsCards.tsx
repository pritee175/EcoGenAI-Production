/**
 * Energy statistics cards for ESG dashboard
 * Executive-level KPI cards with real-time updates
 * Enhancement: Improved clarity and ESG transparency
 */
'use client';

import { Workload } from '@/services/api';
import { useState } from 'react';

interface Props {
  workloads: Workload[];
  energySummary?: {
    total_energy_today_kwh: number;
    average_energy_per_model_kwh: number;
  };
}

export default function EnergyStatsCards({ workloads, energySummary }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const totalEnergy = energySummary?.total_energy_today_kwh || 0;
  const avgEnergy = energySummary?.average_energy_per_model_kwh || 0;
  
  // Find highest energy consuming workload
  const highestConsumer = workloads.reduce((max, w) => {
    const energy = w.energy_kwh || 0;
    return energy > (max.energy_kwh || 0) ? w : max;
  }, workloads[0] || { model_name: 'N/A', energy_kwh: 0 });

  const cards = [
    { 
      label: 'Total Estimated Energy Used', 
      value: totalEnergy.toFixed(4), 
      unit: 'kWh',
      color: '#0033a0',
      icon: '⚡',
      description: 'Sum of all AI workloads today'
    },
    { 
      label: 'Average Energy per AI Model', 
      value: avgEnergy.toFixed(4), 
      unit: 'kWh',
      color: '#005eb8',
      icon: '📊',
      description: 'Mean energy across all models'
    },
    { 
      label: 'Highest Energy Consuming Model', 
      value: highestConsumer.model_name, 
      subValue: `${(highestConsumer.energy_kwh || 0).toFixed(4)} kWh`,
      color: '#00a3e0',
      icon: '🔥',
      description: 'Most energy-intensive workload'
    }
  ];

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Section Header with ESG Transparency */}
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
          Estimated Energy Consumption
        </h2>
        
        {/* ESG Transparency Tooltip */}
        <div style={{ position: 'relative' }}>
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              cursor: 'help',
              padding: '6px 10px',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Estimated Values</span>
          </button>
          
          {/* Tooltip Content */}
          {showTooltip && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              marginTop: '8px',
              padding: '16px',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              width: '380px',
              zIndex: 1000,
              fontSize: '13px',
              lineHeight: '1.6',
              color: '#374151'
            }}>
              <div style={{ fontWeight: 600, marginBottom: '8px', color: '#1f2937' }}>
                ESG Transparency Notice
              </div>
              <div>
                Energy values are calculated using <strong>industry-average compute power estimates</strong> based 
                on runtime and GPU usage. Direct hardware-level electricity telemetry is not accessed.
              </div>
              <div style={{ 
                marginTop: '12px', 
                paddingTop: '12px', 
                borderTop: '1px solid #e5e7eb',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <strong>Methodology:</strong> Energy (kWh) = Runtime × GPU Count × Power Coefficient
                <br />
                <strong>Suitable for:</strong> Comparative analysis and ESG reporting
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
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
                  fontSize: '18px', 
                  fontWeight: 500, 
                  color: '#6b7280',
                  marginLeft: '8px'
                }}>
                  {card.unit}
                </span>
              )}
            </div>
            
            {/* Sub Value */}
            {card.subValue && (
              <div style={{ 
                fontSize: '13px', 
                color: '#6b7280',
                marginTop: '8px',
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
