import scrypt from "scrypt-js";
import { pbkdf2 } from "./pbkdf2";
declare const libraries: {
    scrypt: typeof scrypt;
    pbkdf2: typeof pbkdf2;
};
export default libraries;
