const express = require('express');

const foodController = require('./../controller/foodController');
const userController = require('./../controller/userController');
const reviewRoute = require('./reviewRoute');

const foodRoute = express.Router();

foodRoute.use('/:foodId/reviews', reviewRoute);

foodRoute
    .get('/', foodController.getAllFood)
    .post('/', userController.authentication, userController.authorziration('admin'), foodController.createFood)
    .get('/:foodId', userController.authentication, foodController.getFood);

module.exports = foodRoute;
