import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import React from "react";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SOMA LUXURY",
  description: "l'art du raffinement",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="fixed w-full z-50">
          <h1 className="h-10 bg-black text-white relative flex items-center justify-center">
            SOMA LUXURY
          </h1>
          <Header/>
        </div>
        <div className="pt-40">{children}</div>
      </body>
    </html>
  );
}
