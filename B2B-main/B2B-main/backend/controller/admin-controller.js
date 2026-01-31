import User from "../models/User.js";
import Order from "../models/Order.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const approveWholesaler = async (req, res) => {
  try {
    const { userId } = req.params;

    const wholesaler = await User.findOne({
      _id: userId,
      role: "WHOLESALER"
    });

    if (!wholesaler) {
      return res.status(404).json({
        success: false,
        message: "Wholesaler not found"
      });
    }

    wholesaler.verificationStatus = "VERIFIED";
    await wholesaler.save();

    res.status(200).json({
      success: true,
      message: "Wholesaler approved"
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndUpdate(userId, { isBlocked: true });

    res.status(200).json({
      success: true,
      message: "User blocked"
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await User.findByIdAndUpdate(userId, { isBlocked: false });

    res.status(200).json({
      success: true,
      message: "User unblocked"
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("retailer", "name shopName")
      .populate("agent", "name")
      .populate("items.wholesaler", "name email") 
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}  