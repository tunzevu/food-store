const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must have name'],
        unique: true
    },
    title: {
        type: String,
        required: [true, 'must have title']
    },
    price: {
        type: Number,
        required: [true, 'must have price']
    },
    numberRating: {
        type: Number,
        default: 0
    },
    ratingAvg: {
        type: Number,
        default: 0
    },
    quantitySold: {
        type: Number,
        default: 0
    }
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;