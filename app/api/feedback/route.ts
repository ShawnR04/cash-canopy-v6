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

    const { data, error } = await resend.emails.send({
      from: "Feedback <onboarding@resend.dev>",
      to: "shawnrimai004@gmail.com", // Set to your registered Resend email
      subject: `App Feedback from ${username || "User"}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>User:</strong> ${username || "Anonymous"}</p>
        <p><strong>User Email:</strong> ${email || "Not provided"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${feedback.replace(/\n/g, "<br/>")}</p>
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