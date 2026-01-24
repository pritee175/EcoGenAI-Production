/**
 * ESG Report Download Component
 * Allows downloading comprehensive ESG reports
 */
'use client';

import { useState } from 'react';

export default function ESGReportDownload() {
  const [period, setPeriod] = useState(30);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReport = async (format: 'csv' | 'json') => {
    setIsDownloading(true);
    try {
      const url = `http://localhost:8000/api/governance/reports/export/${format}?period_days=${period}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `esg_report_${period}days.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{
      marginTop: '32px',
      background: 'white',
      borderRadius: '12px',
      padding: '28px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ 
        margin: '0 0 16px', 
        fontSize: '20px', 
        fontWeight: 600,
        color: '#1f2937' 
      }}>
        📄 ESG Report Generator
      </h3>
      
      <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
        Generate comprehensive ESG reports for regulatory compliance, audit requirements, and stakeholder reporting. 
        Reports include methodology, carbon intensity factors, and compliance statements.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Period Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>
            Reporting Period:
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              background: 'white',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>

        {/* Download Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => downloadReport('csv')}
            disabled={isDownloading}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              background: '#059669',
              border: 'none',
              borderRadius: '8px',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              opacity: isDownloading ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => !isDownloading && (e.currentTarget.style.background = '#047857')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#059669')}
          >
            {isDownloading ? '⏳ Downloading...' : '📊 Download CSV'}
          </button>
          
          <button
            onClick={() => downloadReport('json')}
            disabled={isDownloading}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              background: '#0033a0',
              border: 'none',
              borderRadius: '8px',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              opacity: isDownloading ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => !isDownloading && (e.currentTarget.style.background = '#002a80')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#0033a0')}
          >
            {isDownloading ? '⏳ Downloading...' : '📋 Download JSON'}
          </button>
        </div>
      </div>

      {/* Report Contents */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
          Report Includes:
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '6px',
          fontSize: '12px',
          color: '#374151'
        }}>
          <div>✓ Executive Summary</div>
          <div>✓ Energy Consumption Report</div>
          <div>✓ Workload Analysis</div>
          <div>✓ Carbon Emissions Report</div>
          <div>✓ ESG Score Trend</div>
          <div>✓ Methodology & Assumptions</div>
          <div>✓ Optimization Actions</div>
          <div>✓ Compliance Statements</div>
        </div>
      </div>
    </div>
  );
}
