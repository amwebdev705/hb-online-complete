import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const response = await resend.emails.send({
      from: process.env.SENDER_EMAIL!,
      to,
      subject,
      html,
    })

    console.log('✅ Resend response:', response)

    if (response.error) {
      console.error('❌ Resend error:', response.error)
      throw new Error(response.error.message || 'Resend failed')
    }

    return response
  } catch (error) {
    console.error('❌ sendEmail() caught error:', error)
    throw error
  }
}
