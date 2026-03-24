import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import AnalysisPanel from './AnalysisPanel';
import ChatPanel from './ChatPanel';
import axios from 'axios';
import { Shield, Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [code, setCode] = useState('// Paste your code here...');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'chat'

    const handleScan = async () => {
        setIsLoading(true);
        setActiveTab('scan'); // Switch to results on scan
        try {
            const response = await axios.post('/api/scan-code', {
                code
            });
            setAnalysisResult(response.data);
        } catch (error) {
            console.error("Scan failed", error);
            // Mock error handling for now
            setAnalysisResult({ error: "Failed to connect to backend." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Shield color="var(--accent-primary)" size={28} />
                    <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>SecuriCode AI</h1>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleScan}
                    disabled={isLoading}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Play size={18} />}
                    {isLoading ? 'Scanning...' : 'Scan Code'}
                </button>
            </header>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Left: Editor */}
                <div style={{ flex: 1, borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <CodeEditor code={code} setCode={setCode} />
                </div>

                {/* Right: Analysis & Chat */}
                <div style={{ width: '40%', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
                        <button
                            onClick={() => setActiveTab('scan')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: activeTab === 'scan' ? 'var(--bg-tertiary)' : 'transparent',
                                color: activeTab === 'scan' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                borderBottom: activeTab === 'scan' ? '2px solid var(--accent-primary)' : 'none',
                                fontWeight: 500
                            }}
                        >
                            Vulnerabilities
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: activeTab === 'chat' ? 'var(--bg-tertiary)' : 'transparent',
                                color: activeTab === 'chat' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                borderBottom: activeTab === 'chat' ? '2px solid var(--accent-primary)' : 'none',
                                fontWeight: 500
                            }}
                        >
                            Security Chat
                        </button>
                    </div>

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        {activeTab === 'scan' ? (
                            <div style={{ height: '100%', overflowY: 'auto' }}>
                                <AnalysisPanel
                                    result={analysisResult}
                                    isLoading={isLoading}
                                    code={code}
                                    onCodeFixed={setCode}
                                />
                            </div>
                        ) : (
                            <ChatPanel />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
