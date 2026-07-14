import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./workshop-effects.css";
import "./orange-theme.css";
import "./profile-video.css";
import "./studio-ui.css";
import "./mobile-capability.css";
import "./work-categories.css";
import NeonProjectBridge from "./NeonProjectBridge";
import ContactSkillsEnhancer from "./ContactSkillsEnhancer";
import CleanSectionNavigation from "./CleanSectionNavigation";

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
  alternates: {
    canonical: "/",
  },
  title: "Jonathan Broqueza | Web & Mobile App Developer",
  description:
    "Jonathan Broqueza is a BSCS graduate from Bicol University Polangui who designs and builds responsive websites, web apps, Flutter mobile apps, booking systems, management systems, and full-stack digital products.",
  keywords: [
    "Jonathan Broqueza",
    "web developer Philippines",
    "mobile app developer Philippines",
    "Flutter developer",
    "Dart developer",
    "landing page developer",
    "full stack website developer",
    "booking system developer",
    "management system developer",
    "portfolio website designer",
    "Next.js developer",
    "React developer",
  ],
  openGraph: {
    title: "Jonathan Broqueza | Web & Mobile App Developer",
    description:
      "Responsive websites, web apps, Flutter mobile apps, booking systems, management systems, and custom digital products.",
    url: "https://jonathan-broqueza.vercel.app",
    siteName: "Jonathan Broqueza",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Jonathan Broqueza web and mobile app developer portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Broqueza | Web & Mobile App Developer",
    description:
      "Responsive websites, web apps, Flutter mobile apps, booking systems, and management systems.",
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
        <ContactSkillsEnhancer />
        <CleanSectionNavigation />
      </body>
    </html>
  );
}
