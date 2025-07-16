import React from "react";
import { Clock, Calendar } from "lucide-react";

const Cards = () => {
  return (
    <div className=" text-white py-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Releases */}
        <div className=" p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">
              Pending Releases
            </h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-white">3</span>
          </div>
          <p className="text-gray-400 text-sm">Scheduled for release</p>
        </div>

        {/* This Week */}
        <div className=" p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">This Week</h3>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-white">2</span>
          </div>
          <p className="text-gray-400 text-sm">Releases this week</p>
        </div>

        {/* Next Release */}
        <div className=" p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 text-sm font-medium">Next Release</h3>
            <Clock className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mb-2">
            <span className="text-3xl font-bold text-white">Feb 1</span>
          </div>
          <p className="text-gray-400 text-sm">Customer Retention Series</p>
        </div>
      </div>
    </div>
  );
};

export default Cards;
