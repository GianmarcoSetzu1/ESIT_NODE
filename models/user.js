const db = require('../util/database');
const admin = require('../config/admin.json');

module.exports = class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static updateUserWPassword(id, name, email, password) {
        return db.query('UPDATE esit.users SET name=$1, email=$2, password=$3 WHERE id = $4', [name, email, password, id])
            .catch(e => console.error(e.stack))
    }

    static updateUser(id, name, email) {
        return db.query('UPDATE esit.users SET name=$1, email=$2 WHERE id = $3', [name, email,id])
            .catch(e => console.error(e.stack))
    }



    static deleteUser(id) {
        return db.query('DELETE FROM esit.users WHERE id = $1', [id])
            .catch(e => console.error(e.stack))
    }

    static fetchAll() {
        return db.query('SELECT id, name, email FROM esit.users')
            .catch(e => console.error(e.stack))
            .then(res => {
                if (res.rows.length === 0)
                    return undefined
                return res.rows
            });
    }

    static find(email) {
        return db.query('SELECT * FROM esit.users WHERE email like $1', [email])
            .catch(e => console.error(e.stack))
            .then(res => {
                if (res.rows.length === 0)
                    return undefined
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