import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [editProduct, setEditProduct] = useState({ id: "", name: "", price: "" });

  // GET: all products
  useEffect(() => {
    axios.get("https://myfirstserver-kdha.onrender.com")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // POST: add new product
const addProduct = async () => {
  try {
    const response = await axios.post("https://myfirstserver-kdha.onrender.com/post", newProduct);
    setProducts([...products, response.data]);
    setNewProduct({ name: "", price: "" });
  } catch (error) {
    console.error("Error adding product:", error);
  }
};


  // PUT: update product
  const updateProduct = () => {
    axios.put(`https://myfirstserver-kdha.onrender.com/put/${editProduct.id}`, { name: editProduct.name, price: editProduct.price })
      .then(() => {
        setProducts(products.map(product => product.id === editProduct.id ? { ...product, name: editProduct.name, price: editProduct.price } : product));
        setEditProduct({ id: "", name: "", price: "" });
      })
      .catch((error) => console.error("Error updating product:", error));
  };

  // DELETE: delete product
  const deleteProduct = (id) => {
    axios.delete(`https://myfirstserver-kdha.onrender.com/delete/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id));
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  return (
    <div>
      <h1>Electronics Online Market</h1>

      {/* Add new product */}
      <div>
        <h2>Add Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <button onClick={addProduct}>Add Product</button>
      </div>

      {/* Edit product */}
      {editProduct.id && (
        <div>
          <h2>Edit Product</h2>
          <input
            type="text"
            placeholder="Product Name"
            value={editProduct.name}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product Price"
            value={editProduct.price}
            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
          />
          <button onClick={updateProduct}>Update Product</button>
        </div>
      )}

      {/* List of products */}
      <div>
        <h2>Product List</h2>
        {products.map((product) => (
          <div key={product.id}>
            <p>{product.name} - ${product.price}</p>
            <button onClick={() => setEditProduct(product)}>Edit</button>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
