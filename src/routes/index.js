const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const data = {
    title: "FriendlyWaddle Fitness",
    name: "Teste",
  };
  res.render("index", data);
});

router.get("/saiba-mais", (req, res) => {
  const data = {
    title: "Saiba Mais - FriendlyWaddle Fitness",
  };
  res.render("saiba-mais", data);
});

router.get("/tecnologias", (req, res) => {
  const data = {
    title: "Tecnologias - FriendlyWaddle Fitness",
  };
  res.render("tecnologias", data);
});

router.get("/equipe", (req, res) => {
  const data = {
    title: "Equipe - FriendlyWaddle Fitness",
  };
  res.render("equipe", data);
});

router.get("/contato", (req, res) => {
  const data = {
    title: "Contato - FriendlyWaddle Fitness",
  };
  res.render("contato", data);
});

router.get("/enviar-email", (req, res) => {
  // TODO Envio de e-mails
  // Use at least Nodemailer v4.1.0
  const nodemailer = require("nodemailer");

  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
      return process.exit(1);
    }

    console.log("Credentials obtained, sending message...");

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    // Message object
    let message = {
      from: "Sender Name <sender@example.com>",
      to: "Recipient <recipient@example.com>",
      subject: "Nodemailer is unicode friendly ✔",
      text: "Hello to myself!",
      html: "<p><b>Hello</b> to myself!</p>",
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });
});
module.exports = router;
