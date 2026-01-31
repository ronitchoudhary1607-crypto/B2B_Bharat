import User from "../models/User.js";

const verifiedWholesaler = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (user.role !== "WHOLESALER") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Wholesaler only"
      });
    }

    if (user.verificationStatus !== "VERIFIED") {
      return res.status(403).json({
        success: false,
        message: "Wholesaler not verified by admin"
      });
    }

    if (!user.isActive || user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account inactive or blocked"
      });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export default verifiedWholesaler;
