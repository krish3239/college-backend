import User from "./auth.model.js";
import { registerUser, loginUser } from "./auth.service.js";

// ✅ Register Controller
export const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email  is required" });
    }

    // Normalize empty strings to null before passing to the service
    const normalizedEmail = email === "" ? null : email;
    const user = await registerUser(normalizedEmail,password, role);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    next(err);
  }
};

// ✅ Login Controller (with cookie)
export const login = async (req, res, next) => {
  try {
    const { email,password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email  required" });
    }

    const { user, tokens } = await loginUser(email, password);

    // 👇 Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only on HTTPS in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 👇 Return only access token + user info in response
    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        rollNumber:user.rollNumber
      },
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// ✅ Refresh Token Controller
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const tokens = generateTokens(user);

    // update cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (err) {
    next(err);
  }
};

// ✅ Logout Controller
export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out successfully" });
};
