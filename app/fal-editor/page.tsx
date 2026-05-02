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
    "胸の谷間が見える水色のキャミソールで舌を思いっきり出してる",
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
    <main className="app-shell">
      <a href="/" className="back-link">← メニューに戻る</a>

      <header className="hero">
        <div className="badge">
          <Sparkles size={16} /> fal.ai Face-Keep Editor
        </div>
        <h1>顔を維持したまま、背景や服装をかんたん編集</h1>
        <p>
          写真を1枚アップロードして、背景変更・服装変更・両方編集を選ぶだけ。内部で顔維持プロンプトを自動付与して、LUMIVEIL向けの上品なナイトレジャー宣材に寄せます。
        </p>
      </header>

      <div className="editor-grid">
        <form onSubmit={handleSubmit} className="glass-card">
          <label className="upload-box">
            <Upload color="var(--violet)" />
            <span className="upload-title">画像をアップロード</span>
            <span className="upload-sub">PNG / JPG / WEBP</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
          </label>

          {previewUrl && <img src={previewUrl} alt="Preview" className="preview-img" />}

          <div className="segment">
            {([
              ["background", "背景"],
              ["outfit", "服装"],
              ["both", "両方"],
            ] as [EditMode, string][]).map(([value, label]) => (
              <button key={value} type="button" onClick={() => handleModeChange(value)} className={mode === value ? "active" : ""}>
                {label}
              </button>
            ))}
          </div>

          <div className="field">
            <label>編集プロンプト</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              placeholder="例: luxury neon lounge background, cinematic night lighting"
            />
          </div>

          <div className="preset-wrap">
            {presets[mode].map((item) => (
              <button key={item} type="button" onClick={() => setPrompt(item)} className="preset">
                {item}
              </button>
            ))}
          </div>

          {error && <p className="error-box">{error}</p>}

          <button type="submit" disabled={!canSubmit} className="primary-btn">
            <Wand2 size={18} />
            {isLoading ? "編集中..." : "編集する"}
          </button>
        </form>

        <section className="glass-card result-card">
          <h2>生成結果</h2>
          <div className="compare-grid">
            <div className="image-panel">
              <p className="panel-label">Before</p>
              {previewUrl ? (
                <img src={previewUrl} alt="Before" className="result-img" />
              ) : (
                <div className="empty-state">画像を選択してください</div>
              )}
            </div>

            <div className="image-panel">
              <p className="panel-label">After</p>
              {isLoading ? (
                <div className="empty-state">fal.aiで編集中です</div>
              ) : resultUrl ? (
                <div>
                  <img src={resultUrl} alt="Edited result" className="result-img" />
                  <div className="result-actions">
                    <a href={resultUrl} target="_blank" rel="noreferrer" className="secondary-btn">
                      結果画像を開く
                    </a>
                    {inputUrl && (
                      <a href={inputUrl} target="_blank" rel="noreferrer" className="secondary-btn">
                        入力画像URLを確認
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="empty-state">ここに編集後画像が表示されます</div>
              )}
            </div>
          </div>

          <div className="safety-box">
            <p>安全設計:</p>
            <p>顔・髪・表情・本人性を維持する指示をAPI側で自動付与します。</p>
            <p>ナイトレジャー向けの上品な宣材表現を想定し、露骨な成人向け生成は初期対象外です。</p>
          </div>
        </section>
      </div>
    </main>
  );
}
