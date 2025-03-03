import { Inter } from 'next/font/google';
import './globals.css';
import ExtensionAttributesCleaner from '../components/ExtensionAttributesCleaner';
import { ThemeProvider } from '../contexts/ThemeContext';
import { MessageProvider } from '../contexts/MessageContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tuatha Dashboard',
  description: 'Dashboard pour les professionnels de santé',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ThemeProvider>
          <MessageProvider>
            <ExtensionAttributesCleaner />
            {children}
          </MessageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
