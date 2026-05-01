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
    <main className="app-shell">
      <a href="/" className="back-link">← メニューに戻る</a>

      <header className="hero">
        <div className="badge pink">
          <Sparkles size={16} /> Promptchan API Lab
        </div>
        <h1>Promptchan API 検証メニュー</h1>
        <p>
          Promptchan APIを別メニューで検証します。公式API仕様のエンドポイントは環境変数で差し替え可能にしてあります。
        </p>
      </header>

      <div className="editor-grid">
        <form onSubmit={handleSubmit} className="glass-card">
          <div className="warning-box">
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, marginBottom: 8 }}>
              <ShieldAlert size={18} /> 安全確認
            </div>
            <p>このメニューは成人向け生成に対応する可能性があるAPIの検証枠です。</p>
            <p>未成年に見える人物、実在人物の性的生成、同意のない人物生成は禁止してください。</p>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              checked={isAdultConfirmed}
              onChange={(event) => setIsAdultConfirmed(event.target.checked)}
            />
            <span>18歳以上であり、API提供元と本アプリの利用規約に従って検証します。</span>
          </label>

          <div className="field">
            <label>プロンプト</label>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={6} />
          </div>

          <div className="field">
            <label>ネガティブプロンプト</label>
            <textarea value={negativePrompt} onChange={(event) => setNegativePrompt(event.target.value)} rows={4} />
          </div>

          {error && <p className="error-box">{error}</p>}

          <button type="submit" disabled={isLoading || !prompt.trim()} className="primary-btn pink">
            <Wand2 size={18} />
            {isLoading ? "生成中..." : "Promptchan APIを実行"}
          </button>
        </form>

        <section className="glass-card result-card">
          <h2>生成結果</h2>
          {isLoading ? (
            <div className="empty-state">API実行中です</div>
          ) : resultUrl ? (
            <div>
              <img src={resultUrl} alt="Promptchan result" className="result-img" />
              <div className="result-actions">
                <a href={resultUrl} target="_blank" rel="noreferrer" className="secondary-btn">
                  結果画像を開く
                </a>
              </div>
            </div>
          ) : (
            <div className="empty-state">ここに結果が表示されます</div>
          )}

          {raw && <pre className="raw-box">{raw}</pre>}

          <div className="safety-box">
            <p>実装メモ:</p>
            <p>Promptchan公式API仕様が変わっても、API URLとモデル名を環境変数で差し替えられる構造です。</p>
          </div>
        </section>
      </div>
    </main>
  );
}
