import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

export const alt = "Mohamed Elborno — Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Locale = (typeof routing.locales)[number];

type MetadataMessages = {
  siteName: string;
  ogTitle: string;
  ogSubtitle: string;
  ogTagline: string;
};

async function getMetadataMessages(locale: Locale): Promise<MetadataMessages> {
  const messages = (await import(`../../locales/${locale}.json`)).default;
  return messages.metadata as MetadataMessages;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  // Visual card uses English text so Satori renders reliably; page meta stays localized.
  const meta = await getMetadataMessages("en");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#121419",
          padding: "64px 72px",
          color: "#f4f5f8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: "#818cf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div style={{ fontSize: 20, color: "#b3b7c4" }}>{meta.siteName}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
            {meta.ogTitle}
          </div>
          <div style={{ fontSize: 28, color: "#b3b7c4", lineHeight: 1.3 }}>
            {meta.ogSubtitle}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 72,
              height: 4,
              backgroundColor: "#818cf8",
            }}
          />
          <div style={{ fontSize: 18, color: "#7d8294" }}>{meta.ogTagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
