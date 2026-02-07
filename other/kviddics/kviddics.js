// --- 1. FIREBASE KONFIGURÁCIÓ ---
const firebaseConfig = {
    apiKey: "AIzaSyCDpjCBMaKXWx14EBe0opqohVa5BXYPEf4",
    authDomain: "slytherin-hq.firebaseapp.com",
    projectId: "slytherin-hq",
    storageBucket: "slytherin-hq.firebasestorage.app",
    messagingSenderId: "428769735717",
    appId: "1:428769735717:web:028f626319c08832bb3bcc",
    measurementId: "G-5C9DRR1XXF",
    databaseURL: "https://slytherin-hq-default-rtdb.europe-west1.firebasedatabase.app"
};

// Firebase inicializálása
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const chatRef = database.ref('messages');

// --- 2. ADATOK ---
const SLY_COLOR = "#486400";
const RAV_COLOR = "#254586";

const mardekar = [
    { p: "Fogó", n: "Gemma Jenkins", l: "Jenkins", u: 5, t: 4, gy: 4, f: 3 },
    { p: "Őrző", n: "Heranoush Fletcher", l: "Fletcher", u: 4, t: 2, gy: 4, f: 3 },
    { p: "1. Terelő", n: "Nialen Travers", l: "Travers", u: 5, t: 3, gy: 4, f: 2 },
    { p: "2. Terelő", n: "Octavia Selwyn", l: "Selwyn", u: 3, t: 4, gy: 3, f: 4 },
    { p: "1. Hajtó", n: "Connor O'Hara", l: "O'Hara", u: 5, t: 5, gy: 4, f: 3 },
    { p: "2. Hajtó", n: "Elijah Shafiq", l: "Shafiq", u: 3, t: 3, gy: 5, f: 2 },
    { p: "3. Hajtó", n: "Blaze Florance", l: "Florance", u: 4, t: 2, gy: 4, f: 3 }
];

const hollohat = [
    { p: "Fogó", n: "Zafira Tavish", l: "Tavish", u: 5, t: 4, gy: 4, f: 4 },
    { p: "Őrző", n: "Elara Whitcombe", l: "Whitcombe", u: 4, t: 2, gy: 3, f: 3 },
    { p: "1. Terelő", n: "Robert McLagen", l: "McLagen", u: 4, t: 3, gy: 5, f: 2 },
    { p: "2. Terelő", n: "William Ashford", l: "Ashford", u: 3, t: 4, gy: 4, f: 3 },
    { p: "1. Hajtó", n: "Soffi Lowe", l: "Lowe", u: 0, t: 0, gy: 0, f: 0 },
    { p: "2. Hajtó", n: "Siddhartha Suduri", l: "Suduri", u: 4, t: 5, gy: 3, f: 4 },
    { p: "3. Hajtó", n: "Magnus Fairchild", l: "Fairchild", u: 3, t: 4, gy: 3, f: 5 }
];

// --- 3. RENDER ---
function render() {
    const renderTeam = (list, targetId) => {
        const container = document.getElementById(targetId);
        if (!container) return;

        container.innerHTML = list.map(player => `
            <div class="player-box">
                <span class="p-name">${player.p}: ${player.n}</span>
                <div class="stat-row">
                    <div class="stat">Ügy: <span>${player.u}</span></div>
                    <div class="stat">Tak: <span>${player.t}</span></div>
                    <div class="stat">Gyo: <span>${player.gy}</span></div>
                    <div class="stat">Fair: <span>${player.f}</span></div>
                </div>
            </div>
        `).join('');
    };

    renderTeam(mardekar, 'slytherinPlayers');
    renderTeam(hollohat, 'ravenclawPlayers');
}

// --- 4. BBCODE ---
function highlightNames(text, team, color) {
    team.forEach(player => {
        const regex = new RegExp(`\\b${player.l}([a-záéíóöőúüű]*)\\b`, 'gi');
        text = text.replace(regex, m => `[color=${color}][b]${m.toUpperCase()}[/b][/color]`);
    });
    return text;
}

document.getElementById('generateBtn').addEventListener('click', () => {
    let text = document.getElementById('matchText').value;
    const rS = document.getElementById('ravenclawScore').value;
    const sS = document.getElementById('slytherinScore').value;

    text = highlightNames(text, mardekar, SLY_COLOR);
    text = highlightNames(text, hollohat, RAV_COLOR);

    document.getElementById('outputCode').value =
`[box][justify]${text}[/justify]

[center][font=georgia][size=20pt][color=${RAV_COLOR}]${rS}[/color] [b][i]-[/i][/b] [color=${SLY_COLOR}]${sS}[/color][/size][/font][/center][/box]`;
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const out = document.getElementById('outputCode');
    out.select();
    document.execCommand('copy');
});

// --- 5. CHAT ---
const chatContainer = document.getElementById('chatMessages');
const chatNick = document.getElementById('chatNick');
const chatMsg = document.getElementById('chatMsg');
const sendBtn = document.getElementById('sendChatBtn');

// nick betöltése
const savedNick = localStorage.getItem('chatNick');
if (savedNick) chatNick.value = savedNick;

// üzenetek figyelése
chatRef.limitToLast(20).on('value', snapshot => {
    const data = snapshot.val();
    if (!data) return;

    chatContainer.innerHTML = Object.values(data).map(m => `
        <div class="chat-msg-entry">
            <div class="chat-meta">
                <span class="author">${m.user}</span>
                <span class="time">${m.time}</span>
            </div>
            <div class="chat-text">${m.text}</div>
        </div>
    `).join('');

    chatContainer.scrollTop = chatContainer.scrollHeight;
});

// küldés
sendBtn.addEventListener('click', () => {
    const user = chatNick.value.trim() || "Névtelen";
    const text = chatMsg.value.trim();
    if (!text) return;

    localStorage.setItem('chatNick', user);

    chatRef.push({
        user,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    chatMsg.value = "";
});

chatMsg.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendBtn.click();
});

// --- 6. PONTÁLLÁS ---
const ravenInput = document.getElementById('ravenclawScore');
const slyInput = document.getElementById('slytherinScore');

function saveScores() {
    localStorage.setItem('kviddicsScore', JSON.stringify({
        ravenclaw: ravenInput.value,
        slytherin: slyInput.value
    }));
}

function loadScores() {
    const saved = localStorage.getItem('kviddicsScore');
    if (!saved) return;
    const d = JSON.parse(saved);
    ravenInput.value = d.ravenclaw ?? 0;
    slyInput.value = d.slytherin ?? 0;
}

document.querySelectorAll('.score-control button').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.dataset.team === 'ravenclaw' ? ravenInput : slyInput;
        input.value = Math.max(0, Number(input.value) + Number(btn.dataset.dir) * 10);
        saveScores();
    });
});

ravenInput.addEventListener('change', saveScores);
slyInput.addEventListener('change', saveScores);

loadScores();
render();