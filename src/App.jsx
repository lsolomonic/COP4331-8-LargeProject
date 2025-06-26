import { useState } from 'react'
import './App.css'
import Login from './Login'
import Homepage from './Homepage'
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  return (
    <div className="bg-black">
      <h1 className="text-white text-[50px]">
        <a href="https://github.com/lsolomonic/COP4331-8-LargeProject">
        <img src='/lilguy.png' className="w-15 h-10 float-left mt-4"/>
        </a>
        Project Title
        </h1>
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
