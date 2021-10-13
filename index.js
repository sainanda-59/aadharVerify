const express = require('express');
const port = process.env.PORT || 8000;
const path = require('path');
const mongoose = require('mongoose');
const crypto = require('crypto');
const db = require('./config/mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./assests'));

let gfs;

db.once('open', ()=>{
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: 'mongodb+srv://nirbhaya:nirbhaya@cluster0.9h2fo.mongodb.net/test',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

  app.get('/dashboard', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('adminDashboard', { files: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'  ||
            file.contentType === 'image/jpg'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('adminDashboard', { files: files });
      }
    });
  });

app.post('/upload',upload.single('file'),(req,res)=>{
res.redirect('/');
});

app.get('/files', (req,res)=>{
gfs.files.find().toArray((err,files)=>{
  if(!files || files.length===0){
    return res.status(404).json({
        err:'No files exist'
    });
  }
  return res.json(files);
})
})

app.get('/files/:filename', (req,res)=>{
    gfs.files.findOne({filename: req.params.filename}, (err,file)=>{
        if(!file || file.length===0){
            return res.status(404).json({
                err:'No file exists'
            });
          }
          return res.json(file);
    });

});

app.get('/image/:filename', (req,res)=>{
    gfs.files.findOne({filename: req.params.filename}, (err,file) => {
        if(!file || file.length===0){
            return res.status(404).json({
                err:'No file exists'
            });
          }
          if(file.contentType==='image/jpeg' || file.contentType==='image/jpg' || file.contentType==='image/png'){
              const readstream = gfs.createReadStream(file.filename);
              readstream.pipe(res);
          }
          else{
              res.status(404).json({
                  err:'Not an Image'
              });
          }
    });

});

app.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/dashboard');
  });
});

app.use('/', require('./routes/index'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
        console.log(`Server is running on port : ${port}`);
})
