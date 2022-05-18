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
    },
    courseId: {
        type: DataTypes.UUID,
        allowNull: false
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
        type: DataTypes.FLOAT,
        set(val) {
            this.setDataValue('price', parseFloat(val))
        }
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
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {timestamps: false})

Course.belongsTo(User, {foreignKey: 'userId', targetKey: 'id'})
User.hasMany(Course, {foreignKey: 'userId', targetKey: 'id'})

Lesson.belongsTo(Course, {foreignKey: 'courseId', targetKey: 'id'})
Course.hasMany(Lesson, {foreignKey: 'courseId', targetKey: 'id', onDelete: 'CASCADE'})

module.exports = {
    Course,
    Lesson
}