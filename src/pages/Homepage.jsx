import {useState} from "react"
import Dropdown from '../components/Dropdown'
import MapComponent from '../components/Map'
import { PlusIcon } from "@heroicons/react/16/solid";
import Header from '../components/Header';


function Homepage() {
    const [name, setName] = useState(localStorage.getItem("name"));
    const [popupVisible, setPopupVisible] = useState('hidden');

    
    const [clickedLocation, setClickedLocation] = useState(null);
    const [locName, setLocName] = useState('');
    const [vibe, setVibe] = useState('');

    function buildPath(route) {
        if (process.env.NODE_ENV != 'development') {
            return 'http://' + "group12cop4331.xyz" + ':5000/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }

    const togglePopup = () => {
        if (popupVisible == 'hidden') {
            setPopupVisible('');
        } else {
            setPopupVisible('hidden');
        }
    }

    const handleMapClick= (location) => {
        setClickedLocation(location);
        console.log("Clicked location: " + location);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const obj = {location: clickedLocation, vibe: vibe, building: locName, userId:localStorage.getItem("userID")};
        const js = JSON.stringify(obj);         
        try {
            const response = await fetch(buildPath('api/places/add'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            })

            const res = await response.json(); 

            if (!response.ok) {
                alert(response.error || "Login failed.");
                return;
            }

            //add pin here (TODO)
        } catch (error) {
            alert("Network or server error: " + error.toString());
        }
    }

    return (
        <>
            <div className="relative w-full h-24">
                <Header />  
                <h1 className="absolute inset-0 flex justify-center items-center text-white text-[50px]">
                    Welcome, {name}!
                </h1>
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <Dropdown />
                </div>
            </div>
            <MapComponent onMapClick={handleMapClick} /> <br />
            <div className="relative w-full h-24 flex items-center justify-center gap-4">
                <h1 className="text-white text-[50px]">Options:</h1>
                <PlusIcon className="fill-white h-20 w-20" onClick={togglePopup}/>
                <div className={popupVisible}>
                        <div id="popupDiv" className="relative w-full h-30 flex items-center justify-center gap-4 bg-gray-300 rounded-2xl p-5">
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="firstName" value={clickedLocation} className="border-2 border-black rounded-2xl text-center p-3" placeholder="Click map..." />
                                <input type="text" name="locName" value={locName} onChange={(e) => setLocName(e.target.value)} className="border-2 border-black rounded-2xl text-center p-3 ml-5" placeholder="Place Name" />
                                <input type="email" name="vibe" value={vibe} onChange={(e) => setVibe(e.target.value)} className="border-2 border-black rounded-2xl text-center p-3 ml-5" placeholder="Vibe" required />
                                <button onClick={handleSubmit} type="submit" className="border-black bg-sky-500 hover:bg-sky-700 border-2 rounded-3xl text-center ml-5 w-50 h-10">Add Place</button>
                            </form>
                        </div>
                </div>
            </div>


        </>
    )
}

export default Homepage; 