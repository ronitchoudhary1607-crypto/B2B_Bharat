import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { addStock,getMyStock,updateStock,deleteStock } from "../controller/stock-controller.js";
import verifiedWholesaler from "../middleware/verifiedWholesaler.js";

const stockRoute = express.Router();

stockRoute.use(verifyToken);
stockRoute.use(authorizeRoles("WHOLESALER"));
stockRoute.use(verifiedWholesaler);

stockRoute.post("/", addStock);          
stockRoute.get("/", getMyStock);        
stockRoute.put("/:stockId", updateStock);
stockRoute.delete("/:stockId", deleteStock);

export default stockRoute;
