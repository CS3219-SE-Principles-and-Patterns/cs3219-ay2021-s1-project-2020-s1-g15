import request from "supertest";
import server from "../../src/services/server";

const API_ENDPOINT = "/api/questions";

describe("GET request", () => {
  it("should return 200", async (done) => {
    const res = await request(server).get(API_ENDPOINT).send();

    expect(res.status).toEqual(200);
    //! make sure done is called at the end: https://github.com/visionmedia/supertest/issues/520#issuecomment-456340621
    done();
  });
});

describe("POST request", () => {
  it("should return 201", async (done) => {
    const res = await request(server).post(API_ENDPOINT).send();

    expect(res.status).toEqual(201);
    done();
  });
});

describe("PUT request", () => {
  it("should return 200", async (done) => {
    const ID = "not implemented";

    const res = await request(server).put(`${API_ENDPOINT}/${ID}`).send();

    expect(res.status).toEqual(200);
    done();
  });
});

describe("DELETE request", () => {
  it("should return 200", async (done) => {
    const ID = "not implemented";

    const res = await request(server).delete(`${API_ENDPOINT}/${ID}`).send();

    expect(res.status).toEqual(200);
    done();
  });
});
