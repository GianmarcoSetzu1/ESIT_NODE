const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {

    //console.log("Message: ", req.body.name);

    // const errors = validationResult(req);
    //
    // if (!errors.isEmpty()) {
    //     console.log("Errori nella validazione");
    //     return;
    // }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        //console.log("Message: ", "Passed");
        const hashedPassword = await bcrypt.hash(password, 12);

        const userDetails = {
            name: name,
            email: email,
            password: password,
            //password: hashedPassword,
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
        //console.log(email + ", " + User.find(email));
        const user = await User.find(email);

        console.log("Ciao" + user)

        if (user[0].length !== 1) {
            console.log("Password not equals")
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        else {
            console.log("Ciao")
        }

        const storedUser = user[0][0];

        //const isEqual = await bcrypt.compare(password, storedUser.password);

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
        res.status(200).json({token: token, userId: storedUser.id});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
