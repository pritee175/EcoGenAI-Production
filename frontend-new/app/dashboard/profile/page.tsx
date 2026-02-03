"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Users, 
  Globe,
  Bell,
  Save,
  Loader2,
  CheckCircle2,
  Camera
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface UserProfile {
  id: number;
  email: string;
  full_name: string | null;
  job_title: string | null;
  department: string | null;
  phone_number: string | null;
  organization_name: string | null;
  organization_size: string | null;
  industry: string | null;
  avatar_url: string | null;
  language_preference: string;
  timezone: string;
  notification_email: boolean;
  notification_dashboard: boolean;
  bio: string | null;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationSize, setOrganizationSize] = useState("");
  const [industry, setIndustry] = useState("");
  const [bio, setBio] = useState("");
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [notificationDashboard, setNotificationDashboard] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Get email from auth context (preferred) or localStorage (fallback)
      const userEmail = user?.email || localStorage.getItem('userEmail');
      
      if (!userEmail) {
        setError("No user email found. Please log in again.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/profile/${userEmail}`);
      
      if (response.status === 404) {
        // Profile doesn't exist, create it
        await createProfile(userEmail);
        return;
      }

      const data = await response.json();
      setProfile(data);
      
      // Populate form fields
      setFullName(data.full_name || "");
      setJobTitle(data.job_title || "");
      setDepartment(data.department || "");
      setPhoneNumber(data.phone_number || "");
      setOrganizationName(data.organization_name || "");
      setOrganizationSize(data.organization_size || "");
      setIndustry(data.industry || "");
      setBio(data.bio || "");
      setNotificationEmail(data.notification_email);
      setNotificationDashboard(data.notification_dashboard);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError("Failed to load profile");
      setIsLoading(false);
    }
  };

  const createProfile = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/api/profile/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setProfile(data.profile);
      setIsLoading(false);
    } catch (err) {
      console.error('Error creating profile:', err);
      setError("Failed to create profile");
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/profile/${profile.email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          job_title: jobTitle,
          department: department,
          phone_number: phoneNumber,
          organization_name: organizationName,
          organization_size: organizationSize,
          industry: industry,
          bio: bio,
          notification_email: notificationEmail,
          notification_dashboard: notificationDashboard
        })
      });

      const data = await response.json();
      setProfile(data.profile);
      setSaveSuccess(true);
      
      // Refresh profile in auth context to update header
      await refreshProfile();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#003781]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>

      {/* Success Alert */}
      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Profile updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Profile Picture */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#003781] to-[#0066b3] rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <Button variant="outline" className="mb-2">
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  className="pl-10 bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Sustainability Manager"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="ESG & Compliance"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Organization Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Organization Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="organizationName"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Allianz SE"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationSize">Organization Size</Label>
              <select
                id="organizationSize"
                value={organizationSize}
                onChange={(e) => setOrganizationSize(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
              >
                <option value="">Select size</option>
                <option value="Small">Small (1-50 employees)</option>
                <option value="Medium">Medium (51-500 employees)</option>
                <option value="Large">Large (501-5000 employees)</option>
                <option value="Enterprise">Enterprise (5000+ employees)</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="industry">Industry</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Financial Services, Insurance"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself and your role..."
                rows={4}
              />
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates and alerts via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003781]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Dashboard Notifications</p>
                <p className="text-sm text-gray-500">Show real-time alerts in the dashboard</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationDashboard}
                  onChange={(e) => setNotificationDashboard(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003781]"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Account Information */}
        {profile && (
          <Card className="p-6 bg-gray-50">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Account Information</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Account Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(profile.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              {profile.last_login && (
                <div>
                  <p className="text-gray-600">Last Login</p>
                  <p className="font-medium text-gray-900">
                    {new Date(profile.last_login).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={loadProfile}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#003781] hover:bg-[#002557] text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
