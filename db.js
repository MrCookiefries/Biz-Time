/** Database setup for BizTime. */

import pg from "pg";
const {Client} = pg;

const config = {
    host: "localhost",
    user: "myuser",
    password: "password",
    database: `biztime${process.env.NODE_ENV === "test" ? "_test": ""}`
};

const db = new Client(config);
db.connect();

export default db;
