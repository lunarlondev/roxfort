const imageInput = document.getElementById("imageURL");
const titleInput = document.getElementById("titleInput");
const messageInput = document.getElementById("messageInput");
const generateBtn = document.getElementById("generateBtn");
const resultOutput = document.getElementById("resultOutput");

function escapeHtml(value){
  return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function formatText(value){
  return escapeHtml(value).replace(/\r?\n/g,"<br>");
}

function generateCode(){

  const imageURL = imageInput.value.trim() || "https://lunarlondev.github.io/roxfort/solange/images/gif/kkny.gif";
  const title = titleInput.value.trim() || "Kapcsolat";
  const text = messageInput.value.trim() || "Leírás...";

  const safeTitle = escapeHtml(title);
  const safeText = formatText(text);

  const code = `[html]
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
.kknywrap{max-width:580px;margin:0 auto;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:rgba(230,214,195,0.92);}
.kknycard{border:1px solid rgba(232,214,176,0.18);border-radius:14px;background:linear-gradient(180deg,rgba(20,15,20,0.86),rgba(12,10,14,0.66));box-shadow:0 12px 30px rgba(0,0,0,0.62);padding:16px;position:relative;overflow:hidden;}
.kknycard:after{content:"";position:absolute;inset:-80px -80px auto -80px;height:210px;background:url('https://lunarlondev.github.io/roxfort/solange/images/veveB.jpg');background-size:720px auto;background-repeat:no-repeat;background-position:20% 0%;opacity:0.08;filter:grayscale(1) contrast(1.05);transform:rotate(6deg);pointer-events:none;}
.kknygrid{display:grid;grid-template-columns:140px 1fr;gap:12px;align-items:stretch;position:relative;z-index:1;}
.kknyleft{display:flex;}
.kknyimage{width:100%;height:100%;min-height:176px;border:1px solid rgba(232,214,176,0.16);border-radius:12px;overflow:hidden;background:rgba(0,0,0,0.22);box-shadow:0 0 18px rgba(182,144,78,0.14);}
.kknyimage img{width:100%;height:100%;display:block;object-fit:cover;}
.kknyright{min-width:0;border:1px solid rgba(232,214,176,0.14);border-radius:12px;padding:12px;background:rgba(0,0,0,0.20);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.03);position:relative;}
.kknytitle{margin:0 0 10px 0;font-family:Cinzel,serif;font-weight:600;font-size:16px;letter-spacing:0.2px;color:rgba(230,214,195,0.92);}
.kknyline{height:1px;margin:0 0 10px 0;background:linear-gradient(90deg,transparent,rgba(232,214,176,0.22),transparent);}
.kknytext{font-size:12px;line-height:1.7;color:rgba(230,214,195,0.88);word-break:break-word;}
@media (max-width:520px){.kknygrid{grid-template-columns:1fr;}.kknyimage{min-height:220px;}}
</style>
<div class="kknywrap">
  <div class="kknycard">
    <div class="kknygrid">
      <div class="kknyleft">
        <div class="kknyimage">
          <img src="${imageURL}" alt="">
        </div>
      </div>
      <div class="kknyright">
        <div class="kknytitle">${safeTitle}</div>
        <div class="kknyline"></div>
        <div class="kknytext">${safeText}</div>
      </div>
    </div>
  </div>
</div>
[/html]`;

  resultOutput.value = code;
}

generateBtn.addEventListener("click", generateCode);