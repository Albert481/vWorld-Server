let Mysql = require('mysql');

module.exports = class Database {
    constructor(isLocal = false) {
        if (isLocal) {
            this.pool = Mysql.createPool({
                host: process.env.LOCAL_DATABASE_HOST,
                user: process.env.LOCAL_DATABASE_USER,
                password: process.env.LOCAL_DATABASE_PASS,
                database: process.env.LOCAL_DATABASE_DB
            })
        } else {
            this.pool = Mysql.createPool({
                host: process.env.PROD_DATABASE_HOST,
                user: process.env.PROD_DATABASE_USER,
                password: process.env.PROD_DATABASE_PASS,
                database: process.env.PROD_DATABASE_DB
            })
        }
        
    }

    Connect(callback) {
        let pool = this.pool;
        pool.getConnection((error, connection) => {
            if (error) throw error;
            callback(connection);
        });
    }

    GetSampleData(callback) {
        this.Connect(connection => {
            let query = "SELECT * FROM users";

            connection.query(query, (error, results) => {
                connection.release();
                if (error) throw error;
                callback(results);
            })
        })
    }

    GetSampleDataByUsername(username, callback) {
        this.Connect(connection => {
            let query = "SELECT * FROM users WHERE userName=?";

            connection.query(query, [username], (error, results) => {
                connection.release();
                if (error) throw error;
                callback(results);
            });
        });
    }
}