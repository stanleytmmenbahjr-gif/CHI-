import { Resend } from 'resend'
import { loadEnvironment } from '../utils/env.js'
import { logger } from '../utils/logger.js'

export const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character])

const textLine = (label, value) => `${label}: ${value || 'Not provided'}`

function getResendClient() {
  const apiKey = loadEnvironment().resendApiKey
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')
  return new Resend(apiKey)
}

function assertDelivery(result) {
  if (result.error) throw new Error(result.error.message || 'Resend rejected the message')
}

export async function sendContactEmails(contact, submittedAt) {
  const resend = getResendClient()
  const { resendFromEmail: from, contactEmail: recipient } = loadEnvironment()

  if (!from || !recipient) throw new Error('Resend sender or recipient is not configured')

  const fields = [
    ['Full Name', contact.fullName],
    ['Email', contact.email],
    ['Phone', contact.phone],
    ['Organization', contact.organization],
    ['Category', contact.category],
    ['Subject', contact.subject],
    ['Message', contact.message],
    ['Submission Date', submittedAt],
  ]
  const htmlRows = fields.map(([label, value]) => `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #eee">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(value || 'Not provided')}</td></tr>`).join('')
  const textBody = fields.map(([label, value]) => textLine(label, value)).join('\n\n')

  const notification = await resend.emails.send({
    from,
    to: [recipient],
    replyTo: contact.email,
    subject: `New Website Inquiry - ${contact.category}`,
    text: textBody,
    html: `<h1>New Website Inquiry</h1><table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%">${htmlRows}</table>`,
  })
  assertDelivery(notification)

  let autoReplySent = true
  try {
    const confirmation = await resend.emails.send({
      from,
      to: [contact.email],
      subject: 'We received your message - Count Her In Liberia',
      text: `Dear ${contact.fullName},\n\nThank you for contacting Count Her In Liberia. We have received your message about "${contact.subject}" and our team will respond soon.\n\nWith appreciation,\nCount Her In Liberia`,
      html: `<p>Dear ${escapeHtml(contact.fullName)},</p><p>Thank you for contacting Count Her In Liberia. We have received your message about <strong>${escapeHtml(contact.subject)}</strong>, and our team will respond soon.</p><p>With appreciation,<br />Count Her In Liberia</p>`,
    })
    assertDelivery(confirmation)
  } catch {
    autoReplySent = false
    logger.warn('contact.confirmation_delivery_failed')
  }

  return { autoReplySent }
}