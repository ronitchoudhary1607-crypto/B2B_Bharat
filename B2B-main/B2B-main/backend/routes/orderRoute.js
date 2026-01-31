import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {authorizeRoles} from '../middleware/authorizeRoles.js';
import { placeOrder, getRetailerOrders,getWholeSalerOrders } from '../controller/order-controller.js';
import { getAvailableOrders,acceptOrder,markOutForDelivery,markDelivered ,getAgentOrders} from '../controller/agent-controller.js';

const orderRoute = express.Router();

orderRoute.use(verifyToken);

orderRoute.post('/',authorizeRoles("RETAILER"),placeOrder);
orderRoute.get('/retailer',authorizeRoles("RETAILER"),getRetailerOrders);

orderRoute.get('/wholesaler',authorizeRoles("WHOLESALER"),getWholeSalerOrders);

orderRoute.get('/agent',authorizeRoles("AGENT"),getAgentOrders);
orderRoute.get('/available',authorizeRoles("AGENT"),getAvailableOrders);
orderRoute.post('/:orderId/accept',authorizeRoles("AGENT"),acceptOrder);
orderRoute.post('/:orderId/out-for-delivery',authorizeRoles("AGENT"),markOutForDelivery);
orderRoute.post('/:orderId/delivered',authorizeRoles("AGENT"),markDelivered);

export default orderRoute;