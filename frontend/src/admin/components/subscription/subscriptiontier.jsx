import React, { useEffect } from "react";
import { SiVisa } from "react-icons/si";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserCardInfo } from "../../../store/Slice/PaymentSlice";

const Subscriptiontier = ({ user }) => {
  const dispatch = useDispatch();
  const subscription = user?.subscription;
  const stripeProducts = useSelector((state) => state.payment.products);
  const { userCardInfo, userCardInfoLoading, userCardInfoError } = useSelector((state) => state.payment);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserCardInfo(user._id));
    }
  }, [dispatch, user?._id]);

  // Helper to get price from Stripe products by plan name
  const getStripePrice = (plan) => {
    if (!stripeProducts || stripeProducts.length === 0 || !plan) return "-";
    const match = stripeProducts.find(
      (p) =>
        p.plan?.toLowerCase() === plan.toLowerCase() ||
        p.name?.toLowerCase() === plan.toLowerCase()
    );
    return match && match.price ? `$${match.price}` : "-";
  };

  // Get card information
  const getCardInfo = () => {
    if (userCardInfoLoading) {
      return { brand: "Loading...", last4: "...", expMonth: "...", expYear: "..." };
    }

    if (userCardInfoError || !userCardInfo?.cards || userCardInfo.cards.length === 0) {
      return { brand: "No Card", last4: "N/A", expMonth: "N/A", expYear: "N/A" };
    }

    // Get the default card or first card
    const defaultCard = userCardInfo.cards.find(card => card.isDefault) || userCardInfo.cards[0];
    return {
      brand: defaultCard.card.brand.toUpperCase(),
      last4: defaultCard.card.last4,
      expMonth: defaultCard.card.expMonth.toString().padStart(2, '0'),
      expYear: defaultCard.card.expYear.toString().slice(-2)
    };
  };

  const cardInfo = getCardInfo();

  // Get card icon component based on brand
  const getCardIcon = (brand) => {
    switch (brand) {
      case 'VISA':
        return <SiVisa size={60} color="white" />;
      case 'MASTERCARD':
        return <span className="text-white text-lg font-bold">MC</span>;
      case 'AMEX':
        return <span className="text-white text-lg font-bold">AMEX</span>;
      case 'DISCOVER':
        return <span className="text-white text-lg font-bold">DISC</span>;
      default:
        return <span className="text-white text-lg font-bold">{brand}</span>;
    }
  };

  // Get card background color based on brand
  const getCardBgColor = (brand) => {
    switch (brand) {
      case 'VISA':
        return 'bg-[#232886]';
      case 'MASTERCARD':
        return 'bg-[#FF5F00]';
      case 'AMEX':
        return 'bg-[#006FCF]';
      case 'DISCOVER':
        return 'bg-[#FF6000]';
      default:
        return 'bg-[#232886]';
    }
  };

  return (
    <div className="flex flex-col gap-4  lg:flex-row items-center gap-7 w-full mt-8 ">
      <div
        className="w-full p-4 flex flex-col gap-7 text-white md:h-[270px]"
        style={{
          background: `
      radial-gradient(circle at bottom right, rgba(28, 97, 104, 0.4), transparent 60%),
      #000000
    `,
          backgroundBlendMode: "screen",
        }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4 items-center">
              <h1 className="text-[23px] text-medium">{subscription?.plan || "-"}</h1>
              <button className="px-5 py-1 rounded-full bg-[#D4F7D4] text-[#0B3C0C] text-[13px]">
                {subscription?.status || "-"}
              </button>
            </div>
            <p className="text-[13px] font-medium">
              Our popular plan for small teams
            </p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="text-[52px] font-semibold">{getStripePrice(subscription?.plan)}</p>
            <p className="opacity-70 mt-6">per month</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium text-[15px]">10 of 20 users</p>
          <div className="w-full h-2 rounded-lg bg-[#D9D9D9] ">
            <div className="bg-[#12DCF0] w-[100px] h-2 rounded-lg" />
          </div>
        </div>

        <div className="flex flex-row items-center w-full justify-end mt-4">
          {/* <button className="text-black bg-[#12DCF0] px-10 py-2 text-[15px] cursor-pointer">
            Upgrade
          </button> */}
        </div>
      </div>
      <div
        className="w-full p-4 flex flex-col gap-7 text-white h-[270px]"
        style={{
          background: `
                     radial-gradient(circle at bottom right, rgba(28, 97, 104, 0.4), transparent 60%),
                     #000000
                   `,
          backgroundBlendMode: "screen",
        }}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-[23px] text-medium">Payment Method</h1>
          <p className="text-[13px] font-medium">
            Change how you pay for your plan
          </p>
        </div>
        
        {userCardInfoLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-white">Loading card information...</div>
          </div>
        ) : userCardInfoError ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-400 text-sm">Failed to load card information</div>
          </div>
        ) : !userCardInfo?.hasCards ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-white text-sm">No payment method found</div>
          </div>
        ) : (
          <div className="flex flex-row items-center w-full justify-between mt-4">
            <div className="flex flex-row items-center gap-4 ">
              <div className={`rounded w-[60px] md:w-[70px] h-[32px] md:h-[40px] flex items-center justify-center ${getCardBgColor(cardInfo.brand)}`}>
                {getCardIcon(cardInfo.brand)}
              </div>
              <div className="flex flex-col gap-1 ">
                <p className="text-[16px] font-medium">
                  {cardInfo.brand === 'Loading...' ? 'Loading...' : 
                   cardInfo.brand === 'No Card' ? 'No payment method' :
                   `${cardInfo.brand} ending in ${cardInfo.last4}`}
                </p>
                <p className="opacity-70 text-[13px] font-medium">
                  {cardInfo.expMonth === 'N/A' ? 'No expiry date' :
                   `Expiry ${cardInfo.expMonth}/${cardInfo.expYear}`}
                </p>
              </div>
            </div>
            <button className="text-black bg-[#12DCF0] px-10 py-2 text-[15px] cursor-pointer">
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptiontier;
