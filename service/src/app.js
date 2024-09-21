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
const {authMiddleware} = require("./middlewares/auth.js");

const app = express();


app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
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

app.use(authMiddleware);

//routes
app.use('/api/v1', v1);

// error handler
app.use(errorHandler);


module.exports = app;
