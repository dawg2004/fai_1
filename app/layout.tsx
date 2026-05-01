import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FAI Face-Keep Editor",
  description: "Edit backgrounds and outfits while preserving facial identity with fal.ai.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
