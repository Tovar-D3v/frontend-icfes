import type { Metadata } from 'next'
import { Geist, Geist_Mono, M_PLUS_Rounded_1c } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from "@/context/auth-context";
// IMPORTANTE → Importa tu ThemeProvider
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const mPlusRounded = M_PLUS_Rounded_1c({ 
  weight: ['400', '700'],
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: '+500 Icfes - Mejora tu puntaje',
  description: 'Mejora tu puntaje de Icfes con +500, la app que te ayuda a practicar y aprender de manera efectiva.',
  generator: 'tovar-d3v',
  icons: {
    icon: [
      {
        url: 'https://d35aaqx5ub95lt.cloudfront.net/images/practiceHub/2c76c04c8e99125ccda0b74b11ac468e.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'https://d35aaqx5ub95lt.cloudfront.net/images/practiceHub/2c76c04c8e99125ccda0b74b11ac468e.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'https://d35aaqx5ub95lt.cloudfront.net/images/practiceHub/2c76c04c8e99125ccda0b74b11ac468e.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={` bg-background`}>
        
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>

        <Analytics />
      </body>
    </html>
  )
}