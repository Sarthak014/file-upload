var express = require("express");
var cors = require("cors");
var multer = require("multer");
require("dotenv").config();

var app = express();

var multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // destination is used to specify the path of the directory in which the files have to be stored
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // It is the filename that is given to the saved file.
    cb(null, file.originalname);
  },
});

// Use diskstorage option in multer
const upload = multer({ storage: multerStorage }).single("upfile");

// import Mongoose
let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const { saveFileDetails } = require("./controller/fileUpload");
// Create a POST endpoint for '/api/fileanalyse' route
app.post("/api/fileanalyse", (req, res, next) => {
  console.log("File request is: ", req.file);

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("File Upload Error: ", err);
    } else if (err) {
      console.error("Unknown File Upload Error: ", err);
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
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
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
