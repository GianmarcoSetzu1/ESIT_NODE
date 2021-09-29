const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/admin.json');

exports.signup = async (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userDetails = {
            name: name,
            email: email,
            password: password,
        };

        const result = await User.save(userDetails);
        res.status(201).json({ message: 'User registered!' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        let user = null;
        if (User.isAdmin(email, password))
            user = config;
        else {
            user = await User.find(email);

            if (user === undefined) {
                console.log("A user with this email could not be found.")
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
        }

        const storedUser = user;

        const isEqual = await (password === storedUser.password);

        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: storedUser.email,
                userId: storedUser.id,
            },
            'secretfortoken',
            {expiresIn: '1h'}
        );

        res.status(200).json({token: token, userId: storedUser.id, userName: storedUser.name});

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.fetchAll = async (req, res, next) => {
    try {
        User.fetchAll().then((users) => {
            res.send(users);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.deleteUser = async (req, res, next) => {
    try {
        User.deleteUser(req.params.id);
        User.fetchAll(req.params.id).then((users) => {
            res.send(users);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        if (req.body.password.length >= 7)
            User.updateUserWPassword(req.params.id, req.body.name, req.body.email, req.body.password);
        else
            User.updateUser(req.params.id, req.body.name, req.body.email);
        User.fetchAll().then((users) => {
            res.send(users);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
