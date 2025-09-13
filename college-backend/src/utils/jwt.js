import jwt from "jsonwebtoken"

export const generateTokens = (user) => {
  const payload = { id: user._id, role: user.role,email:user.email };
  console.log("the payload for decoding is",payload)
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
