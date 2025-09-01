import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, Shield, Building, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function AdminAuth() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Check if user is already an admin and redirect to dashboard
  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleAdminSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Sign in the user
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !authData.user) {
      toast({
        title: "Sign in failed",
        description: signInError?.message || "Failed to sign in",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Check if user has hostel_owner role using the authenticated user's ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError || profile?.role !== 'hostel_owner') {
      // Sign out if not a hostel owner
      await supabase.auth.signOut();
      toast({
        title: "Access denied",
        description: "You must be a hostel owner to access the admin dashboard.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Welcome back!",
      description: "You have successfully signed in to the admin dashboard.",
    });
    
    setLoading(false);
  };

  const handleAdminSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const hostelName = formData.get('hostelName') as string;
    const phone = formData.get('phone') as string;
    const location = formData.get('location') as string;
    
    const redirectUrl = `${window.location.origin}/admin/dashboard`;
    
    // Build metadata for the trigger function (only non-empty values)
    const metadata: Record<string, string> = {};
    if (fullName?.trim()) metadata.full_name = fullName.trim();
    if (phone?.trim()) metadata.phone = phone.trim();
    if (hostelName?.trim()) metadata.hostel_name = hostelName.trim();
    if (location?.trim()) metadata.hostel_location = location.trim();
    metadata.role = 'hostel_owner';
    
    try {
      console.log('Starting signup process with metadata:', metadata);
      
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata,
        },
      });
      
      if (signUpError) {
        console.error('Signup error:', signUpError);
        toast({
          title: "Sign up failed",
          description: signUpError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log('Signup successful:', authData);
      
      // Check if user was created successfully
      if (authData.user) {
        toast({
          title: "Hostel registration successful!",
          description: "Please check your email to verify your account. Once verified, you can access your admin dashboard.",
        });
      } else {
        toast({
          title: "Registration in progress",
          description: "Please check your email for verification instructions.",
        });
      }
    } catch (error) {
      console.error('Network error during signup:', error);
      toast({
        title: "Network error",
        description: "Failed to connect to the server. Please check your internet connection and try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center space-x-2 mb-8">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">Admin Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Hostel Owner Access</h1>
            <p className="text-muted-foreground">Manage your hostel listings and bookings</p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Admin Sign In</TabsTrigger>
              <TabsTrigger value="signup">Register Hostel</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Sign In</CardTitle>
                  <CardDescription>Access your hostel management dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-signin-email">Email</Label>
                      <Input
                        id="admin-signin-email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="admin-signin-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Register Your Hostel</CardTitle>
                  <CardDescription>Create an admin account to list and manage your hostel on UniLodge.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-fullname">Full Name</Label>
                      <Input
                        id="admin-signup-fullname"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-hostel">Hostel Name</Label>
                      <Input
                        id="admin-signup-hostel"
                        name="hostelName"
                        type="text"
                        placeholder="Enter your hostel name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-phone">Phone Number</Label>
                      <Input
                        id="admin-signup-phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-location">Hostel Location</Label>
                      <Input
                        id="admin-signup-location"
                        name="location"
                        type="text"
                        placeholder="Enter hostel location"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-email">Email</Label>
                      <Input
                        id="admin-signup-email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="admin-signup-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating account...' : 'Create Admin Account'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center">
              <Building className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Manage Listings</p>
            </div>
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Handle Bookings</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Secure Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Admin Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-primary relative">
        <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center text-primary-foreground p-12">
          <div className="text-center max-w-md">
            <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Manage Your Hostel Business</h2>
            <p className="text-xl opacity-90">
              Join the UniLodge platform as a hostel owner. Manage your listings, 
              handle bookings, and grow your student accommodation business.
            </p>
            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5" />
                <span>Create and manage hostel listings</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                <span>Handle student bookings efficiently</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5" />
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}