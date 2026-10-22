import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";
import "./Shop.css";

function Shop() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    let active = true;

    fetch(`${API_URL}/api/products`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load products.");
        return response.json();
      })
      .then((data) => {
        if (active) setProducts(Array.isArray(data) ? data : []);
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

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) =>
      (product.name || "").toLowerCase().includes(search.trim().toLowerCase())
    );

    if (sort === "price-low") {
      return [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-high") {
      return [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return filtered;
  }, [products, search, sort]);

  const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

  return (
    <main className="shop-page">
      <section className="shop-intro">
        <span className="shop-eyebrow">The collection</span>
        <h1>Shop all products</h1>
        <p>Find something lovely for your everyday.</p>
      </section>

      <section className="shop-content" aria-label="Shop products">
        <div className="shop-toolbar">
          <p className="shop-count">
            {loading ? "Loading products…" : `${visibleProducts.length} products`}
          </p>

          <div className="shop-controls">
            <label className="shop-search">
              <span className="shop-visually-hidden">Search products</span>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search products"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label className="shop-sort">
              <span className="shop-visually-hidden">Sort products</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="shop-grid" aria-label="Loading products">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div className="shop-skeleton" key={item}>
                <div className="shop-skeleton-image" />
                <div className="shop-skeleton-line" />
                <div className="shop-skeleton-line shop-skeleton-short" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="shop-state" role="alert">{error}</div>
        ) : visibleProducts.length === 0 ? (
          <div className="shop-state">
            {search ? "No products match your search." : "No products are available right now."}
          </div>
        ) : (
          <div className="shop-grid">
            {visibleProducts.map((product) => {
              const id = product._id || product.id;

              return (
                <article className="shop-card" key={id}>
                  <Link
                    className="shop-card-image"
                    to={`/product/${id}`}
                    aria-label={`View ${product.name || "product"}`}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name || "Product"}
                        loading="lazy"
                      />
                    ) : (
                      <span className="shop-no-image">Image unavailable</span>
                    )}
                    <span className="shop-view-product">View product ↗</span>
                  </Link>

                  <div className="shop-card-info">
                    <div>
                      <Link className="shop-product-name" to={`/product/${id}`}>
                        {product.name || "Product"}
                      </Link>
                      <p className="shop-product-price">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      className="shop-add-button"
                      type="button"
                      onClick={() => addToCart({ ...product, id })}
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
    </main>
  );
}

export default Shop;