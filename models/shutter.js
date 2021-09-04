const db = require("../util/database");
module.exports = class Building {
    constructor(name, room, building) {
        this.name = name;
        this.room = room;
        this.building = building;
    }

    static findShutterByBuilding(buildingId) {
        return db.query('SELECT * FROM esit.shutters WHERE building = $1', [buildingId])
            .catch(e => console.error(e.stack))
            .then(res => {
                if (res.rows.length === 0)
                    return undefined
                return res.rows
            });
    }

    static deleteShutter(id) {
        return db.query('DELETE FROM esit.shutters WHERE id = $1', [id])
            .catch(e => console.error(e.stack))
    }

    static addShutter(buildingId, name, room) {
        return db.query('INSERT INTO esit.shutters(name, room, building) VALUES ($1, $2, $3)',
            [name, room, buildingId]);
    }


}