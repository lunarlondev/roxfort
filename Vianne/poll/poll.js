import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

/* Firebase */
const firebaseConfig = {
  apiKey: "AIzaSyA-cBLJUl4L-9-j4U4GUAsotI35YfO6Xq4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(
  app,
  "https://viannepoll-default-rtdb.europe-west1.firebasedatabase.app"
);

const votesRef = ref(db, "votes");

/* DOM */
const arloBtn = document.getElementById("arlo");
const peadarBtn = document.getElementById("peadar");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

/* STATE for animation */
let currentRed = 0;
let currentBlue = 0;

/* Vote with feedback */
function vote(color, btn) {
  btn.classList.add("voted");
  setTimeout(() => btn.classList.remove("voted"), 450);

  runTransaction(votesRef, current => {
    if (!current) {
      return {
        red: color === "red" ? 1 : 0,
        blue: color === "blue" ? 1 : 0
      };
    }
    current[color]++;
    return current;
  });
}

arloBtn.onclick = () => vote("red", arloBtn);
peadarBtn.onclick = () => vote("blue", peadarBtn);

/* Smooth chart animation */
function animateChart(targetRed, targetBlue) {
  const steps = 15;
  let step = 0;

  const startRed = currentRed;
  const startBlue = currentBlue;

  function tick() {
    step++;
    const t = step / steps;

    const red = startRed + (targetRed - startRed) * t;
    const blue = startBlue + (targetBlue - startBlue) * t;

    drawChart(red, blue);

    if (step < steps) requestAnimationFrame(tick);
    else {
      currentRed = targetRed;
      currentBlue = targetBlue;
    }
  }
  tick();
}

function drawChart(red, blue) {
  const total = red + blue;
  ctx.clearRect(0,0,200,200);

  if (total === 0) {
    ctx.beginPath();
    ctx.arc(100,100,90,0,Math.PI*2);
    ctx.fillStyle = "#555";
    ctx.fill();
    return;
  }

  let angle = -Math.PI/2;

  const redAngle = (red/total)*Math.PI*2;
  const blueAngle = (blue/total)*Math.PI*2;

  ctx.beginPath();
  ctx.moveTo(100,100);
  ctx.arc(100,100,90,angle,angle+redAngle);
  ctx.fillStyle = "#ff5fd8";
  ctx.fill();

  angle += redAngle;

  ctx.beginPath();
  ctx.moveTo(100,100);
  ctx.arc(100,100,90,angle,angle+blueAngle);
  ctx.fillStyle = "#ff3fa6";
  ctx.fill();
}

/* Realtime */
onValue(votesRef, snapshot => {
  const data = snapshot.val() || { red:0, blue:0 };
  animateChart(data.red, data.blue);
});
