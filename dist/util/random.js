"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateOTP = exports.RandomString = exports.RandomNumber = void 0;
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
var numbers = "0123456789";
function RandomString(n) {
    var result = "";
    var charactersLength = alphabet.length;
    for (var i = 0; i < n; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.RandomString = RandomString;
function RandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.RandomNumber = RandomNumber;
function GenerateOTP() {
    var otp = "";
    while (otp.length < 4) {
        var RandNumber = Math.floor(Math.random() * 10);
        otp +=
            RandNumber !== 0 ? RandNumber.toString() : (RandNumber + 1).toString();
    }
    return otp;
}
exports.GenerateOTP = GenerateOTP;
