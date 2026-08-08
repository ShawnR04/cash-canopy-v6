import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as React from "react";
import FeedbackEmail from "@/emails/FeedbackEmail";

export async function POST(request: Request) {
  try {
    const { feedback, username, email } = await request.json();

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    // Production Resend call using your verified domain
    const { data, error } = await resend.emails.send({
      from: "CashCanopy Feedback <feedback@cashcanopy.dev>",
      to: ["cashcanopydev@gmail.com"],
      replyTo: email || undefined, // Allows you to hit "Reply" in Gmail to directly answer the user
      subject: `App Feedback from ${username || "User"}`,
      react: React.createElement(FeedbackEmail, { username, email, feedback }),
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("✅ Feedback email sent successfully! ID:", data?.id);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ Server Exception:", err);
    return NextResponse.json(
      { error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}