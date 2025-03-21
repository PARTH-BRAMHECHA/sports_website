import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    try {
        // For debugging - temporarily allow requests without authentication
        if (process.env.NODE_ENV === 'development') {
            console.log('Debug mode: Skipping authentication');
            req.user = { id: '000000000000000000000000', userType: 'admin' };
            return next();
        }

        const authHeader = req.header("Authorization");
        if (!authHeader) {
            console.log("Missing Authorization header");
            return res.status(403).json({ message: "Access denied" });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader;
            
        if (!token) {
            return res.status(403).json({ message: "Access denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
        
        if (decoded.userType !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};
