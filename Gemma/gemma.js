const drinks=[
  {name:"Lángnyelv whiskey",
  html:`
    <div class="glass lowball fire fireWhiskeyGlass fireIce">
      <div class="liquid"></div>
    </div>`},
  {name:"Superior red",html:`
    <div class="wineWrap">
      <div class="glass wine red">
  <div class="liquid"></div>
</div>
      <div class="wineStem"></div>
      <div class="wineBase"></div>
    </div>`},
  {
  name:"Guinness",
  html:`
    <div class="glass mug guinness">
      <div class="beer">
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
      </div>
      <div class="foam"></div>
    </div>`
},
  {
  name:"Vajsör",
  html:`
    <div class="glass mug butterscotch">
      <div class="beer">
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
      </div>
      <div class="foam"></div>
    </div>`
},
  {
  name:"Mézbor",
  html:`
    <div class="wineWrap">
      <div class="glass wine mead">
        <div class="liquid"></div>
      </div>
      <div class="wineStem"></div>
      <div class="wineBase"></div>
    </div>`
},
  {
  name:"Jenkins-féle kerítésszaggató",
  html:`
    <div class="glass shot jenkins">
      <div class="liquid"></div>
    </div>`
},
  {
  name:"Langyos sör",
  html:`
    <div class="glass mug flatbeer">
      <div class="beer">
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
      </div>
    </div>`
},
  {
  name:"Törlés koktél",
  html:`
    <div class="glass shot erase">
      <div class="liquid"></div>
    </div>`
},
  {
  name:"Stohl-féle repohár",
  html:`
    <div class="glass cup stohl">
      <div class="liquid"></div>
    </div>`
}
];

const shelf=document.getElementById("barShelf");
drinks.forEach(d=>{
  const el=document.createElement("div");
  el.className="drinkCard";
  el.innerHTML=d.html+`<div class="drinkName">${d.name}</div>`;
  shelf.appendChild(el);
});



const relationData={
  friend:{
    text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Barátok között nincs szükség sok szóra, de a bizalom itt alapvetés.",
    image:"https://via.placeholder.com/200x200/2a2a2a/ffffff?text=Friend"
  },
  enemy:{
    text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Az ellenség az, akire figyelsz, mert egyszer már átlépett egy határt.",
    image:"https://via.placeholder.com/200x200/1a1a1a/ff5555?text=Enemy"
  },
  love:{
    text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. A szerelem veszélyes terep, ahol minden döntés nyomot hagy.",
    image:"https://via.placeholder.com/200x200/2a1a2a/dd88ff?text=Love"
  },
  other:{
    text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Van, akit nem tudsz hova tenni – talán jobb is így.",
    image:"https://via.placeholder.com/200x200/222222/aaaaaa?text=Other"
  }
};

const tabs=document.querySelectorAll(".gemmaTabs button");
const box=document.getElementById("relationBox");

tabs.forEach(btn=>{
  btn.addEventListener("click",()=>{
    tabs.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    const key=btn.dataset.cat;
    const data=relationData[key];

    box.classList.remove("active");

    setTimeout(()=>{
      box.innerHTML=`
        <div class="relationImage" style="background-image:url('${data.image}')"></div>
        <div class="relationText">${data.text}</div>
      `;
      box.classList.add("active");
    },10);
  });
});
