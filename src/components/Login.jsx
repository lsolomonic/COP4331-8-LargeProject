import { useState } from 'react'
import '../App.css'
import { Axios } from 'axios'

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
            ext = "register";
        }
    }

    async function doLogin(event) {
        event.preventDefault();

        var obj = {login:formData.username, password:formData.password};
        var js = JSON.stringify(obj); 

        try {
            const response = await fetch(buildPath('api/login'),
            {method:'POST',body:js,headers:{'Content-Type':'application/json'}});

            var res = JSON.parse(await response.text());

            if (res.id <= 0) {
                console.log("user/pass combo wrong");
            } else {
                var user = {firstName:res.firstName, lastName:res.lastName, id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));

                window.location.href = '/homepage';
            }
        } catch(error) {
            alert(error.toString());
            return;
        }
    }

    // async function doRegister(event) {
    //     event.preventDefault();

    //     var obj = {login:formData.username, password:formData.password, }
    // }


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
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="First Name"></input> <br />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="border-2 border-black rounded-2xl text-center mt-5" placeholder="Last Name"></input>
                </div> 
                <button type="submit" className="border-black bg-sky-500 hover:bg-sky-700 border-2 rounded-3xl w-100 text-center mt-5">Continue</button>
                </div>
            </form>
            <div className="text-[40px] text-center text-white">No account yet? <a className="text-sky-500 hover:text-sky-700" onClick={handleLog}>Register here.</a></div>
        </>
    )
}

export default Login; 