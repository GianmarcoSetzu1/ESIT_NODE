const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const authController = require('../controllers/auth');


router.post('/', authController.login);                     //Login screen

router.get('/adminhome', adminAuth, authController.fetchAll);          //Display all users
router.get('/adminhome/:id', adminAuth,  authController.deleteUser);    //Delete user with this id

router.post(                                                    //Registration form (accessible only for admin)
    '/signup',
    [
        adminAuth,
        body('name').trim().not().isEmpty(),
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom(async (email) => {
                const user = await User.find(email);
                if (user[0].length > 0) {
                    return Promise.reject('Email address already exist!');
                }
            })
            .normalizeEmail(),
        body('password').trim().isLength({ min: 7 }),
    ],
    authController.signup
);

module.exports = router;