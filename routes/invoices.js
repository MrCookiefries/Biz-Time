const express = require("express");
const router = new express.Router();
const Invoice = require("../models/invoice");
const Company = require("../models/company");

router.get("/", async (req, res, next) => {
    try {
        const invoices = await Invoice.getAll();
        return res.status(200).json({invoices});
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const invoice = await Invoice.checkId(req.params.id);
        const company = await Company.checkCode(invoice.comp_code);
        delete invoice.comp_code;
        invoice.company = company;
        return res.status(200).json({invoice});
    } catch (err) {
        return next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const invoice = await Invoice.postNew(req.body);
        return res.status(201).json({invoice});
    } catch (err) {
        return next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const invoice = await Invoice.putOne(req.params.id, req.body);
        return res.status(200).json({invoice});
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const status = await Invoice.deleteOne(req.params.id);
        return res.status(200).json({status});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
