import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send("You are not authenticated");
    jwt.verify(token, process.env.JWT_SECRET, async (error, payload) => {
        if (error) return res.status(403).send("Token is invalid");
        req.userId = payload.userId;
        next();
    })
}

export {
    verifyToken,
}