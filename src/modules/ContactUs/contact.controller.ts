/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import httpStatus from 'http-status';
import config from '../../app/config';
import AppError from '../../errors/AppError';

const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required.',
      });
      return;
    }

    // create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.SMTP_USER, // your app's email (sender)
        pass: config.SMTP_PASS,
      },
    });

    const mailOptions: SendMailOptions = {
      from: `"${name}" <${config.SMTP_USER}>`, // mail appears from your Gmail but shows user's name
      to: process.env.CONTACT_RECEIVER_EMAIL || config.SMTP_USER, // ✅ your receiving email
      subject: `New message from ${name}`,
      text: `
You received a new message from your website contact form:

Name: ${name}
Email: ${email}

Message:
${message}
      `,
      replyTo: email, // ✅ allows you to click "Reply" to email the client directly
    };

    const info: SentMessageInfo = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Message sent successfully.',
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending email.');
  }
};

export const contactControllers = { sendMessage };
