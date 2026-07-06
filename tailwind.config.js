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
        'soft-black': '#05070B',
        'charcoal-ink': '#0F1720',
        'graphite': '#1D2735',
        'soft-white': '#F6F8FB',
        'warm-white': '#FFFFFF',
        'light-ash': '#E7ECF3',
        'primary-text': '#0B1220',
        'secondary-text': '#4F5B6E',
        'muted-text': '#7A8699',
        'disabled': '#BBC4D3',
        'steel-gray': '#2F6DF6',
        'silver-fog': '#CFD7E4',
        'signal-orange': '#FF7A1A',
        'signal-orange-soft': '#FFF0E5',
        'electric-blue': '#1E56D9',
        'blue-mist': '#EAF1FF',
        'success-green': '#0F8A5F',
        'success-green-hover': '#127A56',
      },
    },
  },
  plugins: [],
}

