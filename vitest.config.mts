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
            'tests/int/project-cover.int.spec.ts',
            'tests/int/slugify.int.spec.ts',
            'tests/int/contactSchema.int.spec.ts',
          ],
        },
      },
      {
        plugins: sharedPlugins,
        test: {
          name: 'jsdom-ui',
          environment: 'jsdom',
          setupFiles,
          include: ['tests/int/**/*.int.spec.tsx'],
        },
      },
    ],
  },
})
