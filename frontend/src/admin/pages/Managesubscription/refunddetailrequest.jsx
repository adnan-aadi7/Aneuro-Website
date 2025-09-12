import { useState } from "react";
import { Download } from "lucide-react";
import Modal from "../../components/supportAndfeedback/modal";
import Texteditor from "../../components/subscription/texteditor";

const Refunddetail = () => {
  const [showModal, setShowModal] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [showModal1, setShowModal1] = useState(false);

  return (
    <div className="text-white">
      <div>
        <h1 className="text-[32px] font-medium inline-block pb-1">
          Refund Request Details
        </h1>
        <p className="text-[20px] opacity-70 mt-1">
          Let's make the day productive
        </p>
      </div>

      <div
        className="p-2 md:p-8 mt-6 shadow-md text-white font-inter w-full overflow-x-auto"
        style={{
          background: `
            radial-gradient(circle at bottom right, rgba(29, 116, 125, 0.4) 0%, transparent 30%),
            #2A2A39
          `,
          backgroundBlendMode: "normal",
        }}
      >
        {/* User Info */}
        <div className="flex items-center gap-4">
          <img
            src="/Frame 1000006611.png"
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">Devon Lane</p>
            <p className="text-sm text-gray-400">yourname@gmail.com</p>
          </div>
        </div>

        {/* Message Section */}
        <div
          className="py-12 text-white px-4 md:px-8 mt-8 shadow-md w-full overflow-x-auto"
          style={{
            backgroundImage: `url('/Group 1000004911.png')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <p className="text-lg font-medium mb-2">
            Issue With My Aneuro Dashboard Access:
          </p>
          <p className="text-sm leading-6 mb-4 opacity-80">
            Hi Aneuro Support Team,
            <br />
            <br />
            I'm experiencing an issue with my dashboard. Whenever I try to
            access the "Results Overview" section, the page either fails to load
            or shows an error message.
            <br />
            Could you please look into this? I've attached a screenshot for
            reference.
            <br />
            Looking forward to your assistance.
            <br />
            <br />
            Best regards,
            <br />
            Alice Roy
          </p>

          {/* Attachment */}
          <div className="flex items-center gap-2 bg-[#202735] border border-[#12DCF0] px-4 py-3 mt-8 w-max">
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs">
              PDF
            </div>
            <div className="text-sm">Doc.Pdf</div>
            <div className="text-xs text-gray-400">20KB</div>
            <button>
              <Download className="text-white text-lg" />
            </button>
          </div>
        </div>

        {/* Approve/Reject Buttons */}
        <div className="flex flex-row items-center gap-4 mt-8 mb-14">
          <button
            className="text-[#000000] font-bold text-[18px] px-10 py-3 cursor-pointer bg-[#12DCF0]"
            onClick={() => setShowModal(true)}
          >
            Approve
          </button>
          <button
            onClick={() => setShowModal1(true)}
            className="text-white font-bold text-[18px] px-10 py-3 cursor-pointer bg-[#F01212]"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-6 lg:w-[700px]">
            <h2 className="text-xl font-bold mb-4 text-[36px]">
              Refund Request Approved
            </h2>
            <p className="mb-6 text-sm opacity-80 text-[20px]">
              Your refund request has been approved. The amount of $200 will be
              processed back to your original payment method within 5–7 business
              days. Thank you for your understanding.
            </p>

            <div className="p-2 h-[240px] border-2 border-slate-300 text-black dark-quill-container">
              <Texteditor />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="bg-[#12DCF0] text-black font-medium px-4 py-2"
                onClick={() => {
                  console.log("Message:", editorValue);
                  setShowModal(false);
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showModal1 && (
        <Modal onClose={() => setShowModal1(false)}>
          <div className="p-6 lg:w-[700px]">
            <h2 className="text-xl font-bold mb-4 text-[36px]">
              Reason for rejection
            </h2>
            <p className="mb-6 text-sm opacity-80 text-[20px]">
              Your refund request has been reviewed, but it does not meet our
              refund policy criteria
            </p>

            <div className="p-2 h-[240px] border-2 border-slate-300 text-black dark-quill-container">
              <Texteditor />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="bg-[#12DCF0] text-black font-medium px-4 py-2"
                onClick={() => {
                  console.log("Message:", editorValue);
                  setShowModal(false);
                }}
              >
                Send Message
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Refunddetail;
