import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../../../../store/Slice/UserSlice";
import GeneralDetails from "../generalDetails/GeneralDetails";
import { useLocation } from "react-router-dom";
import SubscriptionTierExact from "../subscriptionTier/SubscriptionTierExact";
import BillingHistoryTable from "../subscriptionTier/BillingHistoryTable";
import DeletePopup from "../generalDetails/DeletePopup";
import GetCode from "../generalDetails/passwordReset/GetCode";
import EnterCode from "../generalDetails/passwordReset/EnterCode";
import CreateNewPassword from "../generalDetails/passwordReset/CreateNewPassword";
import ResetConfirmation from "../generalDetails/passwordReset/ResetConfirmation";
import Cards from "../quizEngaged/Cards";
import Charts from "../quizEngaged/Charts";
import QuizEngagedHeading from "../quizEngaged/QuizEngaedHeading";

export default function Tabs({ user: userProp }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Prefer prop, fallback to location.state.user
  const user = userProp || location.state?.user || {};
  const [activeTab, setActiveTab] = useState("General Details");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showGetCode, setShowGetCode] = useState(false);
  const [showEnterCode, setShowEnterCode] = useState(false);
  const [showCreateNewPassword, setShowCreateNewPassword] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [email] = useState("alice12@gmail.com"); // Example email

  const tabs = ["General Details", "Subscription Tier", "Quiz Engagement"];

  const handleReviewQuiz = () => {
    setShowDeletePopup(false);
  };

  const handleDeleteUser = async () => {
    try {
      await dispatch(deleteUser(user._id)).unwrap();
      setShowDeletePopup(false);
      // Navigate back to users list after successful deletion
      navigate("/admin/users");
    } catch (error) {
      console.error("Delete user error:", error);
      // You can show an error message here if needed
    }
  };

  const handleGetCode = () => {
    setShowGetCode(false);
    setShowEnterCode(true);
  };

  const handleContinue = () => {
    setShowEnterCode(false);
    setShowCreateNewPassword(true);
  };

  const handleResend = () => {
    // TODO: Implement resend logic
  };

  const handleResetPassword = () => {
    setShowCreateNewPassword(false);
    setShowResetConfirmation(true);
  };

  const handleResetConfirmationContinue = () => {
    setShowResetConfirmation(false);
  };

  return (
    <div className="w-full bg-[#2A2A39] p-4 sm:p-6 md:p-6 lg:p-6 xl:p-6 2xl:p-6 mt-4 sm:mt-8 md:mt-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        {/* User Info */}
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-slate-600">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="w-full h-full bg-[#2A2A39] rounded-full flex items-center justify-center text-white text-base sm:text-lg font-medium"
              style={{ display: user?.profileImage ? "none" : "flex" }}
            >
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </div>
          </div>
          <div>
            <h1 className="text-white text-lg sm:text-xl font-semibold">
              {user?.name || "User Name"}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              {user?.email || "user@email.com"}
            </p>
            {/* Account Status Badge */}
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
              user?.accountStatus === "suspended" 
                ? "bg-red-100 text-red-800" 
                : "bg-green-100 text-green-800"
            }`}>
              {user?.accountStatus === "suspended" ? "Suspended" : "Active"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-transparent border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors text-xs sm:text-sm font-medium"
            onClick={() => setShowDeletePopup(true)}
          >
            Delete Account
          </button>
          <button
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-transparent border border-slate-600 text-slate-300 rounded-md hover:bg-slate-700 hover:text-white transition-colors text-xs sm:text-sm font-medium"
            onClick={() => setShowGetCode(true)}
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* DeletePopup Modal */}
      <DeletePopup
        open={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onReviewQuiz={handleReviewQuiz}
        onDeleteUser={handleDeleteUser}
      />

      {/* GetCode Modal */}
      <GetCode
        open={showGetCode}
        onClose={() => setShowGetCode(false)}
        onGetCode={handleGetCode}
      />

      {/* EnterCode Modal */}
      <EnterCode
        open={showEnterCode}
        onClose={() => setShowEnterCode(false)}
        onContinue={handleContinue}
        onResend={handleResend}
        email={email}
      />

      {/* CreateNewPassword Modal */}
      <CreateNewPassword
        open={showCreateNewPassword}
        onClose={() => setShowCreateNewPassword(false)}
        onReset={handleResetPassword}
      />

      {/* ResetConfirmation Modal */}
      <ResetConfirmation
        open={showResetConfirmation}
        onClose={() => setShowResetConfirmation(false)}
        onContinue={handleResetConfirmationContinue}
      />

      {/* Tabs */}
      <div className="flex flex-row items-center gap-4 border-b border-slate-700 mt-6 sm:mt-10 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 pb-2 sm:pb-3 px-3 sm:px-0 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {activeTab === "General Details" && (
        <div className="mt-6 sm:mt-8 flex justify-start">
          <GeneralDetails user={user} />
        </div>
      )}
      {activeTab === "Subscription Tier" && (
        <div className="mt-6 sm:mt-8 flex flex-col gap-6 sm:gap-8">
          <SubscriptionTierExact user={user} />
          <BillingHistoryTable user={user} />
        </div>
      )}
      {activeTab === "Quiz Engagement" && (
        <div className="mt-6 sm:mt-8 flex flex-col gap-6 sm:gap-8">
         <QuizEngagedHeading />
         <Cards />
         <Charts />
        </div>
      )}
    </div>
  );
}
