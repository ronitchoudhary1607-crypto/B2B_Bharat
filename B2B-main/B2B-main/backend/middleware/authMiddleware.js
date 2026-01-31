import jwt from 'jsonwebtoken';

export const verifyToken = (req,res,next)=>{
    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({
            success : false,
            message : "Unauthorized"
        })
    }

    try{
        const decodedToken = jwt.verify(token , process.env.TOKEN_KEY);
        req.user = decodedToken;
        next();
    }
    catch(e){
        console.log(e);
        return res.status(401).json({
            success : false,
            messgae : "Invalid Token"
        })
    }
}