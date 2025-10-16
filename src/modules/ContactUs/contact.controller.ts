/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import httpStatus from 'http-status';
import config from '../../app/config';
import AppError from '../../errors/AppError';

// Define a type for the mail options
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

// Controller function to handle sending message
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
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });

    const mailOptions: SendMailOptions = {
      from: email,
      to: process.env.CONTACT_RECEIVER_EMAIL || config.SMTP_USER,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
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
