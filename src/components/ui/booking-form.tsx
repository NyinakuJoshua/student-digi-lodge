import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, Mail, Phone, GraduationCap, CalendarDays, MessageSquare, CreditCard } from "lucide-react";

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

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  hostel: {
    id: string;
    name: string;
    price_per_semester: number;
    price_per_month?: number;
  };
}

export function BookingForm({ isOpen, onClose, hostel }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      full_name: "",
      email: user?.email || "",
      phone: "",
      student_id: "",
      check_in_date: "",
      check_out_date: "",
      room_type: "",
      special_requests: "",
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a booking.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get user profile to link the booking
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error("User profile not found");
      }

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

      if (error) {
        throw error;
      }

      toast({
        title: "Booking Submitted Successfully!",
        description: `Your booking request for ${hostel.name} has been submitted. The hostel owner will contact you soon.`,
      });

      reset();
      onClose();
    } catch (error: any) {
      console.error("Booking submission error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Book {hostel.name}
          </DialogTitle>
          <DialogDescription>
            Fill out the form below to request a booking. The hostel owner will contact you to confirm your reservation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="full_name"
              {...register("full_name")}
              placeholder="Enter your full name"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student_id" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Student ID (Optional)
            </Label>
            <Input
              id="student_id"
              {...register("student_id")}
              placeholder="Enter your student ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="check_in_date" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Preferred Check-in Date *
            </Label>
            <Input
              id="check_in_date"
              type="date"
              {...register("check_in_date")}
            />
            {errors.check_in_date && (
              <p className="text-sm text-destructive">{errors.check_in_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="check_out_date" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Expected Check-out Date (Optional)
            </Label>
            <Input
              id="check_out_date"
              type="date"
              {...register("check_out_date")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room_type" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Preferred Room Type (Optional)
            </Label>
            <Input
              id="room_type"
              {...register("room_type")}
              placeholder="e.g., Single, Shared, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requests" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Special Requests (Optional)
            </Label>
            <Textarea
              id="special_requests"
              {...register("special_requests")}
              placeholder="Any special requirements or requests..."
              rows={3}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Semester Rate:</span>
              <span className="text-lg font-bold text-primary">
                ₵{hostel.price_per_semester.toLocaleString()}
              </span>
            </div>
            {hostel.price_per_month && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-muted-foreground">Monthly Rate:</span>
                <span className="text-sm text-muted-foreground">
                  ₵{hostel.price_per_month.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}