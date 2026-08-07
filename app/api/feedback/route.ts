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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              /* Responsive Reset & Base Typography mapped to Cash Canopy Theme */
              body {
                font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #fafafa;
                color: #121829;
                margin: 0;
                padding: 32px 16px;
                -webkit-font-smoothing: antialiased;
              }
              .wrapper {
                max-width: 560px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                border: 1px solid #e4e4e7;
                box-shadow: 0 4px 12px rgba(18, 24, 41, 0.03);
                overflow: hidden;
              }
              .top-bar {
                height: 5px;
                background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
              }
              .container {
                padding: 32px;
              }
              .logo {
                width: 32px;
                height: 32px;
                border-radius: 8px;
              }
              .app-title {
                font-size: 20px;
                font-weight: 700;
                color: #121829;
                margin: 0;
                letter-spacing: -0.3px;
              }
              .badge {
                display: inline-block;
                background-color: #eff6ff;
                color: #2563eb;
                font-size: 11px;
                font-weight: 600;
                padding: 4px 10px;
                border-radius: 20px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .divider {
                height: 1px;
                background-color: #f4f4f5;
                margin: 24px 0;
              }
              .user-card {
                background-color: #f8fafc;
                border-radius: 10px;
                border: 1px solid #e2e8f0;
                padding: 16px;
              }
              .user-label {
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                color: #64748b;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              }
              .user-value {
                font-size: 14px;
                font-weight: 600;
                color: #121829;
                margin: 0;
              }
              .section-heading {
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                color: #64748b;
                letter-spacing: 0.6px;
                margin: 0 0 10px 0;
              }
              .message-card {
                background-color: #ffffff;
                border-left: 4px solid #10b981;
                border-top: 1px solid #f4f4f5;
                border-right: 1px solid #f4f4f5;
                border-bottom: 1px solid #f4f4f5;
                border-radius: 0 8px 8px 0;
                padding: 16px 20px;
                font-size: 14px;
                line-height: 1.6;
                color: #1e293b;
              }
              .footer {
                padding: 16px 32px;
                background-color: #f8fafc;
                border-top: 1px solid #f1f5f9;
                font-size: 12px;
                color: #94a3b8;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <!-- Cash Canopy Gradient Accent -->
              <div class="top-bar"></div>

              <div class="container">
                <!-- Branding Header -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td valign="middle">
                      <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="42" valign="middle">
                            <img src="${logoUrl}" alt="Cash Canopy" width="32" height="32" class="logo" />
                          </td>
                          <td valign="middle">
                            <h1 class="app-title">Cash Canopy</h1>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" valign="middle">
                      <span class="badge">Feedback</span>
                    </td>
                  </tr>
                </table>

                <div class="divider"></div>

                <!-- User Meta Grid -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                  <tr>
                    <td width="48%" valign="top">
                      <div class="user-card">
                        <div class="user-label">Submitted By</div>
                        <p class="user-value">${username || "Anonymous"}</p>
                      </div>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" valign="top">
                      <div class="user-card">
                        <div class="user-label">Email Address</div>
                        <p class="user-value">${email || "Not provided"}</p>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Feedback Content -->
                <p class="section-heading">User Message</p>
                <div class="message-card">
                  ${feedback.replace(/\n/g, "<br/>")}
                </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                Cash Canopy Automated System • Sent via Resend
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