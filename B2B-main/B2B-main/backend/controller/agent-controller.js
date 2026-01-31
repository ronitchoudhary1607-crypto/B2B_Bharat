import Order from '../models/Order.js'
import User from '../models/User.js'

export const getAvailableOrders = async (req, res) => {
  try {
    const agentId = req.user.userId;

    const agent = await User.findById(agentId);
    if (!agent || !agent.location) {
      return res.status(400).json({
        success: false,
        message: "Agent location not found"
      });
    }

    const orders = await Order.find({
      status: "CREATED",
      agent: null,
      deliveryLocation: {
        $near: {
          $geometry: agent.location,
          $maxDistance: 15000
        }
      }
    })
      .populate("retailer", "name shopName")
      .populate("items.wholesaler", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const agentId = req.user.userId;
    const { orderId } = req.params;

    const agent = await User.findById(agentId);
    if (!agent || !agent.location) {
      return res.status(400).json({
        success: false,
        message: "Agent location not found"
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: "CREATED",
        agent: null,
        deliveryLocation: {
          $near: {
            $geometry: agent.location,
            $maxDistance: 15000
          }
        }
      },
      {
        $set: {
          agent: agentId,
          status: "AGENT_ASSIGNED"
        },
        $inc: { __v: 1 }
      },
      { new: true }
    )
      .populate("retailer", "name")
      .populate("items.wholesaler", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not available"
      });
    }

    await User.findByIdAndUpdate(agentId, {
      $inc: { currentLoad: 1 }
    });

    return res.status(200).json({
      success: true,
      message: "Order assigned to agent",
      data: {
        orderId: order._id,
        status: order.status
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const markOutForDelivery = async (req, res) => {
  try {
    const agentId = req.user.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      agent: agentId,
      status: "AGENT_ASSIGNED"
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or invalid status"
      });
    }

    order.status = "OUT_FOR_DELIVERY";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order marked as OUT FOR DELIVERY",
      data: {
        orderId: order._id,
        status: order.status
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const markDelivered = async (req, res) => {
  try {
    const agentId = req.user.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      agent: agentId,
      status: "OUT_FOR_DELIVERY"
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or cannot be delivered"
      });
    }

    order.status = "DELIVERED";
    await order.save();

    await User.findByIdAndUpdate(agentId, {
      $inc: { currentLoad: -1 }
    });

    return res.status(200).json({
      success: true,
      message: "Order delivered successfully",
      data: {
        orderId: order._id,
        status: order.status
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const getAgentOrders = async (req, res) => {
  try {
    const agentId = req.user.userId;

    const orders = await Order.find({ agent: agentId })
      .populate("retailer", "name email")
      .populate("items.wholesaler", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch agent orders"
    });
  }
};
