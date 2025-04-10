import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Coin Rush - Catch Coins, Beat the Clock!",
  description: "Coin Rush is a fun, fast-paced coin-catching game. Tap falling coins, earn points, and challenge your reflexes. Play now!",
  keywords: "coin rush, coin game, catch coins game, casual web game, no backend game, next.js game, tap game",
  viewport: "width=device-width, initial-scale=1"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Coin Rush - Catch Coins, Beat the Clock!</title>
        <meta name="description" content="Coin Rush is a fun, fast-paced coin-catching game. Tap falling coins, earn points, and challenge your reflexes. Play now!" />
        <meta name="keywords" content="coin rush, coin game, catch coins game, casual web game, no backend game, next.js game, tap game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FFD700" />

         {/* Open Graph / Facebook */}
        <meta property="og:title" content="Coin Rush - Catch Coins, Beat the Clock!" />
        <meta property="og:description" content="Tap falling coins before they disappear. A fast, addictive web game built with Next.js!" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="https://your-vercel-app.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Coin Rush - Catch Coins, Beat the Clock!" />
        <meta name="twitter:description" content="Tap falling coins before they disappear. A fast, addictive web game built with Next.js!" />
        <meta name="twitter:image" content="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
