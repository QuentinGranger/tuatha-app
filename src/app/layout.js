import './globals.css';

export const metadata = {
  title: 'Tuatha Dashboard',
  description: 'Tableau de bord de suivi des patients',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
