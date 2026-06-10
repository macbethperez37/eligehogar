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

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
router.post('/subscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, name } = req.body;
    const db = getDB();

    // Check if already subscribed
    const [existingSubscriptions] = await db.execute(
      'SELECT * FROM newsletter_subscriptions WHERE email = ?',
      [email]
    );

    if (existingSubscriptions.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'This email is already subscribed to our newsletter'
      });
    }

    // Insert newsletter subscription
    const [result] = await db.execute(
      'INSERT INTO newsletter_subscriptions (email, created_at) VALUES (?, ?)',
      [email, new Date()]
    );

    const subscriptionId = result.insertId;

    // Send confirmation email
    const transporter = createTransporter();

    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '¡Bienvenido a la Newsletter de Luxe Estate!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 40px 20px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 600;">LUXE ESTATE</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Lujo y Exclusividad en Cada Detalle</p>
          </div>

          <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
            <h2 style="color: #28a745; margin-top: 0; border-bottom: 2px solid #28a745; padding-bottom: 15px;">¡Suscripción Exitosa!</h2>
            <p>Gracias por unirte a nuestra newsletter. Estás a punto de recibir las últimas novedades, propiedades exclusivas y oportunidades de lujo directamente en tu correo.</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="color: #007bff; margin-top: 0;">¿Qué recibirás?</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #666;">
                <li>Nuevas propiedades exclusivas</li>
                <li>Eventos y experiencias VIP</li>
                <li>Consejos de inversión inmobiliaria</li>
                <li>Ofertas especiales y lanzamientos</li>
                <li>Market trends y análisis del sector</li>
              </ul>
            </div>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">Próximo contenido</h3>
            <p style="color: #666;">En nuestra próxima newsletter te traeremos:</p>
            <p style="color: #007bff; font-weight: 600;">"Las 10 villas más exclusivas de Marbella 2026"</p>
          </div>

          <div style="text-align: center; padding: 20px;">
            <p style="color: #666; margin-bottom: 20px;">¿Necesitas ayuda personalizada?</p>
            <p style="font-size: 18px; font-weight: 600; color: #007bff;">+34 900 123 456</p>
            <p style="color: #666; font-size: 14px;">Lunes - Viernes: 9:00 - 18:00</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #f1f3f4; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Fecha de suscripción:</strong> ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}
            </p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
              © 2026 Luxe Estate. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(confirmationMailOptions);
    } catch (emailError) {
      console.error('Newsletter confirmation email failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter. Check your email for confirmation.',
      data: {
        id: subscriptionId,
        email: email,
        subscribed: true
      }
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const db = getDB();

    // Delete subscription
    const [result] = await db.execute(
      'DELETE FROM newsletter_subscriptions WHERE email = ?',
      [email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in our system'
      });
    }

    // Send unsubscribe confirmation
    const transporter = createTransporter();

    const unsubscribeMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Has cancelado tu suscripción a la newsletter de Luxe Estate',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #dc3545;">
            <h2 style="color: #dc3545; margin-top: 0;">Cancelación de Suscripción</h2>
            <p>Hemos recibido tu solicitud para cancelar la suscripción a nuestra newsletter.</p>
            <p style="margin-top: 15px;">Esperamos verte de nuevo pronto en el futuro.</p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #dee2e6;">
            <h3 style="color: #333; margin-top: 0;">¿Por qué cancelaste?</h3>
            <p style="color: #666;">Si tienes un momento, nos ayudarías mucho si nos compartes el motivo de tu decisión para mejorar nuestros servicios.</p>
            <button style="background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-top: 15px;">Enviar Feedback</button>
          </div>

          <div style="text-align: center; padding: 20px;">
            <p style="color: #666; margin-bottom: 20px;">¿Necesitas ayuda con una propiedad?</p>
            <p style="font-size: 18px; font-weight: 600; color: #007bff;">+34 900 123 456</p>
            <p style="color: #666; font-size: 14px;">Lunes - Viernes: 9:00 - 18:00</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #f1f3f4; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Fecha de cancelación:</strong> ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}
            </p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
              © 2026 Luxe Estate. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(unsubscribeMailOptions);
    } catch (emailError) {
      console.error('Unsubscribe confirmation email failed:', emailError);
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter.',
      data: {
        email: email,
        subscribed: false
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @desc    Check subscription status
// @route   GET /api/newsletter/status/:email
// @access  Public
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const db = getDB();

    const [subscriptions] = await db.execute(
      'SELECT * FROM newsletter_subscriptions WHERE email = ?',
      [email]
    );

    if (subscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Email not found'
      });
    }

    res.json({
      success: true,
      data: {
        email: subscriptions[0].email,
        subscribed: true,
        subscribeDate: subscriptions[0].created_at
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;