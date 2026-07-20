#!/usr/bin/env node
/**
 * Vérifie que chaque var(--token) utilisé dans src/ est déclaré dans styles.css.
 * Usage: pnpm check:tokens
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const STYLES = join(ROOT, 'src/app/(frontend)/styles.css')
const SRC = join(ROOT, 'src')

const stylesContent = readFileSync(STYLES, 'utf8')
const declared = new Set([...stylesContent.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((m) => m[1]))

// Font variables injected by next/font (not in :root block)
const allowed = new Set([
  ...declared,
  'font-syne',
  'font-dm-sans',
  'font-space-grotesk',
])

const used = new Set()
const varPattern = /var\(--([a-z0-9-]+)/gi

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === '.next') continue
      walk(full)
      continue
    }
    if (!/\.(tsx?|css)$/.test(entry)) continue
    const content = readFileSync(full, 'utf8')
    for (const match of content.matchAll(varPattern)) {
      used.add(match[1])
    }
  }
}

walk(SRC)

const orphan = [...used].filter((token) => !allowed.has(token)).sort()

if (orphan.length) {
  console.error('Tokens CSS utilisés mais non déclarés dans styles.css:')
  for (const token of orphan) {
    console.error(`  --${token}`)
  }
  process.exit(1)
}

console.log(`check:tokens OK (${used.size} tokens référencés, ${declared.size} déclarés)`)
