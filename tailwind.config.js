module.exports = {
  // Configuração para monitorar arquivos .vue e .ts
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Cores personalizadas conforme o requisito
      colors: {
        'primary': '#139a7e',
        'primary-light': '#e7f4f2',
        'gray-search': '#909090',
        'gray-border': '#d8d8d8',
        'gray-divider': '#d8d8d8',
        'gray-icon': '#a7a7a7',
        'background-page': '#f8f8f8',
        'white': '#fff',
        'black': '#3a3a3a',
        'green-light': '#1276ed',
      },
      // Configuração da fonte
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      screens: {
        'desktop': '1024px',
      }
    },
  },
  plugins: [],
}