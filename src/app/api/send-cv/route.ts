import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const file = formData.get('file') as File;

    if (!email || !file) {
      return NextResponse.json({ error: 'Falta correo o archivo' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cvappchile@gmail.com',
        pass: process.env.EMAIL_PASSWORD, // Necesitas generar una "Contraseña de Aplicación" en tu cuenta de Google
      },
    });

    const mailOptions = {
      from: '"CV Asistido Chile" <cvappchile@gmail.com>',
      to: email, // Ahora podemos enviarle a cualquier correo
      subject: '📄 Tu Currículum Vitae Profesional',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">¡Tu CV está listo!</h2>
          <p>Hola,</p>
          <p>Gracias por usar <strong>CV Asistido Chile</strong>. Adjunto a este correo encontrarás tu Currículum Vitae en formato PDF.</p>
          <p>Te deseamos muchísimo éxito en tu búsqueda laboral.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Nota: Este es un correo automático. Generado con IA.</p>
        </div>
      `,
      attachments: [
        {
          filename: 'Curriculum_Vitae.pdf',
          content: buffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
