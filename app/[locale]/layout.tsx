import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/Providers";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import localFont from "next/font/local";

const thmanyahSans = localFont({
  src: [
    {
      path: "../../public/fonts/thmanyahsans-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/thmanyahsans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/thmanyahsans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/thmanyahsans-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/thmanyahsans-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-thmanyah",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${locale}`;

  const openGraphLocale =
    locale === "ar" ? "ar_SA" : locale === "tr" ? "tr_TR" : "en_US";

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/my-logo.svg",
      shortcut: "/my-logo.svg",
      apple: "/my-logo.svg",
    },
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, `${siteUrl}/${loc}`]),
      ),
    },
    openGraph: {
      type: "website",
      locale: openGraphLocale,
      alternateLocale: routing.locales
        .filter((loc) => loc !== locale)
        .map((loc) => (loc === "ar" ? "ar_SA" : loc === "tr" ? "tr_TR" : "en_US")),
      url: pageUrl,
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../locales/${locale}.json`)).default;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${thmanyahSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-primary text-primary font-thmanyah">
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
        )}
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ScrollProgress />
            <CursorGlow />
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
