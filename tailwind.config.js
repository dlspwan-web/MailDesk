/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',
        panel: '#111C2E',
        brand: '#2563EB',
        success: '#16A34A',
        danger: '#DC2626',
        amber: '#F59E0B',
      },
      boxShadow: {
        panel: '0 12px 30px rgba(0, 0, 0, .16)',
      },
    },
  },
  plugins: [],
}
