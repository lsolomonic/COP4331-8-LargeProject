import {useState} from 'react';
import Dropdown from '../components/Dropdown';
import Locations from '../components/Locations';
import { MenuItem } from '@headlessui/react';
import Header from '../components/Header'

function MyPlaces() {
  return (
    <>
      <div className="relative w-full h-24">
        <Header />
        <h1 className="absolute inset-0 flex justify-center items-center text-white text-[50px]">
          My Places
        </h1>
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <Dropdown>
            <MenuItem>
              <button
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
                onClick={() => {
                  window.location.href = '/Homepage';
                }}
              >
                Homepage
              </button>
            </MenuItem>
          </Dropdown>
        </div>
      </div>

      <Locations userID={localStorage.getItem("userID")} />
    </>
  );
}

export default MyPlaces;