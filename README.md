# PDF to PowerPoint Converter - Web Application

クリーンでモダンなUIでPDFをPowerPointに変換するWebアプリケーション。

![Clean White UI](https://img.shields.io/badge/Theme-White-ffffff?style=flat&labelColor=f5f5f7)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Status](https://img.shields.io/badge/Status-Ready-brightgreen)

## 🚀 クイックスタート

### 1. 依存パッケージのインストール

```bash
cd webapp
pip install -r requirements.txt
```

### 2. Gemini APIキーの設定

```bash
# Windows
set GEMINI_API_KEY=your_api_key_here

# macOS/Linux
export GEMINI_API_KEY=your_api_key_here
```

### 3. サーバー起動

```bash
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```

### 4. ブラウザでアクセス

```
http://localhost:8000/static/index.html
```

## ⚡ 変換モード

2つの変換モードから選択できます：

| モード | 説明 | 使用コンバーター |
|--------|------|------------------|
| ⚡ **Precision Mode** | 精度とファイルサイズを最適化。通常のPDFに最適。 | `standalone_convert.py` |
| 🛡️ **Safeguard Mode** | 全スライドに元画像のバックアップレイヤーを追加。複雑なデザインのPDFに推奨。 | `standalone_convert_v4.py` |

## 📁 ファイル構成

```
webapp/
├── server.py                    # FastAPI バックエンド
├── requirements.txt             # Python依存パッケージ
├── standalone_convert.py        # Precision Mode コンバーター
├── standalone_convert_v4.py     # Safeguard Mode コンバーター
├── static/
│   ├── index.html               # フロントエンドHTML
│   ├── styles.css               # クリーンホワイトテーマCSS
│   └── app.js                   # フロントエンドJS
├── uploads/                     # アップロードされたPDF
├── output/                      # 生成されたPPTX
└── temp_processing/             # 一時処理ファイル
```

## ✨ 機能

- **ドラッグ&ドロップ対応**: PDFファイルを簡単にアップロード
- **モード選択**: Precision / Safeguard の2モードから選択可能
- **リアルタイム進捗表示**: 変換処理の進捗をライブ表示
- **クリーンホワイトUI**: Apple/Google風のモダンなデザイン

## 📋 API エンドポイント

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/upload` | PDFアップロード（`mode`パラメータ対応） |
| POST | `/api/process/{job_id}` | 変換開始 |
| GET | `/api/status/{job_id}` | 進捗確認 |
| GET | `/api/download/{job_id}` | PPTX ダウンロード |
| DELETE | `/api/job/{job_id}` | ジョブクリーンアップ |

## 🎨 デザイン特徴

- **カラーパレット**: クリーンホワイト × Apple Blue (#007aff)
- **タイポグラフィ**: SF Pro Display / Inter フォント
- **エフェクト**:
  - ソフトシャドウ
  - スムーズなトランジション
  - モダンなカードレイアウト
  - 直感的なモードセレクター
