import { Sparkles, Wand2, ShieldAlert, Bot, Video } from "lucide-react";

const menuItems = [
  {
    href: "/grok-editor",
    title: "Grok公式 顔維持エディター",
    description: "xAI公式Grok Image APIで、顔の印象を維持したまま背景・服装を編集します。Dreamina系は使いません。",
    icon: Bot,
    badge: "Grok",
  },
  {
    href: "/video-generator",
    title: "動画生成",
    description: "編集済み画像またはアップロード画像から、fal.ai経由でGrok / SeedanceのImage-to-Videoを実行します。",
    icon: Video,
    badge: "Video",
  },
  {
    href: "/fal-editor",
    title: "fal.ai 顔維持エディター",
    description: "顔の印象を維持したまま、背景・服装・両方を編集します。LUMIVEIL向けの上品な宣材写真生成に最適です。",
    icon: Wand2,
    badge: "fal.ai",
  },
  {
    href: "/promptchan",
    title: "Promptchan API Lab",
    description: "Promptchan APIの検証メニューです。API URLは環境変数で差し替え可能。成人向けAPIのため安全確認付きです。",
    icon: ShieldAlert,
    badge: "Lab",
  },
];

export default function Home() {
  return (
    <main className="app-shell">
      <header className="hero">
        <div className="badge">
          <Sparkles size={16} /> FAI Creative API Console
        </div>
        <h1>FAI Creative Console</h1>
        <p>Grok編集、fal.ai編集、動画生成をすぐ開けるシンプルな制作メニューです。</p>
      </header>

      <div className="menu-grid">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.href} href={item.href} className="menu-card">
              <div className="menu-top">
                <div className="icon-box">
                  <Icon size={22} />
                </div>
                <span className="small-pill">{item.badge}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <span className="open-link">開く →</span>
            </a>
          );
        })}
      </div>

      <section className="note">
        <p>環境変数:</p>
        <p>Grok/xAI: XAI_API_KEY / XAI_IMAGE_MODEL 任意</p>
        <p>fal.ai: FAL_KEY または FAL_API_KEY</p>
        <p>Promptchan: PROMPTCHAN_API_KEY / PROMPTCHAN_API_URL / PROMPTCHAN_MODEL 任意</p>
      </section>
    </main>
  );
}
