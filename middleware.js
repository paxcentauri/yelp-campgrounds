const { campgroundSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { reviewSchema } = require('./schemas');
module.exports.isLoggedIn = (req, res, next) => {
    // check if user is already logged in?
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    } else {
        next();
    }
}

// middleware func
module.exports.validateCampground = (req, res, next) => {
    // validates the request body to make sure all above validations are passed
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// middleware for authorization
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
// middleware for authorization
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewID, id } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    // validates the request body to make sure all above validations are passed
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}