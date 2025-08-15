import type { Metadata, Viewport } from "next";
import "./globals.css";
import TabNavigation from "@/components/TabNavigation";
import ClientLayout from "@/components/ClientLayout";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "アロマライフ",
  description: "使う・記録する・つながる、アロマの継続利用をサポートするアプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "アロマライフ",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#9B7EBD" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="antialiased bg-gray-100">
        <Providers>
          <ClientLayout>
            <div className="mx-auto max-w-[430px] min-h-screen bg-[var(--bg-gray)] relative shadow-xl">
              <div className="min-h-screen pb-14">
                {children}
              </div>
              <TabNavigation />
            </div>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
