import { Navigation } from '../components/Navigation';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
    <html lang="pt-br">
      <head>
        <title>My first app with next 13</title>
      </head>
      <body>
        <Navigation/>
        {children}
      </body>
    </html>
  );
}
