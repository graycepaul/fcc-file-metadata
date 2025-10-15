// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

// Serve index
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Multer config: store to uploads/ with original filename (temp)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // use unique name to avoid collisions
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// POST endpoint expected by FCC: /api/fileanalyse
app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  // Debug log (comment out after confirming)
  console.log("FILE UPLOAD RECEIVED:", req.file);

  if (!req.file) {
    return res
      .status(400)
      .json({
        error: 'No file uploaded or wrong field name (must be "upfile")',
      });
  }

  // Respond with exact keys FCC expects
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
