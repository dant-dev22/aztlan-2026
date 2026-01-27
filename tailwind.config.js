/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        'soft-black': '#121212',
        'charcoal-ink': '#1C1C1E',
        'graphite': '#2A2A2D',
        // Light backgrounds and surfaces
        'soft-white': '#F6F6F4',
        'warm-white': '#EEEDE9',
        'light-ash': '#E0E0DD',
        // Text colors
        'primary-text': '#1A1A1A',
        'secondary-text': '#5E5E5E',
        'muted-text': '#8C8C8C',
        'disabled': '#B5B5B5',
        // Accents (hovers, links, indicators)
        'steel-gray': '#9CA3AF',
        'silver-fog': '#C7C7C7',
        // Success (comprobante enviado, botón habilitado)
        'success-green': '#2D5A3D',
        'success-green-hover': '#3D7B52',
      },
    },
  },
  plugins: [],
}

