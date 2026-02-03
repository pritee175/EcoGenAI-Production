"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Cloud, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  Server,
  Key,
  Globe
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // User data
  const [userEmail, setUserEmail] = useState("user@company.com"); // In production, get from auth
  const [organizationName, setOrganizationName] = useState("");
  
  // Cloud selection
  const [selectedProvider, setSelectedProvider] = useState("");
  
  // Credentials
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [regionsToMonitor, setRegionsToMonitor] = useState("");
  
  // Verification result
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    // Check if user has already completed onboarding
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/onboarding/status/${userEmail}`, {
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.onboarding_completed) {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      // Timeout or error - user can proceed with onboarding
      console.warn("Onboarding status check timeout, allowing user to continue");
    }
  };

  const handleWelcomeNext = async () => {
    setLoading(true);
    
    // Update step in background, don't wait
    fetch(`${API_URL}/api/onboarding/step/welcome?user_email=${userEmail}`, {
      method: "POST"
    }).catch(err => console.error('Step update error:', err));
    
    // Move to next step immediately
    setCurrentStep(2);
    setLoading(false);
  };

  const handleCloudSelection = async (provider: string) => {
    setSelectedProvider(provider);
    setLoading(true);
    setError("");
    
    try {
      // MUST wait for cloud selection to be saved before moving to next step
      const response = await fetch(`${API_URL}/api/onboarding/step/cloud-selection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: userEmail,
          provider: provider,
          organization_name: organizationName || undefined
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save cloud selection');
      }
      
      // Only move to next step after successful save
      setCurrentStep(3);
    } catch (err) {
      console.error('Cloud selection error:', err);
      setError("Failed to save cloud selection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = async () => {
    if (!accessKey) {
      setError("Please enter your access key");
      return;
    }
    
    if ((selectedProvider === "aws" || selectedProvider === "azure") && !secretKey) {
      setError("Please enter your secret key");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/api/onboarding/step/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: userEmail,
          access_key: accessKey,
          secret_key: secretKey || undefined,
          regions_to_monitor: regionsToMonitor || undefined
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (data.success) {
        setVerificationResult(data);
        setCurrentStep(4);
      } else {
        setError(data.message || "Verification failed");
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setError("Verification timed out. Please check your credentials and try again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      await fetch(`${API_URL}/api/onboarding/complete?user_email=${userEmail}`, {
        method: "POST"
      });
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to complete onboarding");
      setLoading(false);
    }
  };

  const cloudProviders = [
    {
      id: "aws",
      name: "Amazon Web Services",
      icon: "☁️",
      description: "Monitor EC2 GPU instances and SageMaker workloads"
    },
    {
      id: "azure",
      name: "Microsoft Azure",
      icon: "🔷",
      description: "Track Azure VMs and Machine Learning compute"
    },
    {
      id: "gcp",
      name: "Google Cloud Platform",
      icon: "🌐",
      description: "Monitor Compute Engine and Vertex AI workloads"
    },
    {
      id: "internal",
      name: "Internal Infrastructure",
      icon: "🏢",
      description: "Connect to your on-premise GPU clusters"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? "bg-[#003781] text-white" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-24 h-1 mx-2 ${
                    currentStep > step ? "bg-[#003781]" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Welcome</span>
            <span>Cloud Provider</span>
            <span>Credentials</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <Card className="p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#003781] rounded-full flex items-center justify-center mx-auto mb-6">
                <Cloud className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#003781] mb-4">
                Welcome to EcoGenAI
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Let's get you set up to track the environmental impact of your AI workloads. 
                This will only take a few minutes.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <Shield className="w-8 h-8 text-[#003781] mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Read-Only Access</h3>
                  <p className="text-sm text-gray-600">
                    We only need read permissions to monitor your infrastructure
                  </p>
                </div>
                <div className="p-6 bg-green-50 rounded-lg">
                  <Server className="w-8 h-8 text-[#003781] mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Continuous Monitoring</h3>
                  <p className="text-sm text-gray-600">
                    Tracking continues even when you're offline
                  </p>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg">
                  <Globe className="w-8 h-8 text-[#003781] mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Multi-Cloud Support</h3>
                  <p className="text-sm text-gray-600">
                    Works with AWS, Azure, GCP, and internal infrastructure
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="org-name" className="text-left block mb-2">
                  Organization Name (Optional)
                </Label>
                <Input
                  id="org-name"
                  placeholder="Acme Corporation"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="max-w-md mx-auto"
                />
              </div>

              <Button
                onClick={handleWelcomeNext}
                disabled={loading}
                className="bg-[#003781] hover:bg-[#002557] text-white px-8 py-6 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Cloud Provider Selection */}
        {currentStep === 2 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-[#003781] mb-2">
              Where is your AI running?
            </h2>
            <p className="text-gray-600 mb-6">
              Select your cloud provider or infrastructure type
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {cloudProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleCloudSelection(provider.id)}
                  disabled={loading}
                  className={`p-6 border-2 rounded-lg text-left transition-all hover:border-[#003781] hover:shadow-lg ${
                    selectedProvider === provider.id
                      ? "border-[#003781] bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-4xl mb-3">{provider.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{provider.name}</h3>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </button>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </Card>
        )}

        {/* Step 3: Credentials */}
        {currentStep === 3 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-[#003781] mb-2">
              Connect Your {selectedProvider.toUpperCase()} Account
            </h2>
            <p className="text-gray-600 mb-6">
              EcoGenAI only needs <strong>read-only access</strong> to cloud metadata. 
              We never access your AI prompts, customer data, or model weights.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#003781] mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#003781] mb-1">What We Monitor:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ GPU instance types and counts</li>
                    <li>✓ Workload start/stop times</li>
                    <li>✓ Cloud regions and availability zones</li>
                    <li>✓ Resource utilization metrics</li>
                  </ul>
                  <h4 className="font-semibold text-[#003781] mt-3 mb-1">What We DON'T Access:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✗ AI model prompts or responses</li>
                    <li>✗ Customer data or PII</li>
                    <li>✗ Model weights or training data</li>
                    <li>✗ Application logs or code</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="access-key">
                  {selectedProvider === "gcp" ? "Service Account JSON" : "Access Key / Client ID"}
                </Label>
                {selectedProvider === "gcp" ? (
                  <Textarea
                    id="access-key"
                    placeholder='{"type": "service_account", "project_id": "..."}'
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                ) : (
                  <Input
                    id="access-key"
                    type="text"
                    placeholder={selectedProvider === "aws" ? "AKIAIOSFODNN7EXAMPLE" : "Enter access key"}
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                  />
                )}
              </div>

              {selectedProvider !== "gcp" && (
                <div>
                  <Label htmlFor="secret-key">
                    Secret Key / Client Secret
                  </Label>
                  <Input
                    id="secret-key"
                    type="password"
                    placeholder="Enter secret key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="regions">
                  Regions to Monitor (Optional)
                </Label>
                <Input
                  id="regions"
                  placeholder="us-east-1, eu-west-1, ap-south-1"
                  value={regionsToMonitor}
                  onChange={(e) => setRegionsToMonitor(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave empty to monitor all regions
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg mb-4">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                onClick={handleCredentialsSubmit}
                disabled={loading}
                className="bg-[#003781] hover:bg-[#002557] flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5 mr-2" />
                    Verify & Connect
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && verificationResult && (
          <Card className="p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#003781] mb-4">
                You're All Set!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                EcoGenAI is now monitoring your AI workloads in real-time
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-green-900 mb-3">Connected Account:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{selectedProvider.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account ID:</span>
                    <span className="font-medium font-mono text-xs">
                      {verificationResult.account_details?.account_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">● Connected</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-[#003781] mb-3">What Happens Next:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>EcoGenAI continuously monitors your GPU workloads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Energy and carbon calculations happen automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tracking continues even when you're offline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Dashboard updates in real-time via WebSocket</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleComplete}
                disabled={loading}
                className="bg-[#003781] hover:bg-[#002557] text-white px-8 py-6 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
