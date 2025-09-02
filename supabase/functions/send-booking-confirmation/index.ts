import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  studentEmail: string;
  studentName: string;
  hostelName: string;
  checkInDate: string;
  checkOutDate?: string;
  roomType?: string;
  totalAmount: number;
  bookingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      studentEmail,
      studentName,
      hostelName,
      checkInDate,
      checkOutDate,
      roomType,
      totalAmount,
      bookingId
    }: BookingConfirmationRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "UniLodge <onboarding@resend.dev>",
      to: [studentEmail],
      subject: `Booking Confirmation - ${hostelName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Booking Confirmed!</h1>
          
          <p>Dear ${studentName},</p>
          
          <p>Great news! Your booking has been confirmed. Here are your booking details:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e40af; margin-top: 0;">Booking Details</h2>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Hostel:</strong> ${hostelName}</p>
            <p><strong>Check-in Date:</strong> ${new Date(checkInDate).toLocaleDateString()}</p>
            ${checkOutDate ? `<p><strong>Check-out Date:</strong> ${new Date(checkOutDate).toLocaleDateString()}</p>` : ''}
            ${roomType ? `<p><strong>Room Type:</strong> ${roomType}</p>` : ''}
          </div>
          
          <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #dc2626; margin-top: 0;">Payment Required</h3>
            <p style="font-size: 18px; font-weight: bold;">Amount Due: GH₵${totalAmount.toFixed(2)}</p>
            <p>Please contact the hostel directly to arrange payment and finalize your booking.</p>
          </div>
          
          <p>If you have any questions about your booking, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The UniLodge Team</strong>
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>This is an automated email confirmation. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    });

    console.log("Booking confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);