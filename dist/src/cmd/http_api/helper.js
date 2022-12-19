"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var OAuth2Client = require("google-auth-library").OAuth2Client;
// this function checks the integrity of the googleIdToken and outputs the user data
function verifyGoogleIdTokenAndGetUserData(googleIdToken) {
    return new Promise(function (resolve, reject) {
        var client = new OAuth2Client(config_1.default.get("googleClientId"));
        return client
            .verifyIdToken({
            idToken: googleIdToken,
            audience: config_1.default.get("googleClientId"),
        })
            .then(function (ticket) {
            // the integrity of the google id token has been confirmed and obtained data in payload
            var payload = ticket.getPayload();
            // returning the user data obtained in the payload
            return resolve(payload);
        })
            .catch(function (err) {
            // integrity check failed or the user has logged out
            // sending the error as unauthorized with status code 401
            return reject(err);
        });
    });
}
exports.default = verifyGoogleIdTokenAndGetUserData;
