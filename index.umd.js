(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@thumbmarkjs/thumbmarkjs'), require('@fingerprintjs/botd')) :
    typeof define === 'function' && define.amd ? define(['exports', '@thumbmarkjs/thumbmarkjs', '@fingerprintjs/botd'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RayyanJS = {}, global.ThumbmarkJS, global.Botd));
})(this, (function (exports, thumbmarkjs, botd) { 'use strict';

    thumbmarkjs.setOption('exclude', [
        'audio.sampleHash',
        'canvas',
        'hardware.deviceMemory',
        'plugins',
        'screen.mediaMatches',
        'screen.is_touchscreen',
        'screen.maxTouchPoints',
        'system.useragent',
        'browser_.details.deviceMemory',
        'webgl'
    ]);
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
    async function getDeviceFingerprint() {
        try {
            const fingerprintData = await thumbmarkjs.getFingerprintData();
            const thisHash = hash(JSON.stringify(fingerprintData));
            if (Math.random() < 0.001 && options.logging)
                logFingerprintData(thisHash, fingerprintData);
            return { hash: thisHash.toString(), data: fingerprintData };
            // if (includeData) {
            // } else {
            //     console.log(thisHash.toString())
            //     return thisHash.toString()
            // }
        }
        catch (error) {
            throw error;
        }
    }
    function getVersion() {
        return "X";
    }
    async function logFingerprintData(thisHash, fingerprintData) {
        const url = 'https://logging.thumbmarkjs.com/v1/log';
        const payload = {
            thumbmark: thisHash,
            components: fingerprintData,
            version: getVersion()
        };
        if (!sessionStorage.getItem("_tmjs_l")) {
            sessionStorage.setItem("_tmjs_l", "1");
            try {
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            }
            catch (_a) { } // do nothing
        }
    }
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
    detectIncognito().then(result => {
        console.log(result);
    }).catch(error => {
        console.error(error);
    });
    const botdPromise = botd.load();
    botdPromise
        .then((botd) => botd.detect())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    // UTILS 
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
                break;
            // fallthrough
            case 12:
                k[2] = (k[2] ^ (tail[11] << 24));
                break; // fallthrough
            case 11:
                k[2] = (k[2] ^ (tail[10] << 16));
                break;
            // fallthrough
            case 10:
                k[2] = (k[2] ^ (tail[9] << 8));
                break;
            // fallthrough
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
                break;
            // fallthrough
            case 7:
                k[1] = (k[1] ^ (tail[6] << 16));
                break;
            // fallthrough
            case 6:
                k[1] = (k[1] ^ (tail[5] << 8));
                break;
            // fallthrough
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
                break;
            // fallthrough
            case 3:
                k[0] = (k[0] ^ (tail[2] << 16));
                break;
            // fallthrough
            case 2:
                k[0] = (k[0] ^ (tail[1] << 8));
                break;
            // fallthrough
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
    let options = {
        exclude: [],
        include: [],
        logging: true,
    };

    exports.botdPromise = botdPromise;
    exports.detectIncognito = detectIncognito;
    exports.detectTorBrowser = detectTorBrowser;
    exports.getDeviceFingerprint = getDeviceFingerprint;
    exports.getVersion = getVersion;
    exports.hash = hash;
    exports.options = options;

}));
//# sourceMappingURL=index.umd.js.map
