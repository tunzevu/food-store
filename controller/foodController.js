const Food = require('./../model/foodModel');
const factoryQuery = require('./../supportFunction/factoryQuery');

exports.getAllFood = factoryQuery.getAll(Food);
exports.getFood = factoryQuery.getOne(Food);
exports.createFood = factoryQuery.createOne(Food);

