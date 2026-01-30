const ring=document.querySelector('.bk-ringbox');
const info=document.getElementById('info');
const title=document.getElementById('infoTitle');
const desc=document.getElementById('infoDesc');
const sections=document.querySelectorAll('.bk-section');

const map={
friends:{t:'Barátok',d:'akinek sok barátja van, annak tulajdonképpen egy barátja sincs'},
enemies:{t:'Ellenségek',d:'barbonfóbiások'},
other:{t:'Egyéb',d:'nevezd, ahogy szeretnéd'}
};

function show(id){
sections.forEach(s=>s.classList.remove('is-show'));
document.getElementById(id).classList.add('is-show');
}

document.querySelectorAll('.bk-hit').forEach(hit=>{
const id=hit.dataset.type;
hit.addEventListener('mouseenter',()=>{
ring.classList.remove('hover-f','hover-e','hover-o');
ring.classList.add('hover-'+id.charAt(0));
title.textContent=map[id].t;
desc.textContent=map[id].d;
info.classList.add('show');
show(id);
});
hit.addEventListener('mouseleave',()=>{
ring.classList.remove('hover-f','hover-e','hover-o');
info.classList.remove('show');
});
});

document.getElementById('gen-btn').addEventListener('click',()=>{
const t=document.getElementById('gen-title').value.trim();
const d=document.getElementById('gen-text').value.trim();
const out=document.getElementById('gen-output');
if(!t||!d){out.value='';return;}
out.value=
'[center][html]<style>.bk-entry{background:rgba(10,10,12,0.88);border-left:3px solid #be2f37;text-align:justify;width:300px;padding:8px 10px;margin-bottom:8px;}.bk-name{font-size:12px;color:#f0ece6;margin-bottom:3px;}.bk-text{font-size:11px;line-height:1.5;color:#cfc9c2;white-space:pre-wrap;}</style>\n'+
'<div class="bk-entry">\n'+
'  <div class="bk-name">'+t+'</div>\n'+
'  <div class="bk-text">'+d+'</div>\n'+
'</div>[/html][/center]';
});
