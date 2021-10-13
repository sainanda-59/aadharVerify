const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nirbhaya:nirbhaya@cluster0.9h2fo.mongodb.net/test',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in connecting to MongoDB'));


db.once('open', function(){
    console.log('Connected to MongoDB');
});

module.exports = db;
