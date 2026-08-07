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
      console.error("RESEND_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "Server misconfiguration. API key missing." },
        { status: 500 }
      );
    }

    // Instantiate Resend INSIDE the request handler so it won't crash during build time
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Feedback <onboarding@resend.dev>", // Replace with your verified domain in Resend
      to: "your-email@example.com",             // Your target email address
      subject: `App Feedback from ${username || "User"}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>User:</strong> ${username || "Anonymous"}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${feedback.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}