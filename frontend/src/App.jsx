import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Parts from './pages/Parts';
import Tools from './pages/Tools';
import InOut from './pages/InOut';
import Search from './pages/Search';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="parts" element={<Parts />} />
        <Route path="tools" element={<Tools />} />
        <Route path="inout" element={<InOut />} />
        <Route path="search" element={<Search />} />
        <Route path="reports" element={
          <ProtectedRoute adminOnly={true}>
            <Reports />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;
