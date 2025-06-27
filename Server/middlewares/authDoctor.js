import jwt from 'jsonwebtoken'

//admin authentication middleware
const authDoctor = async(req,res,next) => {
    try{
        const {dtoken} = req.headers;

        if(!dtoken){
            return res.json({success:false,message:"Not authorized, Login again"})
        }

        const token_decode = jwt.verify(dtoken,process.env.JWT_SECRET)
        req.body.docId = token_decode.id;
        
        // console.log(req.body.userId);
        
        next();
    }
    catch{
        console.log("error in authentication of admin : ",err);
        res.json({success:false,message:err.message})
    }
}

export default authDoctor