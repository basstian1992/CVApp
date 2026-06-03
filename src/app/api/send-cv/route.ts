import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const file = formData.get('file') as File;

    if (!email || !file) {
      return NextResponse.json({ error: 'Falta correo o archivo' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const data = await resend.emails.send({
      from: 'CV Asistido <onboarding@resend.dev>',
      to: email,
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
    });

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
