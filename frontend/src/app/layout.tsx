import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Space_Grotesk, Inter_Tight } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "SENTINEL_ONE | Autonomous Infrastructure Intelligence",
  description: "The Autonomous Operating System for Infrastructure Intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${spaceGrotesk.variable} ${interTight.variable} h-full antialiased`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Inter:wght@400;500;700&display=swap" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#0d0e12]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
