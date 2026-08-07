import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { feedback, username, email } = await request.json();

    if (!feedback || feedback.trim() === "") {
      return NextResponse.json(
        { error: "Feedback message is required." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Feedback Form <onboarding@resend.dev>", // Replace with your domain once verified
      to: "your-email@example.com", // Your personal or support email
      subject: `New App Feedback from ${username || "User"}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>User:</strong> ${username || "Anonymous"}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${feedback.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to send feedback." },
      { status: 500 }
    );
  }
}