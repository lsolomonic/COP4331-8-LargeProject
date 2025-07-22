import React, { useState } from 'react';
import Header from '../components/Header';

function ForgotPassword() {
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(buildPath('forgot-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      setMessage('Check your email for a password reset link.');
    } else {
      setMessage(result.error || 'Error sending reset email.');
    }
  };

  function buildPath(route) {
    if (import.meta.env.MODE === 'development') {
      return 'http://localhost:5000/api/' + route;
    } else {
      return '/api/' + route;
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded shadow text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-white bg-slate-900 placeholder-white"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-white bg-slate-900 placeholder-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </>
  );
}

export default ForgotPassword;
