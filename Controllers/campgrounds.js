const Campground = require('../models/campGround');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken })

const { cloudinary } = require('../cloudinary');

const index = async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground })
};

const renderNewForm = (req, res) => {
    res.render('campgrounds/new')
};

const newForm = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('invalid Campground Data', 400);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.authur = req.user._id;
    await campground.save();
    req.flash('success', 'Succesfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)

};

const showCampground = async (req, res) => {
    const fullCamp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate('authur');
    if (!fullCamp) {
        req.flash('error', 'No campground exsist');
        res.redirect('/campgrounds')
    }
    // const fullCampground = await Campground.find({});
    res.render('campgrounds/show', { fullCamp })
    // console.log({ fullCamp })
};

const showEditCampground = async (req, res) => {
    const fullCamp = await Campground.findById(req.params.id);
    if (!fullCamp) {
        req.flash('error', 'No campground exsist');
        res.redirect('/campgrounds')
    }
    // const fullCampground = await Campground.find({});
    res.render('campgrounds/edit', { fullCamp })
};

const editCampground = async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // console.log(req.body)
    const campG = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });

    campG.geometry = geoData.body.features[0].geometry;
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // console.log(img)
    campG.image.push(...img);
    await campG.save();
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename);
        }
        await campG.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } })
        console.log(campG)
    }

    req.flash('success', 'Succesfully Updated!');
    res.redirect(`/campgrounds/${campG._id}`)
};

const deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully Deleted');
    res.redirect('/campgrounds');
}

module.exports = { index, renderNewForm, newForm, showCampground, showEditCampground, editCampground, deleteCampground }