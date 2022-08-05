const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// const tradingViewRouter = require('./routes/tradingViewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) MIDDLEWARES

app.use(bodyParser.urlencoded({ extended: false }));


// 3) ROUTES

// app.use('/api/v1/tradingView', tradingViewRouter);
app.use('/', viewRouter);

module.exports = app;

