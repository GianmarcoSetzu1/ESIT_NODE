const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const adminAuth = require('../middleware/adminAuth');

const buildingController = require('../controllers/building');
const authController = require("../controllers/auth");

router.get('/buildings/:id', adminAuth, buildingController.findById);          //Display all buildings for id user
router.get('/buildings/:id/:owner', adminAuth, buildingController.deleteBuilding);
router.post('/buildings/:userId', buildingController.addBuilding);

module.exports = router;