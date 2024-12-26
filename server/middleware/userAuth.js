import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  // console.log("Token from cookies:", token); // Debug log
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Login Again" });
  }
  //supposed if the token is available , we should verify it
  try {
    //we need to decode the token store in the cookies
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", tokenDecode); // Debug log
    //if the token is valid, we should get the user id from the decoded token
    if (tokenDecode.id) {
      //it means it has the id
      req.body.userId = tokenDecode.id;
      // Attach userId to the request object
      // req.user = { id: tokenDecode.id };
      // console.log("User ID added to request body:", tokenDecode.id); // Debug log
     
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Login Again" });
    }
    next();
  } catch (error) {
    // console.error("Error verifying token:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default userAuth;
