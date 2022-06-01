const Review = require('./../model/reviewModel');
const factoryQuery = require('./../supportFunction/factoryQuery');

exports.getAllReview = factoryQuery.getAll(Review);
exports.getReview = factoryQuery.getOne(Review);
exports.createReview = factoryQuery.createOne(Review);
exports.updateReview = factoryQuery.updateOne(Review);