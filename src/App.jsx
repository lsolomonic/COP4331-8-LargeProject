import { useState } from 'react'
import './App.css'
import Login from './Login'
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
