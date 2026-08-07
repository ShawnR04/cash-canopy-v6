import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const { feedback, username, email } = await request.json();

    if (!feedback || feedback.trim() === "") {
      return NextResponse.json(
        { error: "Feedback content is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is missing in environment variables.");
      return NextResponse.json(
        { error: "Server misconfiguration. API key missing." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Dynamic origin detection, or fallback to your production URL
    const origin = request.headers.get("origin") || "https://cash-canopy.vercel.app";
    const logoUrl = `${origin}/favicon.ico`; 

    const { data, error } = await resend.emails.send({
      from: "CashCanopy Feedback <onboarding@resend.dev>",
      to: "shawnrimai004@gmail.com",
      subject: `App Feedback from ${username || "User"}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; }
              .container { max-width: 550px; background: #ffffff; margin: 0 auto; padding: 24px; border-radius: 8px; border: 1px solid #e4e4e7; }
              .header { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid #e4e4e7; }
              .logo { width: 36px; height: 36px; border-radius: 6px; }
              .title { font-size: 20px; font-weight: 700; color: #18181b; margin: 0; }
              .content { padding-top: 20px; }
              .user-info { background-color: #f8fafc; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 16px; font-size: 14px; color: #334155; }
              .message-box { font-size: 15px; line-height: 1.6; color: #0f172a; white-space: pre-wrap; background: #ffffff; padding: 12px; border-left: 4px solid #10b981; }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header with App Logo & Title -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="48" valign="middle">
                    <img src="${logoUrl}" alt="Cash Canopy Logo" width="36" height="36" style="display: block; border-radius: 6px;" />
                  </td>
                  <td valign="middle">
                    <h1 class="title">Cash Canopy</h1>
                  </td>
                </tr>
              </table>

              <div class="content">
                <div class="user-info">
                  <p style="margin: 0 0 6px 0;"><strong>User:</strong> ${username || "Anonymous"}</p>
                  <p style="margin: 0;"><strong>Email:</strong> ${email || "Not provided"}</p>
                </div>

                <p style="font-size: 14px; font-weight: 600; color: #64748b; margin-bottom: 8px;">FEEDBACK MESSAGE:</p>
                <div class="message-box">
                  ${feedback.replace(/\n/g, "<br/>")}
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend delivery error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to deliver email." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}