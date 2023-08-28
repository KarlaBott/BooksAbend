console.log("Entered init_db : ", Date.now());
const {
  client,
  // declare your model imports here
  // for example, User
} = require("./");

const {
  createUser,
  createProduct,
  createOrder,
  createOrderDetailItem,
  getAllNonAdminUsers,
  getUserByUsername,
  getUser,
  getAllActiveProducts,
  getAllOrders,
  getAllOrdersByUser,
} = require("../db/models");

const {
  createFakeUserObject,
  createFakeFixedUser,
  createFakeFixedAdmUser,
  createFakeProductObject,
  createFakePurchasedOrderObject,
  createFakeOrderDetailObject,
} = require("./FakerData");

const bookGenres = [
  "Action and Adventure",
  "Art and Photography",
  "Autobiography and Memoir",
  "Biography",
  "Business and Money",
  "Childrens",
  "Cooking",
  "Crafts and Hobbies",
  "Dystopian",
  "Education and Teaching",
  "Family and Relationships",
  "Fantasy",
  "Food and Drink",
  "Graphic Novel",
  "Health and Fitness",
  "Historical Fiction",
  "History",
  "Horror",
  "Humor and Entertainment",
  "Law and Criminology",
  "Magical Realism",
  "Motivational and Inspirational",
  "Mystery and Detective",
  "Politics and Social Science",
  "Religion and Spirituality",
  "Romance",
  "Science Fiction",
  "Self-Help and Personal Development",
  "Short Story",
  "Thriller and Suspense",
  "Travel",
  "True Crime",
  "Young Adult",
];

// currentDate in YYYY-MM-DD format
let currentDate = new Date().toISOString().slice(0, 10);

const testUserNames = ["baaji", "karla", "kaleb", "nash", "savstew"];

async function buildTables() {
  console.log("Entered buildTables : ", Date.now());
  console.time("buildTables");
  try {
    client.connect();
    // drop tables in correct order

    await client.query(`
    DROP TABLE IF EXISTS orderdetails;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS users;
    `);

    // build tables in correct order
    // USERS table
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        useremail VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        isadmin BOOLEAN DEFAULT false
        );
      `);

    // CATEGORIES table
    await client.query(`
      CREATE TABLE categories (categoryname VARCHAR(255) PRIMARY KEY);
    `);

    // PRODUCTS table
    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        isactive BOOLEAN DEFAULT true,
        qtyavailable INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        price DECIMAL(9,2) NOT NULL,
        category VARCHAR(255) NOT NULL REFERENCES categories(categoryname),
        format VARCHAR(255) NOT NULL,
        imageurl VARCHAR(255),
        overview VARCHAR(2000)
        );
      `);

    // ORDERS table
    await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        status VARCHAR(50) NOT NULL,
        userid INTEGER REFERENCES users(id),
        lastupdate DATE
       );
    `);

    // ORDERDETAILS table
    await client.query(`
        CREATE TABLE orderdetails (
          orderid INTEGER NOT NULL REFERENCES orders(id),
          productid INTEGER NOT NULL REFERENCES products(id),
          quantity INTEGER NOT NULL,
          itemprice DECIMAL(9,2) NOT NULL,
          PRIMARY KEY (orderid, productid)
         );
      `);
  } catch (error) {
    throw error;
  }
}

async function createCategories() {
  // fill categories table with the bookGenres list
  let strInsert = "INSERT INTO categories (categoryname) VALUES ";
  // build a string of values to insert from the array
  for (let i = 0; i < bookGenres.length; i++) {
    strInsert += "('" + bookGenres[i] + "'), ";
  }
  // trim off the last trailing command and space
  strInsert = strInsert.slice(0, -2);
  // add a final semi-colon to complete the SQL statement
  strInsert += ";";
  // strInsert:   "INSERT INTO categories (categoryname) VALUES ('Action and Adventure'), .. ('Young Adult');"
  await client.query(strInsert);
  console.log("CATEGORIES seeded");
}

async function createInitialUsers() {
  console.log("Entered createInitialUsers : ", Date.now());
  await createUser(createFakeFixedUser("guest99"));

  for (let i = 0; i < testUserNames.length; i++) {
    await createUser(createFakeFixedUser(testUserNames[i]));
    await createUser(createFakeFixedAdmUser(testUserNames[i]));
    // create fake non-admin users with random info
    await createUser(createFakeUserObject());
  }
  console.log("USERS table seeded");
}

async function createInitialProducts() {
  // create 80 active products
  for (let i = 0; i < 80; i++) {
    await createProduct(createFakeProductObject(bookGenres));
  }
  //create 5 inactive products
  for (let i = 0; i < 5; i++) {
    let newObj = createFakeProductObject(bookGenres);
    newObj.isactive = false;
    await createProduct(newObj);
  }
  console.log("PRODUCTS table seeded");
}

async function createInitialOrders() {
  // create a CURRENT order for each of the testUserNames
  for (let i = 0; i < testUserNames.length; i++) {
    let testObj = await getUserByUsername(testUserNames[i]);
    let newObj = { userid: testObj.id };
    // for createOrder, the default status is 'CURRENT' and default lastupdate is current date
    await createOrder(newObj);
  }
  // get an array of all the NonAdmin users
  let userAry = await getAllNonAdminUsers();
  let uids = userAry.map((item) => item.id);
  for (let i = 0; i < uids.length; i++) {
    // for each userid, create 2 PURCHASED orders
    for (let j = 0; j < 2; j++) {
      await createOrder(createFakePurchasedOrderObject(uids[i]));
    }
  }
  console.log("ORDERS table seeded");
}

async function createInitialOrderDetails() {
  let orderAry = await getAllOrders();
  // create an array of just the order ids
  let orderids = orderAry.map((item) => item.id);
  let prodAry = await getAllActiveProducts();
  // create an array of just the product ids
  let productsids = prodAry.map((item) => item.id);
  for (let i = 0; i < orderids.length; i++) {
    // for each order, create 3 product detail records
    for (let j = 0; j < 3; j++) {
      await createOrderDetailItem(
        createFakeOrderDetailObject(orderids[i], productsids)
      );
    }
  }
  console.log("ORDERDETAILS table seeded");
}

async function populateInitialData() {
  try {
    // create initial data
    await createInitialUsers();
    await createCategories();
    await createInitialProducts();
    await createInitialOrders();
    await createInitialOrderDetails();
    // uncomment any specific line item below that you want to test/see the result for
    // -----------------------------------------------------------------
    // console.log("getAllNonAdminUsers:", await getAllNonAdminUsers());
    // console.log("getUseridByUsername:", await getUseridByUsername("karla"));
    // console.log(
    //   "getUser:",
    //   await getUser({ username: "karla", password: "12345" })
    // );
    // console.log(
    //   "getAllOrdersByUser:",
    //   await getAllOrdersByUser({ username: "karla" })
    // );

    console.log("populateInitialData COMPLETE : ", Date.now());
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
