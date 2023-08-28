// before useing faker, need to run:  npm install @faker-js/faker --save-dev
//  see fakedata options here:   https://fakerjs.dev/api/
// may also need this next line (varies based on other packaging you may have)
//import { faker } from "@faker-js/faker";

const { faker } = require("@faker-js/faker");

module.exports = {
  createFakeUserObject,
  createFakeFixedUser,
  createFakeFixedAdmUser,
  createFakeProductObject,
  createFakePurchasedOrderObject,
  createRecentDatestring,
  createFakeOrderDetailObject,
};

// currentDate in YYYY-MM-DD format
let currentDate = new Date().toISOString().slice(0, 10);

function createRecentDatestring() {
  let recentDate = faker.date.recent({ days: 10 }); // Date obj:  '2023-01-29T06:12:12.829Z'
  // return YYYY-MM-DD string
  return recentDate.toISOString().slice(0, 10);
}

function createFakeUserObject() {
  return {
    username: faker.person.firstName(),
    useremail: faker.internet.email(),
    password: "12345",
    isadmin: false,
  };
}

function createFakeFixedUser(curUser) {
  let retObj = { username: curUser };
  retObj.useremail = curUser + "@none.com";
  retObj.password = "12345";
  retObj.isadmin = false;
  return retObj;
}

function createFakeFixedAdmUser(curUser) {
  let retObj = { username: curUser + "adm" };
  retObj.useremail = curUser + "@none.com";
  retObj.password = "12345";
  retObj.isadmin = true;
  return retObj;
}

const bookCats = ["Hardback", "Paperback", "Audio"];

function createFakeProductObject(bookArray) {
  return {
    title: faker.commerce.productName(),
    author: faker.person.firstName() + " " + faker.person.lastName(),
    price: faker.number.float({ min: 1, max: 85, precision: 0.01 }),
    category: faker.helpers.arrayElement(bookArray),
    format: faker.helpers.arrayElement(bookCats),
    overview: faker.lorem.paragraph({ min: 1, max: 3 }),
    isactive: true,
    qtyavailable: faker.number.int({ min: 1, max: 55 }),
    imageurl: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
  };
}

function createFakeOrderDetailObject(ordId, prodAry) {
  // ordId = a valid order id, prodAry = array of all active product ids
  return {
    orderid: ordId,
    productid: faker.helpers.arrayElement(prodAry),
    quantity: faker.number.int({ min: 1, max: 5 }),
    itemprice: faker.number.float({ min: 1, max: 85, precision: 0.01 }),
  };
}

function createFakePurchasedOrderObject(userId) {
  userId = parseInt(userId);
  return {
    userid: userId,
    status: "PURCHASED",
    lastupdate: createRecentDatestring(),
  };
}

//console.log("createFakeUserObject : ", createFakeUserObject());
