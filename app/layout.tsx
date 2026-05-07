import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FAI Face-Keep Editor",
  description: "Edit backgrounds and outfits while preserving facial identity with fal.ai.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <style
          id="luxury-v2"
          dangerouslySetInnerHTML={{
            __html: `
              body {
                background:
                  radial-gradient(circle at 18% -8%, rgba(242, 221, 160, 0.20), transparent 34%),
                  radial-gradient(circle at 88% 12%, rgba(152, 206, 196, 0.12), transparent 28%),
                  linear-gradient(180deg, #14120e 0%, #070809 48%, #020304 100%) !important;
              }
              .app-shell {
                padding-top: 28px !important;
              }
              .hero {
                border-color: rgba(242, 221, 160, 0.42) !important;
                background:
                  linear-gradient(135deg, rgba(242, 221, 160, 0.16), rgba(255, 255, 255, 0.045) 38%, rgba(0, 0, 0, 0.58)),
                  rgba(6, 7, 8, 0.82) !important;
                box-shadow:
                  0 28px 80px rgba(0, 0, 0, 0.58),
                  inset 0 1px 0 rgba(255, 255, 255, 0.16),
                  inset 0 -1px 0 rgba(242, 221, 160, 0.10) !important;
              }
              .hero:after {
                content: "";
                position: absolute;
                left: 22px;
                right: 22px;
                bottom: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(242, 221, 160, 0.82), transparent);
                pointer-events: none;
              }
              .hero h1 {
                color: #fff3cc !important;
                text-shadow: 0 0 28px rgba(242, 221, 160, 0.22) !important;
              }
              .menu-card,
              .glass-card {
                position: relative;
                border-color: rgba(242, 221, 160, 0.30) !important;
                background:
                  linear-gradient(145deg, rgba(242, 221, 160, 0.105), rgba(255, 255, 255, 0.035)),
                  rgba(5, 6, 7, 0.78) !important;
                box-shadow:
                  0 22px 64px rgba(0, 0, 0, 0.48),
                  inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
                overflow: hidden;
              }
              .menu-card:before,
              .glass-card:before {
                content: "";
                position: absolute;
                inset: 0 0 auto;
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(242, 221, 160, 0.86), transparent);
                opacity: 0.9;
                pointer-events: none;
              }
              .icon-box {
                color: #ffe7a6 !important;
                background: linear-gradient(145deg, rgba(242, 221, 160, 0.26), rgba(255, 255, 255, 0.06)) !important;
                border-color: rgba(242, 221, 160, 0.36) !important;
              }
              .primary-btn,
              .segment button.active {
                background: linear-gradient(135deg, #fff0b8 0%, #d9bf78 54%, #9d7935 100%) !important;
                color: #171106 !important;
                box-shadow:
                  0 16px 38px rgba(217, 191, 120, 0.30),
                  inset 0 1px 0 rgba(255, 255, 255, 0.45) !important;
              }
              textarea,
              select,
              .upload-box,
              .image-panel,
              .empty-state,
              .safety-box,
              .note {
                border-color: rgba(242, 221, 160, 0.26) !important;
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
