import React from "react";

const AddEmailMannually = () => {
  return (
    <div className="bg-[#2A2A39] min-h-screen p-2">
      {/* Sender Section */}
      <div className="flex items-center gap-3 mb-2 mt-4 ml-6">
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
        <div
          className="relative p-8 ml-6 mr-6 mt-2 rounded bg-[#2A2A39]"
          style={{
            boxShadow: `inset 0 8px 50px -8px #12DCF040, inset 8px 0 24px -8px #12DCF040, inset -8px 0 24px -8px #12DCF040`,
          }}
        >
          <label
            className="text-white text-base font-semibold mb-2 block border-b py-10 px-4"
            style={{ borderBottomColor: "#D1D1D180" }}
          >
            Write Your Email
          </label>
          {/* Masking div to cover bottom glow */}
          <div
            className="absolute left-0 right-0 bottom-0 h-2 bg-[#2A2A39] rounded-b"
            style={{ zIndex: 2 }}
          />
          <textarea
            rows={5}
            className="w-full bg-transparent border-0 outline-none text-white resize-none mt-4 relative z-10"
            placeholder=""
          />
        </div>
        <div className="flex justify-start ml-6 mt-4">
          <button className="cursor-pointer bg-cyan-400 text-black font-semibold px-10 py-2 rounded hover:bg-cyan-300 transition-all text-sm ">
            Send
          </button>
        </div>
      </div>

      {/* Receiver Section */}
      <div className="flex items-center gap-3 mb-2 mt-10 ml-6">
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
      <div
        className="relative p-8 ml-6 mr-6 mt-2 bg-[#2A2A39]"
        style={{
          boxShadow: `inset 0 8px 54px -8px #12DCF040, inset 8px 0 24px -8px #12DCF040, inset -8px 0 24px -8px #12DCF040`,
        }}
      >
        <label
          className="text-white text-base font-semibold mb-2 block border-b-2 py-10 px-4"
          style={{ borderBottomColor: "#D1D1D180" }}
        >
          Received Email
        </label>
        {/* Masking div to cover bottom glow */}
        <div
          className="absolute left-0 right-0 bottom-0 h-4 bg-[#2A2A39] rounded-b"
          style={{ zIndex: 2 }}
        />
        <textarea
          rows={5}
          className="w-full bg-transparent border-0 outline-none text-white resize-none mt-4 relative z-10"
          placeholder=""
          readOnly
        />
      </div>
    </div>
  );
};

export default AddEmailMannually;
