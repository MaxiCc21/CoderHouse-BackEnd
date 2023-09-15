const mongoose = require("mongoose");
const UserDao = require("../src/dao/MongoManager/UserManager");
const Assert = require("assert");
require("dotenv").config();

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
    this.timeout(200);
  });
  //   it("El dao debe traer un usuario correctametne del la DB", async function () {
  //     const result = await this.userDao.getAllUser();
  //     assert.strictEqual(Array.isArray(result), true);
  //     done();
  //   });
  it("El dao debe crear un usuario correctametne del la DB", async function () {
    const result = await this.userDao.createNewUser(userMock);

    const user = await this.userDao.getUserByEmail(userMock.email);

    assert.strictEqual(typeof user, "object");
    done();
  });
});
