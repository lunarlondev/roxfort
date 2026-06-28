# Firebase beállítás – RPG családfa, Google-belépéssel

Ez a verzió GitHub Pagesen is működik, a családfát pedig Cloud Firestore dokumentumba tudja menteni. Ajánlott üzemmód: publikus olvasás, csak a megadott Google-fiókos admin e-mail írhat.

## 1. Firebase projekt és Web app

1. Nyisd meg a Firebase Console-t.
2. Válassz meglévő projektet vagy hozz létre újat.
3. Project overview → Web app ikon.
4. Regisztráld az appot.
5. Másold ki a `firebaseConfig` objektumot.

## 2. Firestore bekapcsolása

1. Build → Firestore Database.
2. Create database.
3. Válaszd a production módot.
4. Régió: ami neked kényelmes; európai kampányhoz egy EU régió jó választás.

## 3. Auth bekapcsolása Google-lal

1. Build → Authentication.
2. Sign-in method / Sign-in providers.
3. Google → Enable / Engedélyezés.
4. Project support email: válaszd ki a saját e-mail címedet.
5. Save / Mentés.

Az e-mail+jelszó belépés nem kötelező. A webappban csak tartalék opcióként maradt benne.

Ha GitHub Pagesen használod az oldalt, menj ide is:

```text
Authentication → Settings → Authorized domains
```

Add hozzá a GitHub Pages domainedet, például:

```text
felhasznalonev.github.io
```

## 4. Konfig fájl

Másold:

```text
firebase-config.example.js → firebase-config.js
```

Majd töltsd ki:

```js
export const firebaseOptions = {
  apiKey: "...",
  authDomain: "...firebaseapp.com",
  projectId: "...",
  storageBucket: "...firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};

export const firestorePath = "trees/main";
export const authEnabled = true;
```

A `firestorePath` dokumentumútvonal legyen. Jó példa: `trees/main`, `trees/viharvar`, `campaigns/varryn-tree`. Rossz példa: `trees`, mert az collection, nem dokumentum.

## 5. Firestore Rules

A `firestore.rules` fájlban cseréld ki ezt:

```js
"TE_EMAIL_CIMED@example.com"
```

arra a Google-fiókos admin e-mail címedre, amivel be fogsz lépni. Több admin is lehet:

```js
"meselo@example.com",
"jatekos-admin@example.com"
```

Utána Firebase Console → Firestore Database → Rules fülre másold be a szabályt, majd Publish.

## 6. Első mentés

1. Nyisd meg az oldalt helyben vagy GitHub Pagesen.
2. Firebase / Firestore panel.
3. Firebase csatlakozás.
4. Belépés Google-lal.
5. Felhő mentés.
6. Ezután kipróbálhatod a Felhő betöltés és Élő sync gombokat.

## Tesztelés nyitott szabállyal

Ha csak gyorsan ellenőrizni akarod, hogy a config és a kapcsolat jó-e, ideiglenesen használhatod a `firestore.TEST-ONLY.rules` fájlt. Ez mindenkinek enged írást, ezért utána azonnal állítsd vissza a biztonságos szabályt.

## GitHub Pages megjegyzés

A `firebase-config.js` fájlt fel kell tölteni a GitHub Pages oldal mellé, különben a böngésző nem tud csatlakozni. A Firebase webes config nem admin titkos kulcs; a védelmet a Firestore Rules és a Firebase Auth adja.
