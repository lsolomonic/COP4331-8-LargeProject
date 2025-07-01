import {useState} from "react"
import Dropdown from '../components/Dropdown'
import MapComponent from '../components/Map'
import Locations from '../components/Locations'

function Homepage() {
    const [name, setName] = useState("testname");
    
    return (
        <>
            <div className="relative w-full h-24">
                <h1 className="absolute inset-0 flex justify-center items-center text-white text-[50px]">
                    Welcome, {name}!
                </h1>
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <Dropdown />
                </div>
            </div>
            <MapComponent /> <br />
            <hr className="border-3 border-white"></hr>
            <Locations />
        </>
    )
}

export default Homepage; 