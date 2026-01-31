import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    wholesaler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    productName: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    pricePerUnit: {
      type: Number,
      required: true,
      min: 0
    },
    
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
