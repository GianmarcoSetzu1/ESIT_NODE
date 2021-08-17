const postgres = require('pg');

const config = require('../config/config.json');

const pool = new postgres.Pool({
    host: config.host,
    user: config.user,
    database: config.database,
    password: config.password,
});

pool.query('SELECT * FROM esit.users', (err, result) => {
   if (err) {
        return console.error('Error executing query', err.stack)
   }
        console.log(result.rows)
});

module.exports = {
    query: (text, params) => pool.query(text, params),
}




//
// const {Client} = require('pg')
// const config = require('../config/config.json');
//
// const client = new Client({
//     host: config.host,
//     user: config.user,
//     port: 5432,
//     database: config.database,
//     password: config.password,
// })
//
// client.connect((err, client, release) => {
//     if (err) {
//         return console.error('Error acquiring client', err.stack)
//     }
//     client.query('SELECT * FROM esit.users', (err, result) => {
//         if (err) {
//             return console.error('Error executing query', err.stack)
//         }
//         console.log(result.rows)
//     })
// })
//
// module.exports = client.promise();
//



// const { Pool } = require('pg')
//
// const config = require('../config/config.json');
//
// const pool = new Pool({
//     host: config.host,
//     user: config.user,
//     database: config.database,
//     password: config.password,
//     max: 20,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 2000,
// })
//
// pool.connect((err, client, release) => {
//     if (err) {
//         return console.error('Error acquiring client', err.stack)
//     }
//     client.query('SELECT NOW()', (err, result) => {
//         release()
//         if (err) {
//             return console.error('Error executing query', err.stack)
//         }
//         console.log(result.rows)
//     })
// })
// //module.exports = pool.promise()