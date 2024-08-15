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
      fontSize: {
        'xxs': '10px',
      },
       width: {
        '10': '10%',
        '30': '30%',
        '35': '35%',
        '5': '5%',
        '2.5/5': '45%',
        '70': '70%'
      },
      screens: {
      'xs': '445px', // min-width
      },
      colors: {
        'black-60': 'rgba(0, 0, 0, 0.6)',
      },
    }    
  },
  
  plugins: [],
}


// fontFamily: {
//         inter:[" 'Inter' ", 'sans-serif'],
//         lato:[" 'Lato' ", 'sans-serif']
//       }