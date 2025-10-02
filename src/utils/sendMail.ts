import nodemailer from 'nodemailer'; 

export const sendMail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Your Trade Source" send you a mail ',
    to,
    subject,
    text,
  });
};
