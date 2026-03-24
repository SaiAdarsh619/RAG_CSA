const aiService = require('../services/aiService');

exports.scanCode = async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Source code is required' });
        }

        // Call AI Service
        const analysisResult = await aiService.analyzeCode(code, language);

        res.json(analysisResult);
    } catch (error) {
        console.error("Scan Error:", error);
        res.status(500).json({ error: 'Failed to analyze code' });
    }
};

exports.autoFix = async (req, res) => {
    try {
        const { code, vulnerabilities } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Source code is required' });
        }

        const fixedCode = await aiService.autoFixCode(code, vulnerabilities);
        res.json({ fixedCode });
    } catch (error) {
        console.error("Auto-Fix Error:", error);
        res.status(500).json({ error: 'Failed to auto-fix code' });
    }
};

exports.uploadProject = async (req, res) => {
    try {
        // TODO: Handle project zip processing
        // For now, just acknowledged
        res.json({ message: 'Project uploaded. Feature coming soon.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
