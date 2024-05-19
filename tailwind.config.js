/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: [" Inter", 'sans-serif'],
      },
       width: {
        '10': '10%',
        '35': '35%',
        '5': '5%',
        '2.5/5': '45%',
        '70': '70%'
      },
    },
  },
  
  plugins: [],
}


// fontFamily: {
//         inter:[" 'Inter' ", 'sans-serif'],
//         lato:[" 'Lato' ", 'sans-serif']
//       }