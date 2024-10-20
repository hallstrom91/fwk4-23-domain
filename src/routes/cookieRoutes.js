const express = require("express");
const router = express.Router();
const {
  cookieConsentAccept,
  cookieConsentDecline,
  checkCookieConsent,
} = require("../controllers/cookieControllers.js");

router.post("/accept", cookieConsentAccept);
router.post("/decline", cookieConsentDecline);
router.get("/check", checkCookieConsent);

module.exports = router;
