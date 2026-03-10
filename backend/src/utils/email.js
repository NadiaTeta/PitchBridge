const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Safety Check for Environment Variables
function ensureEmailConfigured() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Email credentials missing. Please set RESEND_API_KEY in Render Environment.');
  }
}

// 2. Professional Email Templates
const templates = {
  emailVerification: (name, verificationCode) => ({
    subject: 'PitchBridge - Verify Your Email',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
        <h2 style="color: #1e3a8a;">Welcome to PitchBridge, ${name}!</h2>
        <p>Thank you for registering. Please use the following code to verify your email:</p>
        <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 5px; margin: 0;">${verificationCode}</h1>
        </div>
        <p style="color: #64748b; font-size: 14px;">This code will expire in 30 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 12px; color: #94a3b8;">If you didn't create an account, please ignore this email.</p>
      </div>
    `
  }),

  passwordReset: (name, resetToken) => ({
    subject: 'PitchBridge - Password Reset Request',
    html: `
      <h2>Hello ${name},</h2>
      <p>We received a request to reset your password. Use the following token:</p>
      <h3>${resetToken}</h3>
      <p>This token will expire in 30 minutes.</p>
    `
  }),

  projectApproved: (name, projectName) => ({
    subject: 'PitchBridge - Your Project Has Been Approved!',
    html: `
      <h2>Congratulations ${name}!</h2>
      <p>Your project "<strong>${projectName}</strong>" has been approved and is now live on PitchBridge.</p>
    `
  }),

  projectRejected: (name, projectName, reason) => ({
    subject: 'PitchBridge - Project Status Update',
    html: `
      <h2>Hello ${name},</h2>
      <p>Unfortunately, your project "<strong>${projectName}</strong>" was not approved.</p>
      <p><strong>Reason:</strong> ${reason}</p>
    `
  }),

  newInvestment: (entrepreneurName, investorName, projectName, amount) => ({
    subject: 'PitchBridge - New Investment Interest',
    html: `
      <h2>Great news, ${entrepreneurName}!</h2>
      <p><strong>${investorName}</strong> is interested in "${projectName}".</p>
      <p><strong>Amount:</strong> RWF ${amount.toLocaleString()}</p>
    `
  })
};

// 3. Main Exported Send Function
exports.sendEmail = async ({ to, subject, template, context }) => {
  try {
    ensureEmailConfigured();

    let emailContent;
    if (template && templates[template]) {
      emailContent = templates[template](...Object.values(context));
    } else {
      emailContent = { subject, html: context.html || context.text || '' };
    }

    const { data, error } = await resend.emails.send({
      from: 'PitchBridge <noreply@pitchbridge.live>', // Replace with your domain once verified
      to,
      subject: emailContent.subject,
      html: emailContent.html
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`✅ Email sent successfully: ${data.id}`);
    return data;
  } catch (error) {
    console.error('❌ Email Error:', error.message);
    throw error;
  }
};