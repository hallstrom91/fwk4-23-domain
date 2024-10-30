const fetch = require("node-fetch");

const verifyJwt = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const response = await fetch("http://localhost:3000/auth/verifyjwt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
