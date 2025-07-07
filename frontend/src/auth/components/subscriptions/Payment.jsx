import React, { useState } from "react";

const CYAN = "#12DCF0";

// Placeholder icons (replace with real images if available)
const MastercardIcon = () => (
  <svg
    width="32"
    height="20"
    viewBox="0 0 32 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="10" r="8" fill="#EB001B" />
    <circle cx="20" cy="10" r="8" fill="#F79E1B" fillOpacity="0.8" />
  </svg>
);
const VisaIcon = () => (
  <svg
    width="32"
    height="20"
    viewBox="0 0 32 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="4" width="28" height="12" rx="2" fill="#fff" />
    <text
      x="16"
      y="14"
      textAnchor="middle"
      fontSize="10"
      fill="#1A1F71"
      fontFamily="Arial"
    >
      VISA
    </text>
  </svg>
);

const Payment = ({ onClose, onPay }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onPay) onPay({ cardNumber, expiry, cvc, name });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="relative bg-black rounded-lg p-6 w-full max-w-lg mx-auto"
        style={{ boxShadow: `0 0 80px 10px ${CYAN}40` }}
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-6 text-white text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Heading */}
        <h2 className="text-white text-2xl md:text-3xl font-bold text-center mb-2 tracking-wide">
          ENTER YOUR PAYMENT DETAILS
        </h2>
        <p className="text-gray-300 text-center text-sm mb-6">
          Complete your payment securely to finish signing up.
        </p>
        {/* Card selection box */}
        <div className="border border-gray-600 rounded mb-8 flex items-center px-5 py-4">
          <span className="mr-4 flex items-center justify-center">
            <span
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center border-cyan-400"
              style={{ borderColor: CYAN }}
            >
              <span
                className="w-3.5 h-3.5 rounded-full"
                style={{ background: CYAN }}
              />
            </span>
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-bold">Credit Card</span>
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Safe money transfer using your bank account
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <MastercardIcon />
            <VisaIcon />
          </div>
        </div>
        {/* Payment form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Card Holder Name
            </label>
            <input
              type="text"
              placeholder="Alice Roy"
              className="bg-[#181818] border border-gray-600 rounded px-4 py-3 w-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="cc-name"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Credit card number
            </label>
            <input
              type="text"
              placeholder="123 123 123 123 123"
              className="bg-[#181818] border border-gray-600 rounded px-4 py-3 w-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength={19}
              required
              autoComplete="cc-number"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-300 text-sm mb-1">
                CVV Code
              </label>
              <input
                type="text"
                placeholder="234"
                className="bg-[#181818] border border-gray-600 rounded px-4 py-3 w-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                maxLength={4}
                required
                autoComplete="cc-csc"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-300 text-sm mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                className="bg-[#181818] border border-gray-600 rounded px-4 py-3 w-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength={5}
                required
                autoComplete="cc-exp"
              />
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-3 px-10 rounded transition-colors duration-200"
              style={{ background: CYAN, minWidth: 140 }}
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
