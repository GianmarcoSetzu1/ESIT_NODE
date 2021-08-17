const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');

//const postsRoutes = require('./routes/posts');

const errorController = require('./controllers/error');

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

//app.get('/', (req, res) => res.send('My REST API!'));

//app.use('/post', postsRoutes);

app.use(errorController.get404);

app.use(errorController.get500);

app.listen(ports, () => console.log(`Listening on port ${ports}`));



/*
const express = require("express");
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

//For production, just  use sync() without parameters to avoid dropping data
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop existing tables and Resync Db');
    initial();
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application." });
});

let func = require('./app/routes/auth.routes,js');
func(app);

// routes
//require('./app/routes/auth.routes')(app);
//require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.create({
        id: 1,
        name: "admin"
    });

    Role.create({
        id: 2,
        name: "user"
    });
}






 */