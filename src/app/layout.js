import './globals.css';

export const metadata = {
  title: 'Tuatha Dashboard',
  description: 'Dashboard pour Tuatha',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
