const db = require('../util/database');
const postgres = require("pg");
const config = require("../config/config.json");
const admin = require('../config/admin.json');

module.exports = class Building {
    constructor(name, city, address, street_number, owner) {
        this.name = name;
        this.city = city;
        this.street_number = street_number;
        this.owner = owner;
    }

    static findById(id) {
        return db.query('SELECT * FROM esit.buildings WHERE owner = $1', [id])
            .catch(e => console.error(e.stack))
            .then(res => {
                if (res.rows.length === 0)
                    return undefined
                return res.rows
            });
    }

    static deleteBuilding(id) {
        return db.query('DELETE FROM esit.buildings WHERE id = $1', [id])
            .catch(e => console.error(e.stack))
    }

    static addBuilding(userId, name, city, address, street_number) {
        return db.query('INSERT INTO esit.buildings(name, city, address, street_number, owner) VALUES ($1, $2, $3, $4, $5)',
            [name, city, address, street_number, userId]);
    }
}