// *********************************************************************************
// CONNECTION.JS - THIS FILE INITIATES THE CONNECTION TO MYSQL
// *********************************************************************************

// Dependencies
var Sequelize = require("sequelize"),
    connection;

// Lists out connection options
var source = {
    localhost: {
        host: 'localhost',
        user: 'root',
        password: "1111",
        database: "clubbr",
    }
}

//Selects a connection (can be changed quickly as needed)
var selectedSource = source.localhost;

//Creates mySQL connection using Sequelize or JAWSDB
if (process.env.JAWSDB_URL) {
    connection = new Sequelize('mysql://lvg7n5rrkneoz40j:fheiobsrgqh3bnc0@g8r9w9tmspbwmsyo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/ivt6e10saklwn5b3');
} else {
    connection = new Sequelize(selectedSource.database, selectedSource.user, selectedSource.password, {
        define: {
            timestamps: false
        },
        host: selectedSource.host,
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },

    });
}

// Exports the connection for other files to use
module.exports = connection;
