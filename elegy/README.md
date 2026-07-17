# Nekromanta karakterlap + interaktív történetmotor

## Indítás

A JSON-fájlok miatt az oldalt helyi webszerverről kell megnyitni.

Windows alatt:

1. Másold be a képeket az `images` mappába.
2. Kattints duplán a `start.bat` fájlra.
3. Az oldal megnyílik a böngészőben a `http://127.0.0.1:8000/` címen.

## Tartalom szerkesztése

- `data/character.json`: a teljes karakterlap nem interaktív tartalma.
- `data/story.json`: az interaktív történet csomópontjai, választásai és endingjei.
- `css/`: a teljes megjelenés.
- `js/story/`: a történetmotor külön moduljai.

## Képek

A CSS ezeket a textúrákat használja:

- `images/p1.jpg`
- `images/p2.jpg`
- `images/p3.jpg`
- `images/p4.jpg`

A három fejlécfotó alapértelmezett útvonala:

- `images/aes-1.jpg`
- `images/aes-2.jpg`
- `images/aes-3.jpg`

A történetképek opcionálisak. A hiányzó történetképek helyét a felület automatikusan elrejti.

## Titkos feltételek

A `choice.unlock` a következőket támogatja:

- `endingSeen`: egy endinget már megtalált az olvasó.
- `endingCount`: legalább megadott számú endinget megtalált.
- `seenChoice`: egy választást bármely korábbi végigjátszásban kiválasztott.
- `runChoice`: egy választást az aktuális végigjátszásban kiválasztott.
- `nodeSeen`: egy csomópontot már látott.
- `visitCount`: egy csomópont megadott számú meglátogatása.
- `flag`: futás közbeni változó vizsgálata.
- `waitOnNode`: az adott jelenetben eltöltött idő.
- `all`, `any`, `not`: feltételek összekapcsolása.

Példa:

```json
{
  "unlock": {
    "all": [
      { "type": "endingSeen", "id": "ECHO" },
      { "type": "waitOnNode", "milliseconds": 15000 }
    ]
  }
}
```

## Választástípusok és effektek

A `tags` lista tetszőlegesen kombinálható:

```json
"tags": ["secret", "critical", "special"]
```

Az `effect` lehet:

- `normal`
- `critical`
- `glitch`

## Böngészőben tárolt adatok

- A megtalált endingek és korábban látott választások `localStorage`-ba kerülnek.
- Az aktuális végigjátszás `sessionStorage`-ba kerül, ezért azonos böngészőlapon egy frissítés után is folytatható.
- A `Vissza` gomb nem törli és nem görgeti vissza a már megtalált endingeket.
- Az `Új útvonal` csak az aktuális végigjátszást indítja újra.

## Új ending hozzáadása

Minden endingnek egyedi, stabil `endingId` kell:

```json
"ending_example": {
  "type": "ending",
  "endingId": "EXAMPLE_ENDING",
  "order": 11,
  "title": "Az ending címe",
  "paragraphs": ["Az ending szövege."]
}
```

A `story.json` betöltésekor a motor ellenőrzi a hiányzó célpontokat, a duplikált választásazonosítókat és a duplikált endingazonosítókat.
