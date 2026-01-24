/**
 * EcoGenAI - Professional Landing Page
 * Enterprise AI Sustainability Platform for Allianz
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section with Climate Background */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title animate-fadeIn">
            Welcome to EcoGenAI
          </h1>
          <p className="hero-slogan animate-fadeIn" style={{ animationDelay: '200ms' }}>
            Transforming AI Sustainability Through Intelligent Carbon Tracking
          </p>
          <p className="hero-description animate-fadeIn" style={{ animationDelay: '400ms' }}>
            Enterprise-grade platform for monitoring, measuring, and reducing the environmental impact of Generative AI operations
          </p>
          <div className="hero-cta animate-fadeIn" style={{ animationDelay: '600ms' }}>
            <Link href="/dashboard" className="btn btn-primary btn-large">
              Launch Dashboard
            </Link>
            <Link href="#features" className="btn btn-outline btn-large">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What is EcoGenAI?</h2>
            <p className="section-subtitle">
              A comprehensive ESG platform designed for Allianz to understand, manage, and reduce the environmental impact of Generative AI
            </p>
          </div>

          <div className="overview-grid">
            <div className="overview-card card">
              <div className="overview-icon">
                <img src="/ai-sustainability.png" alt="AI Sustainability" />
              </div>
              <h3>Real-Time Monitoring</h3>
              <p>
                Track AI workloads across cloud regions, capturing runtime, compute intensity, and resource utilization without accessing provider infrastructure
              </p>
            </div>

            <div className="overview-card card">
              <div className="overview-icon">
                <img src="/carbon-tracking.png" alt="Carbon Tracking" />
              </div>
              <h3>Carbon Footprint Analysis</h3>
              <p>
                Convert energy usage into carbon emissions using region-specific intensity factors for accurate ESG reporting and regulatory compliance
              </p>
            </div>

            <div className="overview-card card">
              <div className="overview-icon">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <circle cx="60" cy="60" r="50" fill="#E3F2FD" />
                  <path d="M40 60L55 75L80 45" stroke="#003781" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="60" cy="60" r="40" stroke="#00BCD4" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>
              <h3>Actionable Optimization</h3>
              <p>
                Generate explainable sustainability recommendations with estimated savings, backed by enterprise governance and approval workflows
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Tutorial */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Platform Features</h2>
            <p className="section-subtitle">
              Comprehensive tools for AI sustainability management
            </p>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-number">01</div>
              <div className="feature-content">
                <h3>AI Workload Monitoring</h3>
                <p>
                  Monitor every AI workload at the application level, capturing model type, runtime duration, compute intensity, and cloud region. Real-time visibility into where, how, and how long AI systems are running across your organization.
                </p>
                <Link href="/dashboard" className="feature-link">View Dashboard →</Link>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">02</div>
              <div className="feature-content">
                <h3>Energy Consumption Estimation</h3>
                <p>
                  Convert runtime and compute intensity into estimated energy usage in kilowatt-hours using industry-accepted energy models. Continuously updated visualizations help identify energy-intensive models and inefficient workloads.
                </p>
                <Link href="/dashboard" className="feature-link">Energy Analytics →</Link>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">03</div>
              <div className="feature-content">
                <h3>Carbon Emissions Tracking</h3>
                <p>
                  Apply region-specific carbon intensity factors to convert energy usage into carbon emissions. Measure your AI carbon footprint accurately and transparently for ESG reporting and regulatory compliance.
                </p>
                <Link href="/carbon-footprint" className="feature-link">Carbon Analysis →</Link>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">04</div>
              <div className="feature-content">
                <h3>Optimization Engine</h3>
                <p>
                  Analyze AI usage, energy consumption, and carbon data to generate explainable sustainability recommendations including workload shifting, scheduling optimization, and model efficiency improvements.
                </p>
                <Link href="/optimization" className="feature-link">View Recommendations →</Link>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">05</div>
              <div className="feature-content">
                <h3>Governance & Approval Workflow</h3>
                <p>
                  All optimization actions require managerial approval with complete audit trails. Ensures transparency, trust, and compliance with enterprise governance standards critical for regulated environments.
                </p>
                <Link href="/governance" className="feature-link">Governance Portal →</Link>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">06</div>
              <div className="feature-content">
                <h3>AI Sustainability Auditor Bot</h3>
                <p>
                  Ask simple questions like "Why did emissions increase this week?" or "Which model caused the carbon spike?" The system analyzes internal logs and explains results in clear business language for non-technical stakeholders.
                </p>
                <Link href="/auditor" className="feature-link">Ask Auditor Bot →</Link>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-number">07</div>
              <div className="feature-content">
                <h3>ESG Reporting & Analytics</h3>
                <p>
                  Generate audit-ready ESG reports in PDF and CSV formats with methodology, assumptions, and transparency notes. Includes cost-versus-carbon analysis and climate risk simulation for strategic planning.
                </p>
                <Link href="/esg-score" className="feature-link">ESG Dashboard →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESG News */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest ESG & AI Sustainability News</h2>
            <p className="section-subtitle">
              Stay informed about regulatory changes and industry developments
            </p>
          </div>

          <div className="news-grid">
            <div className="news-card card">
              <div className="news-date">January 2026</div>
              <h3>EU AI Act Compliance Requirements</h3>
              <p>
                New regulations mandate transparency in AI energy consumption and carbon emissions for enterprise deployments across European markets.
              </p>
              <a href="#" className="news-link">Read More →</a>
            </div>

            <div className="news-card card">
              <div className="news-date">December 2025</div>
              <h3>Corporate Sustainability Reporting Directive (CSRD)</h3>
              <p>
                Extended requirements now include digital infrastructure and AI operations in mandatory ESG disclosures for large enterprises.
              </p>
              <a href="#" className="news-link">Read More →</a>
            </div>

            <div className="news-card card">
              <div className="news-date">November 2025</div>
              <h3>AI Carbon Footprint Standards Released</h3>
              <p>
                Industry consortium publishes standardized methodology for calculating and reporting AI-related carbon emissions.
              </p>
              <a href="#" className="news-link">Read More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="section section-importance">
        <div className="container">
          <div className="importance-content">
            <div className="importance-text">
              <h2 className="section-title">Why AI Sustainability Matters</h2>
              <div className="importance-points">
                <div className="importance-point">
                  <div className="point-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h4>Regulatory Compliance</h4>
                    <p>Meet evolving ESG disclosure requirements including EU CSRD, AI Act, and climate risk reporting mandates</p>
                  </div>
                </div>

                <div className="importance-point">
                  <div className="point-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h4>Cost Optimization</h4>
                    <p>Reduce cloud infrastructure costs by 15-30% through energy-efficient AI operations and workload optimization</p>
                  </div>
                </div>

                <div className="importance-point">
                  <div className="point-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h4>Brand Reputation</h4>
                    <p>Demonstrate leadership in responsible AI and environmental stewardship to stakeholders and customers</p>
                  </div>
                </div>

                <div className="importance-point">
                  <div className="point-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div>
                    <h4>Climate Impact</h4>
                    <p>AI training and inference contribute significantly to global carbon emissions - transparency enables action</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="importance-stats">
              <div className="stat-box">
                <div className="stat-value">2-5%</div>
                <div className="stat-label">of global electricity used by data centers</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">40%</div>
                <div className="stat-label">potential energy reduction through optimization</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">100+</div>
                <div className="stat-label">countries with AI sustainability regulations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Contact */}
      <section className="section section-light">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2 className="section-title">About EcoGenAI</h2>
              <p>
                EcoGenAI is an enterprise-grade ESG platform developed specifically for Allianz to address the growing environmental impact of Generative AI operations. Built on industry-standard methodologies and compliance frameworks, the platform provides end-to-end visibility and control over AI sustainability.
              </p>
              <p>
                Our solution combines real-time monitoring, accurate carbon accounting, and intelligent optimization to help organizations meet regulatory requirements while reducing costs and environmental impact.
              </p>

              <div className="tech-stack">
                <h4>Technology Stack</h4>
                <div className="tech-badges">
                  <span className="tech-badge">FastAPI</span>
                  <span className="tech-badge">Next.js 14</span>
                  <span className="tech-badge">TypeScript</span>
                  <span className="tech-badge">SQLAlchemy</span>
                  <span className="tech-badge">WebSocket</span>
                  <span className="tech-badge">Recharts</span>
                </div>
              </div>
            </div>

            <div className="contact-content">
              <h3>Get Started</h3>
              <p>Ready to transform your AI operations with sustainable practices?</p>

              <div className="contact-info">
                <div className="contact-item">
                  <strong>Platform Access</strong>
                  <p>Enterprise SSO integration available</p>
                </div>
                <div className="contact-item">
                  <strong>Documentation</strong>
                  <p>Comprehensive API docs and user guides</p>
                </div>
                <div className="contact-item">
                  <strong>Support</strong>
                  <p>24/7 enterprise support available</p>
                </div>
              </div>

              <div className="contact-cta">
                <Link href="/dashboard" className="btn btn-primary">
                  Access Platform
                </Link>
                <a href="mailto:esg@allianz.com" className="btn btn-outline">
                  Contact Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .landing-page {
          width: 100%;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('/climate-hero.png');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 55, 129, 0.9) 0%, rgba(0, 188, 212, 0.8) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          color: white;
          padding: var(--space-2xl) var(--space-lg);
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: var(--space-lg);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .hero-slogan {
          font-size: 1.75rem;
          font-weight: 500;
          margin-bottom: var(--space-md);
          opacity: 0.95;
        }

        .hero-description {
          font-size: 1.125rem;
          max-width: 800px;
          margin: 0 auto var(--space-2xl);
          opacity: 0.9;
          line-height: 1.8;
        }

        .hero-cta {
          display: flex;
          gap: var(--space-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-large {
          padding: 16px 32px;
          font-size: 1rem;
        }

        /* Sections */
        .section {
          padding: var(--space-2xl) 0;
        }

        .section-light {
          background: var(--bg-primary);
        }

        .section-header {
          text-align: center;
          margin-bottom: var(--space-2xl);
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: var(--space-md);
          color: var(--text-primary);
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          max-width: 700px;
          margin: 0 auto;
        }

        /* Overview Grid */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-xl);
        }

        .overview-card {
          text-align: center;
          padding: var(--space-xl);
        }

        .overview-icon {
          width: 120px;
          height: 120px;
          margin: 0 auto var(--space-lg);
        }

        .overview-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .overview-card h3 {
          font-size: 1.5rem;
          margin-bottom: var(--space-md);
          color: var(--primary);
        }

        .overview-card p {
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* Features List */
        .features-list {
          max-width: 900px;
          margin: 0 auto;
        }

        .feature-item {
          display: flex;
          gap: var(--space-xl);
          padding: var(--space-xl);
          margin-bottom: var(--space-lg);
          background: var(--bg-elevated);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-base);
        }

        .feature-item:hover {
          box-shadow: var(--shadow-lg);
          transform: translateX(8px);
        }

        .feature-number {
          font-size: 3rem;
          font-weight: 700;
          color: var(--primary-light);
          font-family: var(--font-display);
          flex-shrink: 0;
        }

        .feature-content h3 {
          font-size: 1.5rem;
          margin-bottom: var(--space-sm);
          color: var(--primary);
        }

        .feature-content p {
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
          line-height: 1.7;
        }

        .feature-link {
          color: var(--secondary);
          font-weight: 600;
          text-decoration: none;
          transition: color var(--transition-base);
        }

        .feature-link:hover {
          color: var(--primary);
        }

        /* News Grid */
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-lg);
        }

        .news-card {
          padding: var(--space-xl);
        }

        .news-date {
          font-size: 0.875rem;
          color: var(--secondary);
          font-weight: 600;
          margin-bottom: var(--space-sm);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .news-card h3 {
          font-size: 1.25rem;
          margin-bottom: var(--space-md);
          color: var(--text-primary);
        }

        .news-card p {
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
          line-height: 1.7;
        }

        .news-link {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }

        /* Importance Section */
        .section-importance {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
        }

        .section-importance .section-title {
          color: white;
        }

        .importance-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2xl);
          align-items: center;
        }

        .importance-points {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          margin-top: var(--space-xl);
        }

        .importance-point {
          display: flex;
          gap: var(--space-md);
        }

        .point-icon {
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          color: var(--secondary);
        }

        .importance-point h4 {
          font-size: 1.125rem;
          margin-bottom: var(--space-xs);
        }

        .importance-point p {
          opacity: 0.9;
          line-height: 1.6;
        }

        .importance-stats {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          text-align: center;
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: var(--space-sm);
          color: var(--secondary);
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        /* About & Contact */
        .about-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--space-2xl);
        }

        .about-content p {
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: var(--space-lg);
        }

        .tech-stack {
          margin-top: var(--space-xl);
        }

        .tech-stack h4 {
          font-size: 1.125rem;
          margin-bottom: var(--space-md);
          color: var(--text-primary);
        }

        .tech-badges {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }

        .tech-badge {
          padding: 6px 12px;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .contact-content {
          background: var(--bg-elevated);
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .contact-content h3 {
          font-size: 1.5rem;
          margin-bottom: var(--space-md);
          color: var(--primary);
        }

        .contact-content > p {
          color: var(--text-secondary);
          margin-bottom: var(--space-xl);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .contact-item strong {
          display: block;
          color: var(--text-primary);
          margin-bottom: var(--space-xs);
        }

        .contact-item p {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .contact-cta {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: 3rem;
          }

          .importance-content,
          .about-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-slogan {
            font-size: 1.25rem;
          }

          .feature-item {
            flex-direction: column;
            text-align: center;
          }

          .feature-number {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
