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

  // ===== SPRITES =====

  const headImg = new Image();
  headImg.src = "images/calypso/head.png";

  const bodyImg = new Image();
  bodyImg.src = "images/calypso/body.png";

  const tailImg = new Image();
  tailImg.src = "images/calypso/tail.png";

  const appleImg = new Image();
  appleImg.src = "images/calypso/apple.png";

  // ===== GAME STATE =====

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

  // ===== DRAW HELPERS =====

  function drawBackground(size) {
    ctx.fillStyle = "#0f0f14";
    ctx.fillRect(0, 0, size, size);
  }

  function drawImageCentered(img, gridX, gridY, angle = 0) {
    ctx.save();
    ctx.translate(gridX * cell + cell / 2, gridY * cell + cell / 2);
    ctx.rotate(angle);
    ctx.drawImage(img, -cell / 2, -cell / 2, cell, cell);
    ctx.restore();
  }

  function getAngleFromDir(d) {
    if (d.x === 1) return 0;
    if (d.x === -1) return Math.PI;
    if (d.y === 1) return Math.PI / 2;
    if (d.y === -1) return -Math.PI / 2;
    return 0;
  }

  // ===== DRAW SNAKE =====

  function drawSnake() {
    if (!snake.length) return;

    // ---- BODY ----
    for (let i = 1; i < snake.length - 1; i++) {
      const prev = snake[i - 1];
      const cur = snake[i];
      const next = snake[i + 1];

      const dx = next.x - prev.x;
      const dy = next.y - prev.y;

      let angle = 0;

      if (dx !== 0 && dy === 0) {
        angle = 0; // vízszintes
      } else if (dy !== 0 && dx === 0) {
        angle = Math.PI / 2; // függőleges
      }

      drawImageCentered(bodyImg, cur.x, cur.y, angle);
    }

    // ---- TAIL ----
    if (snake.length > 1) {
      const tail = snake[0];
      const next = snake[1];

      const tailDir = {
        x: tail.x - next.x,
        y: tail.y - next.y
      };

      let angle = getAngleFromDir(tailDir);

      // 90° counter-clockwise korrekció
      angle -= Math.PI / 2;

      drawImageCentered(tailImg, tail.x, tail.y, angle);
    }

    // ---- HEAD ----
    const head = snake[snake.length - 1];
    const headAngle = getAngleFromDir(dir);

    drawImageCentered(headImg, head.x, head.y, headAngle);
  }

  function drawFood() {
    drawImageCentered(appleImg, food.x, food.y, 0);
  }

  function draw() {
    const size = canvas.width / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, size, size);
    drawBackground(size);
    drawFood();
    drawSnake();
  }

  // ===== LOOP =====

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
    if (keys.includes(e.key)) e.preventDefault();

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