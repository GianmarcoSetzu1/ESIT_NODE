const db = require('../util/database');
const postgres = require("pg");
const config = require("../config/config.json");
const admin = require('../config/admin.json');



module.exports = class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }



    static find(email) {
        return db.query('SELECT * FROM esit.users WHERE email like $1', [email])
            .catch(e => console.error(e.stack))
            .then(res => {
                if (res.rows.length === 0)
                    return undefined
                console.log(res.rows[0].name);
                return res.rows[0]
            });
     }

     static isAdmin(email, password) {
         return email === admin.email && password === admin.password;
     }

    static save(user) {
        return db.query(
             'INSERT INTO esit.users(name, email, password) VALUES ($1, $2, $3)',
             [user.name, user.email, user.password]
        );
    }
}