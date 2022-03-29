const User = require('./User')
const {sequelize} = require('../../config')
const {DataTypes} = require('sequelize')

const Lesson = sequelize.define('Lesson', {
    title: {
        type: DataTypes.STRING,
        trim: true,
        len: [3, 320],
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        set(val) {
            this.setDataValue('slug', val.toLowerCase())
        }
    },
    content: {
        type: DataTypes.JSON,
        validate: {
            min: {
                args: [300],
                msg: 'Content should contain at least 300 characters.'
            }
        }
    },
    video_link: {
        type: DataTypes.STRING
    },
    free_preview: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {timestamps: false})

const Course = sequelize.define('Course', {
    name: {
        type: DataTypes.STRING,
        trim: true,
        len: [3, 320],
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        set(val) {
            this.setDataValue('slug', val.toLowerCase())
        }
    },
    description: {
        type: DataTypes.JSON,
        validate: {
            min: {
                args: [300],
                msg: 'Content should contain at least 300 characters.'
            }
        },
        allowNull: false
    },
    price: {
        type: DataTypes.NUMBER,
        defaultValue: 9.99
    },
    image: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
})

Course.belongsTo(User, {as: 'userId'})
Course.hasMany(Lesson, {as: 'lessons'})

Lesson.sync().then(() => console.log('Lesson table created.'))
Course.sync().then(() => console.log('Course table created.'))

module.exports = {
    Course,
    Lesson
}