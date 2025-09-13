import { verifyToken } from "../utils/jwt.js";

export const auth = (roles = []) => {
  return (req, res, next) => {
    const header = req.headers["authorization"];
    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];
    console.log("the token is",token)
    try {
      const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      console.log("the decode user is ",req.user)
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.log(err)
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};


