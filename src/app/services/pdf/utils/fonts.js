import { Font } from '@react-pdf/renderer';

export const registerFonts = () => {
  if (typeof window === 'undefined') return; // Skip during SSR
  
  Font.register({
    family: 'Montserrat',
    fonts: [
      { 
        src: './public/fonts/Montserrat-Regular.ttf',
        fontWeight: 400,
        fontStyle: 'normal'
      },
      { 
        src: './public/fonts/Montserrat-Italic.ttf',
        fontWeight: 400,
        fontStyle: 'italic'
      },
      { 
        src: './public/fonts/Montserrat-Bold.ttf',
        fontWeight: 700,
        fontStyle: 'normal'
      },
      { 
        src: './public/fonts/Montserrat-BoldItalic.ttf',
        fontWeight: 700,
        fontStyle: 'italic'
      },
      { 
        src: './public/fonts/Montserrat-Light.ttf',
        fontWeight: 300,
        fontStyle: 'normal'
      },
      { 
        src: './public/fonts/Montserrat-LightItalic.ttf',
        fontWeight: 300,
        fontStyle: 'italic'
      }
    ]
  });
};
