import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/16/solid';
import Actions from '../components/Actions';

function Locations({ userID }) {
  const [locData, setLocData] = useState([]);
  const [searchData, setSearchData] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [notif, setNotif] = useState("");

  const handleChange = (e) => {
    setSearchData(e.target.value);
  };

  function buildPath(route) {
    if (process.env.NODE_ENV !== 'development') {
      return 'http://' + 'group12cop4331.xyz' + ':5000/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  function filterPressed(selection) {
    if (selection === 'Cancel') {
      setActiveFilter(null);
      setNotif("")
    } else {
      setActiveFilter(selection);
      setNotif("Filtering for: " + selection);
    }
  }

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(buildPath('api/places/' + userID));
        if (!response.ok) {
          alert('Failed to load your places.');
          return;
        }

        const data = await response.json();
        setLocData(data);
      } catch (error) {
        alert('Error loading places: ' + error);
      }
    };

    if (userID) {
      fetchPlaces();
    }
  }, [userID, locData]);

  const filteredData = locData.filter((item) => {
    const matchesSearch =
      item.building.toLowerCase().includes(searchData.toLowerCase()) ||
      item.location.toLowerCase().includes(searchData.toLowerCase()) ||
      item.vibe.toLowerCase().includes(searchData.toLowerCase());

    const matchesFilter = !activeFilter || item.vibe === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="flex justify-center mt-3">
        <span className="text-4xl text-white"> Search Places: </span>
        <input
          type="text"
          className="w-3xl shadow rounded-3xl text-center ml-5 text-[30px] bg-white"
          value={searchData}
          onChange={handleChange}
          placeholder="start typing. . ."
        />

        {/* Filter Dropdown */}
        <Menu>
          <MenuButton name="filter" className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-800 ml-2">
            <AdjustmentsHorizontalIcon className="w-10 h-10 mt-1" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-35 origin-top-left rounded-xl border border-white/5 bg-white/75 p-1 text-xl/12 text-black transition duration-100 ease-out focus:outline-none"
          >
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-200"
                onClick={() => filterPressed('Study')}
              >
                Study
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-200"
                onClick={() => filterPressed('Social')}
              >
                Social
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-200"
                onClick={() => filterPressed('Versatile')}
              >
                Versatile
              </button>
            </MenuItem>
            <div className="my-1 h-px bg-gray-800" />
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-gray-200"
                onClick={() => filterPressed('Cancel')}
              >
                Cancel
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pg-4 bg-white shadow rounded text-center">
        <div className="overflow-y-scroll max-h-100 border rounded">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-400 text-black sticky top-0 text-2xl rounded-xl">
              <tr>
                <th className="px-4 py-2 font-semibold">Location</th>
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold">Vibe</th>
                <th className="px-4 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-gray-500 even:bg-gray-600 text-xl text-white rounded-xl"
                >
                  <td className="px-4 py-2">{item.location}</td>
                  <td className="px-4 py-2">{item.building}</td>
                  <td className="px-4 py-2">{item.vibe}</td>
                  <td className="px-4 py-2">
                    <Actions
                      userID={userID}
                      buildingID={item._id}
                      buildPath={buildPath}
                      setNotif={setNotif}
                      currentBuilding={item.building}
                      currentVibe={item.vibe}
                      currentLocation={item.location}
                    />
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h1 className="text-[40px] text-center text-red-200">{notif}</h1>
    </>
  );
}

export default Locations;
