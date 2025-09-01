import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Building, 
  Users, 
  Calendar, 
  DollarSign, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  LogOut,
  Home,
  Upload,
  Edit
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
interface Profile {
  role: string;
}

interface Hostel {
  id: string;
  name: string;
  location: string;
  price_per_semester: number;
  rooms_available: number;
  total_rooms: number;
  rating: number;
  is_active: boolean;
}

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  student_id: string;
  check_in_date: string;
  check_out_date: string;
  room_type: string;
  total_amount: number;
  status: string;
  special_requests: string;
  created_at: string;
  hostel_id: string;
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
  });
  const { toast } = useToast();
  
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [contactForm, setContactForm] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  });
  const [uploadForm, setUploadForm] = useState({
    price_per_semester: '',
    price_per_month: '',
    rooms_available: '',
    total_rooms: '',
    location: '',
    detailed_address: '',
    distance_from_campus: '',
    amenities: '',
    description: '',
  });
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Check if user is hostel owner
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileError || profileData?.role !== 'hostel_owner') {
          setLoading(false);
          return;
        }

        setProfile(profileData);

        // Get hostel owner's profile ID
        const { data: ownerProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!ownerProfile) return;

        // Fetch hostels owned by this user
        const { data: hostelsData, error: hostelsError } = await supabase
          .from('hostels')
          .select('*')
          .eq('owner_id', ownerProfile.id);

        if (hostelsError) {
          toast({
            title: "Error fetching hostels",
            description: hostelsError.message,
            variant: "destructive",
          });
        } else {
          setHostels(hostelsData || []);
        }

        // Fetch bookings for these hostels
        if (hostelsData && hostelsData.length > 0) {
          const hostelIds = hostelsData.map(h => h.id);
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select('*')
            .in('hostel_id', hostelIds)
            .order('created_at', { ascending: false });

          if (bookingsError) {
            toast({
              title: "Error fetching bookings",
              description: bookingsError.message,
              variant: "destructive",
            });
          } else {
            setBookings(bookingsData || []);
            
            // Calculate stats
            const total = bookingsData?.length || 0;
            const pending = bookingsData?.filter(b => b.status === 'pending').length || 0;
            const confirmed = bookingsData?.filter(b => b.status === 'confirmed').length || 0;
            const revenue = bookingsData?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
            
            setStats({
              totalBookings: total,
              pendingBookings: pending,
              confirmedBookings: confirmed,
              totalRevenue: revenue,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      toast({
        title: "Error updating booking",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Booking updated",
        description: `Booking status changed to ${newStatus}`,
      });
      
      // Refresh bookings
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      
      // Update stats
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      );
      
      const pending = updatedBookings.filter(b => b.status === 'pending').length;
      const confirmed = updatedBookings.filter(b => b.status === 'confirmed').length;
      
      setStats(prev => ({
        ...prev,
        pendingBookings: pending,
        confirmedBookings: confirmed,
      }));
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const openEditContact = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setContactForm({
      contact_name: (hostel as any).contact_name || '',
      contact_email: (hostel as any).contact_email || '',
      contact_phone: (hostel as any).contact_phone || '',
    });
    setContactDialogOpen(true);
  };

  const openUploadDialog = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setUploadForm({
      price_per_semester: hostel.price_per_semester.toString(),
      price_per_month: ((hostel as any).price_per_month || '').toString(),
      rooms_available: hostel.rooms_available.toString(),
      total_rooms: (hostel.total_rooms || '').toString(),
      location: hostel.location,
      detailed_address: (hostel as any).detailed_address || '',
      distance_from_campus: (hostel as any).distance_from_campus || '',
      amenities: ((hostel as any).amenities || []).join(', '),
      description: (hostel as any).description || '',
    });
    setUploadDialogOpen(true);
  };

  const saveContactDetails = async () => {
    if (!selectedHostel) return;
    const { error } = await supabase
      .from('hostels')
      .update({
        contact_name: contactForm.contact_name,
        contact_email: contactForm.contact_email,
        contact_phone: contactForm.contact_phone,
      })
      .eq('id', selectedHostel.id);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      return;
    }

    // Update local state
    setHostels(prev => prev.map(h => h.id === selectedHostel.id ? { ...h, ...(contactForm as any) } : h));
    toast({ title: 'Contact updated', description: 'Hostel contact details have been saved.' });
    setContactDialogOpen(false);
  };

  const saveHostelUpdates = async () => {
    if (!selectedHostel) return;

    try {
      // Handle file uploads if any
      let imageUrls: string[] = [];
      if (uploadFiles && uploadFiles.length > 0) {
        for (let i = 0; i < uploadFiles.length; i++) {
          const file = uploadFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${selectedHostel.id}-${Date.now()}-${i}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('hostel-images')
            .upload(fileName, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('hostel-images')
            .getPublicUrl(fileName);
          
          imageUrls.push(publicUrl);
        }
      }

      // Prepare update data
      const updateData: any = {
        price_per_semester: parseFloat(uploadForm.price_per_semester),
        rooms_available: parseInt(uploadForm.rooms_available),
        location: uploadForm.location,
        description: uploadForm.description,
      };

      if (uploadForm.price_per_month) {
        updateData.price_per_month = parseFloat(uploadForm.price_per_month);
      }
      if (uploadForm.total_rooms) {
        updateData.total_rooms = parseInt(uploadForm.total_rooms);
      }
      if (uploadForm.detailed_address) {
        updateData.detailed_address = uploadForm.detailed_address;
      }
      if (uploadForm.distance_from_campus) {
        updateData.distance_from_campus = uploadForm.distance_from_campus;
      }
      if (uploadForm.amenities) {
        updateData.amenities = uploadForm.amenities.split(',').map(a => a.trim()).filter(a => a);
      }
      if (imageUrls.length > 0) {
        // Get existing images and append new ones
        const existingImages = (selectedHostel as any).images || [];
        updateData.images = [...existingImages, ...imageUrls];
      }

      const { error } = await supabase
        .from('hostels')
        .update(updateData)
        .eq('id', selectedHostel.id);

      if (error) {
        throw error;
      }

      // Update local state
      setHostels(prev => prev.map(h => h.id === selectedHostel.id ? { ...h, ...updateData } : h));
      toast({ title: 'Hostel updated', description: 'Your hostel information has been updated successfully.' });
      setUploadDialogOpen(false);
      setUploadFiles(null);
    } catch (error: any) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    }
  };

  if (!user) {
    return <Navigate to="/admin/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'hostel_owner') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be a hostel owner to access this dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, color: 'text-yellow-600' },
      confirmed: { variant: 'default' as const, color: 'text-green-600' },
      cancelled: { variant: 'destructive' as const, color: 'text-red-600' },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Hostel Management Portal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="hostels">My Hostels</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Manage your hostel bookings and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground">Bookings will appear here when students book your hostels.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Check-in Date</TableHead>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.full_name}</div>
                              <div className="text-sm text-muted-foreground">{booking.student_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{booking.email}</div>
                              <div className="text-sm text-muted-foreground">{booking.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
                          <TableCell>{booking.room_type || 'Standard'}</TableCell>
                          <TableCell>₵{booking.total_amount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadge(booking.status).variant}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {booking.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hostels">
            <Card>
              <CardHeader>
                <CardTitle>My Hostels</CardTitle>
                <CardDescription>Overview of your hostel listings</CardDescription>
              </CardHeader>
              <CardContent>
                {hostels.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No hostels listed</h3>
                    <p className="text-muted-foreground">Create your first hostel listing to start accepting bookings.</p>
                    <Button className="mt-4">
                      Add Hostel
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hostels.map((hostel) => (
                      <Card key={hostel.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{hostel.name}</CardTitle>
                            <Badge variant={hostel.is_active ? 'default' : 'secondary'}>
                              {hostel.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <CardDescription>{hostel.location}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Price per semester:</span>
                              <span className="font-medium">₵{hostel.price_per_semester.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Available rooms:</span>
                              <span className="font-medium">{hostel.rooms_available}/{hostel.total_rooms}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Rating:</span>
                              <span className="font-medium flex items-center">
                                {hostel.rating}/5 ⭐
                              </span>
                            </div>
                          </div>
                          <Button className="w-full mt-4" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <div className="flex gap-2 mt-2">
                            <Button className="flex-1" variant="secondary" onClick={() => openEditContact(hostel)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Contact
                            </Button>
                            <Button className="flex-1" onClick={() => openUploadDialog(hostel)}>
                              <Upload className="h-4 w-4 mr-2" />
                              Update Info
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>

          <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Hostel Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact Name</Label>
                  <Input id="contact_name" value={contactForm.contact_name}
                    onChange={(e) => setContactForm({ ...contactForm, contact_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input id="contact_email" type="email" value={contactForm.contact_email}
                    onChange={(e) => setContactForm({ ...contactForm, contact_email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input id="contact_phone" value={contactForm.contact_phone}
                    onChange={(e) => setContactForm({ ...contactForm, contact_phone: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setContactDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveContactDetails}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Update Hostel Information</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_per_semester">Price per Semester (₵)</Label>
                    <Input 
                      id="price_per_semester" 
                      type="number" 
                      value={uploadForm.price_per_semester}
                      onChange={(e) => setUploadForm({ ...uploadForm, price_per_semester: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_per_month">Price per Month (₵)</Label>
                    <Input 
                      id="price_per_month" 
                      type="number" 
                      value={uploadForm.price_per_month}
                      onChange={(e) => setUploadForm({ ...uploadForm, price_per_month: e.target.value })} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rooms_available">Available Rooms</Label>
                    <Input 
                      id="rooms_available" 
                      type="number" 
                      value={uploadForm.rooms_available}
                      onChange={(e) => setUploadForm({ ...uploadForm, rooms_available: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total_rooms">Total Rooms</Label>
                    <Input 
                      id="total_rooms" 
                      type="number" 
                      value={uploadForm.total_rooms}
                      onChange={(e) => setUploadForm({ ...uploadForm, total_rooms: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={uploadForm.location}
                    onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailed_address">Detailed Address</Label>
                  <Input 
                    id="detailed_address" 
                    value={uploadForm.detailed_address}
                    onChange={(e) => setUploadForm({ ...uploadForm, detailed_address: e.target.value })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distance_from_campus">Distance from Campus</Label>
                  <Input 
                    id="distance_from_campus" 
                    placeholder="e.g., 1.2km from campus"
                    value={uploadForm.distance_from_campus}
                    onChange={(e) => setUploadForm({ ...uploadForm, distance_from_campus: e.target.value })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Input 
                    id="amenities" 
                    placeholder="WiFi, AC, Security, Kitchen, etc."
                    value={uploadForm.amenities}
                    onChange={(e) => setUploadForm({ ...uploadForm, amenities: e.target.value })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    rows={4}
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="images">Upload New Images</Label>
                  <Input 
                    id="images" 
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setUploadFiles(e.target.files)} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Select multiple images to add to your hostel gallery
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveHostelUpdates}>Update Hostel</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
}
