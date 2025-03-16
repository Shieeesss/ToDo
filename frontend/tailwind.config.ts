import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}', // Add this line if using Flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbitePlugin, // Add this line if using Flowbite
  ],
};

export default config;