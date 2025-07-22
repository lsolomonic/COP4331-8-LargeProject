import { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  function buildPath(route) {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:5000/api/' + route
      : '/api/' + route;
  }

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  });

  const [notif, setNotif] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

async function doRegister(event) {
  event.preventDefault();

  const { username, password, firstName, lastName, email } = formData;

  if (!username || !password || !firstName || !lastName || !email) {
    setNotif("All fields are required.");
    setTimeout(() => setNotif(""), 3000);
    return;
  }

  const digitCount = (password.match(/\d/g) || []).length;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (digitCount < 2 || !hasSpecialChar) {
    setNotif("Password must contain at least 2 digits and 1 special character.");
    setTimeout(() => setNotif(""), 3000);
    return;
  }

  const obj = {
    login: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  const js = JSON.stringify(obj);

  try {
    const response = await fetch(buildPath('register'), {
      method: 'POST',
      body: js,
      headers: { 'Content-Type': 'application/json' }
    });

    const res = await response.json();

    if (!response.ok) {
      setNotif(res.error || "Registration failed.");
      setTimeout(() => setNotif(""), 3000);
      return;
    }

    const user = {
      firstName: res.firstName,
      lastName: res.lastName,
      id: res.id
    };
    localStorage.setItem('user_data', JSON.stringify(user));
    window.location.href = '/';
  } catch (error) {
    setNotif("Network or server error: " + error.toString());
    setTimeout(() => setNotif(""), 3000);
  }
}

  const navigate = useNavigate();

  const handleLog = () => {
    navigate('/');
  };

  return (
    <>
      <div className="text-[50px] text-center text-white">Please Register:</div>
      <form onSubmit={doRegister}>
        <div className="text-[40px] text-center bg-gray-400 rounded-xl text-white w-full max-w-lg mx-auto p-6">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border-2 border-black rounded-2xl text-center mt-5"
            placeholder="Username"
            required
          /> <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border-2 border-black rounded-2xl text-center mt-5"
            placeholder="Password"
            required
          /> <br />
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="border-2 border-black rounded-2xl text-center mt-5"
            placeholder="First Name"
            required
          /> <br />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="border-2 border-black rounded-2xl text-center mt-5"
            placeholder="Last Name"
            required
          /> <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border-2 border-black rounded-2xl text-center mt-5"
            placeholder="Email"
            required
          /> <br />
          <button
            type="submit"
            className="border-black bg-sky-500 hover:bg-sky-700 border-2 rounded-3xl w-100 text-center mt-5"
          >
            Register
          </button>
        </div>
      </form>
      <div className="text-[40px] text-center text-white">
        Have an account? <a className="text-sky-500 hover:text-sky-700 cursor-pointer" onClick={handleLog}>Login Here.</a>
      </div>
      <h1 className="text-[40px] text-center text-red-200">{notif}</h1>
    </>
  );
}

export default Register;
