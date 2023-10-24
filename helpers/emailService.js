import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default async function enviarCorreo(email, token,opciones) {
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
            subject: opciones.asunto,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        max-width: 600px;
                        margin: auto;
                        border: 1px solid #e0e0e0;
                    }
            
                    .button {
                        text-align: center;
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #49dac2;
                        color: white !important;
                        border: none;
                        cursor: pointer;
                        text-decoration: none;
                        font-weight: bold;
                        border-radius: 5px;
                        text-align: center;
                    }
            
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #888;
                        text-align: center;
                    }
                    .logo {
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        max-width: 150px;
                    }
                    .button-container {
                        text-align: center;  /* Esto centrará el botón */
                        margin-top: 20px;    /* Espacio adicional antes del botón */
                    }
                </style>
            </head>
            <body>
            
            <div class="container">
                <img src="https://i.ibb.co/pnNjDRS/logo.png" alt="Cosas Bonitas" class="logo">
                <p>¡Hola!</p>
                <p>${opciones.mensaje} </p>
                <div class="button-container">
                    <a href="http://localhost:5174${opciones.ruta}${token}" class="button">
                    ${opciones.textoBoton}
                    </a>
                </div>
            
                <div class="footer">
                    <p>${opciones.mensajePie}</p>
                    <p>Gracias, el equipo de Cosas Bonitas.</p>
                </div>
            </div>
            
            </body>
            </html>
            

            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo enviado correctamente.');

    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}