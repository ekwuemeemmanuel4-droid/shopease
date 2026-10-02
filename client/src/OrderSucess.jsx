import { Link } from 'react-router-dom';

function OrderSuccess() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Order placed successfully! 🎉</h2>
      <p>Thanks for your purchase.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default OrderSuccess;