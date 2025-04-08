import './globals.css';
import '@/styles/globals.css';
import { AuthProvider } from './contexts/AuthContext';

export const metadata = {
  title: 'Tuatha Dashboard',
  description: 'Tableau de bord de suivi des patients',
  icons: {
    icon: '/LogoTuatha.png',
    shortcut: '/LogoTuatha.png',
    apple: '/LogoTuatha.png',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <link rel="icon" href="/LogoTuatha.png" />
        <link rel="shortcut icon" href="/LogoTuatha.png" />
        <link rel="apple-touch-icon" href="/LogoTuatha.png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
