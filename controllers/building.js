const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Building = require('../models/building');

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
