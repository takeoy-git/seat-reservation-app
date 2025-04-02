# 映像コンテンツ体験サービス予約アプリ

---

## テストログイン情報

- **ID**：`reserve-test@reserve.com`
- **パスワード**：`reserve-test@reserve.com`

---

## 本アプリ使用イメージ

1. お客さま来店
2. 映像鑑賞希望者は設置型サイネージをタッチし時間予約（本アプリ使用）
3. 希望時間になったら着席

---

## アプリ操作の流れ

- **使用機器**：縦型タッチパネル式サイネージ

### スタッフの操作

1. 営業時間前にログイン
2. Chromeのキオスクモードで起動
3. 予約ページを表示

### お客さまの操作

- 予約ページをタッチ操作のみ可能

---

## 予約の流れ

1. 当日予約可能な座席枠がボタンで表示される
2. 予約したい座席枠をタップ
3. 内容に同意のうえ、**氏名を入力して予約**
   - ※氏名が未入力の場合、予約ボタンは押せません
4. 都合が悪くなった場合は、**予約済みボタンをもう一度押すことでキャンセル可能**
   - ※いたずら防止のため、予約者名の再入力が必要

---

## 使用ライブラリ

- **Next.js App Router**
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
- **shadcn/ui**
- **Vercel**

---

## 工夫した点

### 運用面の工夫

- いたずら防止のため、画面遷移には簡易パスワードを必要とした
- お客さまは予約ページ以外は操作できず、画面遷移・ログアウト不可
- ページ遷移ボタンは `Header` コンポーネントの背景色と同化させ、スタッフ以外には目立たない
  - 万が一タップされてもパスワードが必要

### UI/UXの改善

- パスワード入力後、`Enter`キー（`onKeyDown`）でログイン可能
- 管理者ページでは、データの編集・削除・昇順/降順ソートが可能
- 利用者数グラフ（Chartsライブラリ使用）を以下3種類表示：
  - 日付別
  - 曜日別
  - 座席別
  - ※カルーセル表示（shadcn/ui）
- エクセル出力（XLSXライブラリ）にも対応し、業務で使いやすい形式に

### 障害対策

- 映像サービス機器が故障した場合に備えて「メンテナンス中です」ページを用意
  - ※このページはログイン不要（`<Auth isLogin={false}>`）で誰でも閲覧可能

---

## 追加予定の機能

- キャッチコピーをタップすると、**映像詳細解説モーダルウィンドウ**を表示
- **現在時刻を過ぎた予約枠は自動的にグレーアウト**し予約不可に
- 席予約完了後に **QRコード画像を表示**
  - アクセスすると予約内容（時間・座席番号・同意事項）を確認可能
  - QRコードのリンク先は **1日後に消滅**

---
