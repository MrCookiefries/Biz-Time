const db = require("../db");
const ExpressError = require("../expressError");

class Industry {
    static async getAll() {
        const result = await db.query(
            `SELECT i.code, i.industry, ci.comp_code
            FROM industries i
            JOIN companies_industries ci ON ci.industry_code = i.code`
        );
        const industryCodes = new Set(result.rows.map(r => r.code));
        let data = [];
        for (const industryCode of industryCodes) {
            const industryObj = result.rows.find(r => r.code === industryCode);
            const {code, industry} = industryObj;
            const dataObj = {code, industry};
            dataObj.comp_codes = result.rows.filter(r => r.code === code).map(r => r.comp_code);
            data.push(dataObj);
        }
        return data;
    }
    static async postOne({code, industry}) {
        const result = await db.query(
            `INSERT INTO industries (code, industry)
            VALUES ($1, $2) RETURNING code, industry`,
            [code, industry]
        );
        return result.rows[0];
    }
    static async getByCompany(comp_code) {
        const result = await db.query(
            `SELECT i.industry
            FROM companies_industries ci
            JOIN industries i ON i.code = ci.industry_code
            WHERE ci.comp_code = $1`,
            [comp_code]
        );
        return result.rows;
    }
}

module.exports = Industry;
