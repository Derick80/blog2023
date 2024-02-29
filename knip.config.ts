import type { KnipConfig } from 'knip'

export default {
  entry: [
    'server/index.js',
    'app/**/*.test.ts',
    'app/**/*.test.tsx',
    'app/**/*'
  ],
  ignore: ['types/**/*.d.ts'],
  remix: { config: 'remix.config.ts' },
  rules: {
    binaries: 'error',
    classMembers: 'error',
    dependencies: 'error',
    devDependencies: 'error',
    duplicates: 'error',
    enumMembers: 'error',
    exports: 'error',
    files: 'error',
    nsExports: 'error',
    nsTypes: 'error',
    types: 'error',
    unlisted: 'error',
    unresolved: 'error'
  }
} satisfies KnipConfig
