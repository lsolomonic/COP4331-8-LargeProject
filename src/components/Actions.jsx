import { useState } from 'react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/16/solid';

export default function Actions({ userID, buildingID, buildPath, setNotif }) {

    const [popup, setPopup] = useState('hidden');
    const handleDelete = async (e) => {
        confirm("Are you sure you want to delete this building?"); 
        try {
            const response = await fetch(buildPath(`api/places/${userID}/${buildingID}`), {
                method: 'DELETE'
            })

            const res = await response.json(); 

            if (!response.ok) {
                setNotif("Could not remove place.");
                return;
            }

            setNotif("Place deleted!");
        } catch (error) {
            setNotif(error.toString()); 
            return;
        }
    }

    const handleEdit = (e) => {

    }

    return (
        <>
            <div className="flex justify-center">
                <XMarkIcon className="h-10 w-10 fill-white" onClick={handleDelete} />
                <PencilIcon className="h-9 w-9" onClick={handleEdit} />
            </div>
        </>
    )
}