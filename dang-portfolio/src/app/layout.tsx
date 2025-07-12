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
  description: "Portfolio of Danton Dang, Software Engineer specializing in modern web development and 3D graphics.",
  keywords: ["software engineer", "web development", "3D graphics", "portfolio"],
  authors: [{ name: "Danton Dang" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Danton Dang - Software Engineer",
    description: "Portfolio of Danton Dang, Software Engineer specializing in modern web development and 3D graphics.",
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
        <link rel="preload" as="image" href="/shojiLeft.webp" />
        <link rel="preload" as="image" href="/shojiRight.webp" />
        <link rel="preload" as="fetch" href="/ae86pixel/scene.gltf" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
