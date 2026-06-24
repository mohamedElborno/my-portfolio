import type { Metadata } from "next";
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
      path: "../../public/fonts/thmanyahsans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/thmanyahsans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/thmanyahsans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/thmanyahsans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/thmanyahsans-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-thmanyah-sans",
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
        .map((loc) =>
          loc === "ar" ? "ar_SA" : loc === "tr" ? "tr_TR" : "en_US",
        ),
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
      className={`${thmanyahSans.variable} ${thmanyahSans.className} h-full overflow-x-clip antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh w-full flex-col overflow-x-clip bg-bg-primary text-text-primary">
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip">
              <ScrollProgress />
              <CursorGlow />
              {children}
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
