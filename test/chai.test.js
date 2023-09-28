const mongoose = require("mongoose");
const UserDao = require("../src/dao/MongoManager/UserManager");
const Assert = require("assert");
require("dotenv").config();
const chai = require("chai");

mongoose.connect(process.env.MONGO_URL_DB);

const expect = chai.expect;

describe("Set de test User en chai", () => {
  before(function () {
    this.userDao = new UserDao();
  });
  beforeEach(function () {
    // mongoose.connect.collections.MercadoLibre.users.drop();
    this.timeout(5000);
  });
  it("el dao debe poder obtener todos los usuarioen un arreglo", async () => {
    this.timeout(5000);
    const result = await this.userDao.getAllUser();

    expect(result).to.be.deep.equal([]);
  });
});
