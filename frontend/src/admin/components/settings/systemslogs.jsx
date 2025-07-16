import { Download } from "lucide-react";
import Systemslogstable from "./systemslogstable";


const Systemslogs = () => {
  return (
    <>
    <div className="bg-[#16161C] border border-[#374151] p-4 rounded-md text-white mt-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Filters & Search Label */}
        <div className="flex items-center gap-2 text-[24px] font-medium text-lg mb-2">
          <svg
            className="w-4 h-4 text-cyan-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 14.414V20a1 1 0 01-1.447.894l-4-2A1 1 0 019 18v-3.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          <span>Filters & Search</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-row items-center gap-4 mb-3 mt-2 w-full ">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search logs..."
          className="bg-[#1C1F26] border border-[#2D313A] text-white text-sm px-4 py-2  w-52 focus:outline-none w-full"
        />

        {/* Dropdowns */}
        <select className="bg-[#1C1F26] border border-[#2D313A] text-white text-sm px-4 py-2 focus:outline-none w-full">
          <option>All Actions</option>
        </select>

        <select className="bg-[#1C1F26] border border-[#2D313A] text-white text-sm px-4 py-2 focus:outline-none w-full">
          <option>All Users</option>
        </select>

        <select className="bg-[#1C1F26] border border-[#2D313A] text-white text-sm px-4 py-2 focus:outline-none w-full">
          <option>All Time</option>
        </select>

        {/* Export Button */}
        
      </div>

      {/* Log Count */}
      <div className="flex flex-row items-center justify-between mt-5">
              <p className="text-sm text-gray-400">Showing 8 of 8 log entries</p>

        <button className="cursor-pointer ml-auto bg-white border border-[#12DCF0] text-[#12DCF0] text-sm px-4 py-2  flex items-center gap-2">
         <Download size={14}/>
          Export Logs
        </button>
      </div>
    </div>

<Systemslogstable/>
    </>
    
  );
};

export default Systemslogs;
