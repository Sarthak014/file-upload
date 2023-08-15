const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require('path');
const { saveFileDetails } = require("./controller/fileUpload");
require("dotenv").config();

const app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));


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

// Create a POST endpoint for '/api/fileanalyse' route
app.post("/api/fileanalyse", (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("File Upload Error: ", err);
      return res.status(400).json({ error: "File upload error" });
    } else if (err) {
      console.error("Unknown File Upload Error: ", err);
      return res.status(500).json({ error: "Unknown file upload error" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    saveFileDetails(req.file, function (err, data) {
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }

      return res.json(data);
    });
  });
});

// Error handler
app.use(function (err, req, res, next) {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({ error: "Server error" });
});

// Mongoose Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error");
  });

// Server Connection
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
