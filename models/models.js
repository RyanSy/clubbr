var Sequelize = require("sequelize");

var sequelizeConnection = require("../config/connection.js");

var Event = sequelizeConnection.define("events", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    genre: {
        type: Sequelize.STRING
    },
    venue: {
        type: Sequelize.STRING
    },
    djs: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    hours: {
        type: Sequelize.STRING
    },
    user_id: {
        type: Sequelize.INTEGER
    },
    image: {
        type: Sequelize.STRING
    }
});

var User = sequelizeConnection.define("users", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    password_hash: {
        type: Sequelize.STRING,
    }
}, {
    underscored: true
});

// looking up the best way to do this
Event.belongsTo(User, {
    foreignKey: 'id'
});
User.hasMany(Event, {
    foreignKey: 'id'
});

// Syncs with DB
Event.sync();
User.sync();

// Makes the Event Model available for other files (will also create a table)
module.exports = [Event, User];
