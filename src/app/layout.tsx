import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
  manifest: "/site.webmanifest",
  icons: {
    icon: {
      url: "/favicon.ico",
      type: "image/x-icon",
      sizes: "any",
    },
    apple: {
      url: "/apple-touch-icon.png",
      type: "image/png",
      sizes: "any",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${satoshi.variable} ${satoshi.variable}  antialiased`}
    >
      <head>
      <Script id='hotjar-analytics'>
          {`(function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:6429017,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </Script>
        <Script id='maze-analytics'>
          {`(function (m, a, z, e) {
  var s, t;
  try {
    t = m.sessionStorage.getItem('maze-us');
  } catch (err) {}

  if (!t) {
    t = new Date().getTime();
    try {
      m.sessionStorage.setItem('maze-us', t);
    } catch (err) {}
  }

  s = a.createElement('script');
  s.src = z + '?apiKey=' + e;
  s.async = true;
  a.getElementsByTagName('head')[0].appendChild(s);
  m.mazeUniversalSnippetApiKey = e;
})(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'e75cf20f-09b5-4239-8361-7394ebda4f08');`}
        </Script>
        <Script id='clarity-analytics'>
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "rxrdbyu3h2");`}
        </Script>
      </head>
      <body suppressHydrationWarning>
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
