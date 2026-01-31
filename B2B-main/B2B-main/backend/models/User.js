import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["RETAILER", "WHOLESALER", "AGENT", "ADMIN"],
      required: true
    },

    location: {
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

    shopName: {
      type: String
    },

    contactNumber: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING"
    },

    rating: {
      type: Number,
      default: 0
    },

    availabilityStatus: {
      type: String,
      enum: ["AVAILABLE", "BUSY"],
      default: "AVAILABLE"
    },

    currentLoad: {
      type: Number,
      default: 0
    },

    isBlocked: {
      type: Boolean,
      default: false
    }
},{timestamps : true});

userSchema.index({ location: "2dsphere" });

export default mongoose.model('User',userSchema);


