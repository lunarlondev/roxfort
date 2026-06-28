# Firebase beállítás – publikus olvasás, whitelistes szerkesztés

Ez a verzió arra készült, hogy:

- a családfa külsők számára publikus legyen,
- mindenki tudja nézni / olvasni,
- szerkeszteni csak az általad megadott Google-fiókok tudjanak.

## 1. Google-belépés bekapcsolása

Firebase Console:

```text
Authentication → Sign-in method / Sign-in providers → Google → Enable → Save
```

A Project support email mezőnél válaszd ki a saját e-mail címedet.

## 2. Authorized domain GitHub Pageshez

Firebase Console:

```text
Authentication → Settings → Authorized domains → Add domain
```

Ha az oldalad például:

```text
https://felhasznalonev.github.io/rpg-family-tree/
```

akkor ezt add meg:

```text
felhasznalonev.github.io
```

## 3. Firestore adatbázis

Firebase Console:

```text
Firestore Database → Create database
```

Ajánlott:

```text
Production mode
```

Az adat helye a projektben:

```text
Firestore Database → Data → trees → main
```

Ha még nincs `trees/main`, akkor az appban szerkesztőként belépve nyomj egy **Felhő mentés** gombot.

## 4. Szerkesztők listája a webappban

Nyisd meg a `firebase-config.js` fájlt, és töltsd ki:

```js
export const editorEmails = [
  "sajat.email@gmail.com",
  "masik.szerkeszto@gmail.com"
];
```

Csak ezeknek az e-maileknek fog megjelenni a szerkesztőpanel.

## 5. Firestore Rules

Firebase Console:

```text
Firestore Database → Rules
```

Másold be ezt, a saját e-mail címeiddel:

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
      // A végeredmény mindenki számára nézhető / olvasható.
      allow read: if true;

      // Írni csak a megadott Google-fiókok tudnak.
      allow create, update, delete: if isEditor();
    }
  }
}
```

Majd:

```text
Publish
```

## 6. Használat

Külső látogató:

```text
Megnyitja az oldalt → automatikusan látja a Firebase-ben mentett családfát.
```

Szerkesztő:

```text
Megnyitja az oldalt
→ Szerkesztői belépés
→ Google-fiók kiválasztása
→ szerkesztőpanel megjelenik
→ módosítások
→ Felhő mentés
```

## 7. Fontos

A `firebase-config.js` fájlban lévő Firebase web config nem admin titkos kulcs. A tényleges adatvédelmet a Firestore Rules adja.

Ha valaki nincs benne a Firestore Rules e-mail listájában, akkor nem tud írni az adatbázisba, akkor sem, ha a böngészőben megpróbálja meghívni a mentést.


## Publikus nézet hibaelhárítás

Ha privát ablakban üres a családfa, akkor az oldal nem tudja olvasni a `trees/main` Firestore dokumentumot. Ellenőrizd:

1. Firebase Console → Firestore Database → Data alatt létezik-e: `trees / main`.
2. Firebase Console → Firestore Database → Rules alatt a `/trees/{treeId}` blokkban ez szerepel-e: `allow read: if true;`.
3. A GitHubra feltöltött `firebase-config.js` fájlban ez van-e: `export const firestorePath = "trees/main";`.
4. Az oldalon a státuszsor mit ír: a v3.7 már publikus módban is kiírja, ha jogosultsági vagy útvonalhiba van.

