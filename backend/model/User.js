import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    userType: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    otp: String,
    otpExpires: Date,
    profileImage: {
      type: String,
      default: "",
    },
    subscription: {
      plan: {
        type: String,
        enum: ["starter", "growth", "enterprise", null],
        default: null,
      },
      status: {
        type: String,
        enum: ["active", "inactive", "canceled"],
        default: "inactive",
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      stripeSubscriptionId: {
        type: String,
        default: null,
      },
    },
lastLogin: {
  type: Date,
  default: null
},
   
    notificationPreferences: {
    newtool: { type: Boolean, default: true },
    quiz: { type: Boolean, default: true },
  }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
