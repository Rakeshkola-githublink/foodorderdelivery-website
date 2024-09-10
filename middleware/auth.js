import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = tokenDecode.id;
        next();
    } catch (error) {
        // Detailed error handling
        if (error.name === 'JsonWebTokenError') {
            // This will catch errors related to the token itself, such as invalid signature
            console.error('Invalid JWT token:', error.message);
            return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
        } else if (error.name === 'TokenExpiredError') {
            // Handle token expiration
            console.error('JWT token expired:', error.message);
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        } else {
            // Handle other errors
            console.error('JWT verification error:', error);
            return res.status(500).json({ success: false, message: "Internal server error." });
        }
    }
};

export default authMiddleware;
