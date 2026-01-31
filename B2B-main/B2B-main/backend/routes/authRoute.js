import express from 'express';
import { registerRoute ,loginRoute ,getMe ,logoutRoute } from '../controller/auth-controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const authRoute = express.Router();

authRoute.post('/register',registerRoute);
authRoute.post('/login',loginRoute);
authRoute.get('/me',verifyToken ,getMe);
authRoute.post('/logout',logoutRoute);

export default authRoute;