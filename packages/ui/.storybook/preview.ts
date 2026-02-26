import type { Preview } from '@storybook/nextjs'
import '@glimmora/config/tailwind/theme.css'
import '../src/styles/storybook-fonts.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#FAF7F4' },
        { name: 'dashboard', value: '#F5EDE6' },
        { name: 'card', value: '#FFFFFF' },
      ],
    },
  },
}
export default preview
