import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL_IDS: Record<string, string> = {
  grok: "xai/grok-imagine-video/image-to-video",
  seedance: "bytedance/seedance-2.0/fast/image-to-video",
};

const REQUEST_IDS: Record<string, string> = {
  grok: "xai/grok-imagine-video",
  seedance: "bytedance/seedance-2.0/fast",
};

function getFalKey() {
  return process.env.FAL_KEY ?? process.env.FAL_API_KEY ?? "";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function fileToDataUri(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "image/jpeg";
  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

function extractVideoUrl(result: unknown) {
  const data = result as {
    video?: { url?: string };
    videos?: Array<{ url?: string }>;
    url?: string;
    output?: string | string[];
  };

  return (
    data.video?.url ??
    data.videos?.[0]?.url ??
    data.url ??
    (Array.isArray(data.output) ? data.output[0] : data.output) ??
    null
  );
}

export async function POST(req: NextRequest) {
  try {
    const falKey = getFalKey();

    if (!falKey) {
      return NextResponse.json(
        { error: "FAL_KEY または FAL_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const imageUrlValue = String(formData.get("imageUrl") ?? "").trim();
    const model = String(formData.get("model") ?? "grok");
    const prompt = String(formData.get("prompt") ?? "natural cinematic motion").trim();
    const duration = Number(formData.get("duration") ?? 5);
    const resolution = String(formData.get("resolution") ?? "720p");

    const modelId = MODEL_IDS[model];
    if (!modelId) {
      return NextResponse.json({ error: "invalid model" }, { status: 400 });
    }

    if (!prompt) {
      return NextResponse.json({ error: "動画生成プロンプトを入力してください" }, { status: 400 });
    }

    let imageUrl = imageUrlValue;
    if (file instanceof File && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "画像サイズが大きすぎます。10MB以下のPNG/JPGで試してください。" },
          { status: 400 }
        );
      }
      imageUrl = await fileToDataUri(file);
    }

    if (!imageUrl) {
      return NextResponse.json({ error: "画像をアップロードするか画像URLを指定してください" }, { status: 400 });
    }

    const input: Record<string, unknown> = {
      image_url: imageUrl,
      prompt: [
        prompt,
        "Preserve the same face, identity, facial features, expression, and overall person from the source image.",
        "Do not add watermarks, logos, text overlays, signatures, labels, or brand marks.",
      ].join(" "),
      resolution,
      aspect_ratio: "auto",
    };

    if (model === "seedance") {
      input.duration = String(duration);
      input.generate_audio = false;
    } else {
      input.duration = duration;
    }

    const response = await fetch(`https://queue.fal.run/${modelId}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const text = await response.text();
    let data: unknown = { rawText: text };

    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "fal video queue submit failed", status: response.status, raw: data },
        { status: response.status }
      );
    }

    const request = data as { request_id?: string; requestId?: string };
    const requestId = request.request_id ?? request.requestId;

    if (!requestId) {
      return NextResponse.json({ error: "requestId を取得できませんでした", raw: data }, { status: 502 });
    }

    return NextResponse.json({ success: true, requestId, model });
  } catch (error) {
    console.error("[video submit]", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const falKey = getFalKey();
  const requestId = searchParams.get("requestId");
  const model = searchParams.get("model") ?? "grok";

  if (!falKey) {
    return NextResponse.json(
      { error: "FAL_KEY または FAL_API_KEY が設定されていません" },
      { status: 500 }
    );
  }

  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  const requestModelId = REQUEST_IDS[model];
  if (!requestModelId) {
    return NextResponse.json({ error: "invalid model" }, { status: 400 });
  }

  try {
    const statusResponse = await fetch(
      `https://queue.fal.run/${requestModelId}/requests/${requestId}/status`,
      { headers: { Authorization: `Key ${falKey}` } }
    );

    const statusText = await statusResponse.text();
    let statusData: unknown = { rawText: statusText };

    try {
      statusData = JSON.parse(statusText);
    } catch {
      statusData = { rawText: statusText };
    }

    if (!statusResponse.ok) {
      return NextResponse.json(
        { error: "status check failed", status: statusResponse.status, raw: statusData },
        { status: statusResponse.status }
      );
    }

    const status = statusData as { status?: string; queue_position?: number; logs?: unknown };

    if (status.status === "COMPLETED") {
      const resultResponse = await fetch(
        `https://queue.fal.run/${requestModelId}/requests/${requestId}`,
        { headers: { Authorization: `Key ${falKey}` } }
      );

      const resultText = await resultResponse.text();
      let resultData: unknown = { rawText: resultText };

      try {
        resultData = JSON.parse(resultText);
      } catch {
        resultData = { rawText: resultText };
      }

      if (!resultResponse.ok) {
        return NextResponse.json(
          { error: "result fetch failed", status: resultResponse.status, raw: resultData },
          { status: resultResponse.status }
        );
      }

      return NextResponse.json({
        status: "completed",
        videoUrl: extractVideoUrl(resultData),
        raw: resultData,
      });
    }

    if (status.status === "FAILED") {
      return NextResponse.json({ status: "failed", error: "動画生成に失敗しました", raw: statusData });
    }

    return NextResponse.json({
      status: "processing",
      queuePosition: status.queue_position,
      raw: statusData,
    });
  } catch (error) {
    console.error("[video poll]", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
