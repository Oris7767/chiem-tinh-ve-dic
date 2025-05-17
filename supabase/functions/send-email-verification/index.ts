
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/denomailer@0.12.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create SMTP client
const client = new SmtpClient();

const sendEmailWithGmail = async (
  to: string,
  subject: string,
  htmlBody: string
) => {
  await client.connect({
    hostname: "smtp.gmail.com",
    port: 465,
    username: "Votiveacademy@gmail.com",
    password: "rbuw mnaj ikms qkwn", // Using the app password directly
    secure: true,
  });

  await client.send({
    from: "Votiveacademy@gmail.com",
    to,
    subject,
    content: htmlBody,
    html: htmlBody,
  });

  await client.close();
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the request body
    const { email, name, verificationLink } = await req.json();

    if (!email || !verificationLink) {
      return new Response(
        JSON.stringify({ error: "Email and verification link are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Construct email content
    const subject = "Xác nhận email của bạn với VedicAstro";
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://i.imgur.com/XwCKjTI.png" alt="VedicAstro Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #B45309; text-align: center;">Xác nhận email của bạn</h2>
        <p style="margin-bottom: 20px;">Xin chào ${name || "bạn"},</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản với VedicAstro. Để hoàn tất việc đăng ký, vui lòng xác nhận email của bạn bằng cách nhấn vào nút bên dưới:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="display: inline-block; background-color: #B45309; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Xác nhận Email</a>
        </div>
        <p>Hoặc bạn có thể dán liên kết này vào trình duyệt của mình:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; word-break: break-all;">
          ${verificationLink}
        </p>
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Liên kết này sẽ hết hạn sau 24 giờ.</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; font-size: 0.8em; color: #666;">
          <p>© ${new Date().getFullYear()} VedicAstro. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    `;

    // Send the email
    await sendEmailWithGmail(email, subject, htmlBody);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
