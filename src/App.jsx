import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import TransactionPane from './components/TransactionPane/TransactionPane';
import CustomerPane from './components/CustomerPane/CustomerPane';
import StatementPane from './components/StatementPane/StatementPane';
import InventoryPane from './components/InventoryPane/InventoryPane';
import OverviewPane from './components/OverviewPane/OverviewPane';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />}>
                    <Route path="" element={<OverviewPane />} />
                    <Route path="customers" element={<CustomerPane />} />
                    <Route path="transactions" element={<TransactionPane />} />
                    <Route path="statements" element={<StatementPane />} />
                    <Route path="inventory" element={<InventoryPane />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
