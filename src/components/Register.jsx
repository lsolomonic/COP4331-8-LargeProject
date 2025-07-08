import { useState } from 'react';
import '../App.css';

function Register() {
  function buildPath(route) {
    if (process.env.NODE_ENV !== 'development') {
      return 'http://' + "group12cop4331.xyz" + ':5000/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
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
      const response = await fetch(buildPath('api/register'), {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });

      const res = JSON.parse(await response.text());

      if (res.id < 0) {
        console.log("User already exists!");
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id
        };
        localStorage.setItem('user_data', JSON.stringify(user));
        window.location.href = '/';
      }
    } catch (error) {
      alert(error.toString());
    }
  }

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
    </>
  );
}

export default Register;
