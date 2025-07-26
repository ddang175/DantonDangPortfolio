import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Danton Dang - Software Engineer",
  description: "Danton Dang's Portfolio.",
  keywords: ["software engineer", "portfolio"],
  authors: [{ name: "Danton Dang" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Danton Dang - Software Engineer",
    description: "Danton Dang's Portfolio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/glow.webp" />
        
        <link rel="preload" as="fetch" href="/ae86/initialdcarmesh.glb" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/city/city.glb" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/github/scene.glb" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/linkedin_3d/scene.glb" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/email/scene.glb" crossOrigin="anonymous" />
        <link rel="preload" as="fetch" href="/resume/scene.glb" crossOrigin="anonymous" />
        
        <link rel="preload" as="audio" href="/audio/keys/1.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/2.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/3.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/4.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/5.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/6.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/7.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/8.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/9.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/10.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/11.mp3" />
        <link rel="preload" as="audio" href="/audio/keys/12.mp3" />
        
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
