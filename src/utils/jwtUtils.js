const fetch = require("node-fetch");

const verifyJwt = async (req, res, next) => {
  const token = req.headers["authorization"];
  // const { token } = req.body; // send JWT in body (works)

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const response = await fetch("http://localhost:3000/auth/verifyjwt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token.replace("Bearer ", ""),
        // token: token, // from req.body value
      }),
    });

    if (!response.ok) {
      return res.status(401).json({ message: "Token verification failed" });
    }

    const data = await response.json();

    if (data.verified) {
      req.user = data.message;
      next();
    } else {
      return res.status(401).json({ message: "Token verification failed" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyJwt };
