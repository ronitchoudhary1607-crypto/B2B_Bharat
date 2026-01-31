import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  wholesaler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    items: {
      type: [orderItemSchema],
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    deliveryLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "AGENT_ASSIGNED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "CREATED"
    }
  },
  { timestamps: true }
);

orderSchema.index({ deliveryLocation: "2dsphere" });

export default mongoose.model("Order", orderSchema);
