const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const buildingRoutes = require('./routes/building')
//const User = require('./models/user');
const errorController = require('./controllers/error');
const awsIot = require("aws-iot-device-sdk");
const buildingController = require("./controllers/building");

const router = express.Router();

const app = express();


const ports = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, X-Custom-Header, Authorization'
    );
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});


app.use('/auth', authRoutes);

app.use('/buildings', buildingRoutes);


app.use(errorController.get404);

app.use(errorController.get500);


app.listen(ports, () => console.log(`Listening on port ${ports}`));



