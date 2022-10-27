const request = require("supertest");
const app = require("../../app"); //require app.js
const { loadPlanetsData } = require("../../models/planets.model");
const {
    mongoConnect,
    mongoDisconnect
} = require("../../services/mongo");
const {
  loadPlanetsData
} = require('../../models/planets.model');

describe("Launches API", () => {
    //setup test
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });
    afterAll(async () => {
        await mongoDisconnect();
    });
    
  //creating test fixture with different test cases
  describe("Test GET/launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        //supertest assertions
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST/launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "zoot",
    };
    //test #1
    test("It should respond with 201 created", async () => {
      const response = await request(app)
        //supertest assertions
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      //jest assertion
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    //test #2
    test("It should catch missing required properties", async () => {
      const response = await request(app)
        //supertest assertions
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);
      //jest assertion
      expect(response.body).toStrictEqual({
        error: "Missing required launch property", //see launches.controller.js
      });
    });
    //test #3
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        //supertest assertions
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      //jest assertion
      expect(response.body).toStrictEqual({
        error: "Invalid launch date", //see launches.controller.js
      });
    });
  });
});
