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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#2b1b5f_0%,#090913_42%,#050507_100%)] px-5 py-8 text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-4 py-2 text-sm text-violet-100">
            <Sparkles size={16} /> FAI Creative API Console
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            生成AIメニュー
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
            fal.aiの顔維持編集と、Promptchan API検証を別メニューで管理します。
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur transition hover:-translate-y-1 hover:bg-white/12"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-violet-100">
                    <Icon size={22} />
                  </div>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/60">
                    {item.badge}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
                <p className="mt-5 text-sm text-violet-200 group-hover:text-violet-100">開く →</p>
              </a>
            );
          })}
        </div>

        <section className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white/60">
          <p>環境変数:</p>
          <p>fal.ai: FAL_KEY</p>
          <p>Promptchan: PROMPTCHAN_API_KEY / PROMPTCHAN_API_URL / PROMPTCHAN_MODEL 任意</p>
        </section>
      </section>
    </main>
  );
}
