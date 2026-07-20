import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nom trop court').max(80),
  email: z.email('Email invalide'),
  message: z.string().trim().min(10, 'Message trop court').max(5000),
  website: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
