import {useState} from 'react';
import Dropdown from '../components/Dropdown';
import Locations from '../components/Locations';

function MyPlaces() {
    return (
        <>
            <div className="relative w-full h-24">
                <h1 className="absolute inset-0 flex justify-center items-center text-white text-[50px]">
                    My Places
                </h1>
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <Dropdown />
                </div>
            </div>
            <Locations userID={localStorage.getItem("userID")} />
        </>
    )
}

export default MyPlaces;