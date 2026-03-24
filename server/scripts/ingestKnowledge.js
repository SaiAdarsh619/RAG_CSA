const { vectorStore } = require('../src/services/vectorStore');
const fs = require('fs');
const path = require('path');
const { Document } = require("@langchain/core/documents");

const dataPath = path.join(__dirname, '../data/owasp_top_10.json');

const ingestData = async () => {
    try {
        if (!fs.existsSync(dataPath)) {
            console.error("Data file not found at:", dataPath);
            return;
        }

        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const vulnerabilities = JSON.parse(rawData);

        const docs = vulnerabilities.map(vuln => {
            return new Document({
                pageContent: `Vulnerability: ${vuln.title}
Description: ${vuln.description}
Prevention: ${vuln.prevention}`,
                metadata: { source: "OWASP Top 10", id: vuln.id }
            });
        });

        console.log(`Adding ${docs.length} documents to vector store...`);
        await vectorStore.addDocuments(docs);
        console.log("Ingestion complete!");

    } catch (error) {
        console.error("Ingestion failed:", error);
    }
};

if (require.main === module) {
    ingestData();
}
