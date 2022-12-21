"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToJson = void 0;
function ToJson(data) {
    return JSON.stringify(data, function (key, value) { return (typeof value === "bigint" ? value.toString() : value); } // return everything else unchanged
    );
}
exports.ToJson = ToJson;
