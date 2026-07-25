import { z } from 'zod'

const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('p'), text: z.string().min(1) }),
  z.object({ type: z.literal('h2'), text: z.string().min(1) }),
  z.object({ type: z.literal('h3'), text: z.string().min(1) }),
  z.object({ type: z.literal('ul'), items: z.array(z.string().min(1)).min(1) }),
])

/** Schéma minimal pour valider le JSON blueprint Lablog saisi dans l’admin. */
export const lablogBlueprintSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).max(220).optional(),
  category: z.enum(['ia', 'design', 'veille', 'perso', 'autre']).optional(),
  blocks: z.array(blockSchema).optional(),
})

export type LablogBlueprint = z.infer<typeof lablogBlueprintSchema>

export type LablogBlueprintValidationResult =
  | { ok: true; data: LablogBlueprint }
  | { ok: false; error: string }

function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join('; ')
}

/** Valide un blueprint JSON (objet ou chaîne) sans lever d’exception. */
export function validateLablogBlueprint(json: unknown): LablogBlueprintValidationResult {
  let normalized: unknown = json

  if (typeof json === 'string') {
    const trimmed = json.trim()
    if (trimmed.length === 0) {
      return { ok: false, error: 'Blueprint JSON vide' }
    }

    try {
      normalized = JSON.parse(trimmed)
    } catch {
      return { ok: false, error: 'JSON invalide' }
    }
  }

  const result = lablogBlueprintSchema.safeParse(normalized)
  if (!result.success) {
    return { ok: false, error: formatZodError(result.error) }
  }

  return { ok: true, data: result.data }
}
