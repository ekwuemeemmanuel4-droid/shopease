import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(`${API_URL}/api/products`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load products.");
        return response.json();
      })
      .then((data) => {
        const products = Array.isArray(data) ? data : data?.products || [];
        const found = products.find(
          (item) => String(item._id || item.id) === String(id)
        );

        if (active) {
          setProduct(found || null);
          if (!found) setError("We couldn’t find that product.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        if (active) setError("Product details couldn’t be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, id: product._id || product.id });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <p className="product-details-message">Loading product…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">
          <h1>{error || "Product not found"}</h1>
          <Link to="/Shop">Back to shop <span aria-hidden="true">→</span></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        <Link className="product-back-link" to="/Shop">
          <span aria-hidden="true">←</span> Back to shop
        </Link>

        <section className="product-details-layout">
          <div className="product-details-image">
            {product.image ? (
              <img src={product.image} alt={product.name || "Product"} />
            ) : (
              <span>Image unavailable</span>
            )}
          </div>

          <div className="product-details-info">
            <span className="product-details-eyebrow">A good find</span>
            <h1>{product.name || "Product"}</h1>
            <p className="product-details-price">
              ${Number(product.price || 0).toFixed(2)}
            </p>

            <div className="product-details-divider" />

            <p className="product-details-description">
              {product.description || "A thoughtful find for your everyday collection."}
            </p>

            <button
              className="product-details-add"
              type="button"
              onClick={handleAddToCart}
            >
              {added ? "Added to cart ✓" : "Add to cart"}
              {!added && <span aria-hidden="true">→</span>}
            </button>

            <p className="product-details-note">
              Easy online shopping · Find more favorites in our shop
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetails;