import scrypt from 'scrypt-js';

let _scrypt = scrypt

export const setScrypt = (scryptFn: typeof scrypt) => {
    _scrypt = scryptFn
}

const libraries = {
    get scrypt() {
        return _scrypt
    },
    set scrypt(scryptFn: typeof scrypt) {
        _scrypt = scryptFn
    }
}

export default libraries