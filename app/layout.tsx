import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Claim Your Signal",
  description: "Interactive ownership prototype exploring digital identity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.className} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="relative m-0 p-0 overflow-hidden">
        <div className="absolute inset-0 bg-ambient pointer-events-none" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}