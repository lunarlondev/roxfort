# RPG családfa – publikus nézet + whitelistes Firebase szerkesztés

GitHub Pages-re feltölthető, sötét tónusú családfa szerepjátékos kampányokhoz. A v3.6 célja: **külsők olvashassák / nézhessék a családfát**, de **szerkeszteni csak az általad megadott Google-fiókok tudjanak**.

## Mit tud?

- Publikus olvasó mód: a családfa külsők számára megnyitható, nézhető, olvasható.
- Szerkesztői mód csak Google-belépés után, whitelistes e-mail címmel.
- Oldalbetöltéskor automatikus Firebase / Firestore betöltés a `trees/main` dokumentumból.
- A szerkesztőpanel, JSON betöltés/mentés és Auto layout csak szerkesztőnek látszik.
- Firestore Rules védi a tényleges írást: olvasás publikus, írás csak engedélyezett e-maileknek.
- Sötét, szürkés-fekete vizuális téma.
- Portré-fókuszú karakterkártyák nagy képfelülettel.
- Egérhúzással mozgatható családfa nézet az üres háttéren.
- Egérgörgős nagyítás/kicsinyítés a családfa-vásznon, egérmutató körüli fókuszponttal.
- Kártyák húzása és kézi pozíciómentése szerkesztő módban.
- Kapcsolati vonalak egyedi stílusa: szín, vastagság, solid/dashed/dotted/longdash minta.
- Kapcsolati státuszok: `házas`, `partner`, `elvált`, `özvegy`.
- Fa-megjegyzések / cetlik konkrét ágakhoz vagy területekhez.
- Timeline oldal évekre bontva.
- JSON import/export és PNG export.

## Legfontosabb fájlok

```text
index.html
styles.css
app.js
firebase-config.js
firestore.rules
data/family.json
```

A te Firebase projekted configja már a `firebase-config.js` fájlban van. A szerkesztők listáját neked kell kitölteni.

## Szerkesztők beállítása

Két helyen kell ugyanazokat az e-mail címeket megadni.

### 1. `firebase-config.js`

Itt a felület tudja, kinek mutassa a szerkesztőpanelt:

```js
export const editorEmails = [
  "sajat.email@gmail.com",
  "masik.szerkeszto@gmail.com"
];
```

### 2. `firestore.rules`

Itt a Firebase védi az adatbázist. Ez a fontosabb, mert ezt nem lehet böngészőből megkerülni:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isEditor() {
      return request.auth != null
        && request.auth.token.email in [
          "sajat.email@gmail.com",
          "masik.szerkeszto@gmail.com"
        ];
    }

    match /trees/{treeId} {
      allow read: if true;
      allow create, update, delete: if isEditor();
    }
  }
}
```

Ezt a Firebase Console-ban kell bemásolni:

```text
Firestore Database → Rules → Publish
```

## Publikus oldal működése

Külső látogató:

```text
Megnyitja az oldalt
→ automatikusan betöltődik a Firestore trees/main dokumentum
→ látja a családfát és a timeline-t
→ tud zoomolni, mozogni, olvasni
→ nem lát szerkesztőpanelt
```

Szerkesztő:

```text
Megnyitja az oldalt
→ Szerkesztői belépés
→ Google-fiók kiválasztása
→ ha az e-mail szerepel az editorEmails listában, megjelenik a szerkesztőpanel
→ Felhő mentés gombbal publikálja a módosítást
```

Ha valaki belép Google-lal, de nincs benne az `editorEmails` listában, akkor továbbra is néző marad.

## GitHub Pages publikálás

1. Csomagold ki a ZIP-et.
2. Töltsd fel a fájlokat a GitHub repositoryba.
3. GitHubon: **Settings → Pages**.
4. Source: `Deploy from a branch`.
5. Branch: `main`, folder: `/root`.
6. A kapott oldal például ilyen lesz:

```text
https://felhasznalonev.github.io/repo-nev/
```

7. Firebase Console-ban add hozzá az authorized domainhez:

```text
Authentication → Settings → Authorized domains → Add domain
```

Csak a domaint írd be, például:

```text
felhasznalonev.github.io
```

## Firebase alapbeállítások

Firebase Console-ban legyen bekapcsolva:

```text
Authentication → Sign-in method → Google → Enable
Firestore Database → Data
Firestore Database → Rules
```

Az adat helye:

```text
Firestore Database → Data → trees → main
```

A `firebase-config.js` ezt használja:

```js
export const firestorePath = "trees/main";
export const authEnabled = true;
export const autoLoadFromFirebase = true;
```

## Adatmodell röviden

A személyek a `people` tömbben vannak:

```json
{
  "id": "lyra",
  "name": "Lyra Varryn",
  "maidenName": "née Thorn",
  "gender": "female",
  "birth": { "year": 1992, "month": 11, "day": 2, "place": "Erdővidék" },
  "death": { "year": "", "month": "", "day": "" },
  "image": "",
  "color": "#6f9289",
  "notes": "Erdővidéki követ.",
  "position": { "x": 320, "y": 180 },
  "parents": []
}
```

A partneri/házastársi kapcsolatok külön vannak:

```json
{
  "id": "rel-seren-lyra",
  "type": "partnership",
  "personA": "seren",
  "personB": "lyra",
  "status": "married",
  "notes": "Politikai házasság.",
  "linkStyle": { "color": "#e6e6ee", "width": 3.2, "pattern": "solid" }
}
```

Státuszértékek:

```text
married   = házas
partner   = partner
divorced  = elvált
widowed   = özvegy
```

A szülő–gyermek vonalak egyedi stílusai a `linkStyles.parent` objektumban vannak. A kulcs formája: `szuloId-->gyerekId`.

## Biztonsági megjegyzés

A kliensoldali `editorEmails` csak kényelmi UI-szűrés. A valódi védelem a `firestore.rules`, mert az dönti el, ki írhat az adatbázisba.


## Publikus nézet hibaelhárítás

Ha privát ablakban üres a családfa, akkor az oldal nem tudja olvasni a `trees/main` Firestore dokumentumot. Ellenőrizd:

1. Firebase Console → Firestore Database → Data alatt létezik-e: `trees / main`.
2. Firebase Console → Firestore Database → Rules alatt a `/trees/{treeId}` blokkban ez szerepel-e: `allow read: if true;`.
3. A GitHubra feltöltött `firebase-config.js` fájlban ez van-e: `export const firestorePath = "trees/main";`.
4. Az oldalon a státuszsor mit ír: a v3.6.1 már publikus módban is kiírja, ha jogosultsági vagy útvonalhiba van.

