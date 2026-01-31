import Stock from "../models/Stock.js";

export const addStock = async (req, res) => {
  try {
    const wholesalerId = req.user.userId;
    const { productName, pricePerUnit, quantity, category } = req.body;

    if (!productName || pricePerUnit == null || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "Name, price and quantity are required",
      });
    }

    const stock = await Stock.create({
      wholesaler: wholesalerId,
      productName,
      pricePerUnit,
      quantity,
      category,
    });
    
    return res.status(201).json({
      success: true,
      data: stock,
    });
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMyStock = async (req, res) => {
  try {
    const wholesalerId = req.user.userId;

    const stock = await Stock.find({ wholesaler: wholesalerId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: stock.length,
      data: stock,
    });
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateStock = async (req, res) => {
  try {
    const wholesalerId = req.user.userId;
    const { stockId } = req.params;
    const { quantity, pricePerUnit } = req.body;

    const stock = await Stock.findOne({
      _id: stockId,
      wholesaler: wholesalerId,
    });

    

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found",
      });
    }
    
    if (quantity !== undefined) stock.quantity = quantity;
    if (pricePerUnit !== undefined) stock.pricePerUnit = pricePerUnit;
    
    await stock.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: stock,
    });
  } 
  catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const wholesalerId = req.user.userId;
    const { stockId } = req.params;

    const stock = await Stock.findOneAndDelete({
      _id: stockId,
      wholesaler: wholesalerId,
    });

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found or not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stock deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
