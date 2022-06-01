const mongoose = require('mongoose');
const Food = require('./foodModel');
const AppError = require('./../supportFunction/AppError');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'must provide user']
    },
    foods: [{
        foodId: {
            type: String,
            required: [true, 'must provide foodId']
        },
        info: {},
        quantity: {
            type: Number,
            required: [true, 'must have quantity'],
            min: 1
        }
    }],
    price: Number,
    status: {
        type: String,
        enum: ['canceled', 'not done', 'done', 'rated'],
        default: 'not done'
    },
    location: {
        type: String,
        required: [true, 'must provide location']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    price: Number
});
 
// calc price and embed real info of foods in booking
// tinh toan gia tri don hang va nhung thong tin ve cac food vao trong don hang
bookingSchema.pre('save', async function(next) {
    const foodQuantity = this.foods.map(el => el.quantity)
    const foodId = this.foods.map(el => el.foodId);
    
    const foodInfoPromise = foodId.map(async el => await Food.findById(el));
    const foodInfo = await Promise.all(foodInfoPromise);

    this.price = foodInfo.reduce((preV, curV, curI) => {
        // check 
        if (!curV) return next(new AppError('your food not exist', 400));
        // them thong tin vao foods.info
        this.foods[curI].info = curV;
        // tinh gia tri don hang
        return preV + curV.price * foodQuantity[curI];
    }, 0);
    next();
});

// populate thong tin ve user
bookingSchema.pre(/^find/, function(next) {
    this.populate({path: 'user', select: 'name'});
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;