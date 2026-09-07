const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {

    // Get Authorization header
    const authHeader = req.headers.authorization;


    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            success: false,
            message: "Access token required"
        });

    }


    // Extract token
    const token = authHeader.split(" ")[1];


    try {

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Store decoded user information
        req.user = decoded;


        // Continue to controller
        next();

    } catch (error) {

        console.error(error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }

};


module.exports = authMiddleware;