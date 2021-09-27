const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');

const buildingController = require('../controllers/building');
const authController = require("../controllers/auth");

router.get('/buildings/:id', auth, buildingController.findById);          //Display all buildings for id user
router.get('/buildings/:id/:owner', adminAuth, buildingController.deleteBuilding);
router.post('/buildings/:userId', buildingController.addBuilding);
router.post('/buildings/:buildingId/:userId', buildingController.updateBuilding);

router.get('/shutterss/:buildingId', auth, buildingController.findShutterByBuilding);
router.get('/shutters/:id/:building', adminAuth, buildingController.deleteShutter);
router.get('/shutters/:shutterId/:slot/:value', buildingController.updateSlot);
router.get('/shutters/:buildingId', buildingController.getStatus);

router.post('/shutters/:buildingId', buildingController.addShutter);
router.post('/shutters/:shutterId/:buildingId', buildingController.updateShutter);
router.post('/shutters/', buildingController.updateClosure);

module.exports = router;