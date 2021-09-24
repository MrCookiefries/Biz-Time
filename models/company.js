const db = require("../db");
const ExpressError = require("../expressError");
const slugify = require("slugify");

class Company {
    static async getAll() {
        const result = await db.query(
            `SELECT code, name, description FROM companies`
        );
        return result.rows;
    }
    static async checkCode(code) {
        const result = await db.query(
            `SELECT code, name, description FROM companies
            WHERE code = $1`,
            [code]
        );
        if (!result.rows.length)
            throw new ExpressError(404, `No company found with code "${code}"`);
        return result.rows[0];
    }
    static async postNew({name, description}) {
        const code = slugify(name);
        const result = await db.query(
            `INSERT INTO companies
            (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`,
            [code, name, description]
        );
        return result.rows[0];
    }
    static async putOne(code, {name, description}) {
        await this.checkCode(code);
        const result = await db.query(
            `UPDATE companies SET name = $2, description = $3
            WHERE code = $1 RETURNING code, name, description`,
            [code, name, description]
        );
        return result.rows[0];
    }
    static async deleteOne(code) {
        await this.checkCode(code);
        await db.query(
            `DELETE FROM companies
            WHERE code = $1`,
            [code]
        );
        return "deleted";
    }
}

module.exports = Company;
