import { Download } from "lucide-react";
import Systemslogstable from "./systemslogstable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchSystemLogs,
  selectSystemLogs,
  selectSystemLogsLoading,
  selectSystemLogsError,
  selectSystemLogsFilters,
  updateFilters,
} from "../../../store/Slice/LogSlice";

const Systemslogs = () => {
  const dispatch = useDispatch();
  const logs = useSelector(selectSystemLogs);
  const loading = useSelector(selectSystemLogsLoading);
  const error = useSelector(selectSystemLogsError);
  const filters = useSelector(selectSystemLogsFilters);

  const [search, setSearch] = useState(filters.search || "");
  const [action, setAction] = useState(filters.action || "");
  const [user, setUser] = useState(filters.user || "");
  const [timeRange, setTimeRange] = useState(filters.timeRange || "all_time");

  useEffect(() => {
    dispatch(fetchSystemLogs({ ...filters }));
  }, [dispatch, filters]);

  const applyFilters = () => {
    dispatch(updateFilters({ action, user, timeRange, search }));
    dispatch(fetchSystemLogs({ action, user, timeRange, search }));
  };

  const exportLogs = () => {
    const csv = [
      ["timestamp","userEmail","userId","action","contentType","affectedAsset","severity","description"],
      ...logs.map(l => [
        new Date(l.timestamp).toISOString(),
        l.user?.email || "",
        l.user?.id || "",
        l.action,
        l.contentType,
        l.affectedAsset,
        l.severity,
        (l.description || "").replace(/\n|\r/g, " ")
      ])
    ].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `system_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1C1F26] border border-[#2D313A] text-white text-sm px-4 py-2 focus:outline-none w-full"
        />

        {/* Dropdowns */}
        <select value={action} onChange={(e) => setAction(e.target.value)} className="bg-[#1C1F26] border border-[#2D313A] text-white text-sm px-4 py-2 focus:outline-none w-full">
          <option value="">All Actions</option>
          <option value="UPLOAD">Upload</option>
          <option value="EDIT">Edit</option>
          <option value="DELETE">Delete</option>
          <option value="CREATE">Create</option>
        </select>

        <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Filter by user email" className="bg-[#1C1F26] border border-[#2D313A] text-white text-sm px-4 py-2 focus:outline-none w-full" />

        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="bg-[#1C1F26] border border-[#2D313A] text-white text-sm px-4 py-2 focus:outline-none w-full">
          <option value="all_time">All Time</option>
          <option value="last_24h">Last 24h</option>
          <option value="last_7d">Last 7 days</option>
          <option value="last_30d">Last 30 days</option>
        </select>

        {/* Apply & Export */}
        <button onClick={applyFilters} className="bg-cyan-500 text-black text-sm px-4 py-2">Apply</button>
      </div>

      {/* Log Count */}
      <div className="flex flex-row items-center justify-between ">
              <p className="text-sm text-gray-400">{loading ? 'Loading...' : `Showing ${logs.length} log entries`}{error ? ` — Error: ${error}` : ''}</p>

      </div>
      
      {/* Export Button */}
      <div className="flex justify-end">
        <button onClick={exportLogs} className="cursor-pointer bg-white border border-[#12DCF0] text-black text-sm px-4 py-2 flex items-center gap-2">
          <Download size={14}/>
          Export Logs
        </button>
      </div>
    </div>

<Systemslogstable logs={logs} />
    </>
    
  );
};

export default Systemslogs;
