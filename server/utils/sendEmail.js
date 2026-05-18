import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Nagar Sahayata OTP Verification",

      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Nagar Sahayata Portal</h2>

          <p>Your OTP for verification is:</p>

          <h1 style="letter-spacing:4px;color:#16a34a">
            ${otp}
          </h1>

          <p>This OTP expires in 10 minutes.</p>
        </div>
      `,
    });

    return response;

  } catch (error) {
    console.log("❌ Resend Error:", error);
    throw error;
  }
};