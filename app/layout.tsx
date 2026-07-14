import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./workshop-effects.css";
import "./orange-theme.css";
import "./profile-video.css";
import "./studio-ui.css";
import NeonProjectBridge from "./NeonProjectBridge";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jonathan-broqueza.vercel.app"),
  title: "Jonathan Broqueza | Web Developer & Digital Systems Designer",
  description:
    "Jonathan Broqueza is a BSCS graduate from Bicol University Polangui who designs and builds responsive websites, landing pages, booking systems, management systems, portfolios, and full-stack web projects.",
  keywords: [
    "Jonathan Broqueza",
    "web developer Philippines",
    "landing page developer",
    "full stack website developer",
    "booking system developer",
    "management system developer",
    "portfolio website designer",
    "Next.js developer",
    "React developer",
  ],
  openGraph: {
    title: "Jonathan Broqueza | Web Developer & Digital Systems Designer",
    description:
      "Modern responsive websites, landing pages, booking systems, management systems, portfolios, and full-stack web development.",
    url: "https://jonathan-broqueza.vercel.app",
    siteName: "Jonathan Broqueza",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Jonathan Broqueza web developer portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Broqueza | Web Developer & Digital Systems Designer",
    description:
      "Responsive websites, landing pages, full-stack websites, booking systems, and management systems.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {children}
        <NeonProjectBridge />
      </body>
    </html>
  );
}
