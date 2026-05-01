import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_MODEL = "fal-ai/nano-banana/edit";
const REQUEST_TIMEOUT_MS = 55_000;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function normalizeImageUrl(output: unknown): string | null {
  const data = output as {
    images?: { url?: string }[];
    image?: { url?: string };
    url?: string;
    output?: string | string[];
  };

  return (
    data.images?.[0]?.url ??
    data.image?.url ??
    data.url ??
    (Array.isArray(data.output) ? data.output[0] : data.output) ??
    null
  );
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("fal.aiの処理が長すぎるためタイムアウトしました。画像サイズを小さくするか、もう一度試してください。")), ms);
    }),
  ]);
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: "FAL_KEY が設定されていません" },
        { status: 500 }
      );
    }

    fal.config({ credentials: process.env.FAL_KEY });

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
        { error: "画像サイズが大きすぎます。8MB以下の画像で試してください。" },
        { status: 400 }
      );
    }

    const uploadedUrl = await withTimeout(fal.storage.upload(image), 20_000);

    const faceLockPrompt = [
      "Preserve the person's facial identity, face shape, eyes, nose, mouth, skin tone, hairstyle, expression, and pose as much as possible.",
      "Do not change the person's face. Do not beautify into a different person. Keep the same person.",
      "Keep the result realistic, clean, high quality, and suitable for a professional profile or nightlife promotional photo.",
    ].join(" ");

    const modeInstruction =
      mode === "outfit"
        ? "Edit only the outfit/clothing. Keep the face, hair, body pose, background composition, and identity consistent."
        : mode === "both"
          ? "Edit the background and outfit while preserving the face and identity."
          : "Edit only the background. Keep the person, face, hair, outfit, and body pose consistent.";

    const prompt = `${faceLockPrompt} ${modeInstruction} User edit request: ${userPrompt}`;
    const model = process.env.FAL_EDIT_MODEL ?? DEFAULT_MODEL;

    const result = await withTimeout(
      fal.subscribe(model, {
        input: {
          prompt,
          image_urls: [uploadedUrl],
          num_images: 1,
          aspect_ratio: "auto",
          output_format: "png",
          safety_tolerance: "4",
          limit_generations: true,
        },
        logs: true,
        onQueueUpdate: (update) => {
          console.log("[fal queue]", update.status);
        },
      }),
      REQUEST_TIMEOUT_MS
    );

    const imageUrl = normalizeImageUrl(result.data);

    if (!imageUrl) {
      return NextResponse.json(
        { error: "生成結果の画像URLを取得できませんでした", raw: result.data },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      inputUrl: uploadedUrl,
      imageUrl,
      mode,
      prompt,
      model,
      requestId: result.requestId,
    });
  } catch (error) {
    console.error("[edit]", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
