if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
};

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/expressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");


const userRoutes = require('./routes/users')
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const MongoStore = require('connect-mongo');






const DB_URL = process.env.DB_URL
// 'mongodb://localhost:27017/yelpCamp'

mongoose.connect(DB_URL);

//TO CHECK DATABASE CONNECTIVITY
const db = mongoose.connection;
db.once("connected", () => {
    console.log("Database connected")
})
db.on("error", (err) => {
    console.log("Connection failed: " + err)
});
//

const app = express();

//PATH
app.engine('ejs', ejsMate); //using EJSMATE
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

// PARSE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// METHODOVERIDE
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisisnotagoodsecret'

const store = MongoStore.create({
    mongoUrl: DB_URL,
    secret,
    touchAfter: 24 * 60 * 60
});

// store.on("error", function (e) {
//     console.log("STORE ERRO SESSION")
// })


const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'Session',
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 27 * 7,
        maxAge: 1000 * 60 * 60 * 27 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/vhortex17/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', userRoutes);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home.ejs')
});




app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something Went wrong' } = err;
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port} YELP`)
})
