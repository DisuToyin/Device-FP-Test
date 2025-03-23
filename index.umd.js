(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.RayyanJS = {}));
})(this, (function (exports) { 'use strict';

    function e(e,r,n,t){return new(n||(n=Promise))((function(o,a){function i(e){try{c(t.next(e));}catch(e){a(e);}}function u(e){try{c(t.throw(e));}catch(e){a(e);}}function c(e){var r;e.done?o(e.value):(r=e.value,r instanceof n?r:new n((function(e){e(r);}))).then(i,u);}c((t=t.apply(e,[])).next());}))}function r(e,r){var n,t,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(u){return function(c){return function(u){if(n)throw new TypeError("Generator is already executing.");for(;a&&(a=0,u[0]&&(i=0)),i;)try{if(n=1,t&&(o=2&u[0]?t.return:u[0]?t.throw||((o=t.return)&&o.call(t),0):t.next)&&!(o=o.call(t,u[1])).done)return o;switch(t=0,o&&(u=[2&u[0],o.value]),u[0]){case 0:case 1:o=u;break;case 4:return i.label++,{value:u[1],done:!1};case 5:i.label++,t=u[1],u=[0];continue;case 7:u=i.ops.pop(),i.trys.pop();continue;default:if(!(o=i.trys,(o=o.length>0&&o[o.length-1])||6!==u[0]&&2!==u[0])){i=0;continue}if(3===u[0]&&(!o||u[1]>o[0]&&u[1]<o[3])){i.label=u[1];break}if(6===u[0]&&i.label<o[1]){i.label=o[1],o=u;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(u);break}o[2]&&i.ops.pop(),i.trys.pop();continue}u=r.call(e,i);}catch(e){u=[6,e],t=0;}finally{n=o=0;}if(5&u[0])throw u[1];return {value:u[0]?u[1]:void 0,done:true}}([u,c])}}}"function"==typeof SuppressedError&&SuppressedError;var n={exclude:[]};function t(e,r){if(!["exclude","permissions_to_check","retries","timeout"].includes(e))throw new Error("Unknown option "+e);if(["exclude","permissions_to_check"].includes(e)&&(!Array.isArray(r)||!r.every((function(e){return "string"==typeof e}))))throw new Error("The value of the exclude and permissions_to_check must be an array of strings");if(["retries","timeout"].includes(e)&&"number"!=typeof r)throw new Error("The value of retries must be a number");n[e]=r;}var o={},a={timeout:"true"},i=function(e,r){"undefined"!=typeof window&&(o[e]=r);},u=function(){return Object.fromEntries(Object.entries(o).filter((function(e){var r,t=e[0];return !(null===(r=null==n?void 0:n.exclude)||void 0===r?void 0:r.includes(t))})).map((function(e){return [e[0],(0, e[1])()]})))},c=3432918353,s=461845907,l=3864292196,d=2246822507,f=3266489909;function h(e,r){return e<<r|e>>>32-r}function m(e,r){ void 0===r&&(r=0);for(var n=r,t=0,o=3&e.length,a=e.length-o,i=0;i<a;)t=255&e.charCodeAt(i)|(255&e.charCodeAt(++i))<<8|(255&e.charCodeAt(++i))<<16|(255&e.charCodeAt(++i))<<24,++i,t=h(t=Math.imul(t,c),15),n=h(n^=t=Math.imul(t,s),13),n=Math.imul(n,5)+l;switch(t=0,o){case 3:t^=(255&e.charCodeAt(i+2))<<16;case 2:t^=(255&e.charCodeAt(i+1))<<8;case 1:t^=255&e.charCodeAt(i),t=h(t=Math.imul(t,c),15),n^=t=Math.imul(t,s);}return ((n=function(e){return e^=e>>>16,e=Math.imul(e,d),e^=e>>>13,e=Math.imul(e,f),e^e>>>16}(n^=e.length))>>>0).toString(36)}function v(e,r){return new Promise((function(n){setTimeout((function(){return n(r)}),e);}))}function g(e,r,n){return Promise.all(e.map((function(e){return Promise.race([e,v(r,n)])})))}function w(){return e(this,void 0,void 0,(function(){var e,t,o,i,c;return r(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),e=u(),t=Object.keys(e),[4,g(Object.values(e),(null==n?void 0:n.timeout)||1e3,a)];case 1:return o=r.sent(),i=o.filter((function(e){return void 0!==e})),c={},i.forEach((function(e,r){c[t[r]]=e;})),[2,S(c,n.exclude||[])];case 2:throw r.sent();case 3:return [2]}}))}))}function S(e,r){var n={},t=function(t){if(e.hasOwnProperty(t)){var o=e[t];if("object"!=typeof o||Array.isArray(o))r.includes(t)||(n[t]=o);else {var a=S(o,r.map((function(e){return e.startsWith(t+".")?e.slice(t.length+1):e})));Object.keys(a).length>0&&(n[t]=a);}}};for(var o in e)t(o);return n}function E(e){for(var r=0,n=0;n<e.length;++n)r+=Math.abs(e[n]);return r}function P(e,r,n){for(var t=[],o=0;o<e[0].data.length;o++){for(var a=[],i=0;i<e.length;i++)a.push(e[i].data[o]);t.push(M(a));}var u=new Uint8ClampedArray(t);return new ImageData(u,r,n)}function M(e){if(0===e.length)return 0;for(var r={},n=0,t=e;n<t.length;n++){r[a=t[n]]=(r[a]||0)+1;}var o=e[0];for(var a in r)r[a]>r[o]&&(o=parseInt(a,10));return o}function A(){if("undefined"==typeof navigator)return {name:"unknown",version:"unknown"};for(var e=navigator.userAgent,r={Edg:"Edge",OPR:"Opera"},n=0,t=[/(?<name>Edge|Edg)\/(?<version>\d+(?:\.\d+)?)/,/(?<name>(?:Chrome|Chromium|OPR|Opera|Vivaldi|Brave))\/(?<version>\d+(?:\.\d+)?)/,/(?<name>(?:Firefox|Waterfox|Iceweasel|IceCat))\/(?<version>\d+(?:\.\d+)?)/,/(?<name>Safari)\/(?<version>\d+(?:\.\d+)?)/,/(?<name>MSIE|Trident|IEMobile).+?(?<version>\d+(?:\.\d+)?)/,/(?<name>[A-Za-z]+)\/(?<version>\d+(?:\.\d+)?)/,/(?<name>SamsungBrowser)\/(?<version>\d+(?:\.\d+)?)/];n<t.length;n++){var o=t[n],a=e.match(o);if(a&&a.groups)return {name:r[a.groups.name]||a.groups.name,version:a.groups.version}}return {name:"unknown",version:"unknown"}}i("audio",(function(){return e(this,void 0,void 0,(function(){return r(this,(function(e){return [2,new Promise((function(e,r){try{var n=new(window.OfflineAudioContext||window.webkitOfflineAudioContext)(1,5e3,44100),t=n.createBufferSource(),o=n.createOscillator();o.frequency.value=1e3;var a,i=n.createDynamicsCompressor();i.threshold.value=-50,i.knee.value=40,i.ratio.value=12,i.attack.value=0,i.release.value=.2,o.connect(i),i.connect(n.destination),o.start(),n.oncomplete=function(r){a=r.renderedBuffer.getChannelData(0),e({sampleHash:E(a),oscillator:o.type,maxChannels:n.destination.maxChannelCount,channelCountMode:t.channelCountMode});},n.startRendering();}catch(e){console.error("Error creating audio fingerprint:",e),r(e);}}))]}))}))}));var C$1="SamsungBrowser"!==A().name?1:3,x=280,k=20;"Firefox"!=A().name&&i("canvas",(function(){return document.createElement("canvas").getContext("2d"),new Promise((function(e){var r=Array.from({length:C$1},(function(){return function(){var e=document.createElement("canvas"),r=e.getContext("2d");if(!r)return new ImageData(1,1);e.width=x,e.height=k;var n=r.createLinearGradient(0,0,e.width,e.height);n.addColorStop(0,"red"),n.addColorStop(1/6,"orange"),n.addColorStop(2/6,"yellow"),n.addColorStop(.5,"green"),n.addColorStop(4/6,"blue"),n.addColorStop(5/6,"indigo"),n.addColorStop(1,"violet"),r.fillStyle=n,r.fillRect(0,0,e.width,e.height);var t="Random Text WMwmil10Oo";r.font="23.123px Arial",r.fillStyle="black",r.fillText(t,-5,15),r.fillStyle="rgba(0, 0, 255, 0.5)",r.fillText(t,-3.3,17.7),r.beginPath(),r.moveTo(0,0),r.lineTo(2*e.width/7,e.height),r.strokeStyle="white",r.lineWidth=2,r.stroke();var o=r.getImageData(0,0,e.width,e.height);return o}()}));e({commonImageDataHash:m(P(r,x,k).data.toString()).toString()});}))}));var T,R=["Arial","Arial Black","Arial Narrow","Arial Rounded MT","Arimo","Archivo","Barlow","Bebas Neue","Bitter","Bookman","Calibri","Cabin","Candara","Century","Century Gothic","Comic Sans MS","Constantia","Courier","Courier New","Crimson Text","DM Mono","DM Sans","DM Serif Display","DM Serif Text","Dosis","Droid Sans","Exo","Fira Code","Fira Sans","Franklin Gothic Medium","Garamond","Geneva","Georgia","Gill Sans","Helvetica","Impact","Inconsolata","Indie Flower","Inter","Josefin Sans","Karla","Lato","Lexend","Lucida Bright","Lucida Console","Lucida Sans Unicode","Manrope","Merriweather","Merriweather Sans","Montserrat","Myriad","Noto Sans","Nunito","Nunito Sans","Open Sans","Optima","Orbitron","Oswald","Pacifico","Palatino","Perpetua","PT Sans","PT Serif","Poppins","Prompt","Public Sans","Quicksand","Rajdhani","Recursive","Roboto","Roboto Condensed","Rockwell","Rubik","Segoe Print","Segoe Script","Segoe UI","Sora","Source Sans Pro","Space Mono","Tahoma","Taviraj","Times","Times New Roman","Titillium Web","Trebuchet MS","Ubuntu","Varela Round","Verdana","Work Sans"],I=["monospace","sans-serif","serif"];function O(e,r){if(!e)throw new Error("Canvas context not supported");return e.font,e.font="72px ".concat(r),e.measureText("WwMmLli0Oo").width}function _(){var e,r=document.createElement("canvas"),n=null!==(e=r.getContext("webgl"))&&void 0!==e?e:r.getContext("experimental-webgl");if(n&&"getParameter"in n){var t=n.getExtension("WEBGL_debug_renderer_info");return {vendor:(n.getParameter(n.VENDOR)||"").toString(),vendorUnmasked:t?(n.getParameter(t.UNMASKED_VENDOR_WEBGL)||"").toString():"",renderer:(n.getParameter(n.RENDERER)||"").toString(),rendererUnmasked:t?(n.getParameter(t.UNMASKED_RENDERER_WEBGL)||"").toString():"",version:(n.getParameter(n.VERSION)||"").toString(),shadingLanguageVersion:(n.getParameter(n.SHADING_LANGUAGE_VERSION)||"").toString()}}return "undefined"}function D(){var e=new Float32Array(1),r=new Uint8Array(e.buffer);return e[0]=1/0,e[0]=e[0]-e[0],r[3]}function B(e,r){var n={};return r.forEach((function(r){var t=function(e){if(0===e.length)return null;var r={};e.forEach((function(e){var n=String(e);r[n]=(r[n]||0)+1;}));var n=e[0],t=1;return Object.keys(r).forEach((function(e){r[e]>t&&(n=e,t=r[e]);})),n}(e.map((function(e){return r in e?e[r]:void 0})).filter((function(e){return void 0!==e})));t&&(n[r]=t);})),n}function L(){var e=[],r={"prefers-contrast":["high","more","low","less","forced","no-preference"],"any-hover":["hover","none"],"any-pointer":["none","coarse","fine"],pointer:["none","coarse","fine"],hover:["hover","none"],update:["fast","slow"],"inverted-colors":["inverted","none"],"prefers-reduced-motion":["reduce","no-preference"],"prefers-reduced-transparency":["reduce","no-preference"],scripting:["none","initial-only","enabled"],"forced-colors":["active","none"]};return Object.keys(r).forEach((function(n){r[n].forEach((function(r){matchMedia("(".concat(n,": ").concat(r,")")).matches&&e.push("".concat(n,": ").concat(r));}));})),e}function F(){if("https:"===window.location.protocol&&"function"==typeof window.ApplePaySession)try{for(var e=window.ApplePaySession.supportsVersion,r=15;r>0;r--)if(e(r))return r}catch(e){return 0}return 0}"Firefox"!=A().name&&i("fonts",(function(){var n=this;return new Promise((function(t,o){try{!function(n){var t;e(this,void 0,void 0,(function(){var e,o,a;return r(this,(function(r){switch(r.label){case 0:return document.body?[3,2]:[4,(i=50,new Promise((function(e){return setTimeout(e,i,u)})))];case 1:return r.sent(),[3,0];case 2:if((e=document.createElement("iframe")).setAttribute("frameBorder","0"),(o=e.style).setProperty("position","fixed"),o.setProperty("display","block","important"),o.setProperty("visibility","visible"),o.setProperty("border","0"),o.setProperty("opacity","0"),e.src="about:blank",document.body.appendChild(e),!(a=e.contentDocument||(null===(t=e.contentWindow)||void 0===t?void 0:t.document)))throw new Error("Iframe document is not accessible");return n({iframe:a}),setTimeout((function(){document.body.removeChild(e);}),0),[2]}var i,u;}))}));}((function(o){var a=o.iframe;return e(n,void 0,void 0,(function(){var e,n,o,i;return r(this,(function(r){return "Hello, world!",e=a.createElement("canvas"),n=e.getContext("2d"),o=I.map((function(e){return O(n,e)})),i={},R.forEach((function(e){var r=O(n,e);o.includes(r)||(i[e]=r);})),t(i),[2]}))}))}));}catch(e){o({error:"unsupported"});}}))})),i("hardware",(function(){return new Promise((function(e,r){var n=void 0!==navigator.deviceMemory?navigator.deviceMemory:0,t=window.performance&&window.performance.memory?window.performance.memory:0;e({videocard:_(),architecture:D(),deviceMemory:n.toString()||"undefined",jsHeapSizeLimit:t.jsHeapSizeLimit||0});}))})),i("locales",(function(){return new Promise((function(e){e({languages:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone});}))})),i("permissions",(function(){return e(this,void 0,void 0,(function(){var t;return r(this,(function(o){return T=(null==n?void 0:n.permissions_to_check)||["accelerometer","accessibility","accessibility-events","ambient-light-sensor","background-fetch","background-sync","bluetooth","camera","clipboard-read","clipboard-write","device-info","display-capture","gyroscope","geolocation","local-fonts","magnetometer","microphone","midi","nfc","notifications","payment-handler","persistent-storage","push","speaker","storage-access","top-level-storage-access","window-management","query"],t=Array.from({length:(null==n?void 0:n.retries)||3},(function(){return function(){return e(this,void 0,void 0,(function(){var e,n,t,o,a;return r(this,(function(r){switch(r.label){case 0:e={},n=0,t=T,r.label=1;case 1:if(!(n<t.length))return [3,6];o=t[n],r.label=2;case 2:return r.trys.push([2,4,,5]),[4,navigator.permissions.query({name:o})];case 3:return a=r.sent(),e[o]=a.state.toString(),[3,5];case 4:return r.sent(),[3,5];case 5:return n++,[3,1];case 6:return [2,e]}}))}))}()})),[2,Promise.all(t).then((function(e){return B(e,T)}))]}))}))})),i("plugins",(function(){var e=[];if(navigator.plugins)for(var r=0;r<navigator.plugins.length;r++){var n=navigator.plugins[r];e.push([n.name,n.filename,n.description].join("|"));}return new Promise((function(r){r({plugins:e});}))})),i("screen",(function(){return new Promise((function(e){e({is_touchscreen:navigator.maxTouchPoints>0,maxTouchPoints:navigator.maxTouchPoints,colorDepth:screen.colorDepth,mediaMatches:L()});}))})),i("system",(function(){return new Promise((function(e){var r=A();e({platform:window.navigator.platform,cookieEnabled:window.navigator.cookieEnabled,productSub:navigator.productSub,product:navigator.product,useragent:navigator.userAgent,browser:{name:r.name,version:r.version},applePayVersion:F()});}))}));var N,U="SamsungBrowser"!==A().name?1:3,G=null;"undefined"!=typeof document&&((N=document.createElement("canvas")).width=200,N.height=100,G=N.getContext("webgl")),i("webgl",(function(){return e(this,void 0,void 0,(function(){var e;return r(this,(function(r){try{if(!G)throw new Error("WebGL not supported");return e=Array.from({length:U},(function(){return function(){try{if(!G)throw new Error("WebGL not supported");var e="\n          attribute vec2 position;\n          void main() {\n              gl_Position = vec4(position, 0.0, 1.0);\n          }\n      ",r="\n          precision mediump float;\n          void main() {\n              gl_FragColor = vec4(0.812, 0.195, 0.553, 0.921); // Set line color\n          }\n      ",n=G.createShader(G.VERTEX_SHADER),t=G.createShader(G.FRAGMENT_SHADER);if(!n||!t)throw new Error("Failed to create shaders");if(G.shaderSource(n,e),G.shaderSource(t,r),G.compileShader(n),!G.getShaderParameter(n,G.COMPILE_STATUS))throw new Error("Vertex shader compilation failed: "+G.getShaderInfoLog(n));if(G.compileShader(t),!G.getShaderParameter(t,G.COMPILE_STATUS))throw new Error("Fragment shader compilation failed: "+G.getShaderInfoLog(t));var o=G.createProgram();if(!o)throw new Error("Failed to create shader program");if(G.attachShader(o,n),G.attachShader(o,t),G.linkProgram(o),!G.getProgramParameter(o,G.LINK_STATUS))throw new Error("Shader program linking failed: "+G.getProgramInfoLog(o));G.useProgram(o);for(var a=137,i=new Float32Array(4*a),u=2*Math.PI/a,c=0;c<a;c++){var s=c*u;i[4*c]=0,i[4*c+1]=0,i[4*c+2]=Math.cos(s)*(N.width/2),i[4*c+3]=Math.sin(s)*(N.height/2);}var l=G.createBuffer();G.bindBuffer(G.ARRAY_BUFFER,l),G.bufferData(G.ARRAY_BUFFER,i,G.STATIC_DRAW);var d=G.getAttribLocation(o,"position");G.enableVertexAttribArray(d),G.vertexAttribPointer(d,2,G.FLOAT,!1,0,0),G.viewport(0,0,N.width,N.height),G.clearColor(0,0,0,1),G.clear(G.COLOR_BUFFER_BIT),G.drawArrays(G.LINES,0,2*a);var f=new Uint8ClampedArray(N.width*N.height*4);return G.readPixels(0,0,N.width,N.height,G.RGBA,G.UNSIGNED_BYTE,f),new ImageData(f,N.width,N.height)}catch(e){return new ImageData(1,1)}finally{G&&(G.bindBuffer(G.ARRAY_BUFFER,null),G.useProgram(null),G.viewport(0,0,G.drawingBufferWidth,G.drawingBufferHeight),G.clearColor(0,0,0,0));}}()})),[2,{commonImageHash:m(P(e,N.width,N.height).data.toString()).toString()}]}catch(e){return [2,{webgl:"unsupported"}]}return [2]}))}))}));var j=function(e,r,n,t){for(var o=(n-r)/t,a=0,i=0;i<t;i++){a+=e(r+(i+.5)*o);}return a*o};i("math",(function(){return e(void 0,void 0,void 0,(function(){return r(this,(function(e){return [2,{acos:Math.acos(.5),asin:j(Math.asin,-1,1,97),atan:j(Math.atan,-1,1,97),cos:j(Math.cos,0,Math.PI,97),cosh:Math.cosh(9/7),e:Math.E,largeCos:Math.cos(1e20),largeSin:Math.sin(1e20),largeTan:Math.tan(1e20),log:Math.log(1e3),pi:Math.PI,sin:j(Math.sin,-Math.PI,Math.PI,97),sinh:j(Math.sinh,-9/7,7/9,97),sqrt:Math.sqrt(2),tan:j(Math.tan,0,2*Math.PI,97),tanh:j(Math.tanh,-9/7,7/9,97)}]}))}))}));

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

    t('exclude', [
        'audio.sampleHash',
        'canvas',
        'hardware.deviceMemory',
        'plugins',
        'screen.mediaMatches',
        'screen.is_touchscreen',
        'screen.maxTouchPoints',
        'system.useragent',
        'system.browser.name',
        'system.browser.version',
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
            const fingerprintData = await w();
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
    async function botDetection() {
        try {
            const botd = await load();
            const result = await botd.detect();
            // console.log(result);
            return result;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    // botdPromise
    //     .then((botd : any) => botd.detect())
    //     .then((result : any) => console.log(result))
    //     .catch((error : any) => console.error(error))
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

    function trackBehaviour(config) {
        return [];
    }

    // Import the functions we need
    // Export a named object for combined functionality
    const rayyanJS = {
        device: {
            detectIncognito,
            detectTorBrowser,
            botDetection,
            getDeviceFingerprint
        },
        behaviour: {
            trackBehaviour
        }
    };

    exports.botDetection = botDetection;
    exports.detectIncognito = detectIncognito;
    exports.detectTorBrowser = detectTorBrowser;
    exports.getDeviceFingerprint = getDeviceFingerprint;
    exports.getVersion = getVersion;
    exports.hash = hash;
    exports.options = options;
    exports.rayyanJS = rayyanJS;
    exports.trackBehaviour = trackBehaviour;

}));
//# sourceMappingURL=index.umd.js.map
