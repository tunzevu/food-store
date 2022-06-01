const express = require('express');

const bookingController = require('./../controller/bookingController');

const bookingRoute = express.Router({ mergeParams: true });

bookingRoute
    //  /api/v1/users/me/booking
    .get('/', bookingController.getAllBooking)
    .post('/', bookingController.createBooking)
    .get('/:bookingId', bookingController.getBooking);
    
module.exports = bookingRoute;