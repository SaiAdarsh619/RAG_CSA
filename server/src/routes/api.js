const express = require('express');
const router = express.Router();
const multer = require('multer');
const scanController = require('../controllers/scanController');
const aiController = require('../controllers/aiController');

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
router.post('/scan-code', scanController.scanCode);
router.post('/auto-fix', scanController.autoFix);
router.post('/upload-project', upload.single('projectZip'), scanController.uploadProject);
router.post('/chat-security', aiController.chatSecurity);

module.exports = router;
