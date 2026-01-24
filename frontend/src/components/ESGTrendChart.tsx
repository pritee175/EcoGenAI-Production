/**
 * ESG Score Trend Chart
 * Shows ESG score history over time for tracking improvement
 */
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ESGHistory {
  id: number;
  score: number;
  score_date: string;
  breakdown: any;
}

interface Props {
  history: ESGHistory[];
}

export default function ESGTrendChart({ history }: Props) {
  // Format data for chart
  const chartData = history.map(item => ({
    date: new Date(item.score_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: item.score,
    fullDate: item.score_date
  }));

  // Calculate trend
  const trend = history.length >= 2 
    ? history[history.length - 1].score - history[0].score 
    : 0;
  
  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable';
  const trendColor = trend > 0 ? '#059669' : trend < 0 ? '#dc2626' : '#6b7280';
  const trendIcon = trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';

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
        <h3 style={{ 
          margin: 0, 
          fontSize: '20px', 
          fontWeight: 600,
          color: '#1f2937' 
        }}>
          ESG Score Trend
        </h3>
        {history.length >= 2 && (
          <div style={{
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: trendColor,
            background: `${trendColor}15`,
            border: `1px solid ${trendColor}40`
          }}>
            {trendIcon} {trend > 0 ? '+' : ''}{trend.toFixed(1)} points
          </div>
        )}
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              formatter={(value: any) => [`${value.toFixed(1)}`, 'ESG Score']}
            />
            {/* Reference lines for score ranges */}
            <ReferenceLine y={80} stroke="#059669" strokeDasharray="3 3" opacity={0.3} />
            <ReferenceLine y={60} stroke="#10b981" strokeDasharray="3 3" opacity={0.3} />
            <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="3 3" opacity={0.3} />
            
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div style={{
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          No historical data available yet. Scores are saved periodically to build trend history.
        </div>
      )}

      {/* Trend Interpretation */}
      {history.length >= 2 && (
        <div style={{
          marginTop: '20px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
            {trend > 5 && (
              <>
                <strong style={{ color: '#059669' }}>Positive Trend:</strong> Your ESG score has improved by {trend.toFixed(1)} points. 
                Continue implementing optimization recommendations to maintain this momentum.
              </>
            )}
            {trend < -5 && (
              <>
                <strong style={{ color: '#dc2626' }}>Declining Trend:</strong> Your ESG score has decreased by {Math.abs(trend).toFixed(1)} points. 
                Review recent changes and prioritize high-impact optimization opportunities.
              </>
            )}
            {Math.abs(trend) <= 5 && (
              <>
                <strong style={{ color: '#6b7280' }}>Stable Performance:</strong> Your ESG score has remained relatively stable. 
                Consider implementing new optimization recommendations to drive improvement.
              </>
            )}
          </div>
        </div>
      )}

      {/* Score Range Legend */}
      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: '11px',
        color: '#6b7280'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '3px', background: '#dc2626' }} />
          <span>0-39: Needs Work</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '3px', background: '#f59e0b' }} />
          <span>40-59: Fair</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '3px', background: '#10b981' }} />
          <span>60-79: Good</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '3px', background: '#059669' }} />
          <span>80-100: Excellent</span>
        </div>
      </div>
    </div>
  );
}
