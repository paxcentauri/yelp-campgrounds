const express = require('express');
const router = express.Router();
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');


// grouping of the / routes 
router.route('/').get(catchAsync(campgrounds.index)).post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
// new campground form
router.get('/new', isLoggedIn, campgrounds.newCampgroundForm);
// show, update and delete pages 
router.route('/:id').get(catchAsync(campgrounds.showCampground)).put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground)).delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
// get route for edit form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampgroundForm));
// edits and updates the campground


module.exports = router;