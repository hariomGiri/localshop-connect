import nodemailer from 'nodemailer';

// Create a test account for development
const createTestAccount = async () => {
  try {
    return await nodemailer.createTestAccount();
  } catch (error) {
    console.error('Failed to create test account:', error);
    return null;
  }
};

// Create transporter
const createTransporter = async () => {
  // Check if SMTP credentials are configured in .env
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('Using configured SMTP server for email delivery');
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        // Do not fail on invalid certificates
        rejectUnauthorized: false
      }
    });
  }

  console.log('No SMTP configuration found, falling back to Ethereal test account');

  // For development, use Ethereal
  const testAccount = await createTestAccount();
  if (!testAccount) {
    console.error('Failed to create Ethereal test account, email sending will be disabled');
    return null;
  }

  console.log('Using Ethereal test account for email delivery');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// Send email
export const sendEmail = async (options) => {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      console.error('Email transporter not available');
      return {
        success: false,
        error: 'Email transporter not available'
      };
    }

    // Extract sender from EMAIL_FROM or use default
    const fromEmail = process.env.EMAIL_FROM || 'noreply@localshopconnect.com';

    const mailOptions = {
      from: fromEmail.includes('<') ? fromEmail : `"LocalShop Connect" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      // Add optional CC and BCC if provided
      ...(options.cc && { cc: options.cc }),
      ...(options.bcc && { bcc: options.bcc }),
      // Add attachments if provided
      ...(options.attachments && { attachments: options.attachments })
    };

    console.log(`Sending email to: ${options.to}`);
    console.log(`Subject: ${options.subject}`);

    const info = await transporter.sendMail(mailOptions);

    // Log URL for Ethereal test emails
    if (info.messageId && nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      console.log('Email sent successfully!');
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } else {
      console.log('Email sent successfully! Message ID:', info.messageId);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : null
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email'
    };
  }
};

// Shop approval email template
export const sendShopApprovalEmail = async (shop, user) => {
  try {
    if (!shop || !user || !user.email) {
      console.error('Missing required data for approval email:', { shop, user });
      return {
        success: false,
        error: 'Missing required shop or user data'
      };
    }

    const subject = 'Your Shop Has Been Approved!';
    const text = `
      Congratulations ${user.name}!

      Your shop "${shop.name}" has been approved and is now live on LocalShop Connect.

      You can now start adding products and managing your shop.

      Thank you for joining our community!

      Best regards,
      The LocalShop Connect Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Congratulations ${user.name}!</h2>
        <p>Your shop <strong>"${shop.name}"</strong> has been approved and is now live on LocalShop Connect.</p>
        <p>You can now start adding products and managing your shop.</p>
        <div style="margin: 30px 0;">
          <a href="http://localhost:8080/shopkeeper/dashboard" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Go to Shop Dashboard
          </a>
        </div>
        <p>Thank you for joining our community!</p>
        <p>Best regards,<br>The LocalShop Connect Team</p>
      </div>
    `;

    console.log(`Sending shop approval email to ${user.email} for shop "${shop.name}"`);

    return await sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  } catch (error) {
    console.error('Error sending shop approval email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send shop approval email'
    };
  }
};

// Shop rejection email template
export const sendShopRejectionEmail = async (shop, user, reason) => {
  try {
    if (!shop || !user || !user.email) {
      console.error('Missing required data for rejection email:', { shop, user });
      return {
        success: false,
        error: 'Missing required shop or user data'
      };
    }

    const subject = 'Update on Your Shop Application';
    const text = `
      Dear ${user.name},

      We've reviewed your application for "${shop.name}" and unfortunately, we are unable to approve it at this time.

      Reason: ${reason || 'Your shop does not meet our current requirements.'}

      You can update your shop details and resubmit your application.

      If you have any questions, please contact our support team.

      Best regards,
      The LocalShop Connect Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Update on Your Shop Application</h2>
        <p>Dear ${user.name},</p>
        <p>We've reviewed your application for <strong>"${shop.name}"</strong> and unfortunately, we are unable to approve it at this time.</p>
        <p><strong>Reason:</strong> ${reason || 'Your shop does not meet our current requirements.'}</p>
        <p>You can update your shop details and resubmit your application.</p>
        <div style="margin: 30px 0;">
          <a href="http://localhost:8080/create-shop" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Update Shop Details
          </a>
        </div>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The LocalShop Connect Team</p>
      </div>
    `;

    console.log(`Sending shop rejection email to ${user.email} for shop "${shop.name}"`);

    return await sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  } catch (error) {
    console.error('Error sending shop rejection email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send shop rejection email'
    };
  }
};

// Test email function to verify SMTP configuration
export const sendTestEmail = async (recipientEmail) => {
  try {
    if (!recipientEmail) {
      return {
        success: false,
        error: 'Recipient email is required'
      };
    }

    const subject = 'LocalShop Connect - Email Configuration Test';
    const text = `
      This is a test email from LocalShop Connect.

      If you're receiving this email, it means your email configuration is working correctly.

      Time sent: ${new Date().toLocaleString()}

      Best regards,
      The LocalShop Connect Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Email Configuration Test</h2>
        <p>This is a test email from LocalShop Connect.</p>
        <p>If you're receiving this email, it means your email configuration is working correctly.</p>
        <p><strong>Time sent:</strong> ${new Date().toLocaleString()}</p>
        <hr style="border: 1px solid #f0f0f0; margin: 20px 0;" />
        <p>Best regards,<br>The LocalShop Connect Team</p>
      </div>
    `;

    console.log(`Sending test email to ${recipientEmail}`);

    return await sendEmail({
      to: recipientEmail,
      subject,
      text,
      html
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send test email'
    };
  }
};