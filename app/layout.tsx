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
          id="ui-v3"
          dangerouslySetInnerHTML={{
            __html: `
              body {
                background:
                  radial-gradient(circle at 16% -10%, rgba(215, 183, 106, 0.16), transparent 32%),
                  linear-gradient(180deg, #121316 0%, #08090b 48%, #040506 100%) !important;
                font-family: "Helvetica Neue", "Hiragino Sans", "Yu Gothic", Arial, sans-serif !important;
              }
              .app-shell {
                padding-top: 28px !important;
              }
              .hero {
                border-color: rgba(242, 221, 160, 0.30) !important;
                border-radius: 14px !important;
                background:
                  linear-gradient(135deg, rgba(242, 221, 160, 0.11), rgba(255, 255, 255, 0.035) 38%, rgba(0, 0, 0, 0.36)),
                  rgba(12, 13, 15, 0.88) !important;
                box-shadow:
                  0 18px 54px rgba(0, 0, 0, 0.38),
                  inset 0 1px 0 rgba(255, 255, 255, 0.10) !important;
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
                font-family: "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Times New Roman", serif !important;
                font-weight: 500 !important;
                letter-spacing: 0.08em !important;
                text-shadow: 0 0 20px rgba(242, 221, 160, 0.16) !important;
              }
              .menu-card h2,
              .result-card h2 {
                font-family: "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Times New Roman", serif !important;
                font-weight: 500 !important;
                letter-spacing: 0.05em !important;
              }
              .badge,
              .small-pill,
              .open-link,
              .primary-btn,
              .secondary-btn,
              .segment button {
                letter-spacing: 0.04em !important;
              }
              .menu-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                gap: 14px !important;
              }
              .menu-card,
              .glass-card {
                position: relative;
                border-color: rgba(242, 221, 160, 0.20) !important;
                border-radius: 12px !important;
                background:
                  linear-gradient(145deg, rgba(255, 255, 255, 0.060), rgba(255, 255, 255, 0.025)),
                  rgba(14, 15, 17, 0.88) !important;
                box-shadow:
                  0 14px 38px rgba(0, 0, 0, 0.30),
                  inset 0 1px 0 rgba(255, 255, 255, 0.07) !important;
                overflow: hidden;
              }
              .menu-card {
                min-height: 176px !important;
                display: flex !important;
                flex-direction: column !important;
                padding: 18px !important;
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
              .open-link {
                margin-top: auto !important;
                padding-top: 16px !important;
              }
              .icon-box {
                color: #ffe7a6 !important;
                background: linear-gradient(145deg, rgba(242, 221, 160, 0.20), rgba(255, 255, 255, 0.06)) !important;
                border-color: rgba(242, 221, 160, 0.28) !important;
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
              @media (max-width: 760px) {
                .menu-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
