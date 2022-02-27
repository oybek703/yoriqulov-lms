require('colors')
const {Pool} = require('pg')
const connection = require('../../config/db')
const pool = new Pool(connection)

async function checkConnection() {
    try {
        await pool.query('SELECT 1')
        console.log('Successfully connected to database'.white.underline)
    } catch (e) {
        console.log(`Error while connecting to database: ${e}`)
        console.error(e)
    }
}

module.exports = {
    pool, checkConnection
}