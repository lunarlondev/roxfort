const GUIDE_DATA = {"title":"Szemet szemért · végigjátszás","endings":[{"order":1,"endingId":"EYE_REMOVAL_DEATH","title":"Megváltás","summary":"Eltávolítod a szemet, és az árát az életeddel fizeted meg.","requirements":[],"shortCount":10,"fullCount":19,"steps":[{"index":1,"nodeId":"s1_return_to_estate","choiceId":"s1_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Rádió","short":"Ammani rádió","full":"Megpróbálsz befogni egy ammani varázsrádiót.","tags":["normal"],"unlock":"","important":true},{"index":2,"nodeId":"s1_radio_amman_reaction","choiceId":"s1_after_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"A könyvespolcon böngészel","full":"A könyvespolcon böngészel.","tags":["normal"],"unlock":"","important":false},{"index":3,"nodeId":"s1_first_book","choiceId":"s1_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Könyv","short":"Bogár Bárd","full":"Bogár Bárd meséi","tags":["critical"],"unlock":"","important":true},{"index":4,"nodeId":"s1_beetlebard_reaction","choiceId":"s1_after_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"Folytatod a napot","full":"Folytatod a napot.","tags":["normal"],"unlock":"","important":false},{"index":5,"nodeId":"s1_attack_start","choiceId":"s1_route_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Keresés","short":"A térképet követed","full":"Alaposabban összeveted a térképet a környezettel.","tags":["critical"],"unlock":"","important":true},{"index":6,"nodeId":"s1_route_map_scene","choiceId":"s1_route_map_continue","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Tovább a csapóajtóhoz","full":"Tovább a csapóajtóhoz.","tags":["normal"],"unlock":"","important":false},{"index":7,"nodeId":"s1_site_found_map","choiceId":"s1_take_sealed_case_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"A bunkerben","short":"A régi pálcát viszed el","full":"Egy bársonyba csomagolt, csontfoglalatba zárt, régi pálcát viszel el a tárolóból.","tags":["critical"],"unlock":"","important":true},{"index":8,"nodeId":"s1_return_omens_normal","choiceId":"s1_begin_attack_normal","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Felkészülsz a támadásra","full":"Felkészülsz a támadásra.","tags":["normal"],"unlock":"","important":false},{"index":9,"nodeId":"s1_attack_choice_normal","choiceId":"s1_try_escape","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Az inferusok","short":"Destination mellett maradsz","full":"Szorosan Destination mellett maradsz.","tags":["critical"],"unlock":"","important":true},{"index":10,"nodeId":"s1_escape_attempt_normal","choiceId":"s1_escape_separate","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Menekülés","short":"Levágod az utat","full":"Levágod az utat a kukoricasoron.","tags":["critical"],"unlock":"","important":true},{"index":11,"nodeId":"s1_eye_escape_separated","choiceId":"s1_after_eye_escape_separated","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Destination hangját követed a sötétedő világban","full":"Destination hangját követed a sötétedő világban.","tags":["normal"],"unlock":"","important":false},{"index":12,"nodeId":"s1_cut_to_chapter_two","choiceId":"s1_cut_enter_chapter_two","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Kalandod itt véget ér","full":"Kalandod itt véget ér...","tags":["normal"],"unlock":"","important":false},{"index":13,"nodeId":"s2_wake_after_attack","choiceId":"s2_enter_normal_after_escape_separated","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Magadhoz térsz","full":"Magadhoz térsz.","tags":["normal"],"unlock":"Az előző útvonal alapján jelenik meg","important":false},{"index":14,"nodeId":"s2_wake_normal","choiceId":"s2_normal_accept_decision","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A szem eredete","short":"Elfogadod a döntést","full":"Elfogadod a döntését, és várakozol.","tags":["normal"],"unlock":"","important":true},{"index":15,"nodeId":"s2_preprocedure_normal","choiceId":"s2_normal_drink_potion","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A procedúra előtt","short":"Megiszod a bájitalt","full":"Megiszod a bájitalt.","tags":["normal"],"unlock":"","important":true},{"index":16,"nodeId":"s2_implant_normal","choiceId":"s2_normal_finish_implant","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Lehunyod a megmaradt szemed","full":"Lehunyod a megmaradt szemed.","tags":["normal"],"unlock":"","important":false},{"index":17,"nodeId":"s2_eye_implanted_normal","choiceId":"s2_normal_enter_final_chapter","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Néhány nappal később","full":"Néhány nappal később.","tags":["normal"],"unlock":"","important":false},{"index":18,"nodeId":"s3_normal_recovery","choiceId":"s3_normal_hide_and_endure","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Mit teszel a szemmel?","short":"Egyedül viseled el","full":"Egyedül próbálod elviselni.","tags":["critical"],"unlock":"","important":true},{"index":19,"nodeId":"s3_parasite_torment","choiceId":"s3_remove_eye","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Egyedül a szemmel","short":"Kitéped a szemet","full":"Kiszeded magadból a szemet, bármi legyen is az ára.","tags":["critical"],"unlock":"Csak ha nem találtad meg Desolationt","important":true}]},{"order":2,"endingId":"PATIENT_WITNESS","title":"A tanú","summary":"Kivárod a teljes emléket, és tanúja leszel a látó múltjának.","requirements":["7 perc várakozás"],"shortCount":11,"fullCount":21,"steps":[{"index":1,"nodeId":"s1_return_to_estate","choiceId":"s1_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Rádió","short":"Ammani rádió","full":"Megpróbálsz befogni egy ammani varázsrádiót.","tags":["normal"],"unlock":"","important":true},{"index":2,"nodeId":"s1_radio_amman_reaction","choiceId":"s1_after_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"A könyvespolcon böngészel","full":"A könyvespolcon böngészel.","tags":["normal"],"unlock":"","important":false},{"index":3,"nodeId":"s1_first_book","choiceId":"s1_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Könyv","short":"Bogár Bárd","full":"Bogár Bárd meséi","tags":["critical"],"unlock":"","important":true},{"index":4,"nodeId":"s1_beetlebard_reaction","choiceId":"s1_after_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"Folytatod a napot","full":"Folytatod a napot.","tags":["normal"],"unlock":"","important":false},{"index":5,"nodeId":"s1_attack_start","choiceId":"s1_route_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Keresés","short":"A térképet követed","full":"Alaposabban összeveted a térképet a környezettel.","tags":["critical"],"unlock":"","important":true},{"index":6,"nodeId":"s1_route_map_scene","choiceId":"s1_route_map_continue","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Tovább a csapóajtóhoz","full":"Tovább a csapóajtóhoz.","tags":["normal"],"unlock":"","important":false},{"index":7,"nodeId":"s1_site_found_map","choiceId":"s1_take_sealed_case_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"A bunkerben","short":"A régi pálcát viszed el","full":"Egy bársonyba csomagolt, csontfoglalatba zárt, régi pálcát viszel el a tárolóból.","tags":["critical"],"unlock":"","important":true},{"index":8,"nodeId":"s1_return_omens_normal","choiceId":"s1_begin_attack_normal","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Felkészülsz a támadásra","full":"Felkészülsz a támadásra.","tags":["normal"],"unlock":"","important":false},{"index":9,"nodeId":"s1_attack_choice_normal","choiceId":"s1_try_escape","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Az inferusok","short":"Destination mellett maradsz","full":"Szorosan Destination mellett maradsz.","tags":["critical"],"unlock":"","important":true},{"index":10,"nodeId":"s1_escape_attempt_normal","choiceId":"s1_escape_separate","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Menekülés","short":"Levágod az utat","full":"Levágod az utat a kukoricasoron.","tags":["critical"],"unlock":"","important":true},{"index":11,"nodeId":"s1_eye_escape_separated","choiceId":"s1_after_eye_escape_separated","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Destination hangját követed a sötétedő világban","full":"Destination hangját követed a sötétedő világban.","tags":["normal"],"unlock":"","important":false},{"index":12,"nodeId":"s1_cut_to_chapter_two","choiceId":"s1_cut_enter_chapter_two","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Kalandod itt véget ér","full":"Kalandod itt véget ér...","tags":["normal"],"unlock":"","important":false},{"index":13,"nodeId":"s2_wake_after_attack","choiceId":"s2_enter_normal_after_escape_separated","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Magadhoz térsz","full":"Magadhoz térsz.","tags":["normal"],"unlock":"Az előző útvonal alapján jelenik meg","important":false},{"index":14,"nodeId":"s2_wake_normal","choiceId":"s2_normal_accept_decision","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A szem eredete","short":"Elfogadod a döntést","full":"Elfogadod a döntését, és várakozol.","tags":["normal"],"unlock":"","important":true},{"index":15,"nodeId":"s2_preprocedure_normal","choiceId":"s2_normal_drink_potion","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A procedúra előtt","short":"Megiszod a bájitalt","full":"Megiszod a bájitalt.","tags":["normal"],"unlock":"","important":true},{"index":16,"nodeId":"s2_implant_normal","choiceId":"s2_normal_finish_implant","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Lehunyod a megmaradt szemed","full":"Lehunyod a megmaradt szemed.","tags":["normal"],"unlock":"","important":false},{"index":17,"nodeId":"s2_eye_implanted_normal","choiceId":"s2_normal_enter_final_chapter","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Néhány nappal később","full":"Néhány nappal később.","tags":["normal"],"unlock":"","important":false},{"index":18,"nodeId":"s3_normal_recovery","choiceId":"s3_normal_tell_mother","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Mit teszel a szemmel?","short":"Anyádtól kérsz segítséget","full":"Segítséget kérsz anyádtól.","tags":["critical"],"unlock":"","important":true},{"index":19,"nodeId":"s3_mother_binding_offer","choiceId":"s3_refuse_mother_binding","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Anyád ajánlata","short":"Elutasítod a kötést","full":"Nem engeded, hogy még egyszer rendelkezzen a tested felett.","tags":["critical"],"unlock":"","important":true},{"index":20,"nodeId":"s3_major_vision","choiceId":"s3_wait_for_eye_message","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"A nagy látomás","short":"Vársz 7 percet","full":"Nem rémülsz meg. Türelmesen megvárod, mit akar valójában mutatni.","tags":["secret","critical"],"unlock":"7 perc várakozás","important":true},{"index":21,"nodeId":"s3_patient_revelation","choiceId":"s3_accept_complete_memory","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"III. Fejezet — Parazita","short":"Tovább nézed, amit a szem mutatni akar","full":"Tovább nézed, amit a szem mutatni akar.","tags":["normal"],"unlock":"","important":false}]},{"order":3,"endingId":"DEJAVU_LOOP_DEATH","title":"Ugyanaz a vég","summary":"A Déjà Vu után ugyanazt a végzetes döntést hozod meg.","requirements":["Előbb: Megváltás"],"shortCount":8,"fullCount":20,"steps":[{"index":1,"nodeId":"s1_return_to_estate","choiceId":"s1_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Rádió","short":"Ammani rádió","full":"Megpróbálsz befogni egy ammani varázsrádiót.","tags":["normal"],"unlock":"","important":true},{"index":2,"nodeId":"s1_radio_amman_reaction","choiceId":"s1_after_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"A könyvespolcon böngészel","full":"A könyvespolcon böngészel.","tags":["normal"],"unlock":"","important":false},{"index":3,"nodeId":"s1_first_book","choiceId":"s1_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Könyv","short":"Bogár Bárd","full":"Bogár Bárd meséi","tags":["critical"],"unlock":"","important":true},{"index":4,"nodeId":"s1_beetlebard_reaction","choiceId":"s1_after_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"Folytatod a napot","full":"Folytatod a napot.","tags":["normal"],"unlock":"","important":false},{"index":5,"nodeId":"s1_attack_start","choiceId":"s1_dejavu_refusal","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Keresés","short":"Pontosan tudod az utat","full":"Pontosan tudod, merre kell mennetek.","tags":["secret","critical"],"unlock":"Előbb: Megváltás","important":true},{"index":6,"nodeId":"s1_route_dejavu_scene","choiceId":"s1_route_dejavu_continue","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Tovább a csapóajtóhoz","full":"Tovább a csapóajtóhoz","tags":["normal"],"unlock":"","important":false},{"index":7,"nodeId":"s1_site_found_dejavu","choiceId":"s1_take_sealed_case_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"A bunkerben","short":"A régi pálcát viszed el","full":"Egy bársonyba csomagolt, csontfoglalatba zárt, régi pálcát viszel el a tárolóból.","tags":["normal"],"unlock":"","important":true},{"index":8,"nodeId":"s1_dejavu_medal_transfer","choiceId":"s1_force_medal_on_destination","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Elengeded a létrát","full":"Elengeded a létrát.","tags":["normal"],"unlock":"","important":false},{"index":9,"nodeId":"s1_return_omens_dejavu","choiceId":"s1_begin_attack_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Várod a megmentést","full":"Várod a megmentést.","tags":["normal"],"unlock":"","important":false},{"index":10,"nodeId":"s1_attack_choice_dejavu","choiceId":"s1_try_escape_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Az ismerős támadás","short":"Confringo","full":"CONFRINGO!","tags":["critical"],"unlock":"","important":true},{"index":11,"nodeId":"s1_confringo_attempt_dejavu","choiceId":"s1_escape_separate_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Confringo után","short":"Tűzkör","full":"Tűzkör idézése","tags":["critical"],"unlock":"","important":true},{"index":12,"nodeId":"s1_eye_escape_separated_dejavu","choiceId":"s1_after_eye_escape_separated_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Elfogadod, hogy ezt nem tudtad elkerülni","full":"Elfogadod, hogy ezt nem tudtad elkerülni.","tags":["critical"],"unlock":"","important":false},{"index":13,"nodeId":"s1_cut_to_chapter_two","choiceId":"s1_cut_enter_chapter_two","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Kalandod itt véget ér","full":"Kalandod itt véget ér...","tags":["normal"],"unlock":"","important":false},{"index":14,"nodeId":"s2_wake_after_attack","choiceId":"s2_enter_dejavu_after_escape_separated_first_twin_discovery","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Újra magadhoz térsz","full":"Újra magadhoz térsz.","tags":["normal"],"unlock":"Az előző útvonal alapján jelenik meg","important":false},{"index":15,"nodeId":"s2_wake_dejavu_first","choiceId":"s2_dejavu_protest_parasite_first","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Tiltakozol a parazita ellen","full":"Tiltakozol a parazita ellen.","tags":["normal"],"unlock":"","important":false},{"index":16,"nodeId":"s2_dejavu_protest","choiceId":"s2_dejavu_mother_insists","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Anyád nem enged a döntéséből","full":"Anyád nem enged a döntéséből.","tags":["normal"],"unlock":"","important":false},{"index":17,"nodeId":"s2_preprocedure_dejavu","choiceId":"s2_dejavu_drink_potion","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"Újra a procedúra","short":"Megiszod a bájitalt","full":"Megiszod a bájitalt, és megvárod a procedúra végét.","tags":["critical"],"unlock":"","important":true},{"index":18,"nodeId":"s2_implant_dejavu","choiceId":"s2_dejavu_finish_implant","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Nem rendelkezhetsz saját tested felett","full":"Nem rendelkezhetsz saját tested felett.","tags":["normal"],"unlock":"","important":false},{"index":19,"nodeId":"s2_eye_implanted_dejavu","choiceId":"s2_dejavu_enter_final_chapter","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Újra egyek vagyunk, csak te meg én","full":"Újra egyek vagyunk, csak te meg én.","tags":["normal"],"unlock":"","important":false},{"index":20,"nodeId":"s3_dejavu_recovery","choiceId":"s3_dejavu_remove_again","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Déjà Vu végjáték","short":"Újra a halált választod","full":"Nem várod meg a látomásokat. Inkább a halál.","tags":["critical"],"unlock":"Csak ha nem találtad meg Desolationt","important":true}]},{"order":4,"endingId":"DEJAVU_COEXIST","title":"Két tekintet","summary":"A Déjà Vu után megtanulsz együtt élni a szemmel.","requirements":["Előbb: Megváltás"],"shortCount":8,"fullCount":20,"steps":[{"index":1,"nodeId":"s1_return_to_estate","choiceId":"s1_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Rádió","short":"Ammani rádió","full":"Megpróbálsz befogni egy ammani varázsrádiót.","tags":["normal"],"unlock":"","important":true},{"index":2,"nodeId":"s1_radio_amman_reaction","choiceId":"s1_after_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"A könyvespolcon böngészel","full":"A könyvespolcon böngészel.","tags":["normal"],"unlock":"","important":false},{"index":3,"nodeId":"s1_first_book","choiceId":"s1_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Könyv","short":"Bogár Bárd","full":"Bogár Bárd meséi","tags":["critical"],"unlock":"","important":true},{"index":4,"nodeId":"s1_beetlebard_reaction","choiceId":"s1_after_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"Folytatod a napot","full":"Folytatod a napot.","tags":["normal"],"unlock":"","important":false},{"index":5,"nodeId":"s1_attack_start","choiceId":"s1_dejavu_refusal","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Keresés","short":"Pontosan tudod az utat","full":"Pontosan tudod, merre kell mennetek.","tags":["secret","critical"],"unlock":"Előbb: Megváltás","important":true},{"index":6,"nodeId":"s1_route_dejavu_scene","choiceId":"s1_route_dejavu_continue","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Tovább a csapóajtóhoz","full":"Tovább a csapóajtóhoz","tags":["normal"],"unlock":"","important":false},{"index":7,"nodeId":"s1_site_found_dejavu","choiceId":"s1_take_sealed_case_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"A bunkerben","short":"A régi pálcát viszed el","full":"Egy bársonyba csomagolt, csontfoglalatba zárt, régi pálcát viszel el a tárolóból.","tags":["normal"],"unlock":"","important":true},{"index":8,"nodeId":"s1_dejavu_medal_transfer","choiceId":"s1_force_medal_on_destination","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Elengeded a létrát","full":"Elengeded a létrát.","tags":["normal"],"unlock":"","important":false},{"index":9,"nodeId":"s1_return_omens_dejavu","choiceId":"s1_begin_attack_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Várod a megmentést","full":"Várod a megmentést.","tags":["normal"],"unlock":"","important":false},{"index":10,"nodeId":"s1_attack_choice_dejavu","choiceId":"s1_try_escape_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Az ismerős támadás","short":"Confringo","full":"CONFRINGO!","tags":["critical"],"unlock":"","important":true},{"index":11,"nodeId":"s1_confringo_attempt_dejavu","choiceId":"s1_escape_separate_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Confringo után","short":"Tűzkör","full":"Tűzkör idézése","tags":["critical"],"unlock":"","important":true},{"index":12,"nodeId":"s1_eye_escape_separated_dejavu","choiceId":"s1_after_eye_escape_separated_dejavu","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Elfogadod, hogy ezt nem tudtad elkerülni","full":"Elfogadod, hogy ezt nem tudtad elkerülni.","tags":["critical"],"unlock":"","important":false},{"index":13,"nodeId":"s1_cut_to_chapter_two","choiceId":"s1_cut_enter_chapter_two","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Kalandod itt véget ér","full":"Kalandod itt véget ér...","tags":["normal"],"unlock":"","important":false},{"index":14,"nodeId":"s2_wake_after_attack","choiceId":"s2_enter_dejavu_after_escape_separated_first_twin_discovery","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Újra magadhoz térsz","full":"Újra magadhoz térsz.","tags":["normal"],"unlock":"Az előző útvonal alapján jelenik meg","important":false},{"index":15,"nodeId":"s2_wake_dejavu_first","choiceId":"s2_dejavu_protest_parasite_first","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Tiltakozol a parazita ellen","full":"Tiltakozol a parazita ellen.","tags":["normal"],"unlock":"","important":false},{"index":16,"nodeId":"s2_dejavu_protest","choiceId":"s2_dejavu_mother_insists","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Anyád nem enged a döntéséből","full":"Anyád nem enged a döntéséből.","tags":["normal"],"unlock":"","important":false},{"index":17,"nodeId":"s2_preprocedure_dejavu","choiceId":"s2_dejavu_drink_potion","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"Újra a procedúra","short":"Megiszod a bájitalt","full":"Megiszod a bájitalt, és megvárod a procedúra végét.","tags":["critical"],"unlock":"","important":true},{"index":18,"nodeId":"s2_implant_dejavu","choiceId":"s2_dejavu_finish_implant","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Nem rendelkezhetsz saját tested felett","full":"Nem rendelkezhetsz saját tested felett.","tags":["normal"],"unlock":"","important":false},{"index":19,"nodeId":"s2_eye_implanted_dejavu","choiceId":"s2_dejavu_enter_final_chapter","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Újra egyek vagyunk, csak te meg én","full":"Újra egyek vagyunk, csak te meg én.","tags":["normal"],"unlock":"","important":false},{"index":20,"nodeId":"s3_dejavu_recovery","choiceId":"s3_dejavu_choose_coexistence","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Déjà Vu végjáték","short":"Együtt élsz a szemmel","full":"Megtanulsz együtt élni velem.","tags":["critical"],"unlock":"","important":true}]},{"order":5,"endingId":"MOTHER_LEASH","title":"Az anya póráza","summary":"Elfogadod anyád segítségét és a vele járó kötést.","requirements":[],"shortCount":10,"fullCount":19,"steps":[{"index":1,"nodeId":"s1_return_to_estate","choiceId":"s1_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Rádió","short":"Ammani rádió","full":"Megpróbálsz befogni egy ammani varázsrádiót.","tags":["normal"],"unlock":"","important":true},{"index":2,"nodeId":"s1_radio_amman_reaction","choiceId":"s1_after_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"A könyvespolcon böngészel","full":"A könyvespolcon böngészel.","tags":["normal"],"unlock":"","important":false},{"index":3,"nodeId":"s1_first_book","choiceId":"s1_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Könyv","short":"Bogár Bárd","full":"Bogár Bárd meséi","tags":["critical"],"unlock":"","important":true},{"index":4,"nodeId":"s1_beetlebard_reaction","choiceId":"s1_after_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"Folytatod a napot","full":"Folytatod a napot.","tags":["normal"],"unlock":"","important":false},{"index":5,"nodeId":"s1_attack_start","choiceId":"s1_route_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Keresés","short":"A térképet követed","full":"Alaposabban összeveted a térképet a környezettel.","tags":["critical"],"unlock":"","important":true},{"index":6,"nodeId":"s1_route_map_scene","choiceId":"s1_route_map_continue","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Tovább a csapóajtóhoz","full":"Tovább a csapóajtóhoz.","tags":["normal"],"unlock":"","important":false},{"index":7,"nodeId":"s1_site_found_map","choiceId":"s1_take_sealed_case_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"A bunkerben","short":"A régi pálcát viszed el","full":"Egy bársonyba csomagolt, csontfoglalatba zárt, régi pálcát viszel el a tárolóból.","tags":["critical"],"unlock":"","important":true},{"index":8,"nodeId":"s1_return_omens_normal","choiceId":"s1_begin_attack_normal","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Felkészülsz a támadásra","full":"Felkészülsz a támadásra.","tags":["normal"],"unlock":"","important":false},{"index":9,"nodeId":"s1_attack_choice_normal","choiceId":"s1_try_escape","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Az inferusok","short":"Destination mellett maradsz","full":"Szorosan Destination mellett maradsz.","tags":["critical"],"unlock":"","important":true},{"index":10,"nodeId":"s1_escape_attempt_normal","choiceId":"s1_escape_separate","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Menekülés","short":"Levágod az utat","full":"Levágod az utat a kukoricasoron.","tags":["critical"],"unlock":"","important":true},{"index":11,"nodeId":"s1_eye_escape_separated","choiceId":"s1_after_eye_escape_separated","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Destination hangját követed a sötétedő világban","full":"Destination hangját követed a sötétedő világban.","tags":["normal"],"unlock":"","important":false},{"index":12,"nodeId":"s1_cut_to_chapter_two","choiceId":"s1_cut_enter_chapter_two","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Kalandod itt véget ér","full":"Kalandod itt véget ér...","tags":["normal"],"unlock":"","important":false},{"index":13,"nodeId":"s2_wake_after_attack","choiceId":"s2_enter_normal_after_escape_separated","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Magadhoz térsz","full":"Magadhoz térsz.","tags":["normal"],"unlock":"Az előző útvonal alapján jelenik meg","important":false},{"index":14,"nodeId":"s2_wake_normal","choiceId":"s2_normal_accept_decision","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A szem eredete","short":"Elfogadod a döntést","full":"Elfogadod a döntését, és várakozol.","tags":["normal"],"unlock":"","important":true},{"index":15,"nodeId":"s2_preprocedure_normal","choiceId":"s2_normal_drink_potion","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A procedúra előtt","short":"Megiszod a bájitalt","full":"Megiszod a bájitalt.","tags":["normal"],"unlock":"","important":true},{"index":16,"nodeId":"s2_implant_normal","choiceId":"s2_normal_finish_implant","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Lehunyod a megmaradt szemed","full":"Lehunyod a megmaradt szemed.","tags":["normal"],"unlock":"","important":false},{"index":17,"nodeId":"s2_eye_implanted_normal","choiceId":"s2_normal_enter_final_chapter","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Néhány nappal később","full":"Néhány nappal később.","tags":["normal"],"unlock":"","important":false},{"index":18,"nodeId":"s3_normal_recovery","choiceId":"s3_normal_tell_mother","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Mit teszel a szemmel?","short":"Anyádtól kérsz segítséget","full":"Segítséget kérsz anyádtól.","tags":["critical"],"unlock":"","important":true},{"index":19,"nodeId":"s3_mother_binding_offer","choiceId":"s3_accept_mother_binding","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Anyád ajánlata","short":"Elfogadod a kötést","full":"Engeded, hogy segítsen.","tags":["critical"],"unlock":"","important":true}]},{"order":6,"endingId":"SEER_HEIR","title":"A látó örököse","summary":"Befogadod a látó emlékeit és örökségét.","requirements":[],"shortCount":10,"fullCount":19,"steps":[{"index":1,"nodeId":"s1_return_to_estate","choiceId":"s1_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Rádió","short":"Ammani rádió","full":"Megpróbálsz befogni egy ammani varázsrádiót.","tags":["normal"],"unlock":"","important":true},{"index":2,"nodeId":"s1_radio_amman_reaction","choiceId":"s1_after_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"A könyvespolcon böngészel","full":"A könyvespolcon böngészel.","tags":["normal"],"unlock":"","important":false},{"index":3,"nodeId":"s1_first_book","choiceId":"s1_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Könyv","short":"Bogár Bárd","full":"Bogár Bárd meséi","tags":["critical"],"unlock":"","important":true},{"index":4,"nodeId":"s1_beetlebard_reaction","choiceId":"s1_after_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"Folytatod a napot","full":"Folytatod a napot.","tags":["normal"],"unlock":"","important":false},{"index":5,"nodeId":"s1_attack_start","choiceId":"s1_route_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Keresés","short":"A térképet követed","full":"Alaposabban összeveted a térképet a környezettel.","tags":["critical"],"unlock":"","important":true},{"index":6,"nodeId":"s1_route_map_scene","choiceId":"s1_route_map_continue","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Tovább a csapóajtóhoz","full":"Tovább a csapóajtóhoz.","tags":["normal"],"unlock":"","important":false},{"index":7,"nodeId":"s1_site_found_map","choiceId":"s1_take_sealed_case_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"A bunkerben","short":"A régi pálcát viszed el","full":"Egy bársonyba csomagolt, csontfoglalatba zárt, régi pálcát viszel el a tárolóból.","tags":["critical"],"unlock":"","important":true},{"index":8,"nodeId":"s1_return_omens_normal","choiceId":"s1_begin_attack_normal","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Felkészülsz a támadásra","full":"Felkészülsz a támadásra.","tags":["normal"],"unlock":"","important":false},{"index":9,"nodeId":"s1_attack_choice_normal","choiceId":"s1_try_escape","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Az inferusok","short":"Destination mellett maradsz","full":"Szorosan Destination mellett maradsz.","tags":["critical"],"unlock":"","important":true},{"index":10,"nodeId":"s1_escape_attempt_normal","choiceId":"s1_escape_separate","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Menekülés","short":"Levágod az utat","full":"Levágod az utat a kukoricasoron.","tags":["critical"],"unlock":"","important":true},{"index":11,"nodeId":"s1_eye_escape_separated","choiceId":"s1_after_eye_escape_separated","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Destination hangját követed a sötétedő világban","full":"Destination hangját követed a sötétedő világban.","tags":["normal"],"unlock":"","important":false},{"index":12,"nodeId":"s1_cut_to_chapter_two","choiceId":"s1_cut_enter_chapter_two","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Kalandod itt véget ér","full":"Kalandod itt véget ér...","tags":["normal"],"unlock":"","important":false},{"index":13,"nodeId":"s2_wake_after_attack","choiceId":"s2_enter_normal_after_escape_separated","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Magadhoz térsz","full":"Magadhoz térsz.","tags":["normal"],"unlock":"Az előző útvonal alapján jelenik meg","important":false},{"index":14,"nodeId":"s2_wake_normal","choiceId":"s2_normal_accept_decision","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A szem eredete","short":"Elfogadod a döntést","full":"Elfogadod a döntését, és várakozol.","tags":["normal"],"unlock":"","important":true},{"index":15,"nodeId":"s2_preprocedure_normal","choiceId":"s2_normal_drink_potion","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A procedúra előtt","short":"Megiszod a bájitalt","full":"Megiszod a bájitalt.","tags":["normal"],"unlock":"","important":true},{"index":16,"nodeId":"s2_implant_normal","choiceId":"s2_normal_finish_implant","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Lehunyod a megmaradt szemed","full":"Lehunyod a megmaradt szemed.","tags":["normal"],"unlock":"","important":false},{"index":17,"nodeId":"s2_eye_implanted_normal","choiceId":"s2_normal_enter_final_chapter","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Néhány nappal később","full":"Néhány nappal később.","tags":["normal"],"unlock":"","important":false},{"index":18,"nodeId":"s3_normal_recovery","choiceId":"s3_normal_test_power","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Mit teszel a szemmel?","short":"Tudatosan használod","full":"Megpróbálod tudatosan használni a képességét.","tags":["critical"],"unlock":"","important":true},{"index":19,"nodeId":"s3_harness_eye","choiceId":"s3_accept_seer_inheritance","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"A szem hatalma","short":"Befogadod az örökséget","full":"Befogadod az előző látó emlékeit a hatalmával együtt.","tags":["critical"],"unlock":"","important":true}]},{"order":7,"endingId":"FULFILLER","title":"Az önbeteljesítő","summary":"Valóra váltod a látomás képeit.","requirements":[],"shortCount":10,"fullCount":19,"steps":[{"index":1,"nodeId":"s1_return_to_estate","choiceId":"s1_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Rádió","short":"Ammani rádió","full":"Megpróbálsz befogni egy ammani varázsrádiót.","tags":["normal"],"unlock":"","important":true},{"index":2,"nodeId":"s1_radio_amman_reaction","choiceId":"s1_after_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"A könyvespolcon böngészel","full":"A könyvespolcon böngészel.","tags":["normal"],"unlock":"","important":false},{"index":3,"nodeId":"s1_first_book","choiceId":"s1_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Könyv","short":"Bogár Bárd","full":"Bogár Bárd meséi","tags":["critical"],"unlock":"","important":true},{"index":4,"nodeId":"s1_beetlebard_reaction","choiceId":"s1_after_beetlebard","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"Folytatod a napot","full":"Folytatod a napot.","tags":["normal"],"unlock":"","important":false},{"index":5,"nodeId":"s1_attack_start","choiceId":"s1_route_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Keresés","short":"A térképet követed","full":"Alaposabban összeveted a térképet a környezettel.","tags":["critical"],"unlock":"","important":true},{"index":6,"nodeId":"s1_route_map_scene","choiceId":"s1_route_map_continue","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Tovább a csapóajtóhoz","full":"Tovább a csapóajtóhoz.","tags":["normal"],"unlock":"","important":false},{"index":7,"nodeId":"s1_site_found_map","choiceId":"s1_take_sealed_case_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"A bunkerben","short":"A régi pálcát viszed el","full":"Egy bársonyba csomagolt, csontfoglalatba zárt, régi pálcát viszel el a tárolóból.","tags":["critical"],"unlock":"","important":true},{"index":8,"nodeId":"s1_return_omens_normal","choiceId":"s1_begin_attack_normal","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Felkészülsz a támadásra","full":"Felkészülsz a támadásra.","tags":["normal"],"unlock":"","important":false},{"index":9,"nodeId":"s1_attack_choice_normal","choiceId":"s1_try_escape","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Az inferusok","short":"Destination mellett maradsz","full":"Szorosan Destination mellett maradsz.","tags":["critical"],"unlock":"","important":true},{"index":10,"nodeId":"s1_escape_attempt_normal","choiceId":"s1_escape_separate","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Menekülés","short":"Levágod az utat","full":"Levágod az utat a kukoricasoron.","tags":["critical"],"unlock":"","important":true},{"index":11,"nodeId":"s1_eye_escape_separated","choiceId":"s1_after_eye_escape_separated","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Destination hangját követed a sötétedő világban","full":"Destination hangját követed a sötétedő világban.","tags":["normal"],"unlock":"","important":false},{"index":12,"nodeId":"s1_cut_to_chapter_two","choiceId":"s1_cut_enter_chapter_two","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Kalandod itt véget ér","full":"Kalandod itt véget ér...","tags":["normal"],"unlock":"","important":false},{"index":13,"nodeId":"s2_wake_after_attack","choiceId":"s2_enter_normal_after_escape_separated","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Magadhoz térsz","full":"Magadhoz térsz.","tags":["normal"],"unlock":"Az előző útvonal alapján jelenik meg","important":false},{"index":14,"nodeId":"s2_wake_normal","choiceId":"s2_normal_accept_decision","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A szem eredete","short":"Elfogadod a döntést","full":"Elfogadod a döntését, és várakozol.","tags":["normal"],"unlock":"","important":true},{"index":15,"nodeId":"s2_preprocedure_normal","choiceId":"s2_normal_drink_potion","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A procedúra előtt","short":"Megiszod a bájitalt","full":"Megiszod a bájitalt.","tags":["normal"],"unlock":"","important":true},{"index":16,"nodeId":"s2_implant_normal","choiceId":"s2_normal_finish_implant","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Lehunyod a megmaradt szemed","full":"Lehunyod a megmaradt szemed.","tags":["normal"],"unlock":"","important":false},{"index":17,"nodeId":"s2_eye_implanted_normal","choiceId":"s2_normal_enter_final_chapter","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Néhány nappal később","full":"Néhány nappal később.","tags":["normal"],"unlock":"","important":false},{"index":18,"nodeId":"s3_normal_recovery","choiceId":"s3_normal_test_power","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Mit teszel a szemmel?","short":"Tudatosan használod","full":"Megpróbálod tudatosan használni a képességét.","tags":["critical"],"unlock":"","important":true},{"index":19,"nodeId":"s3_harness_eye","choiceId":"s3_fulfill_eye_visions","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"A szem hatalma","short":"Valóra váltod a képeket","full":"Valóra váltod a látomásban lévő képeket.","tags":["critical"],"unlock":"","important":true}]},{"order":8,"endingId":"WHAT_OTHERS_DONT_SEE","title":"Három testvér","summary":"Felfedezed Desolationt, és végül visszatérsz hozzá.","requirements":[],"shortCount":12,"fullCount":22,"steps":[{"index":1,"nodeId":"s1_return_to_estate","choiceId":"s1_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Rádió","short":"Ammani rádió","full":"Megpróbálsz befogni egy ammani varázsrádiót.","tags":["normal"],"unlock":"","important":true},{"index":2,"nodeId":"s1_radio_amman_reaction","choiceId":"s1_after_radio_amman","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"A könyvespolcon böngészel","full":"A könyvespolcon böngészel.","tags":["normal"],"unlock":"","important":false},{"index":3,"nodeId":"s1_first_book","choiceId":"s1_kutatnaplo","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Könyv","short":"Kutatónapló","full":"Kutatónapló","tags":["critical"],"unlock":"","important":true},{"index":4,"nodeId":"s1_kutatnaplo_reaction","choiceId":"s1_after_kutatnaplo","chapter":{"id":"0","label":"0. fejezet · Nebraska"},"label":"Nebraska","short":"Folytatod a napot","full":"Folytatod a napot.","tags":["normal"],"unlock":"","important":false},{"index":5,"nodeId":"s1_attack_start","choiceId":"s1_route_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Keresés","short":"A térképet követed","full":"Alaposabban összeveted a térképet a környezettel.","tags":["critical"],"unlock":"","important":true},{"index":6,"nodeId":"s1_route_map_scene","choiceId":"s1_route_map_continue","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Tovább a csapóajtóhoz","full":"Tovább a csapóajtóhoz.","tags":["normal"],"unlock":"","important":false},{"index":7,"nodeId":"s1_site_found_map","choiceId":"s1_take_control_rod_map","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"A bunkerben","short":"A diafilmet viszed el","full":"A beomlott műhelyből viszed el a diafilmet, amit apád kért.","tags":["critical"],"unlock":"","important":true},{"index":8,"nodeId":"s1_return_omens_normal","choiceId":"s1_begin_attack_normal","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Felkészülsz a támadásra","full":"Felkészülsz a támadásra.","tags":["normal"],"unlock":"","important":false},{"index":9,"nodeId":"s1_attack_choice_normal","choiceId":"s1_try_escape","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Az inferusok","short":"Destination mellett maradsz","full":"Szorosan Destination mellett maradsz.","tags":["critical"],"unlock":"","important":true},{"index":10,"nodeId":"s1_escape_attempt_normal","choiceId":"s1_escape_separate","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Menekülés","short":"Levágod az utat","full":"Levágod az utat a kukoricasoron.","tags":["critical"],"unlock":"","important":true},{"index":11,"nodeId":"s1_eye_escape_separated","choiceId":"s1_after_eye_escape_separated","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Destination hangját követed a sötétedő világban","full":"Destination hangját követed a sötétedő világban.","tags":["normal"],"unlock":"","important":false},{"index":12,"nodeId":"s1_cut_to_chapter_two","choiceId":"s1_cut_enter_chapter_two","chapter":{"id":"I","label":"I. fejezet · Aratás"},"label":"Aratás","short":"Kalandod itt véget ér","full":"Kalandod itt véget ér...","tags":["normal"],"unlock":"","important":false},{"index":13,"nodeId":"s2_wake_after_attack","choiceId":"s2_enter_normal_after_escape_separated","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Magadhoz térsz","full":"Magadhoz térsz.","tags":["normal"],"unlock":"Az előző útvonal alapján jelenik meg","important":false},{"index":14,"nodeId":"s2_wake_normal","choiceId":"s2_normal_accept_decision","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A szem eredete","short":"Elfogadod a döntést","full":"Elfogadod a döntését, és várakozol.","tags":["normal"],"unlock":"","important":true},{"index":15,"nodeId":"s2_preprocedure_normal","choiceId":"s2_normal_follow_control_rod","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A procedúra előtt","short":"Követed a hangot","full":"Mi ez a hang?","tags":["secret","special","critical"],"unlock":"Kutatónapló + Diafilm","important":true},{"index":16,"nodeId":"s2_hidden_twin_normal","choiceId":"s2_normal_enter_hidden_twin_room","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"A rejtett szoba","short":"Belépsz a szobába","full":"Belépsz a helyiségbe.","tags":["critical"],"unlock":"","important":true},{"index":17,"nodeId":"s2_hidden_twin_revealed_normal","choiceId":"s2_normal_try_free_twin","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"Desolation","short":"Megpróbálod kiszabadítani","full":"Megpróbálod kiszabadítani.","tags":["critical"],"unlock":"","important":true},{"index":18,"nodeId":"s2_twin_attack_normal","choiceId":"s2_normal_return_after_twin_attack","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Visszamész vele a procedúrához","full":"Visszamész vele a procedúrához.","tags":["normal"],"unlock":"","important":false},{"index":19,"nodeId":"s2_implant_normal","choiceId":"s2_normal_finish_implant","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Lehunyod a megmaradt szemed","full":"Lehunyod a megmaradt szemed.","tags":["normal"],"unlock":"","important":false},{"index":20,"nodeId":"s2_eye_implanted_normal","choiceId":"s2_normal_enter_final_chapter","chapter":{"id":"II","label":"II. fejezet · Anya"},"label":"II. Fejezet — Anya","short":"Néhány nappal később","full":"Néhány nappal később.","tags":["normal"],"unlock":"","important":false},{"index":21,"nodeId":"s3_normal_recovery","choiceId":"s3_normal_follow_twin_suffering","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Mit teszel a szemmel?","short":"Utánajársz Desolationnak","full":"Megkeresed, miért mutatja újra és újra a bezárt bátyád szenvedését.","tags":["critical"],"unlock":"Desolationt már láttad","important":true},{"index":22,"nodeId":"s3_twin_suffering","choiceId":"s3_offer_twin_company","chapter":{"id":"III","label":"III. fejezet · A szem"},"label":"Desolation szenvedése","short":"Visszamész Desolationhoz","full":"Elmész hozzá a testvéreddel.","tags":["critical"],"unlock":"","important":true}]}],"special":[{"type":"Titkos útvonal","title":"Déjà Vu","condition":"Előbb fedezd fel a Megváltás befejezést.","location":"I. fejezet · Keresés","note":"Ekkor jelenik meg a „Pontosan tudod, merre kell mennetek” választás."},{"type":"Időzített titok","title":"A tanú","condition":"A nagy látomásnál maradj 7 percig ugyanazon a jeleneten.","location":"III. fejezet · A nagy látomás","note":"A várakozás után jelenik meg a rejtett választás."},{"type":"Döntéskombináció","title":"Desolation szobája","condition":"Olvasd el a Kutatónaplót, majd vidd el a diafilmet.","location":"II. fejezet · A procedúra előtt","note":"A „Mi ez a hang?” választás vezeti el Elegyt a rejtett szobához."},{"type":"Easter egg","title":"Komolyzenei adó","condition":"A tanú vagy A látó örököse befejezés után.","location":"0. fejezet · Rádió","note":"A látó operaénekesi múltjára utal."},{"type":"Easter egg","title":"Statikus rádióadás","condition":"A tanú befejezés után.","location":"0. fejezet · Rádió","note":"A műsorvezető hét percet említ."},{"type":"Easter egg","title":"Madárijesztő","condition":"Az önbeteljesítő befejezés után.","location":"I. fejezet · Keresés","note":"Az önbeteljesítő látomás motívuma visszatér."},{"type":"Teljesítés","title":"ΞЖѮϠҖӁӜӾ","condition":"Mind a 8 befejezés felfedezése után.","location":"0. fejezet · Rádió","note":"Avagy démonisten idézés (by Desolation user). A rádióban az összes út motívumai összekeverednek."}]};

/*
 * A GUIDE_DATA a story JSON-ból korábban előállított, beágyazott adat.
 * Az oldal nem tölti be újra automatikusan a story.json fájlt.
 *
 * Ezek a szabályok azokat a lépéseket jelölik, amelyeknél az adott
 * befejezéshez több választás is ugyanúgy megfelelő.
 */
const FLEXIBLE_ROUTE_RULES = [
  {
    endings: "all",
    nodeIds: ["s1_return_to_estate"],
    title: "Mindegy, milyen rádiót hallgatsz",
    note: "A rádióválasztás nem befolyásolja ezt a befejezést. Bármelyik éppen elérhető rádióopciót választhatod.",
    choices: ["Ammani rádió", "Helyi rádió", "Kikapcsolod", "Az addig feloldott easter eggek"]
  },
  {
    endings: "except-three-siblings",
    nodeIds: ["s1_first_book"],
    title: "Mindegy, mit olvasol",
    note: "Ehhez a befejezéshez a könyvválasztás nem számít.",
    choices: ["Bogár Bárd meséi", "Kutatónapló", "Nem olvasol semmit"]
  },
  {
    endings: "normal",
    nodeIds: ["s1_attack_start"],
    title: "Bármelyik normál keresési út jó",
    note: "A három normál útvonal ugyanúgy elvezet ehhez a befejezéshez. A titkos Déjà Vu választás nem tartozik közéjük.",
    choices: ["A térképet követed", "Destinationt követed", "Tarolóátkot használsz"]
  },
  {
    endings: "except-three-siblings",
    nodeIds: [
      "s1_site_found_map",
      "s1_site_found_des",
      "s1_site_found_clear",
      "s1_site_found_dejavu"
    ],
    title: "Mindegy, melyik tárgyat viszed el",
    note: "A választott tárgy ennél a befejezésnél nem változtatja meg az útvonal végét.",
    choices: ["A régi pálca", "A diafilm"]
  },
  {
    endings: "normal",
    nodeIds: ["s1_attack_choice_normal"],
    title: "Mindegy, hogyan védekezel",
    note: "Mindkét harci megoldás megfelelő.",
    choices: ["Destination mellett maradsz", "Tűzzel tartod fel az inferusokat"]
  },
  {
    endings: "normal",
    nodeIds: ["s1_escape_attempt_normal", "s1_fire_attempt_normal"],
    title: "A következő harci döntés is mindegy",
    note: "Az előző választástól függően más gombokat látsz, de mindegyik továbbvezet.",
    choices: [
      "Menekülésnél: levágod az utat vagy együtt maradtok",
      "Tűznél: tűzgyűrű vagy tűzkáosz"
    ]
  },
  {
    endings: "dejavu",
    nodeIds: ["s1_attack_choice_dejavu"],
    title: "Mindegy, melyik varázslatot használod",
    note: "A Déjà Vu útvonalon mindkét első támadóvarázslat megfelelő.",
    choices: ["Confringo", "Glacius"]
  },
  {
    endings: "dejavu",
    nodeIds: ["s1_confringo_attempt_dejavu", "s1_glacius_attempt_dejavu"],
    title: "A következő harci döntés is mindegy",
    note: "A megjelenő második harci választások közül bármelyiket választhatod.",
    choices: [
      "Confringo után: tűzkör vagy Flipendo",
      "Glacius után: Arresto Momentum vagy fagyott padló"
    ]
  },
  {
    endings: "normal",
    nodeIds: ["s2_wake_normal"],
    title: "Mindegy, rákérdezel-e a szemre",
    note: "Rákérdezhetsz a szem eredetére, vagy rögtön elfogadhatod anyád döntését. Ha tovább kérdezel, a következő válasz sem befolyásolja a befejezést.",
    choices: ["Rákérdezel a szem eredetére", "Elfogadod a döntést"]
  },
  {
    endings: ["WHAT_OTHERS_DONT_SEE"],
    nodeIds: ["s2_hidden_twin_revealed_normal"],
    title: "Mindegy, hogyan reagálsz Desolationra",
    note: "Mindkét reakció után folytatható a Három testvér útvonala.",
    choices: ["Megpróbálod kiszabadítani", "Megrémülsz és hátrálsz"]
  }
];

function endingMatchesFlexibleRule(endingId, selector) {
  const dejavuEndings = new Set([
    "DEJAVU_LOOP_DEATH",
    "DEJAVU_COEXIST"
  ]);

  if (selector === "all") return true;
  if (selector === "normal") return !dejavuEndings.has(endingId);
  if (selector === "dejavu") return dejavuEndings.has(endingId);
  if (selector === "except-three-siblings") {
    return endingId !== "WHAT_OTHERS_DONT_SEE";
  }

  return Array.isArray(selector) && selector.includes(endingId);
}

function applyFlexibleRouteRules() {
  GUIDE_DATA.endings.forEach((ending) => {
    ending.steps.forEach((step) => {
      const rule = FLEXIBLE_ROUTE_RULES.find((item) => {
        return (
          endingMatchesFlexibleRule(ending.endingId, item.endings) &&
          item.nodeIds.includes(step.nodeId)
        );
      });

      if (!rule) return;

      step.flexible = {
        note: rule.note,
        choices: [...rule.choices]
      };

      step.short = rule.title;
    });
  });
}

applyFlexibleRouteRules();


function applyCanonInformation() {
  const canonEnding = GUIDE_DATA.endings.find(
    (ending) => ending.endingId === "PATIENT_WITNESS"
  );

  if (canonEnding) {
    canonEnding.canon = true;
    canonEnding.requirements = [
      "Maradj 7 percig a nagy látomás jelenetén. Ezután megjelenik egy titkos opció, amely A Tanú befejezést adja."
    ];

    canonEnding.steps.forEach((step) => {
      if (
        step.choiceId === "s3_wait_for_eye_message" ||
        step.choiceId === "s3_wait_for_eye_message_after_twin"
      ) {
        step.unlock =
          "Maradj ezen a jeleneten 7 percig. Ezután megjelenik egy titkos opció; ezt választva kapod meg A Tanú befejezést, amely a történet CANON vége.";
      }
    });
  }

  const canonSecret = GUIDE_DATA.special.find(
    (item) => item.title === "A tanú"
  );

  if (canonSecret) {
    canonSecret.condition =
      "A nagy látomásnál maradj 7 percig ugyanazon a jeleneten.";
    canonSecret.note =
      "A 7 perc letelte után megjelenik egy titkos opció. Ezt választva kapod meg A Tanú befejezést, amely a történet CANON vége.";
  }
}

applyCanonInformation();


const ENDING_COLORS = [
  "#b94f6d",
  "#a7bdd2",
  "#b83755",
  "#8f73aa",
  "#a85f7e",
  "#b99a55",
  "#8d9f65",
  "#7ba59d"
];

const state = {
  endingId: GUIDE_DATA.endings[0].endingId,
  view: "short"
};

const elements = {
  endingPicker: document.getElementById("endingPicker"),
  endingNumber: document.getElementById("endingNumber"),
  endingTitle: document.getElementById("endingTitle"),
  endingSummary: document.getElementById("endingSummary"),
  requirementList: document.getElementById("requirementList"),
  stepCount: document.getElementById("stepCount"),
  route: document.getElementById("route"),
  endingResult: document.getElementById("endingResult"),
  viewButtons: [...document.querySelectorAll("[data-view]")],
  secretList: document.getElementById("secretList")
};

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function selectedEnding() {
  return GUIDE_DATA.endings.find((ending) => ending.endingId === state.endingId);
}

function renderEndingPicker() {
  elements.endingPicker.innerHTML = "";

  GUIDE_DATA.endings.forEach((ending, index) => {
    const button = createElement("button", "ending-button");
    button.type = "button";
    button.dataset.endingId = ending.endingId;
    button.style.setProperty("--ending-accent", ENDING_COLORS[index]);
    button.classList.toggle("is-active", ending.endingId === state.endingId);

    button.append(
      createElement(
        "span",
        "ending-button__number",
        ending.canon
          ? `${String(ending.order).padStart(2, "0")} · CANON`
          : `${String(ending.order).padStart(2, "0")} · befejezés`
      ),
      createElement("span", "ending-button__title", ending.title)
    );

    button.addEventListener("click", () => {
      state.endingId = ending.endingId;
      render();
      document.querySelector(".route-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    elements.endingPicker.appendChild(button);
  });
}

function renderRequirements(ending) {
  elements.requirementList.innerHTML = "";

  const requirements = ending.requirements.length
    ? ending.requirements
    : ["Nincs korábbi befejezéshez kötve"];

  requirements.forEach((requirement, index) => {
    const chip = createElement(
      "span",
      `requirement-chip${ending.requirements.length ? "" : " requirement-chip--none"}`,
      requirement
    );
    elements.requirementList.appendChild(chip);
  });
}

function markForTag(tag) {
  if (tag === "critical") return ["step-mark step-mark--critical", "†"];
  if (tag === "secret") return ["step-mark step-mark--secret", "◇"];
  if (tag === "easter-egg" || tag === "completion") return ["step-mark step-mark--easter", "Ξ"];
  if (tag === "special") return ["step-mark step-mark--secret", "★"];
  return null;
}

function renderStep(step, visibleIndex) {
  const details = createElement(
    "details",
    `route-step${step.important ? "" : " route-step--transition"}`
  );

  const summary = document.createElement("summary");
  const index = createElement("span", "route-step__index", String(visibleIndex).padStart(2, "0"));

  const text = createElement("span", "route-step__text");
  text.append(
    createElement("span", "route-step__label", step.label),
    createElement("span", "route-step__choice", step.short)
  );

  const marks = createElement("span", "route-step__marks");
  const usedMarks = new Set();

  step.tags.forEach((tag) => {
    const markData = markForTag(tag);
    if (!markData || usedMarks.has(markData[1])) return;
    usedMarks.add(markData[1]);
    marks.appendChild(createElement("span", markData[0], markData[1]));
  });

  if (step.unlock && !usedMarks.has("◇")) {
    marks.appendChild(createElement("span", "step-mark step-mark--secret", "◇"));
  }

  if (step.flexible) {
    marks.appendChild(
      createElement("span", "step-mark", "mindegy")
    );
  }

  summary.append(index, text, marks);

  const detail = createElement("div", "route-step__detail");
  detail.appendChild(
    createElement(
      "p",
      "",
      step.flexible?.note || step.full
    )
  );

  if (
    step.unlock ||
    step.flexible?.choices?.length
  ) {
    const list = document.createElement("dl");

    if (step.flexible?.choices?.length) {
      list.append(
        createElement("dt", "", "Jó választások"),
        createElement(
          "dd",
          "",
          step.flexible.choices.join(" · ")
        )
      );
    }

    if (step.unlock) {
      list.append(
        createElement("dt", "", "Feltétel"),
        createElement("dd", "", step.unlock)
      );
    }

    detail.appendChild(list);
  }

  details.append(summary, detail);
  return details;
}

function renderRoute() {
  const ending = selectedEnding();
  const steps = state.view === "short"
    ? ending.steps.filter((step) => step.important)
    : ending.steps;

  elements.route.innerHTML = "";

  let currentChapter = null;
  steps.forEach((step, index) => {
    if (step.chapter.id !== currentChapter) {
      currentChapter = step.chapter.id;
      elements.route.appendChild(
        createElement("div", "chapter-divider", step.chapter.label)
      );
    }

    elements.route.appendChild(renderStep(step, index + 1));
  });

  elements.stepCount.textContent = `${steps.length} lépés`;
}

function renderSelectedEnding() {
  const ending = selectedEnding();

  elements.endingNumber.textContent = String(ending.order).padStart(2, "0");
  elements.endingTitle.textContent = ending.title;
  elements.endingSummary.textContent = ending.summary;
  elements.endingResult.textContent = ending.title;

  renderRequirements(ending);
  renderRoute();
}

function renderSecrets() {
  elements.secretList.innerHTML = "";

  GUIDE_DATA.special.forEach((item) => {
    const details = createElement("details", "secret-card");
    const summary = document.createElement("summary");

    const title = createElement("span");
    title.append(
      createElement("span", "secret-card__type", item.type),
      createElement("span", "secret-card__title", item.title)
    );

    summary.append(
      title,
      createElement("span", "secret-card__location", item.location)
    );

    const body = createElement("div", "secret-card__body");
    body.append(
      createElement("div", "secret-card__condition", item.condition),
      createElement("p", "", item.note)
    );

    details.append(summary, body);
    elements.secretList.appendChild(details);
  });
}

function renderViewButtons() {
  elements.viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === state.view);
  });
}

function render() {
  renderEndingPicker();
  renderSelectedEnding();
  renderViewButtons();
}

elements.viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    renderSelectedEnding();
    renderViewButtons();
  });
});

renderSecrets();
render();
