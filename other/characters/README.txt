KARAKTERARCHÍVUM – KONSTELLÁCIÓS NÉZET
=======================================

Fájlok:
- index.html
- styles.css
- app.js
- characters.json
- images/...

1. KARAKTEREK
-------------
A characters.json egy karaktere:

{
  "id": "001",
  "name": "Elegy Dreadmoor",
  "image": "images/elegy.jpg",
  "groups": ["Sötét Varázsló"],
  "era": "newgen",
  "stage": "adult",
  "links": {
    "profile": "https://...",
    "history": "https://...",
    "relations": null,
    "treasure": null,
    "games": null
  }
}

Az adatpanel csak ezt mutatja:
- kép
- név
- csoportok
- létező linkek

A null vagy üres linkek egyáltalán nem jelennek meg.

2. SZŰRŐK
---------
era:
- "newgen"
- "oldgen"
- "retired"

stage:
- "hogwarts" = Roxfortos diák
- "higher"   = felsőoktatásban tanul
- "adult"    = felnőtt / nem diák karakter

A szűrők egymástól független, egykattintásos nézetek.
Minden szűrőváltáskor a látható karakterek sorrendje és a konstelláció
pozíciói újra randomizálódnak.

3. KONSTELLÁCIÓ
---------------
A karakterek kör alakú portréként jelennek meg egy 550 px-nél nem szélesebb
csillagmezőben. A rendszer minden kirajzoláskor új pozíciókat választ,
majd a közeli pontokat csillagkép-vonalakkal összeköti.

A portrék finoman lebegnek. Karakterre kattintva az alsó, fix helyű adatpanel
animációval frissül. Nincs carousel és nincs felugró ablak.

4. HELYI MEGNYITÁS
------------------
A JSON betöltéséhez webszerver szükséges. A mappában például:

python -m http.server 8000

Majd:
http://localhost:8000

5. IFRAME
---------
Példa:

<iframe
  src="https://SAJAT-CIMED/index.html"
  title="Karakterarchívum"
  width="100%"
  height="560"
  loading="lazy"
  style="border:0; background:transparent;"
  allowtransparency="true">
</iframe>

Az app postMessage-ben továbbra is elküldi a tartalom aktuális magasságát:
type: "character-roster-height"
