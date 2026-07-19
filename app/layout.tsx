import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SNESDev — Desenvolvimento de jogos para Super Nintendo",
  description:
    "Comunidade brasileira dedicada ao desenvolvimento de jogos para Super Nintendo. Aprenda, construa e publique seus próprios jogos para o SNES.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('snesdev-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Script id="theme-init" strategy="beforeInteractive">{themeScript}</Script>
        {children}
      </body>
    </html>
  );
}
