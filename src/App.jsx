import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './pages/Dashboard/Dashboard';
import TransactionPane from './components/TransactionPane/TransactionPane';
import CustomerPane from './components/CustomerPane/CustomerPane';
import StatementPane from './components/StatementPane/StatementPane';
import InventoryPane from './components/InventoryPane/InventoryPane';
import OverviewPane from './components/OverviewPane/OverviewPane';
import './App.css';
import CustomerAccount from './components/CustomerAccount/CustomerAccount';
import Customer from './components/Customer/Customer';
import Notifier from './components/Notifier/Notifier';

export const transactionContext = createContext([]);
function App() {
    return (
        <BrowserRouter>
            <Notifier/>
            <Routes>
                <Route path="/" element={<Dashboard />}>
                    <Route path="" element={<OverviewPane />} />

                    <Route path="customers">
                        <Route path="" element={<CustomerPane />} />
                        <Route path=":id" element={<Customer />} />
                        <Route path="account" element={<CustomerAccount />} />
                    </Route>

                    <Route path="transactions" element={<TransactionPane />} />
                    <Route path="statements" element={<StatementPane />} />
                    <Route path="inventory" element={<InventoryPane />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
