import jwt from 'jsonwebtoken'

//admin authentication middleware
const authAdmin = async(req,res,next) => {
    try{
        const {atoken} = req.headers;

        if(!atoken){
            return res.json({success:false,message:"Not authorized, Login again"})
        }

        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET)

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"Not authorized, Login again"})
        }

        next();
    }
    catch{
        console.log("error in authentication of admin : ",err);
        res.json({success:false,message:err.message})
    }
}

export default authAdmin