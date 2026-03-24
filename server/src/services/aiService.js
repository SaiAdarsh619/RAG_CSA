const { scanChain, autoFixChain } = require('./ragChain');

exports.analyzeCode = async (code, language) => {
    try {
        // Run the RAG chain
        const result = await scanChain.invoke({ code });

        // Parse the JSON output from LLM
        // Note: In production, we should use structured output parsing or more robust validation
        let parsedResult;
        try {
            // Try to find JSON block if wrapped in markdown
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : result;
            parsedResult = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse LLM output:", result);
            throw new Error("AI Analysis failed to produce valid JSON");
        }

        return parsedResult;
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw error;
    }
};

exports.autoFixCode = async (code, vulnerabilities) => {
    try {
        const vulnSummary = vulnerabilities
            .map((v, i) => `${i + 1}. [${v.severity}] ${v.type} (Line ${v.line}): ${v.fixSummary || v.fix}`)
            .join('\n');

        const fixedCode = await autoFixChain.invoke({
            code,
            vulnerabilities: vulnSummary
        });

        return fixedCode;
    } catch (error) {
        console.error("Auto-Fix Error:", error);
        throw error;
    }
};

exports.chatWithContext = async (message, context) => {
    // Placeholder for chat logic
    return { reply: "Chat functionality coming soon." };
};
