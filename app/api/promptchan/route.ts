import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function extractImageUrl(data: unknown): string | null {
  const value = data as {
    imageUrl?: string;
    image_url?: string;
    url?: string;
    output?: string | string[];
    images?: Array<string | { url?: string; image_url?: string }>;
    data?: {
      imageUrl?: string;
      image_url?: string;
      url?: string;
      images?: Array<string | { url?: string; image_url?: string }>;
    };
  };

  const firstImage = value.images?.[0];
  const nestedFirstImage = value.data?.images?.[0];

  return (
    value.imageUrl ??
    value.image_url ??
    value.url ??
    (Array.isArray(value.output) ? value.output[0] : value.output) ??
    (typeof firstImage === "string" ? firstImage : firstImage?.url ?? firstImage?.image_url) ??
    value.data?.imageUrl ??
    value.data?.image_url ??
    value.data?.url ??
    (typeof nestedFirstImage === "string" ? nestedFirstImage : nestedFirstImage?.url ?? nestedFirstImage?.image_url) ??
    null
  );
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.PROMPTCHAN_API_KEY;
    const apiUrl = process.env.PROMPTCHAN_API_URL;

    if (!apiKey) {
      return NextResponse.json(
        { error: "PROMPTCHAN_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    if (!apiUrl) {
      return NextResponse.json(
        { error: "PROMPTCHAN_API_URL が設定されていません。Promptchan公式ドキュメントの生成エンドポイントを設定してください。" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const prompt = String(body.prompt ?? "").trim();
    const negativePrompt = String(body.negativePrompt ?? "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt は必須です" },
        { status: 400 }
      );
    }

    const payload = {
      prompt,
      negative_prompt: negativePrompt,
      model: process.env.PROMPTCHAN_MODEL,
      width: Number(process.env.PROMPTCHAN_WIDTH ?? 768),
      height: Number(process.env.PROMPTCHAN_HEIGHT ?? 1024),
      steps: Number(process.env.PROMPTCHAN_STEPS ?? 30),
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data: unknown = text;

    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Promptchan API error", status: response.status, raw: data },
        { status: response.status }
      );
    }

    const imageUrl = extractImageUrl(data);

    return NextResponse.json({
      success: true,
      imageUrl,
      raw: data,
    });
  } catch (error) {
    console.error("[promptchan]", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
