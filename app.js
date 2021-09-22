/** BizTime express application. */

import express from "express";
import ExpressError from "./expressError.js";

const app = express();
app.use(express.json());

import companyRoutes from "./routes/companies.js";
app.use("/companies", companyRoutes);

import invoiceRoutes from "./routes/invoices.js";
app.use("/invoices", invoiceRoutes);

/** 404 handler */
app.use((req, res, next) => {
	const err = new ExpressError(404, "Not Found");
	return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
	res.status(err.status || 500);

	return res.json({
		message: err.message,
		error: err
	});
});

export default app;
