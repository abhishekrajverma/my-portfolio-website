import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@wrksz/themes/next";
import { AppSplash } from "@/components/layout/app-splash";
import { LazyAnimatedBackground } from "@/components/layout/lazy-animated-background";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DeferredUi } from "@/components/layout/deferred-ui";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/constants/site";
import { getProfileAvatarUrl } from "@/lib/profile/avatar";
import { getResumeDownloadInfo } from "@/lib/resume/repository";
import { env } from "@/lib/env";
import { absoluteUrl } from "@/lib/seo/metadata";
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
  preload: false,
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
  alternates: {
    canonical: siteConfig.url,
  },
  ...(env.googleSiteVerification
    ? { verification: { google: env.googleSiteVerification } }
    : {}),
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...baseMetadata,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon", type: "image/jpeg" },
      ],
      apple: [{ url: "/apple-icon", type: "image/jpeg" }],
      shortcut: "/favicon.ico",
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl(siteConfig.ogImage),
          width: 1200,
          height: 630,
          alt: siteConfig.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [absoluteUrl(siteConfig.ogImage)],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [avatarUrl, resume] = await Promise.all([
    getProfileAvatarUrl(),
    getResumeDownloadInfo(),
  ]);

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
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip to content
            </a>
            <AppSplash avatarUrl={avatarUrl} />
            <LazyAnimatedBackground />
            <Navbar
              avatarUrl={avatarUrl}
              resumeUrl={resume.url}
              resumeDownloadName={resume.downloadName}
            />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer avatarUrl={avatarUrl} />
            <DeferredUi />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
