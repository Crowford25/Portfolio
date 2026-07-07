module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 24px 80px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top right, rgba(123, 85, 255, 0.24), transparent 32%), radial-gradient(circle at 15% 20%, rgba(163, 233, 255, 0.16), transparent 24%), radial-gradient(circle at 80% 90%, rgba(255, 118, 172, 0.16), transparent 26%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
      },
      colors: {
        matte: '#050816',
        surface: 'rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
}
