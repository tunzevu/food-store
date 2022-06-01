const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet =require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
     
const userRoute = require('./route/userRoute');
const foodRoute = require('./route/foodRoute');
// const bookingRoute = require('./route/bookingRoute');
// const reviewRoute = require('./route/reviewRoute');

const app = express();
// connect to DB
dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const DB_options = {
    useNewURLParser: true
};
mongoose.connect(DB, DB_options)
.then(()=> 
{console.log('connect to db successful')}
);

// MIDDLEWARE
// cho phep cors
app.use(cors({
    origin: '*'
}));
//security http header
app.use(helmet());

//gioi han request tu 1 IP  
const limiter = rateLimit({
    max: 100,
    windowMs: 60*60*1000,
    message: 'too many request from this IP, pls try again in an hour'
});
app.use('/api', limiter);

// doc data tu req body
app.use(express.json());

// ngan chan NoSQL query injection
app.use(mongoSanitize());

//ngan chan XSS 
app.use(xss());

// su dung http plution params
app.use(hpp());

app.use(cookieParser());

// dinh nghia cac ROUTES
app.use('/api/v1/users', userRoute);
app.use('/api/v1/food', foodRoute);
// app.use('/api/v1/bookings', bookingRoute);
// app.use('/api/v1/reviews', reviewRoute);

//khi truy cap route chua duoc dinh nghia
app.all('*', (req,res,next) => {
    res.status(404).json({
        status: 'fail',
        message: 'this route is undefined'
    })
});

//ham xu ly loi
app.use((err,req,res,next) => {
    err.statusCode = err.StatusCode || 500;
    err.message = err.message || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });  
});

// OPEN SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> 
    console.log(`server on port ${PORT}`)
);