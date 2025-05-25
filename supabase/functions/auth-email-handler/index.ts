/// <reference types="https://deno.land/x/types/index.d.ts" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.window" />

import { serve } from "std/http/server.ts";
import { SmtpClient } from "denomailer";
import { createClient } from "@supabase/supabase-js";
import { RateLimiter } from "rate_limiter";

// Get environment variables
const ALLOWED_ORIGINS = Deno.env.get("ALLOWED_ORIGINS")?.split(",") || ["http://localhost:3000"];
const SMTP_USER = Deno.env.get("SMTP_USER") || "";
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD") || "";
const SMTP_FROM = Deno.env.get("SMTP_FROM") || "";

// Configure CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0], // Default to first allowed origin
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Vary": "Origin" // Important for CDN caching
};

// Configure rate limiter (100 requests per 15 minutes)
const limiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Check origin
  const origin = req.headers.get("Origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Apply rate limiting
    const clientIP = req.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await limiter.tryRemoveTokens(clientIP, 1);
    
    if (!rateLimitResult) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "Please try again later"
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const url = new URL(req.url);
    
    // Validate request method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // If this is a webhook request from Supabase Auth
    if (url.pathname === "/auth-email-handler/handle-signup") {
      const payload = await req.json();
      
      // Validate payload
      if (!payload || typeof payload !== "object") {
        return new Response(
          JSON.stringify({ error: "Invalid payload format" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      console.log("Auth webhook received:", JSON.stringify(payload, null, 2));
      
      const { email, data } = payload;
      
      // Validate required fields
      if (!email || !data || typeof email !== "string") {
        return new Response(
          JSON.stringify({ 
            error: "Invalid payload",
            message: "Email and data are required"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ 
            error: "Invalid email format",
            message: "Please provide a valid email address"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      try {
        // Get user profile to include name in email if available
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(data.user_id);
        
        if (userError) {
          throw new Error(`Error fetching user data: ${userError.message}`);
        }

        const name = userData?.user?.user_metadata?.name || "User";

        // Create verification URL
        const verificationUrl = `${url.origin}/auth/v1/verify?token=${data.token_hash}&type=${data.email_action_type}&redirect_to=${data.redirect_url}`;
        
        // Send verification email using Gmail
        await sendVerificationEmail(email, name, verificationUrl);
        
        return new Response(
          JSON.stringify({ success: true }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      } catch (error) {
        console.error("Error processing signup:", error);
        return new Response(
          JSON.stringify({
            error: "Failed to process signup",
            message: error instanceof Error ? error.message : "Unknown error"
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }
    
    // For other requests to this endpoint
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process auth event",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

async function sendVerificationEmail(
  toEmail: string, 
  userName: string,
  verificationUrl: string
) {
  // Create SMTP client for Gmail
  const client = new SmtpClient();
  
  try {
    await client.connect({
      hostname: "smtp.gmail.com",
      port: 465,
      username: SMTP_USER,
      password: SMTP_PASSWORD,
      secure: true,
    });

    // Construct email HTML with sanitized inputs
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #B45309;">VedicAstro</h1>
        </div>
        <h2 style="color: #B45309; text-align: center;">Xác nhận email của bạn</h2>
        <p style="margin-bottom: 20px;">Xin chào ${userName.replace(/[<>]/g, '')},</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản với VedicAstro. Để hoàn tất việc đăng ký, vui lòng xác nhận email của bạn bằng cách nhấn vào nút bên dưới:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="display: inline-block; background-color: #B45309; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Xác nhận Email</a>
        </div>
        <p>Hoặc bạn có thể dán liên kết này vào trình duyệt của mình:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; word-break: break-all;">
          ${verificationUrl}
        </p>
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Liên kết này sẽ hết hạn sau 24 giờ.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; font-size: 0.8em; color: #666;">
          <p>© ${new Date().getFullYear()} VedicAstro. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    `;

    await client.send({
      from: SMTP_FROM,
      to: toEmail,
      subject: "Xác nhận email của bạn với VedicAstro",
      content: "Vui lòng xác nhận email của bạn.",
      html: emailHtml,
    });

    console.log("Verification email sent successfully to", toEmail);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  } finally {
    await client.close();
  }
}
