import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

const sharedPlugins = [tsconfigPaths(), react()]
const setupFiles = ['./vitest.setup.ts']

export default defineConfig({
  plugins: sharedPlugins,
  test: {
    setupFiles,
    projects: [
      {
        plugins: sharedPlugins,
        test: {
          name: 'node-payload',
          environment: 'node',
          setupFiles,
          include: [
            'tests/int/api.int.spec.ts',
            'tests/int/mediaConfig.int.spec.ts',
            'tests/int/media-resolve.int.spec.ts',
            'tests/int/payload-*.int.spec.ts',
            'tests/int/journal-posts.int.spec.ts',
            'tests/int/journal-content.int.spec.ts',
            'tests/int/journal-content-resolver.int.spec.ts',
            'tests/int/journal-cover.int.spec.ts',
            'tests/int/lablog-articles.int.spec.ts',
            'tests/int/lablog-blueprint.int.spec.ts',
            'tests/int/project-cover.int.spec.ts',
            'tests/int/slugify.int.spec.ts',
            'tests/int/contactSchema.int.spec.ts',
            'tests/int/form-submission-notify.int.spec.ts',
            'tests/int/contact-rate-limit.int.spec.ts',
            'tests/int/reading-time.int.spec.ts',
            'tests/int/related-projects.int.spec.ts',
            'tests/int/stack-skill-sync.int.spec.ts',
            'tests/int/featured-journal.int.spec.ts',
            'tests/int/journal-tags.int.spec.ts',
            'tests/int/draft-preview.int.spec.ts',
            'tests/int/seo-document.int.spec.ts',
            'tests/int/json-ld-document.int.spec.ts',
            'tests/int/json-ld-pages.int.spec.ts',
            'tests/int/cv-format-date.int.spec.ts',
            'tests/int/cv-build-data.int.spec.ts',
            'tests/int/cv-schema.int.spec.ts',
            'tests/int/cv-api.int.spec.ts',
            'tests/int/cv-resolve-override-url.int.spec.ts',
            'tests/int/cv-share-links.int.spec.ts',
            'tests/int/cv-pdf-layout.int.spec.ts',
            'tests/int/portfolio-fallback-experiences.int.spec.ts',
          ],
        },
      },
      {
        plugins: sharedPlugins,
        test: {
          name: 'jsdom-ui',
          environment: 'jsdom',
          setupFiles,
          include: [
            'tests/int/**/*.int.spec.tsx',
            'tests/int/starship-launch.int.spec.ts',
            'tests/int/starship-svg.int.spec.ts',
          ],
        },
      },
    ],
  },
})
