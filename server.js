// server.js - MERGED (Nodemailer + MongoDB/Mongoose)

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

// --- Database Imports (Sequelize/Postgres) ---
const { connectDB } = require('./config/db');
const Message = require('./models/Message');

// --- Initialize and Connect Database ---
connectDB();

const app = express();
const port = process.env.PORT || 999; 

// --- Express Middlewares ---
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse incoming JSON data (from frontend fetch)
app.use(express.json());
// Middleware to parse URL-encoded data (traditional form data)
app.use(express.urlencoded({ extended: true }));

// --- Nodemailer Transporter Setup ---
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

    // 1. Basic Validation
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    // 2. Database Saving Logic (New Feature)
    try {
        await Message.create({
            name,
            email,
            message
        });
        console.log(`[DB] Message saved successfully from: ${name}`);
    } catch (dbError) {
        console.error('[DB ERROR] Failed to save message:', dbError);
        // You can still try to send the email, but warn the admin.
        // Or, you can return an error here if saving is critical:
        // return res.status(500).send('Database connection failed.'); 
    }

    // 3. Email Sending Logic
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECIPIENT_EMAIL, 
        subject: `[Portfolio] New Contact from: ${name}`,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[Email] Email successfully sent to admin.`);

        // Success response
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Success</title><meta http-equiv="refresh" content="3;url=/index.html#contact"></head>
            <body style="background: #0d0c24; color: #f3f3f3; font-family: sans-serif; text-align: center; padding-top: 50px;">
                <script>alert('Thank you for your message! I will get back to you soon.');</script>
                <h1>✅ Message Sent Successfully!</h1>
                <p>Your message was saved to the database and sent via email.</p>
                <p>Redirecting back to the portfolio in 3 seconds...</p>
            </body>
            </html>
        `);
    } catch (emailError) {
        console.error('[EMAIL ERROR] Error sending email:', emailError);
        // Error response (retains the database logic, only email failed)
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Error</title><meta http-equiv="refresh" content="5;url=/index.html#contact"></head>
            <body style="background: #0d0c24; color: #f3f3f3; font-family: sans-serif; text-align: center; padding-top: 50px;">
                <script>alert('Failed to send message via email, but it was SAVED to the database.');</script>
                <h1>⚠️ Submission Error</h1>
                <p>An error occurred while sending the email. Message was still saved. Redirecting in 5 seconds...</p>
            </body>
            </html>
        `);
    }
});

// --- Server Startup ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Portfolio backend ready.');
});