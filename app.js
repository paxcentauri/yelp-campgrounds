if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// setup
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const helmet = require('helmet');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const mongoSanitize = require('express-mongo-sanitize');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const MongoDBStore = require("connect-mongo")(session);
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const User = require('./models/user');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpCamp';
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
// mongodb:doubleslashlocalhost:27017/yelpCamp
// 'mongodb://localhost:27017/yelpCampprocess.env.DB_URL;'
mongoose.connect(dbUrl)
    .then(() => {
        console.log("Mongo Connection Successful!")
    }).catch(err => {
        console.log("Mongo Error!");
        console.log(err);
    })
const store = new MongoDBStore({url: dbUrl, secret, touchAfter:24*60*60});
store.on('error', function(e){
    console.log('Session Store Error', e);
})
const sessionConfig = { store, name: 'session', secret, resave: false, saveUninitialized: false, cookie: { httpOnly: true, /*secure: true,*/ expires: Date.now() + 1000 * 60 * 60 * 24 * 7 } }
const path = require('path');
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(mongoSanitize({replaceWith: '_'}));
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/fakeUser', async (req, res) => {
    const user = new User({
        email: 'colt@gmail.com', username: 'coltt'
    })
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})



app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
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
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
// middleware for flash
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// express router set up
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// home page
app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})
// error handler used for responding to errors
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong!"
    }
    res.status(statusCode).render('error', { err });
})
app.listen(3000, () => {
    console.log("Listening on port 3000!");
})
