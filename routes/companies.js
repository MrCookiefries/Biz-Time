const express = require("express");
const router = new express.Router();
const Company = require("../models/company");
const Invoice = require("../models/invoice");
const Industry = require("../models/industry");

router.get("/", async (req, res, next) => {
    try {
        const companies = await Company.getAll();
        return res.status(200).json({companies});
    } catch (err) {
        return next(err);
    }
});

router.get("/:code", async (req, res, next) => {
    try {
        const company = await Company.checkCode(req.params.code);
        const invoices = await Invoice.getByCompany(company.code);
        const industries = await Industry.getByCompany(company.code);
        company.invoices = invoices;
        company.industries = industries;
        return res.status(200).json({company});
    } catch (err) {
        return next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const company = await Company.postNew(req.body);
        return res.status(201).json({company});
    } catch (err) {
        return next(err);
    }
});

router.put("/:code", async (req, res, next) => {
    try {
        const company = await Company.putOne(req.params.code, req.body);
        return res.status(200).json({company});
    } catch (err) {
        return next(err);
    }
});

router.delete("/:code", async (req, res, next) => {
    try {
        const status = await Company.deleteOne(req.params.code);
        return res.status(200).json({status});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
