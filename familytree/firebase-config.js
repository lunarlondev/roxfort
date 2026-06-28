export const firebaseOptions = {
  apiKey: "AIzaSyDNz5UYQZVHqY11gDrroFA6hZPvZnH3TKI",
  authDomain: "familytree-73abc.firebaseapp.com",
  projectId: "familytree-73abc",
  storageBucket: "familytree-73abc.firebasestorage.app",
  messagingSenderId: "486425351113",
  appId: "1:486425351113:web:8624aaeca1bcdec8b4ce18",
  measurementId: "G-LBMVFK4EF0"
};

export const firestorePath = "trees/main";

// true: publikus olvasás mellett a szerkesztés Google-belépéshez kötött.
export const authEnabled = true;

// A felületen csak ezeknek az e-mail címeknek jelenik meg a szerkesztőpanel.
// Ugyanezeket az e-maileket írd be a firestore.rules fájlba is.
export const editorEmails = [
  "notcaringenough@gmail.com"
];

// true: a publikus nézet oldalbetöltéskor automatikusan betölti a trees/main dokumentumot.
export const autoLoadFromFirebase = true;
