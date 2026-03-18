const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send-pdf", async (req, res) => {
  const { email, type } = req.body;

  if (!email) return res.status(400).json({ message: "Email gerekli" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ozgekeskin373@gmail.com",
        pass: "ognpkcinnmjhpobl" // Gmail için Uygulama Şifresi
      }
    });

    await transporter.sendMail({
      from: '"Çocuk Dosha Testi" <ozgekeskin373@gmail.com>',
      to: email,
      subject: "Çocuğunuzun Dosha Analizi PDF'i",
      html: `
        <p>Merhaba,</p>
        <p>PDF dosyanız hazır! Buradan indirebilirsiniz:</p>
        <a href="https://senin-sunucu.com/pdfs/${type}.pdf" target="_blank">PDF’i indir</a>
        <p>Sevgilerle,</p>
      `
    });

    res.json({ message: "PDF linki e-mailinize gönderildi!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Mail gönderilemedi!" });
  }
});

app.listen(3000, () => console.log("Server 3000 portunda çalışıyor"));