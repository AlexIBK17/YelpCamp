const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utilities/catchAsync');
const { validateReview, isloggedIn, isReviewAuthor } = require('../middleware/loginMiddleware');
const { createReviews, deletReview } = require('../Controllers/reviews')




router.post('/', isloggedIn, validateReview, catchAsync(createReviews))

router.delete('/:reviewId', isloggedIn, isReviewAuthor, catchAsync(deletReview))

module.exports = router;