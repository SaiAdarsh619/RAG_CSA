import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-dark.css';
import { Code2 } from 'lucide-react';

const CodeEditor = ({ code, setCode }) => {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
                padding: '0.6rem 1rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
            }}>
                <Code2 size={15} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Code Editor
                </span>
                <span style={{
                    fontSize: '0.68rem', color: '#71717a',
                    marginLeft: 'auto',
                }}>
                    Paste any language
                </span>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                <Editor
                    value={code}
                    onValueChange={code => setCode(code)}
                    highlight={code => highlight(code, languages.js)}
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 14,
                        backgroundColor: 'transparent',
                        minHeight: '100%'
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
