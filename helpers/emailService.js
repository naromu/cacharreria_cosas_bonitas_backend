import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default async function enviarCorreo(email, token) {
    const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        // Verifica la conexión
        await transporter.verify();
        console.log('Conexión a Gmail verificada correctamente.');

        const mailOptions = {
            from: 'lescuatrefantastiques@gmail.com',
            to: email,
            subject: 'Confirma tu registro',
            html: `
                <p>Gracias por registrarte. Haz clic en el siguiente botón para confirmar tu registro:</p>
                <a href="http://localhost:5174/cacharreria_cosas_bonitas/confirmar/${token}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">
                    Confirmar registro
                </a>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo enviado correctamente.');

    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}