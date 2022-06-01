const jwt = require('jsonwebtoken');

const User = require('./../model/userModel');
const catchAsync = require('./../supportFunction/catchAsync');
const AppError = require('./../supportFunction/AppError');
const factoryQuery = require('./../supportFunction/factoryQuery');

const tokenOptions = {
    expiresIn: "10h"
};
const cookieOptions = {
    expiresIn: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*10*24*60*60*1000
    ),
    httpOnly: true
};

exports.signup = async (req, res, next) => {
    const user = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        user
    });
};

exports.login = async (req, res, next) => {
    // check email password nhap vao
    if (!req.body.email || !req.body.password) return next(new AppError('email password must be filled', 400));
    // tim user theo email
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user) return next(new AppError('email or password is not correct', 400));
    const correctPassword = await user.checkPassword(req.body.password, user.password);
    if (!correctPassword) return next(new AppError('email or password is not correct', 400));
    user.password = undefined;

    // tao token
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, tokenOptions);

    res.cookie('jwt', token, cookieOptions);
    res.status(201).json({
        status: 'success',
        token,
        user
    });
};

exports.authentication = catchAsync( async (req,res,next) => {
    // doc token
    const token = req.cookies.jwt;
    if (!token) return next(new AppError('pls login', 401));

    //check token
    const decode = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decode.id);

    //ktra xem user co ton tai khong
    if(!user) return next(new AppError('your acc no exist', 404));
    // luu thong tin user vao req tiep theo
    req.user = user;

    next();
});

exports.authorziration = (...roles) => {
    return (req,res,next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('cant access this resource', 401));
        }
        next();
    }
};

exports.getMe = (req,res,next) => {
    req.params.userId = req.user._id;
    next();
};

exports.getUser = factoryQuery.getOne(User);
