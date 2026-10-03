const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});


// ==========================================
// Verify email configuration
// ==========================================

transporter.verify((error, success) => {

    if (error) {

        console.error(
            "❌ EMAIL CONFIGURATION ERROR:",
            error.message
        );

    } else {

        console.log(
            "✅ Email server is ready"
        );

    }

});


// ==========================================
// Send password reset OTP
// ==========================================

const sendPasswordResetCode = async (
    email,
    code
) => {

    const mailOptions = {

        from: `"AlgoCraft" <${process.env.EMAIL_USER}>`,

        to: email,

        subject: "AlgoCraft Password Reset Code",

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                background: #f5f5f5;
            ">

                <div style="
                    background: #111;
                    padding: 25px;
                    border-radius: 12px;
                    color: white;
                ">

                    <h1 style="margin-top: 0;">
                        AlgoCraft
                    </h1>

                    <p style="color: #ccc;">
                        Password Reset Request
                    </p>

                    <p>
                        We received a request to reset your
                        AlgoCraft password.
                    </p>

                    <div style="
                        background: #222;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        margin: 25px 0;
                    ">

                        <p style="color: #aaa;">
                            Your verification code
                        </p>

                        <h2 style="
                            letter-spacing: 8px;
                            font-size: 32px;
                            margin: 10px 0;
                        ">
                            ${code}
                        </h2>

                    </div>

                    <p style="color: #aaa;">
                        This code expires in 10 minutes.
                    </p>

                    <p style="color: #aaa;">
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                </div>

            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};
// ==========================================
// Send Contact Form Message
// ==========================================

const sendContactMessage = async ({
    name,
    email,
    subject,
    message
}) => {

    const mailOptions = {

        from: `"AlgoCraft Contact Form" <${process.env.EMAIL_USER}>`,

        // Your email will receive the message
        to: process.env.EMAIL_USER,

        // If you click Reply, it will reply to the user
        replyTo: email,

        subject: `AlgoCraft Contact: ${subject}`,

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 650px;
                margin: auto;
                padding: 30px;
                background: #f5f5f5;
            ">

                <div style="
                    background: #111;
                    padding: 30px;
                    border-radius: 14px;
                    color: white;
                ">

                    <h1 style="
                        margin-top: 0;
                        color: #ffffff;
                    ">
                        AlgoCraft
                    </h1>

                    <p style="
                        color: #aaa;
                        font-size: 14px;
                    ">
                        New Contact Form Message
                    </p>

                    <div style="
                        background: #222;
                        padding: 20px;
                        border-radius: 10px;
                        margin-top: 20px;
                    ">

                        <p>
                            <strong>Name:</strong>
                            ${name}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${email}
                        </p>

                        <p>
                            <strong>Subject:</strong>
                            ${subject}
                        </p>

                    </div>

                    <div style="
                        background: #222;
                        padding: 20px;
                        border-radius: 10px;
                        margin-top: 15px;
                    ">

                        <p style="color: #aaa;">
                            Message
                        </p>

                        <p style="
                            white-space: pre-wrap;
                            line-height: 1.6;
                        ">
                            ${message}
                        </p>

                    </div>

                    <p style="
                        color: #888;
                        font-size: 13px;
                        margin-top: 25px;
                    ">
                        This message was sent through the
                        AlgoCraft Contact page.
                    </p>

                </div>

            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};


module.exports = {
    sendPasswordResetCode,
     sendContactMessage
};