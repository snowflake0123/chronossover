<div align="center">

# Chronossover

**Any year. Any voice.**

西暦をひとつ選ぶだけで、その時代の日本に存在したかもしれない SNS タイムラインへ飛び込む、生成 AI 駆動のタイムトラベル Web アプリ。

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111111)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-powered-111111?style=for-the-badge&logo=openai&logoColor=white)](https://platform.openai.com/)

</div>

---

## Overview

Chronossover は、過去または未来の西暦を入力すると、当時の日本に Twitter ライクな SNS があったという仮定で、トレンドと投稿群を生成するシングルページアプリケーションです。

ただ眺めるだけではありません。生成された投稿に返信すると、投稿者として振る舞う AI がさらに返事を返してくるため、歴史や未来の空気に直接リプライするような体験ができます。

```txt
┌──────────────────────┐
│  Choose a year       │
│  1999 / 2026 / 4096  │
└──────────┬───────────┘
           │ Chronossover!
           ▼
┌──────────────────────┐
│  Timeline in {year}  │
│  trends -> voices    │
└──────────┬───────────┘
           │ tap a post
           ▼
┌──────────────────────┐
│  Reply through time  │
│  you <-> AI persona  │
└──────────────────────┘
```

## Features

| Feature              | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| Year jump            | 0 年から 9999 年までの西暦を指定して、過去または未来のタイムラインを生成します。 |
| Trend-aware timeline | 対象年の日本の流行を先に生成し、そのトレンドを反映した投稿を作ります。           |
| Pull to refresh      | タイムライン上部を引っ張ると、同じトレンドを使って追加投稿を取得します。         |
| Threaded replies     | 投稿詳細から返信すると、元投稿者の人格・口調を踏まえた AI 返信が返ってきます。   |
| Lightweight SPA      | React Router による `/`, `/home`, `/message/:id` のシンプルな画面構成です。      |
| Developer focused    | TypeScript、Vitest、oxlint、oxfmt、lefthook、semantic-release を備えています。   |

## Screens

```txt
/                 Start
/home             Timeline
/message/:id      Post thread
```

## Tech Stack

- React 19
- Vite 8
- TypeScript 6
- React Router 7
- OpenAI JavaScript SDK
- Vitest + Testing Library
- oxlint / oxfmt
- lefthook + commitlint
- semantic-release

## Getting Started

### Requirements

- Node.js 20+
- pnpm 11+
- OpenAI API key

### Install

```bash
pnpm install
```

### Configure

Create `.env.local` in the project root:

```bash
VITE_OPENAI_API_KEY=sk-...
```

> [!WARNING]
> `VITE_OPENAI_API_KEY` はブラウザ向けバンドルに含まれます。このアプリは開発利用・個人利用を前提にしています。第三者へ公開する本番環境では、サーバー側のプロキシや認証付きバックエンドを用意してください。

### Run

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

## Scripts

| Command             | Purpose                                                       |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Vite dev server を起動します。                                |
| `pnpm build`        | TypeScript の型チェック後、プロダクションビルドを作成します。 |
| `pnpm preview`      | ビルド済みアプリをローカルで確認します。                      |
| `pnpm typecheck`    | `tsc --noEmit` を実行します。                                 |
| `pnpm lint`         | oxlint で静的解析します。                                     |
| `pnpm lint:fix`     | oxlint の自動修正を実行します。                               |
| `pnpm format`       | oxfmt で整形します。                                          |
| `pnpm format:check` | フォーマット差分を検出します。                                |
| `pnpm test`         | Vitest を一回実行します。                                     |
| `pnpm test:watch`   | Vitest の watch mode を起動します。                           |

## How It Works

1. Start 画面で対象年を選びます。
2. 現在年と対象年を比較し、過去モードまたは未来モードを決定します。
3. OpenAI API で対象年のトレンドを生成します。
4. そのトレンドを入力にして、SNS 投稿群を生成します。
5. 投稿をアプリ内モデルへパースし、Timeline に表示します。
6. 投稿へ返信すると、元投稿者としての AI 返信を生成します。

## Project Structure

```txt
src/
  components/        Reusable UI components
  config/            Environment access and validation
  domain/            Message model, parsing, prompts, tests
  pages/             Start, Home, ViewMessage screens
  services/          OpenAI client integration
  state/             App-wide React context
  styles/            Reset, global styles, design tokens
  utils/             Shared formatting helpers
```

## Design Notes

Chronossover は、SNS の密度と Apple 風の余白を混ぜた、静かで没入感のあるインターフェースを目指しています。

- 最初の画面は `Chronossover` のワードマークを中心にした一点突破の導線
- タイムラインは投稿を主役にし、余計な説明を画面外へ退ける構成
- スレッド画面は返信のテンポを優先し、入力から AI 返信までを短い導線に集約
- UI 状態はメモリ上で完結し、ページリロードで初期化

## Development Policy

- API 通信は指数バックオフでリトライします。
- AI からのタイムライン応答は `\eot` 区切りの独自フォーマットとしてパースします。
- 投稿と返信は同じ `Message` モデルを共有します。
- 返信は永続化しません。
- 存在しない投稿 ID へアクセスした場合は Start 画面へ戻します。

## License

This repository is private and currently has no published license.
