
import { Download } from 'lucide-react';

const Openticket =()=>{

    return(
        <div
            className="py-12 text-white px-8 mt-6 shadow-md text-white font-inter w-full overflow-x-auto"
  style={{
    backgroundImage: ` url('/Group 1000004911.png')`,
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
          </div>
    )
}

export default Openticket;