/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ 3:
/***/ (function(module, exports) {

(() => {
    if (!window.HTMLCanvasElement && !document.createElement("canvas").getContext) {
        return;
    }
    var canvas;
    var ctx;
    const store = {
        playing: false,
        squareSize: 20,
        particles: []
    };
    window.addEventListener("resize", resizeThrottler, false);
    var resizeTimer = setTimeout(postResizeHandler, 1500);
    function resizeThrottler() {
        store.playing = false;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(postResizeHandler, 1500);
    }
    function postResizeHandler() {
        start();
    }
    function start() {
        const frontCover = document.getElementById("display1");
        let oldCanvas = document.getElementById("canvas-display1");
        if (oldCanvas) {
            frontCover.removeChild(oldCanvas);
        }
        canvas = document.createElement("canvas");
        canvas.width = frontCover.scrollWidth || frontCover.clientWidth;
        canvas.height = 200;
        canvas.id = "canvas-display1";
        ctx = canvas.getContext('2d');
        frontCover.appendChild(canvas);
        store.playing = true;
        store.particles = [];
        update();
    }
    function update() {
        let width = canvas.width;
        let height = canvas.height;
        ctx.fillStyle = "#101423";
        ctx.fillRect(0, 0, width, height);
        if (!store.playing) {
            return;
        }
        requestAnimationFrame(update);
        if (store.particles.length < 20 && Math.random() < 0.4) {
            store.particles.push({ x: Math.random() * width, y: -10, color: "rgba(255,255,255,1)", decayRate: Math.random() * 0.01 + 0.001, opacity: 0.4, speed: Math.random() * 1.1 + 0.1 });
        }
        store.particles.forEach(p => {
            p.y += p.speed;
            p.opacity -= p.decayRate;
            p.color = `rgba(255,255,255,${p.opacity})`;
        });
        store.particles = store.particles.filter(p => {
            return p.y < height + store.squareSize && p.opacity > 0;
        });
        store.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, store.squareSize, store.squareSize);
        });
    }
})();


/***/ })

/******/ });