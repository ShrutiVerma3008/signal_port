import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ChatbotWrapper from "@/components/chatbot/ChatbotWrapper";
import Preloader from "@/components/preloader/Preloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shruti Verma — AI/ML & Data Science Portfolio",
  description:
    "Final-year B.Tech AI & Data Science student at GSV Vadodara. Interning at the Ministry of Railways. Building production ML systems — GraphRAG, multi-agent RL, edge AI, and more.",
  keywords: [
    "AI engineer",
    "ML engineer",
    "data scientist",
    "portfolio",
    "Next.js",
    "GSV Vadodara",
    "Ministry of Railways",
    "GraphRAG",
  ],
  authors: [{ name: "Shruti Verma", url: "https://github.com/ShrutiVerma3008" }],
  openGraph: {
    title: "Shruti Verma — The Signal Line Portfolio",
    description:
      "AI/ML & Data Science portfolio with a night railway theme. Production systems, real metrics, honest stories.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  if (!prefersReduced) {
                    document.documentElement.classList.add('preload-active');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#080E1C] text-white antialiased">
        <Preloader />
        <div id="main-content">
          {children}
        </div>
        <ChatbotWrapper />
      </body>
    </html>
  );
}
