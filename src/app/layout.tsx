import type { Metadata } from "next";
import { Geist, Geist_Mono, Spectral } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "../context/walletContext";
import { ThemeProvider } from "../components/common/theme-provider";
import { Navbar } from "../components/navbar/navbar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dynamic Digital Product Passport",
  description:
    "Build any custom supply-chain lifecycle. A verifiable, on-chain product passport for any industry.",
};

// Applies the persisted theme before paint so dark mode never flashes.
const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spectral.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <WalletContextProvider>
            <Navbar />
            <Toaster />
            {children}
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
