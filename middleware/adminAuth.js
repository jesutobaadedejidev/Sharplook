import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    //whenever we would call the api from the adminAuth, then in the headers we would add the token that we are getting from the admin login
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
