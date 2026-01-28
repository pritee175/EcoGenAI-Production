"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Leaf, ArrowRight, Play, TrendingUp, Shield, Zap, 
  Globe, BarChart3, CheckCircle, Mail, Phone, MapPin,
  ChevronDown, Sparkles, Target, Users, Award
} from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#003781' }}>
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ color: '#003781' }}>
                EcoGenAI
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-blue-600 transition" style={{ color: '#666666' }}>About</button>
              <button onClick={() => scrollToSection('tutorial')} className="text-gray-600 hover:text-blue-600 transition" style={{ color: '#666666' }}>How It Works</button>
              <button onClick={() => scrollToSection('news')} className="text-gray-600 hover:text-blue-600 transition" style={{ color: '#666666' }}>News</button>
              <button onClick={() => scrollToSection('regulations')} className="text-gray-600 hover:text-blue-600 transition" style={{ color: '#666666' }}>Regulations</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-blue-600 transition" style={{ color: '#666666' }}>Contact</button>
            </div>

            <Button onClick={() => router.push('/login')} className="text-white" style={{ backgroundColor: '#003781' }}>
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #e6f2f9 0%, #ffffff 50%, #e6f7ed 100%)' }}></div>
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" style={{ backgroundColor: '#003781' }}></div>
          <div className="absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{ backgroundColor: '#22c55e' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" style={{ backgroundColor: '#0066b3' }}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#003781' }}>
              EcoGenAI
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-semibold">
              Monitor, Measure & Reduce
            </p>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your AI Carbon Footprint in Real-Time
            </p>

            {/* Detailed Description */}
            <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              EcoGenAI enables organizations to monitor, measure, and reduce the environmental impact of Generative AI. The platform provides real-time visibility into energy consumption, CO₂ emissions, and AI workload behavior, while offering intelligent insights and optimization strategies to support sustainable, transparent, and responsible use of GenAI technologies.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                onClick={() => router.push('/login')}
                size="lg"
                className="text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                style={{ backgroundColor: '#003781' }}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => scrollToSection('tutorial')}
                size="lg"
                variant="outline"
                className="border-2 px-8 py-6 text-lg rounded-xl hover:bg-blue-50"
                style={{ borderColor: '#003781', color: '#003781' }}
              >
                <Play className="mr-2 h-5 w-5" /> Learn More
              </Button>
            </div>

            {/* Hero Image/Stats */}
            <div className="relative max-w-5xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://www.shutterstock.com/image-photo/ai-helps-manage-carbon-footprint-260nw-2664795231.jpg" 
                  alt="AI Carbon Footprint Management"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">98%</div>
                      <div className="text-sm opacity-90">CO₂ Tracking</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">24/7</div>
                      <div className="text-sm opacity-90">Monitoring</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">50+</div>
                      <div className="text-sm opacity-90">AI Models</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About EcoGenAI</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The world's first comprehensive ESG intelligence platform designed specifically for AI workloads
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://wp.technologyreview.com/wp-content/uploads/2023/11/AI-energyimpact1b.jpg" 
                alt="AI Energy Impact"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e6f2f9' }}>
                  <Target className="h-6 w-6" style={{ color: '#003781' }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600">
                    Empower organizations to build sustainable AI systems by providing real-time visibility into energy consumption and carbon emissions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e6f7ed' }}>
                  <Users className="h-6 w-6" style={{ color: '#22c55e' }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Who We Serve</h3>
                  <p className="text-gray-600">
                    AI companies, data centers, cloud providers, and enterprises committed to reducing their environmental impact.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e6f2f9' }}>
                  <Award className="h-6 w-6" style={{ color: '#0066b3' }} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Impact</h3>
                  <p className="text-gray-600">
                    Helping organizations reduce AI carbon emissions by up to 40% through intelligent monitoring and optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section id="tutorial" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How EcoGenAI Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Four simple steps to sustainable AI operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Connect",
                description: "Integrate with your AI infrastructure in minutes using our simple APIs",
                icon: Zap,
                bgColor: '#e6f2f9',
                iconColor: '#003781'
              },
              {
                step: "02",
                title: "Monitor",
                description: "Track real-time energy consumption and carbon emissions across all AI workloads",
                icon: BarChart3,
                bgColor: '#e6f7ed',
                iconColor: '#22c55e'
              },
              {
                step: "03",
                title: "Analyze",
                description: "Get AI-powered insights and recommendations to optimize your operations",
                icon: TrendingUp,
                bgColor: '#e6f2f9',
                iconColor: '#0066b3'
              },
              {
                step: "04",
                title: "Optimize",
                description: "Implement automated carbon reduction strategies and achieve ESG goals",
                icon: Target,
                bgColor: '#e6f7ed',
                iconColor: '#22c55e'
              }
            ].map((item, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="text-6xl font-bold mb-4" style={{ color: '#f5f5f5' }}>{item.step}</div>
                  <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: item.bgColor }}>
                    <item.icon className="h-6 w-6" style={{ color: item.iconColor }} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Why It's Needed */}
          <div className="mt-20 rounded-3xl p-12 text-white" style={{ background: 'linear-gradient(135deg, #003781 0%, #0066b3 100%)' }}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6">Why EcoGenAI is Essential</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <p className="text-lg">AI training can emit as much CO₂ as 5 cars over their lifetime</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <p className="text-lg">Data centers consume 1% of global electricity and growing rapidly</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <p className="text-lg">ESG compliance is now mandatory for many industries</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                    <p className="text-lg">Investors demand transparency in environmental impact</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu-fWY4haR0FF_zYnFUPpHFAdZFyI8fIYGdw&s" 
                  alt="Climate Impact"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section id="news" className="py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest News & Insights</h2>
            <p className="text-xl text-gray-600">Stay updated on GenAI carbon emissions and sustainability</p>
          </div>

          {/* Horizontal Scrolling News */}
          <div className="relative">
            <div className="flex gap-6 animate-scroll-horizontal pb-8">
              {[
                {
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVFm3EiZtGqLPUokkhB_ApGN3aST6r4KsrPw&s",
                  date: "January 2026",
                  title: "AI Carbon Emissions Reach Record High",
                  excerpt: "New study reveals GenAI models now account for 2.5% of global data center emissions, up 300% from 2023.",
                  source: "Nature Climate Change"
                },
                {
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuf3JeO1sDq9Km-kBpGXpBGTAH4KEdyzxUpA&s",
                  date: "December 2025",
                  title: "OpenAI Commits to Carbon Neutrality",
                  excerpt: "Leading AI company announces ambitious plan to achieve net-zero emissions by 2027 through renewable energy.",
                  source: "TechCrunch"
                },
                {
                  image: "https://wp.technologyreview.com/wp-content/uploads/2023/11/AI-energyimpact1b.jpg",
                  date: "November 2025",
                  title: "EU Mandates AI Sustainability Reporting",
                  excerpt: "New regulations require all AI companies to disclose energy consumption and carbon footprint data.",
                  source: "Reuters"
                },
                {
                  image: "https://www.shutterstock.com/image-photo/ai-helps-manage-carbon-footprint-260nw-2664795231.jpg",
                  date: "October 2025",
                  title: "Google Achieves 50% Carbon Reduction",
                  excerpt: "Tech giant reports major milestone in reducing AI workload emissions through innovative cooling systems.",
                  source: "Bloomberg"
                },
                {
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu-fWY4haR0FF_zYnFUPpHFAdZFyI8fIYGdw&s",
                  date: "September 2025",
                  title: "Microsoft Invests $10B in Green AI",
                  excerpt: "Major investment announced for sustainable AI infrastructure and renewable energy data centers.",
                  source: "The Verge"
                },
                {
                  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVFm3EiZtGqLPUokkhB_ApGN3aST6r4KsrPw&s",
                  date: "August 2025",
                  title: "AI Energy Consumption Doubles",
                  excerpt: "Research shows AI training and inference now consume more energy than entire countries like Denmark.",
                  source: "MIT Technology Review"
                }
              ].map((news, index) => (
                <Card key={index} className="flex-shrink-0 w-80 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#003781' }}>
                      Latest
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="text-sm font-medium mb-2" style={{ color: '#0066b3' }}>{news.date}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{news.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{news.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">Source: {news.source}</div>
                      <ArrowRight className="h-4 w-4" style={{ color: '#003781' }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* News CTA */}
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              className="border-2 px-6 py-3"
              style={{ borderColor: '#003781', color: '#003781' }}
            >
              View All News <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Regulations Section */}
      <section id="regulations" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Regulations & Compliance</h2>
            <p className="text-xl text-gray-600">Stay ahead of environmental regulations worldwide</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                region: "European Union",
                flag: "🇪🇺",
                title: "EU AI Act & CSRD",
                description: "Corporate Sustainability Reporting Directive requires detailed ESG disclosures including AI carbon footprint.",
                effective: "Effective: January 2024",
                requirements: [
                  "Mandatory carbon emission reporting",
                  "Energy consumption disclosure",
                  "Third-party verification required",
                  "Penalties up to 5% of revenue"
                ]
              },
              {
                region: "United States",
                flag: "🇺🇸",
                title: "SEC Climate Disclosure Rules",
                description: "Securities and Exchange Commission mandates climate-related disclosures for public companies.",
                effective: "Effective: March 2024",
                requirements: [
                  "Scope 1, 2, and 3 emissions reporting",
                  "Climate risk assessment",
                  "Board oversight disclosure",
                  "Annual sustainability reports"
                ]
              },
              {
                region: "United Kingdom",
                flag: "🇬🇧",
                title: "UK Green Finance Strategy",
                description: "Mandatory climate-related financial disclosures aligned with TCFD recommendations.",
                effective: "Effective: April 2024",
                requirements: [
                  "Net-zero transition plans",
                  "Carbon reduction targets",
                  "Quarterly progress reports",
                  "Independent audits"
                ]
              },
              {
                region: "Global",
                flag: "🌍",
                title: "ISO 14064 & GHG Protocol",
                description: "International standards for greenhouse gas accounting and verification.",
                effective: "Ongoing Compliance",
                requirements: [
                  "Standardized measurement methods",
                  "Third-party verification",
                  "Annual carbon inventory",
                  "Continuous monitoring"
                ]
              }
            ].map((reg, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{reg.flag}</span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{reg.region}</h3>
                      <p className="text-sm text-blue-600 font-medium">{reg.effective}</p>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{reg.title}</h4>
                  <p className="text-gray-600 mb-6">{reg.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Key Requirements:</p>
                    {reg.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">{req}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Compliance CTA */}
          <div className="mt-12 text-center rounded-2xl p-8" style={{ backgroundColor: '#e6f2f9' }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ensure Compliance with EcoGenAI</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Our platform automatically generates compliance-ready reports for all major regulations
            </p>
            <Button 
              onClick={() => router.push('/login')}
              size="lg"
              className="text-white"
              style={{ backgroundColor: '#003781' }}
            >
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Ready to make your AI sustainable? Let's talk.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Company</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your needs..."
                    />
                  </div>
                  <Button className="w-full text-white py-6" style={{ background: 'linear-gradient(135deg, #003781 0%, #0066b3 100%)' }}>
                    Send Message <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e6f2f9' }}>
                      <Mail className="h-6 w-6" style={{ color: '#003781' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600">contact@ecogenai.com</p>
                      <p className="text-gray-600">support@ecogenai.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e6f7ed' }}>
                      <Phone className="h-6 w-6" style={{ color: '#22c55e' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">+44 20 7123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e6f2f9' }}>
                      <MapPin className="h-6 w-6" style={{ color: '#0066b3' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Headquarters</p>
                      <p className="text-gray-600">123 Green Tech Plaza</p>
                      <p className="text-gray-600">San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgd4g1jDuWmwoc86HhYnFnW9pJE4tJoy0IQw&s" 
                  alt="Modern Office Space"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#003781' }}>
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">EcoGenAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Making AI sustainable, one workload at a time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2026 EcoGenAI. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-320px * 3)); }
        }
        .animate-scroll-horizontal {
          animation: scroll-horizontal 30s linear infinite;
        }
        .animate-scroll-horizontal:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
