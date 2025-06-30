import {useState} from "react"
import Dropdown from '../components/Dropdown'

function Homepage() {
    const [name, setName] = useState("testname");
    
    return (
        <>
            <h1 className="text-white text-[50px] ml-10 text-center">Welcome, {name}!</h1>
            <Dropdown />
        </>
    )
}

export default Homepage; 