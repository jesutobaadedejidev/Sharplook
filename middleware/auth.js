//we would authenticate the user whenever the user will add product in the cart or update the cart data or whenever user will place order
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    //Adding the userId to the body of request from this decoded token
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
