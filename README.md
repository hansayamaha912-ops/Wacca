# Wacca
4promotion to Wacca
Wacca Brand Experience
「文化は生命体。人・物・場所が重なる瞬間に生まれる『輪（Circle）』の創出」をコンセプトに掲げる、アジア圏のクリエイター向けハイエンドD2Cブランド「Wacca」の公式ヘッドレスECサイトです。
単なるオンラインストアではなく、ブラウザ上の3D空間とShopifyを高度に連携させ、ユーザーの現在地（"What's ur 20?"）をシステムと「同期（Sync）」させることで世界観に没入できる次世代のWeb体験を提供します。
🪐 Core Concepts & Features
1. The Immersive Entrance (3D Hero Section)
トップページでは、Three.jsを用いたフルスクリーンの3D空間が広がります。
Scroll-driven Fly-in: スクロールに連動してカメラが「赤いプロダクト」の超マクロ視点から引き、背景のモノトーンで建築的な都市（TOKYO, BANGKOK等）へとシームレスに飛行します。
Chic Monotone Architecture: ネオンを廃し、コンクリートやダークメタルを感じさせるシックなマットグレーの質感と、鋭い影を生むディレクショナルライトで構成された構造美を表現しています
。
Dynamic HUD: 右下の座標HUDインジケーターが、カメラの通過する都市に合わせてリアルタイム（60fps）でフェード切り替えされます
。
2. The Synchronized Awakening（覚醒演出・共有体験）
サイト下部の「Community Bar」からユーザーが現在いる都市名（例: Tokyo）を入力すると、サイト全体が「覚醒」し、Waccaのネットワークと同期（Sync）します。
UI Glitch & HUD Scan: 画面全体に一瞬のデジタル・ノイズが走り、HUDが「SYNCING WITH [CITY]... 100%」から「STABLE」へと着地します
。
GPU Shader Particles: 3D空間の中央ノードから、GPU（Vertex Shader）計算による高パフォーマンスな数千のパーティクル波紋がバーストします
。
Cyber-Material Shift: 3Dビル群のマテリアルが一瞬ワイヤーフレーム化した後、環境反射を持つサイバーな質感（Metalness: 0.9）へとシフトします
。
入力された地名はグローバルステート（SyncContext / LocalStorage）で管理され、カート追加時のShopify注文属性（Attributes）として製品の製造工程へと引き継がれます
。
3. Global Headless Commerce (Shopify Integration)
Shopify Hydrogen (Remix) と Storefront API を用いたフルヘッドレス構成です。
Auto-Localization: サーバーサイドでリクエストヘッダー（oxygen-buyer-ip 等）からユーザーのIPアドレスを判定し、Storefront APIの @inContext に渡すことで、言語と通貨（JPY, CNY, TWD, THB等）を自動で最適化します
。
Dynamic Cart: CartFormとuseOptimisticCartを活用した非同期かつ高速なカート状態管理を実現しています。

--------------------------------------------------------------------------------
🛠 Technical Stack
Framework: Shopify Hydrogen (Remix / React)
3D Rendering: Three.js (R3FのHydration競合を回避し、パフォーマンスを最大化するためImperative Three.jsをベースに構築
)
Backend / API: Shopify Storefront API (GraphQL)
Styling: Tailwind CSS
 (カスタムフォント font-display, font-sans, font-mono を駆使したエディトリアルマガジン風＆システムログ風UI
)
Build / Tooling: Vite, TypeScript, Oxygen

--------------------------------------------------------------------------------
📂 Architecture & Directory Structure
wacca-web-experience/
├── app/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── HeroScene.jsx        # 3D空間、カメラアニメーション、覚醒エフェクト
│   │   │   └── BackgroundCityCanvas.jsx # 下層ページ用の軽量な背景3D
│   │   ├── ui/
│   │   │   ├── GlobalNavigation.jsx # ガラスモーフィズムの固定ヘッダー＆ドロワー
│   │   │   ├── CommunityBar.jsx     # 「What's ur 20?」入力・同期バー
│   │   │   ├── GlitchOverlay.jsx    # 覚醒時の画面グリッチエフェクト
│   │   │   └── GlobalFooter.jsx     # サイバー感のあるサイトフッター
│   │   └── cart/
│   │       ├── CartAside.jsx        # スライドイン・カートUI
│   │       └── AddToCartButton.jsx  # カート投入（Attributes送信機能付き）
│   ├── lib/
│   │   ├── context.ts               # IPベースの国判定とStorefront @inContext設定
│   │   └── SyncContext.jsx          # isSynchronizedステートのグローバル管理
│   ├── routes/
│   │   ├── _index.jsx               # トップページ (HeroScene統合、スクロール連動テキスト)
│   │   ├── products._index.jsx      # [ARCHIVE / OBJECTS] 製品一覧ギャラリー
│   │   ├── products.$handle.jsx     # 商品詳細ページ (Storefront APIによる実データ取得)
│   │   ├── about.jsx                # [JOURNAL / CLIPPINGS] コンセプトページ
│   │   ├── account/                 # [ORDER STATUS] ログイン・登録・注文進捗 (Dark UI)
│   │   ├── policies.jsx             # [LEGAL] 特定商取引法等のシステムログ風ページ
│   │   └── $.jsx                    # [SIGNAL LOST] カスタム404エラーページ
│   └── styles/
│       └── app.css                  # Tailwind CSSエントリーポイント
├── .env                             # Shopifyドメイン、APIトークンなどの環境変数
├── tailwind.config.js               # wacca-darker等のカスタムテーマ・フォント設定
└── package.json                     # 依存関係

--------------------------------------------------------------------------------
🚀 Getting Started
1. Requirements
Node.js (v18.0.0 以上)
Shopify Partner アカウントおよび開発ストア（Storefront APIのトークン発行用）
2. Environment Setup
プロジェクトルートに .env ファイルを作成し、Shopifyの認証情報を設定してください。
PUBLIC_STORE_DOMAIN="your-shop-name.myshopify.com"
PUBLIC_STOREFRONT_API_TOKEN="your-storefront-api-token"
SESSION_SECRET="your-session-secret"
3. Installation & Run
依存関係をインストールし、ローカル開発サーバー（Oxygen）を立ち上げます。
# パッケージのインストール
npm install

# 開発サーバーの起動 (ポート 3456)
npm run dev
ブラウザで http://localhost:3456/ にアクセスして動作を確認してください。
4. Build for Production
npm run build
npm run preview

--------------------------------------------------------------------------------
💡 Future Roadmap (Next Steps)
Asset Replacement: 仮の3Dジオメトリから、ブランド固有の .glb プロダクトモデルへの差し替え。
Shopify Flow Automation: 注文情報に付与された「What's ur 20?」の都市名を製造工程やパッケージングにフィードバックするワークフローの構築。
Analytics & SEO: GA4の連携と、主要ページごとの動的なメタデータ設定によるグローバルなオンライン可視性の向上。
