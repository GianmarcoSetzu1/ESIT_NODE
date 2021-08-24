const db = require('../util/database');
const postgres = require("pg");
const config = require("../config/config.json");



module.exports = class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }



    static find(email) {
        db.query('SELECT * FROM esit.users')
            .then(res => {
                console.log(res.rows[1]);
                //return res.rows[0]
                // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
            })
            .catch(e => console.error(e.stack))

        //console.log(db.query('SELECT * FROM esit.users').);
        //return db.query('SELECT * FROM esit.users');

        //return pool.query('SELECT * FROM esit.users WHERE email like $1',  ['user4@unica.it']);
    }

    static save(user) {
        return db.query(
             'INSERT INTO esit.users(name, email, password) VALUES ($1, $2, $3)',
             [user.name, user.email, user.password]
        );
    }
}