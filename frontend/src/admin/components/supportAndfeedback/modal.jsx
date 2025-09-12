const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 ">
      <div className="relative bg-[#2A2A39] p-2 flex flex-col items-start shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white text-2xl focus:outline-none cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
