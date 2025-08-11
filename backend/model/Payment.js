import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: false, 
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    plan: {
      type: String,
      enum: ["starter", "growth", "enterprise"],
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid", "pending", "succeeded", "failed", "canceled"],
      default: "unpaid",
    },
    customerEmail: {
      type: String,
      required: true,
    },
    receiptUrl: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    stripeSubscriptionId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Add compound index to prevent duplicate payments for the same subscription
PaymentSchema.index({ stripeSubscriptionId: 1, amount: 1 }, { unique: true, sparse: true });

// Add index for payment intent ID
PaymentSchema.index({ stripePaymentIntentId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema); 