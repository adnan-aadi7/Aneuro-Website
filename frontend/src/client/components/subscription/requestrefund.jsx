import Texteditor from "../../../admin/components/subscription/texteditor";

const Requestrefund =()=>{

    return(
         <div className="text-white">
      <div>
        <h1 className="text-[32px] font-medium inline-block pb-1">Good Morning, Mike</h1>
        <p className="text-[20px] opacity-70 mt-1">Let's make the day productive</p>
      </div>

      <div
        className="p-2 md:p-6 mt-6 shadow-md text-white font-inter w-full overflow-x-auto"
      style={{
    background: `
      radial-gradient(
        circle at bottom right,
        rgba(29, 116, 125, 0.4) 0%,
        transparent 30%
      ),
      #2A2A39
    `,
    backgroundBlendMode: 'normal' 
  }}
      >

        <h1 className="text-[24px] font-medium">Write your message here</h1>
 <div className="p-2 h-[240px] border-2 border-slate-300 text-black dark-quill-container mt-8">
               <Texteditor/>
            </div>

             <div className="flex gap-4 mt-16">
              <button
                className="bg-[#12DCF0] text-black font-medium px-12 py-2"
               
              >
                Send
              </button>
            </div>
      </div>
      </div>
    )
}

export default Requestrefund;