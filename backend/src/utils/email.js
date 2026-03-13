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
  }),

  accountApproved: (name) => ({
  subject: 'PitchBridge - Your Account Has Been Approved! 🎉',
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1e3a8a;">Welcome aboard, ${name}!</h2>
      <p>Great news — your PitchBridge account has been <strong>approved</strong>. You can now log in and start using the platform.</p>
      <a href="https://pitchbridge.live/login" style="display:inline-block; margin-top:16px; padding:12px 24px; background:#2563eb; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold;">
        Go to Dashboard
      </a>
      <p style="color:#64748b; font-size:13px; margin-top:24px;">If you have any questions, feel free to reach out to our support team.</p>
    </div>
  `
}),

accountRejected: (name, reason) => ({
  subject: 'PitchBridge - Account Verification Update',
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1e3a8a;">Hello ${name},</h2>
      <p>Unfortunately, we were unable to approve your PitchBridge account at this time.</p>
      <div style="background:#fef2f2; border-left:4px solid #ef4444; padding:12px 16px; border-radius:6px; margin:16px 0;">
        <strong style="color:#dc2626;">Reason:</strong>
        <p style="color:#7f1d1d; margin:4px 0 0;">${reason}</p>
      </div>
      <p>You may re-upload your documents and resubmit for review.</p>
      <a href="https://pitchbridge.live/upload-documents" style="display:inline-block; margin-top:16px; padding:12px 24px; background:#0f172a; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold;">
        Resubmit Documents
      </a>
    </div>
  `
}),

accountClarification: (name, note) => ({
  subject: 'PitchBridge - Action Required on Your Account',
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1e3a8a;">Hello ${name},</h2>
      <p>Our team has reviewed your submission and needs some clarification before we can proceed.</p>
      <div style="background:#fffbeb; border-left:4px solid #f59e0b; padding:12px 16px; border-radius:6px; margin:16px 0;">
        <strong style="color:#92400e;">What we need:</strong>
        <p style="color:#78350f; margin:4px 0 0;">${note}</p>
      </div>
      <p>Please log in and re-upload the required documents.</p>
      <a href="https://pitchbridge.live/upload-documents" style="display:inline-block; margin-top:16px; padding:12px 24px; background:#0f172a; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold;">
        Update Documents
      </a>
    </div>
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