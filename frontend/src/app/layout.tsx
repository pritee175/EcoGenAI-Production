'use client';

import type { Metadata } from 'next';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <title>EcoGenAI - Allianz ESG Monitoring Platform</title>
        <meta name="description" content="Enterprise AI Sustainability & Carbon Tracking for Responsible AI Governance" />
      </head>
      <body>
        <div className="app-wrapper">
          {/* Professional Header */}
          <header className="main-header">
            <div className="header-container">
              <div className="header-left">
                <div className="logo-section">
                  <div className="logo-icon">🌿</div>
                  <div className="logo-text">
                    <h1 className="logo-title">EcoGenAI</h1>
                    <p className="logo-subtitle">Allianz ESG Platform</p>
                  </div>
                </div>
              </div>

              <nav className="main-nav">
                <a href="/" className="nav-link">Dashboard</a>
                <a href="/carbon-footprint" className="nav-link">Carbon</a>
                <a href="/optimization" className="nav-link">Optimize</a>
                <a href="/governance" className="nav-link">Governance</a>
                <a href="/esg-score" className="nav-link">ESG Score</a>
                <a href="/automation" className="nav-link">Automation</a>
                <a href="/auditor" className="nav-link">Auditor Bot</a>
              </nav>

              <div className="header-right">
                <div className="status-indicator">
                  <span className="status-dot status-active"></span>
                  <span className="status-text">Live</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="main-content">
            {children}
          </main>

          {/* Footer */}
          <footer className="main-footer">
            <div className="footer-container">
              <p className="footer-text">
                © 2026 Allianz SE. EcoGenAI Platform - Responsible AI Governance & ESG Sustainability
              </p>
              <div className="footer-links">
                <a href="#" className="footer-link">Privacy</a>
                <a href="#" className="footer-link">Terms</a>
                <a href="#" className="footer-link">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
