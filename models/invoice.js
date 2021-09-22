import db from "../db.js";
import ExpressError from "../expressError.js";

class Invoice {
    static async getAll() {
        const result = await db.query(
            `SELECT id, comp_code, amt, paid, add_date, paid_date
            FROM invoices`
        );
        return result.rows;
    }
    static async checkId(id) {
        const result = await db.query(
            `SELECT id, comp_code, amt, paid, add_date, paid_date
            FROM invoices WHERE id = $1`,
            [id]
        );
        if (!result.rows.length)
            throw new ExpressError(404, `No invoice found with id "${id}"`);
        return result.rows[0];
    }
    static async postNew({comp_code, amt}) {
        const result = await db.query(
            `INSERT INTO invoices
            (comp_code, amt)
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );
        return result.rows[0];
    }
    static async putOne(id, {amt}) {
        await this.checkId(id);
        const result = await db.query(
            `UPDATE invoices SET amt = $2
            WHERE id = $1
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [id, amt]
        );
        return result.rows[0];
    }
    static async deleteOne(id) {
        await this.checkId(id);
        await db.query(
            `DELETE FROM invoices
            WHERE id = $1`,
            [id]
        );
        return "deleted";
    }
    static async getByCompany(comp_code) {
        const result = await db.query(
            `SELECT id, amt, paid, add_date, paid_date
            FROM invoices WHERE comp_code = $1`,
            [comp_code]
        );
        return result.rows;
    }
}

export default Invoice;
