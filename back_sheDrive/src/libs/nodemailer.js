const nodemailer = require("nodemailer");

// Configuración del transporte
let transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "dd70be59324954",
    pass: "5d28dea158af33",
  },
});

exports.sendMail = async () => {
  try {
    transporter.sendMail(
      {
        html: `<div>aja</div>`,
        from: "prueba.logistica.novus@gmail.com",
        to: "andrelizyarabotache781@gmail.com",
        subject: "Prueba de Nodemailer con Mailtrap",
        text: "¡Hola! Este es un correo de prueba",
      },
      (error, info) => {
        if (error) return console.log(error);
        console.log("Correo enviado: %s", JSON.stringify(info));
      }
    );
  } catch (error) {
    throw new Error(`error sendMail:: ${error.message}`);
  }
};
