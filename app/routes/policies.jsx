import { useEffect, useState } from 'react';

export const meta = () => [
    { title: '特定商取引法に基づく表記 | WACCA' },
    { name: 'description', content: 'Wacca — 特定商取引法に基づく表記。法人情報、決済手段、返品・交換ポリシー。' },
];

// 🌟【超重要】サーバーサイドのloader関数を完全に撤去（削除）しました。
// これにより、Vercelのサーバーレス関数（Edgeランタイム）が裏で余計なコードを実行して大爆発するのを物理的に100%防ぎます。

const TOKUSHOHO_ENTRIES = [
    { id: 'ENT_01', label: '法人名 / 屋号', labelEn: 'BUSINESS_NAME', value: 'Wacca / ワッカ' },
    { id: 'ENT_02', label: '運営責任者', labelEn: 'OPERATOR', value: 'MIN HANSA, SEITA MIURA' },
    { id: 'ENT_03', label: '所在地', labelEn: 'ADDRESS', value: '〒103-0004 東京都中央区東日本橋' },
    { id: 'ENT_04', label: '電話番号', labelEn: 'PHONE', value: '080-3070-4748', sub: '受付時間: 10:00〜18:00（土日祝除く）' },
    { id: 'ENT_05', label: 'メールアドレス', labelEn: 'EMAIL', value: 'hansayamaha912@gmail.com' },
    { id: 'ENT_06', label: '追加費用', labelEn: 'ADDITIONAL_FEES', value: '配送料: 一律 ¥1,000 / コンビニ決済手数料: ¥300' },
    { id: 'ENT_07', label: '引渡時期', labelEn: 'DELIVERY_TIMELINE', value: '注文確定後 8〜14営業日以内に発送' },
    { id: 'ENT_08', label: '決済手段', labelEn: 'PAYMENT_METHODS', value: 'クレジットカード（即時決済） / 現金振込' },
    { id: 'ENT_09', label: '返品・交換', labelEn: 'RETURN_POLICY', value: null },
];

const RETURN_POLICY_LINES = [
    '発送前: キャンセル可',
    '発送後: 未開封に限り 到着後7日以内に限り返品受付',
    '不良品: 弊社負担にて交換対応',
    '返送先: 上記所在地と同一',
];

export default function Policies() {
    // クライアントサイドでのみ安全に描画を完結させるためのハイドレーションガード
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0c' }} />;
    }

    return (
        <main className="min-h-screen bg-[#0a0a0c] text-white pt-32 pb-48 px-6 md:px-12 selection:bg-cyan-500 selection:text-white" style={{ backgroundColor: '#0a0a0c', color: '#fff', fontFamily: 'monospace' }}>
            <div className="max-w-3xl mx-auto">
                {/* ─── Header ─── */}
                <header className="mb-16 border-b border-white/10 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem', marginBottom: '4rem' }}>
                    <h1 className="font-display text-3xl md:text-4xl tracking-widest uppercase mb-3 text-cyan-400" style={{ letterSpacing: '0.2em', color: '#00f0ff', fontSize: '2rem' }}>
                        特定商取引法に基づく表記
                    </h1>
                    <p className="font-mono text-xs text-white/40 tracking-[0.15em] mb-4" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                        COMMERCIAL TRANSACTIONS ACT DISCLOSURE
                    </p>
                    <div className="font-mono text-[10px] text-white/40 tracking-widest flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00f0ff', marginRight: '8px' }} />
                        [ SYS.DOC.ID: TOKUSHOHO-JP-V3 ] — LAST_UPDATED: 2026.05.31
                    </div>
                </header>

                {/* ─── Terminal-style definition list ─── */}
                <div className="bg-[#030305] border border-cyan-400/20 rounded-md p-6 md:p-10 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] relative overflow-hidden" style={{ backgroundColor: '#030305', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '6px', padding: '2rem', position: 'relative' }}>
                    <div className="font-mono text-[10px] text-cyan-400/50 tracking-widest mb-8 border-b border-white/10 pb-4" style={{ color: 'rgba(0,240,255,0.5)', fontSize: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                        {'>'} SYS.LEGAL_FRAMEWORK.LOAD("tokushoho_jp")<br />
                        {'>'} STATUS: ACTIVE<br />
                        {'>'} RENDERING {TOKUSHOHO_ENTRIES.length} ENTRIES...
                    </div>

                    <dl style={{ margin: 0, padding: 0 }}>
                        {TOKUSHOHO_ENTRIES.map((entry, index) => (
                            <div key={entry.id} style={{ padding: '1.25rem 0', borderBottom: index < TOKUSHOHO_ENTRIES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                                <dt style={{ fontSize: '0.7rem', color: 'rgba(0,240,255,0.7)', marginBottom: '0.5rem', letterSpacing: '0.2em' }}>
                                    <span>[</span>
                                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{entry.id}</span>
                                    <span>]</span>
                                    <span> — </span>
                                    <span style={{ textTransform: 'uppercase' }}>{entry.labelEn}</span>
                                </dt>
                                <dt style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem', paddingLeft: '1rem' }}>
                                    {entry.label}:
                                </dt>

                                {entry.id === 'ENT_09' ? (
                                    <dd style={{ fontSize: '0.875rem', color: '#fff', paddingLeft: '1rem', margin: '0.5rem 0 0 0' }}>
                                        {RETURN_POLICY_LINES.map((line, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                                <span style={{ color: 'rgba(0,240,255,0.4)', userSelect: 'none' }}>{'>'}</span>
                                                <span style={{ color: '#d1d1d8' }}>{line}</span>
                                            </div>
                                        ))}
                                    </dd>
                                ) : (
                                    <dd style={{ fontSize: '0.875rem', color: '#fff', paddingLeft: '1rem', margin: 0, display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ color: 'rgba(0,240,255,0.4)', userSelect: 'none' }}>{'>'}</span>
                                        <span>{entry.value}</span>
                                    </dd>
                                )}

                                {entry.sub && (
                                    <dd style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', paddingLeft: '1rem', margin: '0.35rem 0 0 0' }}>
                                        // NOTE: {entry.sub}
                                    </dd>
                                )}
                            </div>
                        ))}
                    </dl>

                    <div style={{ fontMono: 'monospace', fontSize: '0.6rem', color: 'rgba(0,240,255,0.3)', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        {'>'} END_OF_DOCUMENT<br />
                        {'>'} © WACCA — ALL_RIGHTS_RESERVED
                    </div>
                </div>
            </div>
        </main>
    );
}