const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// PDF linkleri (her Dosha için aynı PDF örnek, istersen farklı PDF koyabilirsin)
const pdfLinks = {
  vata: "https://85e80401-c2db-460d-885d-bada4419404e.usrfiles.com/ugd/987514_06aad9d80ba84877a40c94dbba18b5cc.pdf",
  pitta: "https://85e80401-c2db-460d-885d-bada4419404e.usrfiles.com/ugd/987514_06aad9d80ba84877a40c94dbba18b5cc.pdf",
  kapha: "https://85e80401-c2db-460d-885d-bada4419404e.usrfiles.com/ugd/987514_06aad9d80ba84877a40c94dbba18b5cc.pdf"
};

app.post("/send-pdf", async (req, res) => {
  const { email, type } = req.body;

  if (!email || !type) return res.status(400).json({ message: "Email ve type gerekli" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ozgekeskin373@gmail.com",
        pass: "ognpkcinnmjhpobl" // Gmail uygulama şifresi
      }
    });

    const pdfLink = pdfLinks[type] || pdfLinks.vata;

    const htmlContent = `
      <div style="font-family:Inter,sans-serif;background:#f4f6f9;padding:30px;text-align:center;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:40px;border-radius:20px;
                    box-shadow:0 10px 30px rgba(0,0,0,0.1);">
          <h1 style="color:#3b82f6;">Çocuğunuzun Sonucu: ${type.toUpperCase()}</h1>
          <p style="font-size:16px;color:#333;">
            PDF dosyanız hazır! Aşağıdaki butona tıklayarak indirebilirsiniz:
          </p>
          <a href="${pdfLink}" target="_blank" 
             style="display:inline-block;margin-top:20px;padding:16px 32px;
                    background:#6ee7b7;color:#fff;text-decoration:none;font-weight:bold;border-radius:30px;">
            PDF’i İndir
          </a>
          <p style="margin-top:30px;font-size:14px;color:#777;">
            Sevgilerle,<br>Çocuk Dosha Testi Ekibi
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Çocuk Dosha Testi" <ozgekeskin373@gmail.com>',
      to: email,
      subject: `Çocuğunuzun sonucu: ${type.toUpperCase()}`,
      html: htmlContent
    });

    res.json({ message: "PDF linki e-mailinize gönderildi!" });

  } catch (err) {
    console.error("HATA:", err);
    res.status(500).json({ message: "Mail gönderilemedi!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server çalışıyor:", PORT);
});