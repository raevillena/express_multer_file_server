

import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';


const app = express();
const PORT = process.env.PORT || 4000;
const uploadDir = process.env.UPLOAD_PATH || 'uploads';

// Ensure upload folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

// File size limit in bytes (e.g., 5MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE, // Limit file size
  },
});

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const filePath = `${req.file.filename}`;
  res.json({ success: true, filePath });
});

// Start server
app.listen(PORT, () => {
  console.log(`File upload server running on port ${PORT}`);
});