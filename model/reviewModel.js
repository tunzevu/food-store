const mongoose = require('mongoose');
const AppError = require('../supportFunction/AppError');
const Booking = require('./bookingModel');
const Food = require('./foodModel');

const reviewSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Booking',
        required: [true, 'you must provide booking id']
    },
    booking_item_id: {
        type: String,
        required: [true, 'you must provide booking item id']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'you must provide user']
    },
    review: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        max: 5,
        min: 1,
        required: [true, 'rating point']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ngan viec lap lai danh gia 
reviewSchema.index({ booking_id: 1, booking_item_id: 1 }, { unique: true });

// tinh toan va cap nhat lai rating trung binh doi voi tung mon an
reviewSchema.statics.calcRatingAvg = async function (foodId) {
    const stats = await this.aggregate([
        {
            $match: { booking_item_id: foodId }
        },
        {
            $group: {
                _id: '$booking_item_id',
                numberRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats === []) {
        await Food.findByIdAndUpdate(foodId, {
            ratingAvg: 4.5,
            numberRating: 0
        })
    }
    else {
        await Food.findByIdAndUpdate(foodId, {
            ratingAvg: stats[0].avgRating,
            numberRating: stats[0].numberRating
        });
    };
};

// kiem tra foodId va boonkingId
reviewSchema.pre('save', async function (next) {
    const bookingData = await Booking.findById(this.booking_id);
    // if (!bookingData.status === 'done') return next(new AppError('not done your booking', 400));
    if (!bookingData) return next(new AppError('your booking is not exist', 400));
    const bookingItemIdArray = bookingData.foods.map(el => el.foodId);
    if (!bookingItemIdArray.includes(this.booking_item_id)) next(new AppError('your booking is not exist', 401));

    next();
});
// khi sua hoa xoa rating 
// lay du lieu cho hook post
reviewSchema.pre(/^findOneAnd/, async function (next) {
    // clone de co the thuc hien lai query 1 lan nua
    this.ratingData = await this.findOne().clone();
    console.log(this.ratingData);

    next();
});
// cap nhat lai rating trung binh sau khi sua, xoa
reviewSchema.post(/^findOneAnd/, async function () {
    await this.ratingData.constructor.calcRatingAvg(this.ratingData.booking_item_id);
});

// cap nhat rating trung binh neu co rating moi
reviewSchema.post('save', function () {
    this.constructor.calcRatingAvg(this.booking_item_id);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;