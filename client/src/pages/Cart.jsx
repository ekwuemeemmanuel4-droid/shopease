import "./Cart.css";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>

                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h2>Total: ${cartTotal.toFixed(2)}</h2>
          

// inside your Cart component, near the total display:
<Link to="/checkout">
  <button className="checkout-btn">Proceed to Checkout</button>
</Link>
        </div>
      )}
    </div>
  );
}

export default Cart;
