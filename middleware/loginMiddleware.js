const ExpressError = require('../utilities/expressError');
const { campgroundSchema } = require('../schemas');
const Campground = require('../models/campGround');
const { reviewSchema } = require('../schemas');
const Review = require('../models/rewiew')



const isloggedIn = (req, res, next) => {
    // console.log(req.originalUrl);
    // console.log("REQ.USER...", req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
};

// VALIDATENG SCHEMA FROM BACKEND
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params
    const foundOwner = await Campground.findById(id);
    if (!foundOwner.authur.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
};


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId);
    if (!review.owner.equals(req.user._id)) {
        req.flash('error', 'You dont have permission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
};
module.exports = { isloggedIn, validateCampground, isAuthor, validateReview, isReviewAuthor };