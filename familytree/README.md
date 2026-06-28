# RPG családfa – HTML/CSS/JS + JSON + opcionális Firebase

GitHub Pages-re feltölthető, sötét tónusú családfa-szerkesztő szerepjátékos kampányokhoz. Alapból teljesen statikus, üres családfával indul, de Firestore-dokumentumba is tud menteni, ha beállítod a Firebase-t.

## Mit tud?

- Sötét, szürkés-fekete vizuális téma
- Üres kezdő családfa, próba/minta család nélkül
- Jelentősen nagyobb karakterportrék és erősebb karakter-szín megjelenítés
- Kártyák egyszerű húzása és kézi pozíciómentése
- Automatikus elrendezés visszaállítása az **Auto layout** gombbal
- Családfa kártyák generációk szerint
- Szülő, gyermek és partner/házastárs kapcsolatok
- Kapcsolati vonalak egyedi stílusa: szín, vastagság, solid/dashed/dotted/longdash minta
- Kapcsolati státuszok: `házas`, `partner`, `elvált`, `özvegy`
- Személyadatok:
  - név
  - leánykori név / névváltozat, például `née Selwyn`
  - nem: férfi / nő / egyéb
  - nem alapján ikon a kártyán
  - születés: év, hó, nap – külön mezők, mind opcionális
  - halál: év, hó, nap – külön mezők, mind opcionális
  - születési hely
  - kép URL
  - böngészőből feltöltött kép, base64/data URL formában mentve
  - karakter színe
  - leírás / jegyzet
- Életkor számítás a `meta.currentYear` alapján, alapértelmezés: `2032`
- Húzható fa-megjegyzések / cetlik konkrét ágakhoz vagy területekhez
- Timeline oldal évekre bontva
  - születések automatikusan
  - halálozások automatikusan
  - kézzel felvitt kampányesemények
- Böngészőben szerkeszthető adatok
- Automatikus localStorage mentés
- JSON import/export
- Egyszerű PNG export a családfa nézetről
- Opcionális Firebase / Cloud Firestore mentés és élő sync

## Használat helyben

Indíts egy egyszerű helyi szervert:

```bash
python -m http.server 8080
```

Majd böngészőben:

```text
http://localhost:8080
```

A `type="module"` miatt a Firebase-kompatibilis verziót érdemes helyi szerverről nézni, nem közvetlenül fájlként megnyitni.

A feltöltött képek a JSON-ben `data:image/...` értékként tárolódnak. Ez egyszerű és GitHub Pages-kompatibilis, de nagy képeknél a JSON gyorsan megnőhet; érdemes webre optimalizált, kisebb portrékat használni.

## GitHub Pages publikálás

1. Hozz létre egy új GitHub repository-t.
2. Töltsd fel az `index.html`, `styles.css`, `app.js`, `firebase-config.example.js`, `FIREBASE-SETUP.md`, `firestore.rules` és `data/family.json` fájlokat. Ha Firebase-t is használsz GitHub Pagesen, a kitöltött `firebase-config.js` fájlra is szükség lesz.
3. A repositoryban menj a **Settings → Pages** részre.
4. Source: `Deploy from a branch`, branch: `main`, folder: `/root`.
5. A publikus oldal tipikusan ezen lesz elérhető: `https://felhasznalonev.github.io/repo-nev/`.

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

A partneri/házastársi kapcsolatok külön vannak, mert az elválás és az özvegység kapcsolat-státusz:

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


A szülő–gyermek vonalak egyedi stílusai a `linkStyles.parent` objektumban tárolódnak. A kulcs formája: `szuloId-->gyerekId`.

```json
"linkStyles": {
  "parent": {
    "aelor-->seren": { "color": "#c4c4d0", "width": 2.5, "pattern": "dashed" }
  }
}
```

A kártyák húzással mozgatott helye a személy `position` mezőjébe mentődik. Az **Auto layout** gomb törli ezeket a kézi pozíciókat, és újraszámolja az elrendezést.

A fa-megjegyzések az `annotations` tömbben vannak. Ezeket a felületen húzni lehet:

```json
{
  "id": "ann-varryn-main",
  "text": "Fő ág: Aelor és Mira leszármazottai őrzik a királyi esküt.",
  "x": 64,
  "y": 36,
  "width": 330,
  "color": "#8f8f99"
}
```

A kézi timeline események az `events` tömbben vannak:

```json
{
  "id": "evt-prophecy",
  "year": 2008,
  "month": 10,
  "day": "",
  "title": "Mira jóslata",
  "description": "A család egyik ága szerint megváltás, a másik szerint átok.",
  "personIds": ["mira", "seren", "oren"],
  "color": "#767680"
}
```

A timeline-ba automatikusan bekerül minden szereplő születése és halála is, ha van hozzá év megadva.

## Életkor számítás

A program a `meta.currentYear` mezőből számol. A mintaadatban ez `2032`.

- Ha csak születési év van, akkor hozzávetőleges kort ír: `kb. 42 éves`.
- Ha van halálozási év, akkor halálkori kort ír: `† kb. 63 évesen`.
- Ha teljes születési és halálozási dátum is van, akkor a hónap/nap alapján pontosít.

## Firebase / Firestore beállítás

A v3.3 verzió tartalmaz Firebase Auth admin belépést Google-fiókkal is. Így a családfa lehet publikus olvasásra, de írni csak a megadott admin e-mail címmel lehessen. Az e-mail+jelszó belépés tartalékként maradt benne, de nem kötelező bekapcsolni.

Rövid lépések:

1. Firebase Console-ban hozz létre vagy válassz projektet.
2. Project settings → Web app → másold ki a Firebase config objektumot.
3. Build → Firestore Database → Create database.
4. Build → Authentication → Sign-in method → Google → Enable → Save.
5. Ha GitHub Pagesen használod: Authentication → Settings → Authorized domains alatt add hozzá a GitHub Pages domainedet, például `felhasznalonev.github.io`.
6. Másold a `firebase-config.example.js` fájlt `firebase-config.js` néven.
7. Töltsd ki a configot:

```js
export const firebaseOptions = {
  apiKey: "...",
  authDomain: "...firebaseapp.com",
  projectId: "...",
  storageBucket: "...appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

export const firestorePath = "trees/main";
export const authEnabled = true;
```

8. A `firestore.rules` fájlban cseréld ki a `TE_EMAIL_CIMED@example.com` értéket arra a Google-fiókos e-mail címedre, amivel be fogsz lépni.
9. Firebase Console → Firestore Database → Rules → másold be a szabályt → Publish.
10. Az oldalon: **Firebase csatlakozás** → **Belépés Google-lal** → **Felhő mentés**.

Részletesebb leírás: `FIREBASE-SETUP.md`.

### Firestore Rules – ajánlott kezdő szabály

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isEditor() {
      return request.auth != null
        && request.auth.token.email in [
          "TE_EMAIL_CIMED@example.com"
        ];
    }

    match /trees/{treeId} {
      allow read: if true;
      allow create, update, delete: if isEditor();
    }
  }
}
```

### Gyors teszt, nem éles használatra

Ha csak azt akarod ellenőrizni, hogy a config működik-e, a `firestore.TEST-ONLY.rules` fájl mindenki számára enged olvasást és írást. Ezt csak rövid teszthez használd, utána állítsd vissza az admin-only szabályt.

### Fontos biztonság

A Firebase webes config objektum önmagában nem admin titok, de a `firebase-config.js` publikus lesz GitHub Pagesen. Az adatvédelmet és az írási jogosultságot a Firebase Authentication és a Firestore Security Rules adják.

## Tartós szerkesztés Firebase nélkül

A webappban végzett szerkesztés a böngészőben mentődik. Publikus frissítéshez:

1. Kattints a **JSON mentés** gombra.
2. A letöltött `family.json` tartalmával cseréld le a GitHub repository `data/family.json` fájlját.
3. Commit után a GitHub Pages frissül.

## Alternatív adatfájl

Másik JSON-t is betölthetsz URL paraméterrel:

```text
https://felhasznalonev.github.io/repo-nev/?data=data/masik-csalad.json
```

## Következő fejlesztési ötletek

- több admin e-mail kezelése külön configból
- több fa/kampány választó
- kapcsolat kezdete/vége dátummal
- örökbefogadás vagy titkos szülőség jelölése
- több admin e-mail kezelése UI-ból
- képfeltöltés Firebase Storage-ba nagy kampányokhoz
