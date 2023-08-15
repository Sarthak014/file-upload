const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

// Use Multer Disk Storage
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads")); // Specify the destination folder for uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append unique suffix to filenames
  },
});

// Use diskstorage option in multer
const upload = multer({ storage: multerStorage }).single("upfile");

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("File Upload Error: ", err);
      return res.status(400).json({ error: "File upload error" });
    } else if (err) {
      console.error("Unknown File Upload Error: ", err);
      return res.status(500).json({ error: "Unknown file upload error" });
    }

    const fileDetails = {
      name: req.file?.originalname,
      type: req.file?.mimetype,
      size: req.file?.size,
    };

    return res.json(fileDetails);
  });
});

// Error handler
app.use(function (err, req, res, next) {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({ error: "Server error" });
});

// Server Connection
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
