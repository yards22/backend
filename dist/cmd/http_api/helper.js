"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OAuth2Client = require("google-auth-library").OAuth2Client;
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// this function checks the integrity of the googleIdToken and outputs the user data
function verifyGoogleIdTokenAndGetUserData(googleIdToken) {
    return new Promise(function (resolve, reject) {
        var client = new OAuth2Client(GOOGLE_CLIENT_ID);
        return client
            .verifyIdToken({
            idToken: googleIdToken,
            audience: GOOGLE_CLIENT_ID,
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
