import nodemailer from 'nodemailer';
import connectDB from '../config/db.js';
import { newsletterWelcomeTemplate } from '../config/emailTemplates.js';

export const subscribeNewsletter = async (req, res) => {
  try {
    await connectDB();

    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `Aneuro <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Aneuro Newsletter',
      html: newsletterWelcomeTemplate({
        recipientName: email.split('@')[0],
        unsubscribeUrl: `${process.env.FRONTEND_URL || 'https://aneuro.io'}/unsubscribe`,
      }),
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Subscription email sent' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};


