require('colors')
const {Sequelize} = require('sequelize')
const connection = require('./db')

const sequelize = new Sequelize(connection.database, connection.user, connection.password, {
    host: connection.host,
    dialect: 'postgres',
    quoteIdentifiers: false
});

async function checkConnection() {
    try {
        await sequelize.authenticate()
        console.log('Successfully connected to database'.white.underline)
    } catch (e) {
        console.log(`Error while connecting to database: ${e}`)
        console.error(e)
    }
}

module.exports = {
    checkConnection, sequelize
}