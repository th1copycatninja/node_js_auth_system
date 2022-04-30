const jwt  =require("jsonwebtoken")

const isAuth = async(req,res,next) => {
    const token =req.cookies?.token|| req.header('Authorization').replace("Bearer ","");

    if(!token){
        return res.status(403).send("Please Provide token")
    }
    
    try {
        const decode=await jwt.verify(token,process.env.SECRET_KEY)
        req.user = decode;
        //you can bring info from db
    } catch (error) {
        return res.status(401).send("Token is invalid")
    }
    return next()
}

module.exports = isAuth;