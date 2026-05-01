"use client";

import { FormEvent, useState } from "react";
import { ShieldAlert, Sparkles, Wand2 } from "lucide-react";

const defaultPrompt = "cinematic premium portrait, elegant nightlife styling, realistic, high quality";

export default function PromptchanPage() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [negativePrompt, setNegativePrompt] = useState("low quality, blurry, distorted face, extra fingers, bad anatomy");
  const [resultUrl, setResultUrl] = useState("");
  const [raw, setRaw] = useState("");
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResultUrl("");
    setRaw("");

    if (!isAdultConfirmed) {
      setError("このメニューを使うには、18歳以上であることと利用規約を確認してください。");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/promptchan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, negativePrompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Promptchan APIの実行に失敗しました");
      }

      setResultUrl(data.imageUrl ?? "");
      setRaw(JSON.stringify(data.raw ?? data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Promptchan APIの実行に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#4a1230_0%,#100710_42%,#050507_100%)] px-5 py-8 text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <a href="/" className="text-sm text-white/60 hover:text-white">← メニューに戻る</a>

        <header className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-300/30 bg-pink-400/10 px-4 py-2 text-sm text-pink-100">
            <Sparkles size={16} /> Promptchan API Lab
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Promptchan API 検証メニュー
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
            Promptchan APIを別メニューで検証します。公式API仕様のエンドポイントは環境変数で差し替え可能にしてあります。
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-100">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldAlert size={18} /> 安全確認
              </div>
              <p>このメニューは成人向け生成に対応する可能性があるAPIの検証枠です。</p>
              <p>未成年に見える人物、実在人物の性的生成、同意のない人物生成は禁止してください。</p>
            </div>

            <label className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/75">
              <input
                type="checkbox"
                checked={isAdultConfirmed}
                onChange={(event) => setIsAdultConfirmed(event.target.checked)}
                className="mt-1"
              />
              <span>18歳以上であり、API提供元と本アプリの利用規約に従って検証します。</span>
            </label>

            <div className="mt-5 space-y-2">
              <label className="text-sm text-white/80">プロンプト</label>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={6}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none focus:border-pink-300"
              />
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-sm text-white/80">ネガティブプロンプト</label>
              <textarea
                value={negativePrompt}
                onChange={(event) => setNegativePrompt(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none focus:border-pink-300"
              />
            </div>

            {error && <p className="mt-4 rounded-xl bg-red-500/15 p-3 text-sm text-red-200">{error}</p>}

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-300 px-5 py-4 font-semibold text-black transition hover:bg-pink-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Wand2 size={18} />
              {isLoading ? "生成中..." : "Promptchan APIを実行"}
            </button>
          </form>

          <section className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur">
            <h2 className="mb-4 text-xl font-semibold">生成結果</h2>
            {isLoading ? (
              <div className="flex min-h-96 items-center justify-center rounded-2xl border border-pink-300/20 bg-black/25 text-sm text-pink-100">
                API実行中です
              </div>
            ) : resultUrl ? (
              <div className="space-y-4">
                <img src={resultUrl} alt="Promptchan result" className="max-h-[620px] w-full rounded-2xl object-contain" />
                <a href={resultUrl} target="_blank" rel="noreferrer" className="block rounded-xl bg-white/10 px-4 py-3 text-center text-sm hover:bg-white/15">
                  結果画像を開く
                </a>
              </div>
            ) : (
              <div className="flex min-h-96 items-center justify-center rounded-2xl border border-white/10 bg-black/25 text-sm text-white/40">
                ここに結果が表示されます
              </div>
            )}

            {raw && (
              <pre className="mt-5 max-h-80 overflow-auto rounded-2xl bg-black/40 p-4 text-xs text-white/65">
                {raw}
              </pre>
            )}

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/60">
              <p>実装メモ:</p>
              <p>Promptchan公式API仕様が変わっても、API URLとモデル名を環境変数で差し替えられる構造です。</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
