import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerRoute = async (req ,res)=>{
    try{
        const {name , email , password ,role ,shopName ,latitude ,longitude} = req.body;

        if(!name || !email || !password || !role){
            return res.status(400).json({
                success : false,
                message : "Please fill all credentials"
            })
        }

        const allowedRole = ["RETAILER","WHOLESALER","AGENT"];
        if(!allowedRole.includes(role)){
            return res.status(400).json({
                success : false,
                message : "Invalid role selected"
            })
        }
        
        if(latitude === undefined || longitude === undefined){
            return res.status(400).json({
                success : false,
                message : "Location permission is required"
            })
        }

        if(role === 'RETAILER' && !shopName){
            return res.status(400).json({
                success : false,
                message : "Please fill ShopName"
            })
        }

        
        const findUser = await User.findOne({email});

        if(findUser){
            return res.status(409).json({
                success : false,
                message : "User already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const location = {
            type : "Point",
            coordinates : [Number(longitude),Number(latitude)]
        }
        const newUser = await User.create({
            name ,
            email ,
            password : hashedPassword,
            role ,
            shopName : role === "RETAILER" ? shopName : undefined,
            location,
            isActive : true,
            isBlocked : false,
            currentLoad : 0,
            verificationStatus : role === 'WHOLESALER'?"PENDING" : "VERIFIED"
        });

        if(newUser){
            return res.status(201).json({
                success : true,
                message : "User successfully registered",
                data : {
                    id : newUser._id,
                    name : newUser.name,
                    email : newUser.email,
                    role : newUser.role
                }
            })
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

export const loginRoute = async (req,res)=>{
    try{
        const {email ,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "Please Enter all valid credentials"
            })
        }

        const findUser = await User.findOne({email});

        if(!findUser){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }

        if(findUser.isBlocked){
            return res.status(403).json({
                success : false,
                message : "Blocked by admin"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, findUser.password);

        if(!isPasswordMatch){
            return res.status(401).json({
                success : false,
                message  : "Email or Password does not match"
            })
        }

        const token = jwt.sign({
            userId  : findUser._id,
            role : findUser.role
        },process.env.TOKEN_KEY,{
            expiresIn : '45m'
        })

        res.cookie('token',token,{
            httpOnly : true,
            maxAge : 45*60*1000,
            sameSite : 'lax',
            secure : process.env.NODE_ENV === 'production' 
        }) 

        return res.status(200).json({
            success : true,
            message : "User logged in successfully",
            user : {
                id : findUser._id,
                name :findUser.name,
                role : findUser.role,
                verificationStatus : findUser.verificationStatus
            }
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

export const getMe = async (req,res)=>{
    try{
        const getUser = await User.findById(req.user.userId).select('-password');

        if(!getUser){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }

        return res.status(200).json({
            success : true,
            user :  getUser
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

export const logoutRoute = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } 
  catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
