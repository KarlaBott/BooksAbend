export async function fetchAllProducts() {
  try {
    const response = await fetch("/api/products/allproduct");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("ERROR: axios > fetchAllProducts:", error);
    throw error;
  }
}

export async function fetchAllCategories() {
  try {
    const response = await fetch("/api/products/categories");
    const data = await response.json();
    // console.log("axios > fetchAllCategories > data:", data);
    return data;
  } catch (error) {
    console.error("ERROR: axios > fetchAllCategories:", error);
    throw error;
  }
}

export async function fetchSingleProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("ERROR: axios >  fetchSingleProduct:", error);
    throw error;
  }
}

export async function createProduct(productData) {
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("ERROR: axios > createProduct");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("ERROR: axios > createProduct:", error);
    throw error;
  }
}

export async function editProduct(id, updatedProductData) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProductData),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("ERROR: axios > editProduct:", error);
    throw error;
  }
}

export async function isActiveToFalse(id) {
  try {
    const response = await fetch(`/api/products/delete/${id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("ERROR: axios > isActiveToFalse:", error);
    throw error;
  }
}

export async function isActivateToTrue(id) {
  try {
    const response = await fetch(`/api/products/activate/${id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("ERROR: axios > isActiveToTrue:", error);
    throw error;
  }
}
