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
              .topbar {
                height: 78px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 28px;
                border-bottom: 1px solid rgba(232, 211, 156, 0.12);
                background: rgba(7, 8, 10, 0.88);
                backdrop-filter: blur(18px);
                position: sticky;
                top: 0;
                z-index: 20;
              }
              .brand-lockup,
              .topbar-actions,
              .side-link {
                display: flex;
                align-items: center;
              }
              .brand-lockup { gap: 12px; min-width: 190px; }
              .brand-mark {
                width: 42px;
                height: 42px;
                border-radius: 12px;
                display: grid;
                place-items: center;
                color: #171106;
                font-weight: 900;
                background: linear-gradient(135deg, #fff0b8 0%, #d7b76a 58%, #87cfc2 100%);
                box-shadow: 0 14px 30px rgba(215, 183, 106, 0.22);
              }
              .brand-name {
                font-family: "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Times New Roman", serif;
                font-size: 30px;
                font-weight: 600;
                letter-spacing: 0.04em;
                color: #fff4cf;
              }
              .topbar-actions { gap: 16px; }
              .upgrade-button {
                display: inline-flex;
                align-items: center;
                min-height: 42px;
                padding: 0 18px;
                border: 1px solid rgba(242, 221, 160, 0.42);
                border-radius: 12px;
                color: #fff4cf;
                background: rgba(242, 221, 160, 0.08);
                font-weight: 800;
              }
              .user-orb {
                width: 42px;
                height: 42px;
                border-radius: 999px;
                border: 1px solid rgba(242, 221, 160, 0.28);
                background: linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.04)), rgba(215,183,106,0.28);
              }
              .workspace-shell {
                display: grid;
                grid-template-columns: 260px minmax(0, 1fr);
                min-height: calc(100vh - 78px);
              }
              .sidebar {
                border-right: 1px solid rgba(232, 211, 156, 0.12);
                background: rgba(8, 9, 11, 0.64);
                padding: 26px 18px;
                display: flex;
                flex-direction: column;
                gap: 24px;
                position: sticky;
                top: 78px;
                height: calc(100vh - 78px);
              }
              .side-nav { display: grid; gap: 8px; }
              .side-link {
                gap: 12px;
                min-height: 46px;
                padding: 0 10px;
                color: rgba(248, 244, 235, 0.72);
                border: 1px solid transparent;
                border-radius: 12px;
                font-weight: 700;
              }
              .side-icon {
                width: 30px;
                height: 30px;
                display: grid;
                place-items: center;
                border-radius: 9px;
                color: #f4df9f;
                background: rgba(242, 221, 160, 0.08);
                border: 1px solid rgba(242, 221, 160, 0.12);
                font-size: 13px;
                font-weight: 900;
              }
              .side-badge {
                margin-left: auto;
                padding: 4px 8px;
                border-radius: 999px;
                color: #171106;
                background: #d7b76a;
                font-size: 11px;
              }
              .sidebar-promo {
                margin-top: auto;
                padding: 16px;
                border-radius: 14px;
                background: linear-gradient(145deg, rgba(215,183,106,0.26), rgba(135,207,194,0.14)), rgba(255,255,255,0.06);
                border: 1px solid rgba(242,221,160,0.22);
              }
              .sidebar-promo p { margin: 0 0 8px; color: rgba(248,244,235,0.64); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
              .sidebar-promo strong { display: block; color: #fff4cf; line-height: 1.45; }
              .sidebar-promo a {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 42px;
                margin-top: 14px;
                border-radius: 10px;
                color: #171106;
                background: linear-gradient(135deg, #fff0b8, #d7b76a);
                font-weight: 900;
              }
              .content-stage { min-width: 0; }
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
                .workspace-shell {
                  grid-template-columns: 1fr !important;
                }
                .sidebar {
                  position: static !important;
                  height: auto !important;
                  border-right: 0 !important;
                  border-bottom: 1px solid rgba(232, 211, 156, 0.12) !important;
                  padding: 12px 14px !important;
                }
                .side-nav {
                  grid-auto-flow: column !important;
                  grid-auto-columns: max-content !important;
                  overflow-x: auto !important;
                }
                .sidebar-promo {
                  display: none !important;
                }
                .menu-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `,
          }}
        />
        <div className="site-chrome">
          <header className="topbar">
            <a href="/" className="brand-lockup" aria-label="FAI home">
              <span className="brand-mark">F</span>
              <span className="brand-name">FAI</span>
            </a>
            <div className="topbar-actions">
              <a href="/video-generator" className="upgrade-button">動画生成</a>
              <span className="user-orb" aria-hidden="true" />
            </div>
          </header>

          <div className="workspace-shell">
            <aside className="sidebar">
              <nav className="side-nav" aria-label="Main navigation">
                <a href="/" className="side-link">
                  <span className="side-icon">⌂</span>
                  <span>メニュー</span>
                </a>
                <a href="/grok-editor" className="side-link">
                  <span className="side-icon">G</span>
                  <span>Grok編集</span>
                </a>
                <a href="/video-generator" className="side-link">
                  <span className="side-icon">V</span>
                  <span>動画生成</span>
                  <span className="side-badge">Main</span>
                </a>
                <a href="/fal-editor" className="side-link">
                  <span className="side-icon">F</span>
                  <span>fal編集</span>
                </a>
                <a href="/promptchan" className="side-link">
                  <span className="side-icon">P</span>
                  <span>API Lab</span>
                </a>
              </nav>

              <div className="sidebar-promo">
                <p>Members Only</p>
                <strong>Black & Gold Creative Studio</strong>
                <a href="/video-generator">生成を開始</a>
              </div>
            </aside>

            <div className="content-stage">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
