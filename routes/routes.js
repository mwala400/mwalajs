import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises'; // Promise-based file system module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const templatePath = path.join(__dirname, '../views/index.mjs');

    // Soma template kama string
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    // Fanya replacement ya variables kama {{title}}
    templateContent = templateContent.replace(/\{\{title\}\}/g, "Mwala Framework");

    // Tuma response
    res.send(templateContent);
  } catch (error) {
    console.error("Error loading template:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
