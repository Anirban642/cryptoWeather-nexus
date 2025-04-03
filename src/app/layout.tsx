import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Corrected import for ClientWrapper
import ClientWrapper from "@components/ClientWrapper";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Updated Metadata (Recommended for SEO)
export const metadata: Metadata = {
  title: "CryptoWeather Nexus",
  description: "Get live weather updates, cryptocurrency prices, and the latest news in one place!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Avoids unnecessary <title> inside <head>, as Next.js manages metadata */}
        {/* <title>CryptoWeather Nexus</title> ✅ REMOVE THIS */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
