import { useState } from 'react'
import './App.css'
import Login from './Login'
import Homepage from './Homepage'
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
