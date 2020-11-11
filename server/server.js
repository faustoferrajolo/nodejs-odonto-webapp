// String de conexión a Mongo Atlass (MongoDB.com)
// mongodb+srv://mongo-user:mongo-pass@cluster0.weiod.mongodb.net/cafe

require('./config/config');
//require

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// parse application/json
app.use(bodyParser.json());


// Habilitar public folder
//console.log(path.resolve(__dirname, '../public'));
app.use(express.static(path.resolve(__dirname, '../public')));


app.use(require('./routes/index'));



// FUNCIONA Y NO DA ERROR DE DEPRECATED
const connectDB = async() => {
    await mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }), (err, res) => {
        if (err) throw err;
        console.log('Base de datos Online');
    }
};

connectDB().catch(error => console.error(error));


app.listen(process.env.PORT, () => {
    console.log('Listening on port ' + process.env.PORT);
    console.log('Environment : ' + process.env.URLDB);
})

//