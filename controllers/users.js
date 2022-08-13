const User = require('../models/user');
module.exports.loginForm = (req, res) => {
    res.render('users/login');
}
module.exports.registerForm = (req, res) => {
    res.render('users/register');
}
module.exports.loginUser = (req, res) => {
    req.flash('success', 'Successfully logged in!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const createdUser = await User.register(newUser, password);
        req.login(createdUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}
module.exports.logoutUser = (req, res) => {
    req.logout(() => {
        req.flash('success', 'Logged out!');
        res.redirect('/campgrounds');
    });
}
