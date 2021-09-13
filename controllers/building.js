const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Building = require('../models/building');
const Shutter = require('../models/shutter');

exports.findById = async (req, res, next) => {
    try {
        Building.findById(req.params.id).then((buildings) => {
            res.send(buildings);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteBuilding = async (req, res, next) => {
    try {
        Building.deleteBuilding(req.params.id);
        Building.findById(req.params.id).then((buildings) => {
            res.send(buildings);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.addBuilding = async (req, res, next) => {
    try {
        console.log("ADD BUILDING");
        Building.addBuilding(req.params.userId, req.body.name, req.body.city, req.body.address, req.body.street_number);
        Building.findById(req.params.userId).then((buildings) => {
            res.send(buildings);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateBuilding = async (req, res, next) => {
    try {
        Building.updateBuilding(req.params.buildingId, req.params.userId, req.body.name, req.body.city, req.body.address, req.body.street_number);
        Building.findById(req.params.userId).then((buildings) => {
            res.send(buildings);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.findShutterByBuilding = async (req, res, next) => {
    try {
        Shutter.findShutterByBuilding(req.params.buildingId).then((shutters) => {
            res.send(shutters);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteShutter = async (req, res, next) => {
    try {
         Shutter.deleteShutter(req.params.id);
         Shutter.findShutterByBuilding(req.params.building).then((shutters) => {
             res.send(shutters);
         })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.addShutter = async (req, res, next) => {
    try {
        console.log("ADD SHUTTER");
        Shutter.addShutter(req.params.buildingId, req.body.name, req.body.room);
        Shutter.findShutterByBuilding(req.params.buildingId).then((shutters) => {
            res.send(shutters);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateShutter = async (req, res, next) => {
    try {
        Shutter.updateShutter(req.params.shutterId, req.params.buildingId, req.body.name, req.body.room);
        Shutter.findShutterByBuilding(req.params.buildingId).then((shutters) => {
            res.send(shutters);
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateSlot = async (req, res, next) => {
    try {
        Shutter.updateSlot(req.params.shutterId, req.params.slot, req.params.value);
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

