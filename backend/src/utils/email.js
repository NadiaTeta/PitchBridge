const nodemailer = require('nodemailer');

// Real SMTP: use Gmail, SendGrid, Outlook, or your provider. Set in .env (not Mailtrap).
const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
const secure = port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port,
  secure,
  auth: process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
    ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
    : undefined
});

function ensureEmailConfigured() {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error(
      'Email is not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in .env for real delivery (e.g. Gmail, SendGrid).'
    );
  }
  const host = (process.env.EMAIL_HOST || '').toLowerCase();
  if (host.includes('mailtrap')) {
    throw new Error(
      'Mailtrap is not allowed. Update your .env to use real SMTP so verification emails go to users\' real inboxes. ' +
      'Use Gmail (smtp.gmail.com + App Password), SendGrid, Outlook, or another provider. See backend/.env.example.'
    );
  }
}

// Email templates
const templates = {
  emailVerification: (name, verificationCode) => ({
    subject: 'PitchBridge - Verify Your Email',
    html: `
      <h2>Welcome to PitchBridge, ${name}!</h2>
      <p>Thank you for registering. Please use the following code to verify your email:</p>
      <h1 style="color: #2563eb; font-size: 32px;">${verificationCode}</h1>
      <p>This code will expire in 30 minutes.</p>
      <p>If you didn't create an account, please ignore this email.</p>
    `
  }),
  
  passwordReset: (name, resetToken) => ({
    subject: 'PitchBridge - Password Reset Request',
    html: `
      <h2>Hello ${name},</h2>
      <p>We received a request to reset your password. Use the following token:</p>
      <h3>${resetToken}</h3>
      <p>This token will expire in 30 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  }),
  
  projectApproved: (name, projectName) => ({
    subject: 'PitchBridge - Your Project Has Been Approved!',
    html: `
      <h2>Congratulations ${name}!</h2>
      <p>Your project "<strong>${projectName}</strong>" has been approved and is now live on PitchBridge.</p>
      <p>Investors can now view and connect with your project.</p>
      <p>Good luck with your fundraising!</p>
    `
  }),
  
  projectRejected: (name, projectName, reason) => ({
    subject: 'PitchBridge - Project Status Update',
    html: `
      <h2>Hello ${name},</h2>
      <p>Unfortunately, your project "<strong>${projectName}</strong>" was not approved.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>You can update your project and resubmit for review.</p>
    `
  }),
  
  newInvestment: (entrepreneurName, investorName, projectName, amount) => ({
    subject: 'PitchBridge - New Investment in Your Project!',
    html: `
      <h2>Great news, ${entrepreneurName}!</h2>
      <p><strong>${investorName}</strong> has expressed interest in investing in your project "${projectName}".</p>
      <p><strong>Investment Amount:</strong> RWF ${amount.toLocaleString()}</p>
      <p>You can now connect with the investor through the PitchBridge chat.</p>
    `
  })
};

// Send email function (uses real SMTP – emails go to the recipient's actual inbox)
exports.sendEmail = async ({ to, subject, template, context }) => {
  try {
    ensureEmailConfigured();
    let emailContent;
    
    if (template && templates[template]) {
      emailContent = templates[template](...Object.values(context));
    } else {
      emailContent = { subject, html: context.html || context.text };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'PitchBridge <noreply@pitchbridge.rw>',
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};