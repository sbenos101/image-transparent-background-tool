const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

const upload = multer({ storage: multer.memoryStorage() });

const TEMP_DIR = path.join(__dirname, "temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

app.post("/compress-upload", upload.array("images", 50), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) return res.status(400).send("No files uploaded");

    const resultFiles = [];

    for (const file of files) {
      try {
        const processedBuffer = await sharp(file.buffer)
          .removeAlpha()
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });

        const { data, info } = processedBuffer;
        const { width, height, channels } = info;

        for (let i = 0; i < data.length; i += channels) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          if (r > 250 && g > 250 && b > 250) {
            data[i + 3] = 0;
          }
        }

        const finalBuffer = await sharp(data, {
          raw: {
            width: width,
            height: height,
            channels: channels
          }
        })
          .png({ compressionLevel: 0 })
          .toBuffer();

        const filename = file.originalname.replace(/\.[^/.]+$/, ".png");
        const filepath = path.join(TEMP_DIR, filename);

        fs.writeFileSync(filepath, finalBuffer);
        resultFiles.push({ filename, path: filepath });
      } catch (err) {
        console.error(`Error processing ${file.originalname}:`, err);
      }
    }

    const baseUrl = `http://localhost:${PORT}`;
    const images = resultFiles.map(f => `${baseUrl}/temp/${path.basename(f.path)}`);

    res.json({ images });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Batch processing failed");
  }
});

app.use("/temp", express.static(TEMP_DIR));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
