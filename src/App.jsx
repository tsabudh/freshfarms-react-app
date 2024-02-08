import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard/Dashboard';
import TransactionPanel from './components/TransactionPanel/TransactionPanel';
import CustomerPanel from './components/CustomerPanel/CustomerPanel';
import StatementPanel from './components/StatementPanel/StatementPanel';
import InventoryPanel from './components/InventoryPanel/InventoryPanel';
import OverviewPanel from './components/OverviewPanel/OverviewPanel';
import './App.scss';
import CustomerAccount from './components/CustomerAccount/CustomerAccount';
import Customer from './components/Customer/Customer';
import Notifier from './components/Notifier/Notifier';
import Login from './pages/Login/Login';
import { AuthContext } from './context/AuthContext';
import ProductPanel from './components/ProductPanel/ProductPanel';
import ProductDetails from './components/ProductDetails/ProductDetails';
import AdminProfile from './components/AdminProfile/AdminProfile';
import Home from './pages/Home/Home';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        async function asyncWrapper() {
            let storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        }
        asyncWrapper();
    }, []);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            <BrowserRouter>
                <Notifier />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />}>
                        <Route path="" element={<OverviewPanel />} />
                        <Route path="customers">
                            <Route path="" element={<CustomerPanel />} />
                            <Route path=":id" element={<Customer />} />
                            <Route
                                path="manage"
                                element={<CustomerAccount />}
                            />
                        </Route>
                        <Route path="products">
                            <Route path="" element={<ProductPanel />} />
                            <Route
                                path="details"
                                element={<ProductDetails />}
                            />
                            <Route
                                path="inventory"
                                element={<InventoryPanel />}
                            />
                        </Route>
                        <Route path="transactions">
                            <Route path="" element={<TransactionPanel />} />

                            <Route
                                path="statements"
                                element={<StatementPanel />}
                            />
                        </Route>
                        <Route path="profile" element={<AdminProfile />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
