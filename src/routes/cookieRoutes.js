const express = require("express");
const cookieController = require("../controllers/cookie");
const router = express.Router();

router.post("/accept", cookieController.cookieConsentAccept);
router.post("/decline", cookieController.cookieConsentDecline);
router.get("/check", cookieController.checkCookieConsent);

module.exports = router;
