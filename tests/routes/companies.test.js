process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

let company;

beforeEach(async () => {
    company = {code: "abc", name: "google", description: "a large company."};
    const {code, name, description} = company;
    await db.query(
        `INSERT INTO companies
            (code, name, description)
        VALUES
            ($1, $2, $3)`,
        [code, name, description]
    );
});

afterEach(async () => {
    await db.query(
        `DELETE FROM companies`
    );
});

afterAll(async () => {
    await db.end();
});

describe("get", () => {
    test("all companies", async () => {
        const resp = await request(app).get("/companies");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            companies: expect.arrayContaining([
                expect.objectContaining({
                    code: company.code,
                    name: company.name,
                    description: company.description
                })
            ])
        });
    });
    test("one by code", async () => {
        const resp = await request(app).get(`/companies/${company.code}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            company: expect.objectContaining({
                code: company.code,
                name: company.name,
                description: company.description,
                invoices: expect.any(Array)
            })
        });
    });
    test("by invalid code", async () => {
        const resp = await request(app).get(`/companies/akgjalk}`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("post", () => {
    test("create new", async () => {
        const comp = {name: "apple", description: "a sleek company."};
        const resp = await request(app).post(`/companies`).send(comp);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({
            company: expect.objectContaining({
                code: expect.any(String),
                name: comp.name,
                description: comp.description
            })
        });
    });
    test("create new without request body", async () => {
        const resp = await request(app).post(`/companies`);
        expect(resp.statusCode).toBe(500);
    });
});

describe("put", () => {
    test("replace details", async () => {
        const details = {name: "goggle", description: "a clone company."}
        const resp = await request(app).put(`/companies/${company.code}`).send(details);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            company: expect.objectContaining({
                code: company.code,
                name: details.name,
                description: details.description
            })
        });
    });
    test("replace details without request body", async () => {
        const resp = await request(app).put(`/companies/${company.code}`);
        expect(resp.statusCode).toBe(500);
    });
});

describe("delete", () => {
    test("remove one by code", async () => {
        const resp = await request(app).delete(`/companies/${company.code}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            status: "deleted"
        }));
    });
    test("remove one by invalid code", async () => {
        const resp = await request(app).delete(`/companies/asgjlakg`);
        expect(resp.statusCode).toBe(404);
    });
});
