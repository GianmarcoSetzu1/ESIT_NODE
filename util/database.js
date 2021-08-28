const postgres = require('pg');

const config = require('../config/config.json');

const pool = new postgres.Pool({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password,
});

pool.query('SELECT * FROM esit.users WHERE email like $1', ['user4@unica.it'], (err, result) => {   //Query to test the db
   if (err) {
        return console.error('Error executing query', err.stack)
   }
        console.log(result.rows)
});

module.exports = {
    query: (text, params) => pool.query(text, params),
}
