import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorker } from "@/components/service-worker";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: { default: "رِفق", template: "%s | رِفق" },
  description: "مساحة خاصة للاهتمام اليومي",
  applicationName: "رِفق",
  manifest: "/manifest.webmanifest",
  robots: { index: false, follow: false },
  openGraph: {
    title: "رِفق",
    description: "اهتمام أنسب، في الوقت الأنسب",
    images: [
      {
        url: "/og.jpg",
        width: 600,
        height: 400,
        alt: "رِفق — اهتمام أنسب، في الوقت الأنسب",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#286f66",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
