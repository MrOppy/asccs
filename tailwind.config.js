/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Orbitron"', 'sans-serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
      colors: {
        background: '#0F172A',
        foreground: '#F8FAFC',
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#F97316',
        muted: '#1E293B',
        'muted-foreground': '#94A3B8',
        border: '#334155',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        card: {
          DEFAULT: '#1E293B',
          hover: '#334155'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};