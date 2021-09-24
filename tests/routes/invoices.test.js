process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

const company = {code: "abc", name: "google", description: "a large company."};
let invoice;

beforeEach(async () => {
    const {code, name, description} = company;
    await db.query(
        `INSERT INTO companies
            (code, name, description)
        VALUES
            ($1, $2, $3)`,
        [code, name, description]
    );

    invoice = {comp_code: company.code, amt: 500};
    const {comp_code, amt} = invoice;
    const result = await db.query(
        `INSERT INTO invoices
            (comp_code, amt)
        VALUES
            ($1, $2)
        RETURNING id`,
        [comp_code, amt]
    );
    invoice.id = result.rows[0].id;
});

afterEach(async () => {
    await db.query(
        `DELETE FROM invoices`
    );
    await db.query(
        `DELETE FROM companies`
    );
});

afterAll(async () => {
    await db.end();
});

describe("get", () => {
    test("all", async () => {
        const resp = await request(app).get("/invoices");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            invoices: expect.arrayContaining([
                expect.objectContaining({
                    id: invoice.id,
                    comp_code: invoice.comp_code,
                    amt: invoice.amt,
                    add_date: expect.any(String),
                    paid: expect.any(Boolean),
                    paid_date: null
                })
            ])
        });
    });
    test("one by id", async () => {
        const resp = await request(app).get(`/invoices/${invoice.id}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            invoice: expect.objectContaining({
                id: invoice.id,
                amt: invoice.amt,
                add_date: expect.any(String),
                paid: expect.any(Boolean),
                paid_date: null,
                company: expect.any(Object)
            })
        });
    });
    test("one by invalid id", async () => {
        const resp = await request(app).get(`/invoices/0`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("post", () => {
    test("create new one", async () => {
        const inv = {comp_code: company.code, amt: 200};
        const resp = await request(app).post("/invoices").send(inv);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            invoice: expect.objectContaining({
                id: expect.any(Number),
                amt: inv.amt,
                add_date: expect.any(String),
                paid: expect.any(Boolean),
                paid_date: null,
                comp_code: inv.comp_code
            })
        });
    });
    test("create new one without request body", async () => {
        const resp = await request(app).post("/invoices");
        expect(resp.statusCode).toBe(500);
    });
});

describe("put", () => {
    test("replace one by id", async () => {
        const data = {amt: 100, paid: false};
        const resp = await request(app).put(`/invoices/${invoice.id}`).send(data);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            invoice: expect.objectContaining({
                id: invoice.id,
                amt: data.amt,
                add_date: expect.any(String),
                paid: expect.any(Boolean),
                paid_date: null,
                comp_code: invoice.comp_code
            })
        });
    });
    test("replace one by invalid id", async () => {
        const data = {amt: 100};
        const resp = await request(app).put(`/invoices/0`).send(data);
        expect(resp.statusCode).toBe(404);
    });
    test("replace one without request body", async () => {
        const resp = await request(app).put(`/invoices/${invoice.id}`);
        expect(resp.statusCode).toBe(500);
    });
});

describe("delete", () => {
    test("remove one by id", async () => {
        const resp = await request(app).delete(`/invoices/${invoice.id}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            status: "deleted"
        }));
    });
    test("remove one by invalid id", async () => {
        const resp = await request(app).delete(`/invoices/0`);
        expect(resp.statusCode).toBe(404);
    });
});
