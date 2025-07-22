import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

function buildPath(route) {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api/' + route;
  } else {
    return '/api/' + route;
  }
}

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const digitCount = (password.match(/\d/g) || []).length;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (digitCount < 2 || !hasSpecialChar) {
      setMessage("Password must contain at least 2 digits and 1 special character.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(buildPath('reset-password'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setMessage(result.error || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }

    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-700 rounded shadow">
        <h2 className="text-3xl text-white text-center mb-4">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 rounded bg-slate-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full py-2 rounded ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-green-700'} text-white`}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {message && <p className="text-white mt-4 text-center">{message}</p>}
      </div>
    </>
  );
}
