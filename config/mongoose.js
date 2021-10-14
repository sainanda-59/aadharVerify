const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://sainanda:sainanda@cluster0.ky3bm.mongodb.net/test',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in connecting to MongoDB'));


db.once('open', function(){
    console.log('Connected to MongoDB');
});

module.exports = db;
