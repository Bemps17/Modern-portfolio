/**
 * Builder Lexical minimal pour seed / fallback Lablog (H2, H3, paragraphes, listes).
 */

export type LexicalBlock =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }

type LexicalTextNode = {
  type: 'text'
  detail: 0
  format: 0
  mode: 'normal'
  style: string
  text: string
  version: 1
}

type LexicalElementNode = {
  type: string
  format: string
  indent: number
  version: 1
  direction: 'ltr'
  children: LexicalTextNode[] | LexicalElementNode[]
  textFormat?: 0
  textStyle?: string
  tag?: string
  listType?: 'bullet' | 'number'
  start?: number
  value?: number
  checked?: undefined
}

function textNode(text: string): LexicalTextNode {
  return {
    type: 'text',
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function paragraph(text: string): LexicalElementNode {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    textFormat: 0,
    textStyle: '',
    children: [textNode(text)],
  }
}

function heading(tag: 'h2' | 'h3', text: string): LexicalElementNode {
  return {
    type: 'heading',
    tag,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [textNode(text)],
  }
}

function bulletList(items: string[]): LexicalElementNode {
  return {
    type: 'list',
    listType: 'bullet',
    tag: 'ul',
    start: 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: items.map((item, index) => ({
      type: 'listitem',
      checked: undefined,
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      value: index + 1,
      children: [paragraph(item)],
    })),
  }
}

/** Convertit des blocs structurés en état Lexical Payload. */
export function blocksToLexical(blocks: LexicalBlock[]) {
  const children: LexicalElementNode[] = blocks.map((block) => {
    switch (block.type) {
      case 'h2':
        return heading('h2', block.text)
      case 'h3':
        return heading('h3', block.text)
      case 'p':
        return paragraph(block.text)
      case 'ul':
        return bulletList(block.items)
      default: {
        const _exhaustive: never = block
        return _exhaustive
      }
    }
  })

  return {
    root: {
      type: 'root' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children,
    },
  }
}
