import React from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Konten Utama */}
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Tambahkan Route lainnya di sini */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

