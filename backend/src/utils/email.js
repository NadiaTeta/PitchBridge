const nodemailer = require('nodemailer');

// 1. Configure Transporter with Production Security for Render/Cloud environments
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, 
  },
  // CRITICAL: This block prevents the 503 Service Unavailable error on Render
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000, // 10 seconds
  socketTimeout: 10000 // 10 seconds
});

// 2. Safety Check for Environment Variables
function ensureEmailConfigured() {
  const { EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD } = process.env;
  
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error(
      'Email credentials missing. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD in Render Environment.'
    );
  }

  if (EMAIL_HOST.toLowerCase().includes('mailtrap')) {
    throw new Error(
      'Mailtrap is not allowed for production. Use a real SMTP provider like Gmail or SendGrid.'
    );
  }
}

// 3. Professional Email Templates
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

// 4. Main Exported Send Function
exports.sendEmail = async ({ to, subject, template, context }) => {
  try {
    ensureEmailConfigured();
    
    // Optional: Test connection to SMTP server
    await transporter.verify();

    let emailContent;
    if (template && templates[template]) {
      // Pass context values to the template function
      emailContent = templates[template](...Object.values(context));
    } else {
      emailContent = { subject, html: context.html || context.text || '' };
    }
    
    const mailOptions = {
      // Matches the authenticated user to avoid 'unauthorized sender' flags
      from: `"PitchBridge" <${process.env.EMAIL_USER}>`, 
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ SMTP Error:', error.message);
    // Rethrow so the Auth Controller can send the 503/500 response
    throw error;
  }
};