const db = require("../db");
const ExpressError = require("../expressError");

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
    static async putOne(id, {amt, paid}) {
        const currentInvoice = await this.checkId(id);
        let paidDate = currentInvoice.paid_date;
        if (currentInvoice.paid !== paid) {
            paidDate = paid ? new Date(): null;
        }
        const result = await db.query(
            `UPDATE invoices SET amt = $2, paid = $3, paid_date = $4
            WHERE id = $1
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [id, amt, paid, paidDate]
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

module.exports = Invoice;
