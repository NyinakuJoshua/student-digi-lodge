# UniLodge - Student Hostel Booking Platform
**Complete System Documentation**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [Authentication & Security](#5-authentication--security)
6. [Core Features](#6-core-features)
7. [User Workflows](#7-user-workflows)
8. [Installation Guide](#8-installation-guide)
9. [API Reference](#9-api-reference)
10. [Component Documentation](#10-component-documentation)
11. [Design System](#11-design-system)
12. [Security Implementation](#12-security-implementation)
13. [Deployment Guide](#13-deployment-guide)
14. [Troubleshooting](#14-troubleshooting)
15. [Future Development](#15-future-development)

---

## 1. Project Overview

### 1.1 Introduction
UniLodge is a comprehensive digital platform designed specifically for AAMUSTED (Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development) students to discover, evaluate, and book student accommodation. The platform serves as a bridge between students seeking quality housing and verified hostel owners providing accommodation services.

### 1.2 Mission Statement
To revolutionize student accommodation booking by providing a secure, user-friendly, and efficient platform that connects AAMUSTED students with verified hostel providers, ensuring safe and comfortable living arrangements throughout their academic journey.

### 1.3 Key Objectives
- **Simplify Discovery**: Streamline the process of finding suitable student accommodation
- **Ensure Quality**: Provide verified and quality-assured hostel listings
- **Enable Communication**: Facilitate direct communication between students and hostel owners
- **Secure Transactions**: Implement robust security measures for all transactions
- **Build Community**: Create a trusted ecosystem for student accommodation

### 1.4 Target Audience

#### Primary Users
- **Students**: AAMUSTED undergraduate and graduate students seeking accommodation
- **Hostel Owners**: Property owners and managers offering student housing
- **University Administration**: Academic staff overseeing student welfare

#### Secondary Users
- **Parents**: Guardian involvement in accommodation decisions
- **Real Estate Agents**: Property management companies
- **Local Businesses**: Service providers in the accommodation ecosystem

### 1.5 Platform Benefits

#### For Students
- Comprehensive hostel database with verified listings
- Advanced search and filtering capabilities
- Real-time availability tracking
- Direct communication with hostel owners
- Secure booking process
- Student reviews and ratings system

#### For Hostel Owners
- Professional listing management tools
- Booking request management system
- Direct student communication channels
- Analytics and reporting dashboard
- Revenue tracking capabilities
- Marketing exposure to target audience

---

## 2. Technology Stack

### 2.1 Frontend Technologies

#### Core Framework
- **React 18.3.1**: Modern JavaScript library for building user interfaces
  - Hooks-based architecture for state management
  - Component-based development approach
  - Virtual DOM for optimal performance

#### Language & Build Tools
- **TypeScript**: Strongly typed JavaScript for better development experience
- **Vite**: Next-generation frontend build tool
  - Fast development server with Hot Module Replacement (HMR)
  - Optimized production builds
  - Plugin-based architecture

#### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
  - Responsive design capabilities
  - Custom design system implementation
  - Dark mode support
- **shadcn/ui**: High-quality React component library
  - Accessible components following WAI-ARIA guidelines
  - Customizable design system
  - Modern UI patterns

#### Routing & Navigation
- **React Router DOM 6.26.2**: Declarative routing for React
  - Nested routing capabilities
  - Dynamic route matching
  - Protected route implementation

#### Form Management
- **React Hook Form 7.53.0**: Performant forms with easy validation
- **Zod 3.23.8**: TypeScript-first schema validation
- **@hookform/resolvers**: Integration layer for form validation

#### State Management & Data Fetching
- **TanStack Query 5.56.2**: Powerful data synchronization for React
  - Caching and background updates
  - Optimistic updates
  - Error handling and retry logic

#### Icons & Assets
- **Lucide React 0.462.0**: Beautiful & consistent icon library
- **Custom Assets**: University-specific imagery and branding

### 2.2 Backend Technologies

#### Database & Backend Services
- **Supabase**: Open-source Firebase alternative
  - PostgreSQL database with real-time capabilities
  - Built-in authentication system
  - Row Level Security (RLS) implementation
  - Edge Functions for serverless computing

#### Authentication
- **Supabase Auth**: Complete authentication solution
  - Email/password authentication
  - Session management
  - Role-based access control
  - Email verification system

#### File Storage
- **Supabase Storage**: Scalable file storage solution
  - Image upload and management
  - CDN integration for fast delivery
  - Access control policies

### 2.3 Development Tools

#### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking

#### Version Control
- **Git**: Distributed version control system
- **GitHub**: Repository hosting and collaboration

#### Package Management
- **npm**: Node.js package manager
- **Package.json**: Dependency management

---

## 3. System Architecture

### 3.1 High-Level Architecture

The UniLodge platform follows a modern client-server architecture with the following key components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │   Supabase      │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   Backend       │◄──►│   Database      │
│                 │    │   Services      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │   Edge          │    │   File Storage  │
│   (PWA Ready)   │    │   Functions     │    │   (Images)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 3.2 Component Architecture

#### Frontend Layer
- **Presentation Components**: UI components for user interaction
- **Container Components**: Business logic and state management
- **Service Layer**: API calls and data transformation
- **Routing Layer**: Navigation and route protection

#### Backend Layer
- **API Gateway**: Request routing and authentication
- **Business Logic**: Core application functionality
- **Data Access Layer**: Database queries and mutations
- **Authentication Service**: User management and authorization

### 3.3 Data Flow

#### User Authentication Flow
1. User submits credentials through React form
2. Supabase Auth validates credentials
3. JWT token issued for authenticated sessions
4. Token stored securely in browser
5. Subsequent requests include authentication headers

#### Booking Process Flow
1. Student browses available hostels
2. Hostel details fetched from database
3. Booking form submitted with student information
4. Booking record created in database
5. Hostel owner receives notification
6. Status updates propagated to student

### 3.4 Security Architecture

#### Authentication Security
- JWT-based session management
- Secure token storage in browser
- Automatic token refresh mechanism
- Role-based access control

#### Database Security
- Row Level Security (RLS) policies
- Encrypted data transmission
- Input validation and sanitization
- SQL injection prevention

#### Application Security
- HTTPS enforcement
- Content Security Policy headers
- XSS protection measures
- CSRF token validation

---

## 4. Database Design

### 4.1 Database Schema Overview

The UniLodge database is built on PostgreSQL and consists of six main tables with well-defined relationships and constraints.

#### Entity Relationship Diagram
```
Users (Auth) ──┐
               │
               ▼
           Profiles ──┐
               │      │
               ▼      ▼
           Hostels   Bookings
               │      │
               ▼      ▼
           Reviews   Favorites
```

### 4.2 Table Specifications

#### 4.2.1 Profiles Table
**Purpose**: Stores user profile information for both students and hostel owners

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique profile identifier |
| user_id | UUID | NOT NULL, REFERENCES auth.users(id) | Link to Supabase auth user |
| full_name | TEXT | - | User's full name |
| email | TEXT | - | Email address |
| phone | TEXT | - | Contact phone number |
| student_id | TEXT | - | University student ID |
| university | TEXT | DEFAULT 'AAMUSTED' | University affiliation |
| role | TEXT | DEFAULT 'user', CHECK (role IN ('user', 'hostel_owner')) | User role |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- Primary key index on `id`
- Unique index on `user_id`
- Index on `role` for role-based queries

#### 4.2.2 Hostels Table
**Purpose**: Contains comprehensive hostel listing information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique hostel identifier |
| owner_id | UUID | REFERENCES profiles(id) | Profile of hostel owner |
| name | TEXT | NOT NULL | Hostel name |
| location | TEXT | NOT NULL | General location |
| detailed_address | TEXT | - | Specific address |
| description | TEXT | - | Detailed description |
| price_per_semester | NUMERIC | NOT NULL | Semester pricing |
| price_per_month | NUMERIC | - | Monthly pricing |
| total_rooms | INTEGER | DEFAULT 0 | Total available rooms |
| rooms_available | INTEGER | DEFAULT 0 | Currently available rooms |
| amenities | TEXT[] | DEFAULT '{}' | List of available amenities |
| images | TEXT[] | DEFAULT '{}' | Image URLs |
| rating | NUMERIC | DEFAULT 0 | Average rating |
| total_reviews | INTEGER | DEFAULT 0 | Total number of reviews |
| distance_from_campus | TEXT | - | Distance to university |
| contact_name | TEXT | - | Contact person name |
| contact_phone | TEXT | - | Contact phone number |
| contact_email | TEXT | - | Contact email |
| contact_whatsapp | TEXT | - | WhatsApp number |
| is_active | BOOLEAN | DEFAULT true | Listing status |
| is_verified | BOOLEAN | DEFAULT false | Verification status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes**:
- Primary key index on `id`
- Index on `owner_id` for owner queries
- Index on `is_active` for filtering
- Composite index on `(is_active, rating)` for sorting

#### 4.2.3 Bookings Table
**Purpose**: Tracks all booking requests and their lifecycle

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique booking identifier |
| user_id | UUID | NOT NULL, REFERENCES profiles(id) | Student profile |
| hostel_id | UUID | NOT NULL, REFERENCES hostels(id) | Target hostel |
| full_name | TEXT | NOT NULL | Student's full name |
| email | TEXT | NOT NULL | Contact email |
| phone | TEXT | NOT NULL | Contact phone |
| student_id | TEXT | - | University student ID |
| check_in_date | DATE | NOT NULL | Preferred check-in date |
| check_out_date | DATE | - | Expected check-out date |
| room_type | TEXT | - | Preferred room type |
| total_amount | NUMERIC | - | Total booking amount |
| status | TEXT | DEFAULT 'pending', CHECK (status IN ('pending', 'confirmed', 'cancelled')) | Booking status |
| special_requests | TEXT | - | Additional requirements |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Booking creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last status update |

**Indexes**:
- Primary key index on `id`
- Index on `user_id` for student queries
- Index on `hostel_id` for owner queries
- Index on `status` for filtering
- Composite index on `(hostel_id, status)` for owner dashboard

#### 4.2.4 Favorites Table
**Purpose**: Stores student's favorite hostel selections

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique favorite identifier |
| user_id | UUID | NOT NULL, REFERENCES profiles(id) | Student profile |
| hostel_id | UUID | NOT NULL, REFERENCES hostels(id) | Favorited hostel |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | When favorited |

**Constraints**:
- Unique constraint on `(user_id, hostel_id)` to prevent duplicates

#### 4.2.5 Reviews Table
**Purpose**: Student reviews and ratings for hostels

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique review identifier |
| user_id | UUID | NOT NULL, REFERENCES profiles(id) | Reviewer profile |
| hostel_id | UUID | NOT NULL, REFERENCES hostels(id) | Reviewed hostel |
| rating | INTEGER | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | Star rating |
| comment | TEXT | - | Review text |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Review creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

### 4.3 Database Functions

#### 4.3.1 User Profile Creation Function
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Create a profile for the new user
  INSERT INTO public.profiles (user_id, full_name, email, role, phone)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'phone'
  );
  
  -- If this is a hostel owner, create a hostel entry
  IF NEW.raw_user_meta_data->>'role' = 'hostel_owner' THEN
    INSERT INTO public.hostels (
      owner_id, 
      name, 
      location,
      description,
      price_per_semester,
      contact_name,
      contact_email,
      contact_phone
    ) VALUES (
      (SELECT id FROM public.profiles WHERE user_id = NEW.id),
      NEW.raw_user_meta_data->>'hostel_name',
      NEW.raw_user_meta_data->>'hostel_location',
      'Welcome to ' || NEW.raw_user_meta_data->>'hostel_name' || '! Please update this description.',
      1000, -- Default price, owner can update
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'phone'
    );
  END IF;
  
  RETURN NEW;
END;
$function$
```

#### 4.3.2 Timestamp Update Function
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
```

### 4.4 Database Triggers

#### 4.4.1 New User Trigger
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### 4.4.2 Update Timestamp Triggers
```sql
-- Profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Hostels table
CREATE TRIGGER update_hostels_updated_at
  BEFORE UPDATE ON public.hostels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bookings table
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reviews table
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 5. Authentication & Security

### 5.1 Authentication System

#### 5.1.1 User Types and Roles
The platform supports two distinct user types:

**Students (role: 'user')**
- Browse and search hostels
- Create booking requests
- Manage favorites
- Leave reviews and ratings
- Update personal profile

**Hostel Owners (role: 'hostel_owner')**
- Manage hostel listings
- Process booking requests
- Update contact information
- View analytics and reports
- Communicate with students

#### 5.1.2 Registration Process

**Student Registration Flow**
1. Navigate to `/auth` page
2. Complete registration form with basic information
3. Email verification (optional but recommended)
4. Automatic profile creation with 'user' role
5. Redirect to homepage for browsing

**Hostel Owner Registration Flow**
1. Navigate to `/admin/auth` page
2. Complete detailed registration form including:
   - Personal information
   - Hostel details
   - Contact information
   - Location data
3. Email verification required
4. Automatic profile and hostel record creation
5. Role assignment as 'hostel_owner'
6. Redirect to admin dashboard

#### 5.1.3 Authentication Implementation

**Frontend Authentication Hook (useAuth)**
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);
}
```

### 5.2 Security Implementation

#### 5.2.1 Row Level Security (RLS) Policies

**Profiles Table Policies**
```sql
-- Users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);
```

**Hostels Table Policies**
```sql
-- Anyone can view active hostels
CREATE POLICY "Hostels are viewable by everyone" 
ON public.hostels 
FOR SELECT 
USING (is_active = true);

-- Authenticated users can create hostels
CREATE POLICY "Authenticated users can create hostels" 
ON public.hostels 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = owner_id));

-- Hostel owners can update their hostels
CREATE POLICY "Hostel owners can update their hostels" 
ON public.hostels 
FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = owner_id));
```

**Bookings Table Policies**
```sql
-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Users can create their own bookings
CREATE POLICY "Users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Users can update their own bookings
CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Hostel owners can view bookings for their hostels
CREATE POLICY "Hostel owners can view bookings for their hostels" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = (SELECT profiles.user_id FROM profiles 
                     JOIN hostels ON profiles.id = hostels.owner_id 
                     WHERE hostels.id = hostel_id));

-- Hostel owners can update booking status for their hostels
CREATE POLICY "Hostel owners can update booking status for their hostels" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = (SELECT profiles.user_id FROM profiles 
                     JOIN hostels ON profiles.id = hostels.owner_id 
                     WHERE hostels.id = hostel_id));
```

#### 5.2.2 Data Validation

**Client-Side Validation**
```typescript
// Booking form validation schema
const bookingSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  student_id: z.string().optional(),
  check_in_date: z.string().min(1, "Check-in date is required"),
  check_out_date: z.string().optional(),
  room_type: z.string().optional(),
  special_requests: z.string().optional(),
});
```

**Database Constraints**
```sql
-- Booking status validation
ALTER TABLE bookings ADD CONSTRAINT valid_status 
CHECK (status IN ('pending', 'confirmed', 'cancelled'));

-- Rating validation
ALTER TABLE reviews ADD CONSTRAINT valid_rating 
CHECK (rating >= 1 AND rating <= 5);

-- Role validation
ALTER TABLE profiles ADD CONSTRAINT valid_role 
CHECK (role IN ('user', 'hostel_owner'));
```

### 5.3 Session Management

#### 5.3.1 Token Handling
- **JWT Tokens**: Secure session tokens issued by Supabase Auth
- **Automatic Refresh**: Tokens automatically refreshed before expiration
- **Secure Storage**: Tokens stored in localStorage with appropriate security measures
- **Session Persistence**: Sessions persist across browser sessions

#### 5.3.2 Route Protection
```typescript
// Protected route component
function ProtectedRoute({ children, requireRole }: { 
  children: React.ReactNode; 
  requireRole?: string; 
}) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" />;
  
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <>{children}</>;
}
```

---

## 6. Core Features

### 6.1 Student Features

#### 6.1.1 Hostel Discovery & Search

**Advanced Search Capabilities**
- **Text Search**: Search by hostel name, location, or description
- **Filter Options**: 
  - Price range (₵500-₵1000, ₵1000-₵1500, ₵1500+)
  - Amenities (WiFi, AC, Kitchen, Laundry, etc.)
  - Distance from campus
  - Room availability
- **Real-time Results**: Instant search results with debounced queries
- **Pagination**: Load more results with infinite scroll
- **Sorting Options**: By price, rating, distance, availability

**Search Implementation**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [priceRange, setPriceRange] = useState('');
const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);

useEffect(() => {
  let filtered = hostels;

  // Apply search query filter
  if (searchQuery) {
    filtered = filtered.filter(hostel => 
      hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hostel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hostel.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hostel.amenities.some((amenity: string) => 
        amenity.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  // Apply price range filter
  if (priceRange) {
    filtered = filtered.filter(hostel => {
      const price = hostel.price_per_semester;
      switch (priceRange) {
        case '₵500 - ₵1000': return price >= 500 && price <= 1000;
        case '₵1000 - ₵1500': return price >= 1000 && price <= 1500;
        case '₵1500+': return price >= 1500;
        default: return true;
      }
    });
  }

  setFilteredHostels(filtered);
}, [searchQuery, priceRange, hostels]);
```

#### 6.1.2 Hostel Details & Gallery

**Comprehensive Information Display**
- **Overview Tab**: Basic information, pricing, location, description
- **Gallery Tab**: Multiple high-quality images of the property
- **Amenities Tab**: Complete list of available facilities with icons
- **Location Tab**: Address details with integrated Google Maps
- **Contact Tab**: Multiple contact methods (phone, email, WhatsApp)

**Interactive Features**
- **Image Gallery**: Full-screen image viewer with navigation
- **Virtual Tour**: 360-degree room views (future enhancement)
- **Amenity Icons**: Visual representation of available facilities
- **Map Integration**: Interactive location display
- **Favorite Button**: Save hostels for later reference

#### 6.1.3 Booking System

**Streamlined Booking Process**
1. **Hostel Selection**: Choose preferred accommodation
2. **Form Completion**: Provide necessary personal and academic information
3. **Request Submission**: Send booking request to hostel owner
4. **Status Tracking**: Monitor request progress
5. **Communication**: Direct contact with hostel owner

**Booking Form Fields**
- Personal Information: Full name, email, phone
- Academic Details: Student ID, university affiliation
- Accommodation Preferences: Check-in date, room type, duration
- Special Requirements: Additional requests or needs

**Booking Form Implementation**
```typescript
const bookingSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  student_id: z.string().optional(),
  check_in_date: z.string().min(1, "Check-in date is required"),
  check_out_date: z.string().optional(),
  room_type: z.string().optional(),
  special_requests: z.string().optional(),
});

const onSubmit = async (data: BookingFormData) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const bookingData = {
    user_id: profile.id,
    hostel_id: hostel.id,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    student_id: data.student_id || null,
    check_in_date: data.check_in_date,
    check_out_date: data.check_out_date || null,
    room_type: data.room_type || null,
    special_requests: data.special_requests || null,
    total_amount: hostel.price_per_semester,
    status: 'pending',
  };

  const { error } = await supabase
    .from('bookings')
    .insert([bookingData]);
};
```

#### 6.1.4 User Profile Management

**Profile Features**
- **Personal Information**: Update contact details and preferences
- **Academic Information**: Manage student ID and university affiliation
- **Booking History**: View all past and current bookings
- **Favorite Hostels**: Manage saved accommodation options
- **Communication Preferences**: Set notification preferences

### 6.2 Hostel Owner Features

#### 6.2.1 Admin Dashboard

**Comprehensive Management Interface**
- **Statistics Overview**: Key performance metrics at a glance
- **Booking Management**: Process incoming requests
- **Hostel Information**: Update property details
- **Communication Tools**: Contact students directly

**Dashboard Metrics**
- Total Bookings: All-time booking count
- Pending Bookings: Requests awaiting response
- Confirmed Bookings: Approved reservations
- Total Revenue: Financial performance tracking

**Dashboard Implementation**
```typescript
const [stats, setStats] = useState({
  totalBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  totalRevenue: 0,
});

useEffect(() => {
  const fetchData = async () => {
    // Fetch bookings for hostel owner's properties
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .in('hostel_id', hostelIds)
      .order('created_at', { ascending: false });

    if (bookingsData) {
      const total = bookingsData.length;
      const pending = bookingsData.filter(b => b.status === 'pending').length;
      const confirmed = bookingsData.filter(b => b.status === 'confirmed').length;
      const revenue = bookingsData.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      
      setStats({
        totalBookings: total,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        totalRevenue: revenue,
      });
    }
  };

  fetchData();
}, [hostelIds]);
```

#### 6.2.2 Booking Request Management

**Request Processing Workflow**
1. **New Request Notification**: Real-time alerts for new bookings
2. **Student Information Review**: Access to complete booking details
3. **Approval Decision**: Accept or decline booking requests
4. **Communication**: Direct contact with prospective tenants
5. **Status Updates**: Update booking progress

**Booking Management Features**
- **Detailed Student Profiles**: Access to academic and contact information
- **Request Timeline**: Track booking progression
- **Bulk Actions**: Process multiple requests efficiently
- **Communication History**: Maintain conversation records

#### 6.2.3 Property Management

**Hostel Information Management**
- **Basic Details**: Name, location, description updates
- **Pricing Information**: Semester and monthly rates
- **Amenity Management**: Add/remove available facilities
- **Contact Information**: Update communication channels
- **Availability Control**: Manage room availability

**Image Gallery Management**
- **Photo Upload**: Add property images
- **Gallery Organization**: Arrange image order
- **Image Categories**: Interior, exterior, amenity photos
- **Quality Control**: Maintain high-resolution images

### 6.3 Communication Features

#### 6.3.1 Direct Contact System

**Multiple Communication Channels**
- **Phone Calls**: Direct dialing from the platform
- **Email**: Integrated email communication
- **WhatsApp**: Instant messaging integration
- **In-App Messaging**: Future enhancement for internal communication

**Contact Implementation**
```typescript
const handleContact = (type: 'phone' | 'email' | 'whatsapp', contact: string) => {
  switch (type) {
    case 'phone':
      window.open(`tel:${contact}`);
      break;
    case 'email':
      window.open(`mailto:${contact}`);
      break;
    case 'whatsapp':
      window.open(`https://wa.me/${contact.replace(/[^0-9]/g, '')}`);
      break;
  }
};
```

#### 6.3.2 Notification System

**Real-time Updates**
- **Booking Confirmations**: Instant booking status updates
- **New Requests**: Hostel owner notifications
- **Status Changes**: Booking progress updates
- **System Notifications**: Important platform announcements

---

## 7. User Workflows

### 7.1 Student User Journey

#### 7.1.1 Account Creation and Onboarding
```
Start → Visit Homepage → Click "Sign Up" → Fill Registration Form → 
Email Verification → Profile Setup → Browse Hostels → Complete Onboarding
```

**Detailed Steps:**
1. **Homepage Visit**: Student discovers platform through marketing or referral
2. **Registration Decision**: Motivated by hostel selection or specific property
3. **Form Completion**: Provide essential personal and academic information
4. **Email Verification**: Confirm account through email link (optional)
5. **Profile Enhancement**: Add additional details for better matching
6. **Platform Exploration**: Browse available hostels and features
7. **First Interaction**: Save favorites or initiate first booking

#### 7.1.2 Hostel Discovery Process
```
Browse Homepage → Use Search/Filters → View Hostel Cards → 
Read Details → Check Gallery → Review Amenities → 
Compare Options → Add to Favorites → Make Decision
```

**Search and Filter Strategy:**
1. **Initial Browse**: Scan featured and highly-rated hostels
2. **Criteria Setting**: Define budget, location, and amenity preferences
3. **Filter Application**: Narrow down options using advanced filters
4. **Detailed Review**: Examine shortlisted properties thoroughly
5. **Comparison**: Evaluate multiple options side-by-side
6. **Decision Making**: Select preferred accommodation

#### 7.1.3 Booking Request Process
```
Select Hostel → View Full Details → Click "Book Now" → 
Login/Register → Fill Booking Form → Review Information → 
Submit Request → Receive Confirmation → Await Response
```

**Booking Form Completion:**
1. **Personal Information**: Name, email, phone number
2. **Academic Details**: Student ID, university confirmation
3. **Accommodation Preferences**: Check-in date, room type, duration
4. **Special Requirements**: Dietary needs, accessibility requirements
5. **Review and Confirmation**: Verify all information before submission

### 7.2 Hostel Owner Journey

#### 7.2.1 Registration and Setup
```
Discover Platform → Navigate to Admin Portal → Complete Registration → 
Email Verification → Dashboard Access → Hostel Setup → 
Contact Information → Go Live
```

**Registration Requirements:**
1. **Personal Information**: Full name, email, phone number
2. **Business Details**: Hostel name, location, basic description
3. **Contact Preferences**: Primary communication channels
4. **Verification**: Email confirmation and identity verification
5. **Property Setup**: Complete hostel information and image upload

#### 7.2.2 Daily Management Workflow
```
Login to Dashboard → Review New Bookings → Process Requests → 
Update Property Information → Respond to Inquiries → 
Monitor Analytics → Plan Improvements
```

**Regular Management Tasks:**
1. **Morning Review**: Check overnight booking requests and messages
2. **Request Processing**: Evaluate and respond to student applications
3. **Communication**: Follow up with prospective and current tenants
4. **Property Updates**: Maintain accurate information and availability
5. **Performance Analysis**: Review booking trends and feedback

#### 7.2.3 Booking Management Process
```
Receive Booking Alert → Review Student Information → 
Evaluate Availability → Make Decision → Update Status → 
Contact Student → Arrange Viewing → Finalize Agreement
```

**Decision Criteria:**
1. **Student Background**: Academic standing and references
2. **Compatibility**: Fit with existing tenant community
3. **Availability**: Room availability and timing
4. **Special Requirements**: Ability to accommodate specific needs
5. **Communication**: Responsiveness and professionalism

---

## 8. Installation Guide

### 8.1 Prerequisites

#### 8.1.1 System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18+
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (included with Node.js)
- **Git**: Latest version for version control
- **Code Editor**: VS Code recommended with TypeScript extensions

#### 8.1.2 Account Requirements
- **Supabase Account**: Free tier sufficient for development
- **GitHub Account**: For code repository access
- **Email Account**: For testing authentication features

### 8.2 Local Development Setup

#### 8.2.1 Repository Setup
```bash
# Clone the repository
git clone https://github.com/your-organization/unilodge.git

# Navigate to project directory
cd unilodge

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

#### 8.2.2 Environment Configuration
The application uses hardcoded Supabase configuration for simplicity:

**Supabase Configuration (src/integrations/supabase/client.ts):**
```typescript
const SUPABASE_URL = "https://opmqfcwykqqocwsmoclc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

#### 8.2.3 Development Server
```bash
# Start development server
npm run dev

# Alternative commands
npm start           # Alternative start command
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

**Development URLs:**
- **Main Application**: http://localhost:5173
- **Student Portal**: http://localhost:5173/auth
- **Admin Portal**: http://localhost:5173/admin/auth
- **Dashboard**: http://localhost:5173/admin/dashboard

### 8.3 Database Setup

#### 8.3.1 Supabase Project Configuration
The database is pre-configured with:
- **All Required Tables**: profiles, hostels, bookings, favorites, reviews
- **Relationships**: Foreign key constraints and references
- **Security Policies**: Row Level Security implementation
- **Functions**: User creation and update triggers
- **Sample Data**: Demo hostels and test accounts

#### 8.3.2 Database Verification
```sql
-- Verify table creation
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies WHERE schemaname = 'public';

-- Verify functions
SELECT routines.routine_name, routines.routine_type 
FROM information_schema.routines 
WHERE routines.specific_schema = 'public';
```

### 8.4 Testing Setup

#### 8.4.1 Test Account Creation
**Student Test Account:**
- Email: student@aamusted.edu.gh
- Password: student123
- Role: user

**Hostel Owner Test Account:**
- Email: owner@example.com
- Password: owner123
- Role: hostel_owner

#### 8.4.2 Feature Testing Checklist
- [ ] Student registration and login
- [ ] Hostel owner registration and login
- [ ] Hostel browsing and search
- [ ] Booking form submission
- [ ] Admin dashboard access
- [ ] Booking management
- [ ] Contact functionality
- [ ] Responsive design

### 8.5 Troubleshooting Common Issues

#### 8.5.1 Installation Problems
**Node.js Version Issues:**
```bash
# Check Node.js version
node --version

# Update Node.js using nvm
nvm install 18
nvm use 18
```

**Dependency Conflicts:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

#### 8.5.2 Database Connection Issues
**Supabase Connection Problems:**
1. Verify internet connection
2. Check Supabase project status at dashboard
3. Confirm API keys are correct
4. Test connection with simple query

**RLS Policy Issues:**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable after verification
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

## 9. API Reference

### 9.1 Supabase Client Methods

#### 9.1.1 Authentication API

**Sign Up**
```typescript
const signUp = async (email: string, password: string, metadata: object) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: metadata
    }
  });
  return { data, error };
};
```

**Sign In**
```typescript
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};
```

**Sign Out**
```typescript
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
```

**Get Current User**
```typescript
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};
```

#### 9.1.2 Database Operations

**Fetch Hostels**
```typescript
const fetchHostels = async (filters?: HostelFilters) => {
  let query = supabase
    .from('hostels')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false });

  if (filters?.priceRange) {
    const [min, max] = filters.priceRange;
    query = query.gte('price_per_semester', min).lte('price_per_semester', max);
  }

  if (filters?.amenities?.length) {
    query = query.overlaps('amenities', filters.amenities);
  }

  const { data, error } = await query;
  return { data, error };
};
```

**Create Booking**
```typescript
const createBooking = async (bookingData: BookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();
  
  return { data, error };
};
```

**Update Booking Status**
```typescript
const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single();
  
  return { data, error };
};
```

**Fetch User Bookings**
```typescript
const fetchUserBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      hostels (
        id,
        name,
        location,
        contact_phone,
        contact_email
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};
```

#### 9.1.3 Real-time Subscriptions

**Subscribe to Booking Changes**
```typescript
const subscribeToBookings = (hostelIds: string[], callback: (payload: any) => void) => {
  const subscription = supabase
    .channel('booking_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `hostel_id=in.(${hostelIds.join(',')})`
      },
      callback
    )
    .subscribe();

  return subscription;
};
```

### 9.2 Custom Hooks

#### 9.2.1 useAuth Hook
```typescript
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### 9.2.2 useHostels Hook
```typescript
const useHostels = (filters?: HostelFilters) => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await fetchHostels(filters);
      
      if (error) {
        setError(error.message);
      } else {
        setHostels(data || []);
      }
      
      setLoading(false);
    };

    fetchData();
  }, [filters]);

  return { hostels, loading, error, refetch: fetchData };
};
```

#### 9.2.3 useBookings Hook
```typescript
const useBookings = (userId?: string, hostelIds?: string[]) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const { data } = await fetchUserBookings(userId);
        setBookings(data || []);
      } else if (hostelIds) {
        const { data } = await fetchHostelBookings(hostelIds);
        setBookings(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [userId, hostelIds]);

  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    const { error } = await updateBookingStatus(bookingId, status);
    if (!error) {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status }
            : booking
        )
      );
    }
    return { error };
  };

  return { bookings, loading, updateStatus };
};
```

### 9.3 Error Handling

#### 9.3.1 API Error Types
```typescript
interface APIError {
  message: string;
  code?: string;
  details?: any;
}

interface APIResponse<T> {
  data: T | null;
  error: APIError | null;
}
```

#### 9.3.2 Error Handling Patterns
```typescript
const handleAPICall = async <T>(
  apiCall: () => Promise<APIResponse<T>>,
  onSuccess?: (data: T) => void,
  onError?: (error: APIError) => void
) => {
  try {
    const { data, error } = await apiCall();
    
    if (error) {
      onError?.(error);
      return { data: null, error };
    }
    
    onSuccess?.(data);
    return { data, error: null };
  } catch (exception) {
    const error = { message: 'Network error occurred' };
    onError?.(error);
    return { data: null, error };
  }
};
```

---

## 10. Component Documentation

### 10.1 Page Components

#### 10.1.1 Index Page (Homepage)
**File**: `src/pages/Index.tsx`
**Purpose**: Main landing page displaying hostel listings with search and filter capabilities

**Key Features:**
- Hero section with university branding
- Advanced search and filtering
- Hostel card grid display
- Pagination with "Load More" functionality
- Feature highlights section
- Responsive design for all devices

**State Management:**
```typescript
const [hostels, setHostels] = useState<Hostel[]>([]);
const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);
const [searchQuery, setSearchQuery] = useState('');
const [priceRange, setPriceRange] = useState('');
const [currentPage, setCurrentPage] = useState(1);
```

#### 10.1.2 Authentication Pages

**Student Auth (`src/pages/Auth.tsx`)**
- Dual-tab interface for sign-in and sign-up
- Form validation with real-time feedback
- University-themed design
- Social proof elements
- Redirect handling for authenticated users

**Admin Auth (`src/pages/AdminAuth.tsx`)**
- Separate interface for hostel owners
- Extended registration form for business details
- Role-based authentication flow
- Business-focused UI elements
- Dashboard redirect after authentication

#### 10.1.3 Admin Dashboard
**File**: `src/pages/AdminDashboard.tsx`
**Purpose**: Comprehensive management interface for hostel owners

**Dashboard Sections:**
- **Statistics Overview**: Key metrics and KPIs
- **Booking Management**: Request processing interface
- **Property Management**: Hostel information updates
- **Communication Center**: Student interaction tools

**Key Metrics Displayed:**
- Total bookings received
- Pending requests awaiting action
- Confirmed bookings
- Revenue tracking

### 10.2 UI Components

#### 10.2.1 HostelCard Component
**File**: `src/components/ui/hostel-card.tsx`
**Purpose**: Displays hostel information in a card format

**Props Interface:**
```typescript
interface HostelCardProps {
  id: string;
  name: string;
  location: string;
  price_per_semester: number;
  rating: number;
  amenities: string[];
  contact_phone?: string;
  contact_email?: string;
  contact_whatsapp?: string;
}
```

**Features:**
- Image display with fallback
- Rating visualization
- Amenity icons
- Contact buttons
- Favorite toggle
- Responsive layout

#### 10.2.2 BookingForm Component
**File**: `src/components/ui/booking-form.tsx`
**Purpose**: Modal form for creating booking requests

**Form Fields:**
- Personal information (name, email, phone)
- Academic details (student ID)
- Preferences (dates, room type)
- Special requirements

**Validation:**
- Real-time form validation using Zod schemas
- Error message display
- Form submission handling
- Loading states

#### 10.2.3 HostelDetailDialog Component
**File**: `src/components/ui/hostel-detail-dialog.tsx`
**Purpose**: Comprehensive hostel information modal

**Tab Structure:**
- **Overview**: Basic information and pricing
- **Gallery**: Property images and virtual tours
- **Amenities**: Detailed facility list
- **Location**: Map integration and address
- **Contact**: Communication options

**Interactive Features:**
- Image gallery with full-screen view
- Google Maps integration
- Direct contact actions
- Booking initiation

#### 10.2.4 NavigationBar Component
**File**: `src/components/ui/navigation-bar.tsx`
**Purpose**: Main application navigation

**Navigation Elements:**
- Brand logo and identity
- User authentication status
- Role-based menu items
- Mobile-responsive hamburger menu
- Search integration

### 10.3 Form Components

#### 10.3.1 Form Validation
All forms implement consistent validation patterns:

```typescript
// Common validation schemas
const emailSchema = z.string().email("Please enter a valid email address");
const phoneSchema = z.string().min(10, "Phone number must be at least 10 digits");
const nameSchema = z.string().min(2, "Name must be at least 2 characters");

// Form implementation pattern
const {
  register,
  handleSubmit,
  formState: { errors },
  reset
} = useForm<FormData>({
  resolver: zodResolver(validationSchema),
  defaultValues: initialValues
});
```

#### 10.3.2 Error Handling
Consistent error display across all forms:

```typescript
const ErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  
  return (
    <p className="text-sm text-destructive mt-1">
      {error}
    </p>
  );
};
```

### 10.4 Layout Components

#### 10.4.1 Responsive Grid System
```typescript
// Hostel grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {hostels.map(hostel => (
    <HostelCard key={hostel.id} {...hostel} />
  ))}
</div>

// Dashboard metrics grid
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {metrics.map(metric => (
    <MetricCard key={metric.id} {...metric} />
  ))}
</div>
```

#### 10.4.2 Loading States
Consistent loading indicators throughout the application:

```typescript
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
    <div className="bg-gray-300 h-4 rounded mb-2"></div>
    <div className="bg-gray-300 h-4 rounded w-3/4"></div>
  </div>
);
```

---

## 11. Design System

### 11.1 Color Palette

#### 11.1.1 Primary Colors (AAMUSTED Branding)
The design system uses official AAMUSTED university colors to maintain brand consistency:

**Maroon (Primary)**
- Default: `hsl(345 60% 25%)` - Main brand color for buttons, headers
- Light: `hsl(345 45% 35%)` - Hover states and secondary elements  
- Dark: `hsl(345 70% 20%)` - Pressed states and emphasis
- Foreground: `hsl(0 0% 98%)` - Text on maroon backgrounds

**Gold (Secondary)**
- Default: `hsl(42 85% 60%)` - Accent color for highlights and CTAs
- Light: `hsl(42 85% 70%)` - Subtle highlights and badges
- Dark: `hsl(42 85% 50%)` - Strong emphasis and warnings
- Foreground: `hsl(345 60% 15%)` - Text on gold backgrounds

#### 11.1.2 Neutral Colors
**Background System**
- Background: `hsl(0 0% 98%)` - Main page background
- Card: `hsl(0 0% 100%)` - Content containers
- Muted: `hsl(42 20% 95%)` - Subtle backgrounds
- Border: `hsl(345 20% 88%)` - Dividers and outlines

**Text System**
- Foreground: `hsl(345 60% 15%)` - Primary text
- Muted Foreground: `hsl(345 20% 45%)` - Secondary text
- Card Foreground: `hsl(345 60% 15%)` - Text in cards

#### 11.1.3 Semantic Colors
**Status Colors**
- Success/Accent: `hsl(140 50% 40%)` - Confirmations and success states
- Destructive: `hsl(0 84.2% 60.2%)` - Errors and dangerous actions
- Warning: `hsl(42 85% 60%)` - Cautions and pending states

### 11.2 Typography System

#### 11.2.1 Font Stack
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               'Helvetica Neue', Arial, sans-serif;
}
```

#### 11.2.2 Typography Scale
**Headings**
- H1: `text-4xl md:text-6xl` (36px/60px) - Hero titles
- H2: `text-3xl` (30px) - Section headers
- H3: `text-xl` (20px) - Card titles
- H4: `text-lg` (18px) - Subsections

**Body Text**
- Large: `text-xl` (20px) - Hero descriptions
- Default: `text-base` (16px) - Standard body text
- Small: `text-sm` (14px) - Captions and metadata
- Extra Small: `text-xs` (12px) - Badges and labels

#### 11.2.3 Font Weights
- Light: `font-light` (300) - Subtle text
- Normal: `font-normal` (400) - Body text
- Medium: `font-medium` (500) - Emphasis
- Semibold: `font-semibold` (600) - Important text
- Bold: `font-bold` (700) - Strong emphasis

### 11.3 Spacing System

#### 11.3.1 Spacing Scale (Tailwind)
- `0.5` = 2px - Fine adjustments
- `1` = 4px - Tight spacing
- `2` = 8px - Close elements
- `4` = 16px - Standard spacing
- `6` = 24px - Medium spacing
- `8` = 32px - Large spacing
- `12` = 48px - Section spacing
- `16` = 64px - Page sections

#### 11.3.2 Component Spacing
**Cards**
```css
.card {
  padding: 1.5rem; /* 24px */
  margin-bottom: 1.5rem; /* 24px */
  border-radius: 0.5rem; /* 8px */
}
```

**Forms**
```css
.form-field {
  margin-bottom: 1rem; /* 16px */
}

.form-section {
  margin-bottom: 2rem; /* 32px */
}
```

### 11.4 Component Design Tokens

#### 11.4.1 Gradients
**Brand Gradients**
```css
/* Primary gradient - Hero sections */
.bg-gradient-primary {
  background: linear-gradient(135deg, hsl(345 60% 25%), hsl(345 45% 35%));
}

/* Secondary gradient - Accent elements */
.bg-gradient-secondary {
  background: linear-gradient(135deg, hsl(42 85% 60%), hsl(42 85% 70%));
}

/* Hero gradient - Main banner */
.bg-gradient-hero {
  background: linear-gradient(135deg, 
    hsl(345 60% 25%) 0%, 
    hsl(345 45% 35%) 50%, 
    hsl(42 85% 60%) 100%
  );
}
```

#### 11.4.2 Shadows
**Elevation System**
```css
/* Subtle shadow for cards */
.shadow-elegant {
  box-shadow: 0 4px 20px hsl(345 60% 25% / 0.15);
}

/* Primary brand shadow */
.shadow-primary {
  box-shadow: 0 10px 30px -10px hsl(345 60% 25% / 0.3);
}

/* Secondary accent shadow */
.shadow-secondary {
  box-shadow: 0 10px 30px -10px hsl(42 85% 60% / 0.2);
}
```

#### 11.4.3 Border Radius
```css
:root {
  --radius: 0.5rem; /* 8px */
}

.rounded-lg { border-radius: var(--radius); }
.rounded-md { border-radius: calc(var(--radius) - 2px); }
.rounded-sm { border-radius: calc(var(--radius) - 4px); }
```

### 11.5 Component Variants

#### 11.5.1 Button Variants
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

#### 11.5.2 Badge Variants
```typescript
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

### 11.6 Responsive Design

#### 11.6.1 Breakpoint System
```css
/* Tailwind CSS breakpoints */
sm: '640px',   /* Small devices (landscape phones) */
md: '768px',   /* Medium devices (tablets) */
lg: '1024px',  /* Large devices (laptops) */
xl: '1280px',  /* Extra large devices (desktops) */
2xl: '1536px'  /* 2X large devices (large desktops) */
```

#### 11.6.2 Grid Responsive Patterns
```typescript
// Hostel grid - responsive columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Dashboard metrics - responsive layout
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">

// Form layout - stack on mobile
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

#### 11.6.3 Typography Responsive
```css
/* Hero title responsive sizing */
.hero-title {
  @apply text-4xl md:text-6xl font-bold;
}

/* Section headers responsive */
.section-header {
  @apply text-2xl md:text-3xl font-bold;
}
```

### 11.7 Dark Mode Support

#### 11.7.1 Dark Mode Color Tokens
```css
.dark {
  --background: 345 60% 8%;
  --foreground: 42 85% 95%;
  --primary: 42 85% 60%;
  --secondary: 345 40% 20%;
  --accent: 140 50% 50%;
  
  /* Dark mode gradients */
  --gradient-primary: linear-gradient(135deg, hsl(345 60% 15%), hsl(345 40% 20%));
  --gradient-hero: linear-gradient(135deg, 
    hsl(345 60% 10%) 0%, 
    hsl(345 40% 20%) 50%, 
    hsl(42 85% 60%) 100%
  );
}
```

#### 11.7.2 Dark Mode Implementation
```typescript
// Dark mode toggle component
const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
};
```

---

## 12. Security Implementation

### 12.1 Authentication Security

#### 12.1.1 Session Management
**JWT Token Security**
- Tokens automatically refresh before expiration
- Secure storage in localStorage with appropriate flags
- Session validation on each request
- Automatic logout on token expiry

**Implementation:**
```typescript
// Session validation middleware
const validateSession = async (request: Request) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    throw new Error('Invalid or expired token');
  }
  
  return user;
};
```

#### 12.1.2 Password Security
**Password Requirements**
- Minimum 6 characters (configurable)
- Email verification recommended
- Secure password reset flow
- Protection against brute force attacks

**Password Validation:**
```typescript
const passwordSchema = z.string()
  .min(6, "Password must be at least 6 characters")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number");
```

### 12.2 Database Security

#### 12.2.1 Row Level Security (RLS) Implementation

**Profile Security**
```sql
-- Users can only access their own data
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

**Hostel Security**
```sql
-- Public read access for active hostels
CREATE POLICY "Hostels are viewable by everyone" 
ON public.hostels 
FOR SELECT 
USING (is_active = true);

-- Owner-only write access
CREATE POLICY "Hostel owners can update their hostels" 
ON public.hostels 
FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = owner_id));
```

**Booking Security**
```sql
-- Students can view their own bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = user_id));

-- Hostel owners can view bookings for their properties
CREATE POLICY "Hostel owners can view bookings for their hostels" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = (SELECT profiles.user_id FROM profiles 
                     JOIN hostels ON profiles.id = hostels.owner_id 
                     WHERE hostels.id = hostel_id));

-- Status updates restricted to relevant parties
CREATE POLICY "Hostel owners can update booking status" 
ON public.bookings 
FOR UPDATE 
USING (auth.uid() = (SELECT profiles.user_id FROM profiles 
                     JOIN hostels ON profiles.id = hostels.owner_id 
                     WHERE hostels.id = hostel_id));
```

#### 12.2.2 Data Validation and Constraints

**Input Validation**
```sql
-- Ensure valid email formats
ALTER TABLE profiles ADD CONSTRAINT valid_email 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Validate phone numbers
ALTER TABLE profiles ADD CONSTRAINT valid_phone 
CHECK (phone ~* '^\+?[1-9]\d{1,14}$');

-- Ensure positive pricing
ALTER TABLE hostels ADD CONSTRAINT positive_price 
CHECK (price_per_semester > 0);

-- Validate booking status
ALTER TABLE bookings ADD CONSTRAINT valid_booking_status 
CHECK (status IN ('pending', 'confirmed', 'cancelled'));

-- Ensure valid ratings
ALTER TABLE reviews ADD CONSTRAINT valid_rating 
CHECK (rating >= 1 AND rating <= 5);
```

**Data Integrity**
```sql
-- Prevent future check-in dates being in the past
ALTER TABLE bookings ADD CONSTRAINT valid_checkin_date 
CHECK (check_in_date >= CURRENT_DATE);

-- Ensure check-out after check-in
ALTER TABLE bookings ADD CONSTRAINT valid_date_range 
CHECK (check_out_date IS NULL OR check_out_date > check_in_date);

-- Limit special requests length
ALTER TABLE bookings ADD CONSTRAINT reasonable_request_length 
CHECK (char_length(special_requests) <= 1000);
```

### 12.3 API Security

#### 12.3.1 Input Sanitization
**Client-Side Validation**
```typescript
// Comprehensive form validation
const createBookingSchema = z.object({
  full_name: z.string()
    .min(2, "Name too short")
    .max(100, "Name too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid characters in name"),
  
  email: z.string()
    .email("Invalid email format")
    .max(254, "Email too long"),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  
  special_requests: z.string()
    .max(1000, "Request too long")
    .optional()
});
```

**Server-Side Validation**
```typescript
// Database query parameter validation
const validateQueryParams = (params: any) => {
  const schema = z.object({
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    search: z.string().max(100).optional(),
    price_min: z.number().min(0).optional(),
    price_max: z.number().max(10000).optional()
  });
  
  return schema.parse(params);
};
```

#### 12.3.2 Rate Limiting and Abuse Prevention

**API Rate Limiting (Future Enhancement)**
```typescript
// Rate limiting middleware concept
const rateLimiter = {
  booking_requests: { max: 5, window: '15m' },
  auth_attempts: { max: 3, window: '15m' },
  search_queries: { max: 100, window: '1h' }
};
```

### 12.4 Frontend Security

#### 12.4.1 XSS Prevention
**Content Sanitization**
```typescript
// Safe HTML rendering
const sanitizeContent = (content: string) => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

// Safe attribute rendering
const SafeContent = ({ content }: { content: string }) => (
  <div dangerouslySetInnerHTML={{ __html: sanitizeContent(content) }} />
);
```

**Input Encoding**
```typescript
// Escape user input for display
const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
```

#### 12.4.2 CSRF Protection
**Token Validation**
```typescript
// CSRF token generation and validation
const generateCSRFToken = () => {
  return crypto.randomUUID();
};

const validateCSRFToken = (token: string, sessionToken: string) => {
  return token === sessionToken;
};
```

### 12.5 File Upload Security

#### 12.5.1 Image Upload Validation
```typescript
// File type validation
const validateImageUpload = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP allowed.');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 5MB.');
  }
  
  return true;
};
```

#### 12.5.2 Secure File Storage
```sql
-- Storage bucket policies
CREATE POLICY "Public hostel images read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'hostel-images');

CREATE POLICY "Authenticated users can upload hostel images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hostel-images' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 12.6 Security Monitoring

#### 12.6.1 Audit Logging
```sql
-- Audit trail for sensitive operations
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, table_name, record_id, 
    old_values, new_values, created_at
  ) VALUES (
    auth.uid(), TG_OP, TG_TABLE_NAME, 
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 12.6.2 Security Headers
```typescript
// Security headers for production deployment
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
```

---

## 13. Deployment Guide

### 13.1 Pre-Deployment Checklist

#### 13.1.1 Code Quality Verification
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Unit tests passing (if implemented)
- [ ] Performance optimization completed
- [ ] Security audit completed
- [ ] Cross-browser testing completed

#### 13.1.2 Database Preparation
- [ ] Production database configured
- [ ] RLS policies tested and verified
- [ ] Database functions deployed
- [ ] Sample data populated (optional)
- [ ] Backup strategy implemented

#### 13.1.3 Environment Configuration
- [ ] Supabase project configured for production
- [ ] Email templates customized
- [ ] Authentication redirects updated
- [ ] Domain configuration completed

### 13.2 Build Process

#### 13.2.1 Production Build
```bash
# Install dependencies
npm ci

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Verify build output
npm run preview
```

#### 13.2.2 Build Optimization
**Bundle Analysis**
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/static/js/*.js

# Check for unused dependencies
npm install -g depcheck
depcheck
```

**Performance Optimization**
```typescript
// Code splitting for large components
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const HostelDetailDialog = lazy(() => import('./components/ui/hostel-detail-dialog'));

// Image optimization
const optimizedImages = {
  formats: ['avif', 'webp', 'jpg'],
  sizes: [400, 800, 1200],
  quality: 80
};
```

### 13.3 Hosting Platforms

#### 13.3.1 Vercel Deployment (Recommended)

**Deployment Steps:**
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from local
   vercel
   
   # Or connect GitHub repository via Vercel dashboard
   ```

2. **Configure Build Settings**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "devCommand": "npm run dev",
     "installCommand": "npm ci"
   }
   ```

3. **Environment Variables**
   - Set production environment variables in Vercel dashboard
   - Configure domain settings
   - Enable automatic deployments

**Vercel Configuration Benefits:**
- Automatic deployments on git push
- Preview deployments for PRs
- Edge CDN for global performance
- Serverless functions support
- Built-in analytics

#### 13.3.2 Netlify Deployment

**Deployment Process:**
```bash
# Build locally
npm run build

# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Netlify Configuration:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### 13.3.3 Custom Server Deployment

**Docker Deployment:**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Nginx Configuration:**
```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    
    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 13.4 Domain Configuration

#### 13.4.1 Custom Domain Setup

**DNS Configuration:**
```
# A Record
@ -> 76.76.19.61 (Vercel IP)

# CNAME Record  
www -> unilodge.vercel.app

# For Netlify
@ -> netlify-domain.netlify.app
```

**SSL Certificate:**
- Automatic SSL through hosting platform
- Custom SSL certificate (if required)
- HTTPS redirect configuration

#### 13.4.2 Supabase Domain Updates

**Authentication Redirects:**
```typescript
// Update redirect URLs in Supabase dashboard
const redirectURLs = [
  'https://your-domain.com',
  'https://www.your-domain.com',
  'https://your-domain.com/admin/dashboard'
];
```

**CORS Configuration:**
```sql
-- Update CORS settings if needed
-- This is typically handled automatically by Supabase
```

### 13.5 Performance Monitoring

#### 13.5.1 Core Web Vitals

**Monitoring Setup:**
```typescript
// Performance monitoring
const reportWebVitals = (metric: any) => {
  switch (metric.name) {
    case 'CLS':
    case 'FID':
    case 'FCP':
    case 'LCP':
    case 'TTFB':
      // Send to analytics service
      console.log(metric);
      break;
  }
};

// In main.tsx
reportWebVitals();
```

**Performance Targets:**
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- First Contentful Paint (FCP): < 1.8s

#### 13.5.2 Error Monitoring

**Error Tracking Setup:**
```typescript
// Error boundary for React components
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: any) {
    // Log to monitoring service
    console.error('Application Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

### 13.6 Security Considerations

#### 13.6.1 Production Security Headers

```typescript
// Security headers for production
const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://unpkg.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://*.supabase.co;
  `.replace(/\s+/g, ' ').trim()
};
```

#### 13.6.2 Environment Security

**Sensitive Data Protection:**
- API keys secured in hosting platform environment variables
- Database credentials protected
- Authentication secrets managed securely
- Regular security audits scheduled

### 13.7 Backup and Recovery

#### 13.7.1 Database Backup Strategy

**Automatic Backups:**
- Supabase provides automatic daily backups
- Point-in-time recovery available
- Manual backup triggers for major deployments

**Backup Verification:**
```sql
-- Test backup restoration procedure
-- Verify data integrity
-- Confirm RLS policies intact
-- Test authentication flow
```

#### 13.7.2 Disaster Recovery Plan

**Recovery Procedures:**
1. **Database Recovery**: Restore from Supabase backup
2. **Application Recovery**: Redeploy from Git repository
3. **DNS Recovery**: Update DNS records if needed
4. **SSL Recovery**: Reissue certificates if required

**Recovery Testing:**
- Monthly disaster recovery drills
- Documentation of recovery procedures
- Designated recovery team members
- Communication plan during incidents

---

## 14. Troubleshooting

### 14.1 Common Issues and Solutions

#### 14.1.1 Authentication Problems

**Issue: Users Cannot Sign In After Registration**

*Symptoms:*
- Registration appears successful
- Login fails with "Invalid credentials"
- User exists in Supabase Auth dashboard

*Diagnosis:*
```typescript
// Check user status in Supabase dashboard
const checkUserStatus = async (email: string) => {
  const { data, error } = await supabase.auth.admin.getUserByEmail(email);
  console.log('User status:', data?.user?.email_confirmed_at);
  console.log('User metadata:', data?.user?.user_metadata);
};
```

*Solutions:*
1. **Email Verification Required**
   ```typescript
   // Disable email confirmation in Supabase Auth settings
   // Or implement proper email verification flow
   ```

2. **Check Email Template Configuration**
   - Verify email templates in Supabase dashboard
   - Ensure redirect URLs are correct
   - Test email delivery

3. **Password Requirements**
   ```typescript
   // Ensure password meets minimum requirements
   const passwordSchema = z.string()
     .min(6, "Password must be at least 6 characters");
   ```

**Issue: Admin Access Denied**

*Symptoms:*
- Hostel owner can sign in but cannot access dashboard
- "Access Denied" message displayed

*Solutions:*
1. **Verify User Role**
   ```sql
   -- Check user role in database
   SELECT p.*, u.email 
   FROM profiles p 
   JOIN auth.users u ON p.user_id = u.id 
   WHERE u.email = 'owner@example.com';
   ```

2. **Update Role Manually (if needed)**
   ```sql
   -- Fix incorrect role assignment
   UPDATE profiles 
   SET role = 'hostel_owner' 
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'owner@example.com');
   ```

#### 14.1.2 Database Connection Issues

**Issue: Failed to Fetch Data**

*Symptoms:*
- Loading states persist indefinitely
- Console shows network errors
- Data not displaying in components

*Diagnosis:*
```typescript
// Test basic Supabase connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('hostels')
      .select('count(*)')
      .limit(1);
    
    console.log('Connection test:', { data, error });
  } catch (err) {
    console.error('Connection failed:', err);
  }
};
```

*Solutions:*
1. **Check Internet Connection**
   - Verify network connectivity
   - Test Supabase dashboard access
   - Check for firewall restrictions

2. **Verify Supabase Configuration**
   ```typescript
   // Verify client configuration
   console.log('Supabase URL:', supabase.supabaseUrl);
   console.log('Supabase Key:', supabase.supabaseKey.substring(0, 10) + '...');
   ```

3. **RLS Policy Issues**
   ```sql
   -- Temporarily disable RLS for testing
   ALTER TABLE hostels DISABLE ROW LEVEL SECURITY;
   
   -- Test query, then re-enable
   ALTER TABLE hostels ENABLE ROW LEVEL SECURITY;
   ```

#### 14.1.3 UI/Display Issues

**Issue: Styles Not Loading Correctly**

*Symptoms:*
- Components appear unstyled
- Tailwind classes not applying
- Layout appears broken

*Solutions:*
1. **Clear Browser Cache**
   ```bash
   # Force refresh
   Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   
   # Clear cache in developer tools
   # Application tab -> Storage -> Clear site data
   ```

2. **Verify Tailwind Compilation**
   ```bash
   # Restart development server
   npm run dev
   
   # Check for Tailwind errors in console
   ```

3. **Check Import Paths**
   ```typescript
   // Verify CSS imports in main.tsx
   import './index.css'
   ```

**Issue: Images Not Displaying**

*Symptoms:*
- Broken image icons
- Alt text showing instead of images
- Console 404 errors for image requests

*Solutions:*
1. **Verify Image Paths**
   ```typescript
   // Check asset imports
   import campusHeroBg from '@/assets/campus-hero-bg.jpg';
   
   // Verify file exists in assets folder
   ```

2. **Check Image URLs**
   ```typescript
   // For Supabase Storage images
   const getImageUrl = (path: string) => {
     return supabase.storage
       .from('hostel-images')
       .getPublicUrl(path).data.publicUrl;
   };
   ```

#### 14.1.4 Form Submission Issues

**Issue: Booking Form Not Submitting**

*Symptoms:*
- Form submission hangs on loading
- No success/error messages
- Data not appearing in database

*Diagnosis:*
```typescript
// Add detailed logging to form submission
const onSubmit = async (data: BookingFormData) => {
  console.log('Form data:', data);
  console.log('User:', user);
  
  try {
    const result = await submitBooking(data);
    console.log('Submission result:', result);
  } catch (error) {
    console.error('Submission error:', error);
  }
};
```

*Solutions:*
1. **Check User Authentication**
   ```typescript
   // Verify user is authenticated
   if (!user) {
     toast({
       title: "Authentication Required",
       description: "Please sign in to make a booking.",
       variant: "destructive",
     });
     return;
   }
   ```

2. **Validate Form Data**
   ```typescript
   // Check form validation
   const { errors } = formState;
   console.log('Form errors:', errors);
   ```

3. **Check Database Permissions**
   ```sql
   -- Verify RLS policies allow insertion
   SELECT * FROM pg_policies 
   WHERE tablename = 'bookings' AND cmd = 'INSERT';
   ```

### 14.2 Development Debugging

#### 14.2.1 Browser Developer Tools

**Console Debugging:**
```typescript
// Strategic console logging
console.group('Authentication Debug');
console.log('User:', user);
console.log('Session:', session);
console.log('Loading:', loading);
console.groupEnd();

console.group('API Debug');
console.log('Request:', requestData);
console.log('Response:', responseData);
console.log('Error:', error);
console.groupEnd();
```

**Network Tab Analysis:**
- Monitor Supabase API requests
- Check response status codes
- Verify request headers and payload
- Analyze response times

**Application Tab:**
- Inspect localStorage for auth tokens
- Check IndexedDB for Supabase cache
- Verify service worker status

#### 14.2.2 React Developer Tools

**Component State Inspection:**
- Install React DevTools browser extension
- Inspect component props and state
- Monitor context values
- Track re-render patterns

**Performance Profiling:**
```typescript
// Use React Profiler for performance debugging
import { Profiler } from 'react';

function onRenderCallback(id: string, phase: string, actualDuration: number) {
  console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration);
}

<Profiler id="HostelCard" onRender={onRenderCallback}>
  <HostelCard {...props} />
</Profiler>
```

#### 14.2.3 Database Debugging

**SQL Query Testing:**
```sql
-- Test RLS policies with different users
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claims TO '{"sub":"user-id-here"}';

-- Test data access
SELECT * FROM hostels WHERE is_active = true;

-- Reset role
RESET role;
```

**Query Performance:**
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM hostels 
WHERE is_active = true 
ORDER BY rating DESC;

-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public';
```

### 14.3 Production Debugging

#### 14.3.1 Error Monitoring

**Error Tracking Setup:**
```typescript
// Production error logging
const logError = (error: Error, context: any) => {
  // Send to monitoring service (e.g., Sentry, LogRocket)
  console.error('Production Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
};

// Global error handler
window.addEventListener('error', (event) => {
  logError(event.error, { type: 'global' });
});

window.addEventListener('unhandledrejection', (event) => {
  logError(new Error(event.reason), { type: 'promise' });
});
```

#### 14.3.2 Performance Monitoring

**Performance Metrics:**
```typescript
// Monitor Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // Send metrics to analytics service
  console.log('Performance Metric:', metric);
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

**Bundle Analysis:**
```bash
# Analyze production bundle
npm run build
npx webpack-bundle-analyzer dist/static/js/*.js

# Check for:
# - Large dependencies
# - Duplicate code
# - Unused exports
```

### 14.4 Support Resources

#### 14.4.1 External Documentation
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Supabase**: https://supabase.com/docs
- **Vite**: https://vitejs.dev/guide/

#### 14.4.2 Community Resources
- **React Community**: https://reactjs.org/community/support.html
- **Supabase Discord**: https://discord.supabase.com/
- **Stack Overflow**: Tagged questions for specific technologies
- **GitHub Issues**: For library-specific problems

#### 14.4.3 Internal Documentation
- Code comments and inline documentation
- README.md files for specific components
- API documentation in code
- Database schema documentation

---

## 15. Future Development

### 15.1 Planned Features

#### 15.1.1 Phase 2 Enhancements

**Advanced Search and Filtering**
- **Geographic Search**: Map-based hostel discovery
- **Advanced Filters**: Multiple criteria combinations
- **Saved Searches**: Persistent search preferences
- **Smart Recommendations**: AI-powered hostel suggestions

**Enhanced Communication**
- **In-App Messaging**: Real-time chat between students and owners
- **Video Calls**: Virtual property tours
- **Notification System**: Push notifications for important updates
- **Email Automation**: Automated booking confirmations and reminders

**Payment Integration**
- **Online Payments**: Secure payment processing with Stripe/PayPal
- **Booking Deposits**: Partial payment options
- **Payment Scheduling**: Installment payment plans
- **Financial Reporting**: Revenue analytics for hostel owners

#### 15.1.2 Mobile Application

**React Native Implementation**
```typescript
// Shared codebase structure
project/
├── packages/
│   ├── mobile/          // React Native app
│   ├── web/            // Current web app
│   ├── shared/         // Shared components and utilities
│   └── api/            // Shared API layer
```

**Mobile-Specific Features**
- **Push Notifications**: Real-time booking updates
- **Offline Support**: Basic functionality without internet
- **Camera Integration**: Photo upload for property verification
- **Location Services**: GPS-based hostel discovery

#### 15.1.3 Advanced Analytics

**Student Analytics**
- **Behavior Tracking**: Search patterns and preferences
- **Booking Analytics**: Conversion rates and drop-off points
- **User Segmentation**: Different student demographics
- **Satisfaction Metrics**: Post-booking feedback analysis

**Hostel Owner Analytics**
- **Performance Dashboard**: Detailed business metrics
- **Market Analysis**: Competitive positioning
- **Revenue Optimization**: Pricing recommendations
- **Occupancy Forecasting**: Demand prediction models

### 15.2 Technical Improvements

#### 15.2.1 Performance Optimization

**Frontend Optimization**
```typescript
// Advanced code splitting
const LazyComponents = {
  AdminDashboard: lazy(() => import('./pages/AdminDashboard')),
  HostelGallery: lazy(() => import('./components/HostelGallery')),
  BookingForm: lazy(() => import('./components/BookingForm'))
};

// Image optimization
const ImageOptimization = {
  formats: ['avif', 'webp', 'jpg'],
  sizes: [400, 800, 1200, 1600],
  quality: { avif: 50, webp: 75, jpg: 80 },
  loading: 'lazy' as const
};
```

**Backend Optimization**
- **Database Indexing**: Optimized query performance
- **Edge Functions**: Serverless API endpoints
- **CDN Integration**: Global content delivery
- **Caching Strategy**: Redis-based caching layer

#### 15.2.2 Security Enhancements

**Advanced Authentication**
- **Multi-Factor Authentication**: SMS/Email verification
- **Social Login**: Google, Facebook, Apple integration
- **Biometric Authentication**: Mobile app fingerprint/face ID
- **Session Management**: Advanced session security

**Data Protection**
- **End-to-End Encryption**: Sensitive data encryption
- **GDPR Compliance**: Data privacy regulations
- **Audit Logging**: Comprehensive activity tracking
- **Penetration Testing**: Regular security assessments

### 15.3 Platform Expansion

#### 15.3.1 Multi-University Support

**Scalable Architecture**
```typescript
// University-specific configuration
interface UniversityConfig {
  id: string;
  name: string;
  domain: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
  };
  location: {
    latitude: number;
    longitude: number;
    radius: number;
  };
}

const universities: UniversityConfig[] = [
  {
    id: 'aamusted',
    name: 'AAMUSTED',
    domain: 'aamusted.edu.gh',
    branding: { /* current config */ },
    location: { /* campus coordinates */ }
  },
  // Additional universities...
];
```

**Multi-Tenancy Implementation**
- **Subdomain Routing**: university.unilodge.com
- **Custom Branding**: University-specific themes
- **Localized Content**: Region-specific information
- **Separate Databases**: Isolated data per institution

#### 15.3.2 International Expansion

**Localization Support**
```typescript
// Internationalization setup
const locales = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'fr-FR': 'Français',
  'es-ES': 'Español',
  'de-DE': 'Deutsch'
};

// Currency handling
const currencies = {
  'GHS': { symbol: '₵', decimals: 2 },
  'USD': { symbol: '$', decimals: 2 },
  'EUR': { symbol: '€', decimals: 2 },
  'GBP': { symbol: '£', decimals: 2 }
};
```

**Regional Adaptations**
- **Currency Conversion**: Multi-currency support
- **Payment Methods**: Local payment preferences
- **Legal Compliance**: Regional regulation adherence
- **Cultural Customization**: Local business practices

### 15.4 Advanced Features

#### 15.4.1 AI and Machine Learning

**Recommendation Engine**
```python
# Hostel recommendation algorithm
class HostelRecommendationEngine:
    def __init__(self):
        self.user_preferences = {}
        self.hostel_features = {}
        self.booking_history = {}
    
    def recommend_hostels(self, user_id: str, preferences: dict) -> list:
        # Content-based filtering
        content_scores = self.content_based_filtering(preferences)
        
        # Collaborative filtering
        collaborative_scores = self.collaborative_filtering(user_id)
        
        # Hybrid approach
        final_scores = self.combine_scores(content_scores, collaborative_scores)
        
        return self.rank_hostels(final_scores)
```

**Smart Pricing**
- **Dynamic Pricing**: Market-based price optimization
- **Demand Forecasting**: Seasonal demand prediction
- **Competitive Analysis**: Market rate monitoring
- **Revenue Optimization**: Profit maximization algorithms

#### 15.4.2 IoT Integration

**Smart Hostel Features**
- **Keyless Entry**: Digital lock integration
- **Utility Monitoring**: Smart meter integration
- **Maintenance Alerts**: Automated facility monitoring
- **Occupancy Tracking**: Real-time room availability

**Data Collection**
```typescript
// IoT data structure
interface IoTData {
  deviceId: string;
  hostelId: string;
  roomId?: string;
  timestamp: Date;
  readings: {
    temperature?: number;
    humidity?: number;
    occupancy?: boolean;
    energy_usage?: number;
  };
}
```

### 15.5 Business Model Evolution

#### 15.5.1 Revenue Diversification

**Subscription Models**
- **Premium Listings**: Enhanced visibility for hostel owners
- **Student Memberships**: Exclusive benefits and discounts
- **Verification Services**: Professional property verification
- **Analytics Packages**: Advanced reporting tools

**Marketplace Expansion**
- **Furniture Rental**: Student furniture marketplace
- **Utility Services**: Utility connection services
- **Insurance Products**: Student accommodation insurance
- **Food Services**: Meal plan partnerships

#### 15.5.2 Partnership Opportunities

**University Partnerships**
- **Official Integration**: University student portal integration
- **Bulk Booking**: Group accommodation arrangements
- **Student Services**: Comprehensive student support
- **Data Sharing**: Academic calendar integration

**Industry Partnerships**
- **Property Management**: Professional property services
- **Financial Services**: Student loan and payment solutions
- **Transportation**: Campus shuttle services
- **Technology**: Smart home technology providers

### 15.6 Development Roadmap

#### 15.6.1 Short-term Goals (3-6 months)
- [ ] Mobile app development initiation
- [ ] Payment system integration
- [ ] Advanced search implementation
- [ ] Performance optimization
- [ ] Security audit completion

#### 15.6.2 Medium-term Goals (6-12 months)
- [ ] Multi-university platform launch
- [ ] AI recommendation system
- [ ] Advanced analytics dashboard
- [ ] International expansion planning
- [ ] IoT integration pilot program

#### 15.6.3 Long-term Vision (1-2 years)
- [ ] Market leadership in student accommodation
- [ ] Global platform presence
- [ ] Comprehensive ecosystem services
- [ ] Advanced technology integration
- [ ] Sustainable business growth

---

**End of Documentation**

*This comprehensive documentation covers all aspects of the UniLodge platform from initial development to future expansion plans. For specific implementation details, refer to the source code and inline comments within each component.*

**Document Information:**
- **Created**: 2024
- **Version**: 1.0
- **Last Updated**: Current
- **Format**: Microsoft Word Compatible Markdown
- **Total Pages**: 50+