

const Fact =()=>{

    return(
        <div className=" relative flex flex-col items-center justify-center mt-12 mb-12">
             <p className="bg-[#FFFFFF0F] w-[250px] px-6 py-2 rounded-full flex flex-row items-center gap-2 justify-center">
            <img src="/home/star.png" alt="img"/>
             OUR FACTS
          <img src="/home/star.png" alt="img"/>
          </p>

          <h1 className="text-[24px] lg:text-[48px] font-300 text-center leading-[60px] mt-8">
            86% of buying decisions happen
             <br/>  
            <span className=" font-bold bg-gradient-to-r from-[#12DCF0] via-[#0A95A3] to-[#0A95A3] bg-clip-text text-transparent">before logic kicks in</span>
          </h1>
          <p className="text-[#A7AABB] text-[16px] mt-3 text-center">Aneuro bridges that moment. It delivers pre-aligned content—built to resonate with how people process choices.</p>

        <div className="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-8 mt-12">

         <div className="absolute  -right-20 w-[600px] h-[500px] rounded-full top-10" >
          <img src="/home/Ellipse 31.png" alt="img"/>
    </div>
         <div className="w-[350px] rounded-2xl border border-[#FFFFFF0F] p-6"
             style={{
               backgroundImage: "url('/home/2a4e6ec3c93089e13583816aa0a23cbd6b76680f (1).png')",
               backgroundSize: "cover",
               backgroundRepeat: "no-repeat",
               backgroundPosition: "center",
               height: "270px",
             }}
           >
              <img src="/home/icn1.svg" alt="img"/> 
              <h1 className="text-[#12DCF0] font-bold text-[24px] mt-16">Pre-Logic Processing</h1>
              <p className="mt-2 text-[16px] text-[#A7AABB]">Decisions form in milliseconds before conscious evaluation begins</p>

           </div>

            <div className="w-[350px] rounded-2xl border border-[#FFFFFF0F] p-6"
             style={{
               backgroundImage: "url('/home/2a4e6ec3c93089e13583816aa0a23cbd6b76680f (1).png')",
               backgroundSize: "cover",
               backgroundRepeat: "no-repeat",
               backgroundPosition: "center",
               height: "270px",
             }}
           >
              <img src="/home/icn3.svg" alt="img"/> 
              <h1 className="text-[#12DCF0] font-bold text-[24px] mt-16">Cognitive Alignment</h1>
              <p className="mt-2 text-[16px] text-[#A7AABB]">Content that matches natural decision patterns creates instant resonance</p>

           </div>

            <div className="w-[350px] rounded-2xl border border-[#FFFFFF0F] p-6"
             style={{
               backgroundImage: "url('/home/2a4e6ec3c93089e13583816aa0a23cbd6b76680f (1).png')",
               backgroundSize: "cover",
               backgroundRepeat: "no-repeat",
               backgroundPosition: "center",
               height: "270px",
             }}
           >
              <img src="/home/icn2.svg" alt="img"/> 
              <h1 className="text-[#12DCF0] font-bold text-[24px] mt-16">Immediate Traction</h1>
              <p className="mt-2 text-[16px] text-[#A7AABB]">Higher engagement from the very first interaction with your brand</p>

           </div>
</div>

        </div>
    )
}

export default Fact;