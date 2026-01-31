import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import {
  getAllUsers,
  approveWholesaler,
  blockUser,
  unblockUser,
  getAllOrders
} from "../controller/admin-controller.js";

const adminRoute = express.Router();

adminRoute.use(verifyToken);
adminRoute.use(authorizeRoles("ADMIN"));

adminRoute.get("/users", getAllUsers);
adminRoute.patch("/wholesaler/:userId/approve", approveWholesaler);
adminRoute.patch("/users/:userId/block", blockUser);
adminRoute.patch("/users/:userId/unblock", unblockUser);

adminRoute.get("/orders", getAllOrders);

export default adminRoute;
