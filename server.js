import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleFileUpload } from './src/services/uploadHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Keep the original file name
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

// Handle file upload
app.post('/upload', upload.single('file'), handleFileUpload);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
