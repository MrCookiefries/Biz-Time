/** Database setup for BizTime. */

const {Client} = require("pg");

const config = {
    host: "localhost",
    user: "myuser",
    password: "password",
    database: `biztime${process.env.NODE_ENV === "test" ? "_test": ""}`
};

const db = new Client(config);
db.connect();

module.exports = db;
