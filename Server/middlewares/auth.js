import jwt  from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader;

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        req.userId = decoded.userId; // Attach userId to request object
        console.log("after decoded:", req.userId);
        next(); // Proceed to the next middleware/controller
    } catch (err) {
        console.error("Authentication error:", err);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

const qrMiddleware = (req,res,next) => {
    try{
        const token = req.params.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Attach userId to request object
        
        next(); // Proceed to the next middleware/controller
    }
    catch(err){
        console.error("Authentication error:", err);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
}

export { authMiddleware,qrMiddleware };
