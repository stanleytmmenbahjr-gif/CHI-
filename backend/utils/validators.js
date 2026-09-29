import { z } from 'zod'

export const contactCategories = [
  'General Inquiry',
  'Partnership Request',
  'Volunteer Application',
  'Media Inquiry',
  'Program Information',
  'Donation Support',
  'Safeguarding Concern',
]

const removeUnsafeControls = (value) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
const singleLine = (value) => removeUnsafeControls(value).replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim()
const multiLine = (value) => removeUnsafeControls(value.replace(/\r\n?/g, '\n')).trim()

export const contactSchema = z.object({
  fullName: z.string().transform(singleLine).pipe(z.string().min(2).max(120)),
  email: z.string().trim().pipe(z.string().email().max(254)),
  phone: z.string().optional().default('').transform(singleLine).pipe(z.string().max(40)),
  organization: z.string().optional().default('').transform(singleLine).pipe(z.string().max(160)),
  category: z.enum(contactCategories),
  subject: z.string().transform(singleLine).pipe(z.string().min(2).max(160)),
  message: z.string().transform(multiLine).pipe(z.string().min(1).max(5000)),
  website: z.string().optional().default('').transform(singleLine).pipe(z.string().max(200)),
})