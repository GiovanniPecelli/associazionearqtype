import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StatutePage from './pages/StatutePage';

function App() {
  return (
    <Router>
      <div className="bg-arq-bg text-white min-h-screen selection:bg-arq-primary selection:text-white flex flex-col justify-between">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/statuto" element={<StatutePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
