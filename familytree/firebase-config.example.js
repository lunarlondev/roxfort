// 1. Másold ezt a fájlt firebase-config.js néven.
// 2. Firebase Console → Project settings → Your apps → Web app.
// 3. Illeszd be ide a saját Firebase config objektumodat.
// 4. A firestorePath legyen egy DOKUMENTUM útvonala, például: "trees/viharvar".
// 5. Ha admin belépést is akarsz, hagyd true-n az authEnabled értéket,
//    majd Firebase Console → Authentication → Sign-in method → Google: Enable.
//    Az Email/Password csak tartalék, nem kötelező.

export const firebaseOptions = {
  apiKey: "IDE_JÖN_A_SAJÁT_API_KEY",
  authDomain: "sajat-projekt.firebaseapp.com",
  projectId: "sajat-projekt",
  storageBucket: "sajat-projekt.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:aaaaaaaaaaaaaaaaaaaaaa"
};

// Egyetlen családfa dokumentum. A Firestore-ban ez collection/document párosként jön létre.
export const firestorePath = "trees/main";

// true: megjelenik az admin belépés, és a felhő mentés belépést vár.
// false: nincs Auth UI; csak akkor használd, ha a Firestore Rules külön engedi az írást.
export const authEnabled = true;
