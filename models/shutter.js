const db = require("../util/database");

module.exports = class Shutter {
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

    static updateShutter(shutterId, buildingId, name, room) {
        return db.query('UPDATE esit.shutters SET name=$1, room=$2 WHERE id=$3 and building=$4',
            [name, room, shutterId, buildingId])
            .catch(e => console.error(e.stack))
    }

    static updateSlot(shutterId, slot, value) {
        return db.query('UPDATE esit.shutters SET ' + slot + '=$1 WHERE id=$2',[value, shutterId])
            .catch(e => console.error(e.stack))
    }

    static updateClosure(shutterId, value) {
        return db.query('UPDATE esit.shutters SET closure=$1 WHERE id=$2',[value, shutterId])
            .catch(e => console.error(e.stack))
    }


}