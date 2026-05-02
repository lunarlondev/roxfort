(function(){
    const options = Array.from(document.querySelectorAll(".b06-option"));
    const comment = document.getElementById("ballotComment");
    const canvas = document.getElementById("ballotCanvas");
    const output = document.getElementById("generatedCode");
    const generateButton = document.getElementById("generateCode");
    const resetButton = document.getElementById("resetBallot");
    const clearCanvasButton = document.getElementById("clearCanvas");

    const ctx = canvas.getContext("2d");

    const allOptions = [
        { party: "Salem Hagyatéka Párt", candidate: "Cassius Yaxley", logo: "https://lunarlondev.github.io/roxfort/other/ballot/img/salem.png" },
        { party: "Újvilági Mágus Párt", candidate: "Ember Picquery", logo: "https://lunarlondev.github.io/roxfort/other/ballot/img/ujvilag.png" }
    ];

    let selectedOption = null;
    let drawing = false;
    let doodleDirty = false;

    function escapeHtml(value){
        return String(value)
            .replaceAll("&","&amp;")
            .replaceAll("<","&lt;")
            .replaceAll(">","&gt;")
            .replaceAll('"',"&quot;")
            .replaceAll("'","&#039;");
    }

    function nl2br(value){
        return escapeHtml(value).replaceAll("\n","<br>");
    }

    function setupCanvas(preserve){
        const previous = preserve && doodleDirty ? canvas.toDataURL("image/png") : "";
        const rect = canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;

        canvas.width = Math.max(1,Math.floor(rect.width * ratio));
        canvas.height = Math.max(1,Math.floor(rect.height * ratio));

        ctx.setTransform(ratio,0,0,ratio,0,0);
        ctx.lineWidth = 2.25;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#282117";

        if(previous){
            const img = new Image();
            img.onload = function(){
                ctx.drawImage(img,0,0,rect.width,rect.height);
            };
            img.src = previous;
        }
    }

    function getPoint(event){
        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    function startDrawing(event){
        drawing = true;
        doodleDirty = true;

        const point = getPoint(event);
        ctx.beginPath();
        ctx.moveTo(point.x,point.y);

        if(canvas.setPointerCapture && event.pointerId !== undefined){
            canvas.setPointerCapture(event.pointerId);
        }

        event.preventDefault();
    }

    function draw(event){
        if(!drawing){
            return;
        }

        const point = getPoint(event);
        ctx.lineTo(point.x,point.y);
        ctx.stroke();
        event.preventDefault();
    }

    function stopDrawing(){
        if(!drawing){
            return;
        }

        drawing = false;
        ctx.beginPath();
    }

    function clearCanvas(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        doodleDirty = false;
    }

    function selectOption(option){
        selectedOption = option;

        options.forEach(function(item){
            item.classList.remove("is-selected");
            item.querySelector(".b06-mark").textContent = "";
        });

        option.classList.add("is-selected");
        option.querySelector(".b06-mark").textContent = "X";
    }

    function getBallotData(){
        if(!selectedOption){
            return null;
        }

        return {
            party: selectedOption.dataset.party,
            candidate: selectedOption.dataset.candidate,
            logo: selectedOption.dataset.logo,
            comment: comment.value.trim(),
            doodle: doodleDirty ? canvas.toDataURL("image/png") : ""
        };
    }

    function buildOptionHtml(party,candidate,logo,isSelected){
        return [
            '<div class="b06s-option ' + (isSelected ? 'b06s-option-selected' : '') + '">',
            '<img class="b06s-logo" src="' + escapeHtml(logo) + '" alt="">',
            '<div class="b06s-option-text">',
            '<strong>' + escapeHtml(party) + '</strong>',
            '<em>' + escapeHtml(candidate) + '</em>',
            '</div>',
            '<div class="b06s-mark">' + (isSelected ? 'X' : '') + '</div>',
            '</div>'
        ].join("");
    }

    function buildGeneratedCode(data){
        const optionHtml = allOptions.map(function(item){
            return buildOptionHtml(item.party,item.candidate,item.logo,item.party === data.party);
        }).join("\n");

        const extras = [];

        if(data.comment){
            extras.push('<div class="b06s-comment">' + nl2br(data.comment) + '</div>');
        }

        if(data.doodle){
            extras.push('<img class="b06s-doodle" src="' + data.doodle + '" alt="">');
        }

        const extrasHtml = extras.length ? '<div class="b06s-extras">\n' + extras.join("\n") + '\n</div>' : '';

        return [
            '[html]',
            '<div class="b06s-card">',
            '<style>',
            '.b06s-card{max-width:440px;margin:12px auto;padding:12px;background:linear-gradient(180deg,#f5eedc,#eadfc6);border:1px solid #b8a178;border-radius:20px;color:#282117;font-family:Inter,"Segoe UI",Arial,sans-serif;box-shadow:0 14px 30px rgba(0,0,0,.16);}',
            '.b06s-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:9px;border-bottom:1px solid rgba(74,57,33,.16);}',
            '.b06s-meta{font-size:9px;text-transform:uppercase;letter-spacing:1.35px;color:#78674d;margin-bottom:3px;}',
            '.b06s-title{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:22px;line-height:1.05;color:#282117;}',
            '.b06s-year{padding:7px 10px;border:1px solid rgba(74,57,33,.18);border-radius:11px;background:rgba(255,255,255,.55);font-family:Georgia,"Times New Roman",serif;font-size:19px;font-weight:bold;}',
            '.b06s-list{display:grid;gap:7px;}',
            '.b06s-option{display:grid;grid-template-columns:43px 1fr 34px;gap:8px;align-items:center;padding:8px;border:1px solid rgba(74,57,33,.16);border-radius:14px;background:rgba(255,255,255,.38);}',
            '.b06s-option-selected{background:#fff;box-shadow:inset 0 0 0 1px rgba(40,33,23,.08);}',
            '.b06s-logo{display:block;width:43px;height:43px;object-fit:contain;border-radius:13px;background:#fff;border:1px solid rgba(74,57,33,.14);padding:4px;}',
            '.b06s-option-text{display:grid;gap:2px;}',
            '.b06s-option-text strong{font-family:Georgia,"Times New Roman",serif;font-size:15px;line-height:1.08;color:#282117;}',
            '.b06s-option-text em{font-style:normal;text-transform:uppercase;letter-spacing:1.05px;font-size:9px;color:#78674d;}',
            '.b06s-mark{display:grid;place-items:center;width:32px;height:32px;border:2px solid #282117;border-radius:9px;background:rgba(255,255,255,.72);font-family:Arial,sans-serif;font-size:22px;font-weight:800;line-height:1;}',
            '.b06s-extras{margin-top:10px;padding-top:9px;border-top:1px dashed rgba(74,57,33,.18);}',
            '.b06s-comment{padding:7px 9px;border-radius:12px;background:rgba(255,255,255,.34);font-size:12px;line-height:1.45;color:#3d3223;font-style:italic;}',
            '.b06s-doodle{display:block;width:100%;height:auto;margin-top:7px;border-radius:13px;border:1px solid rgba(74,57,33,.16);background:#fff;}',
            '</style>',
            '<div class="b06s-head">',
            '<div>',
            '<div class="b06s-meta">2006 választások, USA</div>',
            '<h3 class="b06s-title">Szavazólap</h3>',
            '</div>',
            '<div class="b06s-year">2006</div>',
            '</div>',
            '<div class="b06s-list">',
            optionHtml,
            '</div>',
            extrasHtml,
            '</div>',
            '[/html]'
        ].join("\n");
    }

    function generateCode(){
        const data = getBallotData();

        if(!data){
            alert("Előbb válassz egy jelöltet.");
            return;
        }

        output.value = buildGeneratedCode(data);
    }

    function resetBallot(){
        selectedOption = null;
        comment.value = "";
        output.value = "";

        options.forEach(function(item){
            item.classList.remove("is-selected");
            item.querySelector(".b06-mark").textContent = "";
        });

        clearCanvas();
    }

    options.forEach(function(option){
        option.addEventListener("click",function(){
            selectOption(option);
        });
    });

    canvas.addEventListener("pointerdown",startDrawing);
    canvas.addEventListener("pointermove",draw);
    window.addEventListener("pointerup",stopDrawing);
    window.addEventListener("pointercancel",stopDrawing);

    clearCanvasButton.addEventListener("click",clearCanvas);
    generateButton.addEventListener("click",generateCode);
    resetButton.addEventListener("click",resetBallot);

    window.addEventListener("resize",function(){
        setupCanvas(true);
    });

    setupCanvas(false);
})();