import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    async function verifyEmail() {
      try {
        const response = await fetch(`http://localhost:5000/api/verify/${token}`);
        const res = await response.json();

        if (response.ok) {
          setStatus('Email verified! Redirecting to login...');
          setTimeout(() => navigate('/'), 3000); 
        } else {
          setStatus(`${res.error || 'Please wait to be redirected'}`);
        }
      } catch (err) {
        setStatus('Verification failed. Please try again later.');
      }
    }

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="text-white text-center mt-10 text-3xl">
      {status}
    </div>
  );
}

export default Verify;
