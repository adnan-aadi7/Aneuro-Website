const Transformation = () => {
  return (
    <div className="relative w-full mb-16 overflow-hidden mt-12 lg:mt-0">
      {/* Smoothly blended radial gradient */}
      <div className="absolute  -left-32 w-[800px] h-[800px] rounded-full -top-44" >
          <img src="/home/Ellipse 30.png" alt="img"/>
    </div>

      {/* Content */}
      <div className="relative z-10 px-4 lg:px-16 text-white flex flex-row items-center gap-16">
            <div className="flex flex-col gap-4 w-full lg:w-3/5 lg:pl-24">
                  <div className="bg-[#FFFFFF0F] border border-white/50 w-[220px] flex items-center justify-center px-6 py-2 rounded-full flex flex-row items-center gap-2 text-[14px] text-[#A7AABB]">
                      <img src="/home/star.png" alt="img"/>
                      WHAT IS ANEURO
                        <img src="/home/star.png" alt="img"/>
                  </div>
                    <span className="text-[20px] lg:text-[48px] font-[150]">
                      Aneuro is not a tool. It’s a  <br/>
                     <div className="flex flex-row items-center gap-6">
                      <img src="/home/abioutustitle.png" alt="img"/>
                     <span className="bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3] bg-clip-text text-transparent">Transformation.</span>
                     </div>
                    
                  </span>
                  <hr className="bg-[#FFFFFF0F] h-px mt-4 mb-4 border-none" />
                  <div className="flex flex-col md:flex-row items-start lg:items-center justify-between gap-8">
                       <div className="flex flex-col gap-6">
                           <div className="flex flex-row items-center gap-4 text-[20px] font-bold">
                                <img src="/home/icon-about.png" alt="icon"/>
                                Industry-Focused <br/>Innovation
                           </div>
                           <p className="text-[#A7AABB]">Most platforms help you target.<br/> Aneuro helps you align. </p>
                       </div>
                       <div className="h-[100px] w-[1px] bg-[#FFFFFF0F] hidden lg:flex"/>
                       <div className="flex flex-col gap-4">
                           <div className="flex flex-row items-center gap-4 text-[20px] font-bold">
                                <img src="/home/icon-about2.png" alt="icon"/>
                                Tailored. By<br/> Cognition
                           </div>
                         <p className="text-[#A7AABB]">No manual setup. No one-size-fits-all<br/> templates. Just strategy, adapted to how<br/> your audience thinks. </p>
                       </div>
                  </div>

                  <button className="text-black  w-[180px] font-bold text-[16px] px-6 py-3 mt-8 cursor-pointer rounded-full bg-[linear-gradient(to_right,_#0A95A3,_#12DCF0,_#0A95A3)]">
                    more about us
                  </button>
                  
            </div>
           <div
              className="hidden lg:flex bg-[url('/home/bg.png')] bg-cover bg-center w-full h-[600px] text-[16px] mt-16 flex-1 rounded-lg py-8 px-8 justify-end font-bold flex"
            >
                Advanced AI solutions<br/>
                built on deep learning & <br/>
                neural networks.
            </div>
            
      </div>
    </div>
  );
};

export default Transformation;
