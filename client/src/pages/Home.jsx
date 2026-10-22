import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";
import "./Home.css";

function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch(`${API_URL}/api/products`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load products");
        return response.json();
      })
      .then((data) => {
        if (active) setProducts(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        if (active) setError("Products couldn’t be loaded. Please try again later.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

  return (
    <main className="home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="home-eyebrow">A fresh find for every day</span>
          <h1>Find your<br />new favorite.</h1>
          <p>
            Discover thoughtful finds and everyday essentials in one easy shop.
          </p>
          <Link className="home-button" to="/Shop">
            Shop the collection <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="home-hero-image">
          {products[0]?.image ? (
            <img
              src={products[0].image}
              alt={products[0].name || "Featured product"}
            />
          ) : (
            <div className="home-image-placeholder" aria-hidden="true">
              <span>THE GOOD FINDS</span>
            </div>
          )}
          <span className="home-image-badge">GOOD<br />FINDS</span>
        </div>
      </section>

      <section className="home-perks" aria-label="Shopping highlights">
        <span>♡ Carefully picked products</span>
        <span>✦ New things to discover</span>
        <span>↗ Easy online shopping</span>
      </section>

      <section className="home-products">
        <div className="home-section-heading">
          <div>
            <span className="home-eyebrow">A few favorites</span>
            <h2>Our products</h2>
          </div>
          <Link to="/Shop" className="home-view-all">
            View all products <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <p className="home-message">Loading products...</p>
        ) : error ? (
          <p className="home-message" role="alert">{error}</p>
        ) : products.length === 0 ? (
          <p className="home-message">No products available right now.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const productId = product._id || product.id;

              return (
                <article className="product-card" key={productId}>
                  <Link
                    className="product-image-link"
                    to={`/product/${productId}`}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name || "Product"}
                        className="product-image"
                        loading="lazy"
                      />
                    ) : (
                      <span className="product-image-placeholder">
                        Image unavailable
                      </span>
                    )}
                    <span className="product-view-link">View product ↗</span>
                  </Link>

                  <div className="product-info">
                    <div>
                      <Link
                        className="product-name"
                        to={`/product/${productId}`}
                      >
                        {product.name || "Product"}
                      </Link>
                      <p className="product-price">{formatPrice(product.price)}</p>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      type="button"
                      onClick={() =>
                        addToCart({ ...product, id: productId })
                      }
                      aria-label={`Add ${product.name || "product"} to cart`}
                    >
                      +
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="home-shop-banner">
        <div>
          <span className="home-eyebrow">Something good is waiting</span>
          <h2>Make room for a new favorite.</h2>
        </div>
        <Link className="home-button" to="/Shop">
          Explore the shop <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}

export default Home;