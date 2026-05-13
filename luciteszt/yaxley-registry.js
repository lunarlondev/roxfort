const yaxSealImage = 'https://i.imgur.com/34iDx9G.png';

const yaxContacts = {
  friends: {
    img: 'https://i.pinimg.com/736x/eb/08/92/eb08927869dff3a572cdd9a9d892861d.jpg',
    alt: 'Barát',
    name: 'Közel a távolsághoz',
    desc: 'Sosem tagadtam, hogy nem könnyű velem a barátság, nincs is sok belőle. Nehezen nyílok meg és ritkán lelkesedem látványosan, ráadásul leginkább a saját céljaim vezérelnek. Viszont különösen jól látom az emberekben a potenciált, a tehetséget és azokat az értékeket, amik elsőre nem mindenkinek tűnnek fel. Ha mégis elnyernéd a bizalmamat, barátságom csendes, visszafogott tele rengeteg elvárással, de cserébe mindent az eszembe vések.'
  },
  enemies: {
    img: 'https://i.pinimg.com/736x/78/7b/93/787b93d186a80ba110f6b98f050b6866.jpg',
    alt: 'Ellenség',
    name: 'Penge a csend mögött',
    desc: 'Ellenségemnek lenned olyan, mintha valaki csendben figyelné minden hibádat és évekkel később is pontosan emlékezne rájuk. Nem dühből pusztítok, hanem hideg fejjel, számító pontossággal, és sosem teszek felesleges lépést. A legijesztőbb talán az, hogy amikor átgázolok rajtad, azt úgy teszem, mintha már rég eldőlt volna, hogy ez elkerülhetetlen. És ez így is van.'
  },
  loves: {
    img: 'https://i.pinimg.com/1200x/34/7e/0a/347e0ae7706276ee4a0aea2c11ec4bd0.jpg',
    alt: 'Szerelem',
    name: 'Kegyetlen világból megőrzött gyengédség',
    desc: 'Lassan, évek alatt engedlek be egy gondosan őrzött világba, ahol az érzelmek ritkán hangosak és talán nem is annyira mélyek, amennyire szeretném. Nehéz lenyűgözni, magasak az elvárásaim, és ugyanúgy számon tartom a hibáidat, mint bárki másnál. Viszont ha valóban eljutsz odáig, hogy a bizalmamat és a gyengédségemet megkapod, érted csendben, kérdés nélkül mennék el a legtovább. Bár egyetlen ilyen ember van, aki eddig eljutott erre a szintre...'
  },
  other: {
    img: 'https://i.pinimg.com/1200x/8c/81/ff/8c81ff72f50f7b181d38fd9b6b6fcb20.jpg',
    alt: 'Egyéb',
    name: 'A céljai mögött eltűnő ember',
    desc: 'Úgy látsz te is engem, mint valakit, aki hideg, kegyetlen és túl könnyen lép át másokon, mintha minden ember csak akadály lenne az úton, igaz? Ne aggódj, sokan vannak így. Távolságtartásom gyakran felsőbbrendűségnek vagy gonoszságnak hiszed, pedig sokszor egyszerűen csak annyira a céljaimra figyelek, hogy nincs időm és ingerenciám mindenkinek megfelelni vagy mindenkit észrevenni, meg nem is akarok. Kívülről keménynek és ridegnek tűnök, miközben belül inkább egy állandóan előre néző ember vagyok, aki ritkán áll meg magyarázkodni.'
  }
};

function showYaxContact(type, button) {
  const contact = yaxContacts[type];
  if (!contact) return;

  document.getElementById('yaxContactImg').src = contact.img;
  document.getElementById('yaxContactImg').alt = contact.alt;
  document.getElementById('yaxContactName').textContent = contact.name;
  document.getElementById('yaxContactDesc').textContent = contact.desc;

  document.querySelectorAll('.yax-contact-tab').forEach(tab => tab.classList.remove('active'));
  if (button) button.classList.add('active');
}

function escapeYaxleyHTML(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getYaxleyLetterStyle() {
  return "<style>@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Italianno&display=swap');.yax-letter,.yax-letter *{box-sizing:border-box}.yax-letter{max-width:420px;margin:0 auto;padding:22px 26px 20px;position:relative;overflow:hidden;border:1px solid rgba(131,173,181,.26);border-radius:4px;background:radial-gradient(circle at 50% 18%,rgba(131,173,181,.08),transparent 32%),radial-gradient(circle at 50% 88%,rgba(75,126,138,.1),transparent 28%),linear-gradient(180deg,#141a1d 0%,#0e1214 100%);box-shadow:0 14px 34px rgba(0,0,0,.48),inset 0 0 34px rgba(131,173,181,.05),inset 0 0 70px rgba(0,0,0,.5);font-family:'Libre Baskerville',Georgia,serif;color:#83adb5}.yax-letter:before{content:'';position:absolute;inset:0;border:1px solid rgba(75,126,138,.45);box-shadow:inset 0 0 20px rgba(75,126,138,.12),0 0 14px rgba(75,126,138,.08);pointer-events:none;border-radius:4px}.yax-letter-title{font-family:'Italianno',cursive;font-size:28px;line-height:1.1;color:#4b7e8a;text-align:center;margin:0 0 12px;letter-spacing:.05em;text-shadow:0 0 16px rgba(75,126,138,.35)}.yax-letter-ornament{display:flex;align-items:center;gap:10px;margin:12px 0}.yax-letter-ornament-line{flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(75,126,138,.85),transparent)}.yax-letter-ornament-diamond{width:5px;height:5px;border:1px solid #4b7e8a;transform:rotate(45deg);box-shadow:0 0 7px rgba(75,126,138,.45)}.yax-letter-body{font-size:10px;line-height:1.65;text-align:justify;white-space:pre-wrap;margin:0 0 12px;color:#83adb5;text-shadow:0 0 8px rgba(131,173,181,.12)}.yax-letter-signature{font-family:'Italianno',cursive;font-size:22px;color:#83adb5;letter-spacing:.05em;text-align:right;margin:0 0 12px;text-shadow:0 0 12px rgba(131,173,181,.2)}.yax-letter-footer{display:flex;flex-direction:column;align-items:center;text-align:center;margin-top:8px}.yax-letter-seal{width:80px;height:80px;object-fit:contain;opacity:.9;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))}.yax-letter-footer-text{font-family:'Italianno',cursive;font-size:13px;color:#4b7e8a;letter-spacing:.05em;border-top:1px solid rgba(75,126,138,.42);padding-top:3px}</style>";
}

function buildYaxleyLetterMarkup(safeTitle, safeMessage, safeSignature) {
  return '<div class="yax-letter"><div class="yax-letter-title">' + safeTitle + '</div><div class="yax-letter-ornament"><div class="yax-letter-ornament-line"></div><div class="yax-letter-ornament-diamond"></div><div class="yax-letter-ornament-line"></div></div><div class="yax-letter-body">' + safeMessage + '</div><div class="yax-letter-signature">' + safeSignature + '</div><div class="yax-letter-ornament"><div class="yax-letter-ornament-line"></div><div class="yax-letter-ornament-diamond"></div><div class="yax-letter-ornament-line"></div></div><div class="yax-letter-footer"><img class="yax-letter-seal" src="' + yaxSealImage + '" alt="Yaxley Seal"><div class="yax-letter-footer-text">Yaxley - est. 1620</div></div></div>';
}

function generateYaxleyLetter() {
  const title = document.getElementById('yaxLetterTitle').value.trim();
  const message = document.getElementById('yaxLetterMessage').value.trim();
  const signature = document.getElementById('yaxLetterSignature').value.trim();

  if (!title || !message || !signature) {
    alert('Kérlek, töltsd ki az összes mezőt!');
    return;
  }

  const safeTitle = escapeYaxleyHTML(title);
  const safeMessage = escapeYaxleyHTML(message);
  const safeSignature = escapeYaxleyHTML(signature);
  const letterMarkup = buildYaxleyLetterMarkup(safeTitle, safeMessage, safeSignature);
  const letterHTML = '[html]' + getYaxleyLetterStyle() + letterMarkup + '[/html]';
  const outputCode = document.getElementById('yaxOutputCode');
  const outputPreview = document.getElementById('yaxOutputPreview');
  const copyStatus = document.getElementById('yaxCopyStatus');

  outputCode.value = letterHTML;
  outputPreview.innerHTML = letterMarkup;
  copyStatus.textContent = '';
  document.getElementById('yaxInlineOutput').classList.add('active');
}

function copyYaxleyLetterCode() {
  const output = document.getElementById('yaxOutputCode');
  const status = document.getElementById('yaxCopyStatus');
  const value = output.value || '';

  if (!value) {
    status.textContent = 'Előbb generálj egy kódot.';
    return;
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(value).then(() => {
      status.textContent = 'Kimásolva.';
    }).catch(() => {
      fallbackCopyYaxleyLetterCode(output, status);
    });
    return;
  }

  fallbackCopyYaxleyLetterCode(output, status);
}

function fallbackCopyYaxleyLetterCode(output, status) {
  output.focus();
  output.select();
  try {
    document.execCommand('copy');
    status.textContent = 'Kimásolva.';
  } catch (error) {
    status.textContent = 'Nem sikerült automatikusan másolni. Jelöld ki kézzel.';
  }
}
