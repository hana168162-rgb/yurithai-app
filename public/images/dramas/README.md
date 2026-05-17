# ドラマのカバー画像

## 配置ルール

各作品のサムネをこのフォルダに配置してください：

```
public/images/dramas/
├── gap.jpg
├── the-loyal-pin.jpg
├── only-you.jpg
├── the-secret-of-us.jpg
├── 23-5.jpg
├── pluto.jpg
├── us.jpg
├── roller-coaster.jpg
├── poisonous-love.jpg
├── the-earth.jpg
├── love-design.jpg
├── affair.jpg
├── harmony-secret.jpg
├── mate.jpg
├── the-water.jpg
├── dangerous-queen.jpg
├── i-wanna-be-suptar.jpg
├── blank.jpg
├── my-safe-zone.jpg
└── reverse-with-me.jpg
```

**ファイル名は `content/dramas.json` の `slug` と一致させる**こと。

## 推奨スペック

| 項目 | 推奨値 |
|---|---|
| アスペクト比 | **3:4（縦長）** |
| 解像度 | 480×640px 以上（カード表示用） |
| 詳細ページ用大判 | 720×960px |
| ファイル形式 | `.jpg`（写真）または `.webp`（軽量・推奨） |
| ファイルサイズ | 200KB以下が理想（最適化後） |

`next/image` が自動で複数解像度を生成するので、1つ高解像度ファイルを置けば自動で `srcset` 配信されます。

## データ反映

画像を配置したら、`content/dramas.json` の該当作品の `cover_image` フィールドを更新：

```json
{
  "slug": "gap",
  ...
  "cover_image": "/images/dramas/gap.jpg",
  "cover_credit": "© IDOLFACTORY · Instagram @idolfactoryth"
}
```

`cover_credit` はカード/詳細ページでツールチップやキャプションとして表示する出典明記用です。

## 著作権について

タイGLドラマの公式キービジュアル・場面写真は、各制作会社・配信プラットフォームに著作権があります。
本サイトで使用する場合は以下のいずれかの方針を取ってください：

### A. 利用許諾を得る（最も安全）
- 各制作会社のInstagramアカウントへDMで連絡
- 「ファンサイトでサムネとして紹介したい」と申請
- 許諾文と引換えに使用 → `cover_credit` に「Used with permission」明記

### B. 引用としての使用（要・出典明記）
- 著作権法32条の引用要件を満たす運用
- 必須条件：
  - **明瞭区別性**：自分のコンテンツと区別できる枠やキャプション
  - **主従関係**：レビュー本文が主、画像が従
  - **出典明記**：`cover_credit` フィールドに必ず記載
  - **改変なし**：トリミング・色変更は最小限
- 低解像度（480×640程度）に留めることでフェアユース寄りに
- 制作会社から削除要請があれば即時対応

### C. Instagram埋め込み（公式に許可されたAPI）
- Instagram の oEmbed を使った投稿埋め込み
- 著作権者の管理下で表示されるため法的に最も安全
- ホームのサムネには使えない（埋め込みは詳細ページ向け）

## サムネ収集の現実的なワークフロー

1. **Instagram から保存**：公式アカウントの最新ポスター投稿をスクショ → 編集ツールで3:4にトリミング → 480×640にリサイズ → `.webp` で書き出し
2. **MyDramaList の cover を参考**：公式キービジュアルが整理されているので参照に便利（ただし直接hot-linkは× ）
3. **作品が手元にない場合**：仮で `cover_gradient`（現状のグラデーション）のままにしておき、後追いで差し替え

---

迷ったら、まずFreenBeckyとLingOrmなど主要ペアの作品から優先的に画像を入れていくのが良いです。
