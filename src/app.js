const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const methodoverride = require('method-override');

const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({extended: false}));
app.use(express.json());
app.use(methodoverride('_method'))

app.use(logger('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('./routes/index'));

app.listen(port, () => {
    console.log('Server on port: ', port);
});