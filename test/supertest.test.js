const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing de user user", function () {
  describe("Test de user login", function () {
    this.timeout(5000);
    // it("El endpoint de Post sesion/login debe verificar si es posible permitir el login del usuario", async () => {
    //   const userMock = {
    //     username: "fanta",
    //     password: "pass1234",
    //   };

    //   const { statusCode, _body, ok } = await requester
    //     .post("/session/login")
    //     .send(userMock);

    // });
    it("Test de user register", async () => {
      this.timeout(5000);
      const userMock = {
        firstname: "Ariel",
        lastname: "Curea",
        username: "matata21",
        email: "sadhg@gmail.com",
        password: "pass1234",
        address: "su casa 1234",
      };

      const result = await requester.post("/session/register").send(userMock);
    });
  });
});
