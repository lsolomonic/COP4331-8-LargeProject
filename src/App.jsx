import { useState } from 'react'
import './App.css'
import Loginpage from './pages/Loginpage'
import Homepage from './pages/Homepage'
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/homepage" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App
