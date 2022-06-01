const { Model } = require('mongoose');
const AppError = require('./AppError');
const catchAsync = require('./catchAsync');

class queryAllFeatures{
    constructor(query, queryObj){
        this.query = query;
        this.queryObj = queryObj;
    }

    filter() {
        let queryFilter = {...this.queryObj};

        const queryOptions = ['sort', 'fields', 'limit', 'page'];
        queryOptions.forEach(field => {delete queryFilter[field]});

        let queryString = JSON.stringify(queryFilter);
        queryString = queryString.replace(/\bgte|lte|gt|lt\b/g, (match)=> `$${match}`);
        queryString = JSON.parse(queryString);

        this.query = this.query.find(queryString);
        
        return this;
    }

    sort() {
        let sortBy = this.queryObj.sort;
        if (!sortBy) return this;
        sortBy = sortBy.split(',');
        sortBy = sortBy.join(' ');

        this.query = this.query.sort(sortBy);
        return this;
    }

    fields() {
        let fields = this.queryObj.fields;
        if( !fields) return this;
        fields = fields.split(',');
        fields = fields.join(' ');

        this.query= this.query.select(fields);
        return this;
    }

    pageAndLimit() {
        let page=0, limit=10;
        if (this.queryObj.page) {
            page = this.queryObj.page - 1;
        }
        if (this.queryObj.limit) {
            limit = this.queryObj.limit * 1;
        }
        // if (!page || !limit) return this;

        this.query = this.query.skip(page* limit).limit(limit);
        return this;
    }
};

exports.getAll = (Model) => {
    return catchAsync(async(req,res,next) => {
        let filter = {};
        // Model == Review, tim kiem cac review cua 1 mon an
        if (req.params.foodId) filter = {booking_item_id: req.params.foodId};

        // Model = Booking || Review, tim kiem cac booking hoac review cua 1 user
        if (req.params.userId) filter = {user: req.params.userId};

        const {query} = new queryAllFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .fields()
            .pageAndLimit();

        const data = await query;

        res.status(200).json({
            status: 'success',
            data
        });
    })
};

exports.getOne = (Model, populationOptions) => {
    return catchAsync(async(req,res,next) => {
        req.params.id = req.params.id || req.params.foodId || req.params.bookingId || req.params.reviewId || req.user._id;
        let query = Model.findById(req.params.id);

        if(populationOptions) query= query.populate(populationOptions);

        const data = await query;
        if (!data) next( new AppError('no data', 404));
        res.status(200).json({
            status: 'success',
            data
        })
    });
};

exports.createOne = (Model) => {
    return catchAsync(async(req,res,next)=> {
        const data = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data
        })
    })
};

exports.updateOne = (Model) => {
    return catchAsync(async(req,res,next)=> {
        const updateOptions = {
            runValidators: true,
            new: true
        };

        req.params.id = req.params.id || req.params.foodId || req.params.bookingId || req.params.reviewId || req.user._id;
        const query = Model.findByIdAndUpdate(req.params.id, req.body, updateOptions);

        const data = await query;
        res.status(200).json({
            status: 'success',
            data
        })
    })
};
