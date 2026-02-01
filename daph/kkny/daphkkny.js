const tabs = document.querySelectorAll('.dk-tab');
const img = document.getElementById('dkImage');
const quote = document.getElementById('dkQuote');
const output = document.getElementById('dkOutput');

const TEXTURE_URL = 'https://i.imgur.com/Ssy3PZa.png';

const data = {
baratok: {
img: 'https://i.imgur.com/WzWp5fU.jpeg',
quote: '„Be around people that are good for your soul.”'
},
ellensegek: {
img: 'https://i.imgur.com/VmTF4CZ.jpeg',
quote: '„The best way to defeat someone is to beat him at politeness.”'
},
szerelmek: {
img: 'https://i.imgur.com/W80bIh2.jpeg',
quote: '„Some hearts understand each other even in silence.”'
},
egyeb: {
img: 'https://i.imgur.com/F8OurLz.jpeg',
quote: '„Are there still beautiful things?”'
}
};

tabs.forEach(tab => {
tab.addEventListener('click', () => {
tabs.forEach(t => t.classList.remove('active'));
tab.classList.add('active');

const type = tab.dataset.type;
img.src = data[type].img;
quote.textContent = data[type].quote;
});
});

function escapeHtml(str) {
return String(str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#39;');
}

document.getElementById('dkGenerate').addEventListener('click', () => {
const titleRaw = document.getElementById('dkTitle').value || '';
const msgRaw = document.getElementById('dkMessage').value || '';

const title = escapeHtml(titleRaw);
const msg = escapeHtml(msgRaw).replace(/\n/g, '<br>');

const cssOneLine =
'.dkE{max-width:350px;margin:0 auto;border-radius:18px;padding:14px;background-image:url(' + TEXTURE_URL + '),linear-gradient(180deg,rgba(255,255,255,0.60),rgba(255,255,255,0.25)),radial-gradient(circle at 20% 10%,rgba(210,190,235,0.45),transparent 60%);background-size:cover;background-repeat:no-repeat;background-blend-mode:multiply,normal,soft-light;box-shadow:0 18px 36px rgba(80,60,120,0.35);font-family:Georgia,serif;}'
+ '\n' + '.dkET{color:#4a3a66;font-size:14px;font-weight:bold;margin:0 0 8px 0;}'
+ '\n' + '.dkEM{color:#4b3c6a;font-size:13px;line-height:1.55;text-align:justify;}';

const html =
'<div class="dkE">'
+ '<div class="dkET">' + title + '</div>'
+ '<div class="dkEM">' + msg + '</div>'
+ '</div>';

const wrapped =
'[center][html]'
+ '<style>\n' + cssOneLine + '\n</style>\n'
+ html
+ '[/html][/center]';

output.value = wrapped;
});


const resetBtn = document.querySelector('.dk-reset');

const emptyState = {
img: 'https://i.imgur.com/xmJA2tB.jpeg',
quote: ' '
};

resetBtn.addEventListener('click', () => {
tabs.forEach(t => t.classList.remove('active'));
img.src = emptyState.img;
quote.textContent = emptyState.quote;
});
