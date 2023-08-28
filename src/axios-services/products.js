export async function fetchAllProducts() {
    try {
      const response = await fetch('http://localhost:4000/api/products/allproduct');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

export async function fetchSingleProduct(id) {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

export async function createProduct(productData) {
    try {
      const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  export async function editProduct(id, updatedProductData) {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  export async function isActiveToFalse(id) {
    try {
      const response = await fetch(`http://localhost:4000/api/products/delete/${id}`, {
        method: 'PATCH',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deactivating product:', error);
      throw error;
    }
  }
  
  export async function isActivateToTrue(id) {
    try {
      const response = await fetch(`http://localhost:4000/api/products/activate/${id}`, {
        method: 'PATCH',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error activating product:', error);
      throw error;
    }
  }