const mongoose = require("mongoose");
const UserDao = require("../src/dao/MongoManager/UserManager");
const Assert = require("assert");
require("dotenv").config();
const chai = require("chai");
const expect = chai.expect;

mongoose.connect(process.env.MONGO_URL_DB);

const assert = Assert.strict;

const userMock = {
  first_name: "Fede",
  last_name: "Rodriguez",
  email: "prueba@gmail.com",
  password: "pass1234",
  address: "su casa 123",
};

describe("testing de User Dao", () => {
  before(function () {
    this.userDao = new UserDao();
  });
  beforeEach(function () {
    // mongoose.connect.collections.MercadoLibre.users.drop();
    this.timeout(5000);
  });
  it("El dao debe traer un usuario correctametne del la DB", async function () {
    this.timeout(5000);
    const result = await this.userDao.getAllUser();
    expect(result).to.be.an("array");
  });
  it("El dao debe crear un usuario correctametne del la DB", async function () {
    this.timeout(5000);
    const result = await this.userDao.createNewUser(userMock);

    expect(result).to.have.property("ok").to.equal(true);
  });
});
