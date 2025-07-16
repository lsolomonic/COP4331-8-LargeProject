import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
  Bars3Icon
} from '@heroicons/react/16/solid'

// function Dropdown() {
//     return (
//         <>
//             <div>
//                 <Menu>
//                     <MenuButton className="inline-flex items-center gap-2 rounded-md  px-3 py-1.5 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-800 data-open:bg-gray-800">
//                         <Bars3Icon className="w-20 h-20"></Bars3Icon>
//                     <ChevronDownIcon className="size-4 fill-white/60" />
//                     </MenuButton>

//                     <MenuItems
//                     transition
//                     anchor="bottom end"
//                     className="w-52 origin-top-right rounded-xl border border-white/5 bg-[#2f3b49] p-1 text-xl/12 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
//                     >
//                     <MenuItem>
//                         <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
//                         Settings
//                         </button>
//                     </MenuItem>
//                     <MenuItem>
//                         <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10" onClick={() => {
//                             window.location.href='myplaces'
//                         }}>
//                         My Places
//                         </button>
//                     </MenuItem>
//                     <div className="my-1 h-px bg-white/5" />
//                     <MenuItem>
//                         <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10" onClick = {() => {
//                             window.location.href= '/aboutus'
//                         }}>
//                         About Us
//                         </button>
//                     </MenuItem>
//                     <MenuItem>
//                         <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
//                         onClick={() => {
//                             window.location.href = '/'
//                         }}
//                         >
//                         Log Out
//                         </button>
//                     </MenuItem>
//                     </MenuItems>
//                 </Menu>
//             </div>
//         </>
//     )
// }

function Dropdown({ children }) {
  return (
    <Menu>
      <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-800 data-open:bg-gray-800">
        <Bars3Icon className="w-20 h-20" />
        <ChevronDownIcon className="size-4 fill-white/60" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-52 origin-top-right rounded-xl border border-white/5 bg-[#2f3b49] p-1 text-xl/12 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
            Settings
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
            onClick={() => {
              window.location.href = 'myplaces';
            }}
          >
            My Places
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-white/5" />
        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
            onClick={() => {
              window.location.href = '/aboutus';
            }}
          >
            About Us
          </button>
        </MenuItem>

        {children}

        <MenuItem>
          <button
            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Log Out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

export default Dropdown;