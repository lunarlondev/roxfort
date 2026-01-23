function normalizeDate(date) {
  if (!date) return "";
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
	text: '<a href="https://www.roxfort.frpg.hu/index.php/topic,20961.msg128535.html#msg128535">Felkészülés a bevonulásra (aka zugivás 1.0)</a>',
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
      },
{
        characters: ["Solace Barbon", "Anne-Rose Tuffin"],
        location: "Nagyterem",
        text: "Bevonulás a bálra",
        date: "18:15",
        imgs: [
          "./images/solace.jpg",
          "./images/annie.jpg"
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
	text: '<a href="https://www.roxfort.frpg.hu/index.php/topic,20961.msg128490.html#msg128490">Közszeméremsértés, belépés megtagadása a bálra</a>',
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
        text: '<a href="https://www.roxfort.frpg.hu/index.php/topic,20957.msg128592.html#msg128592">Vacsora</a>',
        date: "19:30–20:00",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg"
        ]
      },
      {
        characters: ["Anne-Rose Tuffin", "Solace Barbon"],
        location: "Svédasztalok",
        text: "Vacsora",
        date: "19:30–20:00",
        imgs: [
          "./images/annie.jpg",
          "./images/solace.jpg"
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
        text: "<a href=https://www.roxfort.frpg.hu/index.php/topic,20956.msg128597.html#msg128597>Koccintás</a>",
        date: "20:00–20:30",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg",
          "./images/solace.jpg",
          "./images/annie.jpg"
        ]
      },
{
        characters: ["Varvara Chernov", "Vianne M. Gardner"],
        location: "Nagyterem",
        text: "Visszatérés outfit csere után",
        date: "20:00",
        imgs: [
          "./images/varvara.jpg",
          "./images/vianne.jpg"
        ]
      },
{
        characters: ["Varvara Chernov", "Vianne M. Gardner", "Vale Bate"],
        location: "Nagyterem",
        text: "Ünneplés, koccintás",
        date: "20:05-20:30",
        imgs: [
          "./images/varvara.jpg",
          "./images/vianne.jpg",
          "./images/vale.jpg"
        ]
      },

    ]
  },

  {
    time: "20:30",
    main: { title: "A hat bajnok nyitótánca", color: "color-champions" },
    events: [
      {
        characters: ["Gemma Jenkins", "Connor O'Hara"],
        location: "Tánctér",
        text: '<a href="https://www.roxfort.frpg.hu/index.php/topic,20955.msg128634.html#msg128634">Nyitótánc</a>',
        date: "20:30–21:00",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg"
        ]
      },
      {
        characters: ["Solace Barbon", "Anne-Rose Tuffin"],
        location: "Tánctér",
        text: "Nyitótánc",
        date: "20:30–21:00",
        imgs: [
          "./images/solace.jpg",
          "./images/annie.jpg"
        ]
      },
      {
        characters: ["Malachi Maddock"],
        location: "Padok, asztalok",
        text: "<a href=\"https://www.roxfort.frpg.hu/index.php/topic,20956.msg128646.html#msg128646\" target=\"_blank\">Búcsú</a>",
        date: "21:00",
        imgs: [
          "./images/mal.jpg",
        ]
      },
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
        characters: ["Daphné d'Aboville", "Anne-Rose Tuffin"],
        location: "Tánctér",
        text: "Annie és Daphné tánca",
        date: "21:00–21:15",
        imgs: [
          "./images/daph.jpg",
          "./images/annie.jpg"
        ]
      },
      {
        characters: ["Heranoush Fletcher", "Vivien M. Smithe"],
        location: "Tánctér",
        text: '<a href="https://www.roxfort.frpg.hu/index.php/topic,20955.msg128534.html#msg128534">Hera és Viv tánca</a>',
        date: "21:30–21:45",
        imgs: [
          "./images/hera.jpg",
          "./images/viv.jpg"
        ]
      },
      {
        characters: ["Daphné d'Aboville", "Miguel Fuentes"],
        location: "Tánctér",
        text: "Miguel és Daphné tánca",
        date: "21:15–21:30",
        imgs: [
          "./images/daph.jpg",
          "./images/miguel.jpg"
        ]
      },
      {
        characters: ["Solace Barbon", "Gwendolyn P. Jadisland"],
        location: "Padok, asztalok",
        text: "<a href=\"https://www.roxfort.frpg.hu/index.php/topic,20956.msg128567.html#msg128567\" target=\"_blank\">Interjú</a>",
        date: "21:30–22:00",
        imgs: [
          "./images/solace.jpg",
          "./images/gwen.jpg"
        ]
      },
      {
        characters: ["Daphné d'Aboville", "Elodie Roethlisberger"],
        location: "Tánctér",
        text: "Elodie és Daphné tánca",
        date: "21:30–21:45",
        imgs: [
          "./images/daph.jpg",
          "./images/elod.jpg"
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
        characters: ["Daphné d'Aboville", "Rokuro Ishida"],
        location: "Tánctér",
        text: "Rokuro és Daphné tánca",
        date: "21:45–21:55",
        imgs: [
          "./images/daph.jpg",
          "./images/roku.jpg"
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
      },
      {
        characters: ["Anne-Rose Tuffin", "Solace Barbon"],
        location: "Tánctér",
        text: "Tánc az interjú után",
        date: "21:45–21:55",
        imgs: [
          "./images/annie.jpg",
          "./images/solace.jpg"
        ]
      },
    ]
  },

  /* ----- KONCERT I. RÉSZ ----- */

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
                text: '<a href="https://www.roxfort.frpg.hu/index.php/topic,20958.msg128564.html#msg128564">Viv being Viv</a>',
        date: "22:30",
        imgs: [
          "./images/viv.jpg",
          "./images/tetsu.jpg"
        ]
      },
      {
        characters: ["Daphné d'Aboville", "María Teresa Salamanca"],
        location: "Udvar",
	text: '<a href="https://www.roxfort.frpg.hu/index.php/topic,20960.msg128541.html#msg128541">Udvarias small talk</a>',
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
      }
    ]
  },

  /* ----- KONCERT II. RÉSZ ----- */

  {
    time: "23:00",
    main: { title: "Koncert II. rész", color: "color-concert2" },
    events: [
      {
        characters: ["Gemma Jenkins", "Connor O'Hara"],
        location: "Tánctér",
        text: "Este baráti lezárása",
        date: "23:00",
        imgs: [
          "./images/gemma.png",
          "./images/connor.jpg"
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
      },
      {
        characters: ["Solace Barbon", "Vale Bate"],
        location: "Udvar",
        text: "Segítségfelajánlás",
        date: "23:30",
        imgs: [
          "./images/solace.jpg",
          "./images/vale.jpg"
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
        text: "<a href=\"https://www.roxfort.frpg.hu/index.php/topic,20958.msg128493.html#msg128493\" target=\"_blank\">Roku megbántja Daphnét. Daphné elviharzik.</a>",
        date: "23:50–00:00",
        imgs: [
          "./images/daph.jpg",
          "./images/roku.jpg"
        ]
      }
    ]
  },

  {
    time: "24:00",
    main: { title: "Zárás", color: "color-close" },
    events: [
      {
        characters: ["Daphné d'Aboville", "Elodie Roethlisberger", "Fluffy"],
        location: "Beauxbatons lányháló",
        text: '<a href="https://www.roxfort.frpg.hu/index.php/topic,20676.msg128624/topicseen.html#msg128624">Lelkizés, tinimagazinok bújása</a>',
        date: "00:14",
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
============================== */

/* A DOM-, render-, filter- és hover-kód
   VÁLTOZATLAN marad a mostani verziódból */


/* ==============================
   DOM + LOGIKA
============================== */

const timelineEl = document.getElementById("timeline");
const charFilter = document.getElementById("charFilter");
const locFilter = document.getElementById("locFilter");

/* FILTERS */

function buildFilters() {
  const chars = new Set();
  const locs = new Set();

  timelineData.forEach(block => {
    block.events.forEach(e => {
      e.characters.forEach(c => chars.add(c));
      locs.add(e.location);
    });
  });

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

/* RENDER */

function renderTimeline() {
  timelineEl.innerHTML = "";
  const fChar = charFilter.value;
  const fLoc = locFilter.value;

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
          `<img src="${src}" data-char="${e.characters[i]}">`
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

/* INIT */

buildFilters();
charFilter.addEventListener("change", renderTimeline);
locFilter.addEventListener("change", renderTimeline);
renderTimeline();

/* HOVER FOCUS */

document.addEventListener("mouseover", e => {
  const img = e.target.closest("img[data-char]");
  if (!img) return;

  const char = img.dataset.char;
  document.body.classList.add("char-focus");

  document.querySelectorAll(".char-event").forEach(ev => {
    ev.classList.toggle(
      "focused",
      ev.dataset.characters.includes(char)
    );
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



// biztosítsuk, hogy minden timeline-link új lapon nyíljon
document.addEventListener("click", e => {
  const a = e.target.closest(".char-info a");
  if (!a) return;
  a.setAttribute("target", "_blank");
  a.setAttribute("rel", "noopener noreferrer");
});
