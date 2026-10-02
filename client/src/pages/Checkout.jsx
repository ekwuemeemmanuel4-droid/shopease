import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../stripe';
import { useCart } from '../context/CartContext';
import './Checkout.css';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '' ,
    city: '',
    postalCode: '',
    country: '',
  

  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!stripe || !elements) return;
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Step 1: Create payment intent
      const intentRes = await fetch('http://localhost:5000/api/orders/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: cartTotal }),
      });

      const intentData = await intentRes.json();
      if (!intentRes.ok) throw new Error(intentData.message || 'Payment intent failed');

      const { clientSecret } = intentData;

      // Step 2: Confirm card payment with Stripe
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: shippingAddress.fullName },
        },
      });

      if (stripeError) throw new Error(stripeError.message);

      if (paymentIntent.status === 'succeeded') {
        // Step 3: Create the order in your database
        const orderRes = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              product: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            totalAmount: cartTotal,
            shippingAddress,
            paymentIntentId: paymentIntent.id,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.message || 'Order creation failed');

        clearCart();
        navigate('/order-success', { state: { order: orderData } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={shippingAddress.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={shippingAddress.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={shippingAddress.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
  <label>Postal Code</label>
  <input
    type="text"
    name="postalCode"
    value={shippingAddress.postalCode}
    onChange={handleChange}
    required
  />
</div>
<div className="form-group">
  <label>Country</label>
  <input
    type="text"
    name="country"
    value={shippingAddress.country}
    onChange={handleChange}
    required
  />
</div>

        <div className="form-group">
          <label>Card Details</label>
          <div className="card-element-wrapper">
            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          </div>
        </div>

        {error && <p className="checkout-error">{error}</p>}

        <div className="checkout-total">Total: ${cartTotal.toFixed(2)}</div>

        <button type="submit" disabled={!stripe || loading} className="checkout-btn">
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}