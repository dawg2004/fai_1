"use client";

import { ChangeEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Upload, Video } from "lucide-react";

type VideoModel = "grok" | "seedance";

function VideoGeneratorContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl") ?? "";
  const pollRef = useRef<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  const [model, setModel] = useState<VideoModel>("grok");
  const [prompt, setPrompt] = useState("subtle cinematic camera movement, natural motion, elegant promotional video, preserve the same face and identity");
  const [duration, setDuration] = useState(5);
  const [resolution, setResolution] = useState("720p");
  const [requestId, setRequestId] = useState("");
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(
    () => Boolean((file || previewUrl) && prompt.trim() && !isLoading),
    [file, previewUrl, prompt, isLoading]
  );

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setVideoUrl("");
    setRequestId("");
    setError("");

    if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : imageUrl);
  }

  async function poll(nextRequestId: string, nextModel: VideoModel) {
    const response = await fetch(`/api/video?requestId=${encodeURIComponent(nextRequestId)}&model=${nextModel}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "ステータス確認に失敗しました");
    }

    if (data.status === "completed") {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
      setVideoUrl(data.videoUrl ?? "");
      setStatus("完了");
      setIsLoading(false);
      if (!data.videoUrl) setError("動画URLを取得できませんでした");
      return;
    }

    if (data.status === "failed") {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
      setStatus("失敗");
      setIsLoading(false);
      setError(data.error ?? "動画生成に失敗しました");
      return;
    }

    setStatus(typeof data.queuePosition === "number" ? `生成中 / queue ${data.queuePosition}` : "生成中");
  }

  async function handleSubmit() {
    setIsLoading(true);
    setError("");
    setVideoUrl("");
    setRequestId("");
    setStatus("キュー投入中");

    if (pollRef.current) window.clearInterval(pollRef.current);

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      formData.append("imageUrl", imageUrl);
    }
    formData.append("model", model);
    formData.append("prompt", prompt);
    formData.append("duration", String(duration));
    formData.append("resolution", resolution);

    try {
      const response = await fetch("/api/video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? JSON.stringify(data.raw ?? data));
      }

      setRequestId(data.requestId);
      setStatus("生成中");
      await poll(data.requestId, model);
      pollRef.current = window.setInterval(() => {
        poll(data.requestId, model).catch((err) => {
          if (pollRef.current) window.clearInterval(pollRef.current);
          pollRef.current = null;
          setError(err instanceof Error ? err.message : "ステータス確認に失敗しました");
          setIsLoading(false);
        });
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "動画生成に失敗しました");
      setStatus("");
      setIsLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <a href="/" className="back-link">← メニューに戻る</a>

      <header className="hero">
        <div className="badge">
          <Sparkles size={16} /> Image to Video
        </div>
        <h1>画像から動画生成</h1>
        <p>
          編集済み画像またはアップロード画像から、Grok / Seedance のImage-to-Videoを実行します。
        </p>
      </header>

      <div className="editor-grid">
        <section className="glass-card">
          <label className="upload-box compact-upload">
            <Upload color="var(--violet)" />
            <span className="upload-title">画像をアップロード</span>
            <span className="upload-sub">編集結果URLがある場合はその画像を使います</span>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
          </label>

          {previewUrl && <img src={previewUrl} alt="Source preview" className="preview-img" />}

          <div className="segment two-col">
            {([
              ["grok", "Grok"],
              ["seedance", "Seedance"],
            ] as [VideoModel, string][]).map(([value, label]) => (
              <button key={value} type="button" onClick={() => setModel(value)} className={model === value ? "active" : ""}>
                {label}
              </button>
            ))}
          </div>

          <div className="field">
            <label>動画生成プロンプト</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              placeholder="例: subtle cinematic camera movement"
            />
          </div>

          <div className="inline-fields">
            <div className="field">
              <label>秒数</label>
              <select value={duration} onChange={(event) => setDuration(Number(event.target.value))}>
                <option value={5}>5秒</option>
                <option value={10}>10秒</option>
              </select>
            </div>
            <div className="field">
              <label>解像度</label>
              <select value={resolution} onChange={(event) => setResolution(event.target.value)}>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
          </div>

          {error && <p className="error-box">{error}</p>}

          <button className="primary-btn" type="button" disabled={!canSubmit} onClick={handleSubmit}>
            <Video size={18} /> {isLoading ? "生成中..." : "動画生成を開始"}
          </button>

          <div className="safety-box">
            <p>使用API:</p>
            <p>fal.ai queue 経由で Grok Imagine Video / Seedance 2.0 Fast を呼び出します。</p>
            {requestId && <p>Request ID: {requestId}</p>}
            {status && <p>Status: {status}</p>}
          </div>
        </section>

        <section className="glass-card result-card">
          <h2>動画結果</h2>
          {isLoading ? (
            <div className="empty-state">動画を生成しています</div>
          ) : videoUrl ? (
            <div>
              <video src={videoUrl} className="result-video" controls playsInline />
              <div className="result-actions">
                <a href={videoUrl} target="_blank" rel="noreferrer" className="secondary-btn">動画を開く</a>
              </div>
            </div>
          ) : previewUrl ? (
            <img src={previewUrl} alt="Source for video generation" className="result-img" />
          ) : (
            <div className="empty-state">画像を選択してください</div>
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
