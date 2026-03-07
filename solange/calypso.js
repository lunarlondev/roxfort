(function () {
  const canvas = document.getElementById("calypsoCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const scoreEl = document.getElementById("calypsoScore");
  const bestEl = document.getElementById("calypsoBest");
  const startBtn = document.getElementById("calypsoStartBtn");
  const resetBtn = document.getElementById("calypsoResetBtn");
  const statusEl = document.querySelector("#calypso-game .calypso-status");

  const GRID = 20;
  const SPEED = 150;

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

  const headImg = new Image();
  headImg.src = "images/calypso/head.png";

  const bodyImg = new Image();
  bodyImg.src = "images/calypso/body.png";

  const tailImg = new Image();
  tailImg.src = "images/calypso/tail.png";

  const appleImg = new Image();
  appleImg.src = "images/calypso/apple.png";

  const corner1 = new Image();
  corner1.src = "images/calypso/corner1.png";

  const corner2 = new Image();
  corner2.src = "images/calypso/corner2.png";

  const corner3 = new Image();
  corner3.src = "images/calypso/corner3.png";

  const corner4 = new Image();
  corner4.src = "images/calypso/corner4.png";

  const corner5 = new Image();
  corner5.src = "images/calypso/corner1B.png";

  const corner6 = new Image();
  corner6.src = "images/calypso/corner2B.png";

  const corner7 = new Image();
  corner7.src = "images/calypso/corner3B.png";

  const corner8 = new Image();
  corner8.src = "images/calypso/corner4B.png";

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

  function getHappyText() {
    const texts = [
      "Nyamm.",
      "Yummies!",
      "Minden nap egy alma a medimágust távol tartja.",
      "Hissztérikus!",
      "Snake & snack.",
      "Alma a menü, nem egér.",
      "Hiss & Chips.",
      "Snake it easy.",
      "Callypso a legszebb π-ton.",
      "Melyik állat az abszolút férfi? A kígyó, mert gyakorlatilag az egész egy farok.",
      "A játék segít elterelni a figyelmet az esetleges logikai ütközésekről.",
      "Siiiiyah hassssaaashee!",
      "…soo hungry… for so long…",
      "Fruit ninja.",
      "Low-carb? Nem. Low-leg.",
      "Expecto Ssssnackum.",
      "What do you call a snake who works for the government? A civil serpent",
      "Can I slytherin to your chamber of secrets?",
      "Nagini wouldn't bite this.",
      "I'm the heir of Sssnacktherin!",
      "Sssszóval alma.",
      "Ez a játék KÍGYÓgyít minden bajból",
      "Some days you shed, some days you shine.",
      "I’m just a little hiss-understood",
      "Danger noodle, nope rope",
      "Sss-snickers",
      "Hiss me baby one more time!",
    ];

    return texts[Math.floor(Math.random() * texts.length)];
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

    if (statusEl) {
      statusEl.textContent = "Siiiiyah hassssaaashee!";
    }
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

    // Fal
    if (nx < 0 || nx >= GRID || ny < 0 || ny >= GRID) {
      running = false;
      if (statusEl) {
        statusEl.textContent = "A fal sajnos nem ehető. Nyomj space-t a folytatáshoz.";
      }
      return;
    }

    // Saját test
    if (snake.some(s => s.x === nx && s.y === ny)) {
      running = false;
      if (statusEl) {
        statusEl.textContent = "Calypso saját farkába harapó kígyó. Space a folytatáshoz.";
      }
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

      if (statusEl) {
        statusEl.textContent = getHappyText();
      }
    } else {
      snake.shift();
    }
  }

  function drawBackground(size) {
    ctx.fillStyle = "#0f0f14";
    ctx.fillRect(0, 0, size, size);
  }

  function drawImageCentered(img, gridX, gridY, angle = 0, scale = 1) {
    ctx.save();
    ctx.translate(gridX * cell + cell / 2, gridY * cell + cell / 2);
    ctx.rotate(angle);

    const size = cell * scale;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);

    ctx.restore();
  }

  function getAngleFromDir(d) {
    if (d.x === 1) return 0;
    if (d.x === -1) return Math.PI;
    if (d.y === 1) return Math.PI / 2;
    if (d.y === -1) return -Math.PI / 2;
    return 0;
  }

  function drawSnake() {
  if (!snake.length) return;

  for (let i = 1; i < snake.length - 1; i++) {

    const prev = snake[i - 1];
    const cur  = snake[i];
    const next = snake[i + 1];

    const dx1 = cur.x - prev.x;
    const dy1 = cur.y - prev.y;

    const dx2 = next.x - cur.x;
    const dy2 = next.y - cur.y;

    const straight = (dx1 === dx2 && dy1 === dy2);

    if (!straight) {

      const cross = dx1 * dy2 - dy1 * dx2;
      const isCW = cross < 0;

      let img = null;

      // BAL + LE
      if (
        (dx1 === -1 && dy2 === 1) ||
        (dx2 === -1 && dy1 === 1)
      ) {
        img = isCW ? corner5 : corner1;
      }

      // BAL + FEL
      else if (
        (dx1 === -1 && dy2 === -1) ||
        (dx2 === -1 && dy1 === -1)
      ) {
        img = isCW ? corner6 : corner2;
      }

      // JOBB + FEL
      else if (
        (dx1 === 1 && dy2 === -1) ||
        (dx2 === 1 && dy1 === -1)
      ) {
        img = isCW ? corner7 : corner3;
      }

      // JOBB + LE
      else if (
        (dx1 === 1 && dy2 === 1) ||
        (dx2 === 1 && dy1 === 1)
      ) {
        img = isCW ? corner8 : corner4;
      }

      if (img) {
        drawImageCentered(img, cur.x, cur.y, 0, 1);
      }
    }
    else {
      let angle = 0;

      if (dx2 !== 0) angle = 0;
      else angle = Math.PI / 2;

      angle += Math.PI / 2;

      drawImageCentered(bodyImg, cur.x, cur.y, angle, 1);
    }
  }

  // TAIL
  if (snake.length > 1) {
    const tail = snake[0];
    const next = snake[1];

    const tailDir = {
      x: tail.x - next.x,
      y: tail.y - next.y
    };

    let angle = getAngleFromDir(tailDir);
    angle -= Math.PI / 2;

    drawImageCentered(tailImg, tail.x, tail.y, angle, 1);
  }

  // HEAD
  const head = snake[snake.length - 1];
  const headAngle = getAngleFromDir(dir);

  drawImageCentered(headImg, head.x, head.y, headAngle, 1.2);
}





  function drawFood() {
    drawImageCentered(appleImg, food.x, food.y, 0, 1);
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
    const keys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d"," "];
    if (keys.includes(e.key)) e.preventDefault();

    if (e.key === "ArrowUp" || e.key === "w") setDir(0, -1);
    if (e.key === "ArrowDown" || e.key === "s") setDir(0, 1);
    if (e.key === "ArrowLeft" || e.key === "a") setDir(-1, 0);
    if (e.key === "ArrowRight" || e.key === "d") setDir(1, 0);

    if (e.key === " ") {
      if (!running) {
        running = true;
        last = performance.now();
        requestAnimationFrame(loop);
      }
    }
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