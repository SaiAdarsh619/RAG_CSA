const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { RunnableSequence } = require("@langchain/core/runnables");
const path = require('path');

// Load .env from server directory
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Using Google Gemini (Free tier available!)
const model = new ChatGoogleGenerativeAI({
   apiKey: process.env.GOOGLE_API_KEY,
   model: "gemini-2.5-flash",
   temperature: 0.1,
});

console.log('Using Google Gemini (Free) for LLM');

// Security knowledge context (embedded directly - no vector DB needed!)
const securityContext = `
OWASP Top 10 Security Vulnerabilities:

1. SQL Injection: Occurs when user input is directly concatenated into SQL queries.
   - Look for: string concatenation in queries, lack of parameterized queries
   - Fix: Use prepared statements, parameterized queries, ORMs

2. Cross-Site Scripting (XSS): User input rendered as HTML without sanitization.
   - Look for: innerHTML, document.write, dangerouslySetInnerHTML
   - Fix: Escape output, use textContent, sanitize HTML

3. Broken Authentication: Weak password storage, session management issues.
   - Look for: plain text passwords, weak hashing (MD5, SHA1), hardcoded credentials
   - Fix: Use bcrypt/argon2, secure session tokens

4. Sensitive Data Exposure: Unencrypted data, API keys in code.
   - Look for: hardcoded secrets, HTTP instead of HTTPS, console.log of sensitive data
   - Fix: Use environment variables, encrypt data at rest

5. Command Injection: User input passed to system commands.
   - Look for: exec(), system(), child_process.exec with user input
   - Fix: Avoid shell commands, use libraries, validate input strictly

6. Insecure Deserialization: Trusting serialized objects from untrusted sources.
   - Look for: JSON.parse on untrusted input, pickle.loads, eval()
   - Fix: Validate and sanitize before deserializing

7. Path Traversal: User input used to access file paths.
   - Look for: fs.readFile with user input, "../" in paths
   - Fix: Validate paths, use path.basename, whitelist allowed paths

8. Insecure Direct Object References: Accessing resources by ID without authorization.
   - Look for: accessing records by user-supplied ID without permission checks
   - Fix: Always verify authorization for each resource access

9. Security Misconfiguration: Debug mode enabled, default credentials.
   - Look for: DEBUG=true in production, CORS *, verbose error messages
   - Fix: Review configurations, disable debug in production

10. Using Components with Known Vulnerabilities: Outdated dependencies.
    - Look for: old package versions, deprecated libraries
    - Fix: Keep dependencies updated, run npm audit
`;

const template = `You are an expert Cyber Security Code Reviewer.
Analyze the following code for security vulnerabilities.

Security Knowledge Base:
{context}

Code to Analyze:
{code}

Provide your response as a valid JSON object with this exact structure:
{{
  "vulnerabilities": [
    {{
      "type": "Vulnerability Name",
      "severity": "High" or "Medium" or "Low",
      "line": <line_number_or_0_if_unknown>,
      "description": "Brief explanation of the vulnerability",
      "fixSummary": "One concise action sentence (max 15 words) describing the fix",
      "fix": "Detailed explanation and/or corrected code snippet showing the fix"
    }}
  ],
  "summary": "Overall security assessment of the code"
}}

If no vulnerabilities are found, return:
{{
  "vulnerabilities": [],
  "summary": "No significant security vulnerabilities detected."
}}

IMPORTANT: Return ONLY valid JSON, no markdown code blocks or extra text.
`;

const autoFixTemplate = `You are an expert security engineer. Fix ALL security vulnerabilities in the code below.

Vulnerabilities to fix:
{vulnerabilities}

Original code:
{code}

Return ONLY the complete fixed code with no explanation, no markdown fences, no extra text. Just the raw fixed code.
`;

const prompt = PromptTemplate.fromTemplate(template);
const autoFixPrompt = PromptTemplate.fromTemplate(autoFixTemplate);

const scanChain = RunnableSequence.from([
   {
      context: () => securityContext,
      code: (input) => input.code
   },
   prompt,
   model,
   new StringOutputParser()
]);

const autoFixChain = RunnableSequence.from([
   {
      vulnerabilities: (input) => input.vulnerabilities,
      code: (input) => input.code
   },
   autoFixPrompt,
   model,
   new StringOutputParser()
]);

module.exports = { scanChain, autoFixChain };
