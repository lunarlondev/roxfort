import requests
import json

API = "https://harrypotter.fandom.com/api.php"

categories = [
    "Category:Spells",
    "Category:Charms",
    "Category:Curses",
    "Category:Hexes",
    "Category:Jinxes",
    "Category:Healing_spells",
    "Category:Transfiguration_spells",
    "Category:Dark_Arts"
]

spells = {}

print("Varázslatok lekérése...")

for cat in categories:

    continue_token = None

    while True:

        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": cat,
            "cmlimit": "500",
            "format": "json"
        }

        if continue_token:
            params["cmcontinue"] = continue_token

        r = requests.get(API, params=params)
        r.raise_for_status()

        data = r.json()

        for item in data["query"]["categorymembers"]:

            name = item["title"]

            spells[name] = {

                "name": name,
                "hu": "-",

                # tanulási szint (alapból felsőoktatás)
                "year": 8,

                # kategória
                "category": "bubajok",

                # rövid leírás
                "description": "",

                # elemi vagy egyéb hatások
                "effects": [],

                # fekete mágia
                "dark": False,

                # gyógyító
                "healing": False,

                # saját varázslat (canon lista miatt default false)
                "custom": False,

                # speciális tanulás
                "rare": False,

                # wiki link
                "wiki": "https://harrypotter.fandom.com/wiki/" + name.replace(" ", "_")
            }

        if "continue" in data:
            continue_token = data["continue"]["cmcontinue"]
        else:
            break


spell_list = list(spells.values())

print("Talált varázslatok:", len(spell_list))

with open("spells.json", "w", encoding="utf-8") as f:
    json.dump(spell_list, f, indent=2, ensure_ascii=False)

print("spells.json létrehozva!")

input("Enter a kilépéshez...")