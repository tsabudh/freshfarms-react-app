import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Dashboard from './pages/Dashboard/Dashboard';
import RegisterPane from './components/RegisterPane/RegisterPane';

import './App.css';
import TicketPane from './components/TicketPane/TicketPane';
import CustomerPane from './components/CustomerPane/CustomerPane';
import StatementPane from './components/StatementPane/StatementPane';
import InventoryPane from './components/InventoryPane/InventoryPane';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />}>
                    <Route path="home" element={<RegisterPane />} />
                    <Route path="customers" element={<CustomerPane />} />
                    <Route path="transactions" element={<TicketPane />} />
                    <Route path="statements" element={<StatementPane />} />
                    <Route path="inventory" element={<InventoryPane />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
