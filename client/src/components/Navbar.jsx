import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="Navbar">
      <h1 className="navbar-logo">ShopEase</h1>
      <div className="navbar-links">
        <Link to="/">Home</Link>
         <Link to="/Shop">Shop</Link>
        <Link to="/cart">Cart</Link>
      </div>
    </nav>
  );
}

export default Navbar;