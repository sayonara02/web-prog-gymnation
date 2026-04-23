const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @POST   /api/contacts
// Create a new contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      status: 'new',
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully!',
      contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
});

module.exports = router;
