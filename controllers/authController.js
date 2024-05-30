import User from '../models/User.js';
import passport from 'passport';
import bcrypt from 'bcrypt';

export const login = (req, res) => {
     res.redirect('/login');
}

export const verifyLogin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
});

export const register = (req, res) => {
    res.render('register');
}

export const verifyRegister = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.send(error.message);
    }
};

export const logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

export const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access denied');
}
