import scrypt from "scrypt-js";
import { pbkdf2 } from "./pbkdf2";

let _pbkdf2 = pbkdf2;
let _scrypt = scrypt;

const libraries = {
  get scrypt() {
    return _scrypt;
  },
  set scrypt(scryptFn: typeof scrypt) {
    _scrypt = scryptFn;
  },
  get pbkdf2() {
    return _pbkdf2;
  },
  set pbkdf2(pbkdf2Fn: typeof pbkdf2) {
    _pbkdf2 = pbkdf2Fn;
  }
};

export default libraries;
