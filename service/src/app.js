const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require("xss-clean");
const compression = require('compression');
const {errorHandler} = require('./middlewares/error');
const logger = require('./middlewares/logger');
const cors = require('cors');
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");


const v1 = require('./routes/v1/routes');

const app = express();


app.use(
    cors({
        origin: "http://localhost:3000",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true
    })
);

app.use(
    cookieSession({
        name: "session",
        keys: [process.env.COOKIE_KEY],
        maxAge: 24 * 60 * 60 * 100
    })
);

// parse cookies
app.use(cookieParser());

// service
app.use(express.json());

// logger
app.use(logger);


// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// compress all responses
app.use(compression());

// error handler
app.use(errorHandler);

//routes
app.use('/api/v1', v1);



module.exports = app;
