const nodemailer = require("nodemailer");


// ==========================================
// Gmail transporter
// ==========================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
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


module.exports = {
    sendPasswordResetCode
};