#!/usr/bin/env node
/**
 * Active core.hooksPath=.githooks pour ce clone (sans dépendance husky).
 * No-op hors d’un dépôt git (ex. archive npm).
 */
import { execSync } from 'node:child_process'
import { chmodSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const hook = resolve(process.cwd(), '.githooks/pre-commit')

try {
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' })
} catch {
  process.exit(0)
}

if (!existsSync(hook)) {
  console.warn('[install-git-hooks] .githooks/pre-commit manquant — skip')
  process.exit(0)
}

try {
  chmodSync(hook, 0o755)
} catch {
  // Windows / FS read-only — le shebang suffit souvent
}

try {
  execSync('git config core.hooksPath .githooks', { stdio: 'inherit' })
  console.log('[install-git-hooks] core.hooksPath=.githooks')
} catch (error) {
  console.warn('[install-git-hooks] impossible de configurer core.hooksPath', error)
}
