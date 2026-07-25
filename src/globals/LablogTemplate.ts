import type { GlobalConfig } from 'payload'

import { LABLOG_ARTICLE_JSON_TEMPLATE } from '@/lib/lablog-article-blueprint'

export const LablogTemplate: GlobalConfig = {
  slug: 'lablog-template',
  label: 'Modèle article Lablog',
  admin: {
    group: 'Contenu',
    description:
      'Schéma JSON de référence pour générer des articles conformes à la direction artistique du Lablog.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'jsonTemplate',
      type: 'json',
      required: true,
      defaultValue: LABLOG_ARTICLE_JSON_TEMPLATE,
      admin: {
        description:
          'Structure JSON à reproduire (title, excerpt, category, blocks). Utilisable par une IA ou copié dans le champ « Blueprint JSON » d’un article.',
      },
    },
    {
      name: 'generationHints',
      type: 'textarea',
      defaultValue:
        'Ton : expert, structuré, français. Blocs autorisés : p, h2, h3, ul. Viser 800–900 mots. Intro + 2–3 sections H2 avec H3/listes optionnels + conclusion. Pas de copy marketing en dur hors CMS.',
      admin: {
        description: 'Consignes pour la génération IA ou rédaction assistée.',
      },
    },
  ],
}
