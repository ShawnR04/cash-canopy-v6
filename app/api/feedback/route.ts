import { NextResponse } from "next/server";
import { Resend } from "resend";
import { FeedbackEmail } from "@/emails/FeedbackEmail";

export async function POST(request: Request) {
  try {
    const { feedback, username, email } = await request.json();

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "CashCanopy Feedback <onboarding@resend.dev>",
      to: "shawnrimai004@gmail.com",
      subject: `App Feedback from ${username || "User"}`,
      react: FeedbackEmail({ username, email, feedback }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}