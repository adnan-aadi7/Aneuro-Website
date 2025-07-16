import React from "react";

const AddEmailMannually = () => {
  return (
    <div className="bg-[#181A20] min-h-screen p-6">
      {/* Title and subtitle */}
      <h2 className="text-white text-xl font-medium mb-1">
        Manually Add Email
      </h2>
      <p className="text-gray-300 mb-6">Lets write your own</p>

      {/* Sender Section */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src="/Avatar.png"
          alt="Aneuro Admin"
          className="w-10 h-10 rounded-full border-2 border-cyan-400 bg-white object-cover"
        />
        <div>
          <div className="text-white text-sm font-semibold leading-tight">
            Aneuro Admin
          </div>
          <div className="text-gray-300 text-xs leading-tight">
            admin@aneuro.com
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="rounded-lg p-4 bg-[#23253A] shadow-lg ring-2 ring-cyan-500/40 mb-2">
          <label className="text-white text-sm mb-2 block">
            Write Your Email
          </label>
          <textarea
            rows={4}
            className="w-full bg-transparent border-0 outline-none text-white resize-none mt-2"
            placeholder=""
          />
        </div>
        <div className="flex justify-start">
          <button className="bg-cyan-400 text-black font-semibold px-8 py-2 rounded hover:bg-cyan-300 transition-all text-sm">
            Send
          </button>
        </div>
      </div>

      {/* Receiver Section */}
      <div className="flex items-center gap-3 mb-2 mt-8">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Devon Lane"
          className="w-10 h-10 rounded-full border-2 border-cyan-400 bg-white object-cover"
        />
        <div>
          <div className="text-white text-sm font-semibold leading-tight">
            Devon Lane
          </div>
          <div className="text-gray-300 text-xs leading-tight">
            yourname@gmail.com
          </div>
        </div>
      </div>
      <div className="rounded-lg p-4 bg-[#23253A] shadow-lg ring-2 ring-cyan-500/40 mb-2">
        <label className="text-white text-sm mb-2 block">Received Email</label>
        <textarea
          rows={4}
          className="w-full bg-transparent border-0 outline-none text-white resize-none mt-2"
          placeholder=""
          readOnly
        />
      </div>
    </div>
  );
};

export default AddEmailMannually;
