const express = require("express");
const router = new express.Router();
const Industry = require("../models/industry");
const Company = require("../models/company");
const db = require("../db");

router.get("/", async (req, res, next) => {
    try {
        const industries = await Industry.getAll();
        return res.status(200).json({industries});
    } catch (err) {
        return next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const industry = await Industry.postOne(req.body);
        return res.status(201).json({industry});
    } catch (err) {
        return next(err);
    }
});

router.post("/companies", async (req, res, next) => {
    try {
        const {comp_code, industry_code} = req.body;
        const result = await db.query(
            `INSERT INTO companies_industries (comp_code, industry_code)
            VALUES ($1, $2) RETURNING comp_code, industry_code`,
            [comp_code, industry_code]
        );
        return res.status(201).json(result.rows[0]);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
