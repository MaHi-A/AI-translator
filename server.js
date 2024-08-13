import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { handleFileUpload } from "./src/uploadHandler.js";
import { PORT } from "./constants.js";
import { translateToTargetLanguage } from "./src/services/openAI.js";
import { OPENAI_API_KEY_GPT_4, OPENAI_MODEL } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = PORT;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now();
    const uniqueFilename = `${originalName}-${uniqueSuffix}${extension}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "public")));

// Handle file upload
app.post("/upload", upload.single("translation_file"), handleFileUpload);

app.get("/getTranslations", async (req, res) => {
  try {
    const jsonContent = {
      certificateTitle: "Certificate",
      ofCompletion: "of Completion",
      completedCourse: "has successfully completed the live course",
      durationLabel: "Duration",
      on: "on",
    };
    const targetLanguage = "ar-LY";
    const translations = await translateToTargetLanguage(
      jsonContent,
      targetLanguage
    );
    res.json(translations);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred during the translation process.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
