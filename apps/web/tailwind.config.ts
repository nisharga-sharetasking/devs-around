import type { Config } from 'tailwindcss'
import sharedConfig from '@devsaround/config/tailwind'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}'
  ],
  presets: [sharedConfig],
}

export default config