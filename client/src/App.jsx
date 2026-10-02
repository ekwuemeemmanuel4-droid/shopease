import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import "./App.css";
import Cart from "./pages/Cart";
import { CartProvider } from "./context/CartContext";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import OrderSuccess from "./OrderSucess";





function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
           <Route path="/Login" element={<Login />} />
           <Route path="/order-success" element={<OrderSuccess />} />
         
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
