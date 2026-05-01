# FAI Face-Keep Editor

fal.ai を使って、顔の印象を維持したまま背景や服装を編集するWebAppです。

## 機能

- 画像アップロード
- 背景変更
- 服装変更
- 背景と服装の同時変更
- Before / After 表示
- fal.ai 側へ顔維持プロンプトを自動付与

## セットアップ

```bash
npm install
npm run dev
```

`.env.local` を作成して、fal.ai のAPIキーを設定してください。

```env
FAL_KEY=your_fal_api_key
```

必要に応じて編集モデルを差し替えられます。

```env
FAL_EDIT_MODEL=fal-ai/nano-banana/edit
```

## Vercel環境変数

- `FAL_KEY`
- `FAL_EDIT_MODEL` 任意

## 注意

このMVPはAPI側で「顔・髪・表情・本人性を維持する」指示を自動付与します。ただし生成AIの性質上、顔の完全一致は保証されません。必要に応じて、顔検出・マスク・参照画像固定・出力チェックを追加してください。
