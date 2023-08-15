var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer');
const upload = multer({ dest: "public/files" });

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// creating the post request
app.post('/api/fileanalyse', upload.single('upfile'),(req, res) => {
  try {
    console.log(req.file);
    
    const file_name = req.file.originalname;
    const file_type = req.file.mimetype;
    const file_size = req.file.size;
    
    res.json({
      name: file_name,
      type: file_type,
      size: file_size
    });
  } catch (error) {
    res.json({message: "file upload failed"});
    console.log(error);
  } 
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
