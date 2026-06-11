export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1a73e8', dark: '#1557b0', light: '#e8f0fe' },
        success: { DEFAULT: '#137333', light: '#e6f4ea' },
        danger: { DEFAULT: '#c5221f', light: '#fce8e6', btn: '#ea4335' },
        warning: { DEFAULT: '#b06000', light: '#fef7e0' },
        gray: { bg: '#f5f6fa', border: '#e0e0e0', text: '#5f6368', dark: '#202124', light: '#80868b', divider: '#e8eaed' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
};
