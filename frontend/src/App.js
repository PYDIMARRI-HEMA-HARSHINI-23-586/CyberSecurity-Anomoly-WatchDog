import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Visualizations from './pages/Visualizations';
import LogViewer from './pages/LogViewer';
import RuleManagement from './pages/RuleManagement';
import NotificationManagement from './pages/NotificationManagement';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/visualizations" element={<Visualizations />} />
          <Route path="/logs" element={<LogViewer />} />
          <Route path="/rules" element={<RuleManagement />} />
          <Route path="/notifications" element={<NotificationManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;