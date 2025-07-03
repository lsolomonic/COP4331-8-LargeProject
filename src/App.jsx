import './App.css';
import Loginpage from './pages/Loginpage';
import Homepage from './pages/Homepage';
import AboutUs from './pages/AboutUs';
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/aboutus" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App
