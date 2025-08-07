import {
  RifficFreeBold,
  rufina,
  fraunces,
  merriweather,
  outfit,
  jetbrainsMono,
  recoleta,
  inter,
  ibmPlexMono,
  spaceGroteskBold,
} from "./fonts/fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Cormorant, Montserrat, Playfair_Display, Lora } from "next/font/google";
import localFont from "next/font/local";
import { Metadata } from "next";

const defaultUrl =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://icptiger.com");

// Keep the viewport export for compatibility with Next.js
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A66C2",
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl!),
  title: "LinkedIn Automation | ICP Tiger",
  description:
    "The lean, safe way to automate LinkedIn outreach. Grow your network and generate leads on autopilot while maintaining safety and compliance.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ICP Tiger",
  },
  openGraph: {
    title: "LinkedIn Automation | ICP Tiger",
    description:
      "The lean, safe way to automate LinkedIn outreach. Grow your network and generate leads on autopilot while maintaining safety and compliance.",
    url: defaultUrl,
    siteName: "ICP Tiger",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Automation | ICP Tiger",
    description:
      "The lean, safe way to automate LinkedIn outreach. Grow your network and generate leads on autopilot while maintaining safety and compliance.",
    creator: "@ICPTiger",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  applicationName: "ICP Tiger",
  generator: "ICP Tiger",
  keywords: [
    "LinkedIn automation",
    "sales automation",
    "recruitment automation",
    "LinkedIn outreach",
    "lead generation",
    "network growth",
    "sales prospecting",
    "recruiter tools",
    "entrepreneur tools",
    "creator tools",
    "LinkedIn networking",
    "automated outreach",
    "sales software",
    "recruitment software",
    "LinkedIn growth",
    "business development",
    "prospecting automation",
  ],
};

// Font definitions
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${RifficFreeBold.variable} ${rufina.variable} ${fraunces.variable} ${merriweather.variable} ${outfit.variable} ${jetbrainsMono.variable} ${recoleta.variable} ${inter.variable} ${ibmPlexMono.variable} ${spaceGroteskBold.variable} font-sans`}
      suppressHydrationWarning
    >
      <head>
        {/* Updated viewport meta tag to prevent zooming out */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* LinkedIn blue for browser top bar/tab area */}
        <meta name="theme-color" content="#0A66C2" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased overflow-x-hidden",
          inter.variable,
          playfair.variable,
        )}
      >
        <div className="min-h-[100svh] flex flex-col w-full relative">{children}</div>
      </body>
    </html>
  );
}
