const express = require('express');

const userController = require('./../controller/userController');
const bookingController = require('./../controller/bookingController');
const bookingRoute = require('./bookingRoute');
const reviewRoute = require('./reviewRoute');

const userRoute = express.Router();

// sign up, log in
userRoute.post('/signup', userController.signup);
userRoute.post('/login', userController.login);

//admin
userRoute
    .get('/admin/booking-statistics', userController.authentication, userController.authorziration('admin'), bookingController.getBookingStats);

// user
userRoute.use(userController.authentication, userController.authorziration('user'), userController.getMe);
userRoute.get('/me/info', userController.getUser);
userRoute.use('/me/bookings', bookingRoute);
userRoute.use('/me/reviews', reviewRoute);

module.exports = userRoute;