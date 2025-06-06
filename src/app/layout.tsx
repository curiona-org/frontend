import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "Curiona - Personalized Learning Roadmaps",
  description: "Generate a personalized roadmap for your learning journey.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${satoshi.variable} ${satoshi.variable}  antialiased`}
    >
      <body>
        <Providers>
          <header>
            <Navbar />
          </header>
          <main>{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
