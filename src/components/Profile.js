import React, { useState, useEffect } from "react";
import "../style/Profile.css";
import { fetchAllUsers } from "../axios-services/users";
import { createProduct } from "../axios-services/products";
import Modal from "./Modal";
import { Link } from "react-router-dom";
import userImg from "../Images/userimg.jpeg";

const Profile = ({ isLoggedIn, categoryNames }) => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isPostSubmitted, setIsPostSubmitted] = useState(false);
  const [users, setUsers] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [productData, setProductData] = useState({
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

  // Modal for SeeAllUsers
  const openUserModal = () => {
    setIsUserModalOpen(true);
  };
  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  // Modal for CreateNewProduct
  const openNewPostModal = () => {
    setIsNewPostModalOpen(true);
  };
  const closeNewPostModal = () => {
    setIsNewPostModalOpen(false);
  };
  //All user table
  const renderUserTable = () => (
    <table>
      <thead>
        <tr>
          <th>User ID</th>
          <th>Username</th>
          <th>Email Address</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.useremail}</td>
            <td>{user.isadmin ? "Admin" : "Member"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  useEffect(() => {
    getUsers();
  }, []);

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
      console.error("ERROR: Profile > fetchAllUsers: ", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="offline-message">
        <p>Please log in to access your profile.</p>
      </div>
    );
  }
  //CreatePost HandleSubmit
  const createPostHandleSubmit = async (event) => {
    event.preventDefault();

    try {
      const createdProduct = await createProduct(productData);
      // console.log("Product created:", createdProduct);

      setProductData({
        title: "",
        author: "",
        price: "",
        category: "",
        format: "",
        overview: "",
        isactive: false,
        qtyavailable: "",
        imageurl: "",
      });
      setIsPostSubmitted(true);
    } catch (error) {
      console.error("ERROR: Profile > createPostHandleSubmit", error);
    }
  };

  const createPostHandleInputChange = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === "checkbox" ? event.target.checked : value;

    setProductData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };
  //New Product form
  const NewPostForm = (
    <form onSubmit={createPostHandleSubmit} className="modal-form">
      <label className="form-label">Title:</label>
      <input
        className="form-input"
        type="text"
        name="title"
        value={productData.title}
        onChange={createPostHandleInputChange}
      />
      <br />
      <label className="form-label">Author:</label>
      <input
        className="form-input"
        type="text"
        name="author"
        value={productData.author}
        onChange={createPostHandleInputChange}
      />
      <br />
      <label className="form-label">Price:</label>
      <input
        className="form-input"
        type="number"
        name="price"
        value={productData.price}
        onChange={createPostHandleInputChange}
      />
      <br />
      <label className="form-label">Category:</label>
      <select
        className="form-select"
        name="category"
        value={productData.category}
        onChange={createPostHandleInputChange}
      >
        <option value="">Select a category</option>
        {categoryNames.map((item, idx) => (
          <option key={idx} value={item.categoryname}>
            {item.categoryname}
          </option>
        ))}
      </select>
      <br />
      <label className="form-label">Format:</label>
      <input
        className="form-input"
        type="text"
        name="format"
        value={productData.format}
        onChange={createPostHandleInputChange}
      />
      <br />
      <label className="form-label">Overview:</label>
      <input
        className="form-input"
        type="text"
        name="overview"
        value={productData.overview}
        onChange={createPostHandleInputChange}
      />
      <br />
      <label className="form-label">Availability:</label>
      <input
        className="form-input"
        type="checkbox"
        name="isactive"
        value={productData.isactive}
        onChange={createPostHandleInputChange}
      />
      <br />
      <label className="form-label">Quantity:</label>
      <input
        className="form-input"
        type="number"
        name="qtyavailable"
        value={productData.qtyavailable}
        onChange={createPostHandleInputChange}
      />
      <br />
      <label className="form-label">Image URL:</label>
      <input
        className="form-input"
        type="text"
        name="imgurl"
        value={productData.imageurl}
        onChange={createPostHandleInputChange}
      />
      <br />
      <button type="submit" className="profile-button">
        Create Product
      </button>
    </form>
  );

  return (
    <div className="profile">
      <div className="left-profile">
        <h1>My Profile</h1>

        <div className="profile-info">
          <img src={userImg} alt="Profile" width="100%" />
          <div id="profDetails">
            <h1 className="profile-username">
              Username: {profileData.username}
            </h1>
            <p className="profile-email">
              Email address: {profileData.useremail}
            </p>
            <p className="profile-status">
              Status: {profileData.isadmin ? "Admin" : "Member"}
            </p>
          </div>
        </div>
      </div>

      <div className="right-profile">
        {profileData.isadmin ? (
          <section className="admin-profile">
            <h1 className="admin-title">Site Administration</h1>
            <h4 onClick={openUserModal}>All User Information</h4>
            {isUserModalOpen && (
              <Modal title="All Users" closeModal={closeUserModal}>
                {renderUserTable()}
              </Modal>
            )}
            <section>
              <Link to="/adminproducts" className="all-products-link">
                <h4 className="all-product">All Products</h4>
              </Link>
              <h4 onClick={openNewPostModal}>Create new Product</h4>
              {isNewPostModalOpen && (
                <Modal title="Create New Post" closeModal={closeNewPostModal}>
                  {isPostSubmitted ? (
                    <div>
                      <p>Post has been successfully created!</p>
                      <br />
                    </div>
                  ) : (
                    NewPostForm
                  )}
                </Modal>
              )}
            </section>
          </section>
        ) : (
          <section>
            <Link className="link" id="cardButtons" to="/orderhistory">
              View Order History
            </Link>
          </section>
        )}
      </div>
    </div>
  );
};

export default Profile;
