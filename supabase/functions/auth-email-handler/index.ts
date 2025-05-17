
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/denomailer@0.12.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    // If this is a webhook request from Supabase Auth
    if (url.pathname === "/auth-email-handler/handle-signup") {
      const payload = await req.json();
      
      console.log("Auth webhook received:", JSON.stringify(payload, null, 2));
      
      // Get the necessary data from the payload
      const { email, data } = payload;
      
      if (!email || !data) {
        return new Response(JSON.stringify({ error: "Invalid payload" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get user profile to include name in email if available
      const { data: userData } = await supabase.auth.admin.getUserById(data.user_id);
      const name = userData?.user?.user_metadata?.name || "User";

      // Create verification URL
      const verificationUrl = `${url.origin}/auth/v1/verify?token=${data.token_hash}&type=${data.email_action_type}&redirect_to=${data.redirect_url}`;
      
      // Send verification email using Gmail
      await sendVerificationEmail(email, name, verificationUrl);
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // For other requests to this endpoint
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process auth event",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      username: "Votiveacademy@gmail.com",
      password: Deno.env.get("GMAIL_APP_PASSWORD") || "",
      secure: true,
    });

    // Construct email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #B45309;">VedicAstro</h1>
        </div>
        <h2 style="color: #B45309; text-align: center;">Xác nhận email của bạn</h2>
        <p style="margin-bottom: 20px;">Xin chào ${userName},</p>
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
      from: "Votiveacademy@gmail.com",
      to: toEmail,
      subject: "Xác nhận email của bạn với VedicAstro",
      content: "Vui lòng xác nhận email của bạn.",
      html: emailHtml,
    });

    console.log("Verification email sent successfully to", toEmail);
    await client.close();
  } catch (error) {
    console.error("Error sending verification email:", error);
    await client.close();
    throw error;
  }
}
