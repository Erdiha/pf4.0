import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Erdi Haciogullari | Full-Stack Web Developer',
  description:
    'Professional portfolio of Erdi Haciogullari, showcasing web development projects, skills, and experience.',
  keywords:
    'web developer, portfolio, frontend, developer, programming, Erdi Haciogullari, React, Next.js, JavaScript',
  openGraph: {
    title: 'Erdi Haciogullari | Full-Stack Web Developer',
    description:
      'Professional portfolio of Erdi Haciogullari, showcasing web development projects, skills, and experience.',
    url: 'https://erdiha.com',
    siteName: 'Erdi Haciogullari Portfolio',
    images: [
      {
        url: '/og-image.jpg', // Replace with your actual image path when you have it
        width: 1200,
        height: 630,
        alt: 'Erdi Haciogullari Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Erdi Haciogullari | Full-Stack Web Developer',
    description:
      'Professional portfolio of Erdi Haciogullari, showcasing web development projects, skills, and experience.',
    images: ['/og-image.jpg'], // Replace with your actual image path when you have it
  },
  robots: {
    index: true,
    follow: true,
  },
  canonical: 'https://erdiha.com', // Canonical URL helps prevent duplicate content issues
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="google-site-verification"
          content="J9in9D_6tAETh4y9a0pS7xxdflFDDyNCO_TXI2N_YhQ"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Erdi Haciogullari',
              url: 'https://erdiha.com',
              jobTitle: 'Software Engineer',
              sameAs: [
                'https://github.com/Erdiha',
                'https://www.linkedin.com/in/erdi-haciogullari-919246222/',
              ],
              worksFor: {
                '@type': 'Organization',
                name: 'Graph Academy',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
