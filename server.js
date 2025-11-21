// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// --- Middlewares ---
// Serve static files (your HTML, CSS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Optional explicit route (not required if using express.static)
app.get('/certifications', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'certifications.html'));
});

// --- NodeMailer Transporter Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});

// --- Contact Form Submission Route ---
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // 1. Basic validation
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    // 2. Email content preparation
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL, 
        subject: `New Contact from Portfolio: ${name}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    // 3. Send email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent from ${name}.`);

        // Success response with client-side alert and redirect
        res.send(`
            <!DOCTYPE html>
            <html>
            <head><title>Success</title><meta http-equiv="refresh" content="3;url=/index.html#contact"></head>
            <body>
                <script>alert('Thank you for your message! I will get back to you soon.');</script>
                <h1>Message Sent Successfully!</h1>
                <p>Redirecting back to the contact page in 3 seconds...</p>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Error</title><meta http-equiv="refresh" content="5;url=/index.html#contact"></head>
            <body>
                <script>alert('Failed to send message. Please try emailing directly.');</script>
                <h1>Email Sending Failed</h1>
                <p>An error occurred. Please try again later or email me directly.</p>
                <p>Redirecting in 5 seconds...</p>
            </body>
            </html>
        `);
    }
});

// --- Server Startup ---
const port = 999;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Portfolio ready. Test the contact form!');
});