import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubscription, clearPaymentState } from "../../../store/Slice/PaymentSlice";
import { useNavigate } from "react-router-dom";

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
  
  const Payment = ({ onClose, selectedPlan }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');
    const isEmailLocked = Boolean(localStorage.getItem('userEmail'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Stripe
    const [stripe, setStripe] = useState(null);
    const [cardElement, setCardElement] = useState(null);
    const cardElementRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux payment state
    const { subscriptionId, status, error: paymentError } = useSelector(state => state.payment);

    useEffect(() => {
      if (paymentError) {
        setError(paymentError);
        setIsLoading(false);
      }
    }, [paymentError]);

    useEffect(() => {
      // Handle successful subscription creation
      if (status === 'succeeded' && subscriptionId) {
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          dispatch(clearPaymentState());
          navigate('/quiz');
        }, 2000);
      }
    }, [status, subscriptionId, dispatch, navigate]);

    useEffect(() => {
      // Load Stripe.js
      const loadStripe = async () => {
        try {
          const stripeInstance = await window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
          setStripe(stripeInstance);
          const elementsInstance = stripeInstance.elements();
          const card = elementsInstance.create('card', {
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': { color: '#9ca3af' },
                backgroundColor: '#181818',
                border: '1px solid #4b5563',
                borderRadius: '4px',
                padding: '12px 16px',
              },
              invalid: {
                color: '#ef4444',
                borderColor: '#ef4444',
              },
            },
          });
          setCardElement(card);
          if (cardElementRef.current) {
            card.mount(cardElementRef.current);
          }
        } catch (error) {
          console.error('Failed to load Stripe:', error);
        }
      };
      if (window.Stripe) {
        loadStripe();
      } else {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = loadStripe;
        document.head.appendChild(script);
      }
    }, []);

    useEffect(() => {
      if (cardElement && cardElementRef.current) {
        cardElement.mount(cardElementRef.current);
      }
    }, [cardElement]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId || !email) {
        setError("You must be registered and logged in to make a payment.");
        setIsLoading(false);
        return;
      }
      try {
        if (!stripe || !cardElement) {
          setError('Stripe is not loaded. Please try again later.');
          setIsLoading(false);
          return;
        }
        
        // 1. Create payment method
        const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: { name, email }
        });
        
        if (pmError) {
          setError(pmError.message);
          setIsLoading(false);
          return;
        }
        
        // 2. Create subscription (this will automatically charge the customer)
        await dispatch(createSubscription({
          plan: selectedPlan.name.toLowerCase(),
          paymentMethodId: paymentMethod.id
        }));
        
        // Success will be handled in useEffect above
      } catch (err) {
        setError(err.message || 'Payment failed. Please try again.');
        setIsLoading(false);
      }
    };

    // Success state
    if (success) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="relative bg-black rounded-lg p-8 w-full max-w-md mx-auto text-center" style={{ boxShadow: `0 0 80px 10px ${CYAN}40` }}>
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h2 className="text-white text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-300 mb-4">Your {selectedPlan?.name} plan has been activated.</p>
            <div className="text-cyan-400 text-sm">Redirecting...</div>
          </div>
        </div>
      );
    }

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
            disabled={isLoading}
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
          
          {/* Plan Info */}
          {selectedPlan && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-center">
              <p className="text-white text-lg font-semibold">{selectedPlan.name} Plan</p>
              <p className="text-cyan-400 text-2xl font-bold">${selectedPlan.price}/month</p>
              <p className="text-gray-400 text-sm mt-1">Recurring monthly payment</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

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
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-[#181818] border border-gray-600 rounded px-4 py-3 w-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                value={email}
                onChange={(e) => {
                  if (!isEmailLocked) setEmail(e.target.value);
                }}
                required
                autoComplete="email"
                disabled={isLoading || isEmailLocked}
              />
              {isEmailLocked && (
                <div className="text-xs text-gray-400 mt-1">This email is from your signup and cannot be changed here.</div>
              )}
            </div>
            
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
                disabled={isLoading}
              />
            </div>
            
            {/* Stripe Card Element */}
            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Credit Card Details
              </label>
              <div 
                ref={cardElementRef}
                className="bg-[#181818] border border-gray-600 rounded px-4 py-3 w-full text-white focus-within:border-cyan-400 transition"
                style={{ minHeight: '48px' }}
              />
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="bg-cyan-400 hover:bg-cyan-300 text-black font-semibold py-3 px-10 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: CYAN, minWidth: 140 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Subscribe $${selectedPlan?.price || '0'}/month`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default Payment;
