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
        //
        // Device is an instance returned by mqtt.Client(), see mqtt.js for full
        // documentation.
        //
        var device = awsIot.device({
            keyPath: 'private/99e1adf37e-private.pem.key',
            certPath: 'private/99e1adf37e-certificate.pem.crt',
            caPath: 'private/AmazonRootCA1.pem.crt',
            clientId: 'esit-obj1',
            host: 'a2qk19pk2pxg5u-ats.iot.us-east-2.amazonaws.com'
        });

        device
            .on('connect', function () {
                console.log('MQTT Connesso');
                var fascia = "id_fascia" + req.params.slot;
                device.publish(
                    "$aws/things/" + req.params.shutterId + "/shadow/update",
                    JSON.stringify({ "state": { "desired": { [fascia]: req.params.value } } }),
                    0,
                    function (err) {
                        console.log('Messaggio pubblicato');
                        device.end(); // lo disconnetto se no continua ad inviare il messaggio....
                    }
                );
            });
        res.status(200).end("OK");
    } catch (err) {
        console.error("Si è verificato un errore:  ", JSON.stringify(err, null, 2));
    }

    //     device
    //         .on('connect', function() {
    //             console.log('connect');
    //             device.subscribe('topic_1');
    //             let x = String(req.params.slot)[1];
    //             x = Number(x)-1;
    //             var fascia = "id_fascia"+x;
    //             device.publish('topic_2', JSON.stringify( {"state":{"desired":{[fascia] :  req.params.value}}}));
    //         });
    //
    //     device
    //         .on('message', function(topic, payload) {
    //             console.log('message', topic, payload.toString());
    //         });
    // } catch (err) {
    //     if (!err.statusCode) {
    //         err.statusCode = 500;
    //     }
    //     next(err);
    // }
}


exports.updateClosure = async (req, res, next) => {
    try {
        Shutter.updateClosure(req.body.shutterId, req.body.value);

        var device = awsIot.device({
            keyPath: 'private/99e1adf37e-private.pem.key',
            certPath: 'private/99e1adf37e-certificate.pem.crt',
            caPath: 'private/AmazonRootCA1.pem.crt',
            clientId: 'esit-obj1',
            host: 'a2qk19pk2pxg5u-ats.iot.us-east-2.amazonaws.com'
        });

        device
            .on('connect', function () {
                console.log('MQTT Connesso');
                device.publish(
                    "$aws/things/" + req.params.shutterId + "/shadow/update",
                    JSON.stringify({ "state": { "desired": { "posizione": req.body.value } } }),
                    0,
                    function (err) {
                        console.log('Messaggio pubblicato');
                        device.end(); // lo disconnetto se no continua ad inviare il messaggio....
                    }
                );
            });
        res.status(200).end("OK");
    } catch (err) {
        console.error("Si è verificato un errore:  ", JSON.stringify(err, null, 2));
    }
    //     device
    //         .on('connect', function() {
    //             console.log('connect');
    //             device.subscribe('topic_1');
    //             device.publish('topic_2', JSON.stringify( {"state":{"desired":{ "posizione" :  req.body.value}}}));
    //         });
    //
    //     device
    //         .on('message', function(topic, payload) {
    //             console.log('message', topic, payload.toString());
    //         });
    // } catch (err) {
    //     if (!err.statusCode) {
    //         err.statusCode = 500;
    //     }
    //     next(err);
    // }
}

var AWS = require("aws-sdk");

AWS.config.update({
    region: 'us-east-2',
    accessKeyId: 'AKIAUZY37P5YNE2ISHND',
    secretAccessKey: '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',
    endpoint: "https://dynamodb.us-east-2.amazonaws.com"
});


exports.getStatus = async (req, res, next) => {
    try {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: "tab6",
            KeyConditionExpression: "id_device = :idt", // attributo da usare come filtro
            ExpressionAttributeValues: { ":idt": 'esit-obj1' /*req.params.id*/ }, // valore dell'attributo filtro
            ScanIndexForward: false, // ordinamento in base al timestamp decrescente
            Limit: 1, // solo un record
            ProjectionExpression: "posizione" // attributi che vengono restituiti, è possibile eliminare quelli non usati
        };

        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Errore da AWS: ", JSON.stringify(err, null, 2));
                res.status(200).end(JSON.stringify(err, null, 2));
            } else {
                console.log("DynamoDB.DocumentClient.query succeeded: ", JSON.stringify(data.Items[0], null, 2));
                // valori in data.Items[0] es. data.Items[0].lightval
                res.status(200).end(JSON.stringify(data.Items[0].posizione, null, 2));
            }
        });
    } catch (err) {
        console.error("Si è verificato un errore:  ", JSON.stringify(err, null, 2));
    }
}

