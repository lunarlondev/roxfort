const $=id=>document.getElementById(id);
const form=$('generatorForm');
const previewFrame=$('previewFrame');
const generatedCode=$('generatedCode');
const bodyEditor=$('bodyEditor');
const copyCode=$('copyCode');
const thirdName=$('thirdName');
const thirdWrapButton=$('thirdWrapButton');
const textColor=$('textColor');
const SYNODIC_MONTH=29.530588853;
const REF_NEW_MOON=Date.UTC(2000,0,6,18,14,0);
const moonPhases=[{key:'new',name:'újhold',img:'https://i.imgur.com/xrEHuid.png'},{key:'waxing-crescent',name:'növő sarló',img:'https://i.imgur.com/YZmVhYR.png'},{key:'first-quarter',name:'első negyed',img:'https://i.imgur.com/zbRl5BU.png'},{key:'waxing-gibbous',name:'növő púpos',img:'https://i.imgur.com/se7k2ut.png'},{key:'full',name:'telihold',img:'https://i.imgur.com/fydHuui.png'},{key:'waning-gibbous',name:'fogyó púpos',img:'https://i.imgur.com/QizOi7z.png'},{key:'last-quarter',name:'utolsó negyed',img:'https://i.imgur.com/55tvWWF.png'},{key:'waning-crescent',name:'fogyó sarló',img:'https://i.imgur.com/TYSSsiJ.png'}];
const generatedCss=`.rp-card{width:100%;max-width:550px;margin:0 auto;padding:14px;box-sizing:border-box;background:linear-gradient(180deg,#fff7f9,#fff0f4);border:1px solid #efd9e2;border-radius:28px;box-shadow:0 14px 35px rgba(155,105,125,.16);font-family:Georgia,serif;color:#7f7478;}
.rp-header{position:relative;height:360px;overflow:hidden;border-radius:24px;border:1px solid rgba(255,255,255,.8);box-shadow:inset 0 0 0 1px rgba(255,255,255,.55);background:#f6dfe7;}
.rp-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;}
.rp-veil{position:absolute;inset:0;z-index:1;background:radial-gradient(circle at 12% 10%,rgba(255,255,255,.88),rgba(255,255,255,.18) 38%,transparent 58%),linear-gradient(135deg,rgba(255,242,246,.88),rgba(255,221,232,.38) 46%,rgba(94,48,62,.28));}
.rp-marks{position:absolute;top:13px;right:15px;z-index:3;color:#f6d3de;font-size:12px;letter-spacing:5px;text-shadow:0 1px 8px rgba(80,40,55,.35);}
.rp-layout{position:relative;z-index:2;height:100%;padding:16px;box-sizing:border-box;display:grid;grid-template-columns:1.12fr .88fr;grid-template-rows:auto 1fr auto;gap:9px;}
.rp-quote{grid-column:1/3;width:70%;padding:11px 14px 10px;background:rgba(255,255,255,.58);border:1px solid rgba(255,255,255,.72);border-radius:20px 20px 20px 8px;box-shadow:0 10px 24px rgba(105,65,80,.13);backdrop-filter:blur(3px);font-size:12px;line-height:1.65;font-style:italic;color:#786f73;text-shadow:0 1px 0 rgba(255,255,255,.55);}
.rp-quote:first-letter{font-family:'Allura',cursive;font-size:66px;line-height:.62;float:left;padding:8px 8px 0 0;color:#c9859b;text-shadow:none;}
.rp-info{align-self:end;padding:12px;background:rgba(255,255,255,.56);border:1px solid rgba(255,255,255,.75);border-radius:22px 8px 22px 22px;box-shadow:0 12px 26px rgba(105,65,80,.14);backdrop-filter:blur(4px);}
.rp-label{display:block;margin-bottom:2px;font-size:8px;letter-spacing:2px;text-transform:uppercase;font-style:italic;color:#b47d91;}
.rp-name{margin-bottom:7px;font-size:17px;line-height:1.1;color:#7c5d68;font-style:italic;}
.rp-row{margin-top:6px;padding-top:6px;border-top:1px solid rgba(221,174,190,.45);font-size:10px;line-height:1.4;color:#7f7478;}
.rp-tw{align-self:end;padding:11px 12px;background:rgba(255,247,250,.62);border:1px solid rgba(255,255,255,.76);border-radius:8px 22px 22px 22px;box-shadow:0 12px 26px rgba(105,65,80,.12);backdrop-filter:blur(4px);}
.rp-tw-title{margin-bottom:6px;text-align:center;font-size:8px;letter-spacing:2px;text-transform:uppercase;font-style:italic;color:#b47d91;}
.rp-tw-list{margin:0;padding-left:15px;font-size:10px;line-height:1.55;color:#7f7478;}
.rp-lunar{grid-column:1/3;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:9px;padding:9px 12px;background:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.78);border-radius:18px;box-shadow:0 12px 26px rgba(105,65,80,.12);backdrop-filter:blur(4px);}
.rp-lunar-title{font-size:8px;letter-spacing:2px;text-transform:uppercase;font-style:italic;color:#b47d91;white-space:nowrap;}
.rp-phases{display:flex;align-items:center;justify-content:center;gap:7px;min-height:44px;white-space:nowrap;overflow:visible;}
.rp-moon{display:inline-block;width:19px;height:19px;object-fit:contain;opacity:.86;filter:drop-shadow(0 1px 1px rgba(120,70,90,.22));}
.rp-moon-current{position:relative;display:inline-flex;align-items:center;justify-content:center;}
.rp-moon-current:after{content:"ma";position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);font-size:7px;line-height:1;letter-spacing:1px;text-transform:uppercase;color:#b47d91;}
.rp-moon-now{width:38px;height:38px;opacity:1;padding:3px;border-radius:50%;background:rgba(255,255,255,.52);box-shadow:0 0 0 1px rgba(255,255,255,.85),0 0 18px rgba(255,182,193,.55),0 8px 18px rgba(155,105,125,.18);}
.rp-lunar-note{text-align:right;font-size:10px;line-height:1.3;color:#7f7478;font-style:italic;}
.rp-body{margin-top:14px;padding:21px 22px;background:rgba(255,255,255,.62);border:1px solid #efd9e2;border-radius:24px;font-size:12px;line-height:2;text-align:justify;color:#7d7377;box-sizing:border-box;}
.rp-body p{margin:0 0 13px;}
.rp-body ul,.rp-body ol{margin:0 0 13px 20px;padding:0;}
.rp-body li{margin:0 0 5px;}
.rp-flourish{margin-top:16px;text-align:center;font-size:12px;letter-spacing:7px;color:#d9a9ba;}
b[data-role="viv"]{color:lightpink;font-style:italic;font-weight:700;text-shadow:0 0 1px #c98699,0 1px 0 rgba(255,255,255,.95);}
b[data-role="morgana"]{color:#BA0000;font-style:italic;font-weight:700;text-shadow:0 1px 0 rgba(255,255,255,.85);}
b[data-role="third"]{color:var(--third-dialogue-color);font-style:italic;font-weight:700;text-shadow:0 1px 0 rgba(255,255,255,.85);}`;
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function normalizeColor(value){return /^#[0-9a-f]{6}$/i.test(value)?value:'#8b6fd6';}
function normalizeInlineColor(value){
 const raw=String(value??'').trim();
 const shortHex=raw.match(/^#([0-9a-f]{3})$/i);
 if(shortHex)return `#${shortHex[1].split('').map(ch=>ch+ch).join('').toLowerCase()}`;
 const longHex=raw.match(/^#([0-9a-f]{6})$/i);
 if(longHex)return `#${longHex[1].toLowerCase()}`;
 const rgb=raw.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:1|1\.0+))?\s*\)$/i);
 if(rgb){
  const nums=rgb.slice(1,4).map(Number);
  if(nums.every(n=>n>=0&&n<=255))return `#${nums.map(n=>n.toString(16).padStart(2,'0')).join('')}`;
 }
 return '';
}
function inlineColorStyle(node){
 const color=normalizeInlineColor(node.style?.color||node.getAttribute?.('color')||'');
 return color?` style="color:${color};"`:'';
}
function getInputDate(){const raw=$('postDate').value;if(raw)return new Date(`${raw}T12:00:00`);const d=new Date();d.setHours(12,0,0,0);return d;}
function formatDate(date){return new Intl.DateTimeFormat('hu-HU',{year:'numeric',month:'long',day:'numeric'}).format(date);}
function lunarAge(date){const utc=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),12,0,0);const days=(utc-REF_NEW_MOON)/86400000;return ((days%SYNODIC_MONTH)+SYNODIC_MONTH)%SYNODIC_MONTH;}
function phaseIndex(age){if(age<1.84566||age>=27.68493)return 0;if(age<5.53699)return 1;if(age<9.22831)return 2;if(age<12.91963)return 3;if(age<16.61096)return 4;if(age<20.30228)return 5;if(age<23.99361)return 6;return 7;}
function futureText(label,days){if(days<=.75)return `${label} ma éjjel`;if(days<=1.5)return `${label} holnap`;return `${Math.round(days)} nap múlva ${label}`;}
function lunarNote(age,index){const current=moonPhases[index].name;const milestones=[{age:0,label:'újhold'},{age:SYNODIC_MONTH/4,label:'első negyed'},{age:SYNODIC_MONTH/2,label:'telihold'},{age:SYNODIC_MONTH*3/4,label:'utolsó negyed'},{age:SYNODIC_MONTH,label:'újhold'}];for(const m of milestones){if(Math.abs(age-m.age)<=.75)return `${current}<br>${m.label} ma éjjel`;}const next=milestones.find(m=>m.age>age)??milestones[milestones.length-1];return `${current}<br>${futureText(next.label,next.age-age)}`;}
function lunarHtml(date){const age=lunarAge(date);const index=phaseIndex(age);const order=[];for(let offset=-3;offset<=3;offset++)order.push((index+offset+moonPhases.length)%moonPhases.length);const imgs=order.map((phaseIdx,place)=>{const phase=moonPhases[phaseIdx];if(place===3)return `<span class="rp-moon-current"><img class="rp-moon rp-moon-now" src="${phase.img}" alt="${escapeHtml(phase.name)}"></span>`;return `<img class="rp-moon" src="${phase.img}" alt="${escapeHtml(phase.name)}">`;}).join('');return {row:`<div class="rp-phases">${imgs}</div>`,note:lunarNote(age,index)};}
function quoteHtml(text){return escapeHtml(text).trim().replace(/\r?\n/g,'<br>')||'Ide kerül az idézet.';}
function warningHtml(text){const items=text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!items.length)return '<li>nincs megadva</li>';return items.map(item=>`<li>${escapeHtml(item)}</li>`).join('');}
function isBlockNode(node){return node.nodeType===1&&['P','DIV','UL','OL'].includes(node.tagName);}
function hasTextOrMedia(html){const tmp=document.createElement('div');tmp.innerHTML=html;return tmp.textContent.trim()||tmp.querySelector('br');}
function serializeChildren(node){return Array.from(node.childNodes).map(serializeNode).join('');}
function serializeNode(node){
 if(node.nodeType===Node.TEXT_NODE)return escapeHtml(node.textContent);
 if(node.nodeType!==Node.ELEMENT_NODE)return '';
 const tag=node.tagName;
 if(tag==='BR')return '<br>';
 const children=serializeChildren(node);
 if(tag==='P'||tag==='DIV')return hasTextOrMedia(children)?`<p>${children}</p>`:'';
 if(tag==='UL'||tag==='OL')return `<${tag.toLowerCase()}>${children}</${tag.toLowerCase()}>`;
 if(tag==='LI')return `<li>${children}</li>`;
 const role=node.dataset?.role;
 if(role&&['viv','morgana','third'].includes(role))return `<b data-role="${role}"${inlineColorStyle(node)}>${children}</b>`;
 if(tag==='SPAN'||tag==='FONT'){const style=inlineColorStyle(node);return style?`<span${style}>${children}</span>`:children;}
 if(tag==='B'||tag==='STRONG')return `<strong${inlineColorStyle(node)}>${children}</strong>`;
 if(tag==='I'||tag==='EM')return `<em${inlineColorStyle(node)}>${children}</em>`;
 if(tag==='U')return `<u${inlineColorStyle(node)}>${children}</u>`;
 if(tag==='S'||tag==='STRIKE')return `<s${inlineColorStyle(node)}>${children}</s>`;
 return children;
}
function bodyHtml(){
 const root=document.createElement('div');
 root.innerHTML=bodyEditor.innerHTML;
 const parts=[];
 let inline='';
 const flushInline=()=>{if(hasTextOrMedia(inline)){parts.push(`<p>${inline}</p>`);}inline='';};
 root.childNodes.forEach(node=>{
  if(isBlockNode(node)){flushInline();const block=serializeNode(node);if(block)parts.push(block);}
  else if(node.nodeType===Node.ELEMENT_NODE&&node.tagName==='BR'){flushInline();}
  else inline+=serializeNode(node);
 });
 flushInline();
 return parts.join('')||'<p>Ide kerül a törzsszöveg.</p>';
}
function buildCode(){const date=getInputDate();const moon=lunarHtml(date);const thirdColor=normalizeColor($('thirdColor').value);const name=escapeHtml($('postName').value.trim()||'Névtelen');const location=escapeHtml($('postLocation').value.trim()||'Ismeretlen helyszín');const image=escapeHtml($('headerImage').value.trim()||'https://i.pinimg.com/736x/ab/d8/a9/abd8a9566138d845a74566bb474388b1.jpg');const quote=quoteHtml($('quoteText').value);const warnings=warningHtml($('warningsText').value);const body=bodyHtml();return `[html]<link href="https://fonts.googleapis.com/css2?family=Allura&display=swap" rel="stylesheet">\n<style>\n${generatedCss}\n</style>\n<div class="rp-card" style="--third-dialogue-color:${thirdColor};"><div class="rp-header"><img class="rp-photo" src="${image}" alt="header image"><div class="rp-veil"></div><div class="rp-marks">☾ ✧ ୨୧ ✦</div><div class="rp-layout"><div class="rp-quote">${quote}</div><div class="rp-info"><span class="rp-label">név</span><div class="rp-name">${name}</div><div class="rp-row"><span class="rp-label">dátum</span>${formatDate(date)}</div><div class="rp-row"><span class="rp-label">helyszín</span>${location}</div></div><div class="rp-tw"><div class="rp-tw-title">figyelmeztetések</div><ul class="rp-tw-list">${warnings}</ul></div><div class="rp-lunar"><div class="rp-lunar-title">holdnaptár</div>${moon.row}<div class="rp-lunar-note">${moon.note}</div></div></div></div><div class="rp-body">${body}<div class="rp-flourish">✧ ୨୧ ☾</div></div></div>[/html]`;}
function previewOnly(code){return code.replace(/^\[html\]/,'').replace(/\[\/html\]$/,'');}
function update(){thirdWrapButton.textContent=thirdName.value.trim()||'Harmadik';bodyEditor.style.setProperty('--third-dialogue-color',normalizeColor($('thirdColor').value));const code=buildCode();generatedCode.value=code;previewFrame.srcdoc=`<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#fffafc;}</style></head><body>${previewOnly(code)}</body></html>`;}
let savedEditorRange=null;
function selectionInsideEditor(){const sel=window.getSelection();if(!sel.rangeCount)return false;const range=sel.getRangeAt(0);return bodyEditor.contains(range.commonAncestorContainer)||range.commonAncestorContainer===bodyEditor;}
function saveEditorSelection(){const sel=window.getSelection();if(selectionInsideEditor())savedEditorRange=sel.getRangeAt(0).cloneRange();}
function restoreEditorSelection(){const sel=window.getSelection();bodyEditor.focus();if(savedEditorRange){sel.removeAllRanges();sel.addRange(savedEditorRange);}else if(!selectionInsideEditor())placeCaretAtEnd(bodyEditor);}
function placeCaretAtEnd(el){el.focus();const range=document.createRange();range.selectNodeContents(el);range.collapse(false);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);savedEditorRange=range.cloneRange();}
function wrapSelection(role){restoreEditorSelection();const sel=window.getSelection();const range=sel.getRangeAt(0);const wrapper=document.createElement('b');wrapper.dataset.role=role;if(range.collapsed){wrapper.textContent='párbeszéd';range.insertNode(wrapper);}else{wrapper.appendChild(range.extractContents());range.insertNode(wrapper);}const after=document.createTextNode(' ');wrapper.after(after);const nextRange=document.createRange();nextRange.selectNodeContents(wrapper);sel.removeAllRanges();sel.addRange(nextRange);saveEditorSelection();update();}
function runFormat(command){restoreEditorSelection();document.execCommand(command,false,null);updateToolbarState();saveEditorSelection();update();}
function applyTextColor(){const color=normalizeInlineColor(textColor.value)||'#c9859b';restoreEditorSelection();try{document.execCommand('styleWithCSS',false,true);}catch{}document.execCommand('foreColor',false,color);updateToolbarState();saveEditorSelection();update();}
function updateToolbarState(){document.querySelectorAll('[data-format]').forEach(button=>{try{button.classList.toggle('active',document.queryCommandState(button.dataset.format));}catch{button.classList.remove('active');}});}
function setDefaultDate(){const today=new Date();const yyyy=today.getFullYear();const mm=String(today.getMonth()+1).padStart(2,'0');const dd=String(today.getDate()).padStart(2,'0');$('postDate').value=`${yyyy}-${mm}-${dd}`;}
try{document.execCommand('defaultParagraphSeparator',false,'p');}catch{}
form.addEventListener('input',update);
bodyEditor.addEventListener('input',update);
bodyEditor.addEventListener('keyup',()=>{saveEditorSelection();updateToolbarState();});
bodyEditor.addEventListener('mouseup',()=>{saveEditorSelection();updateToolbarState();});
bodyEditor.addEventListener('paste',event=>{event.preventDefault();const text=event.clipboardData?.getData('text/plain')??'';document.execCommand('insertText',false,text);update();});
document.querySelectorAll('.body-tools button').forEach(button=>button.addEventListener('mousedown',event=>event.preventDefault()));
textColor.addEventListener('mousedown',saveEditorSelection);
textColor.addEventListener('focus',saveEditorSelection);
textColor.addEventListener('input',applyTextColor);
textColor.addEventListener('change',applyTextColor);
document.querySelectorAll('[data-format]').forEach(button=>button.addEventListener('click',()=>runFormat(button.dataset.format)));
document.querySelectorAll('[data-wrap]').forEach(button=>button.addEventListener('click',()=>wrapSelection(button.dataset.wrap)));
document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tabpane').forEach(x=>x.classList.remove('active'));button.classList.add('active');$(`${button.dataset.tab}Pane`).classList.add('active');}));
copyCode.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(generatedCode.value);copyCode.textContent='Másolva';setTimeout(()=>copyCode.textContent='Kód másolása',1200);}catch{generatedCode.select();document.execCommand('copy');copyCode.textContent='Másolva';setTimeout(()=>copyCode.textContent='Kód másolása',1200);}});
document.addEventListener('selectionchange',()=>{if(selectionInsideEditor()){saveEditorSelection();updateToolbarState();}});
setDefaultDate();
update();
