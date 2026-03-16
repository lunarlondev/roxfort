
/* ===== MAGIC BACKGROUND ===== */

const canvas = document.getElementById("magic-bg");
const ctx = canvas.getContext("2d");

let particles = [];
const count = 60;

function resize(){

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

}

window.addEventListener("resize", resize);
resize();

function createParticles(){

particles = [];

for(let i=0;i<count;i++){

particles.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,

size:Math.random()*2+0.5,

vx:(Math.random()-0.5)*0.15,
vy:(Math.random()-0.5)*0.15,

alpha:Math.random()

});

}

}

createParticles();


function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);


/* ===== PARTICLES ===== */

for(const p of particles){

p.x += p.vx;
p.y += p.vy;

if(p.x<0) p.x=canvas.width;
if(p.x>canvas.width) p.x=0;

if(p.y<0) p.y=canvas.height;
if(p.y>canvas.height) p.y=0;

ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);

ctx.fillStyle="rgba(120,160,255,"+(0.2+p.alpha*0.5)+")";
ctx.fill();

}

requestAnimationFrame(draw);

}


draw();