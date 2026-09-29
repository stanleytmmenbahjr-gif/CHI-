import { sendContactEmails } from '../services/resend.service.js'
import { contactSchema } from '../utils/validators.js'
import { logger } from '../utils/logger.js'

export async function createContact(request, response) {
  const parsed = contactSchema.safeParse(request.body)

  if (!parsed.success) {
    return response.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please check the submitted fields and try again.',
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    })
  }

  const contact = parsed.data
  if (contact.website) {
    return response.status(200).json({ success: true, message: 'Thank you. Your message has been received.' })
  }

  try {
    const submittedAt = new Date().toISOString()
    const delivery = await sendContactEmails(contact, submittedAt)

    return response.status(200).json({
      success: true,
      message: 'Thank you for contacting Count Her In Liberia. Your message has been received, and our team will respond soon.',
      autoReplySent: delivery.autoReplySent,
    })
  } catch (error) {
    logger.error('contact.email_delivery_failed', { requestId: request.requestId, code: 'EMAIL_DELIVERY_FAILED' })
    return response.status(502).json({
      success: false,
      error: {
        code: 'EMAIL_DELIVERY_FAILED',
        message: 'We could not send your message right now. Please try again shortly.',
      },
    })
  }
}