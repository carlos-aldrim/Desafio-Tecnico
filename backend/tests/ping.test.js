import request from "supertest";
import { buildApp } from "../src/app";

describe("Ping route", () => {
  let app;

  beforeAll(async () => {
    app = await buildApp({ isTest: true });
  });  

  test("GET /ping should return { pong: true }", async () => {
    const res = await request(app.server).get("/ping");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ pong: true });
  });
});
