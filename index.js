// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

// Serve the front-end form
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Ensure uploads directory exists (multer will write files here)
const UPLOAD_DIR = "uploads";

// Multer storage config (stores to uploads/ and keeps originalname in req.file.originalname)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Use a unique filename so uploads don’t collide
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// POST endpoint expected by FCC. Field name MUST be 'upfile'
app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  // Debug: log req.file to console so we can see what multer produced
  console.log("FILE UPLOAD RECEIVED:", req.file);

  if (!req.file) {
    return res
      .status(400)
      .json({
        error: 'No file uploaded or wrong field name (must be "upfile")',
      });
  }

  // Return exactly the keys expected by FCC
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
