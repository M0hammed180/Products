import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Provider, useSelector } from "react-redux";
import reduxstore from "./Redux/reduxStore";
import "./App.css";
import Home from "./components/Home/Home";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import AddProduct from "./components/Admin/AddProduct/AddProduct";
import AddUser from "./components/Admin/AddUser/AddUser";
import Users from "./components/Admin/Users/Users";
import AdminProducts from "./components/Admin/AdminProducts/AdminProducts";
import Orders from "./components/Orders/Orders";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import EditProduct from "./components/Admin/EditProduct/EditProduct";
import EditUser from "./components/Admin/EditUser/EditUser";
import Cart from "./components/Cart/Cart";
import EditProfile from "./components/EditProfile/EditProfile";
import Favourites from "./components/Favourites/ Favourites";
import Products from "./components/Products/Products";
import ScrollToTop from "./components/Elements/ScrollToTop";
import Order from "./components/Order/Order";
import Breadcrumb from "./components/Elements/Breadcrumb";
import AdminOrders from "./components/Admin/Orders/Orders";
function AppContent() {
  const { role } = useSelector((state) => state.user);

  return (
    <div
      className="relative min-h-screen bg-gray-200 text-right dark:bg-black"
      dir="rtl"
      lang="ar"
    >
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        {role !== "admin" && <Breadcrumb />}
        <div className={role === "admin" ? "lg:mr-64" : ""}>
          <Routes>
            <Route
              path="/"
              element={role === "admin" ? <Dashboard /> : <Home />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/add_product" element={<AddProduct />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add_user" element={<AddUser />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products_admin" element={<AdminProducts />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin_orders" element={<AdminOrders />} />
            <Route path="/product_detail/:id" element={<ProductDetail />} />
            <Route path="/edit_product/:id" element={<EditProduct />} />
            <Route path="/edit_user/:id" element={<EditUser />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/edit_profile" element={<EditProfile />} />
            <Route path="/fav" element={<Favourites />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
        {/* {role !== "admin" && <Footer />} */}
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <Provider store={reduxstore}>
      <AppContent />
    </Provider>
  );
}

export default App;
