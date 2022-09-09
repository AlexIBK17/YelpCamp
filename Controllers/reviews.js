const Campground = require('../models/campGround');
const Review = require('../models/rewiew');

const createReviews = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review posted');
    res.redirect(`/campgrounds/${campground._id}`);
};

const deletReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succesfully Deleted');
    res.redirect(`/campgrounds/${id}`)
};

module.exports = { createReviews, deletReview }