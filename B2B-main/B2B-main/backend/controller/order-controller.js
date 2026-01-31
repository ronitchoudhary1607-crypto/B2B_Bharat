import Order from "../models/Order.js";
import Stock from "../models/Stock.js";
import mongoose from "mongoose";

export const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const retailerId = req.user.userId;
    const { items, latitude, longitude } = req.body;

    if (!items?.length) {
      throw new Error("No items provided");
    }

    let orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const stocks = await Stock.find({
        productName: item.name,
        quantity: { $gt: 0 }
      }).session(session);

      const totalQty = stocks.reduce((s, i) => s + i.quantity, 0);
      if (totalQty < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }

    for (const item of items) {
      let requiredQty = item.quantity;

      const stocks = await Stock.find({
        productName: item.name,
        quantity: { $gt: 0 }
      }).sort({ quantity: -1 }).session(session);

      for (const stock of stocks) {
        if (requiredQty <= 0) break;

        const usedQty = Math.min(stock.quantity, requiredQty);

        orderItems.push({
          productId: stock._id,
          name: stock.productName,
          quantity: usedQty,
          price: stock.pricePerUnit,     
          wholesaler: stock.wholesaler
        });

        stock.quantity -= usedQty;
        await stock.save({ session });

        totalAmount += usedQty * stock.pricePerUnit;
        requiredQty -= usedQty;
      }
    }

    const order = await Order.create([{
      retailer: retailerId,
      items: orderItems,
      totalAmount,
      deliveryLocation: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      status: "CREATED" 
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      data: order[0]
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error(err);
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const getRetailerOrders = async (req, res) => {
  try {
    const retailerId = req.user.userId;

    const orders = await Order.find({ retailer: retailerId })
      .populate("items.wholesaler", "name email")
      .populate("agent", "name email")
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
      message: "Failed to fetch retailer orders"
    });
  }
};

export const getWholeSalerOrders = async (req, res) => {
  try {
    const wholesalerId = req.user.userId;

    const orders = await Order.find({
      "items.wholesaler": wholesalerId
    })
      .populate("retailer", "name email")
      .populate("agent", "name email")
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
      message: "Failed to fetch wholesaler orders"
    });
  }
};
