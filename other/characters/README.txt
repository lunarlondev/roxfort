KARAKTERARCHÍVUM – KONSTELLÁCIÓS NÉZET v6
==========================================

Fájlok:
- index.html
- styles.css
- app.js
- characters.json
- images/... (a meglévő saját képmappád)

ÚJDONSÁGOK
----------
- Erősebben látható valódi konstellációs vonalak.
- Hover/fókusz esetén az adott karakterhez tartozó vonalak felizzanak, a többi elhalványul.
- Többrétegű, lassan mozgó csillagtér.
- Halvány csillagászati körívek és segédvonalak a háttérben.
- Ritka, finom fénycsík/hullócsillag animáció.
- A portrék mérete enyhén randomizált, ezért természetesebb a konstelláció.
- Hoverkor két apró fénypont kering a portré körül.
- A groups mezők klasszikus tooltip helyett csillagászati annotációként jelennek meg,
  a portréhoz kapcsolódó kis vezérvonallal.
- A szűrősorok külön, halvány kategórianévvel jelennek meg.
- Az aktív szűrőket kis csillag és finom glow emeli ki.

SZŰRŐK
------
A szűrők soronként egy-egy dimenziót jelentenek, és a külön sorok kombinálhatók:
- Generáció: Mind / Oldgen / Newgen / Futottak még
- Tanulmányok: Diákok / Egyetemisták / Egyéb
- Iskola: Roxfort / Ilvermorny / Beauxbatons / Egyéb
- Roxforti ház: Griffendél / Hollóhát / Hugrabug / Mardekár
- Nem: Férfi / Nő / Egyéb

Alapállapot: Newgen.
Egy aktív gombra újra kattintva az adott szűrés kikapcsolható.
A Mind csak a generáció szűrését törli.

KARAKTER JSON
-------------
A hoveren megjelenő rövid információk továbbra is a groups tömbből jönnek.
A profilra kattintva a links.profile nyílik meg új böngészőfülön.

A szűréshez használt kulcsok például:
  "era": "newgen",
  "stage": "student",
  "schools": ["hogwarts"],
  "houses": ["gryffindor"],
  "gender": "female"

Megengedett fő értékek:
- era: newgen / oldgen / retired
- stage: student / higher / adult
- schools: hogwarts / ilvermorny / beauxbatons / other
- houses: gryffindor / ravenclaw / hufflepuff / slytherin
- gender: male / female / other

IFRAME
------
Példa:

<iframe
  src="https://SAJAT-CIMED/index.html"
  title="Karakterarchívum"
  width="100%"
  height="610"
  loading="lazy"
  style="border:0; background:transparent;"
  allowtransparency="true">
</iframe>

Az app postMessage-ben elküldi az aktuális magasságot:
type: "character-roster-height"


6. MOZGÓ CSILLAGHÁTTÉR
-----------------------
A csillagmező canvas-alapú, perspektivikus 3D pontfelhő. A háttér lassan forog,
így a pontok mérete és fényereje a mélység szerint változik. A karaktereket
összekötő SVG-konstellációs vonalak ettől függetlenül a canvas fölött maradnak.
A prefers-reduced-motion rendszerbeállítást a háttér is figyelembe veszi.
