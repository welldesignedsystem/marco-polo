import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marco Polo — Competitive Intelligence & SEO",
  description:
    "Analyze any website to uncover competitors and generate high-value SEO keywords.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
