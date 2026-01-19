function normalizeDate(date) {
  if (!date) return "";

  // "00:00-tól" → "00:00"
  return date
    .replace(/-tól$/i, "")
    .replace(/\s*–\s*/g, "–")
    .trim();
}



/* ==============================
   YULE TIMELINE – DATA
============================== */

const timelineData = [

  /* ----- BÁL ELŐTT ----- */

  {
    time: "17:30",
    main: { title: "Felkészülés", color: "color-open" },
    events: [
      {
        characters: ["Gemma Jenkins", "Connor O'Hara"],
        location: "Folyosók",
        text: "Felkészülés a bevonulásra (aka zugivás 1.0)",
        date: "17:30–17:45",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg"
        ]
      },
      {
        characters: ["Heranoush Fletcher", "Vivien M. Smithe", "Chikara Tetsuya"],
        location: "Folyosók",
        text: "Tetsu csillagvirágot ad",
        date: "17:45–18:00",
        imgs: [
          "./images/hera.jpg",
          "./images/viv.jpg",
          "./images/tetsu.jpg"
        ]
      }
    ]
  },

  /* ----- FŐ PROGRAM ----- */

  {
    time: "18:00",
    main: { title: "Kapunyitás", color: "color-open" },
    events: [
      {
        characters: ["Gemma Jenkins", "Connor O'Hara"],
        location: "Nagyterem",
        text: "Bevonulás a bálra",
        date: "18:00",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg"
        ]
      }
    ]
  },

  {
    time: "19:00",
    main: { title: "Köszöntő & a bál megnyitása", color: "color-welcome" },
    events: [
      {
        characters: ["Vianne M. Gardner", "Varvara Chernov"],
        location: "Folyosók",
        text: "Közszeméremsértés, belépés megtagadása a bálra",
        date: "19:00",
        imgs: [
          "./images/vianne.jpg",
          "./images/varvara.jpg"
        ]
      }
    ]
  },

  {
    time: "19:30",
    main: { title: "Lakoma nyitása", color: "color-feast" },
    events: [
      {
        characters: ["Gemma Jenkins", "Connor O'Hara"],
        location: "Svédasztalok",
        text: "Vacsora",
        date: "19:30–20:00",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg"
        ]
      },
      {
        characters: [
          "Gemma Jenkins",
          "Connor O'Hara",
          "Solace Barbon",
          "Anne-Rose Tuffin"
        ],
        location: "Padok, asztalok",
        text: "Koccintás",
        date: "20:00–20:30",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg",
          "./images/solace.jpg",
          "./images/annie.jpg"
        ]
      }
    ]
  },

  {
    time: "20:30",
    main: { title: "A hat bajnok nyitótánca", color: "color-champions" },
    events: [
      {
        characters: [
          "Gemma Jenkins",
          "Connor O'Hara",
        ],
        location: "Tánctér",
        text: "Nyitótánc",
        date: "20:30–21:00",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg",
        ]
      },
 {
        characters: [
          "Solace Barbon",
          "Anne-Rose Tuffin"
        ],
        location: "Tánctér",
        text: "Nyitótánc",
        date: "20:30–21:00",
        imgs: [
          "./images/solace.jpg",
          "./images/annie.jpg"
        ]
      }
    ]
  },

  {
  time: "21:00",
  main: { title: "Szabad tánc", color: "color-dance" },
  events: [
    {
      characters: ["Gemma Jenkins", "Connor O'Hara"],
      location: "Udvar",
      text: "Pihenés, zugivás 2.0",
      date: "21:00–21:30",
      imgs: [
        "./images/gemma.png",
        "./images/connor.jpg"
      ]
    },
    {
      characters: ["Heranoush Fletcher", "Vivien M. Smithe"],
      location: "Tánctér",
      text: "Hera és Viv tánca",
      date: "21:30–21:45",
      imgs: [
        "./images/hera.jpg",
        "./images/viv.jpg"
      ]
    },
    {
      characters: ["Solace Barbon", "Gwendolyn P. Jadisland"],
      location: "Tánctér",
      text: "Interjú",
      date: "21:30–22:00",
      imgs: [
        "./images/solace.jpg",
        "./images/gwen.jpg"
      ]
    },
    {
      characters: ["Anne-Rose Tuffin", "Ophelia Langley"],
      location: "Tánctér",
      text: "Oph és Annie tánca",
      date: "21:30–21:45",
      imgs: [
        "./images/annie.jpg",
        "./images/oph.png"
      ]
    },
    {
      characters: ["Gemma Jenkins", "Chikara Tetsuya"],
      location: "Udvar",
      text: "Haveri csevegés (és ivás)",
      date: "21:30–22:15",
      imgs: [
        "./images/gemma.png",
        "./images/tetsu.jpg"
      ]
    }
  ]
},


  {
    time: "22:00",
    main: { title: "Koncert I. rész", color: "color-concert1" },
    events: [
      {
        characters: ["Gemma Jenkins", "Connor O'Hara"],
        location: "Tánctér",
        text: "Tánc, koncert élvezése",
        date: "22:15–22:45",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg"
        ]
      },
      {
        characters: ["Vivien M. Smithe", "Chikara Tetsuya"],
        location: "Eldugott, csillagporos kis zug",
        text: "Mély beszélgetés, Viv being Viv",
        date: "22:30",
        imgs: [
          "./images/viv.jpg",
          "./images/tetsu.jpg"
        ]
      }
    ]
  },

  {
  time: "23:00",
  main: { title: "Koncert II. rész", color: "color-concert2" },
  events: [
    {
      characters: ["Daphné d'Aboville", "María Teresa Salamanca"],
      location: "Udvar",
      text: "Passzív-agresszívkodás, Maria genyó",
      date: "22:45–23:00",
      imgs: [
        "./images/daph.jpg",
        "./images/maria.jpg"
      ]
    },
    {
      characters: ["Gemma Jenkins", "Connor O'Hara"],
      location: "Eldugott, csillagporos kis zug",
      text: "Még több zugivás",
      date: "22:45–23:00",
      imgs: [
        "./images/gemma.png",
        "./images/connor.jpg"
      ]
    },


    {
      characters: ["Gemma Jenkins", "Connor O'Hara"],
      location: "Tánctér",
      text: "Este baráti lezárása",
      date: "23:00",
      imgs: [
        "./images/gemma.png",
        "./images/connor.jpg"
      ]
    }
  ]
},



  {
    time: "23:45",
    main: { title: "Yule-pillanat", color: "color-yule" },
    events: [
      {
        characters: ["Daphné d'Aboville", "Rokuro Ishida"],
        location: "Eldugott, csillagporos kis zug",
        text: "Rokuro megbántja Daphnét, Daphné kiosztja és elviharzik",
        date: "23:50–00:00",
        imgs: [
          "./images/daph.jpg",
          "./images/roku.jpg"
        ]
      },
      {
        characters: ["Gemma Jenkins", "Malachi Maddock"],
        location: "Udvar",
        text: "Mardosó bűntudat és mérges zavartság",
        date: "23:15",
        imgs: [
          "./images/gemma.png",
          "./images/mal.jpg"
        ]
      }
    ]
  },

  {
    time: "24:00",
    main: { title: "Zárás", color: "color-close" },
    events: [
      {
        characters: ["Daphné d'Aboville", "Élodie Roethlisberger", "Fluffy"],
        location: "Beauxbatons lányháló",
        text: "Lelkizés, tinimagazinok bújása",
        date: "00:00-tól",
        imgs: [
          "./images/daph.jpg",
          "./images/elod.jpg",
          "./images/fluffy.jpeg"
        ]
      }
    ]
  }
];

/* ==============================
   DOM + LOGIKA
   (EZ ALATTI RÉSZ VÁLTOZATLAN)
============================== */


/* ==============================
   DOM REFERENCES
============================== */

const timelineEl = document.getElementById("timeline");
const charFilter = document.getElementById("charFilter");
const locFilter = document.getElementById("locFilter");

/* ==============================
   FILTER SETUP
============================== */

function buildFilters() {
  if (!charFilter || !locFilter) return;

  const chars = new Set();
  const locs = new Set();

  timelineData.forEach(block => {
    block.events.forEach(e => {
      e.characters.forEach(c => chars.add(c));
      locs.add(e.location);
    });
  });

  while (charFilter.options.length > 1) charFilter.remove(1);
  while (locFilter.options.length > 1) locFilter.remove(1);

  [...chars].sort().forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    charFilter.appendChild(o);
  });

  [...locs].sort().forEach(l => {
    const o = document.createElement("option");
    o.value = l;
    o.textContent = l;
    locFilter.appendChild(o);
  });
}

/* ==============================
   TIMELINE RENDER
============================== */

function renderTimeline() {
  timelineEl.innerHTML = "";

  const fChar = charFilter ? charFilter.value : "";
  const fLoc = locFilter ? locFilter.value : "";

  let lastBlockHadChar = false;

  timelineData.forEach(block => {
    const wrap = document.createElement("div");
    wrap.className = "time-block";

    wrap.innerHTML = `
      <div class="time-label">${block.time}</div>
      <div class="main-event ${block.main.color}">
        ${block.main.title}
      </div>
    `;

    let currentBlockHasChar = false;

    block.events.forEach(e => {
      if (fChar && !e.characters.includes(fChar)) return;
      if (fLoc && e.location !== fLoc) return;

      currentBlockHasChar = true;

      const ce = document.createElement("div");
      ce.className = "char-event";
      ce.dataset.date = normalizeDate(e.date);
      ce.dataset.characters = e.characters.join("|");

     const avatars = e.imgs
       .map((src, i) =>
    `     <img src="${src}" data-char="${e.characters[i]}">`
       )
       .join("");


      ce.innerHTML = `
        <div class="char-avatars">${avatars}</div>
        <div class="char-info">
          <div class="name">${e.characters.join(" & ")}</div>
          <div>${e.text}</div>
          <div class="meta">${e.location}</div>
        </div>
      `;

      wrap.appendChild(ce);
    });

    if (fChar && lastBlockHadChar && currentBlockHasChar) {
      const connector = document.createElement("div");
      connector.className = "char-connector";
      wrap.appendChild(connector);
    }

    lastBlockHadChar = currentBlockHasChar;
    timelineEl.appendChild(wrap);
  });
}

/* ==============================
   INIT
============================== */

buildFilters();
if (charFilter) charFilter.addEventListener("change", renderTimeline);
if (locFilter) locFilter.addEventListener("change", renderTimeline);
renderTimeline();



document.addEventListener("mouseover", e => {
  const img = e.target.closest("img[data-char]");
  if (!img) return;

  const char = img.dataset.char;
  document.body.classList.add("char-focus");

  document.querySelectorAll(".char-event").forEach(ev => {
    const chars = ev.dataset.characters || "";
    ev.classList.toggle("focused", chars.includes(char));
  });
});

document.addEventListener("mouseout", e => {
  if (e.target.closest("img[data-char]")) {
    document.body.classList.remove("char-focus");
    document
      .querySelectorAll(".char-event")
      .forEach(ev => ev.classList.remove("focused"));
  }
});





/* ==============================
   STARFIELD EFFECT
============================== */

const canvas = document.createElement("canvas");
canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = 0;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 1.5 + 0.3,
  s: Math.random() * 0.15 + 0.05
}));

function drawStars() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,.8)";

  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.s;
    if (star.y > h) {
      star.y = 0;
      star.x = Math.random() * w;
    }
  });

  requestAnimationFrame(drawStars);
}

drawStars();
