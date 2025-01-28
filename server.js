const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(bodyParser.json({ limit: '10mb' }));

// Configure Nodemailer to use Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aleksadiscord1@gmail.com',  // Replace with your sender email
        pass: 'fgkm fncj hfrb qktd'  // Replace with your sender email password or app password
    }
});

// Endpoint to handle sending the email
app.post('/send-email', (req, res) => {
    const { image } = req.body; // Get the Base64 image from the request

    const mailOptions = {
        from: 'aleksadiscord1@gmail.com',  // Sender email address
        to: 'aleksa.tomic.2008@gmail.com',  // Recipient email address
        subject: 'Captured Photo',
        text: 'Here is the captured photo.',
        attachments: [
            {
                filename: 'captured-photo.png',
                content: image.split('base64,')[1],
                encoding: 'base64'
            }
        ]
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ message: 'Email sent successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
