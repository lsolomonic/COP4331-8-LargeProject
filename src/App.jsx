import './App.css';
import Loginpage from './pages/Loginpage';
import Homepage from './pages/Homepage';
import AboutUs from './pages/AboutUs';
import Register from './components/Register';
import RegisterPage from './pages/Registerpage';
import Verify from './pages/Verify';

import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerpage" element={<RegisterPage />} />
          <Route path="/verify/:token" element={<Verify />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App
