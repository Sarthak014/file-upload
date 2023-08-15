var express = require('express');
var cors = require('cors');
const multer  = require('multer');
require('dotenv').config()

var app = express();
const upload = multer({ dest: '/public/' }).single("upfile");

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Create a POST endpoint for '/api/fileanalyse' route
app.post("/api/fileanalyse", (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('File Upload Error: ', err);
    } else if (err) {
      console.error('Unknown File Upload Error: ', err);
    }
    console.log('File request is: ', req.file);
    const { originalname, mimetype, size } = req.file;
    res.json({ name: originalname, type: mimetype, size });

    next();
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
