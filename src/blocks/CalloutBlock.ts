import type { Block } from 'payload'

export const CalloutBlock: Block = {
  slug: 'callout',
  labels: { singular: 'Encart', plural: 'Encarts' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Attention', value: 'warning' },
        { label: 'Astuce', value: 'tip' },
      ],
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
  ],
}
