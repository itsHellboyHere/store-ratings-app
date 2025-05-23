const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

exports.sendCredentialsEmail = async (to, email, password) => {
    const info = await transporter.sendMail({
        from: `"Store App Team" <${process.env.MAIL_USER}>`,
        to,
        subject: "Welcome to Store App – Your Login Credentials Inside",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #f5f7fa
;">
          <h2 style="color: #4CAF50;">Welcome to Store App 🎉</h2>
          <p>Hello,</p>
          <p>Your account has been successfully created. Please find your login credentials below:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Temporary Password:</strong> ${password}</li>
          </ul>
          <p><strong>Important:</strong> You will be prompted to change your password the first time you log in.</p>
          <p>We’re excited to have you on board. If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The Store App Team</p>
          <hr />
          <small style="color: #777;">This is an automated email. Please do not reply directly to this message.</small>
        </div>
      `,
    });

    console.log("Email sent:", info.messageId);
};
