/** BizTime express application. */

const express = require("express");
const ExpressError = require("./expressError");

const app = express();
app.use(express.json());

const companyRoutes = require("./routes/companies");
app.use("/companies", companyRoutes);

const invoiceRoutes = require("./routes/invoices");
app.use("/invoices", invoiceRoutes);

const industryRoutes = require("./routes/industries");
app.use("/industries", industryRoutes);

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

module.exports = app;
