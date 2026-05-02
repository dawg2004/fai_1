import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const XAI_IMAGE_EDIT_URL = "https://api.x.ai/v1/images/edits";
const DEFAULT_MODEL = "grok-imagine-image";
const REQUEST_TIMEOUT_MS = 55_000;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function getMimeType(file: File) {
  if (file.type === "image/png") return "image/png";
  if (file.type === "image/jpeg") return "image/jpeg";
  if (file.type === "image/jpg") return "image/jpeg";
  return "image/png";
}

async function fileToDataUri(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  return `data:${getMimeType(file)};base64,${base64}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Grok APIの処理が長すぎるためタイムアウトしました。画像サイズを小さくするか、もう一度試してください。")), ms);
    }),
  ]);
}

function extractImageUrl(data: unknown): string | null {
  const value = data as {
    data?: Array<{ url?: string; b64_json?: string }>;
    url?: string;
    imageUrl?: string;
    image_url?: string;
  };

  const first = value.data?.[0];

  if (first?.url) return first.url;
  if (first?.b64_json) return `data:image/png;base64,${first.b64_json}`;
  return value.url ?? value.imageUrl ?? value.image_url ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.XAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "XAI_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image");
    const mode = String(formData.get("mode") ?? "background");
    const userPrompt = String(formData.get("prompt") ?? "").trim();

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "編集する画像をアップロードしてください" },
        { status: 400 }
      );
    }

    if (!userPrompt) {
      return NextResponse.json(
        { error: "編集内容を入力してください" },
        { status: 400 }
      );
    }

    if (image.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "画像サイズが大きすぎます。8MB以下のPNG/JPGで試してください。" },
        { status: 400 }
      );
    }

    if (!["image/png", "image/jpeg", "image/jpg"].includes(image.type)) {
      return NextResponse.json(
        { error: "Grok API用にはPNGまたはJPG画像を使ってください。" },
        { status: 400 }
      );
    }

    const imageDataUri = await fileToDataUri(image);

    const faceLockPrompt = [
      "Preserve the exact same person's facial identity, face shape, eyes, nose, mouth, skin tone, hairstyle, expression, and pose as much as possible.",
      "Do not change the face. Do not create a different person. Keep the same person and realistic photographic quality.",
    ].join(" ");

    const modeInstruction =
      mode === "outfit"
        ? "Edit only the outfit/clothing while keeping the face, hair, body pose, and identity consistent."
        : mode === "both"
          ? "Edit the background and outfit while preserving the face and identity."
          : "Edit only the background while keeping the person, face, hair, outfit, and body pose consistent.";

    const safetyInstruction =
      "Do not depict minors or anyone who appears under 20 in sexualized styling. Keep the result tasteful, consent-respecting, and suitable for professional nightlife promotional use.";

    const prompt = `${faceLockPrompt} ${modeInstruction} ${safetyInstruction} User edit request: ${userPrompt}`;

    const requestBody = {
      model: process.env.XAI_IMAGE_MODEL ?? DEFAULT_MODEL,
      prompt,
      images: [
        {
          type: "image_url",
          url: imageDataUri,
        },
      ],
      response_format: "url",
      aspect_ratio: "auto",
      n: 1,
    };

    const response = await withTimeout(
      fetch(XAI_IMAGE_EDIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }),
      REQUEST_TIMEOUT_MS
    );

    const text = await response.text();
    let data: unknown = { rawText: text };

    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Grok API error",
          status: response.status,
          raw: data,
          sentShape: "POST /v1/images/edits with images[]",
        },
        { status: response.status }
      );
    }

    const imageUrl = extractImageUrl(data);

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Grok APIの画像URLを取得できませんでした", raw: data },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      mode,
      prompt,
      model: process.env.XAI_IMAGE_MODEL ?? DEFAULT_MODEL,
      raw: data,
    });
  } catch (error) {
    console.error("[grok-edit]", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
