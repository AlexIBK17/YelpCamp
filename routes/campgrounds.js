const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isloggedIn, validateCampground, isAuthor } = require('../middleware/loginMiddleware');
const { index, renderNewForm, newForm, showCampground, showEditCampground, editCampground, deleteCampground } = require('../Controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(index))
    .post(isloggedIn, upload.array('image'), validateCampground, catchAsync(newForm))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.file)
//     res.send('it works')
// })

router.get('/new', isloggedIn, renderNewForm);

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isloggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(editCampground))
    .delete(isAuthor, catchAsync(deleteCampground))

router.get('/:id/edit', isloggedIn, isAuthor, catchAsync(showEditCampground));


module.exports = router