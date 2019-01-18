"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// See: https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
// See: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
var errors = __importStar(require("../errors"));
// The English language word list.
// For additional word lists, please see /src.tc/wordlists/
var lang_en_1 = require("../wordlists/lang-en");
// Automatically register English?
//import { register } from '../wordlists/wordlist';
//register(langEn);
var bytes_1 = require("./bytes");
var bignumber_1 = require("./bignumber");
var utf8_1 = require("./utf8");
var hmac_1 = require("./hmac");
var properties_1 = require("./properties");
var secp256k1_1 = require("./secp256k1");
var sha2_1 = require("./sha2");
var N = bignumber_1.bigNumberify("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
var libraries_1 = __importDefault(require("./libraries"));
// "Bitcoin seed"
var MasterSecret = utf8_1.toUtf8Bytes("Bitcoin seed");
var HardenedBit = 0x80000000;
// Returns a byte with the MSB bits set
function getUpperMask(bits) {
    return ((1 << bits) - 1) << (8 - bits);
}
// Returns a byte with the LSB bits set
function getLowerMask(bits) {
    return (1 << bits) - 1;
}
var _constructorGuard = {};
exports.defaultPath = "m/44'/60'/0'/0/0";
var HDNode = /** @class */ (function () {
    /**
     *  This constructor should not be called directly.
     *
     *  Please use:
     *   - fromMnemonic
     *   - fromSeed
     */
    function HDNode(constructorGuard, privateKey, chainCode, index, depth, mnemonic, path) {
        errors.checkNew(this, HDNode);
        if (constructorGuard !== _constructorGuard) {
            throw new Error("HDNode constructor cannot be called directly");
        }
        properties_1.defineReadOnly(this, "keyPair", new secp256k1_1.KeyPair(privateKey));
        properties_1.defineReadOnly(this, "privateKey", this.keyPair.privateKey);
        properties_1.defineReadOnly(this, "publicKey", this.keyPair.compressedPublicKey);
        properties_1.defineReadOnly(this, "address", secp256k1_1.computeAddress(this.publicKey));
        properties_1.defineReadOnly(this, "chainCode", bytes_1.hexlify(chainCode));
        properties_1.defineReadOnly(this, "index", index);
        properties_1.defineReadOnly(this, "depth", depth);
        properties_1.defineReadOnly(this, "mnemonic", mnemonic);
        properties_1.defineReadOnly(this, "path", path);
        properties_1.setType(this, "HDNode");
    }
    HDNode.prototype._derive = function (index) {
        // Public parent key -> public child key
        if (!this.privateKey) {
            if (index >= HardenedBit) {
                throw new Error("cannot derive child of neutered node");
            }
            throw new Error("not implemented");
        }
        var data = new Uint8Array(37);
        // Base path
        var mnemonic = this.mnemonic;
        var path = this.path;
        if (path) {
            path += "/" + (index & ~HardenedBit);
        }
        if (index & HardenedBit) {
            // Data = 0x00 || ser_256(k_par)
            data.set(bytes_1.arrayify(this.privateKey), 1);
            // Hardened path
            if (path) {
                path += "'";
            }
        }
        else {
            // Data = ser_p(point(k_par))
            data.set(this.keyPair.publicKeyBytes);
        }
        // Data += ser_32(i)
        for (var i = 24; i >= 0; i -= 8) {
            data[33 + (i >> 3)] = (index >> (24 - i)) & 0xff;
        }
        var I = hmac_1.computeHmac(hmac_1.SupportedAlgorithms.sha512, this.chainCode, data);
        var IL = bignumber_1.bigNumberify(I.slice(0, 32));
        var IR = I.slice(32);
        var ki = IL.add(this.keyPair.privateKey).mod(N);
        return new HDNode(_constructorGuard, bytes_1.arrayify(ki), IR, index, this.depth + 1, mnemonic, path);
    };
    HDNode.prototype.derivePath = function (path) {
        var components = path.split("/");
        if (components.length === 0 ||
            (components[0] === "m" && this.depth !== 0)) {
            throw new Error("invalid path");
        }
        if (components[0] === "m") {
            components.shift();
        }
        var result = this;
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (component.match(/^[0-9]+'$/)) {
                var index = parseInt(component.substring(0, component.length - 1));
                if (index >= HardenedBit) {
                    throw new Error("invalid path index - " + component);
                }
                result = result._derive(HardenedBit + index);
            }
            else if (component.match(/^[0-9]+$/)) {
                var index = parseInt(component);
                if (index >= HardenedBit) {
                    throw new Error("invalid path index - " + component);
                }
                result = result._derive(index);
            }
            else {
                throw new Error("invlaid path component - " + component);
            }
        }
        return result;
    };
    HDNode.isHDNode = function (value) {
        return properties_1.isType(value, "HDNode");
    };
    return HDNode;
}());
exports.HDNode = HDNode;
function _fromSeed(seed, mnemonic) {
    var seedArray = bytes_1.arrayify(seed);
    if (seedArray.length < 16 || seedArray.length > 64) {
        throw new Error("invalid seed");
    }
    var I = bytes_1.arrayify(hmac_1.computeHmac(hmac_1.SupportedAlgorithms.sha512, MasterSecret, seedArray));
    return new HDNode(_constructorGuard, I.slice(0, 32), I.slice(32), 0, 0, mnemonic, "m");
}
function fromMnemonic(mnemonic, wordlist) {
    return __awaiter(this, void 0, void 0, function () {
        var seed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check that the checksum s valid (will throw an error)
                    mnemonicToEntropy(mnemonic, wordlist);
                    return [4 /*yield*/, mnemonicToSeed(mnemonic)];
                case 1:
                    seed = _a.sent();
                    return [2 /*return*/, _fromSeed(seed, mnemonic)];
            }
        });
    });
}
exports.fromMnemonic = fromMnemonic;
function fromSeed(seed) {
    return _fromSeed(seed, null);
}
exports.fromSeed = fromSeed;
function mnemonicToSeed(mnemonic, password) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!password) {
                        password = "";
                    }
                    salt = utf8_1.toUtf8Bytes("mnemonic" + password, utf8_1.UnicodeNormalizationForm.NFKD);
                    return [4 /*yield*/, libraries_1.default.pbkdf2(utf8_1.toUtf8Bytes(mnemonic, utf8_1.UnicodeNormalizationForm.NFKD), salt, 2048, 64, "sha512")];
                case 1:
                    buf = _a.sent();
                    return [2 /*return*/, bytes_1.hexlify(buf)];
            }
        });
    });
}
exports.mnemonicToSeed = mnemonicToSeed;
function mnemonicToEntropy(mnemonic, wordlist) {
    if (!wordlist) {
        wordlist = lang_en_1.langEn;
    }
    errors.checkNormalize();
    var words = wordlist.split(mnemonic);
    if (words.length % 3 !== 0) {
        throw new Error("invalid mnemonic");
    }
    var entropy = bytes_1.arrayify(new Uint8Array(Math.ceil((11 * words.length) / 8)));
    var offset = 0;
    for (var i = 0; i < words.length; i++) {
        var index = wordlist.getWordIndex(words[i].normalize("NFKD"));
        if (index === -1) {
            throw new Error("invalid mnemonic");
        }
        for (var bit = 0; bit < 11; bit++) {
            if (index & (1 << (10 - bit))) {
                entropy[offset >> 3] |= 1 << (7 - (offset % 8));
            }
            offset++;
        }
    }
    var entropyBits = (32 * words.length) / 3;
    var checksumBits = words.length / 3;
    var checksumMask = getUpperMask(checksumBits);
    var checksum = bytes_1.arrayify(sha2_1.sha256(entropy.slice(0, entropyBits / 8)))[0];
    checksum &= checksumMask;
    if (checksum !== (entropy[entropy.length - 1] & checksumMask)) {
        throw new Error("invalid checksum");
    }
    return bytes_1.hexlify(entropy.slice(0, entropyBits / 8));
}
exports.mnemonicToEntropy = mnemonicToEntropy;
function entropyToMnemonic(entropy, wordlist) {
    entropy = bytes_1.arrayify(entropy);
    if (entropy.length % 4 !== 0 || entropy.length < 16 || entropy.length > 32) {
        throw new Error("invalid entropy");
    }
    var indices = [0];
    var remainingBits = 11;
    for (var i = 0; i < entropy.length; i++) {
        // Consume the whole byte (with still more to go)
        if (remainingBits > 8) {
            indices[indices.length - 1] <<= 8;
            indices[indices.length - 1] |= entropy[i];
            remainingBits -= 8;
            // This byte will complete an 11-bit index
        }
        else {
            indices[indices.length - 1] <<= remainingBits;
            indices[indices.length - 1] |= entropy[i] >> (8 - remainingBits);
            // Start the next word
            indices.push(entropy[i] & getLowerMask(8 - remainingBits));
            remainingBits += 3;
        }
    }
    // Compute the checksum bits
    var checksum = bytes_1.arrayify(sha2_1.sha256(entropy))[0];
    var checksumBits = entropy.length / 4;
    checksum &= getUpperMask(checksumBits);
    // Shift the checksum into the word indices
    indices[indices.length - 1] <<= checksumBits;
    indices[indices.length - 1] |= checksum >> (8 - checksumBits);
    if (!wordlist) {
        wordlist = lang_en_1.langEn;
    }
    return wordlist.join(indices.map(function (index) { return wordlist.getWord(index); }));
}
exports.entropyToMnemonic = entropyToMnemonic;
function isValidMnemonic(mnemonic, wordlist) {
    try {
        mnemonicToEntropy(mnemonic, wordlist);
        return true;
    }
    catch (error) { }
    return false;
}
exports.isValidMnemonic = isValidMnemonic;
