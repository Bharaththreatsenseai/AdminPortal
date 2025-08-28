// import nodemailer from 'nodemailer';

// const smtpServer = 'smtp.gmail.com';
// const smtpPort = 587;
// const smtpUser = 'bogirishika41@gmail.com';
// const smtpPassword = 'tsxl dxgh xbtz lxts';  // ⚠️ Consider using environment variables for security

// const toEmail = 'bharathkumar04081@gmail.com';
// const subject = 'Your Subject Here';
// const htmlBody = `
//   <p style="color: #333;">This is a <b>test email</b> sent using TypeScript.</p>
// `;

// async function sendEmail() {
//   const transporter = nodemailer.createTransport({
//     host: smtpServer,
//     port: smtpPort,
//     secure: false, // Use TLS
//     auth: {
//       user: smtpUser,
//       pass: smtpPassword,
//     },
//   });

//   const mailOptions = {
//     from: smtpUser,
//     to: toEmail,
//     subject: subject,
//     html: htmlBody,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`📧 Email sent: ${info.messageId}`);
//   } catch (error) {
//     console.error(`❌ Failed to send email: ${error}`);
//   }
// }

// sendEmail();
// import { otpVerification } from "./sendMail";
// async function i(){
// const val = await otpVerification({userName:'bharathkumar04081@gmail.com',otp:'37786'})
// console.log(val)
//  }
//  i()