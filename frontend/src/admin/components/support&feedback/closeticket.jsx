import { Download } from 'lucide-react';


const Closeticket =()=>{

    return(
        <div
            className="py-12 text-white px-8 mt-6 shadow-md text-white font-inter w-full overflow-x-auto"
  style={{
    backgroundImage: ` url('/bgimg.png')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}
          >
            <p className="text-lg font-medium mb-2">Issue With My Aneuro Dashboard Access:</p>
            <p className="text-sm leading-6 mb-4 opacity-80">
              Hi Aneuro Support Team,
              <br />
              <br />
              I’m experiencing an issue with my dashboard. Whenever I try to access the “Results Overview”
              section, the page either fails to load or shows an error message.
              <br />
              Could you please look into this? I’ve attached a screenshot for reference.
              <br />
              Looking forward to your assistance.
              <br />
              <br />
              Best regards,
              <br />
              Alice Roy
            </p>

            {/* Attachment */}
            <div className="flex items-center gap-2 bg-[#202735] border border-[#12DCF0] px-4 py-3 mt-8 w-max ">
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs">PDF</div>
              <div className="text-sm">Doc.Pdf</div>
              <div className="text-xs text-gray-400">20KB</div>
              <button>
                <Download className="text-white text-lg" />
              </button>
            </div>

            <div className='border border-[#FFFFFF8F] border-2 p-8 mt-14'>
              <div className='flex flex-row items-center gap-4'>
                   <img src='/Avatar.png' alt='img'/>
                   <div className='flex flex-row items-center gap-2 text-[16px]'>
                     <p className='font-semibold'>Reply To:</p>
                     <p>Devon Lane 13@gmail.</p>
                   </div>
              </div>

              <p className='mt-5 text-[14px] opacity-80 font-medium'>
                Your Support Ticket Has Been Closed
                <br/><br/>
                The issue you reported has been successfully resolved by our team. We appreciate your patience and hope everything is working smoothly now.
                </p>

                <p className='mt-6 text-[11px] opacity-80'>Still facing issue?</p>
                <button className='text-[15px] text-[#0A1108] font-bold bg-[#12DCF0] mt-1 px-6 py-3'>
                    Reopen Ticket
                </button>
 
            </div>
          </div>
    )
}

export default Closeticket;