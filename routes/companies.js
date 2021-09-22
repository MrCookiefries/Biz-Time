import express from "express";
const router = new express.Router();
import Company from "../models/company.js";
import Invoice from "../models/invoice.js";

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
        company.invoices = invoices;
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

export default router;
