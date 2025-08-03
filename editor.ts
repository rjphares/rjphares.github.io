const canvas = document.getElementById("editor") as HTMLCanvasElement | null;
const ctx = canvas?.getContext("2d") ?? null;
const exportBtn = document.getElementById("exportBtn")!;
const importInput = document.getElementById("importInput") as HTMLInputElement;
const tileSelector = document.getElementById(
  "tileSelector"
) as HTMLSelectElement;

const gridSize = 32;

type Tile = { x: number; y: number; type: string };
let tiles: Tile[] = [];

const images: Record<string, HTMLImageElement> = {};

function loadImages(sources: string[], callback: () => void) {
  let loadedCount = 0;
  for (const src of sources) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === sources.length) callback();
    };
    images[src] = img;
  }
}

loadImages(
  ["assets/Scuba.png", "assets/Shark_Mouth_Open_Relaxed_Eye.png"],
  () => {
    draw();
  }
);

function draw() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines
  ctx.strokeStyle = "#ccc";
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw tiles with images
  for (const tile of tiles) {
    const img = images[`assets/${tile.type}.png`];
    if (img) {
      ctx.drawImage(
        img,
        tile.x * gridSize,
        tile.y * gridSize,
        gridSize,
        gridSize
      );
    } else {
      ctx.fillStyle = "blue";
      ctx.fillRect(tile.x * gridSize, tile.y * gridSize, gridSize, gridSize);
    }
  }
}

function getTilePos(event: MouseEvent): Tile {
  if (!canvas) return { x: 0, y: 0, type: "" };
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / gridSize);
  const y = Math.floor((event.clientY - rect.top) / gridSize);
  return { x, y, type: "" };
}

if (canvas) {
  canvas.addEventListener("click", (e) => {
    const pos = getTilePos(e);
    const selectedType = tileSelector.value;
    if (
      !tiles.some(
        (t) => t.x === pos.x && t.y === pos.y && t.type === selectedType
      )
    ) {
      tiles.push({ x: pos.x, y: pos.y, type: selectedType });
    }
    draw();
  });

  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const pos = getTilePos(e);
    tiles = tiles.filter((t) => !(t.x === pos.x && t.y === pos.y));
    draw();
  });
}

exportBtn.addEventListener("click", () => {
  const json = JSON.stringify(tiles, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "level.json";
  a.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", () => {
  const file = importInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const loaded = JSON.parse(e.target?.result as string);
      if (Array.isArray(loaded)) {
        tiles = loaded;
        draw();
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
});

draw();
