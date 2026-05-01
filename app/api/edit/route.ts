import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const DEFAULT_MODEL = "fal-ai/nano-banana/edit";

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

    const uploadedUrl = await fal.storage.upload(image);

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

    const result = await fal.subscribe(process.env.FAL_EDIT_MODEL ?? DEFAULT_MODEL, {
      input: {
        prompt,
        image_urls: [uploadedUrl],
      },
      logs: false,
    });

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
      model: process.env.FAL_EDIT_MODEL ?? DEFAULT_MODEL,
    });
  } catch (error) {
    console.error("[edit]", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
