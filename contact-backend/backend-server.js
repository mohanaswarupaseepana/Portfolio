const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ origin: true }));
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Helpers to validate input
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!isValidString(name) || !isValidEmail(email) || !isValidString(message)) {
    return res.status(400).json({ error: 'Invalid input. Please fill all fields correctly.' });
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: 'mohanaswarupa2005@gmail.com', // Your email address to receive submissions
    subject: `New Contact Form Submission from ${name}`,
    text: `
You have received a new message from your portfolio contact form:

Name: ${name}
Email: ${email}

Message:
${message}
    ` 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
    res.status(200).json({ message: 'Contact form submitted successfully and email sent.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
