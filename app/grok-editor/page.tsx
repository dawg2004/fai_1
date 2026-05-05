"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Sparkles, Upload, Wand2, Video } from "lucide-react";

type EditMode = "background" | "outfit" | "pose" | "both";

const presets: Record<EditMode, string[]> = {
  background: [
    "luxury neon lounge background, cinematic night lighting",
    "high-end hotel suite background, soft warm lighting",
    "Tokyo night street background with elegant bokeh lights",
  ],
  outfit: [
    "胸元の開いた水色のキャミソールに変更。服装のみ変更。顔、髪、表情、口元、目線、輪郭、本人性は変更しない。",
    "change outfit to a luxury white suit, premium fashion look",
    "change outfit to a refined club-style dress, tasteful and professional",
  ],
  pose: [
    "change body pose to a confident standing pose with one hand on the hip. Keep the face, identity, outfit, and background unchanged.",
    "change body pose to a seated elegant pose. Keep the face, identity, outfit, and background unchanged.",
    "change body pose to a natural walking pose. Keep the face, identity, outfit, and background unchanged.",
  ],
  both: [
    "change to an elegant black dress and luxury neon lounge background",
    "change to premium fashion styling in a high-end hotel suite",
    "create a refined nightlife promotional photo with stylish outfit and cinematic background",
  ],
};

export default function GrokEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [mode, setMode] = useState<EditMode>("background");
  const [prompt, setPrompt] = useState(presets.background[0]);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [raw, setRaw] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => Boolean(file && prompt.trim() && !isLoading), [file, prompt, isLoading]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setResultUrl("");
    setRaw("");
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
    setRaw("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("mode", mode);
    formData.append("prompt", prompt);

    try {
      const res = await fetch("/api/grok-edit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? JSON.stringify(data.raw ?? data));
      }

      setResultUrl(data.imageUrl);
      setRaw(JSON.stringify(data.raw ?? data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Grok APIの実行に失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <a href="/" className="back-link">← メニューに戻る</a>

      <header className="hero">
        <div className="badge">
          <Sparkles size={16} /> Grok Official Image Edit
        </div>
        <h1>Grok APIで顔維持編集</h1>
        <p>
          xAI公式のGrok Image APIを使って、顔の印象を維持したまま背景・服装・ポーズを編集します。生成結果からそのまま動画生成へ進めます。
        </p>
      </header>

      <div className="editor-grid">
        <form onSubmit={handleSubmit} className="glass-card">
          <label className="upload-box">
            <Upload color="var(--violet)" />
            <span className="upload-title">画像をアップロード</span>
            <span className="upload-sub">PNG / JPG 推奨・12MB以下</span>
            <input type="file" accept="image/png,image/jpeg" onChange={handleFileChange} />
          </label>

          {previewUrl && <img src={previewUrl} alt="Preview" className="preview-img" />}

          <div className="segment">
            {([
              ["background", "背景"],
              ["outfit", "服装"],
              ["pose", "ポーズ"],
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
              placeholder="例: change body pose to a confident standing pose"
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
            {isLoading ? "Grok APIで編集中..." : "Grokで編集する"}
          </button>
        </form>

        <section className="glass-card result-card">
          <h2>生成結果</h2>
          <div className="compare-grid">
            <div className="image-panel">
              <p className="panel-label">Before</p>
              {previewUrl ? <img src={previewUrl} alt="Before" className="result-img" /> : <div className="empty-state">画像を選択してください</div>}
            </div>

            <div className="image-panel">
              <p className="panel-label">After</p>
              {isLoading ? (
                <div className="empty-state">Grok APIで編集中です</div>
              ) : resultUrl ? (
                <div>
                  <img src={resultUrl} alt="Edited result" className="result-img" />
                  <div className="result-actions">
                    <a href={resultUrl} target="_blank" rel="noreferrer" className="secondary-btn">結果画像を開く</a>
                    <a href={`/video-generator?imageUrl=${encodeURIComponent(resultUrl)}`} className="primary-btn">
                      <Video size={18} /> 動画生成へ
                    </a>
                  </div>
                </div>
              ) : (
                <div className="empty-state">ここに編集後画像が表示されます</div>
              )}
            </div>
          </div>

          {raw && <pre className="raw-box">{raw}</pre>}

          <div className="safety-box">
            <p>使用API:</p>
            <p>xAI公式 `/v1/images/edits`、モデル `grok-imagine-image` を利用します。</p>
            <p>ポーズ変更は顔の一致度が下がる場合があるため、顔固定プロンプトを優先します。</p>
          </div>
        </section>
      </div>
    </main>
  );
}
