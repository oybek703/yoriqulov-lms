const {sequelize} = require('../../config')
const {DataTypes} = require('sequelize')

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    email: {
        type: DataTypes.STRING,
        trim: true,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        len: [6, 64]
    },
    picture: {
        type: DataTypes.STRING,
        defaultValue: '/avatar.png'
    },
    role: {
        type: DataTypes.ARRAY(DataTypes.ENUM('Subscriber', 'Instructor', 'Admin')),
        defaultValue: ['Subscriber']
    },
    stripe_account_id: DataTypes.STRING,
    stripe_seller: DataTypes.STRING,
    stripe_session: DataTypes.STRING
}, {timestamps: false})

User.sync().then(() => console.log('User table created.'))

module.exports = User
