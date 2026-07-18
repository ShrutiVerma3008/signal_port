import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "shruti.vermabtech23@gsv.ac.in";

    // 1. Send via Resend API if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: receiverEmail,
          subject: `Portfolio Transmission: ${subject || "No Subject"}`,
          html: `
            <h3>New Transmission Received</h3>
            <p><strong>Passenger Name:</strong> ${name}</p>
            <p><strong>Contact Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || "None"}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          `,
        }),
      });

      if (res.ok) {
        return NextResponse.json({ success: true, provider: "resend" });
      } else {
        const errData = await res.json();
        console.error("Resend API failure details:", errData);
        throw new Error(errData.message || "Failed to transmit via Resend");
      }
    }

    // 2. Send via Web3Forms API if WEB3FORMS_ACCESS_KEY is configured
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          name: name,
          email: email,
          subject: `Portfolio Transmission: ${subject || "No Subject"}`,
          message: message,
          from_name: "Portfolio Contact System",
        }),
      });

      if (res.ok) {
        return NextResponse.json({ success: true, provider: "web3forms" });
      } else {
        const errData = await res.json();
        console.error("Web3Forms API failure details:", errData);
        throw new Error(errData.message || "Failed to transmit via Web3Forms");
      }
    }

    // 3. Fallback: Server configuration error if neither service is set up
    return NextResponse.json(
      { 
        error: "Transmission line not configured. Please set RESEND_API_KEY or WEB3FORMS_ACCESS_KEY env variables to enable form delivery." 
      }, 
      { status: 501 }
    );

  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Internal transmission error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
