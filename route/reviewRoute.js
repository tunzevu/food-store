const express = require('express');

const reviewController = require('./../controller/reviewController');

const reviewRoute = express.Router({ mergeParams: true });

reviewRoute
    //  /api/v1/food/foodId/reviews || /api/v1/users/me/reviews tuy thuoc vao params la foodId hay userId
    // dinh nghia o factory Query get all
    .get('/', reviewController.getAllReview)
    //  /api/v1/users/me/reviews
    .post('/', reviewController.createReview)
    .get('/:reviewId', reviewController.getReview)
    .patch('/:reviewId', reviewController.updateReview)

module.exports = reviewRoute;