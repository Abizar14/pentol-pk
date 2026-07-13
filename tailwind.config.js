/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palet resmi diambil dari logo usaha
        brand: {
          red: '#B82F11', // merah utama — tombol utama, harga, aksen kuat
          dark: '#8A2310', // merah lebih gelap untuk hover tombol
          terracotta: '#CC7D57', // secondary — header, border
          orange: '#E38A3C', // aksen — highlight, badge, hover
          amber: '#E38A3C', // alias oranye aksen
          brown: '#603123', // cokelat tua — teks utama, outline
          cream: '#EFECDE', // krem — background halaman
          creamdark: '#E3D6C3', // krem gelap — background kartu/section
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pop': {
          '0%': { transform: 'scale(0.9)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        // Pesawat kecil melintas di hero
        'fly': {
          '0%': { transform: 'translateX(-20%) translateY(0)' },
          '50%': { transform: 'translateX(60%) translateY(-6px)' },
          '100%': { transform: 'translateX(140%) translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.25s ease-out',
        'pop': 'pop 0.2s ease-out',
        'fly': 'fly 8s linear infinite',
      },
      backgroundImage: {
        // Motif garis landasan (runway stripes)
        'runway': 'repeating-linear-gradient(90deg, #E38A3C 0 22px, transparent 22px 44px)',
      },
    },
  },
  plugins: [],
}
