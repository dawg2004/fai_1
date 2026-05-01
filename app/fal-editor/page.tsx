"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Sparkles, Upload, Wand2 } from "lucide-react";

type EditMode = "background" | "outfit" | "both";

const presets: Record<EditMode, string[]> = {
  background: [
    "luxury neon lounge background, cinematic night lighting",
    "high-end hotel suite background, soft warm lighting",
    "Tokyo night street background with elegant bokeh lights",
  ],
  outfit: [
    "change outfit to an elegant black evening dress",
    "change outfit to a luxury white suit, premium fashion look",
    "change outfit to a glamorous club-style dress, tasteful and refined",
  ],
  both: [
    "change to an elegant black dress and luxury neon lounge background",
    "change to premium fashion styling in a high-end hotel suite",
    "create a refined nightlife promotional photo with stylish outfit and cinematic background",
  ],
};

export default function FalEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [mode, setMode] = useState<EditMode>("background");
  const [prompt, setPrompt] = useState(presets.background[0]);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [inputUrl, setInputUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => Boolean(file && prompt.trim() && !isLoading), [file, prompt, isLoading]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setResultUrl("");
    setInputUrl("");
    setError("");

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : "");
  }

  function handleModeChange(nextMode: EditMode) {
    setMode(nextMode);
    setPrompt(presets[nextMode][0]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError("");
    setResultUrl("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("mode", mode);
    formData.append("prompt", prompt);

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "編集に失敗しました");
      }

      setResultUrl(data.imageUrl);
      setInputUrl(data.inputUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "編集に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#2b1b5f_0%,#090913_42%,#050507_100%)] px-5 py-8 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <a href="/" className="text-sm text-white/60 hover:text-white">← メニューに戻る</a>
        <header className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-4 py-2 text-sm text-violet-100">
            <Sparkles size={16} /> fal.ai Face-Keep Editor
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            顔を維持したまま、背景や服装をかんたん編集
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
            写真を1枚アップロードして、背景変更・服装変更・両方編集を選ぶだけ。内部で顔維持プロンプトを自動付与して、LUMIVEIL向けの上品なナイトレジャー宣材に寄せます。
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur">
            <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/25 bg-black/20 p-5 text-center transition hover:bg-white/10">
              <Upload className="mb-3 text-violet-200" />
              <span className="text-sm font-medium">画像をアップロード</span>
              <span className="mt-2 text-xs text-white/50">PNG / JPG / WEBP</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
            </label>

            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="mt-4 max-h-80 w-full rounded-2xl object-contain" />
            )}

            <div className="mt-5 grid grid-cols-3 gap-2">
              {([
                ["background", "背景"],
                ["outfit", "服装"],
                ["both", "両方"],
              ] as [EditMode, string][]).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleModeChange(value)}
                  className={`rounded-xl px-3 py-3 text-sm transition ${
                    mode === value ? "bg-violet-400 text-black" : "bg-white/10 text-white/75 hover:bg-white/15"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-sm text-white/80">編集プロンプト</label>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none focus:border-violet-300"
                placeholder="例: luxury neon lounge background, cinematic night lighting"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {presets[mode].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPrompt(item)}
                  className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-left text-xs text-white/65 hover:bg-white/15"
                >
                  {item}
                </button>
              ))}
            </div>

            {error && <p className="mt-4 rounded-xl bg-red-500/15 p-3 text-sm text-red-200">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-300 px-5 py-4 font-semibold text-black transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Wand2 size={18} />
              {isLoading ? "編集中..." : "編集する"}
            </button>
          </form>

          <section className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur">
            <h2 className="mb-4 text-xl font-semibold">生成結果</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-black/25 p-3">
                <p className="mb-3 text-sm text-white/60">Before</p>
                {previewUrl ? (
                  <img src={previewUrl} alt="Before" className="max-h-[560px] w-full rounded-xl object-contain" />
                ) : (
                  <div className="flex min-h-96 items-center justify-center rounded-xl border border-white/10 text-sm text-white/40">
                    画像を選択してください
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-black/25 p-3">
                <p className="mb-3 text-sm text-white/60">After</p>
                {isLoading ? (
                  <div className="flex min-h-96 items-center justify-center rounded-xl border border-violet-300/20 text-sm text-violet-100">
                    fal.aiで編集中です
                  </div>
                ) : resultUrl ? (
                  <div className="space-y-3">
                    <img src={resultUrl} alt="Edited result" className="max-h-[560px] w-full rounded-xl object-contain" />
                    <a href={resultUrl} target="_blank" rel="noreferrer" className="block rounded-xl bg-white/10 px-4 py-3 text-center text-sm hover:bg-white/15">
                      結果画像を開く
                    </a>
                    {inputUrl && (
                      <a href={inputUrl} target="_blank" rel="noreferrer" className="block rounded-xl bg-white/5 px-4 py-3 text-center text-xs text-white/55 hover:bg-white/10">
                        入力画像URLを確認
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-96 items-center justify-center rounded-xl border border-white/10 text-sm text-white/40">
                    ここに編集後画像が表示されます
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/60">
              <p>安全設計:</p>
              <p>顔・髪・表情・本人性を維持する指示をAPI側で自動付与します。</p>
              <p>ナイトレジャー向けの上品な宣材表現を想定し、露骨な成人向け生成は初期対象外です。</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
