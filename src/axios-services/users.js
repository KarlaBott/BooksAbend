import axios from "axios";

export async function signup(username, password, email) {
  try {
    const { data } = await axios.post("api/users/register", {
      username: username,
      password: password,
      useremail: email,
    });
    console.log("signupx", data);
    if (data.user)
      sessionStorage.setItem("BWUSERID", parseInt(data.user.userid));
    return data;
  } catch (e) {
    console.log(e);
  }
}

export async function login(username, password) {
  try {
    const { data } = await axios.post("api/users/login", {
      username: username,
      password: password,
    });
    console.log("login", data);
    if (data.user) sessionStorage.setItem("BWUSERID", parseInt(data.user.id));
    return data;
  } catch (e) {
    console.log(e);
  }
}
export async function fetchAllUsers() {
  try {
    const response = await fetch('http://localhost:4000/api/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

export async function fetchMyProfile() {
  try {
    const response = await fetch('http://localhost:4000/api/users/me');
    
    if (!response.ok) {
      const errorResponse = await response.text();
      console.error('Error response:', errorResponse);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching my profile:', error);
    throw error;
  }
}