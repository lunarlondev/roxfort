(function () {
  const canvas = document.getElementById("calypsoCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const scoreEl = document.getElementById("calypsoScore");
  const bestEl = document.getElementById("calypsoBest");
  const startBtn = document.getElementById("calypsoStartBtn");
  const resetBtn = document.getElementById("calypsoResetBtn");

  const GRID = 20;
  const SPEED = 130;

  let cell;

  function resize() {
    const size = Math.min(360, Math.max(280, canvas.clientWidth || 300));
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cell = size / GRID;
  }

  resize();
  window.addEventListener("resize", resize);

  let snake;
  let dir;
  let nextDir;
  let food;
  let running = false;
  let score = 0;
  let best = Number(localStorage.getItem("calypso_best") || 0);

  bestEl.textContent = best;

  function randCell() {
    return {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID)
    };
  }

  function reset() {
    const mid = Math.floor(GRID / 2);

    snake = [
      { x: mid - 1, y: mid },
      { x: mid, y: mid }
    ];

    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };

    score = 0;
    scoreEl.textContent = "0";

    spawnFood();
    draw();
  }

  function spawnFood() {
    let p;
    do {
      p = randCell();
    } while (snake.some(s => s.x === p.x && s.y === p.y));
    food = p;
  }

  function update() {
    dir = nextDir;

    const head = snake[snake.length - 1];
    const nx = head.x + dir.x;
    const ny = head.y + dir.y;

    // Fal ütközés
    if (nx < 0 || nx >= GRID || ny < 0 || ny >= GRID) {
      running = false;
      return;
    }

    // Önmaga ütközés
    if (snake.some(s => s.x === nx && s.y === ny)) {
      running = false;
      return;
    }

    snake.push({ x: nx, y: ny });

    if (nx === food.x && ny === food.y) {
      score++;
      scoreEl.textContent = score;

      if (score > best) {
        best = score;
        bestEl.textContent = best;
        localStorage.setItem("calypso_best", best);
      }

      spawnFood();
    } else {
      snake.shift();
    }
  }

  function drawBackground(size) {
    ctx.fillStyle = "#0f0f14";
    ctx.fillRect(0, 0, size, size);
  }

  function drawFood() {
    const cx = food.x * cell + cell / 2;
    const cy = food.y * cell + cell / 2;

    ctx.shadowColor = "rgba(180,30,40,0.6)";
    ctx.shadowBlur = 10;

    ctx.fillStyle = "#a81d2d";
    ctx.beginPath();
    ctx.arc(cx, cy, cell * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  function drawSnake() {
    if (snake.length < 2) return;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.shadowColor = "rgba(255,255,255,0.25)";
    ctx.shadowBlur = 6;

    ctx.strokeStyle = "#f2f2f8";
    ctx.lineWidth = cell * 0.6;

    ctx.beginPath();

    const first = snake[0];
    ctx.moveTo(first.x * cell + cell / 2, first.y * cell + cell / 2);

    for (let i = 1; i < snake.length; i++) {
      const s = snake[i];
      ctx.lineTo(s.x * cell + cell / 2, s.y * cell + cell / 2);
    }

    ctx.stroke();
    ctx.shadowBlur = 0;

    drawHead();
  }

  function drawHead() {
    const head = snake[snake.length - 1];
    const cx = head.x * cell + cell / 2;
    const cy = head.y * cell + cell / 2;

    ctx.fillStyle = "#f2f2f8";
    ctx.beginPath();
    ctx.arc(cx, cy, cell * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#7fb6ff";

    const eyeOffsetX = dir.x * cell * 0.15;
    const eyeOffsetY = dir.y * cell * 0.15;

    ctx.beginPath();
    ctx.arc(cx - 5 + eyeOffsetX, cy - 5 + eyeOffsetY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx + 5 + eyeOffsetX, cy - 5 + eyeOffsetY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw() {
    const size = canvas.width / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, size, size);
    drawBackground(size);
    drawFood();
    drawSnake();
  }

  let last = 0;
  let acc = 0;

  function loop(t) {
    if (!running) return;

    const dt = t - last;
    last = t;
    acc += dt;

    while (acc > SPEED) {
      update();
      acc -= SPEED;
    }

    draw();
    requestAnimationFrame(loop);
  }

  function setDir(dx, dy) {
    if (dx === -dir.x && dy === -dir.y) return;
    nextDir = { x: dx, y: dy };
  }

  document.addEventListener("keydown", e => {
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"];

  if (keys.includes(e.key)) {
    e.preventDefault();
  }

  if (e.key === "ArrowUp" || e.key === "w") setDir(0, -1);
  if (e.key === "ArrowDown" || e.key === "s") setDir(0, 1);
  if (e.key === "ArrowLeft" || e.key === "a") setDir(-1, 0);
  if (e.key === "ArrowRight" || e.key === "d") setDir(1, 0);
});

  startBtn.addEventListener("click", () => {
    if (!running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(loop);
    }
  });

  resetBtn.addEventListener("click", () => {
    running = false;
    reset();
  });

  reset();
})();