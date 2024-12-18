const { logCookieConsent} = require('../../utils/logger.js');

const cookieConsentAccept = (req, res) => {
  res.cookie("cookieConsent", "accepted", {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: false, // true in https mode
    sameSite: "lax", // "lax" later to prevent csrf attacks
  });
  logCookieConsent(req); // audit - payload // access req.header
  res.status(200).json({ message: "Cookie consent accepted" });
};

const cookieConsentDecline = (req, res) => {
  res.cookie("cookieConsent", "declined", {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: false, // true in https mode
    sameSite: "lax",
  });
  res.status(200).json({ message: "Cookie consent declined" });
};

const checkCookieConsent = (req, res) => {
  const cookieConsent = req.cookies.cookieConsent;

  if (cookieConsent === "accepted" || cookieConsent === "declined") {
    res.status(200).json({ cookieConsent });
  } else {
    res.status(200).json({ cookieConsent: "missing" });
  }
};

module.exports = {
  cookieConsentAccept,
  cookieConsentDecline,
  checkCookieConsent,
};
