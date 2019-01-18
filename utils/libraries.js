"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var scrypt_js_1 = __importDefault(require("scrypt-js"));
var pbkdf2_1 = require("./pbkdf2");
var _pbkdf2 = pbkdf2_1.pbkdf2;
var _scrypt = scrypt_js_1.default;
var libraries = {
    get scrypt() {
        return _scrypt;
    },
    set scrypt(scryptFn) {
        _scrypt = scryptFn;
    },
    get pbkdf2() {
        return _pbkdf2;
    },
    set pbkdf2(pbkdf2Fn) {
        _pbkdf2 = pbkdf2Fn;
    }
};
exports.default = libraries;
