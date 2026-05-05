"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Video } from "lucide-react";

function VideoGeneratorContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl") ?? "";
  const [prompt, setPrompt] = useState("subtle cinematic camera movement, natural motion, elegant nightlife promotional video, preserve the same face and identity");

  return (
    <main className="app-shell">
      <a href="/" className="back-link">← メニューに戻る</a>

      <header className="hero">
        <div className="badge">
          <Sparkles size={16} /> Image to Video
        </div>
        <h1>画像から動画生成</h1>
        <p>
          ポーズ変更後の画像を使って動画生成へ進みます。ここに今後 Seedance / Grok / fal.ai などの動画生成APIを接続できます。
        </p>
      </header>

      <div className="editor-grid">
        <section className="glass-card">
          <div className="field" style={{ marginTop: 0 }}>
            <label>動画生成プロンプト</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              placeholder="例: subtle cinematic camera movement"
            />
          </div>

          <button className="primary-btn" type="button" onClick={() => alert("次の実装で image-to-video API を接続します")}> 
            <Video size={18} /> 動画生成を開始
          </button>

          <div className="safety-box">
            <p>次段階:</p>
            <p>このボタンに Seedance 2.0 / fal.ai / Replicate / Grok video API を接続できます。</p>
            <p>まずはポーズ変更後の静止画を受け取る導線まで実装済みです。</p>
          </div>
        </section>

        <section className="glass-card result-card">
          <h2>元画像</h2>
          {imageUrl ? (
            <img src={imageUrl} alt="Source for video generation" className="result-img" />
          ) : (
            <div className="empty-state">画像URLがありません</div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function VideoGeneratorPage() {
  return (
    <Suspense fallback={<main className="app-shell"><div className="empty-state">読み込み中...</div></main>}>
      <VideoGeneratorContent />
    </Suspense>
  );
}
