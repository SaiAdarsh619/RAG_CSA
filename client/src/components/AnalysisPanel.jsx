import React, { useState } from 'react';
import { CheckCircle, Info, ChevronDown, ChevronUp, MapPin, Wrench, ShieldAlert, ShieldCheck, ShieldX, BookOpen, Zap, Loader2, CheckCheck } from 'lucide-react';
import axios from 'axios';

const severityConfig = {
    High: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: '#ef4444', icon: ShieldX, label: 'HIGH' },
    Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: '#f59e0b', icon: ShieldAlert, label: 'MEDIUM' },
    Low: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: '#3b82f6', icon: ShieldCheck, label: 'LOW' },
};

const VulnCard = ({ vuln, index }) => {
    const [expanded, setExpanded] = useState(true);
    const [showDetail, setShowDetail] = useState(false);
    const cfg = severityConfig[vuln.severity] || severityConfig.Low;
    const SeverityIcon = cfg.icon;

    // Derive a concise summary — use fixSummary if available, else first sentence of fix
    const conciseFix = vuln.fixSummary || (vuln.fix ? vuln.fix.split(/[.!\n]/)[0].trim() + '.' : '');
    const hasDetail = vuln.fix && vuln.fix !== conciseFix;

    return (
        <div style={{
            background: '#1c1c1f',
            borderRadius: '0.75rem',
            border: `1px solid ${cfg.border}33`,
            overflow: 'hidden',
        }}>
            {/* Card Header */}
            <button
                onClick={() => setExpanded(e => !e)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    background: cfg.bg,
                    borderBottom: expanded ? `1px solid ${cfg.border}33` : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                }}
            >
                <span style={{
                    minWidth: '1.5rem', height: '1.5rem',
                    borderRadius: '50%',
                    background: cfg.color,
                    color: '#fff',
                    fontSize: '0.68rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                }}>{index + 1}</span>

                <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem', color: '#f4f4f5' }}>
                    {vuln.type}
                </span>

                <span style={{
                    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em',
                    padding: '0.18rem 0.5rem', borderRadius: '999px',
                    background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}66`,
                    display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0,
                }}>
                    <SeverityIcon size={10} />{cfg.label}
                </span>

                {vuln.line > 0 && (
                    <span style={{
                        fontSize: '0.7rem', padding: '0.18rem 0.45rem', borderRadius: '0.3rem',
                        background: 'rgba(255,255,255,0.07)', color: '#a1a1aa',
                        display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0,
                    }}>
                        <MapPin size={9} />L{vuln.line}
                    </span>
                )}

                <span style={{ color: '#a1a1aa', flexShrink: 0 }}>
                    {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </span>
            </button>

            {/* Card Body */}
            {expanded && (
                <div style={{ padding: '0.9rem 1rem' }}>
                    {/* Description */}
                    <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.845rem', color: '#a1a1aa', lineHeight: 1.6 }}>
                        {vuln.description}
                    </p>

                    {/* Fix section */}
                    <div style={{
                        background: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                    }}>
                        {/* Fix header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 0.8rem',
                            background: 'rgba(34,197,94,0.08)',
                            borderBottom: '1px solid #30363d',
                        }}>
                            <Wrench size={12} color="#22c55e" />
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#22c55e', letterSpacing: '0.06em', flex: 1 }}>
                                SUGGESTED FIX
                            </span>
                            {/* Detail toggle button */}
                            {hasDetail && (
                                <button
                                    onClick={() => setShowDetail(d => !d)}
                                    title={showDetail ? 'Show concise' : 'Show full detail'}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                                        fontSize: '0.65rem', fontWeight: 600,
                                        color: showDetail ? '#8b5cf6' : '#71717a',
                                        background: showDetail ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${showDetail ? '#8b5cf644' : '#3f3f46'}`,
                                        borderRadius: '0.3rem',
                                        padding: '0.15rem 0.45rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <BookOpen size={10} />
                                    {showDetail ? 'Concise' : 'Details'}
                                </button>
                            )}
                        </div>

                        {/* Fix content */}
                        <pre style={{
                            margin: 0,
                            padding: '0.75rem 1rem',
                            fontSize: '0.8rem',
                            fontFamily: showDetail
                                ? "'JetBrains Mono', 'Fira Code', Consolas, monospace"
                                : 'inherit',
                            color: showDetail ? '#e6edf3' : '#d1d5db',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            lineHeight: 1.65,
                        }}>
                            {showDetail ? vuln.fix : conciseFix}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

const AnalysisPanel = ({ result, isLoading, code, onCodeFixed }) => {
    const [isFixing, setIsFixing] = useState(false);
    const [fixApplied, setFixApplied] = useState(false);

    const handleAutoFix = async () => {
        if (!result?.vulnerabilities?.length) return;
        setIsFixing(true);
        setFixApplied(false);
        try {
            const response = await axios.post('/api/auto-fix', {
                code,
                vulnerabilities: result.vulnerabilities,
            });
            if (response.data.fixedCode) {
                onCodeFixed(response.data.fixedCode);
                setFixApplied(true);
                setTimeout(() => setFixApplied(false), 3000);
            }
        } catch (err) {
            console.error('Auto-fix failed', err);
        } finally {
            setIsFixing(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#a1a1aa' }}>
                <div style={{
                    width: '2.5rem', height: '2.5rem',
                    border: '3px solid #3f3f46', borderTopColor: '#8b5cf6',
                    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 1rem',
                }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Analyzing code security...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!result) {
        return (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#a1a1aa' }}>
                <Info size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Run a scan to see security insights here.</p>
            </div>
        );
    }

    if (result.error) {
        return (
            <div style={{ padding: '1.5rem' }}>
                <div style={{
                    padding: '1rem', background: 'rgba(239,68,68,0.1)',
                    border: '1px solid #ef444466', borderRadius: '0.5rem',
                    color: '#ef4444', fontSize: '0.875rem',
                }}>
                    <strong>Error:</strong> {result.error}
                </div>
            </div>
        );
    }

    const vulns = result.vulnerabilities || [];
    const highCount = vulns.filter(v => v.severity === 'High').length;
    const mediumCount = vulns.filter(v => v.severity === 'Medium').length;
    const lowCount = vulns.filter(v => v.severity === 'Low').length;

    return (
        <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

            {/* Summary bar */}
            <div style={{
                background: '#1c1c1f', border: '1px solid #3f3f46',
                borderRadius: '0.75rem', padding: '0.85rem 1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: vulns.length ? '0.6rem' : 0 }}>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#71717a', fontWeight: 600, letterSpacing: '0.06em' }}>
                        SCAN SUMMARY
                    </p>
                    {/* Auto-Fix All button */}
                    {vulns.length > 0 && (
                        <button
                            onClick={handleAutoFix}
                            disabled={isFixing}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.35rem',
                                fontSize: '0.72rem', fontWeight: 600,
                                padding: '0.3rem 0.75rem', borderRadius: '0.4rem',
                                background: fixApplied
                                    ? 'rgba(34,197,94,0.15)'
                                    : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                color: fixApplied ? '#22c55e' : '#fff',
                                border: fixApplied ? '1px solid #22c55e44' : 'none',
                                cursor: isFixing ? 'not-allowed' : 'pointer',
                                opacity: isFixing ? 0.7 : 1,
                                transition: 'all 0.2s',
                            }}
                        >
                            {isFixing
                                ? <><Loader2 size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> Fixing...</>
                                : fixApplied
                                    ? <><CheckCheck size={12} /> Applied!</>
                                    : <><Zap size={12} /> Auto-Fix All</>
                            }
                        </button>
                    )}
                </div>

                {vulns.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.875rem' }}>
                        <CheckCircle size={15} /> No vulnerabilities detected
                    </div>
                ) : (
                    <>
                        <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.845rem', color: '#a1a1aa', lineHeight: 1.5 }}>
                            {result.summary}
                        </p>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {highCount > 0 && (
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.18rem 0.55rem', borderRadius: '999px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid #ef444444' }}>
                                    {highCount} High
                                </span>
                            )}
                            {mediumCount > 0 && (
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.18rem 0.55rem', borderRadius: '999px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid #f59e0b44' }}>
                                    {mediumCount} Medium
                                </span>
                            )}
                            {lowCount > 0 && (
                                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.18rem 0.55rem', borderRadius: '999px', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid #3b82f644' }}>
                                    {lowCount} Low
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Hint about Details toggle */}
            {vulns.length > 0 && (
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#52525b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <BookOpen size={11} /> Click <strong style={{ color: '#71717a' }}>Details</strong> on any fix to see the full explanation &amp; code.
                </p>
            )}

            {/* Vulnerability cards */}
            {vulns.length === 0 ? (
                <div style={{
                    padding: '1.5rem', background: 'rgba(34,197,94,0.07)',
                    border: '1px solid #22c55e44', borderRadius: '0.75rem',
                    color: '#22c55e', display: 'flex', alignItems: 'center',
                    gap: '0.75rem', fontSize: '0.875rem',
                }}>
                    <CheckCircle size={20} />
                    <span>Your code looks clean! No obvious vulnerabilities found.</span>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {vulns.map((vuln, idx) => (
                        <VulnCard key={idx} vuln={vuln} index={idx} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnalysisPanel;
