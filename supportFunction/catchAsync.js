module.exports = yourFunction => {
    return (req,res,next) => {
        yourFunction(req,res,next).catch(err=> next(err));
    }
};