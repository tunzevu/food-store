const catchAsync = require('../supportFunction/catchAsync');
const Booking = require('./../model/bookingModel');
const factoryQuery = require('./../supportFunction/factoryQuery');

exports.getAllBooking = factoryQuery.getAll(Booking);
exports.getBooking = factoryQuery.getOne(Booking, {path: 'user', select: 'name'});
exports.createBooking = factoryQuery.createOne(Booking);

exports.getBookingStats = catchAsync( async(req,res,next) => {
    const data = await Booking.aggregate([
        {
            $match: {}
        },
        {
            $group: {
                _id: null,
                totalPrice: {$sum : '$price'},
                avgPrice: {$avg : '$price'},
                quantity: {$sum : 1}
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data
    })
});