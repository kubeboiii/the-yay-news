import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteUrl } from "@/features/reader/site";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  // Makes every relative link-preview URL (the clippings) absolute.
  metadataBase: siteUrl,
  title: "The Yay News",
  icons: { apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Yay News", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#161412" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
