import { useState } from 'react'
import '../App.css'
import { Axios } from 'axios'

function Login() {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        verifyemail: ''
    });

    const [logState, setLogState] = useState('Please Log In:')

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
            ext = "login";
        } else {
            ext = "register";
        }

        let url = "http://localhost:500/api/" + ext;

        Axios.post(url, {
            login: formData.username,
            password: formData.password,
            email: formData.email
        })
    }

    const handleLog = (e) => {
        if (logState == "Please Log In:"){
        setLogState('Please Register:');
        setVisState('visible');
        } else {
        setLogState('Please Log In:');
        setVisState('hidden');
        }
    }

    return (
        <>
            <div id="logState" className="text-[50px] text-center text-white">{logState}</div>
            <form onSubmit={handleSubmit}>
                <div id="loginDiv" className="text-[40px] text-center bg-gray-400 rounded-xl text-white ">  
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="Username" required></input> <br /> 
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="Password" required></input> <br />
                <div id="regDiv" className = {visState}>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="Email"></input> <br />
                    <input type="text" name="verifyemail" value={formData.verifyemail} onChange={handleChange}className="border-2 border-black rounded-2xl text-center mt-5" placeholder="Verify Email"></input>
                </div> 
                <button type="submit" className="border-black bg-sky-500 hover:bg-sky-700 border-2 rounded-3xl w-100 text-center mt-5">Continue</button>
                </div>
            </form>
            <div className="text-[40px] text-center text-white">No account yet? <a className="text-sky-500 hover:text-sky-700" onClick={handleLog}>Register here.</a></div>
        </>
    )
}

export default Login; 