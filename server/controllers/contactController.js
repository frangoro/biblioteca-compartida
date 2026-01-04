const nodemailer = require('nodemailer');

// Configuramos el transportador
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Para depurar
transporter.verify(function (error, success) {
  if (error) {
    console.log("Error en la configuración del correo:", error);
  } else {
    console.log("El servidor está listo para enviar correos");
  }
});

/**
 * Envía un correo electrónico con el reporte del usuario
 */
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, type, message } = req.body;

    // 1. Validaciones
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor, rellena todos los campos obligatorios.' 
      });
    }

    // 2. Configuración del contenido
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `[${type.toUpperCase()}] Nuevo reporte de ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #007bff;">Biblioteca Compartida: Nuevo Mensaje</h2>
          <p><strong>Usuario:</strong> ${name}</p>
          <p><strong>Email de contacto:</strong> ${email}</p>
          <p><strong>Categoría:</strong> ${type}</p>
          <hr />
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
        </div>
      `
    };

    // 3. Envío
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Tu mensaje ha sido enviado correctamente.' 
    });

  } catch (error) {
    console.error('Error en contactController:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al intentar enviar el correo.' 
    });
  }
};