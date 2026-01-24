/**
 * Carbon statistics cards for ESG dashboard
 * Executive-level CO₂ emissions KPIs with real-time updates
 */
'use client';

import { useState } from 'react';

interface Workload {
  id: number;
  model_name: string;
  cloud_region: string;
  carbon_kg?: number;
  status: string;
}

interface Props {
  workloads: Workload[];
  carbonSummary?: {
    total_carbon_kg: number;
  };
}

export default function CarbonStatsCards({ workloads, carbonSummary }: Props) {
  const totalCarbon = carbonSummary?.total_carbon_kg || 0;
  
  // Find highest carbon emitting workload
  const highestEmitter = workloads.reduce((max, w) => {
    const carbon = w.carbon_kg || 0;
    return carbon > (max.carbon_kg || 0) ? w : max;
  }, workloads[0] || { model_name: 'N/A', carbon_kg: 0, cloud_region: 'N/A' });
  
  // Find region with highest carbon impact
  const regionCarbon = workloads.reduce((acc, w) => {
    const region = w.cloud_region;
    const carbon = w.carbon_kg || 0;
    acc[region] = (acc[region] || 0) + carbon;
    return acc;
  }, {} as Record<string, number>);
  
  const highestRegion = Object.entries(regionCarbon).reduce((max, [region, carbon]) => {
    return carbon > max.carbon ? { region, carbon } : max;
  }, { region: 'N/A', carbon: 0 });

  const cards = [
    { 
      label: 'Total AI CO₂ Emissions', 
      value: totalCarbon.toFixed(4), 
      unit: 'kg CO₂',
      color: '#059669',
      icon: '🌍',
      description: 'Cumulative carbon footprint'
    },
    { 
      label: 'Highest Carbon-Emitting Model', 
      value: highestEmitter.model_name, 
      subValue: `${(highestEmitter.carbon_kg || 0).toFixed(4)} kg CO₂`,
      color: '#10b981',
      icon: '🔥',
      description: 'Most carbon-intensive workload'
    },
    { 
      label: 'Region with Highest Impact', 
      value: highestRegion.region, 
      subValue: `${highestRegion.carbon.toFixed(4)} kg CO₂`,
      color: '#34d399',
      icon: '📍',
      description: 'Regional climate impact'
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
          Carbon Footprint Summary
        </h2>
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
                  fontSize: '16px', 
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
