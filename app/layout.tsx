import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { preload } from "react-dom";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@wrksz/themes/next";
import { AppSplash } from "@/components/layout/app-splash";
import { LazyAnimatedBackground } from "@/components/layout/lazy-animated-background";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/layout/back-to-top";
import { HashScrollHandler } from "@/components/layout/hash-scroll";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/constants/site";
import { getProfileAvatarUrl } from "@/lib/profile/avatar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const avatarUrl = await getProfileAvatarUrl();

  return {
    ...baseMetadata,
    icons: {
      icon: [{ url: avatarUrl, type: "image/jpeg" }],
      apple: [{ url: avatarUrl, type: "image/jpeg" }],
      shortcut: avatarUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: avatarUrl,
          width: 500,
          height: 500,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [avatarUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const avatarUrl = await getProfileAvatarUrl();
  preload(avatarUrl, { as: "image", fetchPriority: "high" });

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AppSplash avatarUrl={avatarUrl} />
            <LazyAnimatedBackground />
            <Navbar avatarUrl={avatarUrl} />
            <main className="flex-1">{children}</main>
            <Footer avatarUrl={avatarUrl} />
            <BackToTop />
            <HashScrollHandler />
          </TooltipProvider>
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
