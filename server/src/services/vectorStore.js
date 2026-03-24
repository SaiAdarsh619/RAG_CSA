const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { OpenAIEmbeddings } = require("@langchain/openai");
require('dotenv').config();

// Initialize Embeddings
const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
});

// Initialize Vector Store
const vectorStore = new Chroma(embeddings, {
    url: process.env.CHROMA_URL || "http://localhost:8000",
    collectionName: "security-knowledge-base",
});

module.exports = { vectorStore, embeddings };
