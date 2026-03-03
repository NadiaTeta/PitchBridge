const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

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

// Send email function
exports.sendEmail = async ({ to, subject, template, context }) => {
  try {
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