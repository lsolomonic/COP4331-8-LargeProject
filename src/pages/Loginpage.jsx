import {useState} from "react"
import Login from '../components/Login.jsx'
import Header from '../components/Header.jsx'
import Register from "../components/Register.jsx";

function Loginpage() {
    return (
        <div>
            <Header />
            <Login />
        </div>
    );
}

export default Loginpage;