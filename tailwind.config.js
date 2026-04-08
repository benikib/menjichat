export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B3D91',
          hover: '#082C6C',
        },
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
        pending: '#FBBF24',
        text: {
          primary: '#1E293B',
          secondary: '#475569',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        secondary: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'h1': '28px',
        'h2': '22px',
        'h3': '18px',
        'body': '14px',
        'small': '12px',
      },
      borderRadius: {
        'button': '8px',
        'card': '12px',
        'badge': '16px',
      },
    },
  },
  plugins: [],
};