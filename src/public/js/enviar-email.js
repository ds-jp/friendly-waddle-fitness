const nodemailer = require("nodemailer");
require("dotenv").config();

function enviarEmail(nome, email, assunto, mensagem) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    to: process.env.RECIPIENT_EMAIL,
    subject: "Contato do Friendly Waddle Fitness: " + assunto,
    html: `
      <html>
        <head>
          <style>
            img {
              width: 50px;
            }
            .footer {
              font-size: 12px;
              color: #666666;
            }
          </style>
        </head>
        <body>
          <h2>Informações do Contato:</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <div>
            <p><strong>Mensagem:</strong></p>
            <p>${mensagem}</p>
          </div>
          <hr>
          <img src="cid:fwf" alt="Logo do Friendly Waddle Fitness">
          <p class="footer">Friendly Waddle Fitness</p>
        </body>
      </html>
    `,
    attachments: [
      {
        filename: "ByMsdr0.png",
        path: "http://i.imgur.com/ByMsdr0.jpg",
        cid: "fwf",
      },
    ],
  };

  return transporter.sendMail(mailOptions);
}

module.exports = enviarEmail;
