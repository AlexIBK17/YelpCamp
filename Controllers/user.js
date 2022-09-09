const User = require('../models/user');


const renderRegister = (req, res) => {
    res.render('users/register');
};

const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
        // console.log(registeredUser);

    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
};


const renderLogin = async (req, res) => {
    res.render('users/login');
};


const loginUser = async (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
    delete req.session.returnTo;
};

const logout = (req, res) => {
    req.logOut(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'logged out successfully');
        res.redirect('/campgrounds');
    });
}

module.exports = { renderRegister, registerUser, renderLogin, loginUser, logout }