import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import "remixicon/fonts/remixicon.css";
import { CartProvider } from "@/context/CartContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Soma Luxury",
  description: "Élégance & Raffinement",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/sign-in"

       signInFallbackRedirectUrl="/admin/dashboard"
       signUpFallbackRedirectUrl="/admin/dashboard"
    >

      <html lang="fr">

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

          <CartProvider>
            {children}
          </CartProvider>

        </body>

      </html>

    </ClerkProvider>

  );
}