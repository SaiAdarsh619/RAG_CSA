import React, { useState } from 'react';
import axios from 'axios';
import { Send, User, Bot } from 'lucide-react';

const ChatPanel = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your security assistant. Ask me anything about your code.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // TODO: Pass context (current code) to chat API
            const response = await axios.post('/api/chat-security', {
                message: input,
                context: ''
            });

            const botMsg = { role: 'assistant', content: response.data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg = { role: 'assistant', content: "Sorry, I encountered an error." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        gap: '0.75rem',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start'
                    }}>
                        <div style={{
                            width: 32, height: 32,
                            borderRadius: '50%',
                            background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div style={{
                            background: msg.role === 'user' ? 'var(--accent-secondary)' : 'var(--bg-tertiary)',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            maxWidth: '80%',
                            fontSize: '0.9rem',
                            lineHeight: '1.4'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && <div style={{ marginLeft: '3rem', color: 'var(--text-secondary)' }}>Thinking...</div>}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about vulnerabilities..."
                    style={{
                        flex: 1,
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        color: 'var(--text-primary)'
                    }}
                />
                <button
                    onClick={handleSend}
                    style={{
                        background: 'var(--accent-primary)',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;
