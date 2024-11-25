const fetchUser = (req, res, next) => {
  // Log incoming request headers for debugging
  console.log("Request headers:", req.headers);

  // Use `cookie-parser` to parse cookies (ensure `cookie-parser` middleware is added to your app)
  const sessionId = req.cookies ? req.cookies["connect.sid"] : null;

  if (!sessionId) {
    console.error("Session ID missing in request cookies.");
    return res.status(401).json({ success: false, message: "Unauthorized: Missing session ID" });
  }

  // Validate session from `express-session`
  if (req.session && req.session.user) {
    console.log("Session valid. User authenticated:", req.session.user);

    // Attach user info to the request object for downstream middleware or routes
    req.user = req.session.user;
    next();
  } else {
    console.error("Unauthorized access: No valid session or user information.");
    return res.status(401).json({ success: false, message: "Unauthorized: Please login" });
  }
};

module.exports = fetchUser;
