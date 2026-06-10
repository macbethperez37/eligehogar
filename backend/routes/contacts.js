const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { getDB } = require('../config/database');

const router = express.Router();

// Create transporter for email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().trim(),
  body('subject').trim().isLength({ min: 2 }).withMessage('Subject must be at least 2 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, phone, subject, message, propertyId, newsletter } = req.body;
    const db = getDB();

    // Insert contact into database
    const [result] = await db.execute(
      `INSERT INTO contacts (name, email, phone, message, property_id, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, message, propertyId || null, 'new', new Date()]
    );

    const contactId = result.insertId;

    // Send email notification
    const transporter = createTransporter();

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Nuevo contacto: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">Nuevo Contacto Web</h2>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Información del Contacto</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
            <p><strong>Asunto:</strong> ${subject}</p>
            ${propertyId ? `<p><strong>Propiedad de Interés:</strong> ID: ${propertyId}</p>` : ''}
          </div>

          <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
            <h3 style="color: #333; margin-top: 0;">Mensaje</h3>
            <p style="line-height: 1.6; color: #666;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 8px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}<br>
              <strong>Hora:</strong> ${new Date().toLocaleTimeString('es-ES')}<br>
              <strong>IP:</strong> ${req.ip}
            </p>
          </div>
        </div>
      `
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Gracias por contactar con Luxe Estate',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 40px 20px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 600;">LUXE ESTATE</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Lujo y Exclusividad en Cada Detalle</p>
          </div>

          <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #007bff; padding-bottom: 15px;">Gracias por Contactarnos</h2>
            <p>Hemos recibido tu mensaje y un asesor personal se pondrá en contacto contigo a la brevedad para ayudarte con tu consulta.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin-top: 0;">Resumen de tu mensaje</h3>
              <p><strong>Asunto:</strong> ${subject}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          <div style="text-align: center; padding: 20px;">
            <p style="color: #666; margin-bottom: 20px;">¿Necesitas ayuda inmediata?</p>
            <p style="font-size: 18px; font-weight: 600; color: #007bff;">+34 900 123 456</p>
            <p style="color: #666; font-size: 14px;">Lunes - Viernes: 9:00 - 18:00</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #f1f3f4; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Este es un correo automático. Por favor, no respondas a esta dirección.
            </p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
              © 2026 Luxe Estate. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `
    };

    try {
      // Send emails
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(userMailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Contact submitted successfully. We will get back to you soon.',
      data: {
        id: contactId,
        name: name,
        email: email
      }
    });

  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get all contacts (admin only)
// @route   GET /api/contacts
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, status } = req.query;

    let whereClause = '';
    let params = [];

    if (status) {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    const offset = (page - 1) * limit;

    const [contacts] = await db.execute(
      `SELECT * FROM contacts ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM contacts ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    res.json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: contacts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Get single contact
// @route   GET /api/contacts/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const [contacts] = await db.execute(
      'SELECT * FROM contacts WHERE id = ?',
      [req.params.id]
    );

    if (contacts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contacts[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Update contact status
// @route   PUT /api/contacts/:id/status
// @access  Private
router.put('/:id/status', [
  body('status').isIn(['new', 'contacted', 'converted']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { status } = req.body;

    const db = getDB();
    const [result] = await db.execute(
      'UPDATE contacts SET status = ?, updated_at = ? WHERE id = ?',
      [status, new Date(), req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    // Get updated contact
    const [updatedContacts] = await db.execute(
      'SELECT * FROM contacts WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: updatedContacts[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;