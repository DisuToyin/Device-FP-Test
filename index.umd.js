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
            const hashData = getHashRelevantData(fingerprintData);
            // console.log(fingerprintData)
            const thisHash = hash(JSON.stringify(hashData));
            const componentsUsedForHash = getHashRelevantKeys(fingerprintData);
            return {
                hash: thisHash.toString(),
                data: fingerprintData,
                componentsUsedForHash: componentsUsedForHash
            };
        }
        catch (error) {
            throw error;
        }
    }
    function hashObject(data) {
        return {
            audio: data.audio,
            fonts: data.fonts,
            hardware: data.hardware,
            locales: data.locales,
            permissions: data.permissions,
            screen: data.screen,
            system: data.system,
            emojiFingerprint: data.emojiFingerprint,
            math: data.maths,
            domBlockers: data.domBlockers,
            monochrome: data.monochrome,
            forcedColors: data.forcedColors,
            colorGamut: data.colorGamut,
            audioLatency: data.audioLatency,
            osCpu: data.osCpu,
            vendorFlavours: data.vendorFlavors
        };
    }
    function getHashRelevantData(data) {
        return hashObject(data);
    }
    function getHashRelevantKeys(data) {
        const fpdata = hashObject(data);
        return Object.keys(fpdata);
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
    function countTruthy$1(values) {
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
        if (countTruthy$1([
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
        if (countTruthy$1([
            'ApplePayError' in w,
            'CSSPrimitiveValue' in w,
            'Counter' in w,
            n.vendor.indexOf('Apple') === 0,
            'getStorageUpdates' in n,
            'WebKitMediaKeys' in w,
        ]) >= 4) {
            return "webkit" /* BrowserEngineKind.Webkit */;
        }
        if (countTruthy$1([
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
    function isAndroid$1() {
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
        return (countTruthy$1([
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
        return (countTruthy$1([
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
        android: isAndroid$1,
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

    /**
     * Detect browser using multiple techniques to be resilient against spoofing and user agent changes
     */
    function getBrowserName() {
        const details = detectBrowser();
        return details.name;
    }
    /**
     * Enhanced browser detection that uses multiple techniques to identify the browser
     * with high confidence even when user agent is spoofed or in mobile simulation mode
     */
    function detectBrowser() {
        // Default result with low confidence
        const result = {
            name: 'Unknown',
            version: 'Unknown',
            confidence: 0,
            engine: 'Unknown'
        };
        // Collection of detection results with confidence scores
        const detections = [];
        // First check for Edge in user agent (this is a fast check before other more intensive checks)
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('edg/') !== -1 || ua.indexOf('edge/') !== -1) {
            detections.push({ name: 'Edge', confidence: 75 });
        }
        // 1. Engine detection based on error messages (more reliable than UA)
        const engineSignatures = getEngineSignatures();
        detectByEngineSignatures(detections, engineSignatures);
        // 2. Feature detection for specific browsers
        detectByFeatures(detections);
        // 3. Protocol handler detection
        detectByProtocolHandlers(detections);
        // 4. CSS property detection
        detectByCssProperties(detections);
        // 5. Performance timing
        detectByPerformance(detections);
        // 6. JavaScript behavior patterns
        detectByJsBehavior(detections);
        // 7. Edge-specific detection - separate function to better differentiate Edge from Chrome
        detectEdgeBrowser(detections);
        // 8. Chrome-specific detection - enhanced Chrome detection
        detectChromeBrowser(detections);
        // 9. Brave-specific detection - get specific Brave signals
        detectBraveBrowser(detections);
        // Combine all detection results and calculate final browser with confidence
        if (detections.length > 0) {
            // Group by browser name and sum confidence
            const grouped = detections.reduce((acc, curr) => {
                acc[curr.name] = (acc[curr.name] || 0) + curr.confidence;
                return acc;
            }, {});
            // Find the browser with highest confidence
            let maxConfidence = 0;
            let detectedBrowser = 'Unknown';
            for (const [browser, confidence] of Object.entries(grouped)) {
                if (confidence > maxConfidence) {
                    maxConfidence = confidence;
                    detectedBrowser = browser;
                }
            }
            // Extra Edge check - check if incognito detection can confirm this is Edge
            if (detectedBrowser === 'Chrome' && isActuallyEdge()) {
                detectedBrowser = 'Edge';
            }
            result.name = detectedBrowser;
            result.confidence = Math.min(100, maxConfidence);
            // Set engine based on browser
            if (['Chrome', 'Edge', 'Opera', 'Brave'].includes(detectedBrowser)) {
                result.engine = 'Blink';
            }
            else if (detectedBrowser === 'Firefox') {
                result.engine = 'Gecko';
            }
            else if (detectedBrowser === 'Safari') {
                result.engine = 'WebKit';
            }
            // Try to extract version
            result.version = getBrowserVersion(detectedBrowser);
        }
        return result;
    }
    /**
     * Special detection for Brave browser
     */
    function detectBraveBrowser(detections) {
        try {
            // Check for Brave API directly
            if (navigator.brave) {
                detections.push({ name: 'Brave', confidence: 95 });
                return;
            }
            // Check for specific Brave patterns in the user agent
            const ua = navigator.userAgent;
            if (ua.includes('Brave') || ua.includes('brave')) {
                detections.push({ name: 'Brave', confidence: 90 });
                return;
            }
            // Brave specific behavior checks
            // 1. Brave removes certain tracking headers
            // 2. Brave blocks fingerprinting by default
            // 3. Brave has specific privacy features
            // Check for Chrome without Google Chrome-specific features
            if (typeof window.chrome !== 'undefined' &&
                window.chrome.runtime &&
                !window.google) {
                // Additional check for absence of Chrome-specific features
                const hasNoChromeFeatures = !('google' in window) &&
                    !window.chrome.webstore &&
                    typeof navigator.brave !== 'undefined';
                if (hasNoChromeFeatures) {
                    detections.push({ name: 'Brave', confidence: 60 });
                }
            }
        }
        catch (e) {
            // Ignore detection errors
        }
    }
    /**
     * Specific check to determine if a browser is Edge by using the same techniques
     * that incognito detection uses, which seems to report Edge correctly
     */
    function isActuallyEdge() {
        try {
            // Check user agent for Edge keywords
            const ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('edg/') !== -1 || ua.indexOf('edge/') !== -1) {
                return true;
            }
            // Check if any MS-specific APIs or DOM elements are available
            if (window.msCredentials ||
                document.documentMode ||
                typeof window.MSInputMethodContext !== 'undefined' ||
                typeof navigator.msLaunchUri === 'function') {
                return true;
            }
            // Check Edge-specific combination of features
            if (typeof window.chrome !== 'undefined' &&
                window.chrome.runtime &&
                !window.chrome.webstore &&
                !window.opr &&
                !window.opera) {
                // Additional Edge-specific check
                try {
                    // Edge typically does not have the Chrome PDF viewer plugin
                    const hasChromePdfViewer = Array.from(navigator.plugins)
                        .some(plugin => plugin.name === 'Chrome PDF Viewer');
                    // Check for unique Edge plugin patterns
                    const hasEdgePluginPattern = Array.from(navigator.plugins)
                        .some(plugin => plugin.name.indexOf('Edge') !== -1);
                    if (!hasChromePdfViewer || hasEdgePluginPattern) {
                        return true;
                    }
                }
                catch (e) {
                    // Plugin check failed
                }
            }
            return false;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Gets browser error behavior signature from various engine-specific behaviors
     */
    function getEngineSignatures() {
        // Error message length from toFixed with negative values
        let toFixedErrorLength = 0;
        try {
            const neg = parseInt("-1");
            neg.toFixed(neg);
        }
        catch (e) {
            toFixedErrorLength = e.message.length;
        }
        // Function.toString() behavior - varies by browser
        let functionToStringLength = 0;
        try {
            functionToStringLength = Function.prototype.toString.call(Function).length;
        }
        catch (e) {
            // Ignore error
        }
        return {
            toFixedErrorLength,
            functionToStringLength
        };
    }
    /**
     * Detects browsers based on engine-specific error message patterns
     */
    function detectByEngineSignatures(detections, signatures) {
        // Safari typically has error message length of 44
        if (signatures.toFixedErrorLength === 44) {
            detections.push({ name: 'Safari', confidence: 40 });
        }
        // Chrome typically has error message length of 51
        else if (signatures.toFixedErrorLength === 51) {
            detections.push({ name: 'Chrome', confidence: 30 }); // Increased from 15
        }
        // Firefox typically has error message length of 25
        else if (signatures.toFixedErrorLength === 25) {
            detections.push({ name: 'Firefox', confidence: 30 });
        }
        // Function.toString length can help differentiate browsers too
        if (signatures.functionToStringLength > 30 && signatures.functionToStringLength < 40) {
            detections.push({ name: 'Firefox', confidence: 10 });
        }
        else if (signatures.functionToStringLength > 40) {
            detections.push({ name: 'Chrome', confidence: 15 }); // Increased from 5
        }
    }
    /**
     * Detects browser by checking for browser-specific features and APIs
     */
    function detectByFeatures(detections) {
        // Brave detection
        if (navigator.brave &&
            typeof navigator.brave.isBrave === 'function') {
            detections.push({ name: 'Brave', confidence: 90 });
        }
        // Check for Chrome-specific APIs
        if (typeof window.chrome !== 'undefined' &&
            window.chrome.app &&
            window.chrome.runtime) {
            // First check if it's not actually Edge
            const ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('edg/') === -1 && ua.indexOf('edge/') === -1) {
                if (navigator.brave === undefined) {
                    detections.push({ name: 'Chrome', confidence: 40 }); // Increased from 25
                }
            }
            else {
                // This is more likely Edge than Chrome
                detections.push({ name: 'Edge', confidence: 40 });
            }
        }
        // Additional Chrome-specific feature detection
        if (window.chrome &&
            window.chrome.csi &&
            window.chrome.loadTimes &&
            !window.opr &&
            !window.opera &&
            !(navigator.brave && typeof navigator.brave.isBrave === 'function')) {
            // These features are very specific to Chrome and not present in most other Chromium browsers
            detections.push({ name: 'Chrome', confidence: 60 });
        }
        // Firefox-specific objects
        if (typeof window.InstallTrigger !== 'undefined' ||
            typeof window.sidebar !== 'undefined') {
            detections.push({ name: 'Firefox', confidence: 70 });
        }
        // Safari detection
        if (/constructor/i.test(window.HTMLElement) ||
            (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!(typeof window.safari === 'undefined') && window.safari.pushNotification)) {
            detections.push({ name: 'Safari', confidence: 70 });
        }
        // Basic Edge detection - more detailed in detectEdgeBrowser function
        if (window.msCredentials || document.documentMode) {
            detections.push({ name: 'Edge', confidence: 60 }); // Increased confidence
        }
        // Opera detection
        if (window.opr || window.opera) {
            detections.push({ name: 'Opera', confidence: 60 });
        }
    }
    /**
     * Detects browser by checking for browser-specific protocol handlers
     */
    function detectByProtocolHandlers(detections) {
        // Chrome/Chromium protocols
        if (typeof navigator.registerProtocolHandler === 'function') {
            try {
                if ('chrome' in window) {
                    // Only consider chrome protocol if not Edge
                    const ua = navigator.userAgent.toLowerCase();
                    if (ua.indexOf('edg/') === -1 && ua.indexOf('edge/') === -1) {
                        detections.push({ name: 'Chrome', confidence: 25 }); // Increased from 15
                    }
                }
                // Edge has ms-* protocols available
                if ('ms-access' in navigator ||
                    'ms-browser-extension' in navigator ||
                    'ms-calculator' in navigator ||
                    'ms-drive-to' in navigator ||
                    'ms-excel' in navigator ||
                    'ms-gamebarservices' in navigator ||
                    'ms-search' in navigator ||
                    'ms-word' in navigator) {
                    detections.push({ name: 'Edge', confidence: 80 }); // Increased confidence
                }
                // Opera has specific protocol handlers
                if ('opr:' in navigator.plugins ||
                    'opera:' in navigator.plugins) {
                    detections.push({ name: 'Opera', confidence: 25 });
                }
            }
            catch (e) {
                // Protocol detection failed
            }
        }
    }
    /**
     * Detects browser by checking for browser-specific CSS properties
     */
    function detectByCssProperties(detections) {
        const docStyle = window.getComputedStyle(document.documentElement);
        // Webkit-specific properties
        if (docStyle.getPropertyValue('--apple-trailing-word') !== '' ||
            docStyle.getPropertyValue('-webkit-app-region') !== '') {
            detections.push({ name: 'Safari', confidence: 20 });
        }
        // Firefox-specific properties
        if (docStyle.getPropertyValue('-moz-context-properties') !== '' ||
            docStyle.getPropertyValue('-moz-user-focus') !== '') {
            detections.push({ name: 'Firefox', confidence: 20 });
        }
        // Edge-specific CSS properties
        if (docStyle.getPropertyValue('-ms-ime-align') !== '' ||
            docStyle.getPropertyValue('-ms-flow-from') !== '') {
            detections.push({ name: 'Edge', confidence: 60 }); // Increased confidence
        }
    }
    /**
     * Detects browser by analyzing performance characteristics
     */
    function detectByPerformance(detections) {
        // Chrome/Chromium-based browsers expose memory info
        if (performance.memory &&
            performance.memory.jsHeapSizeLimit) {
            // Different Chromium browsers have different heap size limits
            const heapLimit = performance.memory.jsHeapSizeLimit;
            if (heapLimit > 2000000000) {
                // Check if it's not actually Edge before assuming Chrome
                const ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('edg/') === -1 && ua.indexOf('edge/') === -1) {
                    detections.push({ name: 'Chrome', confidence: 20 }); // Increased from 10
                }
            }
        }
        // Chrome-specific performance timing features
        if (typeof window.chrome !== 'undefined' &&
            typeof window.chrome.loadTimes === 'function') {
            try {
                const chromeLoad = window.chrome.loadTimes();
                if (chromeLoad &&
                    typeof chromeLoad.firstPaintTime === 'number' &&
                    typeof chromeLoad.requestTime === 'number') {
                    detections.push({ name: 'Chrome', confidence: 30 });
                }
            }
            catch (e) {
                // Performance timing check failed
            }
        }
    }
    /**
     * Detects browser by JavaScript behavior patterns
     */
    function detectByJsBehavior(detections) {
        // Firefox specific behavior with error stack
        try {
            throw new Error();
        }
        catch (err) {
            if (err.stack && err.stack.indexOf('()@') >= 0) {
                detections.push({ name: 'Firefox', confidence: 15 });
            }
            // Chrome-specific stack trace format
            if (err.stack && err.stack.indexOf('at new') >= 0) {
                // Check if it's not actually Edge
                const ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf('edg/') === -1 && ua.indexOf('edge/') === -1) {
                    detections.push({ name: 'Chrome', confidence: 20 }); // Increased from 10
                }
            }
            // Safari-specific stack trace format
            if (err.stack && err.stack.indexOf('@') === -1 && err.stack.indexOf('at ') === -1) {
                detections.push({ name: 'Safari', confidence: 15 });
            }
        }
        // Brave shields detection
        if (document.createElement('canvas').toDataURL().length > 15 &&
            navigator.brave === undefined &&
            typeof window.chrome !== 'undefined') {
            // Try to detect if Brave shields are on
            const img = new Image();
            let loadCount = 0;
            img.onload = () => {
                loadCount++;
                if (loadCount === 0) {
                    detections.push({ name: 'Brave', confidence: 20 });
                }
            };
            img.onerror = () => {
                detections.push({ name: 'Brave', confidence: 10 });
            };
            // Try loading a tracking pixel
            img.src = "https://www.facebook.com/tr?id=1234567890&ev=PageView";
        }
        // Additional Chrome-specific behavior check (Chrome DevTools Protocol)
        try {
            // Check if __JQUERY_OBJECT__ is defined (used in Chrome Developer Tools)
            // This will throw an error in most other browsers
            const hasDevTools = !!window.__JQUERY_OBJECT__;
            if (hasDevTools) {
                detections.push({ name: 'Chrome', confidence: 15 });
            }
        }
        catch (e) {
            // DevTools check failed
        }
        // Check Chrome user agent pattern more directly when combined with other Chrome features
        if (navigator.userAgent.indexOf('Chrome') !== -1 &&
            navigator.userAgent.indexOf('Edg') === -1 &&
            navigator.userAgent.indexOf('OPR') === -1 &&
            navigator.userAgent.indexOf('Brave') === -1 &&
            typeof window.chrome !== 'undefined' &&
            window.chrome.runtime) {
            detections.push({ name: 'Chrome', confidence: 35 });
        }
    }
    /**
     * Specialized Edge browser detection to differentiate it from Chrome
     */
    function detectEdgeBrowser(detections) {
        // Check for Edge in User Agent as a supplementary signal (still useful)
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('edg/') !== -1 || ua.indexOf('edge/') !== -1) {
            detections.push({ name: 'Edge', confidence: 80 }); // Increased from 30 to 80
        }
        // Check for Edge-specific objects
        try {
            // Check for CSS.supports method with -ms vendor prefix
            if (CSS.supports('-ms-ime-align', 'auto')) {
                detections.push({ name: 'Edge', confidence: 70 }); // Increased confidence
            }
        }
        catch (e) {
            // CSS.supports might not be available
        }
        // Check for Edge-specific behaviors
        try {
            // Test if msLaunchUri is available (Edge-specific)
            if (typeof navigator.msLaunchUri === 'function') {
                detections.push({ name: 'Edge', confidence: 85 }); // Increased confidence
            }
            // Test if MS-specific APIs are available
            if (typeof window.MSInputMethodContext !== 'undefined') {
                detections.push({ name: 'Edge', confidence: 80 }); // Increased confidence
            }
            // Check for Edge-specific storage behavior
            if (document.documentMode || /edge/i.test(navigator.userAgent)) {
                detections.push({ name: 'Edge', confidence: 75 }); // Increased confidence
            }
            // Check window.chrome properties patterns specific to Edge
            if (typeof window.chrome !== 'undefined' &&
                window.chrome.runtime &&
                !window.chrome.webstore) {
                // This combination is more common in Edge than Chrome
                detections.push({ name: 'Edge', confidence: 60 }); // Increased confidence
            }
        }
        catch (e) {
            // Ignore errors in detection
        }
        // Get text rendering metrics - Edge and Chrome render text differently
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = 200;
                canvas.height = 50;
                ctx.font = '20px Arial';
                ctx.textBaseline = 'top';
                ctx.fillText('EdgeBrowserTest', 0, 0);
                // Get image data to analyze text rendering
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                // Create a simple hash of the first few pixels
                let hash = 0;
                for (let i = 0; i < 400; i += 4) {
                    hash = ((hash << 5) - hash) + imageData[i];
                }
                // Edge typically has different text rendering than Chrome
                if (hash < 0) { // Just an example threshold, would need calibration
                    detections.push({ name: 'Edge', confidence: 50 }); // Increased confidence
                }
            }
        }
        catch (e) {
            // Canvas access might be restricted
        }
    }
    /**
     * Enhanced detection for Chrome browser
     */
    function detectChromeBrowser(detections) {
        // Complex feature combination check specific to Chrome but not other Chromium browsers
        if (
        // Must have Chrome in user agent but not be Edge or Opera
        navigator.userAgent.indexOf('Chrome') !== -1 &&
            navigator.userAgent.indexOf('Edg') === -1 &&
            navigator.userAgent.indexOf('OPR') === -1 &&
            // Must have chrome object with specific properties
            typeof window.chrome !== 'undefined' &&
            window.chrome.runtime &&
            // Check for Chrome-exclusive features
            typeof window.chrome.loadTimes === 'function' &&
            typeof window.chrome.csi === 'function' &&
            // Ensure not Brave
            typeof navigator.brave === 'undefined') {
            detections.push({ name: 'Chrome', confidence: 75 });
        }
        // Check for Chrome PDF viewer plugin (generally not present in other Chromium browsers)
        try {
            const hasPdfViewer = Array.from(navigator.plugins)
                .some(plugin => plugin.name === 'Chrome PDF Viewer');
            if (hasPdfViewer &&
                navigator.userAgent.indexOf('Chrome') !== -1 &&
                navigator.userAgent.indexOf('Edg') === -1) {
                detections.push({ name: 'Chrome', confidence: 60 });
            }
        }
        catch (e) {
            // Plugin check failed
        }
        // Check Chrome version consistency in User Agent
        // This helps differentiate from browsers that modify the Chrome version string
        try {
            const chromeMatch = navigator.userAgent.match(/Chrome\/([0-9.]+)/);
            if (chromeMatch) {
                const chromeVersion = chromeMatch[1];
                // If app version contains the Chrome version and doesn't have Edg
                if (navigator.appVersion.indexOf(chromeVersion) !== -1 &&
                    navigator.userAgent.indexOf('Edg') === -1 &&
                    navigator.userAgent.indexOf('OPR') === -1) {
                    detections.push({ name: 'Chrome', confidence: 30 });
                }
            }
        }
        catch (e) {
            // Version check failed
        }
    }
    /**
     * Attempts to get the browser version
     */
    function getBrowserVersion(browserName) {
        const userAgent = navigator.userAgent;
        let version = 'Unknown';
        try {
            if (browserName === 'Chrome') {
                const match = userAgent.match(/Chrome\/([0-9.]+)/);
                if (match) {
                    version = match[1];
                }
            }
            else if (browserName === 'Firefox') {
                const match = userAgent.match(/Firefox\/([0-9.]+)/);
                if (match) {
                    version = match[1];
                }
            }
            else if (browserName === 'Safari') {
                const match = userAgent.match(/Version\/([0-9.]+)/);
                if (match) {
                    version = match[1];
                }
            }
            else if (browserName === 'Edge') {
                // Modern Edge (Chromium-based)
                const edgeMatch = userAgent.match(/Edg(?:e)?\/([0-9.]+)/);
                if (edgeMatch) {
                    version = edgeMatch[1];
                }
            }
            else if (browserName === 'Opera') {
                const match = userAgent.match(/OPR\/([0-9.]+)/);
                if (match) {
                    version = match[1];
                }
            }
            else if (browserName === 'Brave') {
                // First try to get version through Brave API if available
                if (navigator.brave && navigator.brave.version) {
                    version = navigator.brave.version;
                }
                else {
                    // Otherwise extract from user agent like Chrome
                    // Brave uses the same Chrome version string but with Brave/[version]
                    const braveMatch = userAgent.match(/Brave\/([0-9.]+)/);
                    if (braveMatch) {
                        version = braveMatch[1];
                    }
                    else {
                        // Fall back to Chrome version
                        const chromeMatch = userAgent.match(/Chrome\/([0-9.]+)/);
                        if (chromeMatch) {
                            version = chromeMatch[1];
                        }
                    }
                    // Try to access the Brave browser version via JavaScript API if available
                    if (typeof navigator.brave !== 'undefined') {
                        try {
                            // Request brave version info
                            navigator.brave.isBrave().then((isBrave) => {
                                if (isBrave) {
                                    // Remove console log
                                }
                            });
                        }
                        catch (e) {
                            // API access failed
                        }
                    }
                }
            }
        }
        catch (e) {
            // Keep default 'Unknown' value
        }
        return version;
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

    function getCommonPixels(images, width, height) {
        let finalData = [];
        for (let i = 0; i < images[0].data.length; i++) {
            let indice = [];
            for (let u = 0; u < images.length; u++) {
                indice.push(images[u].data[i]);
            }
            finalData.push(getMostFrequent(indice));
        }
        const pixelData = finalData;
        const pixelArray = new Uint8ClampedArray(pixelData);
        return new ImageData(pixelArray, width, height);
    }
    function getMostFrequent(arr) {
        if (arr.length === 0) {
            return 0; // Handle empty array case
        }
        const frequencyMap = {};
        // Count occurrences of each number in the array
        for (const num of arr) {
            frequencyMap[num] = (frequencyMap[num] || 0) + 1;
        }
        let mostFrequent = arr[0];
        // Find the number with the highest frequency
        for (const num in frequencyMap) {
            if (frequencyMap[num] > frequencyMap[mostFrequent]) {
                mostFrequent = parseInt(num, 10);
            }
        }
        return mostFrequent;
    }

    const _RUNS$1 = (getBrowserName() !== 'SamsungBrowser') ? 1 : 3;
    /**
     * A simple canvas finger printing function
     *
     * @returns a CanvasInfo JSON object
     */
    const _WIDTH = 280;
    const _HEIGHT = 20;
    function generateCanvasFingerprint() {
        return new Promise((resolve) => {
            /**
             * Since some browsers fudge with the canvas pixels to prevent fingerprinting, the following
             * creates the canvas three times and getCommonPixels picks the most common byte for each
             * channel of each pixel.
             */
            const imageDatas = Array.from({ length: _RUNS$1 }, () => generateCanvasImageData());
            const commonImageData = getCommonPixels(imageDatas, _WIDTH, _HEIGHT);
            resolve({
                'commonImageDataHash': hash(commonImageData.data.toString()).toString(),
            });
        });
    }
    function generateCanvasImageData() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return new ImageData(1, 1);
        }
        // Set canvas dimensions
        canvas.width = _WIDTH;
        canvas.height = _HEIGHT;
        // Create rainbow gradient for the background rectangle
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(1 / 6, "orange");
        gradient.addColorStop(2 / 6, "yellow");
        gradient.addColorStop(3 / 6, "green");
        gradient.addColorStop(4 / 6, "blue");
        gradient.addColorStop(5 / 6, "indigo");
        gradient.addColorStop(1, "violet");
        // Draw background rectangle with the rainbow gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw some random text
        const randomText = 'Random Text WMwmil10Oo';
        ctx.font = '23.123px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(randomText, -5, 15);
        // Draw the same text with an offset, different color, and slight transparency
        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.fillText(randomText, -3.3, 17.7);
        // Draw a line crossing the image at an arbitrary angle
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width * 2 / 7, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Return data URL of the canvas
        return imageData;
    }
    if (getBrowserName() != 'Firefox')
        includeComponent('canvas', generateCanvasFingerprint);

    async function ephemeralIFrame(callback) {
        var _a;
        while (!document.body) {
            await wait$1(50);
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
    function wait$1(durationMs, resolveWith) {
        return new Promise((resolve) => setTimeout(resolve, durationMs, resolveWith));
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

    const _RUNS = (getBrowserName() !== 'SamsungBrowser') ? 1 : 3;
    let canvas;
    let gl = null;
    function initializeCanvasAndWebGL() {
        if (typeof document !== 'undefined') {
            canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 100;
            gl = canvas.getContext('webgl');
        }
    }
    async function createWebGLFingerprint() {
        initializeCanvasAndWebGL();
        try {
            if (!gl) {
                throw new Error('WebGL not supported');
            }
            const imageDatas = Array.from({ length: _RUNS }, () => createWebGLImageData());
            // and then checking the most common bytes for each channel of each pixel
            const commonImageData = getCommonPixels(imageDatas, canvas.width, canvas.height);
            //const imageData = createWebGLImageData()
            return {
                'commonImageHash': hash(commonImageData.data.toString()).toString(),
            };
        }
        catch (error) {
            return {
                'webgl': 'unsupported'
            };
        }
    }
    function createWebGLImageData() {
        try {
            if (!gl) {
                throw new Error('WebGL not supported');
            }
            const vertexShaderSource = `
          attribute vec2 position;
          void main() {
              gl_Position = vec4(position, 0.0, 1.0);
          }
      `;
            const fragmentShaderSource = `
          precision mediump float;
          void main() {
              gl_FragColor = vec4(0.812, 0.195, 0.553, 0.921); // Set line color
          }
      `;
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            if (!vertexShader || !fragmentShader) {
                throw new Error('Failed to create shaders');
            }
            gl.shaderSource(vertexShader, vertexShaderSource);
            gl.shaderSource(fragmentShader, fragmentShaderSource);
            gl.compileShader(vertexShader);
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                throw new Error('Vertex shader compilation failed: ' + gl.getShaderInfoLog(vertexShader));
            }
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                throw new Error('Fragment shader compilation failed: ' + gl.getShaderInfoLog(fragmentShader));
            }
            const shaderProgram = gl.createProgram();
            if (!shaderProgram) {
                throw new Error('Failed to create shader program');
            }
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                throw new Error('Shader program linking failed: ' + gl.getProgramInfoLog(shaderProgram));
            }
            gl.useProgram(shaderProgram);
            // Set up vertices to form lines
            const numSpokes = 137;
            const vertices = new Float32Array(numSpokes * 4);
            const angleIncrement = (2 * Math.PI) / numSpokes;
            for (let i = 0; i < numSpokes; i++) {
                const angle = i * angleIncrement;
                // Define two points for each line (spoke)
                vertices[i * 4] = 0; // Center X
                vertices[i * 4 + 1] = 0; // Center Y
                vertices[i * 4 + 2] = Math.cos(angle) * (canvas.width / 2); // Endpoint X
                vertices[i * 4 + 3] = Math.sin(angle) * (canvas.height / 2); // Endpoint Y
            }
            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            const positionAttribute = gl.getAttribLocation(shaderProgram, 'position');
            gl.enableVertexAttribArray(positionAttribute);
            gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
            // Render
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.LINES, 0, numSpokes * 2);
            const pixelData = new Uint8ClampedArray(canvas.width * canvas.height * 4);
            gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);
            const imageData = new ImageData(pixelData, canvas.width, canvas.height);
            return imageData;
        }
        catch (error) {
            //console.error(error);
            return new ImageData(1, 1);
        }
        finally {
            if (gl) {
                // Reset WebGL state
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                gl.useProgram(null);
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                gl.clearColor(0.0, 0.0, 0.0, 0.0);
            }
        }
    }
    includeComponent('webgl', createWebGLFingerprint);

    function getInstalledPlugins() {
        const plugins = [];
        if (navigator.plugins) {
            for (let i = 0; i < navigator.plugins.length; i++) {
                const plugin = navigator.plugins[i];
                plugins.push([plugin.name, plugin.filename, plugin.description].join("|"));
            }
        }
        return new Promise((resolve) => {
            resolve({
                'plugins': plugins
            });
        });
    }
    includeComponent('plugins', getInstalledPlugins);

    async function getSystemDetails() {
        return new Promise((resolve) => {
            // Get detailed browser information
            const browserDetails = detectBrowser();
            resolve({
                'platform': window.navigator.platform,
                'cookieEnabled': window.navigator.cookieEnabled,
                'productSub': navigator.productSub,
                'product': navigator.product,
                'browser': {
                    'name': browserDetails.name,
                },
                'applePayVersion': getApplePayVersion(),
            });
        });
    }
    /**
     * Generates a unique browser hash based on various browser characteristics
     * that can be used for fingerprinting
     */
    // function generateBrowserHash(): string {
    //     const characteristics = [
    //         navigator.userAgent,
    //         navigator.language,
    //         navigator.hardwareConcurrency,
    //         navigator.deviceMemory,
    //         navigator.platform,
    //         screen.colorDepth,
    //         navigator.maxTouchPoints,
    //         'chrome' in window ? 'chrome' : 'no-chrome',
    //         'opr' in window ? 'opera' : 'no-opera',
    //         'safari' in window ? 'safari' : 'no-safari',
    //         new Date().getTimezoneOffset(),
    //         screen.width + 'x' + screen.height
    //     ];
    //     // Use simple hashing algorithm
    //     let hash = 0;
    //     const str = characteristics.join('||');
    //     for (let i = 0; i < str.length; i++) {
    //         const char = str.charCodeAt(i);
    //         hash = ((hash << 5) - hash) + char;
    //         hash = hash & hash; // Convert to 32bit integer
    //     }
    //     // Convert to hex string
    //     return (hash >>> 0).toString(16).padStart(8, '0');
    // }
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

    /**
     * Set of emojis to sample for fingerprinting
     * These emojis are chosen because they have significant rendering differences across platforms
     */
    const TEST_EMOJIS = [
        '😀', // Basic smiling face - varies significantly
        '👨‍👩‍👧‍👦', // Family emoji - complex with multiple characters
        '🇺🇸', // Flag - rendered differently across platforms
        '🍎', // Apple - varies in color and style
        '🐼', // Panda - good variation in details
        '🚀', // Rocket - complex shape with details
        '🏳️‍🌈', // Rainbow flag - combination character
        '👍🏽', // Thumbs up with skin tone - tests skin tone rendering
        '❤️', // Heart with variation selector
        '🤦‍♂️', // Facepalm with gender - complex combination
    ];
    /**
     * Font families to test for emoji rendering variations
     */
    const TEST_FONTS = [
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji',
        'Android Emoji',
        'EmojiOne',
        'Twemoji Mozilla',
        'sans-serif' // Fallback
    ];
    /**
     * Renders an emoji to a canvas and returns its pixel data
     * @param emoji The emoji to render
     * @param fontFamily Font family to use
     * @returns Uint8ClampedArray of pixels or null if rendering fails
     */
    function renderEmojiToCanvas(emoji, fontFamily) {
        try {
            // Create canvas and context
            const canvas = document.createElement('canvas');
            const size = 20; // Small size is enough for fingerprinting
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return null;
            // Clear background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            // Draw emoji
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'black';
            ctx.font = `16px "${fontFamily}"`;
            ctx.fillText(emoji, size / 2, size / 2);
            // Get pixel data
            return ctx.getImageData(0, 0, size, size).data;
        }
        catch (e) {
            return null;
        }
    }
    /**
     * Creates a simplified fingerprint from pixel data by sampling
     * @param pixels Canvas pixel data
     * @returns Simplified representation for fingerprinting
     */
    function simplifyPixelData(pixels) {
        // Sample every 8th pixel for efficiency
        const simplified = [];
        for (let i = 0; i < pixels.length; i += 32) {
            // Use only RGB values (skip alpha)
            simplified.push(pixels[i], pixels[i + 1], pixels[i + 2]);
        }
        return simplified;
    }
    /**
     * Generates a fingerprint based on emoji rendering
     * @returns Promise that resolves to emoji fingerprint data
     */
    async function getEmojiFingerprint() {
        return new Promise((resolve) => {
            try {
                const results = {};
                let combinedData = [];
                // Test each emoji with the first available font
                TEST_EMOJIS.forEach((emoji, index) => {
                    // Try each font until one works
                    for (const font of TEST_FONTS) {
                        const pixelData = renderEmojiToCanvas(emoji, font);
                        if (pixelData) {
                            const simplified = simplifyPixelData(pixelData);
                            combinedData = [...combinedData, ...simplified];
                            // Store individual emoji hash for detailed fingerprinting
                            results[`emoji_${index}`] = hash(new Uint8Array(simplified).buffer).slice(0, 16);
                            break; // Use first successful font
                        }
                    }
                });
                // Generate a combined hash for all emoji data
                const combinedHash = hash(new Uint8Array(combinedData).buffer);
                resolve({
                    emojiFingerprintHash: combinedHash,
                    emojiDetails: results,
                    uniqueEmojisRendered: Object.keys(results).length
                });
            }
            catch (e) {
                // Fallback in case of any errors
                resolve({
                    emojiFingerprintHash: 'unsupported',
                    emojiDetails: {},
                    uniqueEmojisRendered: 0
                });
            }
        });
    }
    // Register the component
    includeComponent('emojiFingerprint', getEmojiFingerprint);

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

    function wait(durationMs, resolveWith) {
        return new Promise((resolve) => setTimeout(resolve, durationMs, resolveWith));
    }

    /*
     * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
     */
    /**
     * Does the same as Array.prototype.includes but has better typing
     */
    function countTruthy(values) {
        return values.reduce((sum, value) => sum + (value ? 1 : 0), 0);
    }
    /**
     * Parses a CSS selector into tag name with HTML attributes.
     * Only single element selector are supported (without operators like space, +, >, etc).
     *
     * Multiple values can be returned for each attribute. You decide how to handle them.
     */
    function parseSimpleCssSelector(selector) {
        var _a, _b;
        const errorMessage = `Unexpected syntax '${selector}'`;
        const tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector);
        const tag = tagMatch[1] || undefined;
        const attributes = {};
        const partsRegex = /([.:#][\w-]+|\[.+?\])/gi;
        const addAttribute = (name, value) => {
            attributes[name] = attributes[name] || [];
            attributes[name].push(value);
        };
        for (;;) {
            const match = partsRegex.exec(tagMatch[2]);
            if (!match) {
                break;
            }
            const part = match[0];
            switch (part[0]) {
                case '.':
                    addAttribute('class', part.slice(1));
                    break;
                case '#':
                    addAttribute('id', part.slice(1));
                    break;
                case '[': {
                    const attributeMatch = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part);
                    if (attributeMatch) {
                        addAttribute(attributeMatch[1], (_b = (_a = attributeMatch[4]) !== null && _a !== void 0 ? _a : attributeMatch[5]) !== null && _b !== void 0 ? _b : '');
                    }
                    else {
                        throw new Error(errorMessage);
                    }
                    break;
                }
                default:
                    throw new Error(errorMessage);
            }
        }
        return [tag, attributes];
    }

    /**
     * Creates a DOM element that matches the given selector.
     * Only single element selector are supported (without operators like space, +, >, etc).
     */
    function selectorToElement(selector) {
        const [tag, attributes] = parseSimpleCssSelector(selector);
        const element = document.createElement(tag !== null && tag !== void 0 ? tag : 'div');
        for (const name of Object.keys(attributes)) {
            const value = attributes[name].join(' ');
            // Changing the `style` attribute can cause a CSP error, therefore we change the `style.cssText` property.
            // https://github.com/fingerprintjs/fingerprintjs/issues/733
            if (name === 'style') {
                addStyleString(element.style, value);
            }
            else {
                element.setAttribute(name, value);
            }
        }
        return element;
    }
    /**
     * Adds CSS styles from a string in such a way that doesn't trigger a CSP warning (unsafe-inline or unsafe-eval)
     */
    function addStyleString(style, source) {
        // We don't use `style.cssText` because browsers must block it when no `unsafe-eval` CSP is presented: https://csplite.com/csp145/#w3c_note
        // Even though the browsers ignore this standard, we don't use `cssText` just in case.
        for (const property of source.split(';')) {
            const match = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(property);
            if (match) {
                const [, name, value, , priority] = match;
                style.setProperty(name, value, priority || ''); // The last argument can't be undefined in IE11
            }
        }
    }

    /**
     * Checks whether the browser is based on Chromium without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isChromium() {
        // Based on research in October 2020. Tested to detect Chromium 42-86.
        const w = window;
        const n = navigator;
        return (countTruthy([
            'webkitPersistentStorage' in n,
            'webkitTemporaryStorage' in n,
            (n.vendor || '').indexOf('Google') === 0,
            'webkitResolveLocalFileSystemURL' in w,
            'BatteryManager' in w,
            'webkitMediaStream' in w,
            'webkitSpeechGrammar' in w,
        ]) >= 5);
    }
    /**
     * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
     * All iOS browsers use WebKit (the Safari engine).
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isWebKit() {
        // Based on research in August 2024
        const w = window;
        const n = navigator;
        return (countTruthy([
            'ApplePayError' in w,
            'CSSPrimitiveValue' in w,
            'Counter' in w,
            n.vendor.indexOf('Apple') === 0,
            'RGBColor' in w,
            'WebKitMediaKeys' in w,
        ]) >= 4);
    }
    /**
     * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isGecko() {
        var _a, _b;
        const w = window;
        // Based on research in September 2020
        return (countTruthy([
            'buildID' in navigator,
            'MozAppearance' in ((_b = (_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.style) !== null && _b !== void 0 ? _b : {}),
            'onmozfullscreenchange' in w,
            'mozInnerScreenX' in w,
            'CSSMozDocumentRule' in w,
            'CanvasCaptureMediaStream' in w,
        ]) >= 4);
    }
    /**
     * Checks whether the device runs on Android without using user-agent.
     *
     * Warning for package users:
     * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
     */
    function isAndroid() {
        const isItChromium = isChromium();
        const isItGecko = isGecko();
        const w = window;
        const n = navigator;
        // Chrome removes all words "Android" from `navigator` when desktop version is requested
        // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
        if (isItChromium) {
            return (countTruthy([
                !('SharedWorker' in w),
                // `typechange` is deprecated, but it's still present on Android (tested on Chrome Mobile 117)
                // Removal proposal https://bugs.chromium.org/p/chromium/issues/detail?id=699892
                // Note: this expression returns true on ChromeOS, so additional detectors are required to avoid false-positives
                // n[c] && 'ontypechange' in n[c],
                !('sinkId' in new Audio()),
            ]) >= 2);
        }
        else if (isItGecko) {
            return countTruthy(['onorientationchange' in w, 'orientation' in w, /android/i.test(n.appVersion)]) >= 2;
        }
        else {
            // Only 2 browser engines are presented on Android.
            // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
            return false;
        }
    }

    // Floating-point calculations (Math.sin(), Math.log()) produce slightly different results across CPUs due to:
    // Extremely hard to spoof without emulating a different CPU.
    // function getCPUFingerprint(): any {
    //     return {
    //       sin1: Math.sin(1),        
    //       log10: Math.log(10),     
    //       tanh05: Math.tanh(0.5),      
    //     };
    // }
    var SpecialFingerprint;
    (function (SpecialFingerprint) {
        /** The browser doesn't support AudioContext or baseLatency */
        SpecialFingerprint[SpecialFingerprint["NotSupported"] = -1] = "NotSupported";
        /** Entropy source is disabled because of console warnings */
        SpecialFingerprint[SpecialFingerprint["Disabled"] = -2] = "Disabled";
    })(SpecialFingerprint || (SpecialFingerprint = {}));
    function getAudioContextBaseLatency() {
        var _a;
        // The signal emits warning in Chrome and Firefox, therefore it is enabled on Safari where it doesn't produce warning
        // and on Android where it's less visible
        const isAllowedPlatform = isAndroid() || isWebKit();
        if (!isAllowedPlatform) {
            return SpecialFingerprint.Disabled;
        }
        if (!window.AudioContext) {
            return SpecialFingerprint.NotSupported;
        }
        return (_a = new AudioContext().baseLatency) !== null && _a !== void 0 ? _a : SpecialFingerprint.NotSupported;
    }
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut
     */
    function getColorGamut() {
        // rec2020 includes p3 and p3 includes srgb
        for (const gamut of ['rec2020', 'p3', 'srgb']) {
            if (matchMedia(`(color-gamut: ${gamut})`).matches) {
                return gamut;
            }
        }
        return undefined;
    }
    function areColorsForced() {
        if (doesMatch('active')) {
            return true;
        }
        if (doesMatch('none')) {
            return false;
        }
        return undefined;
    }
    function doesMatch(value) {
        return matchMedia(`(forced-colors: ${value})`).matches;
    }
    const maxValueToCheck = 100;
    /**
     * If the display is monochrome (e.g. black&white), the value will be ≥0 and will mean the number of bits per pixel.
     * If the display is not monochrome, the returned value will be 0.
     * If the browser doesn't support this feature, the returned value will be undefined.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome
     */
    function getMonochromeDepth() {
        if (!matchMedia('(min-monochrome: 0)').matches) {
            // The media feature isn't supported by the browser
            return undefined;
        }
        // A variation of binary search algorithm can be used here.
        // But since expected values are very small (≤10), there is no sense in adding the complexity.
        for (let i = 0; i <= maxValueToCheck; ++i) {
            if (matchMedia(`(max-monochrome: ${i})`).matches) {
                return i;
            }
        }
        throw new Error('Too high value');
    }
    function getOsCpu() {
        return navigator.oscpu;
    }
    /**
     * Checks for browser-specific (not engine specific) global variables to tell browsers with the same engine apart.
     * Only somewhat popular browsers are considered.
     */
    function getVendorFlavors() {
        const flavors = [];
        for (const key of [
            // Blink and some browsers on iOS
            'chrome',
            // Safari on macOS
            'safari',
            // Chrome on iOS (checked in 85 on 13 and 87 on 14)
            '__crWeb',
            '__gCrWeb',
            // Yandex Browser on iOS, macOS and Android (checked in 21.2 on iOS 14, macOS and Android)
            'yandex',
            // Yandex Browser on iOS (checked in 21.2 on 14)
            '__yb',
            '__ybro',
            // Firefox on iOS (checked in 32 on 14)
            '__firefox__',
            // Edge on iOS (checked in 46 on 14)
            '__edgeTrackingPreventionStatistics',
            'webkit',
            // Opera Touch on iOS (checked in 2.6 on 14)
            'oprt',
            // Samsung Internet on Android (checked in 11.1)
            'samsungAr',
            // UC Browser on Android (checked in 12.10 and 13.0)
            'ucweb',
            'UCShellJava',
            // Puffin on Android (checked in 9.0)
            'puffinDevice',
            // UC on iOS and Opera on Android have no specific global variables
            // Edge for Android isn't checked
        ]) {
            const value = window[key];
            if (value && typeof value === 'object') {
                flavors.push(key);
            }
        }
        return flavors.sort();
    }
    /**
     * Only single element selector are supported (no operators like space, +, >, etc).
     * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
     * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
     *
     * The "inappropriate" selectors are obfuscated. See https://github.com/fingerprintjs/fingerprintjs/issues/734.
     * A function is used instead of a plain object to help tree-shaking.
     *
     * The function code is generated automatically. See docs/content_blockers.md to learn how to make the list.
     */
    function getFilters() {
        const fromB64 = atob; // Just for better minification
        return {
            abpIndo: [
                '#Iklan-Melayang',
                '#Kolom-Iklan-728',
                '#SidebarIklan-wrapper',
                '[title="ALIENBOLA" i]',
                fromB64('I0JveC1CYW5uZXItYWRz'),
            ],
            abpvn: ['.quangcao', '#mobileCatfish', fromB64('LmNsb3NlLWFkcw=='), '[id^="bn_bottom_fixed_"]', '#pmadv'],
            adBlockFinland: [
                '.mainostila',
                fromB64('LnNwb25zb3JpdA=='),
                '.ylamainos',
                fromB64('YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd'),
            ],
            adBlockPersian: [
                '#navbar_notice_50',
                '.kadr',
                'TABLE[width="140px"]',
                '#divAgahi',
                fromB64('YVtocmVmXj0iaHR0cDovL2cxLnYuZndtcm0ubmV0L2FkLyJd'),
            ],
            adBlockWarningRemoval: [
                '#adblock-honeypot',
                '.adblocker-root',
                '.wp_adblock_detect',
                fromB64('LmhlYWRlci1ibG9ja2VkLWFk'),
                fromB64('I2FkX2Jsb2NrZXI='),
            ],
            adGuardAnnoyances: [
                '.hs-sosyal',
                '#cookieconsentdiv',
                'div[class^="app_gdpr"]',
                '.as-oil',
                '[data-cypress="soft-push-notification-modal"]',
            ],
            adGuardBase: [
                '.BetterJsPopOverlay',
                fromB64('I2FkXzMwMFgyNTA='),
                fromB64('I2Jhbm5lcmZsb2F0MjI='),
                fromB64('I2NhbXBhaWduLWJhbm5lcg=='),
                fromB64('I0FkLUNvbnRlbnQ='),
            ],
            adGuardChinese: [
                fromB64('LlppX2FkX2FfSA=='),
                fromB64('YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd'),
                '#widget-quan',
                fromB64('YVtocmVmKj0iLzg0OTkyMDIwLnh5eiJd'),
                fromB64('YVtocmVmKj0iLjE5NTZobC5jb20vIl0='),
            ],
            adGuardFrench: [
                '#pavePub',
                fromB64('LmFkLWRlc2t0b3AtcmVjdGFuZ2xl'),
                '.mobile_adhesion',
                '.widgetadv',
                fromB64('LmFkc19iYW4='),
            ],
            adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
            adGuardJapanese: [
                '#kauli_yad_1',
                fromB64('YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0='),
                fromB64('Ll9wb3BJbl9pbmZpbml0ZV9hZA=='),
                fromB64('LmFkZ29vZ2xl'),
                fromB64('Ll9faXNib29zdFJldHVybkFk'),
            ],
            adGuardMobile: [
                fromB64('YW1wLWF1dG8tYWRz'),
                fromB64('LmFtcF9hZA=='),
                'amp-embed[type="24smi"]',
                '#mgid_iframe1',
                fromB64('I2FkX2ludmlld19hcmVh'),
            ],
            adGuardRussian: [
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0='),
                fromB64('LnJlY2xhbWE='),
                'div[id^="smi2adblock"]',
                fromB64('ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd'),
                '#psyduckpockeball',
            ],
            adGuardSocial: [
                fromB64('YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0='),
                fromB64('YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0='),
                '.etsy-tweet',
                '#inlineShare',
                '.popup-social',
            ],
            adGuardSpanishPortuguese: ['#barraPublicidade', '#Publicidade', '#publiEspecial', '#queTooltip', '.cnt-publi'],
            adGuardTrackingProtection: [
                '#qoo-counter',
                fromB64('YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=='),
                fromB64('YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0='),
                fromB64('YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=='),
                '#top100counter',
            ],
            adGuardTurkish: [
                '#backkapat',
                fromB64('I3Jla2xhbWk='),
                fromB64('YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0='),
                fromB64('YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd'),
                fromB64('YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ=='),
            ],
            bulgarian: [fromB64('dGQjZnJlZW5ldF90YWJsZV9hZHM='), '#ea_intext_div', '.lapni-pop-over', '#xenium_hot_offers'],
            easyList: [
                '.yb-floorad',
                fromB64('LndpZGdldF9wb19hZHNfd2lkZ2V0'),
                fromB64('LnRyYWZmaWNqdW5reS1hZA=='),
                '.textad_headline',
                fromB64('LnNwb25zb3JlZC10ZXh0LWxpbmtz'),
            ],
            easyListChina: [
                fromB64('LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=='),
                fromB64('LmZyb250cGFnZUFkdk0='),
                '#taotaole',
                '#aafoot.top_box',
                '.cfa_popup',
            ],
            easyListCookie: [
                '.ezmob-footer',
                '.cc-CookieWarning',
                '[data-cookie-number]',
                fromB64('LmF3LWNvb2tpZS1iYW5uZXI='),
                '.sygnal24-gdpr-modal-wrap',
            ],
            easyListCzechSlovak: [
                '#onlajny-stickers',
                fromB64('I3Jla2xhbW5pLWJveA=='),
                fromB64('LnJla2xhbWEtbWVnYWJvYXJk'),
                '.sklik',
                fromB64('W2lkXj0ic2tsaWtSZWtsYW1hIl0='),
            ],
            easyListDutch: [
                fromB64('I2FkdmVydGVudGll'),
                fromB64('I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=='),
                '.adstekst',
                fromB64('YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0='),
                '#semilo-lrectangle',
            ],
            easyListGermany: [
                '#SSpotIMPopSlider',
                fromB64('LnNwb25zb3JsaW5rZ3J1ZW4='),
                fromB64('I3dlcmJ1bmdza3k='),
                fromB64('I3Jla2xhbWUtcmVjaHRzLW1pdHRl'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9iZDc0Mi5jb20vIl0='),
            ],
            easyListItaly: [
                fromB64('LmJveF9hZHZfYW5udW5jaQ=='),
                '.sb-box-pubbliredazionale',
                fromB64('YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ=='),
            ],
            easyListLithuania: [
                fromB64('LnJla2xhbW9zX3RhcnBhcw=='),
                fromB64('LnJla2xhbW9zX251b3JvZG9z'),
                fromB64('aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd'),
                fromB64('aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd'),
                fromB64('aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd'),
            ],
            estonian: [fromB64('QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==')],
            fanboyAnnoyances: ['#ac-lre-player', '.navigate-to-top', '#subscribe_popup', '.newsletter_holder', '#back-top'],
            fanboyAntiFacebook: ['.util-bar-module-firefly-visible'],
            fanboyEnhancedTrackers: [
                '.open.pushModal',
                '#issuem-leaky-paywall-articles-zero-remaining-nag',
                '#sovrn_container',
                'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
                '.BlockNag__Card',
            ],
            fanboySocial: ['#FollowUs', '#meteored_share', '#social_follow', '.article-sharer', '.community__social-desc'],
            frellwitSwedish: [
                fromB64('YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=='),
                fromB64('YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=='),
                'article.category-samarbete',
                fromB64('ZGl2LmhvbGlkQWRz'),
                'ul.adsmodern',
            ],
            greekAdBlock: [
                fromB64('QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd'),
                fromB64('QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=='),
                fromB64('QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd'),
                'DIV.agores300',
                'TABLE.advright',
            ],
            hungarian: [
                '#cemp_doboz',
                '.optimonk-iframe-container',
                fromB64('LmFkX19tYWlu'),
                fromB64('W2NsYXNzKj0iR29vZ2xlQWRzIl0='),
                '#hirdetesek_box',
            ],
            iDontCareAboutCookies: [
                '.alert-info[data-block-track*="CookieNotice"]',
                '.ModuleTemplateCookieIndicator',
                '.o--cookies--container',
                '#cookies-policy-sticky',
                '#stickyCookieBar',
            ],
            icelandicAbp: [fromB64('QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==')],
            latvian: [
                fromB64('YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0O' +
                    'iA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0='),
                fromB64('YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6I' +
                    'DMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ=='),
            ],
            listKr: [
                fromB64('YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0='),
                fromB64('I2xpdmVyZUFkV3JhcHBlcg=='),
                fromB64('YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=='),
                fromB64('aW5zLmZhc3R2aWV3LWFk'),
                '.revenue_unit_item.dable',
            ],
            listeAr: [
                fromB64('LmdlbWluaUxCMUFk'),
                '.right-and-left-sponsers',
                fromB64('YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=='),
                fromB64('YVtocmVmKj0iYm9vcmFxLm9yZyJd'),
                fromB64('YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd'),
            ],
            listeFr: [
                fromB64('YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=='),
                fromB64('I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=='),
                fromB64('YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0='),
                '.site-pub-interstitiel',
                'div[id^="crt-"][data-criteo-id]',
            ],
            officialPolish: [
                '#ceneo-placeholder-ceneo-12',
                fromB64('W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd'),
                fromB64('YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=='),
                fromB64('YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=='),
                fromB64('ZGl2I3NrYXBpZWNfYWQ='),
            ],
            ro: [
                fromB64('YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd'),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0='),
                fromB64('YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd'),
                'a[href^="/url/"]',
            ],
            ruAd: [
                fromB64('YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd'),
                fromB64('YVtocmVmKj0iLy91dGltZy5ydS8iXQ=='),
                fromB64('YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0='),
                '#pgeldiz',
                '.yandex-rtb-block',
            ],
            thaiAds: [
                'a[href*=macau-uta-popup]',
                fromB64('I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=='),
                fromB64('LmFkczMwMHM='),
                '.bumq',
                '.img-kosana',
            ],
            webAnnoyancesUltralist: [
                '#mod-social-share-2',
                '#social-tools',
                fromB64('LmN0cGwtZnVsbGJhbm5lcg=='),
                '.zergnet-recommend',
                '.yt.btn-link.btn-md.btn',
            ],
        };
    }
    /**
     * The order of the returned array means nothing (it's always sorted alphabetically).
     *
     * Notice that the source is slightly unstable.
     * Safari provides a 2-taps way to disable all content blockers on a page temporarily.
     * Also content blockers can be disabled permanently for a domain, but it requires 4 taps.
     * So empty array shouldn't be treated as "no blockers", it should be treated as "no signal".
     * If you are a website owner, don't make your visitors want to disable content blockers.
     */
    async function getDomBlockers() {
        if (!isApplicable()) {
            return undefined;
        }
        const filters = getFilters();
        const filterNames = Object.keys(filters);
        const allSelectors = [].concat(...filterNames.map((filterName) => filters[filterName]));
        const blockedSelectors = await getBlockedSelectors(allSelectors);
        const activeBlockers = filterNames.filter((filterName) => {
            const selectors = filters[filterName];
            const blockedCount = countTruthy(selectors.map((selector) => blockedSelectors[selector]));
            return blockedCount > selectors.length * 0.6;
        });
        activeBlockers.sort();
        return activeBlockers;
    }
    function isApplicable() {
        // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
        return isWebKit() || isAndroid();
    }
    async function getBlockedSelectors(selectors) {
        var _a;
        const d = document;
        const root = d.createElement('div');
        const elements = new Array(selectors.length);
        const blockedSelectors = {}; // Set() isn't used just in case somebody need older browser support
        forceShow(root);
        // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
        // browser will alternate tree modification and layout reading, that is very slow.
        for (let i = 0; i < selectors.length; ++i) {
            const element = selectorToElement(selectors[i]);
            if (element.tagName === 'DIALOG') {
                element.show();
            }
            const holder = d.createElement('div'); // Protects from unwanted effects of `+` and `~` selectors of filters
            forceShow(holder);
            holder.appendChild(element);
            root.appendChild(holder);
            elements[i] = element;
        }
        // document.body can be null while the page is loading
        while (!d.body) {
            await wait(50);
        }
        d.body.appendChild(root);
        try {
            // Then check which of the elements are blocked
            for (let i = 0; i < selectors.length; ++i) {
                if (!elements[i].offsetParent) {
                    blockedSelectors[selectors[i]] = true;
                }
            }
        }
        finally {
            // Then remove the elements
            (_a = root.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(root);
        }
        return blockedSelectors;
    }
    function forceShow(element) {
        element.style.setProperty('visibility', 'hidden', 'important');
        element.style.setProperty('display', 'block', 'important');
    }
    includeComponent('domBlockers', getDomBlockers);
    includeComponent('vendorFlavour', getVendorFlavors);
    includeComponent('monochrome', getMonochromeDepth);
    includeComponent('forcedColors', areColorsForced);
    includeComponent('colorGamut', getColorGamut);
    includeComponent('osCpu', getOsCpu);
    includeComponent('audioLatency', getAudioContextBaseLatency);

    function trackBehaviour(config) {
        return [];
    }

    // Import the functions we need
    // Export a named object for combined functionality
    const rayyanJS = {
        // Basic device functions
        getFingerprint,
        detectBrowser,
        detectTorBrowser,
        detectIncognito,
        botDetection,
        trackBehaviour,
        // Organized by module (for backwards compatibility)
        device: {
            getFingerprint,
            detectBrowser,
            detectTorBrowser,
            detectIncognito,
            botDetection
        },
        behaviour: {
            trackBehaviour
        }
    };

    exports.botDetection = botDetection;
    exports.detectBrowser = detectBrowser;
    exports.detectIncognito = detectIncognito;
    exports.detectTorBrowser = detectTorBrowser;
    exports.getFingerprint = getFingerprint;
    exports.rayyanJS = rayyanJS;
    exports.trackBehaviour = trackBehaviour;

}));
//# sourceMappingURL=index.umd.js.map
