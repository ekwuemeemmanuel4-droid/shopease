import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Shop.css';
import { API_URL } from "../config";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="shop">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shop">
        <h2>Product not found</h2>
        <Link to="/shop">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="shop">
      <div className="product-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <img src={product.image} alt={product.name} className="product-image" />
        <h2>{product.name}</h2>
        <p className="product-price">${product.price}</p>
        <button
          className="add-to-cart-btn"
          onClick={() => addToCart({ ...product, id: product._id })}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;