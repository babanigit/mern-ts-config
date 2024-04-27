"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsDefine = void 0;
function assertIsDefine(str, val) {
    if (!val) {
        console.log("error from assertIsDefine");
        throw new Error("Expected 'val' to be defined, but received " + val);
    }
    else {
        console.log("assert value of", str, val);
    }
}
exports.assertIsDefine = assertIsDefine;
