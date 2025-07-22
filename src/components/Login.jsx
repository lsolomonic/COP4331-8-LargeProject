import { useState } from 'react'
import '../App.css'
import { Axios } from 'axios'
import { useNavigate } from 'react-router-dom';


function Login() {

    function buildPath(route) {
        if (process.env.NODE_ENV != 'development') {
            return 'http://' + "group12cop4331.xyz" + ':5000/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: ''
    });

    const [logState, setLogState] = useState('Please Log In:')
    const [notif, setNotif] = useState("");
    const [visState, setVisState] = useState('hidden');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        var ext = ""
        if (logState == "Please Log In:") {
            doLogin(e); 
        } else {
            doRegister(e);
        }
    }

    async function doLogin(event) {
        event.preventDefault();
        if (formData.username == "" || formData.password == "") {
            setNotif("Username and Password can't be blank!");
            setTimeout(function(){
                setNotif("");
            }, 3000)
            return;
        }

        const obj = { login: formData.username, password: formData.password };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath('api/login'), {
            method: 'POST',
            body: js,
            headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if (!response.ok) {
            // Handles errors like unverified email or wrong login
                setNotif(res.error || 'Login failed.');
                setTimeout(function(){
                    setNotif("");
                }, 3000)
                return;
            }

            // Successful login
            const user = {
                firstName: res.firstName,
                lastName: res.lastName,
                id: res.id,
            };
            
            localStorage.setItem('user_data', JSON.stringify(user));
            localStorage.setItem('userID', res.id);
            localStorage.setItem('name', user.firstName);
            window.location.href = '/Homepage';

        } catch (error) {
            setNotif("Network or server error: " + error.toString());
            setTimeout(function(){
                setNotif("");
            }, 3000)
        }
    }

    const navigate = useNavigate();

    const handleLog = () => {
        navigate('/Registerpage');
    };
    const handleReset = () => {
        navigate('/ForgotPassword')
    }

    return (
        <>
            <div id="logState" className="text-[50px] text-center text-white">{logState}</div>
            <form onSubmit={handleSubmit}>
                <div id="loginDiv" className="text-[40px] text-center bg-gray-400 rounded-xl text-white w-full max-w-lg mx-auto p-6">  
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="Username" required></input> <br /> 
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="Password" required></input> <br />
                <div id="regDiv" className={visState}>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="First Name" />
                    <br />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="Last Name" />
                    <br />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="Email" required />
                    <br />
                </div>
                <button 
                    onClick={handleSubmit}
                    type="submit" className="border-black bg-sky-500 hover:bg-sky-700 border-2 rounded-3xl w-100 text-center mt-5">Continue</button>
                </div>
            </form>
            <div className="text-[40px] text-center text-white">
                No account yet? <a className="text-sky-500 hover:text-sky-700 cursor-pointer" onClick={handleLog}>Register here.</a>
            </div>
            <div className="text-[40px] text-center text-white">
                <a className="text-sky-500 hover:text-sky-700 cursor-pointer" onClick={handleReset}>Forgot Password?</a>
            </div>
            <h1 className="text-[40px] text-center text-red-200">{notif}</h1>
        </>
    )
}

export default Login; 