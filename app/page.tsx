import { Sparkles, Wand2, ShieldAlert } from "lucide-react";

const menuItems = [
  {
    href: "/fal-editor",
    title: "fal.ai 顔維持エディター",
    description: "顔の印象を維持したまま、背景・服装・両方を編集します。LUMIVEIL向けの上品な宣材写真生成に最適です。",
    icon: Wand2,
    badge: "Main",
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
        <h1>生成AIメニュー</h1>
        <p>fal.aiの顔維持編集と、Promptchan API検証を別メニューで管理します。</p>
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
        <p>fal.ai: FAL_KEY</p>
        <p>Promptchan: PROMPTCHAN_API_KEY / PROMPTCHAN_API_URL / PROMPTCHAN_MODEL 任意</p>
      </section>
    </main>
  );
}
