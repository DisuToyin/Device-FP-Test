(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RayyanJS = {}));
})(this, (function (exports) { 'use strict';

    let options = {
        exclude: [],
        include: [],
        logging: true,
    };

    // components include a dictionary of name: function.
    const components = {};
    /**
     * includeComponent is the function each component function needs to call in order for the component to be included
     * in the fingerprint.
     * @param {string} name - the name identifier of the component
     * @param {componentFunctionInterface} creationFunction - the function that implements the component
     * @returns
     */
    const includeComponent = (name, creationFunction) => {
        if (typeof window !== 'undefined')
            components[name] = creationFunction;
    };
    /**
     * The function turns the map of component functions to a map of Promises when called
     * @returns {[name: string]: <Promise>componentInterface}
     */
    const getComponentPromises = () => {
        return Object.fromEntries(Object.entries(components)
            .filter(([key]) => {
            var _a;
            return !((_a = options === null || options === void 0 ? void 0 : options.exclude) === null || _a === void 0 ? void 0 : _a.includes(key));
        })
            .filter(([key]) => {
            var _a, _b, _c, _d;
            return ((_a = options === null || options === void 0 ? void 0 : options.include) === null || _a === void 0 ? void 0 : _a.some(e => e.includes('.')))
                ? (_b = options === null || options === void 0 ? void 0 : options.include) === null || _b === void 0 ? void 0 : _b.some(e => e.startsWith(key))
                : ((_c = options === null || options === void 0 ? void 0 : options.include) === null || _c === void 0 ? void 0 : _c.length) === 0 || ((_d = options === null || options === void 0 ? void 0 : options.include) === null || _d === void 0 ? void 0 : _d.includes(key));
        })
            .map(([key, value]) => [key, value()]));
    };
    const timeoutInstance = {
        'timeout': "true"
    };

    /**
     * This code is taken from https://github.com/LinusU/murmur-128/blob/master/index.js
     * But instead of dependencies to encode-utf8 and fmix, I've implemented them here.
     */
    function encodeUtf8(text) {
        const encoder = new TextEncoder();
        return encoder.encode(text).buffer;
    }
    function fmix(input) {
        input ^= (input >>> 16);
        input = Math.imul(input, 0x85ebca6b);
        input ^= (input >>> 13);
        input = Math.imul(input, 0xc2b2ae35);
        input ^= (input >>> 16);
        return (input >>> 0);
    }
    const C = new Uint32Array([
        0x239b961b,
        0xab0e9789,
        0x38b34ae5,
        0xa1e38b93
    ]);
    function rotl(m, n) {
        return (m << n) | (m >>> (32 - n));
    }
    function body(key, hash) {
        const blocks = (key.byteLength / 16) | 0;
        const view32 = new Uint32Array(key, 0, blocks * 4);
        for (let i = 0; i < blocks; i++) {
            const k = view32.subarray(i * 4, (i + 1) * 4);
            k[0] = Math.imul(k[0], C[0]);
            k[0] = rotl(k[0], 15);
            k[0] = Math.imul(k[0], C[1]);
            hash[0] = (hash[0] ^ k[0]);
            hash[0] = rotl(hash[0], 19);
            hash[0] = (hash[0] + hash[1]);
            hash[0] = Math.imul(hash[0], 5) + 0x561ccd1b;
            k[1] = Math.imul(k[1], C[1]);
            k[1] = rotl(k[1], 16);
            k[1] = Math.imul(k[1], C[2]);
            hash[1] = (hash[1] ^ k[1]);
            hash[1] = rotl(hash[1], 17);
            hash[1] = (hash[1] + hash[2]);
            hash[1] = Math.imul(hash[1], 5) + 0x0bcaa747;
            k[2] = Math.imul(k[2], C[2]);
            k[2] = rotl(k[2], 17);
            k[2] = Math.imul(k[2], C[3]);
            hash[2] = (hash[2] ^ k[2]);
            hash[2] = rotl(hash[2], 15);
            hash[2] = (hash[2] + hash[3]);
            hash[2] = Math.imul(hash[2], 5) + 0x96cd1c35;
            k[3] = Math.imul(k[3], C[3]);
            k[3] = rotl(k[3], 18);
            k[3] = Math.imul(k[3], C[0]);
            hash[3] = (hash[3] ^ k[3]);
            hash[3] = rotl(hash[3], 13);
            hash[3] = (hash[3] + hash[0]);
            hash[3] = Math.imul(hash[3], 5) + 0x32ac3b17;
        }
    }
    function tail(key, hash) {
        const blocks = (key.byteLength / 16) | 0;
        const reminder = (key.byteLength % 16);
        const k = new Uint32Array(4);
        const tail = new Uint8Array(key, blocks * 16, reminder);
        switch (reminder) {
            case 15:
                k[3] = (k[3] ^ (tail[14] << 16));
                break; // fallthrough
            case 14:
                k[3] = (k[3] ^ (tail[13] << 8));
                break; // fallthrough
            case 13:
                k[3] = (k[3] ^ (tail[12] << 0));
                k[3] = Math.imul(k[3], C[3]);
                k[3] = rotl(k[3], 18);
                k[3] = Math.imul(k[3], C[0]);
                hash[3] = (hash[3] ^ k[3]);
                break;
            // fallthrough
            case 12:
                k[2] = (k[2] ^ (tail[11] << 24));
                break; // fallthrough
            case 11:
                k[2] = (k[2] ^ (tail[10] << 16));
                break; // fallthrough
            case 10:
                k[2] = (k[2] ^ (tail[9] << 8));
                break; // fallthrough
            case 9:
                k[2] = (k[2] ^ (tail[8] << 0));
                k[2] = Math.imul(k[2], C[2]);
                k[2] = rotl(k[2], 17);
                k[2] = Math.imul(k[2], C[3]);
                hash[2] = (hash[2] ^ k[2]);
                break;
            // fallthrough
            case 8:
                k[1] = (k[1] ^ (tail[7] << 24));
                break; // fallthrough
            case 7:
                k[1] = (k[1] ^ (tail[6] << 16));
                break; // fallthrough
            case 6:
                k[1] = (k[1] ^ (tail[5] << 8));
                break; // fallthrough
            case 5:
                k[1] = (k[1] ^ (tail[4] << 0));
                k[1] = Math.imul(k[1], C[1]);
                k[1] = rotl(k[1], 16);
                k[1] = Math.imul(k[1], C[2]);
                hash[1] = (hash[1] ^ k[1]);
                break;
            // fallthrough
            case 4:
                k[0] = (k[0] ^ (tail[3] << 24));
                break; // fallthrough
            case 3:
                k[0] = (k[0] ^ (tail[2] << 16));
                break; // fallthrough
            case 2:
                k[0] = (k[0] ^ (tail[1] << 8));
                break; // fallthrough
            case 1:
                k[0] = (k[0] ^ (tail[0] << 0));
                k[0] = Math.imul(k[0], C[0]);
                k[0] = rotl(k[0], 15);
                k[0] = Math.imul(k[0], C[1]);
                hash[0] = (hash[0] ^ k[0]);
                break;
        }
    }
    function finalize(key, hash) {
        hash[0] = (hash[0] ^ key.byteLength);
        hash[1] = (hash[1] ^ key.byteLength);
        hash[2] = (hash[2] ^ key.byteLength);
        hash[3] = (hash[3] ^ key.byteLength);
        hash[0] = (hash[0] + hash[1]) | 0;
        hash[0] = (hash[0] + hash[2]) | 0;
        hash[0] = (hash[0] + hash[3]) | 0;
        hash[1] = (hash[1] + hash[0]) | 0;
        hash[2] = (hash[2] + hash[0]) | 0;
        hash[3] = (hash[3] + hash[0]) | 0;
        hash[0] = fmix(hash[0]);
        hash[1] = fmix(hash[1]);
        hash[2] = fmix(hash[2]);
        hash[3] = fmix(hash[3]);
        hash[0] = (hash[0] + hash[1]) | 0;
        hash[0] = (hash[0] + hash[2]) | 0;
        hash[0] = (hash[0] + hash[3]) | 0;
        hash[1] = (hash[1] + hash[0]) | 0;
        hash[2] = (hash[2] + hash[0]) | 0;
        hash[3] = (hash[3] + hash[0]) | 0;
    }
    function hash(key, seed = 0) {
        seed = (seed ? (seed | 0) : 0);
        if (typeof key === 'string') {
            key = encodeUtf8(key);
        }
        if (!(key instanceof ArrayBuffer)) {
            throw new TypeError('Expected key to be ArrayBuffer or string');
        }
        const hash = new Uint32Array([seed, seed, seed, seed]);
        body(key, hash);
        tail(key, hash);
        finalize(key, hash);
        const byteArray = new Uint8Array(hash.buffer);
        return Array.from(byteArray).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function delay(t, val) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(val), t);
        });
    }
    function raceAll(promises, timeoutTime, timeoutVal) {
        return Promise.all(promises.map((p) => {
            return Promise.race([p, delay(timeoutTime, timeoutVal)]);
        }));
    }

    async function getFingerprintData() {
        try {
            const promiseMap = getComponentPromises();
            const keys = Object.keys(promiseMap);
            const promises = Object.values(promiseMap);
            const resolvedValues = await raceAll(promises, (options === null || options === void 0 ? void 0 : options.timeout) || 1000, timeoutInstance);
            const validValues = resolvedValues.filter((value) => value !== undefined);
            const resolvedComponents = {};
            validValues.forEach((value, index) => {
                resolvedComponents[keys[index]] = value;
            });
            return filterFingerprintData(resolvedComponents, options.exclude || [], options.include || [], "");
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * This function filters the fingerprint data based on the exclude and include list
     * @param {componentInterface} obj - components objects from main componentInterface
     * @param {string[]} excludeList - elements to exclude from components objects (e.g : 'canvas', 'system.browser')
     * @param {string[]} includeList - elements to only include from components objects (e.g : 'canvas', 'system.browser')
     * @param {string} path - auto-increment path iterating on key objects from components objects
     * @returns {componentInterface} result - returns the final object before hashing in order to get fingerprint
     */
    function filterFingerprintData(obj, excludeList, includeList, path = "") {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = path + key + ".";
            if (typeof value === "object" && !Array.isArray(value)) {
                const filtered = filterFingerprintData(value, excludeList, includeList, currentPath);
                if (Object.keys(filtered).length > 0) {
                    result[key] = filtered;
                }
            }
            else {
                const isExcluded = excludeList.some(exclusion => currentPath.startsWith(exclusion));
                const isIncluded = includeList.some(inclusion => currentPath.startsWith(inclusion));
                if (!isExcluded || isIncluded) {
                    result[key] = value;
                }
            }
        }
        return result;
    }
    async function getFingerprint() {
        try {
            const fingerprintData = await getFingerprintData();
            const thisHash = hash(JSON.stringify(fingerprintData));
            return { hash: thisHash.toString(), data: fingerprintData };
        }
        catch (error) {
            throw error;
        }
    }

    async function detectTorBrowser() {
        const totalChecks = 7;
        let score = 0;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === "Atlantic/Reykjavik")
            score++;
        const webGLInfo = getWebGLInfo();
        if (["Mozilla", "unknown"].includes(webGLInfo.vendor))
            score++;
        if (!window.RTCPeerConnection)
            score++;
        if (!navigator.deviceMemory)
            score++;
        if (navigator.hardwareConcurrency === 2)
            score++;
        if (!navigator.credentials)
            score++;
        if (!navigator.geolocation)
            score++;
        return {
            isTor: score >= 6,
            isTorAccuracyScore: `${((score / totalChecks) * 100).toFixed(2)}%`,
            details: {
                timezoneMatch: tz === "Atlantic/Reykjavik",
                webGLVendor: webGLInfo.vendor,
                webRTCDisabled: !window.RTCPeerConnection,
            },
        };
    }
    const getWebGLInfo = () => {
        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (!gl)
                return { vendor: "unsupported", renderer: "unsupported" };
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            return debugInfo
                ? {
                    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                }
                : { vendor: "unknown", renderer: "unknown" };
        }
        catch (_a) {
            return { vendor: "error", renderer: "error" };
        }
    };

    async function detectIncognito() {
        return new Promise(function (resolve, reject) {
            let browserName = 'Unknown';
            function __callback(isPrivate) {
                resolve({
                    isPrivate: isPrivate,
                    browserName: browserName
                });
            }
            function identifyChromium() {
                const ua = navigator.userAgent;
                if (ua.match(/Chrome/)) {
                    if (navigator.brave !== undefined) {
                        return 'Brave';
                    }
                    else if (ua.match(/Edg/)) {
                        return 'Edge';
                    }
                    else if (ua.match(/OPR/)) {
                        return 'Opera';
                    }
                    return 'Chrome';
                }
                else {
                    return 'Chromium';
                }
            }
            function assertEvalToString(value) {
                return value === eval.toString().length;
            }
            function feid() {
                let toFixedEngineID = 0;
                let neg = parseInt("-1");
                try {
                    neg.toFixed(neg);
                }
                catch (e) {
                    toFixedEngineID = e.message.length;
                }
                return toFixedEngineID;
            }
            function isSafari() {
                return feid() === 44;
            }
            function isChrome() {
                return feid() === 51;
            }
            function isFirefox() {
                return feid() === 25;
            }
            function isMSIE() {
                return (navigator.msSaveBlob !== undefined && assertEvalToString(39));
            }
            /**
             * Safari (Safari for iOS & macOS)
             **/
            function newSafariTest() {
                const tmp_name = String(Math.random());
                try {
                    const db = window.indexedDB.open(tmp_name, 1);
                    db.onupgradeneeded = function (i) {
                        var _a;
                        const res = i.target.result;
                        try {
                            res.createObjectStore('test', {
                                autoIncrement: true
                            }).put(new Blob());
                            __callback(false);
                        }
                        catch (e) {
                            let message = e;
                            if (e instanceof Error) {
                                message = (_a = e.message) !== null && _a !== void 0 ? _a : e;
                            }
                            if (typeof message !== 'string') {
                                __callback(false);
                                return;
                            }
                            const matchesExpectedError = message.includes('BlobURLs are not yet supported');
                            __callback(matchesExpectedError);
                            return;
                        }
                        finally {
                            res.close();
                            window.indexedDB.deleteDatabase(tmp_name);
                        }
                    };
                }
                catch (e) {
                    __callback(false);
                }
            }
            function oldSafariTest() {
                const openDB = window.openDatabase;
                const storage = window.localStorage;
                try {
                    openDB(null, null, null, null);
                }
                catch (e) {
                    __callback(true);
                    return;
                }
                try {
                    storage.setItem('test', '1');
                    storage.removeItem('test');
                }
                catch (e) {
                    __callback(true);
                    return;
                }
                __callback(false);
            }
            function safariPrivateTest() {
                if (navigator.maxTouchPoints !== undefined) {
                    newSafariTest();
                }
                else {
                    oldSafariTest();
                }
            }
            /**
             * Chrome
             **/
            function getQuotaLimit() {
                const w = window;
                if (w.performance !== undefined &&
                    w.performance.memory !== undefined &&
                    w.performance.memory.jsHeapSizeLimit !== undefined) {
                    return performance.memory.jsHeapSizeLimit;
                }
                return 1073741824;
            }
            // >= 76
            function storageQuotaChromePrivateTest() {
                navigator.webkitTemporaryStorage.queryUsageAndQuota(function (_, quota) {
                    const quotaInMib = Math.round(quota / (1024 * 1024));
                    const quotaLimitInMib = Math.round(getQuotaLimit() / (1024 * 1024)) * 2;
                    __callback(quotaInMib < quotaLimitInMib);
                }, function (e) {
                    reject(new Error('detectIncognito somehow failed to query storage quota: ' +
                        e.message));
                });
            }
            // 50 to 75
            function oldChromePrivateTest() {
                const fs = window.webkitRequestFileSystem;
                const success = function () {
                    __callback(false);
                };
                const error = function () {
                    __callback(true);
                };
                fs(0, 1, success, error);
            }
            function chromePrivateTest() {
                if (self.Promise !== undefined && self.Promise.allSettled !== undefined) {
                    storageQuotaChromePrivateTest();
                }
                else {
                    oldChromePrivateTest();
                }
            }
            /**
             * Firefox
             **/
            function firefoxPrivateTest() {
                __callback(navigator.serviceWorker === undefined);
            }
            /**
             * MSIE
             **/
            function msiePrivateTest() {
                __callback(window.indexedDB === undefined);
            }
            function main() {
                if (isSafari()) {
                    browserName = 'Safari';
                    safariPrivateTest();
                }
                else if (isChrome()) {
                    browserName = identifyChromium();
                    chromePrivateTest();
                }
                else if (isFirefox()) {
                    browserName = 'Firefox';
                    firefoxPrivateTest();
                }
                else if (isMSIE()) {
                    browserName = 'Internet Explorer';
                    msiePrivateTest();
                }
                else {
                    reject(new Error('detectIncognito cannot determine the browser'));
                }
            }
            main();
        });
    }
    if (typeof window !== 'undefined') {
        window.detectIncognito = detectIncognito;
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /**
     * Fingerprint BotD v1.9.1 - Copyright (c) FingerprintJS, Inc, 2024 (https://fingerprint.com)
     * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
     */


    var version = "1.9.1";

    /**
     * Enum for types of bots.
     * Specific types of bots come first, followed by automation technologies.
     *
     * @readonly
     * @enum {string}
     */
    var BotKind = {
        // Object is used instead of Typescript enum to avoid emitting IIFE which might be affected by further tree-shaking.
        // See example of compiled enums https://stackoverflow.com/q/47363996)
        Awesomium: 'awesomium',
        Cef: 'cef',
        CefSharp: 'cefsharp',
        CoachJS: 'coachjs',
        Electron: 'electron',
        FMiner: 'fminer',
        Geb: 'geb',
        NightmareJS: 'nightmarejs',
        Phantomas: 'phantomas',
        PhantomJS: 'phantomjs',
        Rhino: 'rhino',
        Selenium: 'selenium',
        Sequentum: 'sequentum',
        SlimerJS: 'slimerjs',
        WebDriverIO: 'webdriverio',
        WebDriver: 'webdriver',
        HeadlessChrome: 'headless_chrome',
        Unknown: 'unknown',
    };
    /**
     * Bot detection error.
     */
    var BotdError = /** @class */ (function (_super) {
        __extends(BotdError, _super);
        /**
         * Creates a new BotdError.
         *
         * @class
         */
        function BotdError(state, message) {
            var _this = _super.call(this, message) || this;
            _this.state = state;
            _this.name = 'BotdError';
            Object.setPrototypeOf(_this, BotdError.prototype);
            return _this;
        }
        return BotdError;
    }(Error));

    function detect(components, detectors) {
        var detections = {};
        var finalDetection = {
            bot: false,
        };
        for (var detectorName in detectors) {
            var detector = detectors[detectorName];
            var detectorRes = detector(components);
            var detection = { bot: false };
            if (typeof detectorRes === 'string') {
                detection = { bot: true, botKind: detectorRes };
            }
            else if (detectorRes) {
                detection = { bot: true, botKind: BotKind.Unknown };
            }
            detections[detectorName] = detection;
            if (detection.bot) {
                finalDetection = detection;
            }
        }
        return [detections, finalDetection];
    }
    function collect(sources) {
        return __awaiter(this, void 0, void 0, function () {
            var components, sourcesKeys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        components = {};
                        sourcesKeys = Object.keys(sources);
                        return [4 /*yield*/, Promise.all(sourcesKeys.map(function (sourceKey) { return __awaiter(_this, void 0, void 0, function () {
                                var res, _a, _b, error_1;
                                var _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            res = sources[sourceKey];
                                            _d.label = 1;
                                        case 1:
                                            _d.trys.push([1, 3, , 4]);
                                            _a = components;
                                            _b = sourceKey;
                                            _c = {};
                                            return [4 /*yield*/, res()];
                                        case 2:
                                            _a[_b] = (_c.value = _d.sent(),
                                                _c.state = 0 /* State.Success */,
                                                _c);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_1 = _d.sent();
                                            if (error_1 instanceof BotdError) {
                                                components[sourceKey] = {
                                                    state: error_1.state,
                                                    error: "".concat(error_1.name, ": ").concat(error_1.message),
                                                };
                                            }
                                            else {
                                                components[sourceKey] = {
                                                    state: -3 /* State.UnexpectedBehaviour */,
                                                    error: error_1 instanceof Error ? "".concat(error_1.name, ": ").concat(error_1.message) : String(error_1),
                                                };
                                            }
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, components];
                }
            });
        });
    }

    function detectAppVersion(_a) {
        var appVersion = _a.appVersion;
        if (appVersion.state !== 0 /* State.Success */)
            return false;
        if (/headless/i.test(appVersion.value))
            return BotKind.HeadlessChrome;
        if (/electron/i.test(appVersion.value))
            return BotKind.Electron;
        if (/slimerjs/i.test(appVersion.value))
            return BotKind.SlimerJS;
    }

    function arrayIncludes(arr, value) {
        return arr.indexOf(value) !== -1;
    }
    function strIncludes(str, value) {
        return str.indexOf(value) !== -1;
    }
    function arrayFind(array, callback) {
        if ('find' in array)
            return array.find(callback);
        for (var i = 0; i < array.length; i++) {
            if (callback(array[i], i, array))
                return array[i];
        }
        return undefined;
    }

    function getObjectProps(obj) {
        return Object.getOwnPropertyNames(obj);
    }
    function includes(arr) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        var _loop_1 = function (key) {
            if (typeof key === 'string') {
                if (arrayIncludes(arr, key))
                    return { value: true };
            }
            else {
                var match = arrayFind(arr, function (value) { return key.test(value); });
                if (match != null)
                    return { value: true };
            }
        };
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var key = keys_1[_a];
            var state_1 = _loop_1(key);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return false;
    }
    function countTruthy(values) {
        return values.reduce(function (sum, value) { return sum + (value ? 1 : 0); }, 0);
    }

    function detectDocumentAttributes(_a) {
        var documentElementKeys = _a.documentElementKeys;
        if (documentElementKeys.state !== 0 /* State.Success */)
            return false;
        if (includes(documentElementKeys.value, 'selenium', 'webdriver', 'driver')) {
            return BotKind.Selenium;
        }
    }

    function detectErrorTrace(_a) {
        var errorTrace = _a.errorTrace;
        if (errorTrace.state !== 0 /* State.Success */)
            return false;
        if (/PhantomJS/i.test(errorTrace.value))
            return BotKind.PhantomJS;
    }

    function detectEvalLengthInconsistency(_a) {
        var evalLength = _a.evalLength, browserKind = _a.browserKind, browserEngineKind = _a.browserEngineKind;
        if (evalLength.state !== 0 /* State.Success */ ||
            browserKind.state !== 0 /* State.Success */ ||
            browserEngineKind.state !== 0 /* State.Success */)
            return;
        var length = evalLength.value;
        if (browserEngineKind.value === "unknown" /* BrowserEngineKind.Unknown */)
            return false;
        return ((length === 37 && !arrayIncludes(["webkit" /* BrowserEngineKind.Webkit */, "gecko" /* BrowserEngineKind.Gecko */], browserEngineKind.value)) ||
            (length === 39 && !arrayIncludes(["internet_explorer" /* BrowserKind.IE */], browserKind.value)) ||
            (length === 33 && !arrayIncludes(["chromium" /* BrowserEngineKind.Chromium */], browserEngineKind.value)));
    }

    function detectFunctionBind(_a) {
        var functionBind = _a.functionBind;
        if (functionBind.state === -2 /* State.NotFunction */)
            return BotKind.PhantomJS;
    }

    function detectLanguagesLengthInconsistency(_a) {
        var languages = _a.languages;
        if (languages.state === 0 /* State.Success */ && languages.value.length === 0) {
            return BotKind.HeadlessChrome;
        }
    }

    function detectMimeTypesConsistent(_a) {
        var mimeTypesConsistent = _a.mimeTypesConsistent;
        if (mimeTypesConsistent.state === 0 /* State.Success */ && !mimeTypesConsistent.value) {
            return BotKind.Unknown;
        }
    }

    function detectNotificationPermissions(_a) {
        var notificationPermissions = _a.notificationPermissions, browserKind = _a.browserKind;
        if (browserKind.state !== 0 /* State.Success */ || browserKind.value !== "chrome" /* BrowserKind.Chrome */)
            return false;
        if (notificationPermissions.state === 0 /* State.Success */ && notificationPermissions.value) {
            return BotKind.HeadlessChrome;
        }
    }

    function detectPluginsArray(_a) {
        var pluginsArray = _a.pluginsArray;
        if (pluginsArray.state === 0 /* State.Success */ && !pluginsArray.value)
            return BotKind.HeadlessChrome;
    }

    function detectPluginsLengthInconsistency(_a) {
        var pluginsLength = _a.pluginsLength, android = _a.android, browserKind = _a.browserKind, browserEngineKind = _a.browserEngineKind;
        if (pluginsLength.state !== 0 /* State.Success */ ||
            android.state !== 0 /* State.Success */ ||
            browserKind.state !== 0 /* State.Success */ ||
            browserEngineKind.state !== 0 /* State.Success */)
            return;
        if (browserKind.value !== "chrome" /* BrowserKind.Chrome */ ||
            android.value ||
            browserEngineKind.value !== "chromium" /* BrowserEngineKind.Chromium */)
            return;
        if (pluginsLength.value === 0)
            return BotKind.HeadlessChrome;
    }

    function detectProcess(_a) {
        var _b;
        var process = _a.process;
        if (process.state !== 0 /* State.Success */)
            return false;
        if (process.value.type === 'renderer' || ((_b = process.value.versions) === null || _b === void 0 ? void 0 : _b.electron) != null)
            return BotKind.Electron;
    }

    function detectProductSub(_a) {
        var productSub = _a.productSub, browserKind = _a.browserKind;
        if (productSub.state !== 0 /* State.Success */ || browserKind.state !== 0 /* State.Success */)
            return false;
        if ((browserKind.value === "chrome" /* BrowserKind.Chrome */ ||
            browserKind.value === "safari" /* BrowserKind.Safari */ ||
            browserKind.value === "opera" /* BrowserKind.Opera */ ||
            browserKind.value === "wechat" /* BrowserKind.WeChat */) &&
            productSub.value !== '20030107')
            return BotKind.Unknown;
    }

    function detectUserAgent(_a) {
        var userAgent = _a.userAgent;
        if (userAgent.state !== 0 /* State.Success */)
            return false;
        if (/PhantomJS/i.test(userAgent.value))
            return BotKind.PhantomJS;
        if (/Headless/i.test(userAgent.value))
            return BotKind.HeadlessChrome;
        if (/Electron/i.test(userAgent.value))
            return BotKind.Electron;
        if (/slimerjs/i.test(userAgent.value))
            return BotKind.SlimerJS;
    }

    function detectWebDriver(_a) {
        var webDriver = _a.webDriver;
        if (webDriver.state === 0 /* State.Success */ && webDriver.value)
            return BotKind.HeadlessChrome;
    }

    function detectWebGL(_a) {
        var webGL = _a.webGL;
        if (webGL.state === 0 /* State.Success */) {
            var _b = webGL.value, vendor = _b.vendor, renderer = _b.renderer;
            if (vendor == 'Brian Paul' && renderer == 'Mesa OffScreen') {
                return BotKind.HeadlessChrome;
            }
        }
    }

    function detectWindowExternal(_a) {
        var windowExternal = _a.windowExternal;
        if (windowExternal.state !== 0 /* State.Success */)
            return false;
        if (/Sequentum/i.test(windowExternal.value))
            return BotKind.Sequentum;
    }

    function detectWindowSize(_a) {
        var windowSize = _a.windowSize, documentFocus = _a.documentFocus;
        if (windowSize.state !== 0 /* State.Success */ || documentFocus.state !== 0 /* State.Success */)
            return false;
        var _b = windowSize.value, outerWidth = _b.outerWidth, outerHeight = _b.outerHeight;
        // When a page is opened in a new tab without focusing it right away, the window outer size is 0x0
        if (!documentFocus.value)
            return;
        if (outerWidth === 0 && outerHeight === 0)
            return BotKind.HeadlessChrome;
    }

    function detectDistinctiveProperties(_a) {
        var distinctiveProps = _a.distinctiveProps;
        if (distinctiveProps.state !== 0 /* State.Success */)
            return false;
        var value = distinctiveProps.value;
        var bot;
        for (bot in value)
            if (value[bot])
                return bot;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    var detectors = {
        detectAppVersion: detectAppVersion,
        detectDocumentAttributes: detectDocumentAttributes,
        detectErrorTrace: detectErrorTrace,
        detectEvalLengthInconsistency: detectEvalLengthInconsistency,
        detectFunctionBind: detectFunctionBind,
        detectLanguagesLengthInconsistency: detectLanguagesLengthInconsistency,
        detectNotificationPermissions: detectNotificationPermissions,
        detectPluginsArray: detectPluginsArray,
        detectPluginsLengthInconsistency: detectPluginsLengthInconsistency,
        detectProcess: detectProcess,
        detectUserAgent: detectUserAgent,
        detectWebDriver: detectWebDriver,
        detectWebGL: detectWebGL,
        detectWindowExternal: detectWindowExternal,
        detectWindowSize: detectWindowSize,
        detectMimeTypesConsistent: detectMimeTypesConsistent,
        detectProductSub: detectProductSub,
        detectDistinctiveProperties: detectDistinctiveProperties,
    };

    function getAppVersion() {
        var appVersion = navigator.appVersion;
        if (appVersion == undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'navigator.appVersion is undefined');
        }
        return appVersion;
    }

    function getDocumentElementKeys() {
        if (document.documentElement === undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'document.documentElement is undefined');
        }
        var documentElement = document.documentElement;
        if (typeof documentElement.getAttributeNames !== 'function') {
            throw new BotdError(-2 /* State.NotFunction */, 'document.documentElement.getAttributeNames is not a function');
        }
        return documentElement.getAttributeNames();
    }

    function getErrorTrace() {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            null[0]();
        }
        catch (error) {
            if (error instanceof Error && error['stack'] != null) {
                return error.stack.toString();
            }
        }
        throw new BotdError(-3 /* State.UnexpectedBehaviour */, 'errorTrace signal unexpected behaviour');
    }

    function getEvalLength() {
        return eval.toString().length;
    }

    function getFunctionBind() {
        if (Function.prototype.bind === undefined) {
            throw new BotdError(-2 /* State.NotFunction */, 'Function.prototype.bind is undefined');
        }
        return Function.prototype.bind.toString();
    }

    function getBrowserEngineKind() {
        var _a, _b;
        // Based on research in October 2020. Tested to detect Chromium 42-86.
        var w = window;
        var n = navigator;
        if (countTruthy([
            'webkitPersistentStorage' in n,
            'webkitTemporaryStorage' in n,
            n.vendor.indexOf('Google') === 0,
            'webkitResolveLocalFileSystemURL' in w,
            'BatteryManager' in w,
            'webkitMediaStream' in w,
            'webkitSpeechGrammar' in w,
        ]) >= 5) {
            return "chromium" /* BrowserEngineKind.Chromium */;
        }
        if (countTruthy([
            'ApplePayError' in w,
            'CSSPrimitiveValue' in w,
            'Counter' in w,
            n.vendor.indexOf('Apple') === 0,
            'getStorageUpdates' in n,
            'WebKitMediaKeys' in w,
        ]) >= 4) {
            return "webkit" /* BrowserEngineKind.Webkit */;
        }
        if (countTruthy([
            'buildID' in navigator,
            'MozAppearance' in ((_b = (_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.style) !== null && _b !== void 0 ? _b : {}),
            'onmozfullscreenchange' in w,
            'mozInnerScreenX' in w,
            'CSSMozDocumentRule' in w,
            'CanvasCaptureMediaStream' in w,
        ]) >= 4) {
            return "gecko" /* BrowserEngineKind.Gecko */;
        }
        return "unknown" /* BrowserEngineKind.Unknown */;
    }
    function getBrowserKind() {
        var _a;
        var userAgent = (_a = navigator.userAgent) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (strIncludes(userAgent, 'edg/')) {
            return "edge" /* BrowserKind.Edge */;
        }
        else if (strIncludes(userAgent, 'trident') || strIncludes(userAgent, 'msie')) {
            return "internet_explorer" /* BrowserKind.IE */;
        }
        else if (strIncludes(userAgent, 'wechat')) {
            return "wechat" /* BrowserKind.WeChat */;
        }
        else if (strIncludes(userAgent, 'firefox')) {
            return "firefox" /* BrowserKind.Firefox */;
        }
        else if (strIncludes(userAgent, 'opera') || strIncludes(userAgent, 'opr')) {
            return "opera" /* BrowserKind.Opera */;
        }
        else if (strIncludes(userAgent, 'chrome')) {
            return "chrome" /* BrowserKind.Chrome */;
        }
        else if (strIncludes(userAgent, 'safari')) {
            return "safari" /* BrowserKind.Safari */;
        }
        else {
            return "unknown" /* BrowserKind.Unknown */;
        }
    }
    // Source: https://github.com/fingerprintjs/fingerprintjs/blob/master/src/utils/browser.ts#L223
    function isAndroid() {
        var browserEngineKind = getBrowserEngineKind();
        var isItChromium = browserEngineKind === "chromium" /* BrowserEngineKind.Chromium */;
        var isItGecko = browserEngineKind === "gecko" /* BrowserEngineKind.Gecko */;
        // Only 2 browser engines are presented on Android.
        // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
        if (!isItChromium && !isItGecko)
            return false;
        var w = window;
        // Chrome removes all words "Android" from `navigator` when desktop version is requested
        // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
        return (countTruthy([
            'onorientationchange' in w,
            'orientation' in w,
            isItChromium && !('SharedWorker' in w),
            isItGecko && /android/i.test(navigator.appVersion),
        ]) >= 2);
    }
    function getDocumentFocus() {
        if (document.hasFocus === undefined) {
            return false;
        }
        return document.hasFocus();
    }
    function isChromium86OrNewer() {
        // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
        var w = window;
        return (countTruthy([
            !('MediaSettingsRange' in w),
            'RTCEncodedAudioFrame' in w,
            '' + w.Intl === '[object Intl]',
            '' + w.Reflect === '[object Reflect]',
        ]) >= 3);
    }

    function getLanguages() {
        var n = navigator;
        var result = [];
        var language = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
        if (language !== undefined) {
            result.push([language]);
        }
        if (Array.isArray(n.languages)) {
            var browserEngine = getBrowserEngineKind();
            // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
            // the value of `navigator.language`. Therefore, the value is ignored in this browser.
            if (!(browserEngine === "chromium" /* BrowserEngineKind.Chromium */ && isChromium86OrNewer())) {
                result.push(n.languages);
            }
        }
        else if (typeof n.languages === 'string') {
            var languages = n.languages;
            if (languages) {
                result.push(languages.split(','));
            }
        }
        return result;
    }

    function areMimeTypesConsistent() {
        if (navigator.mimeTypes === undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'navigator.mimeTypes is undefined');
        }
        var mimeTypes = navigator.mimeTypes;
        var isConsistent = Object.getPrototypeOf(mimeTypes) === MimeTypeArray.prototype;
        for (var i = 0; i < mimeTypes.length; i++) {
            isConsistent && (isConsistent = Object.getPrototypeOf(mimeTypes[i]) === MimeType.prototype);
        }
        return isConsistent;
    }

    function getNotificationPermissions() {
        return __awaiter(this, void 0, void 0, function () {
            var permissions, permissionStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (window.Notification === undefined) {
                            throw new BotdError(-1 /* State.Undefined */, 'window.Notification is undefined');
                        }
                        if (navigator.permissions === undefined) {
                            throw new BotdError(-1 /* State.Undefined */, 'navigator.permissions is undefined');
                        }
                        permissions = navigator.permissions;
                        if (typeof permissions.query !== 'function') {
                            throw new BotdError(-2 /* State.NotFunction */, 'navigator.permissions.query is not a function');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, permissions.query({ name: 'notifications' })];
                    case 2:
                        permissionStatus = _a.sent();
                        return [2 /*return*/, window.Notification.permission === 'denied' && permissionStatus.state === 'prompt'];
                    case 3:
                        _a.sent();
                        throw new BotdError(-3 /* State.UnexpectedBehaviour */, 'notificationPermissions signal unexpected behaviour');
                    case 4: return [2 /*return*/];
                }
            });
        });
    }

    function getPluginsArray() {
        if (navigator.plugins === undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'navigator.plugins is undefined');
        }
        if (window.PluginArray === undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'window.PluginArray is undefined');
        }
        return navigator.plugins instanceof PluginArray;
    }

    function getPluginsLength() {
        if (navigator.plugins === undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'navigator.plugins is undefined');
        }
        if (navigator.plugins.length === undefined) {
            throw new BotdError(-3 /* State.UnexpectedBehaviour */, 'navigator.plugins.length is undefined');
        }
        return navigator.plugins.length;
    }

    function getProcess() {
        var process = window.process;
        var errorPrefix = 'window.process is';
        if (process === undefined) {
            throw new BotdError(-1 /* State.Undefined */, "".concat(errorPrefix, " undefined"));
        }
        if (process && typeof process !== 'object') {
            throw new BotdError(-3 /* State.UnexpectedBehaviour */, "".concat(errorPrefix, " not an object"));
        }
        return process;
    }

    function getProductSub() {
        var productSub = navigator.productSub;
        if (productSub === undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'navigator.productSub is undefined');
        }
        return productSub;
    }

    function getRTT() {
        if (navigator.connection === undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'navigator.connection is undefined');
        }
        if (navigator.connection.rtt === undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'navigator.connection.rtt is undefined');
        }
        return navigator.connection.rtt;
    }

    function getUserAgent() {
        return navigator.userAgent;
    }

    function getWebDriver() {
        if (navigator.webdriver == undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'navigator.webdriver is undefined');
        }
        return navigator.webdriver;
    }

    function getWebGL() {
        var canvasElement = document.createElement('canvas');
        if (typeof canvasElement.getContext !== 'function') {
            throw new BotdError(-2 /* State.NotFunction */, 'HTMLCanvasElement.getContext is not a function');
        }
        var webGLContext = canvasElement.getContext('webgl');
        if (webGLContext === null) {
            throw new BotdError(-4 /* State.Null */, 'WebGLRenderingContext is null');
        }
        if (typeof webGLContext.getParameter !== 'function') {
            throw new BotdError(-2 /* State.NotFunction */, 'WebGLRenderingContext.getParameter is not a function');
        }
        var vendor = webGLContext.getParameter(webGLContext.VENDOR);
        var renderer = webGLContext.getParameter(webGLContext.RENDERER);
        return { vendor: vendor, renderer: renderer };
    }

    function getWindowExternal() {
        if (window.external === undefined) {
            throw new BotdError(-1 /* State.Undefined */, 'window.external is undefined');
        }
        var external = window.external;
        if (typeof external.toString !== 'function') {
            throw new BotdError(-2 /* State.NotFunction */, 'window.external.toString is not a function');
        }
        return external.toString();
    }

    function getWindowSize() {
        return {
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
        };
    }

    function checkDistinctiveProperties() {
        var _a;
        // The order in the following list matters, because specific types of bots come first, followed by automation technologies.
        var distinctivePropsList = (_a = {},
            _a[BotKind.Awesomium] = {
                window: ['awesomium'],
            },
            _a[BotKind.Cef] = {
                window: ['RunPerfTest'],
            },
            _a[BotKind.CefSharp] = {
                window: ['CefSharp'],
            },
            _a[BotKind.CoachJS] = {
                window: ['emit'],
            },
            _a[BotKind.FMiner] = {
                window: ['fmget_targets'],
            },
            _a[BotKind.Geb] = {
                window: ['geb'],
            },
            _a[BotKind.NightmareJS] = {
                window: ['__nightmare', 'nightmare'],
            },
            _a[BotKind.Phantomas] = {
                window: ['__phantomas'],
            },
            _a[BotKind.PhantomJS] = {
                window: ['callPhantom', '_phantom'],
            },
            _a[BotKind.Rhino] = {
                window: ['spawn'],
            },
            _a[BotKind.Selenium] = {
                window: ['_Selenium_IDE_Recorder', '_selenium', 'calledSelenium', /^([a-z]){3}_.*_(Array|Promise|Symbol)$/],
                document: ['__selenium_evaluate', 'selenium-evaluate', '__selenium_unwrapped'],
            },
            _a[BotKind.WebDriverIO] = {
                window: ['wdioElectron'],
            },
            _a[BotKind.WebDriver] = {
                window: [
                    'webdriver',
                    '__webdriverFunc',
                    '__lastWatirAlert',
                    '__lastWatirConfirm',
                    '__lastWatirPrompt',
                    '_WEBDRIVER_ELEM_CACHE',
                    'ChromeDriverw',
                ],
                document: [
                    '__webdriver_script_fn',
                    '__driver_evaluate',
                    '__webdriver_evaluate',
                    '__fxdriver_evaluate',
                    '__driver_unwrapped',
                    '__webdriver_unwrapped',
                    '__fxdriver_unwrapped',
                    '__webdriver_script_fn',
                    '__webdriver_script_func',
                    '__webdriver_script_function',
                    '$cdc_asdjflasutopfhvcZLmcf',
                    '$cdc_asdjflasutopfhvcZLmcfl_',
                    '$chrome_asyncScriptInfo',
                    '__$webdriverAsyncExecutor',
                ],
            },
            _a[BotKind.HeadlessChrome] = {
                window: ['domAutomation', 'domAutomationController'],
            },
            _a);
        var botName;
        var result = {};
        var windowProps = getObjectProps(window);
        var documentProps = [];
        if (window.document !== undefined)
            documentProps = getObjectProps(window.document);
        for (botName in distinctivePropsList) {
            var props = distinctivePropsList[botName];
            if (props !== undefined) {
                var windowContains = props.window === undefined ? false : includes.apply(void 0, __spreadArray([windowProps], props.window, false));
                var documentContains = props.document === undefined || !documentProps.length ? false : includes.apply(void 0, __spreadArray([documentProps], props.document, false));
                result[botName] = windowContains || documentContains;
            }
        }
        return result;
    }

    var sources = {
        android: isAndroid,
        browserKind: getBrowserKind,
        browserEngineKind: getBrowserEngineKind,
        documentFocus: getDocumentFocus,
        userAgent: getUserAgent,
        appVersion: getAppVersion,
        rtt: getRTT,
        windowSize: getWindowSize,
        pluginsLength: getPluginsLength,
        pluginsArray: getPluginsArray,
        errorTrace: getErrorTrace,
        productSub: getProductSub,
        windowExternal: getWindowExternal,
        mimeTypesConsistent: areMimeTypesConsistent,
        evalLength: getEvalLength,
        webGL: getWebGL,
        webDriver: getWebDriver,
        languages: getLanguages,
        notificationPermissions: getNotificationPermissions,
        documentElementKeys: getDocumentElementKeys,
        functionBind: getFunctionBind,
        process: getProcess,
        distinctiveProps: checkDistinctiveProperties,
    };

    /**
     * Class representing a bot detector.
     *
     * @class
     * @implements {BotDetectorInterface}
     */
    var BotDetector = /** @class */ (function () {
        function BotDetector() {
            this.components = undefined;
            this.detections = undefined;
        }
        BotDetector.prototype.getComponents = function () {
            return this.components;
        };
        BotDetector.prototype.getDetections = function () {
            return this.detections;
        };
        /**
         * @inheritdoc
         */
        BotDetector.prototype.detect = function () {
            if (this.components === undefined) {
                throw new Error("BotDetector.detect can't be called before BotDetector.collect");
            }
            var _a = detect(this.components, detectors), detections = _a[0], finalDetection = _a[1];
            this.detections = detections;
            return finalDetection;
        };
        /**
         * @inheritdoc
         */
        BotDetector.prototype.collect = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this;
                            return [4 /*yield*/, collect(sources)];
                        case 1:
                            _a.components = _b.sent();
                            return [2 /*return*/, this.components];
                    }
                });
            });
        };
        return BotDetector;
    }());

    /**
     * Sends an unpersonalized AJAX request to collect installation statistics
     */
    function monitor() {
        // The FingerprintJS CDN (https://github.com/fingerprintjs/cdn) replaces `window.__fpjs_d_m` with `true`
        if (window.__fpjs_d_m || Math.random() >= 0.001) {
            return;
        }
        try {
            var request = new XMLHttpRequest();
            request.open('get', "https://m1.openfpcdn.io/botd/v".concat(version, "/npm-monitoring"), true);
            request.send();
        }
        catch (error) {
            // console.error is ok here because it's an unexpected error handler
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }
    function load(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.monitoring, monitoring = _c === void 0 ? true : _c;
        return __awaiter(this, void 0, void 0, function () {
            var detector;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (monitoring) {
                            monitor();
                        }
                        detector = new BotDetector();
                        return [4 /*yield*/, detector.collect()];
                    case 1:
                        _d.sent();
                        return [2 /*return*/, detector];
                }
            });
        });
    }

    async function botDetection() {
        try {
            const botd = await load();
            const result = await botd.detect();
            return result;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    async function createAudioFingerprint() {
        const resultPromise = new Promise((resolve, reject) => {
            try {
                // Set up audio parameters
                const sampleRate = 44100;
                const numSamples = 5000;
                const audioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, numSamples, sampleRate);
                const audioBuffer = audioContext.createBufferSource();
                const analyser = audioContext.createAnalyser();
                const frequencyData = new Float32Array(analyser.frequencyBinCount);
                analyser.getFloatFrequencyData(frequencyData);
                const oscillator = audioContext.createOscillator();
                oscillator.frequency.value = 1000;
                const compressor = audioContext.createDynamicsCompressor();
                compressor.threshold.value = -50;
                compressor.knee.value = 40;
                compressor.ratio.value = 12;
                compressor.attack.value = 0;
                compressor.release.value = 0.2;
                oscillator.connect(compressor);
                compressor.connect(audioContext.destination);
                oscillator.start();
                audioContext.oncomplete = () => {
                    resolve({
                        'oscillator': oscillator.type,
                        'maxChannels': audioContext.destination.maxChannelCount,
                        'channelCountMode': audioBuffer.channelCountMode,
                        'frequencyBinCount': analyser.frequencyBinCount,
                    });
                };
                audioContext.startRendering();
                // audioContext.close();
            }
            catch (error) {
                console.error('Error creating audio fingerprint:', error);
                reject(error);
            }
        });
        return resultPromise;
    }
    includeComponent('audio', createAudioFingerprint);

    async function ephemeralIFrame(callback) {
        var _a;
        while (!document.body) {
            await wait(50);
        }
        const iframe = document.createElement('iframe');
        iframe.setAttribute('frameBorder', '0');
        const style = iframe.style;
        style.setProperty('position', 'fixed');
        style.setProperty('display', 'block', 'important');
        style.setProperty('visibility', 'visible');
        style.setProperty('border', '0');
        style.setProperty('opacity', '0');
        iframe.src = 'about:blank';
        document.body.appendChild(iframe);
        const iframeDocument = iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document);
        if (!iframeDocument) {
            throw new Error('Iframe document is not accessible');
        }
        // Execute the callback function with access to the iframe's document
        callback({ iframe: iframeDocument });
        // Clean up after running the callback
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 0);
    }
    function wait(durationMs, resolveWith) {
        return new Promise((resolve) => setTimeout(resolve, durationMs, resolveWith));
    }

    function getBrowserName() {
        function identifyChromium() {
            const ua = navigator.userAgent;
            if (ua.match(/Chrome/)) {
                if (navigator.brave !== undefined) {
                    return 'Brave';
                }
                else if (ua.match(/Edg/)) {
                    return 'Edge';
                }
                else if (ua.match(/OPR/)) {
                    return 'Opera';
                }
                return 'Chrome';
            }
            else {
                return 'Chromium';
            }
        }
        function feid() {
            let toFixedEngineID = 0;
            let neg = parseInt("-1");
            try {
                neg.toFixed(neg);
            }
            catch (e) {
                toFixedEngineID = e.message.length;
            }
            return toFixedEngineID;
        }
        function isSafari() {
            return feid() === 44;
        }
        function isChrome() {
            return feid() === 51;
        }
        function isFirefox() {
            return feid() === 25;
        }
        function assertEvalToString(value) {
            return value === eval.toString().length;
        }
        function isMSIE() {
            return (navigator.msSaveBlob !== undefined && assertEvalToString(39));
        }
        if (isSafari()) {
            return 'Safari';
        }
        else if (isChrome()) {
            return identifyChromium();
        }
        else if (isFirefox()) {
            return 'Firefox';
        }
        else if (isMSIE()) {
            return 'Internet Explorer';
        }
        return 'Unknown';
    }

    const availableFonts = [
        'Arial',
        'Arial Black',
        'Arial Narrow',
        'Arial Rounded MT',
        'Arimo',
        'Archivo',
        'Barlow',
        'Bebas Neue',
        'Bitter',
        'Bookman',
        'Calibri',
        'Cabin',
        'Candara',
        'Century',
        'Century Gothic',
        'Comic Sans MS',
        'Constantia',
        'Courier',
        'Courier New',
        'Crimson Text',
        'DM Mono',
        'DM Sans',
        'DM Serif Display',
        'DM Serif Text',
        'Dosis',
        'Droid Sans',
        'Exo',
        'Fira Code',
        'Fira Sans',
        'Franklin Gothic Medium',
        'Garamond',
        'Geneva',
        'Georgia',
        'Gill Sans',
        'Helvetica',
        'Impact',
        'Inconsolata',
        'Indie Flower',
        'Inter',
        'Josefin Sans',
        'Karla',
        'Lato',
        'Lexend',
        'Lucida Bright',
        'Lucida Console',
        'Lucida Sans Unicode',
        'Manrope',
        'Merriweather',
        'Merriweather Sans',
        'Montserrat',
        'Myriad',
        'Noto Sans',
        'Nunito',
        'Nunito Sans',
        'Open Sans',
        'Optima',
        'Orbitron',
        'Oswald',
        'Pacifico',
        'Palatino',
        'Perpetua',
        'PT Sans',
        'PT Serif',
        'Poppins',
        'Prompt',
        'Public Sans',
        'Quicksand',
        'Rajdhani',
        'Recursive',
        'Roboto',
        'Roboto Condensed',
        'Rockwell',
        'Rubik',
        'Segoe Print',
        'Segoe Script',
        'Segoe UI',
        'Sora',
        'Source Sans Pro',
        'Space Mono',
        'Tahoma',
        'Taviraj',
        'Times',
        'Times New Roman',
        'Titillium Web',
        'Trebuchet MS',
        'Ubuntu',
        'Varela Round',
        'Verdana',
        'Work Sans',
    ];
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    function getFontMetrics() {
        return new Promise((resolve, reject) => {
            try {
                ephemeralIFrame(async ({ iframe }) => {
                    const canvas = iframe.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const defaultWidths = baseFonts.map((font) => {
                        return measureSingleFont(ctx, font);
                    });
                    let results = {};
                    availableFonts.forEach((font) => {
                        const fontWidth = measureSingleFont(ctx, font);
                        if (!defaultWidths.includes(fontWidth))
                            results[font] = fontWidth;
                    });
                    resolve(results);
                });
            }
            catch (error) {
                reject({ 'error': 'unsupported' });
            }
        });
    }
    function measureSingleFont(ctx, font) {
        if (!ctx) {
            throw new Error('Canvas context not supported');
        }
        const text = "WwMmLli0Oo";
        ctx.font = `72px ${font}`; // Set a default font size
        return ctx.measureText(text).width;
    }
    if (getBrowserName() != 'Firefox')
        includeComponent('fonts', getFontMetrics);

    function getHardwareInfo() {
        return new Promise((resolve) => {
            const memoryInfo = (window.performance && window.performance.memory) ? window.performance.memory : 0;
            resolve({
                'videocard': getVideoCard(),
                'architecture': getArchitecture(),
                'jsHeapSizeLimit': memoryInfo.jsHeapSizeLimit || 0
            });
        });
    }
    function getVideoCard() {
        var _a;
        const canvas = document.createElement('canvas');
        const gl = (_a = canvas.getContext('webgl')) !== null && _a !== void 0 ? _a : canvas.getContext('experimental-webgl');
        if (gl && 'getParameter' in gl) {
            try {
                // Try standard parameters first
                const vendor = (gl.getParameter(gl.VENDOR) || '').toString();
                const renderer = (gl.getParameter(gl.RENDERER) || '').toString();
                let result = {
                    vendor: vendor,
                    renderer: renderer,
                    version: (gl.getParameter(gl.VERSION) || '').toString(),
                    shadingLanguageVersion: (gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || '').toString(),
                };
                // Only try debug info if needed and available
                const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
                if (debugInfo) {
                    const vendorUnmasked = (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '').toString();
                    const rendererUnmasked = (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '').toString();
                    // Only add unmasked values if they exist
                    if (vendorUnmasked) {
                        result.vendorUnmasked = vendorUnmasked;
                    }
                    if (rendererUnmasked) {
                        result.rendererUnmasked = rendererUnmasked;
                    }
                }
                return result;
            }
            catch (error) {
                // fail silently
            }
        }
        return "undefined";
    }
    function getArchitecture() {
        const f = new Float32Array(1);
        const u8 = new Uint8Array(f.buffer);
        f[0] = Infinity;
        f[0] = f[0] - f[0];
        return u8[3];
    }
    includeComponent('hardware', getHardwareInfo);

    function getLocales() {
        return new Promise((resolve) => {
            resolve({
                'languages': getUserLanguage(),
                'timezone': getUserTimezone()
            });
        });
    }
    function getUserLanguage() {
        return navigator.language;
    }
    function getUserTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    includeComponent('locales', getLocales);

    function mostFrequentValue(arr) {
        if (arr.length === 0) {
            return null; // Return null for an empty array
        }
        const frequencyMap = {};
        // Count occurrences of each element in the array
        arr.forEach((element) => {
            const key = String(element);
            frequencyMap[key] = (frequencyMap[key] || 0) + 1;
        });
        let mostFrequent = arr[0]; // Assume the first element is the most frequent
        let highestFrequency = 1; // Frequency of the assumed most frequent element
        // Find the element with the highest frequency
        Object.keys(frequencyMap).forEach((key) => {
            if (frequencyMap[key] > highestFrequency) {
                mostFrequent = key;
                highestFrequency = frequencyMap[key];
            }
        });
        return mostFrequent;
    }
    function mostFrequentValuesInArrayOfDictionaries(arr, keys) {
        const result = {};
        keys.forEach((key) => {
            const valuesForKey = arr.map((obj) => (key in obj ? obj[key] : undefined)).filter((val) => val !== undefined);
            const mostFrequentValueForKey = mostFrequentValue(valuesForKey);
            if (mostFrequentValueForKey)
                result[key] = mostFrequentValueForKey;
        });
        return result;
    }

    let permission_keys;
    function initializePermissionKeys() {
        permission_keys = (options === null || options === void 0 ? void 0 : options.permissions_to_check) || [
            'accelerometer',
            'accessibility', 'accessibility-events',
            'ambient-light-sensor',
            'background-fetch',
            'background-sync',
            'bluetooth',
            'clipboard-read',
            'clipboard-write',
            'device-info',
            'display-capture',
            'gyroscope',
            'local-fonts',
            'magnetometer',
            'midi',
            'nfc', 'notifications',
            'payment-handler',
            'persistent-storage',
            'speaker', 'storage-access',
            'top-level-storage-access',
            'window-management',
            'query',
        ];
    }
    async function getBrowserPermissions() {
        initializePermissionKeys();
        const permissionPromises = Array.from({ length: (options === null || options === void 0 ? void 0 : options.retries) || 3 }, () => getBrowserPermissionsOnce());
        return Promise.all(permissionPromises).then((resolvedPermissions) => {
            const permission = mostFrequentValuesInArrayOfDictionaries(resolvedPermissions, permission_keys);
            return permission;
        });
    }
    async function getBrowserPermissionsOnce() {
        const permissionStatus = {};
        for (const feature of permission_keys) {
            try {
                // Request permission status for each feature
                const status = await navigator.permissions.query({ name: feature });
                // Assign permission status to the object
                permissionStatus[feature] = status.state.toString();
            }
            catch (error) {
                // In case of errors (unsupported features, etc.), do nothing. Not listing them is the same as not supported
            }
        }
        return permissionStatus;
    }
    includeComponent("permissions", getBrowserPermissions);

    function screenDetails() {
        return new Promise((resolve) => {
            resolve({
                'colorDepth': screen.colorDepth,
            });
        });
    }
    includeComponent('screen', screenDetails);

    async function getSystemDetails() {
        return new Promise((resolve) => {
            const browser = getBrowserName();
            console.log(browser);
            resolve({
                'platform': window.navigator.platform,
                'cookieEnabled': window.navigator.cookieEnabled,
                'productSub': navigator.productSub,
                'product': navigator.product,
                'browser': { 'name': browser },
                'applePayVersion': getApplePayVersion()
            });
        });
    }
    /**
     * @returns applePayCanMakePayments: boolean, applePayMaxSupportedVersion: number
     */
    function getApplePayVersion() {
        if (window.location.protocol === 'https:' && typeof window.ApplePaySession === 'function') {
            try {
                const versionCheck = window.ApplePaySession.supportsVersion;
                for (let i = 15; i > 0; i--) {
                    if (versionCheck(i)) {
                        return i;
                    }
                }
            }
            catch (error) {
                return 0;
            }
        }
        return 0;
    }
    includeComponent('system', getSystemDetails);

    const getMathInfo = async () => {
        return {
            acos: Math.acos(0.5),
            asin: integrate(Math.asin, -1, 1, 97),
            atan: integrate(Math.atan, -1, 1, 97),
            cos: integrate(Math.cos, 0, Math.PI, 97),
            cosh: Math.cosh(9 / 7),
            e: Math.E,
            largeCos: Math.cos(1e20),
            largeSin: Math.sin(1e20),
            largeTan: Math.tan(1e20),
            log: Math.log(1000),
            pi: Math.PI,
            sin: integrate(Math.sin, -Math.PI, Math.PI, 97),
            sinh: integrate(Math.sinh, -9 / 7, 7 / 9, 97),
            sqrt: Math.sqrt(2),
            tan: integrate(Math.tan, 0, 2 * Math.PI, 97),
            tanh: integrate(Math.tanh, -9 / 7, 7 / 9, 97),
        };
    };
    /** This might be a little excessive, but I wasn't sure what number to pick for some of the
     * trigonometric functions. Using an integral here, so a few numbers are calculated. However,
     * I do this mainly for those integrals that sum up to a small value, otherwise there's no point.
    */
    const integrate = (f, a, b, n) => {
        const h = (b - a) / n;
        let sum = 0;
        for (let i = 0; i < n; i++) {
            const x = a + (i + 0.5) * h;
            sum += f(x);
        }
        return sum * h;
    };
    includeComponent('math', getMathInfo);

    // Floating-point calculations (Math.sin(), Math.log()) produce slightly different results across CPUs due to:
    // Extremely hard to spoof without emulating a different CPU.
    function getCPUFingerprint() {
        return {
            sin1: Math.sin(1),
            log10: Math.log(10),
            tanh05: Math.tanh(0.5),
        };
    }
    // includeComponent('navigator', navigatorProperties)
    includeComponent('CPU', getCPUFingerprint);

    function trackBehaviour(config) {
        return [];
    }

    // Import the functions we need
    // Export a named object for combined functionality
    const rayyanJS = {
        device: {
            getFingerprint
        },
        behaviour: {
            trackBehaviour
        }
    };

    exports.botDetection = botDetection;
    exports.detectIncognito = detectIncognito;
    exports.detectTorBrowser = detectTorBrowser;
    exports.getFingerprint = getFingerprint;
    exports.rayyanJS = rayyanJS;
    exports.trackBehaviour = trackBehaviour;

}));
//# sourceMappingURL=index.umd.js.map
