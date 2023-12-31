import React, { useState, useEffect } from "react";
import {
  fetchAllProducts,
  editProduct,
  isActiveToFalse,
  isActivateToTrue,
} from "../axios-services/products";
import Modal from "./Modal";
import "../style/Profile.css";
import { fetchAllUsers } from "../axios-services/users";

const AdminProducts = ({ isLoggedIn, categoryNames }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [users, setUsers] = useState([]);
  const [editedProduct, setEditedProduct] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    format: "",
    overview: "",
    isactive: true,
    qtyavailable: "",
    imageurl: "",
  });

  const bookFormats = ["Audio", "Hardback", "Paperback"];

  const handleEdit = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setSelectedProduct(productToEdit);
    setEditedProduct(productToEdit);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    setEditedProduct({
      title: "",
      author: "",
      price: "",
      category: "",
      format: "",
      overview: "",
      isactive: true,
      qtyavailable: "",
      imageurl: "",
    });
  };
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedProduct = await editProduct(
        selectedProduct.id,
        editedProduct
      );
      setIsEditModalOpen(false);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error("ERROR: AdminProducts > handleEditFormSubmit:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getProducts();
      getUsers();
    }
  }, [isLoggedIn]);

  const getProducts = async () => {
    try {
      const productData = await fetchAllProducts();
      setProducts(productData.products);
    } catch (error) {
      console.error("ERROR: AdminProducts > getProducts:", error);
    }
  };

  const getUsers = async () => {
    try {
      const userData = await fetchAllUsers();
      setUsers(userData.users);

      if (isLoggedIn) {
        const userId = sessionStorage.getItem("BWUSERID");
        const user = userData.users.find(
          (user) => user.id === parseInt(userId)
        );
        if (user) {
          setProfileData(user);
        }
      }
    } catch (error) {
      console.error("ERROR: AdminProducts > getUsers:", error);
    }
  };

  const handleDeactivateProduct = async (productId) => {
    try {
      await isActiveToFalse(productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("ERROR: AdminProducts > handleDeactivateProduct:", error);
    }
  };

  const handleReactivateProduct = async (productId) => {
    try {
      await isActivateToTrue(productId);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, isactive: true } : product
        )
      );
    } catch (error) {
      console.error("ERROR: AdminProducts >  handleReactivateProduct:", error);
    }
  };

  return (
    <>
      {isLoggedIn && profileData.isadmin ? (
        <section>
          <h1>All Products</h1>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Author</th>
                <th>Format</th>
                <th>Price</th>
                <th>QtyAvl</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{product.author}</td>
                  <td>{product.format}</td>
                  <td>${product.price}</td>
                  <td>{product.qtyavailable}</td>
                  <td>{product.isactive ? "Active" : "INACTIVE"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="profile-button"
                    >
                      Edit
                    </button>

                    {product.isactive ? (
                      <button
                        onClick={() => handleDeactivateProduct(product.id)}
                        className="profile-button"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivateProduct(product.id)}
                        className="profile-button"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isEditModalOpen && (
            <Modal title="Edit Product" closeModal={handleEditModalClose}>
              <form onSubmit={handleEditFormSubmit} className="modal-form ">
                <label className="form-label"> Title: </label>
                <input
                  className="form-input"
                  type="text"
                  name="title"
                  value={editedProduct.title}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      title: e.target.value,
                    })
                  }
                />
                <br />
                <label className="form-label">Author:</label>
                <input
                  className="form-input"
                  type="text"
                  name="author"
                  value={editedProduct.author}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      author: e.target.value,
                    })
                  }
                />
                <br />
                <label className="form-label">Price:</label>
                <input
                  className="form-input"
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      price: e.target.value,
                    })
                  }
                />
                <br />
                <label className="form-label">Category:</label>
                <select
                  className="form-select"
                  name="category"
                  value={editedProduct.category}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="">Select a Category</option>
                  {categoryNames.map((item, idx) => (
                    <option key={idx} value={item.categoryname}>
                      {item.categoryname}
                    </option>
                  ))}
                </select>
                <br />
                <label className="form-label">Format:</label>
                <select
                  className="form-select"
                  name="format"
                  value={editedProduct.format}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      format: e.target.value,
                    })
                  }
                >
                  <option value="">Select a Format</option>
                  {bookFormats.map((item, idx) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <br />
                <label className="form-label">Overview:</label>
                <input
                  className="form-input"
                  type="text"
                  name="overview"
                  value={editedProduct.overview}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      overview: e.target.value,
                    })
                  }
                />
                <br />
                <label className="form-label">Active:</label>
                <input
                  className="form-input"
                  type="checkbox"
                  name="isactive"
                  value={editedProduct.isactive}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      isactive: e.target.value,
                    })
                  }
                />
                <br />
                <label className="form-label">Quantity:</label>
                <input
                  className="form-input"
                  type="number"
                  name="qtyavailable"
                  value={editedProduct.qtyavailable}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      qtyavailable: e.target.value,
                    })
                  }
                />
                <br />
                <label className="form-label">Img Url:</label>
                <input
                  className="form-input"
                  type="text"
                  name="imageurl"
                  value={editedProduct.imageurl}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      imageurl: e.target.value,
                    })
                  }
                />
                <br />

                <button type="submit" className="profile-button">
                  Save Changes
                </button>
              </form>
            </Modal>
          )}
          ;
        </section>
      ) : (
        <div className="offline-message">
          <p>Admin products are only available to logged-in admins.</p>
        </div>
      )}
    </>
  );
};

export default AdminProducts;
