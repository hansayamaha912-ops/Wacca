import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';

export const meta = () => [
    { title: '特定商取引法に基づく表記 | WACCA' },
    { name: 'description', content: 'Wacca — 特定商取引法に基づく表記。法人情報、決済手段、返品・交換ポリシー。' },
];

// サーバーサイドの通信を100%遮断し、絶対にエラーを起こさない空のデータを返す
export async function loader() {
    return json({});
}

const TOKUSHOHO_ENTRIES = [
    {
        id: 'ENT_01',
        label: '法人名 / 屋号',
        labelEn: 'BUSINESS_NAME',
        value: 'Wacca / ワッカ',
    },
    {
        id: 'ENT_02',
        label: '運営責任者',
        labelEn: 'OPERATOR',
        value: 'MIN HANSA, SEITA MIURA',
    },
    {
        id: 'ENT_03',
        label: '所在地',
        labelEn: 'ADDRESS',
        value: '〒103-0004 東京都中央区東日本橋',
    },
    {
        id: 'ENT_04',
        label: '電話番号',
        labelEn: 'PHONE',
        value: '080-3070-4748',
        sub: '受付時間: 10:00〜18:00（土日祝除く）',
    },
    {
        id: 'ENT_05',
        label: 'メールアドレス',
        labelEn: 'EMAIL',
        value: 'hansayamaha912@gmail.com',
    },
    {
        id: 'ENT_06',
        label: '追加費用',
        labelEn: 'ADDITIONAL_FEES',
        value: '配送料: 一律 ¥1,000 / コンビニ決済手数料: ¥300',
    },
    {
        id: 'ENT_07',
        label: '引渡時期',
        labelEn: 'DELIVERY_TIMELINE',
        value: '注文確定後 8〜14営業日以内に発送',
    },
    {
        id: 'ENT_08',
        label: '決済手段',
        labelEn: 'PAYMENT_METHODS',
        value: 'クレジットカード（即時決済） / 現金振込',
    },
    {
        id: 'ENT_09',
        label: '返品・交換',
        labelEn: 'RETURN_POLICY',
        value: null,
    },
];

const RETURN_POLICY_LINES = [
    '発送前: キャンセル可',
    '発送後: 未開封に限り 到着後7日以内に限り返品受付',
    '不良品: 弊社負担にて交換対応',
    '返送先: 上記所在地と同一',
];

export default function Policies() {
    // 外部からのコンテキスト依存を遮断
    return (
        <main className="min-h-screen bg-[#0a0a0c] text-white pt-32 pb-48 px-6 md:px-12 selection:bg-cyan-500 selection:text-white">
            <div className="max-w-3xl mx-auto">
                {/* ─── Header ─── */}
                <header className="mb-16 border-b border-white/10 pb-8">
                    <h1 className="font-display text-3xl md:text-4xl tracking-widest uppercase mb-3 text-cyan-400" style={{ letterSpacing: '0.2em' }}>
                        特定商取引法に基づく表記
                    </h1>
                    <p className="font-mono text-xs text-white/40 tracking-[0.15em] mb-4">
                        COMMERCIAL TRANSACTIONS ACT DISCLOSURE
                    </p>
                    <div className="font-mono text-[10px] text-white/40 tracking-widest flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        [ SYS.DOC.ID: TOKUSHOHO-JP-V3 ] — LAST_UPDATED: 2026.04.19
                    </div>
                </header>

                {/* ─── Terminal-style definition list ─── */}
                <div className="bg-[#030305] border border-cyan-400/20 rounded-md p-6 md:p-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] relative overflow-hidden">
                    {Scanline overlay}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                    {/* System header */}
                    <div className="font-mono text-[10px] text-cyan-400/50 tracking-widest mb-8 border-b border-white/10 pb-4">
                        {'>'} SYS.LEGAL_FRAMEWORK.LOAD("tokushoho_jp")<br />
                        {'>'} STATUS: ACTIVE<br />
                        {'>'} RENDERING {TOKUSHOHO_ENTRIES.length} ENTRIES...
                    </div>

                    <dl className="space-y-0">
                        {TOKUSHOHO_ENTRIES.map((entry, index) => (
                            <div
                                key={entry.id}
                                className={`group py-5 ${
                                    index < TOKUSHOHO_ENTRIES.length - 1
                                        ? 'border-b border-white/5'
                                        : ''
                                }`}
                            >
                                {/* Key / Label */}
                                <dt className="font-mono text-[11px] tracking-[0.2em] text-cyan-400/70 mb-2 flex items-center gap-2">
                                    <span className="text-cyan-400/30">[</span>
                                    <span className="text-white/40">{entry.id}</span>
                                    <span className="text-cyan-400/30">]</span>
                                    <span className="text-cyan-400/50">—</span>
                                    <span className="uppercase">{entry.labelEn}</span>
                                </dt>
                                <dt className="font-mono text-xs text-white/60 mb-1 pl-4">
                                    {entry.label}:
                                </dt>

                                {/* Value */}
                                {entry.id === 'ENT_09' ? (
                                    /* Return policy — multi-line */
                                    <dd className="font-mono text-sm text-white pl-4 mt-2 space-y-1.5">
                                        {RETURN_POLICY_LINES.map((line, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <span className="text-cyan-400/40 select-none shrink-0">{'>'}</span>
                                                <span className="text-[#d1d1d8]">{line}</span>
                                            </div>
                                        ))}
                                    </dd>
                                ) : (
                                    <dd className="font-mono text-sm text-white pl-4 flex items-start gap-2">
                                        <span className="text-cyan-400/40 select-none shrink-0">{'>'}</span>
                                        <span>{entry.value}</span>
                                    </dd>
                                )}

                                {/* Optional sub-note */}
                                {entry.sub && (
                                    <dd className="font-mono text-[10px] text-white/40 pl-4 mt-1.5">
                                        // NOTE: {entry.sub}
                                    </dd>
                                )}
                            </div>
                        ))}
                    </dl>

                    {/* System footer */}
                    <div className="font-mono text-[10px] text-cyan-400/30 tracking-widest mt-8 border-t border-white/10 pt-4">
                        {'>'} END_OF_DOCUMENT<br />
                        {'>'} © WACCA — ALL_RIGHTS_RESERVED
                    </div>
                </div>

                {/* ─── Related Links ─── */}
                <div className="mt-12 flex flex-wrap gap-6 justify-center">
                    <Link
                        to="/terms-of-service"
                        className="font-mono text-xs text-white/40 hover:text-cyan-400 tracking-widest transition-colors duration-300"
                    >
                        [ TERMS_OF_SERVICE ]
                    </Link>
                    <Link
                        to="/privacy-policy"
                        className="font-mono text-xs text-white/40 hover:text-cyan-400 tracking-widest transition-colors duration-300"
                    >
                        [ PRIVACY_POLICY ]
                    </Link>
                    <Link
                        to="/"
                        className="font-mono text-xs text-white/40 hover:text-white tracking-widest transition-colors duration-300"
                    >
                        [ RETURN_TO_CORE ]
                    </Link>
                </div>
            </div>
        </main>
    );
}