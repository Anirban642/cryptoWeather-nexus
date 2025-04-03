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

// ✅ Updated Metadata (Ensure correct favicon path)
export const metadata: Metadata = {
  title: "CryptoWeather Nexus",
  description: "Get live weather updates, cryptocurrency prices, and the latest news in one place!",
  icons: {
    icon: "/download.ico", // ✅ Correct favicon path
  },
};
// changes done

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Explicitly add the favicon */}
        <link rel="icon" href="/download.ico" sizes="32x32" type="image/x-icon" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
