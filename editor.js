var _a;
var canvas = document.getElementById("editor");
var ctx = (_a = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d")) !== null && _a !== void 0 ? _a : null;
var exportBtn = document.getElementById("exportBtn");
var importInput = document.getElementById("importInput");
var tileSelector = document.getElementById("tileSelector");
var gridSize = 32;
var tiles = [];
var images = {};
function loadImages(sources, callback) {
    var loadedCount = 0;
    for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
        var src = sources_1[_i];
        var img = new Image();
        img.src = src;
        img.onload = function () {
            loadedCount++;
            if (loadedCount === sources.length)
                callback();
        };
        images[src] = img;
    }
}
loadImages(["assets/Scuba.png", "assets/Shark_Mouth_Open_Relaxed_Eye.png"], function () {
    draw();
});
function draw() {
    if (!canvas || !ctx)
        return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw grid lines
    ctx.strokeStyle = "#ccc";
    for (var x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (var y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    // Draw tiles with images
    for (var _i = 0, tiles_1 = tiles; _i < tiles_1.length; _i++) {
        var tile = tiles_1[_i];
        var img = images["assets/".concat(tile.type, ".png")];
        if (img) {
            ctx.drawImage(img, tile.x * gridSize, tile.y * gridSize, gridSize, gridSize);
        }
        else {
            ctx.fillStyle = "blue";
            ctx.fillRect(tile.x * gridSize, tile.y * gridSize, gridSize, gridSize);
        }
    }
}
function getTilePos(event) {
    if (!canvas)
        return { x: 0, y: 0, type: "" };
    var rect = canvas.getBoundingClientRect();
    var x = Math.floor((event.clientX - rect.left) / gridSize);
    var y = Math.floor((event.clientY - rect.top) / gridSize);
    return { x: x, y: y, type: "" };
}
if (canvas) {
    canvas.addEventListener("click", function (e) {
        var pos = getTilePos(e);
        var selectedType = tileSelector.value;
        if (!tiles.some(function (t) { return t.x === pos.x && t.y === pos.y && t.type === selectedType; })) {
            tiles.push({ x: pos.x, y: pos.y, type: selectedType });
        }
        draw();
    });
    canvas.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        var pos = getTilePos(e);
        tiles = tiles.filter(function (t) { return !(t.x === pos.x && t.y === pos.y); });
        draw();
    });
}
exportBtn.addEventListener("click", function () {
    var json = JSON.stringify(tiles, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "level.json";
    a.click();
    URL.revokeObjectURL(url);
});
importInput.addEventListener("change", function () {
    var _a;
    var file = (_a = importInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return;
    var reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        try {
            var loaded = JSON.parse((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
            if (Array.isArray(loaded)) {
                tiles = loaded;
                draw();
            }
        }
        catch (_b) {
            alert("Invalid JSON file.");
        }
    };
    reader.readAsText(file);
});
draw();
