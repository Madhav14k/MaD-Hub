import React from 'react';
import { Routes, Route } from 'react-router-dom';


import Register from './pages/Register';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ProjectDetail from './pages/ProjectDetail';
import { isAuthenticated } from './utils/auth';


function PrivateRoute({ element }) {
  if (isAuthenticated()) return element;
  if (window.location.pathname === '/' || window.location.pathname === '/landing') return <Landing />;
  if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    window.location.href = '/login';
    return null;
  }
  return null;
}

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
  {/* Landing page for unauthenticated users */}
  <Route path="/" element={isAuthenticated() ? <Dashboard /> : <Landing />} />
  {/* Dashboard for authenticated users (redundant, but for clarity) */}
  <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
  {/* Project detail with Kanban */}
  <Route path="/project/:id" element={<PrivateRoute element={<ProjectDetail />} />} />
      {/* Project detail */}
      {/* <Route path="/project/:id" element={<PrivateRoute element={<ProjectDetail />} />} /> */}
    </Routes>
  );
}

export default App;
