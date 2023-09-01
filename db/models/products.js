// file:  DB/PRODUCTS.JS

// grab our db client connection to use with our adapters
const client = require("../client");

// add your database adapter fns here
module.exports = {
  createProduct,
  getAllCategories,
  getAllProducts,
  getProductsById,
  getAllActiveProducts,
  updateProduct,
  deactivateProduct,
  activateProduct,
};

async function createProduct({
  title,
  author,
  price,
  category,
  format,
  overview,
  isactive,
  qtyavailable,
  imageurl,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      INSERT INTO products (isactive, qtyavailable, title, author, price, category, format, imageurl, overview) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *;
    `,
      [
        isactive,
        qtyavailable,
        title,
        author,
        price,
        category,
        format,
        imageurl,
        overview,
      ]
    );

    return product;
  } catch (error) {
    throw error;
  }
}

// return an array of ALL  products, for Admin view/use
async function getAllProducts() {
  try {
    const { rows: products } = await client.query(
      `SELECT * FROM products ORDER BY title ASC;`
    );
    return products;
  } catch (error) {
    throw error;
  }
}

// return an array of ACTIVE products (isactive=true), for customer view
async function getAllActiveProducts() {
  try {
    const { rows: products } = await client.query(
      `SELECT * FROM products WHERE isactive=TRUE
       ORDER BY title ASC;`
    );

    return products;
  } catch (error) {
    throw error;
  }
}

// return an array categorynames
async function getAllCategories() {
  try {
    const { rows: categories } = await client.query(
      `SELECT * FROM categories
       ORDER BY categoryname ASC;`
    );

    return categories;
  } catch (error) {
    throw error;
  }
}

// This function select and return the product matches to the id
async function getProductsById(id) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
    SELECT * FROM products
    WHERE id = $1
    `,
      [id]
    );
    return product || null;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(id, updates) {
  try {
    const fieldsToBeUpdated = [
      "title",
      "author",
      "price",
      "category",
      "format",
      "overview",
      "isactive",
      "qtyavailable",
      "imageurl",
    ];

    const updateFields = [];
    const values = [id];

    fieldsToBeUpdated.forEach((field) => {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${values.length + 1}`);
        values.push(updates[field]);
      }
    });

    if (updateFields.length === 0) {
      throw new Error("No update being made.");
    }

    const {
      rows: [product],
    } = await client.query(
      `
    UPDATE products
    SET ${updateFields.join(", ")}
    WHERE id = $1
    RETURNING *;
  `,
      values
    );
    return product;
  } catch (error) {
    throw error;
  }
}

async function deactivateProduct(id) {
  try {
    const updates = {
      isactive: false,
    };

    const updatedProduct = await updateProduct(id, updates);
    return updatedProduct;
  } catch (error) {
    throw error;
  }
}

async function activateProduct(id) {
  try {
    const updates = {
      isactive: true,
    };

    const updatedProduct = await updateProduct(id, updates);
    return updatedProduct;
  } catch (error) {
    throw error;
  }
}
