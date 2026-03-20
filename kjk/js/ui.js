{
  "start": {
    "text": "Reggeli a Roxfortban.",
    "choices": [
      { "text": "Toast", "next": "class_intro", "image": "assets/egg.jpg" },
      { "text": "Gofri", "next": "class_intro", "image": "assets/pickles.jpg" }
    ]
  },

  "class_intro": {
    "text": "Óra előtt állsz.",
    "secretTimer": 5000,
    "secretChoice": {
      "text": "Meglépsz",
      "next": "ending_secret",
      "secret": true,
      "secretId": "ESCAPE"
    },
    "choices": [
      { "text": "Figyelsz", "next": "task" }
    ]
  },

  "task": {
    "text": "Mozgasd a könyvet.",
    "choices": [
      { "text": "Leviosa", "next": "good", "critical": true },
      { "text": "Accio", "next": "mid" },
      { "text": "Depulso", "next": "bad" }
    ]
  },

  "good": { "type": "ending", "title": "Kiváló", "text": "Szép", "endingId": "A" },
  "mid": { "type": "ending", "title": "Közepes", "text": "Oké", "endingId": "B" },
  "bad": { "type": "ending", "title": "Bukás", "text": "Rip", "endingId": "C" },
  "ending_secret": {
    "type": "ending",
    "title": "Lógtál",
    "text": "Megszöktél",
    "endingId": "S",
    "secret": true,
    "secretId": "ESCAPE"
  }
}