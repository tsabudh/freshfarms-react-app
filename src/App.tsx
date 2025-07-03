import React, { lazy, Suspense, useState } from "react";
import { Route, Routes } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

import AdminProfile from "./components/AdminProfile/AdminProfile";
import ChatPanel from "./components/ChatPanel/ChatPanel";
import Customer from "./components/Customer/Customer";
import CustomerPanel from "./components/CustomerPanel/CustomerPanel";

import ErrorBoundary from "./components/ErrorBoundary";
import InventoryPanel from "./components/InventoryPanel/InventoryPanel";
import Notifier from "./components/Notifier/Notifier";
import OverviewPanel from "./components/OverviewPanel/OverviewPanel";
import ProductManage from "./components/ProductPanel/ProductManage";
import ProductPanel from "./components/ProductPanel/ProductPanel";
import TransactionPanel from "./components/TransactionPanel/TransactionPanel";
import { AuthContext } from "./context/AuthContext";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard/Dashboard";
import ContactPage from "./pages/Home/ContactPage";
import Home from "./pages/Home/Home";
import LandingPage from "./pages/Home/LandingPage";
import LoginPage from "./pages/Home/LoginPage";
import StorePage from "./pages/Home/StorePage";
import OAuthPopup from "./pages/OAuthPopup";
import { getUserFromLocalStorage } from "./utils/localStorageUtils";

const LazyCustomerRegistry = lazy(
  () => import("./components/CustomerRegistry/CustomerRegistry")
);
const LazyCustomer = lazy(() => import("./components/Customer/Customer"));

function App() {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwtToken"));
  const [user, setUser] = useState(getUserFromLocalStorage());
   const userRole = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        jwtToken,
        setJwtToken,
        user,
        setUser,
        userRole,
      }}
    >
      <Notifier />
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/oauth-popup" element={<OAuthPopup />} />

        <Route path="/" element={<Home />}>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route
            index
            element={
              <ErrorBoundary>
                <OverviewPanel />
              </ErrorBoundary>
            }
          />
          <Route path="customers">
            <Route index element={<CustomerPanel />} />
            <Route
              path=":id"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyCustomer />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyCustomerRegistry />
                </Suspense>
              }
            />
          </Route>
          <Route path="products">
            <Route index element={<ProductPanel />} />
            <Route path="manage" element={<ProductManage />} />
            <Route path="inventory" element={<InventoryPanel />} />
          </Route>
          <Route path="transactions">
            <Route index element={<TransactionPanel />} />
          </Route>
          <Route path="chat" element={<ChatPanel />} />
          <Route
            path="profile"
            element={
              userRole == "admin" ? (
                <AdminProfile />
              ) : userRole == "customer" ? (
                <Customer customerId={user._id} />
              ) : null
            }
          />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
