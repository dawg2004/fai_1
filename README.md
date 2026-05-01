# FAI Creative API Console

Grok公式API、fal.ai、Promptchan API を検証する生成AI WebAppです。

## メニュー

- `/` メニュー画面
- `/grok-editor` xAI公式 Grok 顔維持エディター
- `/fal-editor` fal.ai 顔維持エディター
- `/promptchan` Promptchan API Lab

## Grok公式 顔維持エディター

- xAI公式 `/v1/images/edits` を利用
- モデルは `grok-imagine-image`
- 画像アップロード
- 背景変更
- 服装変更
- 背景と服装の同時変更
- Before / After 表示
- API側で顔維持プロンプトを自動付与

## fal.ai 顔維持エディター

- 画像アップロード
- 背景変更
- 服装変更
- 背景と服装の同時変更
- Before / After 表示
- API側で顔維持プロンプトを自動付与

## Promptchan API Lab

- Promptchan APIを別メニューで検証
- 18歳以上確認チェック付き
- API URLは環境変数で差し替え
- APIレスポンスのraw JSONを確認可能

## セットアップ

```bash
npm install
npm run dev
```

`.env.local` を作成してください。

```env
XAI_API_KEY=your_xai_api_key
XAI_IMAGE_MODEL=grok-imagine-image

FAL_KEY=your_fal_api_key
FAL_EDIT_MODEL=fal-ai/nano-banana/edit

PROMPTCHAN_API_KEY=your_promptchan_api_key
PROMPTCHAN_API_URL=https://promptchan-api-endpoint-from-official-docs
PROMPTCHAN_MODEL=optional_model_name
PROMPTCHAN_WIDTH=768
PROMPTCHAN_HEIGHT=1024
PROMPTCHAN_STEPS=30
```

## Vercel環境変数

- `XAI_API_KEY`
- `XAI_IMAGE_MODEL` 任意
- `FAL_KEY`
- `FAL_EDIT_MODEL` 任意
- `PROMPTCHAN_API_KEY`
- `PROMPTCHAN_API_URL`
- `PROMPTCHAN_MODEL` 任意
- `PROMPTCHAN_WIDTH` 任意
- `PROMPTCHAN_HEIGHT` 任意
- `PROMPTCHAN_STEPS` 任意

## 注意

GrokエディターはxAI公式APIのみを利用します。Dreaminaなどの外部サービスは使いません。

各エディターはAPI側で「顔・髪・表情・本人性を維持する」指示を自動付与します。ただし生成AIの性質上、顔の完全一致は保証されません。

Promptchan API Labは成人向け生成に対応する可能性があるAPIの検証枠です。未成年に見える人物、実在人物の性的生成、同意のない人物生成は禁止してください。Promptchan公式ドキュメントの最新仕様に合わせて、`PROMPTCHAN_API_URL` とpayloadを必要に応じて調整してください。
