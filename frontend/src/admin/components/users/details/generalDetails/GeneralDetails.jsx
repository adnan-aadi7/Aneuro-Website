import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { suspendUser, reactivateUser } from "../../../../../store/Slice/UserSlice";
import SuspendPopup from "./SuspendPopup";
import ReActivatedPupup from "./ReActivatedPupup";

export default function GeneralDetails({ user: userProp }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Prefer prop, fallback to location.state.user
  const [user, setUser] = useState(userProp || location.state?.user || {});
  const [showSuspend, setShowSuspend] = useState(false);
  const [showReactivate, setShowReactivate] = useState(false);

  // Update user state when prop changes
  useEffect(() => {
    setUser(userProp || location.state?.user || {});
  }, [userProp, location.state?.user]);

  const updateUserInLocationState = (updatedUser) => {
    // Update the location state with the new user data
    const newLocationState = {
      ...location.state,
      user: updatedUser
    };
    
    // Navigate to the same page with updated state (this preserves the URL)
    navigate(location.pathname, { 
      state: newLocationState,
      replace: true // This replaces the current history entry instead of adding a new one
    });
  };

  const handleSuspendUser = async () => {
    try {
      await dispatch(suspendUser(user._id)).unwrap();
      setShowSuspend(false);
      
      // Create updated user object
      const updatedUser = {
        ...user,
        accountStatus: "suspended"
      };
      
      // Update local state
      setUser(updatedUser);
      
      // Update location state so it persists after refresh
      updateUserInLocationState(updatedUser);
      
    } catch (error) {
      console.error("Suspend user error:", error);
    }
  };

  const handleReactivateUser = async () => {
    try {
      await dispatch(reactivateUser(user._id)).unwrap();
      setShowReactivate(false);
      
      // Create updated user object
      const updatedUser = {
        ...user,
        accountStatus: "active"
      };
      
      // Update local state
      setUser(updatedUser);
      
      // Update location state so it persists after refresh
      updateUserInLocationState(updatedUser);
      
    } catch (error) {
      console.error("Reactivate user error:", error);
    }
  };

  const CircularProgress = ({ percentage }) => {
    const size = 20;
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(percentage, 100));
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="flex items-center gap-2">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#D1FADF"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#19E05A"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.4s" }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
      </div>
    );
  };

  const formFields = [
    {
      label: "User ID",
      value: user?._id || "N/A",
    },
    {
      label: "Email account",
      value: user?.email || "N/A",
    },
    {
      label: "Subscription Tier",
      value: user.subscription?.plan || "N/A",
    },
    {
      label: "Signup Date",
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
    },
    {
      label: "Account Status",
      value: user?.accountStatus === "suspended" ? "Suspended" : "Active",
      type: "status",
    },
    {
      label: "Quiz Engagement",
      value: `${(user?.quizProgress?.completionPercentage ?? 0)}%`,
      type: "progress",
      percentage: user?.quizProgress?.completionPercentage ?? 0,
    },
  ];

  return (
    <div className="w-full sm:max-w-lg bg-[#2A2A39] p-3 sm:p-6 space-y-6">
      {formFields.map((field, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-white text-sm font-medium">{field.label}</label>
            <div className="flex items-center gap-2">
              {field.type === "progress" ? (
                <>
                  <span className="text-slate-300 text-sm">{field.value}</span>
                  <CircularProgress percentage={field.percentage} />
                </>
              ) : field.type === "status" ? (
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  field.value === "Suspended" 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {field.value}
                </span>
              ) : (
                <span className="text-slate-300 text-sm">{field.value}</span>
              )}
            </div>
          </div>
          <hr className="border-slate-600" />
        </div>
      ))}

      {/* Buttons */}
      <div className="pt-4 flex flex-row gap-3">
        {user?.accountStatus === "suspended" ? (
          <button
            onClick={() => setShowReactivate(true)}
            className="px-3 sm:px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap rounded"
          >
            Reactivate Account
          </button>
        ) : (
          <button
            onClick={() => setShowSuspend(true)}
            className="px-2 sm:px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap rounded"
          >
            Suspend Account
          </button>
        )}
      </div>

      <SuspendPopup 
        open={showSuspend} 
        onClose={() => setShowSuspend(false)} 
        onSuspend={handleSuspendUser}
      />
      <ReActivatedPupup 
        open={showReactivate} 
        onClose={() => setShowReactivate(false)} 
        onReactivate={handleReactivateUser}
      />
    </div>
  );
}
