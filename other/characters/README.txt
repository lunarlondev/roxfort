KARAKTERARCHÍVUM – HASZNÁLAT
============================

Fájlok:
- index.html
- styles.css
- app.js
- characters.json
- images/placeholder-01.svg stb.

1. KARAKTEREK SZERKESZTÉSE
--------------------------
Minden karakter a characters.json fájlban található.
Egy új karakterhez másolj le egy teljes { ... } blokkot, majd írd át az adatokat.

Kategóriák:
- "oldgen"  = nagyon régi karakter
- "newgen"  = az elmúlt két évben készült / aktív új generáció
- "retired" = leadott, lezárt karakter („futottak még”)

Hiányzó link:
A hiányzó link értéke legyen null, például:
"treasure": null

Képek:
Tedd a képeket az images mappába, majd például:
"image": "images/elegy.jpg"

Egyedi szín:
Minden karakter saját kiemelőszínt kaphat:
"accent": "#a8bbbf"

2. HELYI MEGNYITÁS
------------------
A JSON betöltése miatt a teljes működéshez webszerver kell.
Egyszerű lehetőség Python esetén a mappában:

python -m http.server 8000

Ezután:
http://localhost:8000

Sima dupla kattintásnál a böngésző biztonsági szabályai miatt előfordulhat,
hogy a characters.json nem töltődik be; ilyenkor a beépített minta jelenik meg.

3. IFRAME BEILLESZTÉS
---------------------
A fájlokat töltsd fel például GitHub Pagesre vagy saját tárhelyre.
Ezután a fórumon használható minta:

<iframe
  src="https://SAJAT-CIMED/index.html"
  title="Karakterarchívum"
  width="100%"
  height="780"
  loading="lazy"
  style="border:0; background:transparent;"
  allowtransparency="true">
</iframe>

Mobilon több hely kellhet. Ha a fórum engedi, 900–980 px iframe-magasság kényelmesebb.

4. VEZÉRLÉS
-----------
- bal/jobb nyíl
- A / D billentyű
- egérgörgő a kártyán
- mobilon vízszintes húzás
- oldalsó vagy felső karakterindex
- kategóriaszűrők

5. ÁTLÁTSZÓ HÁTTÉR
------------------
A html, body és a külső alkalmazás háttere teljesen átlátszó.
Csak a karakterkártyák és vezérlőpanelek kapnak saját, áttetsző felületet.
