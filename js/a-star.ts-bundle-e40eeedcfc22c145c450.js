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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {

(() => {
    if (!window.HTMLCanvasElement && !document.createElement("canvas").getContext) {
        alert("This demo requires canvas, which your browser doesn't support. Sorry :(");
        return;
    }
    const frontierColor = "yellow", closedColor = "red", finishedPath = "#00FFFF", startColor = "green", endColor = "#FF4FD3", wallColor = "#322C56", canvasBackground = "black", fakeStartColor = "lightgreen", fakeEndColor = "#FF93E4";
    const backgroundColor = (x, y) => (x + y) % 2 == 1 ? "#E9E7EA" : "#D3DDEB";
    var m;
    (function (m) {
        m[m["Nothing"] = 0] = "Nothing";
        m[m["BuildingWall"] = 1] = "BuildingWall";
        m[m["ClearingWall"] = 2] = "ClearingWall";
        m[m["MovingStart"] = 3] = "MovingStart";
        m[m["MovingEnd"] = 4] = "MovingEnd";
    })(m || (m = {}));
    var canvas;
    var ctx;
    const store = {
        playing: false,
        squareSize: 10,
        wide: 0,
        height: 0,
        wallData: new Map(),
        endSquare: [290, 0],
        startSquare: [200, 5],
        path: null,
        replay: null,
        holdingDown: false,
        mouseMode: m.Nothing,
    };
    const runButton = document.getElementById("run-demo");
    runButton.onclick = e => {
        if (!store.playing) {
            reloadPath();
        }
    };
    class BinaryHeap {
        constructor(scoreFunction, compare) {
            this.content = [];
            this.scoreFunction = scoreFunction;
            this.compare = compare;
        }
        pop() {
            let result = this.content[0];
            let end = this.content.pop();
            if (this.content.length > 0) {
                this.content[0] = end;
                this.sinkDown(0);
            }
            return result;
        }
        bubbleUp(n) {
            let el = this.content[n], score = this.scoreFunction(el);
            while (n > 0) {
                let parentN = Math.floor((n + 1) / 2) - 1, parent = this.content[parentN];
                if (score > this.scoreFunction(parent)) {
                    break;
                }
                this.content[parentN] = el;
                this.content[n] = parent;
                n = parentN;
            }
        }
        push(element) {
            this.content.push(element);
            this.bubbleUp(this.content.length - 1);
        }
        has(node) {
            let length = this.content.length;
            for (var i = 0; i < length; i++) {
                if (!this.compare(this.content[i], node))
                    continue;
                return this.content[i];
            }
            return false;
        }
        remove(node) {
            let length = this.content.length;
            for (var i = 0; i < length; i++) {
                if (!this.compare(this.content[i], node))
                    continue;
                var end = this.content.pop();
                if (i == length - 1)
                    break;
                this.content[i] = end;
                this.bubbleUp(i);
                this.sinkDown(i);
                break;
            }
        }
        size() {
            return this.content.length;
        }
        sinkDown(n) {
            let length = this.content.length, el = this.content[n], elScore = this.scoreFunction(el);
            while (true) {
                let child2N = (n + 1) * 2, child1N = child2N - 1;
                let swap = null;
                let child1Score;
                if (child1N < length) {
                    let child1 = this.content[child1N];
                    child1Score = this.scoreFunction(child1);
                    if (child1Score < elScore) {
                        swap = child1N;
                    }
                }
                if (child2N < length) {
                    let child2 = this.content[child2N], child2Score = this.scoreFunction(child2);
                    if (child2Score < (swap == null ? elScore : child1Score)) {
                        swap = child2N;
                    }
                }
                if (swap == null)
                    break;
                this.content[n] = this.content[swap];
                this.content[swap] = el;
                n = swap;
            }
        }
    }
    window.addEventListener("resize", resizeThrottler, false);
    var resizeTimer = setTimeout(postResizeHandler, 1000);
    function resizeThrottler() {
        store.playing = false;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(postResizeHandler, 1000);
    }
    function postResizeHandler() {
        start();
    }
    function start() {
        const frontCover = document.getElementById("demo");
        let oldCanvas = document.getElementById("canvas-demo");
        if (oldCanvas) {
            frontCover.removeChild(oldCanvas);
        }
        canvas = document.createElement("canvas");
        var tempWidth = frontCover.scrollWidth || frontCover.clientWidth;
        canvas.width = (parseInt(String(tempWidth / 10)) * 10) - 1;
        canvas.height = 200 - 1;
        canvas.id = "canvas-demo";
        ctx = canvas.getContext('2d');
        frontCover.appendChild(canvas);
        canvas.onmousedown = (e) => {
            store.playing = false;
            let x = e.pageX - canvas.offsetLeft, y = e.pageY - canvas.offsetTop;
            x = parseInt(String(x / 10));
            y = parseInt(String(y / 10));
            if (store.startSquare[0] == x && store.startSquare[1] == y) {
                store.mouseMode = m.MovingStart;
            }
            else if (store.endSquare[0] == x && store.endSquare[1] == y) {
                store.mouseMode = m.MovingEnd;
            }
            else if (store.wallData.get(pointsToString(x, y))) {
                store.mouseMode = m.ClearingWall;
                if (store.wallData.delete(pointsToString(x, y))) {
                    ctx.fillStyle = backgroundColor(x, y);
                    ctx.fillRect(x * 10, y * 10, store.squareSize, store.squareSize);
                }
            }
            else {
                store.mouseMode = m.BuildingWall;
                mouseBuildWall(x, y);
            }
        };
        function mouseBuildWall(x, y) {
            if ((store.startSquare[0] == x && store.startSquare[1] == y)
                || (store.endSquare[0] == x && store.endSquare[1] == y)
                || store.wallData.get(pointsToString(x, y))) {
                return;
            }
            store.wallData.set(pointsToString(x, y), true);
            drawWall(x, y);
        }
        const moveMouse = (e) => {
            if (store.mouseMode == m.Nothing) {
                return;
            }
            let x = e.pageX - canvas.offsetLeft, y = e.pageY - canvas.offsetTop;
            x = parseInt(String(x / 10));
            y = parseInt(String(y / 10));
            drawBase();
            switch (store.mouseMode) {
                case m.BuildingWall:
                    mouseBuildWall(x, y);
                    break;
                case m.ClearingWall:
                    if (store.wallData.delete(pointsToString(x, y))) {
                        ctx.fillStyle = backgroundColor(x, y);
                        ctx.fillRect(x * 10, y * 10, store.squareSize, store.squareSize);
                    }
                    break;
                case m.MovingEnd:
                    drawFakeEnd(x, y);
                    break;
                case m.MovingStart:
                    drawFakeStart(x, y);
                    break;
            }
        };
        let wait = false;
        canvas.onmousemove = (e) => {
            if (!wait) {
                moveMouse(e);
                wait = true;
                setTimeout(function () { wait = false; }, 35);
            }
        };
        const mouseUp = (e) => {
            if (store.playing) {
                return;
            }
            let x = e.pageX - canvas.offsetLeft, y = e.pageY - canvas.offsetTop;
            x = parseInt(String(x / 10));
            y = parseInt(String(y / 10));
            switch (store.mouseMode) {
                case m.MovingEnd:
                    if (!(store.startSquare[0] === x && store.startSquare[1] === y)) {
                        store.endSquare = [x, y];
                    }
                    break;
                case m.MovingStart:
                    if (!(store.endSquare[0] === x && store.endSquare[1] === y)) {
                        store.startSquare = [x, y];
                    }
                    break;
                case m.BuildingWall:
                case m.ClearingWall:
                    break;
                default:
                    store.mouseMode = m.Nothing;
                    return;
            }
            validateStartAndEnd();
            drawBase();
            store.mouseMode = m.Nothing;
        };
        canvas.onmouseup = mouseUp;
        canvas.onmouseleave = mouseUp;
        store.wide = parseInt(String((canvas.width + 1) / 10));
        store.height = parseInt(String((canvas.height + 1) / 10));
        function validateStartAndEnd() {
            if (store.startSquare[0] >= store.wide || store.startSquare[1] >= store.height) {
                store.startSquare = [0, 0];
                store.wallData.delete(pointsToString(0, 0));
            }
            store.wallData.delete(pointsToString(store.startSquare[0], store.startSquare[1]));
            if (store.endSquare[0] >= store.wide || store.endSquare[1] >= store.height) {
                store.endSquare = [store.wide - 1, store.height - 1];
                store.wallData.delete(pointsToString(store.wide - 1, store.height - 1));
            }
            store.wallData.delete(pointsToString(store.endSquare[0], store.endSquare[1]));
        }
        validateStartAndEnd();
        drawBase();
    }
    function updateStartSquare(x, y) {
        if (store.startSquare[0] != x || store.startSquare[1] != y) {
        }
    }
    function pointsToString(x, y) {
        return `${x}-${y}`;
    }
    function reloadPath() {
        const flattenRecursive = (finalNode) => {
            if (finalNode.parent === null) {
                return [];
            }
            return [...flattenRecursive(finalNode.parent), finalNode];
        };
        let results = aStar(store.wallData, store.startSquare, store.endSquare);
        if (results.success) {
            store.path = flattenRecursive(results.path);
            store.replay = results.actionsToReplay.reverse();
        }
        if (!results.success && results.actionsToReplay.length > 0) {
            store.path = [];
            store.replay = results.actionsToReplay.reverse();
        }
        store.playing = true;
        drawBase();
        update();
    }
    function drawCheckBoard() {
        ctx.beginPath();
        for (let i = 0; i < store.wide; i++) {
            for (let j = i % 2; j < store.height; j += 2) {
                ctx.rect(i * 10, j * 10, store.squareSize, store.squareSize);
            }
        }
        ctx.closePath();
        ctx.fillStyle = backgroundColor(0, 0);
        ctx.fill();
        ctx.beginPath();
        for (let i = 0; i < store.wide; i++) {
            for (let j = (i + 1) % 2; j < store.height; j += 2) {
                ctx.rect(i * 10, j * 10, store.squareSize, store.squareSize);
            }
        }
        ctx.closePath();
        ctx.fillStyle = backgroundColor(1, 0);
        ctx.fill();
    }
    function drawBase() {
        ctx.fillStyle = canvasBackground;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawCheckBoard();
        drawStart();
        drawEnd();
        drawWalls();
    }
    function drawWall(x, y) {
        ctx.fillStyle = wallColor;
        ctx.fillRect(x * 10, y * 10, store.squareSize, store.squareSize);
    }
    function drawWalls() {
        ctx.fillStyle = wallColor;
        ctx.beginPath();
        store.wallData.forEach((value, key) => {
            let xy = key.split("-"), x = parseInt(xy[0]) * 10, y = parseInt(xy[1]) * 10;
            ctx.rect(x, y, store.squareSize, store.squareSize);
        });
        ctx.closePath();
        ctx.fill();
    }
    function drawStart() {
        ctx.fillStyle = startColor;
        ctx.fillRect(store.startSquare[0] * 10, store.startSquare[1] * 10, 10, 10);
    }
    function drawFakeStart(x, y) {
        ctx.fillStyle = fakeStartColor;
        ctx.fillRect(x * 10, y * 10, 10, 10);
    }
    function drawFakeEnd(x, y) {
        ctx.fillStyle = fakeEndColor;
        ctx.fillRect(x * 10, y * 10, 10, 10);
    }
    function drawEnd() {
        ctx.fillStyle = endColor;
        ctx.fillRect(store.endSquare[0] * 10, store.endSquare[1] * 10, 10, 10);
    }
    function update() {
        let width = canvas.width;
        let height = canvas.height;
        if (!store.playing) {
            return;
        }
        if (store.replay && store.replay.length > 0 || store.path && store.path.length > 0) {
            requestAnimationFrame(update);
        }
        else {
            store.playing = false;
        }
        if (store.replay && store.replay.length > 0) {
            let move = store.replay.pop();
            const randomNum = (maxNum) => Math.floor(Math.random() * maxNum) + 1;
            ctx.fillStyle = move.isClosed ? `rgb(0, 0, ${randomNum(100) + 150})` : `rgb(${randomNum(50) + 200}, ${randomNum(50) + 50}, ${randomNum(100) + 100})`;
            ctx.fillRect(move.x * 10, move.y * 10, 10, 10);
        }
        else if (store.path && store.path.length > 0) {
            ctx.fillStyle = finishedPath;
            let move = store.path.pop();
            ctx.fillRect(move.x * 10, move.y * 10, 10, 10);
        }
        drawStart();
        drawEnd();
    }
    function getSuccessors(map, root, closedList) {
        let successors = [];
        if (root.x != 0) {
            successors.push(Object.assign({}, root, { x: root.x - 1 }));
        }
        if (root.x != store.wide - 1) {
            successors.push(Object.assign({}, root, { x: root.x + 1 }));
        }
        if (root.y != 0) {
            successors.push(Object.assign({}, root, { y: root.y - 1 }));
        }
        if (root.y != store.height - 1) {
            successors.push(Object.assign({}, root, { y: root.y + 1 }));
        }
        const filtered = successors.filter(({ x, y }) => !(map.get(pointsToString(x, y)) || closedList.has(pointsToString(x, y))));
        return filtered;
    }
    function aStar(map, start, end) {
        let loops = 0;
        const xyStringify = (n) => `${n.x}-${n.y}`;
        const copyGridSquare = (n, isClosed) => ({
            parent: null,
            g: n.g,
            h: n.h,
            f: n.f,
            wall: n.wall,
            x: n.x,
            y: n.y,
            isClosed
        });
        let actionsToReplay = [];
        const compare = (a, b) => a.x == b.x && a.y == b.y;
        const score = (n) => n.f;
        let frontierPriorityQueue = new BinaryHeap(score, compare), closedList = new Map();
        let firstSquare = {
            g: 0,
            h: (Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1])),
            f: (Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1])),
            parent: null,
            wall: false,
            x: start[0],
            y: start[1]
        };
        frontierPriorityQueue.push(firstSquare);
        actionsToReplay.push(copyGridSquare(firstSquare, false));
        while (frontierPriorityQueue.size() > 0) {
            loops++;
            let q = frontierPriorityQueue.pop();
            if (closedList.has(xyStringify(q))) {
                console.error("POPPED OFF SOMETHING IN CLOSED LIST.");
            }
            closedList.set(xyStringify(q), q);
            actionsToReplay.push(copyGridSquare(q, true));
            let successors = getSuccessors(map, q, closedList);
            let selectedNode;
            for (let i = 0; i < successors.length; i++) {
                selectedNode = successors[i];
                let localg = q.g + 1;
                let localh = Math.abs(selectedNode.x - end[0]) + Math.abs(selectedNode.y - end[1]);
                let succSquare = {
                    g: localg,
                    h: localh,
                    f: localg + localh,
                    parent: q,
                    wall: false,
                    x: selectedNode.x,
                    y: selectedNode.y
                };
                if (loops > 9000 || succSquare.x == end[0] && succSquare.y == end[1]) {
                    return { path: succSquare, actionsToReplay, success: true };
                }
                if (closedList.has(xyStringify(succSquare))) {
                    continue;
                }
                if (frontierPriorityQueue.has(succSquare) && frontierPriorityQueue.has(succSquare).f > succSquare.f) {
                    frontierPriorityQueue.remove(selectedNode);
                }
                if (!(closedList.has(xyStringify(succSquare))) && !(frontierPriorityQueue.has(selectedNode))) {
                    frontierPriorityQueue.push(succSquare);
                    actionsToReplay.push(copyGridSquare(succSquare, false));
                }
            }
        }
        return { success: false, path: null, actionsToReplay };
    }
    function createArray(width, height) {
        var arr = new Array(length || 0), i = length;
        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--)
                arr[length - 1 - i] = createArray.apply(this, args);
        }
        return arr;
    }
})();


/***/ })

/******/ });