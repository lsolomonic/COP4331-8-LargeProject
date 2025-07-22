import './App.css';
import Loginpage from './pages/Loginpage';
import Homepage from './pages/Homepage';
import AboutUs from './pages/AboutUs';
import Register from './components/Register';
import RegisterPage from './pages/Registerpage';
import Verify from './pages/Verify';
import MyPlaces from './pages/MyPlaces';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

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
          <Route path="myplaces" element={<MyPlaces />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App
