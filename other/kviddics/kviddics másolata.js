// --- 1. FIREBASE KONFIGURÁCIÓ ---
const firebaseConfig = {
    apiKey: "AIzaSyCDpjCBMaKXWx14EBe0opqohVa5BXYPEf4",
    authDomain: "slytherin-hq.firebaseapp.com",
    projectId: "slytherin-hq",
    storageBucket: "slytherin-hq.firebasestorage.app",
    messagingSenderId: "428769735717",
    appId: "1:428769735717:web:028f626319c08832bb3bcc",
    measurementId: "G-5C9DRR1XXF",
    // Megjegyzés: A Realtime Database-hez szükség lehet a databaseURL-re:
    databaseURL: "https://slytherin-hq-default-rtdb.europe-west1.firebasedatabase.app" 
};

// Firebase inicializálása (Compat verzió)
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const chatRef = database.ref('messages');

// --- 2. ADATOK (Játékosok) ---
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

// --- 3. MEGJELENÍTÉS (Renderelés) ---
function render() {
    const renderTeam = (list, targetId) => {
        const container = document.getElementById(targetId);
        if(!container) return;
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

// --- 4. BBCODE GENERÁLÁS ---
function highlightNames(text, team, color) {
    team.forEach(player => {
        const regex = new RegExp(`\\b${player.l}([a-záéíóöőúüű]*)\\b`, 'gi');
        text = text.replace(regex, (match) => {
            return `[color=${color}][b]${match.toUpperCase()}[/b][/color]`;
        });
    });
    return text;
}

document.getElementById('generateBtn').addEventListener('click', () => {
    let text = document.getElementById('matchText').value;
    const rS = document.getElementById('ravenclawScore').value;
    const sS = document.getElementById('slytherinScore').value;

    text = highlightNames(text, mardekar, SLY_COLOR);
    text = highlightNames(text, hollohat, RAV_COLOR);

    const result = `[box][justify]${text}[/justify]

[center][font=georgia][size=20pt][color=${RAV_COLOR}]${rS}[/color] [color=#FFFFFF][b][i] - [/i][/b][/color] [color=${SLY_COLOR}]${sS}[/color][/size][/font][/center][/box]`;

    document.getElementById('outputCode').value = result;
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const out = document.getElementById('outputCode');
    out.select();
    document.execCommand('copy');
    
    const btn = document.getElementById('copyBtn');
    const original = btn.innerText;
    btn.innerText = "Másolva!";
    setTimeout(() => btn.innerText = original, 2000);
});

// --- 5. ÜZENŐFAL (Firebase Realtime) ---
const chatContainer = document.getElementById('chatMessages');
const chatNick = document.getElementById('chatNick');
const chatMsg = document.getElementById('chatMsg');
const sendBtn = document.getElementById('sendChatBtn');

// Üzenetek figyelése
chatRef.limitToLast(20).on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) {
        chatContainer.innerHTML = '<div style="color: #444; text-align:center; padding: 20px;">Nincs még üzenet...</div>';
        return;
    }

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

// Küldés funkció
sendBtn.addEventListener('click', () => {
    const user = chatNick.value.trim() || "Névtelen";
    const text = chatMsg.value.trim();
    
    if (text === "") return;

    chatRef.push({
        user: user,
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    chatMsg.value = "";
});

chatMsg.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});

// Indítás
render();



// --- 6. PONTÁLLÁS MENTÉSE / VISSZATÖLTÉSE ---

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

    try {
        const data = JSON.parse(saved);
        if (data.ravenclaw !== undefined) ravenInput.value = data.ravenclaw;
        if (data.slytherin !== undefined) slyInput.value = data.slytherin;
    } catch {}
}

// Gombos léptetés (10-esével)
document.querySelectorAll('.score-control button').forEach(btn => {
    btn.addEventListener('click', () => {
        const team = btn.dataset.team;
        const dir = parseInt(btn.dataset.dir, 10);
        const input = team === 'ravenclaw' ? ravenInput : slyInput;

        let val = parseInt(input.value || 0, 10);
        val += dir * 10;
        if (val < 0) val = 0;

        input.value = val;
        saveScores();
    });
});

// Kézi beírásnál is ment
ravenInput.addEventListener('change', saveScores);
slyInput.addEventListener('change', saveScores);

// Oldal betöltésekor visszatölt
loadScores();