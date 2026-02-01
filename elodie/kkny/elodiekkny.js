const btn = document.getElementById("flowerBtn");
const titleInput = document.getElementById("msgTitle");
const bodyInput = document.getElementById("msgBody");
const output = document.getElementById("outputCode");

btn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title && !body) return;

  const bodyFormatted = body.replace(/\n/g, "<br>");

  output.value =
`[center][html]
<div style="max-width:350px;border:1px solid #96769c;border-radius:16px;overflow:hidden;font-family:Georgia,serif;">
  <div style="padding:16px;
              background-image:url('https://i.imgur.com/jEhl9X6.jpeg');
              background-size:320px;
              background-repeat:repeat;">
    <div style="background:rgba(255,255,255,0.85);
                border-radius:12px;
                padding:14px;">
      ${title ? `<div style="color:#96769c;font-size:15px;text-align:center;margin-bottom:10px;letter-spacing:1px;">${title}</div>` : ``}
      <div style="color:#333;font-size:13px;line-height:1.6;text-align:justify;">
        ${bodyFormatted}
      </div>
    </div>
  </div>
</div>
[/html][/center]`;
});
