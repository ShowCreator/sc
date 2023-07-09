import { defineConfig } from 'dumi';
import { resolve } from 'path';

export default defineConfig({
  title: 'sc-common',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  alias: {
    '@sc/pro-components': resolve(
      __dirname,
      './packages/pro-components/src/index.ts',
    ),
    '@sc/hooks': resolve(__dirname, './packages/hooks/src/index.ts'),
    "@sc/function": resolve(__dirname, './packages/function/src/index.ts'),
  },
  resolve: {
    includes: [
      'docs',
      'packages/function/src',
      'packages/hooks/src',
      'packages/pro-components/src',
    ],
  },
  locales: [['zh-CN', '中文']],

  // more config: https://d.umijs.org/config
});
