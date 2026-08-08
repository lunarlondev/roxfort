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
  "groups": [
    "Sötét Varázsló",
    "rövid fontos információ",
    "másik rövid információ"
  ],
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

A konstelláció nézetben jelenleg kizárólag a links.profile mező használatos.
Karakterre kattintva ez a profil-link nyílik meg új böngészőfülön.

A groups egy lista rövid, fontos információkkal. Ezek a karakter portréja fölé
húzva jelennek meg egy kis tooltipben. A lista tetszőleges számú rövid elemet
tartalmazhat.

Példa:
"groups": ["Mardekár", "16 éves", "született legilimentor"]

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
A karakterek kör alakú portréként jelennek meg egy legfeljebb 550 px széles
csillagmezőben. A rendszer minden kirajzoláskor új pozíciókat választ, majd a
közeli pontokat csillagkép-vonalakkal összeköti.

A portrék finoman lebegnek.

Hover / billentyűzetes fókusz:
- megjelennek a character.groups elemei

Kattintás:
- a character.links.profile új böngészőfülön nyílik meg

Nincs külön adatlap, alsó profilpanel vagy felugró ablak.

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
  height="440"
  loading="lazy"
  style="border:0; background:transparent;"
  allowtransparency="true">
</iframe>

Az app postMessage-ben továbbra is elküldi a tartalom aktuális magasságát:
type: "character-roster-height"
