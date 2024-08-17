/** @type { import('@storybook/vue3').Preview } */
import '../src/assets/styles/variables.css'

import type { Preview } from '@storybook/vue3';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#c2cad026' }
      ]
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
