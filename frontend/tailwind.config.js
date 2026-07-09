export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1565c0',
          dark: '#0d47a1',
        },
        gray: {
          dark: '#1a1a1a',
          text: '#374151',
          light: '#9ca3af',
          border: '#e5e7eb',
          divider: '#e5e7eb',
        },
        danger: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
        },
      },
    },
  },
  plugins: [],
}
