

const Subscriptiontier =()=>{

    return(
         <div className="flex flex-col gap-4  lg:flex-row items-center gap-7 w-full mt-8 ">
<div
  className="w-full p-4 flex flex-col gap-7 text-white md:h-[270px]"
  style={{
    background: `
      radial-gradient(circle at bottom right, rgba(28, 97, 104, 0.4), transparent 60%),
      #000000
    `,
    backgroundBlendMode: 'screen'
  }}
>              
             <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between w-full h-full">
                    <div className="flex flex-col gap-2">
                       <div className="flex flex-row gap-4 items-center">
                            <h1 className="text-[23px] text-medium">Starter Plan</h1>
                            <button className="px-5 py-1 rounded-full bg-[#D4F7D4] text-[#0B3C0C] text-[13px]">Active</button>
                       </div>
                       <p className="text-[13px] font-medium">Our popular plan for small teams</p>
                    </div>
                    <div className="flex flex-row items-center gap-2 ">
                        <p className="text-[52px] font-semibold">10$</p>
                        <p className="opacity-70 mt-6">per month</p>
                    </div>
                 </div>
                  
                  <div className="flex flex-col gap-2">
                      <p className="font-medium text-[15px]">10 of 20 users</p>
                      <div className="w-full h-2 rounded-lg bg-[#D9D9D9] ">
                        <div className="bg-[#12DCF0] w-[100px] h-2 rounded-lg"/>
                      </div>
                  </div>
                 
                 <button className="mt-3 border p-4 text-[15px] border-[#12DCF0]  w-[200px] cursor-pointer">
                    Upgrade plan
                 </button>
            </div>

            <div
                 className="w-full p-4 flex flex-col gap-7 text-white h-[270px]"
                 style={{
                   background: `
                     radial-gradient(circle at bottom right, rgba(28, 97, 104, 0.4), transparent 60%),
                     #000000
                   `,
                   backgroundBlendMode: 'screen'
                 }}
               >              
                    <div className="flex flex-col gap-2">
                            <h1 className="text-[23px] text-medium">Payment Method</h1>
                             <p className="text-[13px] font-medium">Change how you pay for your plan</p>
                    </div>
                  
                  <div className="flex flex-row items-center w-full justify-between mt-4">
                      <div className="flex flex-row items-center gap-4 ">
                          <img src="/v 1.png" alt="img" className="w-20 h-14"/>
                          <div className="flex flex-col gap-1 ">
                              <p className="text-[16px] font-medium">Visa ending in 1234</p>
                              <p className="opacity-70 text-[13px] font-medium">Expiry 20/2025</p>
                          </div>
                      </div>
                      <button className="text-black bg-[#12DCF0] px-10 py-2 text-[15px] cursor-pointer">Edit</button>
                  </div>
                 
                  
                
            </div>
         </div>
    )
}

export default Subscriptiontier