import { useState } from 'react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/16/solid';

export default function Actions({
  userID,
  buildingID,
  buildPath,
  setNotif,
  currentBuilding,
  currentVibe,
  currentLocation
}) {
  const [popupVisible, setPopupVisible] = useState(false);
  const [building, setBuilding] = useState('');
  const [vibe, setVibe] = useState('');
  const [location, setLocation] = useState('');

    const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this building?")) return;

    try {
        const userId = JSON.parse(localStorage.getItem('user_data')).id;
        console.log("Deleting:", { userId, buildingID });
        
        const response = await fetch(buildPath(`api/places/${userId}/${buildingID}`), {
        method: 'DELETE'
        });

        const res = await response.json();

        if (!response.ok) {
        setNotif("Could not remove place.");
        return;
        }

        setNotif("Place deleted!");
    } catch (error) {
        setNotif(error.toString());
    }
    };


  const handleEdit = () => {
    setBuilding(currentBuilding || '');
    setVibe(currentVibe || '');
    setLocation(currentLocation || '');
    setPopupVisible(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      userId: userID,
      buildingId: buildingID,
      building,
      vibe,
      location
    };

    try {
      const response = await fetch(buildPath('api/myplaces/update'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const res = await response.json();

      if (!response.ok) {
        setNotif(res.error || "Update failed.");
        return;
      }

      setNotif("Update successful!");
      setPopupVisible(false);
    } catch (error) {
      setNotif(error.toString());
        }
    };

  return (
    <>
      <div className="flex justify-center gap-2">
        <XMarkIcon className="h-10 w-10 fill-white cursor-pointer" onClick={handleDelete} />
        <PencilIcon className="h-9 w-9 cursor-pointer" onClick={handleEdit} />
      </div>

      {popupVisible && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#1e293b] p-6 rounded-xl w-80 text-white">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Place</h2>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Building name"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full bg-slate-700 text-white placeholder-gray-300 border border-gray-500 p-2 rounded"
              />
              <input
                type="text"
                placeholder="Vibe"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-slate-700 text-white placeholder-gray-300 border border-gray-500 p-2 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-700 text-white placeholder-gray-300 border border-gray-500 p-2 rounded"
              />
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setPopupVisible(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
