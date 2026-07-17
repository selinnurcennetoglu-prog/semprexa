import type { Metadata } from "next";
import { Fuzzy_Bubbles, Cormorant_Garamond, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import AdBanner from "./components/AdBanner";
import Footer from "./components/Footer";
import ThemeProvider from "./components/ThemeProvider";

const fuzzy = Fuzzy_Bubbles({
  variable: "--font-fuzzy",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Semprexa",
  description: "Semprexa - Ürünlerimizi keşfedin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${fuzzy.variable} ${cormorant.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          <AdBanner />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
