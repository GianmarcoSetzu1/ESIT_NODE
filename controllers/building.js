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

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
var awsIot = require('aws-iot-device-sdk');

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//



exports.updateSlot = async (req, res, next) => {
    try {
        Shutter.updateSlot(req.params.shutterId, req.params.slot, req.params.value);
        var device = awsIot.device({
            keyPath: 'C:/Users/pc/Desktop/UNICA/INFORMATICA LM-18/II Semestre/ESIT/PROGETTO SETZU FONNESU' +
                '/cert/Chiave Privata/a00d4a5ff2dfff7b0274c39db4cb6d1243ba3a26dc15a1c832033ce4ee6c3b9e-private.pem.key',
            certPath: 'C:/Users/pc/Desktop/UNICA/INFORMATICA LM-18/II Semestre/ESIT/PROGETTO SETZU FONNESU' +
                '/cert/Certificato/a00d4a5ff2dfff7b0274c39db4cb6d1243ba3a26dc15a1c832033ce4ee6c3b9e-certificate.pem.crt',
            caPath: 'C:/Users/pc/Desktop/UNICA/INFORMATICA LM-18/II Semestre/ESIT/PROGETTO SETZU FONNESU' +
                '/cert/CAroot Amazon 1/AmazonRootCA1.pem',
            clientId: 'bus',
            host: 'ar7s6tjbwbv5n-ats.iot.us-west-2.amazonaws.com'
        });

        //
        // Device is an instance returned by mqtt.Client(), see mqtt.js for full
        // documentation.
        //
        device
            .on('connect', function() {
                console.log('connect');
                device.subscribe('topic_1');
                let x = String(req.params.slot)[1];
                x = Number(x)-1;
                var fascia = "id_fascia"+x;
                device.publish('topic_2', JSON.stringify( {"state":{"desired":{[fascia] :  req.params.value}}}));
            });

        device
            .on('message', function(topic, payload) {
                console.log('message', topic, payload.toString());
            });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

