KARAKTERKONSTELLÁCIÓ – HASZNÁLAT
================================

FÁJLOK
------
index.html       – a felület váza
styles.css       – teljes megjelenés és animációk
app.js           – carousel, szűrés és adatlap működése
characters.json  – itt kell szerkeszteni a karaktereket
images/          – ide kerülhetnek a karakterképek

FONTOS
------
A külső oldal háttere teljesen átlátszó. Csak a megnyíló adatlapnak van saját,
áttetsző panelje.

A felület alapállapotban körülbelül 284 px magas. A részletes adatlap ráúszik a
carouselre, ezért megnyitáskor sem növeli meg jelentősen az iframe méretét.

KARAKTER HOZZÁADÁSA
-------------------
A characters.json fájlban másolj le egy teljes {...} blokkot, és írd át az adatokat.
Az "era" értéke csak az alábbiak egyike legyen:

newgen   – az elmúlt két évben létrehozott karakter
oldgen   – nagyon régi karakter
retired  – leadott / futottak még karakter

Ha valamelyik link nem létezik, írj null értéket:

"treasure": null

KÉPEK
-----
Helyi kép:
"image": "images/karakter-neve.jpg"

Külső kép:
"image": "https://pelda.hu/kep.jpg"

IFRAME PÉLDA
------------
<iframe
  src="https://SAJAT-CIMED/index.html"
  width="100%"
  height="300"
  frameborder="0"
  scrolling="no"
  style="display:block;background:transparent;border:0;overflow:hidden;"
></iframe>

VEZÉRLÉS
--------
– portréra kattintás: adatlap megnyitása
– bal/jobb nyíl vagy A/D: karakterváltás
– egérgörgő a portrésoron: karakterváltás
– Enter: aktuális karakter adatlapja
– Escape vagy ×: adatlap bezárása
– mobilon a portrésor oldalra húzható

SZÍNEK
------
A teljes paletta a styles.css tetején, a :root blokkban módosítható:

--wine: #7b3b4b;
--mist: #a8bbbf;

Nincs karakterenkénti rikító színváltás; az egész felület egységes marad.
