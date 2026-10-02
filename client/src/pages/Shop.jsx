import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';
import { useCart } from '../context/CartContext';
import { API_URL } from "../config";

function Shop() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="shop"><p>Loading products...</p></div>;

  return (
    <div className="shop">
      <h2>Shop All Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <Link to={`/product/${product._id}`}>
             <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
            </Link>
            <p className="product-price">${product.price}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => addToCart({ ...product, id: product._id })}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;