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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  async function doRegister(event) {
    event.preventDefault();

    const obj = {
      login: formData.username,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
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
        // Handle errors like username taken
        alert(res.error || "Registration failed.");
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
      alert("Network or server error: " + error.toString());
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
    </>
  );
}

export default Register;
