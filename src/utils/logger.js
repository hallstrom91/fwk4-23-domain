const winston = require('winston');
require('dotenv').config();
const path = require('path');
const cookie = require('../controllers/cookie');

//Don't forgett to create a file named: server.log in utils folder

const { combine, timestamp, json, cli } = winston.format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp()),

    transports: [
        new winston.transports.Console({
            format: combine(cli())
        }),
        new winston.transports.File({
            filename: path.join(__dirname, 'server.log'),
            format: json()
        }),
    ]
})

const logCookieConsent =(req) => {
    logger.info({
        host: req.host,
        consentStatus: "accepted",
        userId: req.user ? req.user.id : "anonymous",
        cookie: req.cookies.token ? req.cookies.token : "user not logged in",
        timestamp: new Date().toISOString(),
        ip: req.ip === "::1" ? "local(dev)" : req.ip,
    });
}

module.exports = { logger, logCookieConsent };