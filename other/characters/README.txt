KARAKTERARCHÍVUM – KONSTELLÁCIÓS NÉZET
=======================================

Fájlok:
- index.html
- styles.css
- app.js
- characters.json
- images/...

1. SZŰRŐK
----------
A szűrők öt külön sorban jelennek meg, és a különböző sorok egymással kombinálhatók.
Alapállapotban a Newgen aktív.

1. sor – generáció:
- Mind
- Oldgen
- Newgen
- Futottak még

2. sor – tanulmányi státusz (`stage`):
- `student` = Diákok
- `higher` = Egyetemisták
- `adult` = Egyéb

3. sor – iskola (`schools`):
- `hogwarts` = Roxfort
- `ilvermorny` = Ilvermorny
- `beauxbatons` = Beauxbatons
- `other` = Egyéb

4. sor – roxforti ház (`houses`):
- `gryffindor` = Griffendél
- `ravenclaw` = Hollóhát
- `hufflepuff` = Hugrabug
- `slytherin` = Mardekár

5. sor – nem (`gender`):
- `male` = Férfi
- `female` = Nő
- `other` = Egyéb

Egy soron belül egyszerre legfeljebb egy szűrő aktív. Az aktív gombra újra kattintva
az adott sor szűrése kikapcsolható. A „Mind” kizárólag a generációs szűrést oldja fel.

Példa: Newgen + Egyetemisták + Ilvermorny + Nő egyszerre is használható.

2. KARAKTEREK JSON-JA
----------------------
Példa:

{
  "id": "001",
  "name": "Elegy Dreadmoor",
  "image": "images/elegy.jpg",
  "groups": ["Sötét Varázsló", "Aranyvérű"],
  "era": "newgen",
  "stage": "higher",
  "schools": ["other"],
  "houses": [],
  "gender": "female",
  "links": {
    "profile": "https://..."
  }
}

A `schools` és `houses` tömb, tehát egy karakter több releváns kategóriához is
tartozhat. Például egy Roxfortot és más intézményt is megjárt karakter:

"schools": ["hogwarts", "other"]

A `groups` továbbra is csak a hover tooltip rövid információit tartalmazza;
a szűrés nem ebből próbál következtetni.

3. KONSTELLÁCIÓ
---------------
A karakterek random sorrendben és random csillagképben jelennek meg. Minden
szűrőváltás újrarendezi őket. A portrék finoman lebegnek.

Hover / billentyűzetes fókusz:
- megjelennek a `groups` elemei

Kattintás:
- a `links.profile` új böngészőfülön nyílik meg

4. HELYI MEGNYITÁS
------------------
A JSON betöltéséhez webszerver szükséges. A mappában például:

python -m http.server 8000

Majd:
http://localhost:8000

5. IFRAME
---------
A több szűrősor miatt érdemes nagyobb magasságot adni:

<iframe
  src="https://SAJAT-CIMED/index.html"
  title="Karakterarchívum"
  width="100%"
  height="650"
  loading="lazy"
  style="border:0; background:transparent;"
  allowtransparency="true">
</iframe>

Az app postMessage-ben továbbra is elküldi az aktuális tartalommagasságot:
type: "character-roster-height"
