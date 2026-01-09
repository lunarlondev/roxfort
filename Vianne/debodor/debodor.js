let clicks = 0;
const visualTarget = document.getElementById('visual-target');
const resetBtn = document.getElementById('reset-btn');

function applyPotion() {
    if (clicks >= 2) return;

    const bottle = document.getElementById('potion-bottle');
    
    // Üveg megbillen
    bottle.style.transition = "0.2s";
    bottle.style.transform = "rotate(-15deg) scale(1.1)";
    setTimeout(() => bottle.style.transform = "rotate(0) scale(1)", 200);

    // Csepp létrehozása
    const drop = document.createElement('div');
    drop.className = 'drop';
    const bRect = bottle.getBoundingClientRect();
    drop.style.left = (bRect.left + bRect.width / 2) + 'px';
    drop.style.top = (bRect.top + bRect.height - 20) + 'px';
    document.body.appendChild(drop);
    setTimeout(() => drop.remove(), 700);

    clicks++;

    if (clicks === 2) {
        setTimeout(magicalTransformation, 600);
    }
}

function magicalTransformation() {
    // Átváltás a képek között
    document.querySelector('.ad-frame').classList.add('state-transformed');
    
    // Csillagok spawnolása a kép körül
    const rect = visualTarget.getBoundingClientRect();
    
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const s = document.createElement('div');
            s.className = 'sparkle';
            s.innerHTML = Math.random() > 0.5 ? '✨' : '✦';
            
            const x = rect.left + (Math.random() * rect.width);
            const y = rect.top + (Math.random() * rect.height);
            
            s.style.left = x + 'px';
            s.style.top = y + 'px';
            s.style.fontSize = (Math.random() * 15 + 10) + 'px';
            
            document.body.appendChild(s);

            s.animate([
                { transform: 'translate(0,0) scale(0)', opacity: 0 },
                { transform: 'translate(0,0) scale(1.2)', opacity: 1, offset: 0.3 },
                { transform: `translate(${(Math.random()-0.5)*80}px, ${(Math.random()-0.5)*80}px) scale(0)`, opacity: 0 }
            ], { duration: 1500, easing: 'ease-out' }).onfinish = () => s.remove();
            
        }, i * 25);
    }

    setTimeout(() => resetBtn.classList.add('visible'), 2000);
}

function resetPotion() {
    clicks = 0;
    document.querySelector('.ad-frame').classList.remove('state-transformed');
    resetBtn.classList.remove('visible');
}