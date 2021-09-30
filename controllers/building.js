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

var awsIot = require('aws-iot-device-sdk');

exports.updateSlot = async (req, res, next) => {
    try {
        Shutter.updateSlot(req.params.shutterId, req.params.slot, req.params.value);
        // Device is an instance returned by mqtt.Client(), see mqtt.js for full
        // documentation.
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
                let x = String(req.params.slot).replace('f', '');
                x = Number(x)-1;
                var fascia = "id_fascia"+x;
                device.publish(
                    "$aws/things/tap" + req.params.shutterId + "/shadow/update",
                    JSON.stringify({ "state": { "desired": { [fascia]: req.params.value } } }),
                    0,
                    function (err) {
                        console.log('Messaggio pubblicato');
                        device.end(); // disconnect it to stop publications ....
                    }
                );
            });
        res.status(200).end("OK");
    } catch (err) {
        console.error("Si è verificato un errore:  ", JSON.stringify(err, null, 2));
    }

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
                var vl = req.body.value;
                if (vl === 1)
                    vl = 100;
                device.publish(
                    "$aws/things/tap" + req.params.shutterId + "/shadow/update",
                    JSON.stringify({ "state": { "desired": { "posizione": vl } } }),
                    0,
                    function (err) {
                        console.log('Messaggio pubblicato');
                        device.end(); // disconnect it to stop publications ....
                    }
                );
            });
        res.status(200).end("OK");
    } catch (err) {
        console.error("Si è verificato un errore:  ", JSON.stringify(err, null, 2));
    }

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
            KeyConditionExpression: "id_device = :idt", // attribute as filter
            ExpressionAttributeValues: { ":idt": "tap"+ req.params.shutterId}, // attribute filter value
            ScanIndexForward: false, // sorting based on timestamp decreasing
            Limit: 1, // one record
            ProjectionExpression: "posizione" // attributes returned
        };

        docClient.query(params, function (err, data) {
            if (err) {
                console.error("Errore da AWS: ", JSON.stringify(err, null, 2));
                res.status(200).end(JSON.stringify(err, null, 2));
            } else {
                console.log("DynamoDB.DocumentClient.query succeeded: ", JSON.stringify(data.Items[0], null, 2));
                if (data.Items[0] !== undefined)
                    res.status(200).end(JSON.stringify(data.Items[0].posizione, null, 2));
                else
                    res.status(200).end(JSON.stringify(0, null, 2));
            }
        });
    } catch (err) {
        console.error("Si è verificato un errore:  ", JSON.stringify(err, null, 2));
    }
}

