# État du projet — Pera Pera

## Vision

Un compagnon d'apprentissage du japonais — pas un simple clone d'Anki.
Kanjis, vocabulaire (noms/verbes/adjectifs/expressions), grammaire. FSRS,
cycle de vie du kanji (découverte → écriture → prêt pour révision),
multi-profils, entraînement libre, mode Cahier, module Explorer. La spec
complète a été figée (V3) dans une conversation précédente ; la grammaire
comme catégorie de contenu a été ajoutée après coup — pas encore modélisée
en détail côté données, juste présente dans l'UI mock pour l'instant. Ce
fichier ne résume que l'essentiel pour continuer à coder sans avoir à tout
ré-expliquer.

## 🚧 EN COURS : expansion complète N5→N1 (kanjis → vocabulaire → grammaire)

**N5 et N4 terminés** (voir plus bas). Depuis, demande explicite de
poursuivre avec **N3, puis N2, puis N1**, "step by step" — chantier
nettement plus gros que N5+N4 réunis (N3 seul : 341 nouveaux kanjis, à
comparer aux 181 de N4 ; N2 et N1 s'annoncent au moins aussi gros,
voire plus pour N1). Suivi détaillé de N3 juste après la section
N5+N4 ci-dessous, avant "Ce qui est fait".

Demande explicite de l'utilisateur : couvrir les listes JLPT N5+N4
**officielles complètes**, pas un échantillon (décision confirmée après
avertissement sur l'ampleur réelle — voir plus bas). Gros chantier,
avancé par lots sur plusieurs sessions ("continue par blocs", choix
explicite de l'utilisateur). Suivi précis ici pour reprendre sans tout
réexpliquer.

**Sources figées** (JLPT n'a pas de liste officielle publiée — choisi
une source cohérente et gardé) :
- N5 : liste de 103 kanjis, nihongoichiban.com (`安一飲右雨駅円火花下何会外学間気九休魚金空月見言古五後午語校口行高国今左三山四子耳時七車社手週十出書女小少上食新人水生西川千先前足多大男中長天店電土東道読南二日入年買白八半百父分聞母北木本毎万名目友来立六話`)
- N4 : liste de 181 kanjis, même source (`悪暗医意以引院員運英映遠屋音歌夏家画海回開界楽館漢寒顔帰起究急牛去強教京業近銀区計兄軽犬研県建験元工広考光好合黒菜作産紙思姉止市仕死使始試私字自事持室質写者借弱首主秋集習終住重春所暑場乗色森心親真進図青正声世赤夕切説洗早走送族村体太待貸台代題短知地池茶着昼注町鳥朝通弟低転田都度答冬頭同動堂働特肉売発飯病品不風服物文別勉便歩方妹味民明門問夜野薬有曜用洋理旅料力林`)
- **Kanjis déjà présents avant ce chantier gardés à leur niveau
  d'origine** même s'il diffère de cette source (会・買 restent N4 dans
  le mock alors que nihongoichiban les classe N5) — pas de réorganisation
  disruptive pour un désaccord entre sources qui n'ont de toute façon
  aucune autorité officielle
- Codepoints Unicode calculés par script (pas à la main, source d'erreurs
  à ce volume) — voir pipeline ci-dessous

**Pipeline mis en place** (scratchpad de session, à reconstruire si
besoin dans une session future — fichiers non versionnés dans le repo) :
1. `fetch_strokes.mjs` — télécharge et parse les SVG KanjiVG en direct
   (`raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/<codepoint>.svg`)
   via `fetch()` Node, extrait les `d` des `<path>` par regex. Beaucoup
   plus rapide et fiable que WebFetch pour ce volume (277 kanjis
   récupérés sans une seule erreur)
2. Contenu linguistique (sens/lectures/radical/mots fréquents/exemples)
   rédigé à la main par lots de 12 kanjis, dans des fichiers `.mjs`
   exportant un tableau d'objets (sans `strokePaths`)
3. `merge_kanji.mjs` — fusionne un lot avec les tracés récupérés
   (indexés par caractère), vérifie que `strokeCount` correspond bien à
   `strokePaths.length` (avertit sinon), imprime des littéraux d'objet
   TS prêts à coller
4. Script Node one-off qui insère le texte généré juste avant le `]`
   fermant de `mockKanjiList` dans `mockKanji.ts`, puis `npx tsc -b`
   pour valider
5. Après chaque lot : vérification qu'aucun `id`/`character` ne se
   duplique (`grep`/script de comptage)

**Progression kanjis** (mise à jour à chaque lot, cocher au fur et à
mesure) :
- [x] N5 — 101/101 (96 nouveaux + 5 déjà présents : 人大山川木)
- [x] N4 — **TERMINÉ. 181/181 kanjis** (179 nouveaux + 2 déjà présents :
  会買). Tous avec `themes` renseigné (vérifié : 0 entrée sans champ
  lexical sur les 288 kanjis toutes niveaux confondus). 0 doublon
  d'id/caractère sur l'ensemble.
  Pipeline inchangé : tracés déjà récupérés pour les 181 kanjis dès le
  début (`n4_strokes_by_char.json`/`n4_strokes_array.json` dans le
  scratchpad — reconstruits depuis `n4_strokes.json`, indexé par
  position et pas par caractère dans ce fichier-là), donc plus besoin
  de retélécharger quoi que ce soit, juste rédiger le contenu
  linguistique par lots comme avant. **Nouveau depuis cette reprise** :
  chaque kanji doit maintenant inclure `themes: string[]` (champ
  obligatoire depuis l'ajout des champs lexicaux, voir plus haut) — pas
  seulement les nouveaux, c'est déjà fait pour les 241 kanjis
  existants, il faut juste continuer à en assigner pour chaque nouveau

- [x] N3 — **TERMINÉ, 341/341 nouveaux kanjis (100%)**. Source
  **différente** de N5/N4 (nihongoichiban.com n'a pas donné un compte
  cohérent pour N3 — sa page dédiée affirme "181 kanjis" dans le texte
  mais contient en réalité 580 caractères dans le tableau lui-même une
  fois extraits proprement du HTML brut, un écart jamais expliqué ; pas
  utilisée pour éviter de mélanger involontairement du contenu N2/N1
  dedans). **jlptsensei.com** utilisé à la place : liste dédiée N3,
  370 kanjis, total confirmé par un deuxième site indépendant
  (nihongo-career.com, "370 at N3") avant de s'y fier — extraction
  fiable en parsant le HTML brut par script (`class="jl-td-k"`, table
  paginée par 100 sur 4 pages `/jlpt-n3-kanji-list/page/N/`), **pas**
  via un résumé WebFetch/LLM de la page (le premier essai sur
  nihongoichiban avait déjà montré qu'un résumé de page peut
  halluciner/mal compter sur un tableau aussi long — d'où le
  changement de méthode : toujours parser le HTML brut par regex pour
  ce genre de liste, jamais faire confiance à un compte rendu de
  contenu par un modèle).
  - **29 des 370 kanjis jlptsensei existaient déjà** dans `mockKanji.ts`
    sous un autre niveau (ex. 全/感 déjà présents comme placeholders
    N3, 済/域 comme N2, plus d'autres déjà classés N5/N4 par
    nihongoichiban) — **laissés à leur niveau d'origine**, même
    principe que la divergence N5/N4 documentée plus haut (pas de
    réorganisation disruptive entre deux sources sans autorité
    officielle). Reste **341 kanjis génuinement nouveaux** à écrire
    (liste dans `n3_kanji_new.json` au scratchpad).
  - Tracés KanjiVG déjà tous récupérés en un coup (`fetch_strokes_n3.mjs`,
    341/341 sans erreur, `n3_strokes_array.json`).
  - Pipeline identique à N4 (lots de 12 kanjis en `.mjs`, fusion avec
    les tracés, insertion, `tsc -b`, vérification doublons id/caractère
    après chaque lot) — script d'insertion dédié
    `insert_n3_kanji_batches.mjs <numéros de lots>` dans le scratchpad.
- [x] N2 — **TERMINÉ. 361/361 nouveaux kanjis écrits** (30 lots, 629→990
  kanjis au total dans `mockKanji.ts`). Source jlptsensei.com (même
  méthode que N3/N4 : parsing HTML brut, jamais un résumé de page) —
  374 kanjis confirmés par extraction directe du tableau sur 4 pages
  (`/jlpt-n2-kanji-list/page/N/`, 100+100+100+74), dont 13 déjà présents
  sous un autre niveau (laissés à leur niveau d'origine). Tracés
  KanjiVG récupérés en un coup (`fetch_strokes_n2.mjs`, 361/361 sans
  erreur). `tsc -b` propre, 0 doublon d'id/caractère
  (`/tmp/kanji_dupcheck.js`, vérifie les deux champs — script créé ce
  chantier).
  - **Incident détecté et corrigé en cours de route** : décalage
    d'offset lors de la lecture manuelle de `n2_kanji_new.json` par
    lots de 12 (le fichier a un nombre de lignes variable par entrée
    selon que `kunRomaji`/`kunKana` sont vides ou non, ce qui a faussé
    un `offset` de lecture manuel et fait sauter ~12 kanjis vers le
    milieu du chantier). Détecté via le script de vérification de
    caractères existants (`grep`/`filter` contre `mockKanji.ts`), pas
    via une relecture visuelle — **leçon pour N1 : toujours régénérer
    une liste "restants" via ce script après chaque lot plutôt que de
    suivre un offset de ligne à la main dans le fichier source JSON**.
    Zéro perte de données au final (aucun kanji n'a été écrit deux
    fois ni oublié), mais a nécessité un lot de rattrapage.
  Source **jlptsensei.com** à nouveau (même méthode que N3 : parser le
  HTML brut, jamais un résumé de page) — liste dédiée N2, **374 kanjis**
  confirmés par extraction directe du tableau (`class=jl-row`) sur 4
  pages (`/jlpt-n2-kanji-list/page/N/`, 100+100+100+74). **13 des 374
  existaient déjà** dans `mockKanji.ts` sous un autre niveau — laissés
  à leur niveau d'origine, même principe que N3/N4. Reste **361 kanjis
  génuinement nouveaux** (`n2_kanji_new.json` au scratchpad, avec
  onyomi/kunyomi/meaning EN bruts extraits du HTML, à traduire/enrichir
  à la main par lot). Tracés KanjiVG tous récupérés en un coup
  (`fetch_strokes_n2.mjs`, 361/361 sans erreur,
  `n2_strokes_array.json`). Pipeline identique à N3 (lots de 12 kanjis
  en `.mjs`, `insert_n2_kanji_batches.mjs <numéros de lots>` dans le
  scratchpad, `tsc -b` + vérification doublons id/caractère après
  chaque lot via `/tmp/kanji_dupcheck.js`, nouvellement créé ce
  chantier — vérifie `id` ET `character`, contrairement à un simple
  check d'id). **Collisions d'id fréquentes** (romaji+chiffre qui tombe
  sur un suffixe déjà pris par un kanji N5/N4/N3 partageant la même
  lecture on'yomi) — même classe de bug que N3/N4/N5, résolu à chaque
  fois en cherchant le prochain chiffre libre via
  `grep -oE "\"racine[0-9]*\"" mockKanji.ts | sort -V -u` avant
  d'écrire le lot suivant plutôt qu'après coup.

**Progression vocabulaire** :
- [x] N5 — **TERMINÉ. 656 nouveaux mots écrits** (+ 8 déjà présents :
  学校 天気 食べる 行く 大きい 暑い おはようございます すみません) =
  664 mots N5 au total. Les 703 lignes de la liste source ont toutes
  été traitées (index 0 à 702 inclus) ; l'écart entre 703 lignes
  source et 656 mots écrits s'explique par les suffixes/compteurs
  purement grammaticaux volontairement ignorés (～か月, ～月, ～がる,
  ～側, ～くらい, ～個, ～語, ～すぎ, ～ずつ, ～人, ～など, 何～, ～日,
  ～年, ～前, ～本, ～さん, ～だけ, ～たち) et les 2 doublons avec des
  mots déjà présents (便利, 始まる — sautés pour éviter la duplication).
  Certains compteurs ont été gardés sous forme de nom nu sans tilde
  (回, 階, 歳, 冊, 時, 度, 週間, 杯, 枚) suivant le même principe que
  documenté plus haut. Source :
  CSV `raw.githubusercontent.com/jamsinclair/open-anki-jlpt-decks/main/src/n5.csv`
  (717 lignes, dédupliqué → 703 nouveaux). Sauvegardé dans le
  scratchpad de session sous `n5_vocab_clean.json` (à retélécharger si
  le scratchpad n'existe plus, mais n'est plus nécessaire pour N5).
  Pipeline utilisé : lots
  d'environ 23-25 mots rédigés à la main (traduction FR, segments
  furigana, classification nom/verbe/adjectif/expression, conjugaison
  complète pour verbes, 3 formes pour adjectifs, 1 exemple par mot —
  volontairement 1 seul exemple, pas 2 comme les kanjis/anciens mots,
  vu le volume) dans des fichiers `.mjs`, sérialisés via
  `serialize.mjs` (même principe que `merge_kanji.mjs` mais sans fusion
  de données externes — pas de tracés à récupérer pour du vocabulaire)
  puis insérés dans `mockVocab.ts`
  - **Suffixes/préfixes purs de grammaire ignorés** (pas des mots de
    vocabulaire autonomes) : `お～`, `～か月`, `～月`, `～がる`, `～側`.
    `～回`/`～階` gardés mais réécrits sans le tilde (回/階), comme mots
    autonomes ("fois", "étage") plutôt que comme suffixes de compteur
  - **Cas ambigus tranchés à la main** : adjectifs irréguliers/pré-nominaux
    qui ne se conjuguent pas comme un adjectif normal (大きな, 同じ)
    laissés **sans** `conjugations` plutôt que d'inventer des formes
    fausses ; homophones distincts gardés comme entrées séparées avec
    id différent (居る/要る tous deux いる ; 掛ける/かける tous deux
    かける)
- [x] N3 — **TERMINÉ. 1220 nouveaux mots écrits** (1236 mots listés
  dans la source, ~16 exclus car doublons déjà couverts sous un autre
  id/catégorie dans un lot précédent — ex. 覆う listé à la fois en nom
  et en verbe dans la source, ou des mots déjà présents en N5 comme
  明日/すみません — jamais de doublon silencieux, chaque exclusion
  volontaire et documentée dans les commentaires de lot). 49 lots de
  ~22-25 mots, pipeline identique à N4/N5. `tsc -b` propre, 0 doublon
  d'id sur les 2522 mots totaux du fichier (656 N5 + 634 N4 + 1220 N3
  + quelques mots hérités).
  **Piège rencontré et résolu** : passé ~2200 entrées, `mockVocabList:
  VocabWord[] = [...]` en un seul littéral géant a fait échouer
  `tsc -b` avec `TS2590: Expression produces a union type that is too
  complex to represent` — limite structurelle de TypeScript sur les
  très gros littéraux de tableau, pas une erreur de données. Corrigé
  en restructurant `mockVocab.ts` : le tableau est maintenant scindé
  en plusieurs `const mockVocabPartN: VocabWord[] = [...]` de 400
  entrées chacun, puis `export const mockVocabList: VocabWord[] =
  [...mockVocabPart1, ...mockVocabPart2, ...]`. Script utilisé :
  `scratchpad/split_mockvocab.mjs` (parcourt les accolades/tableaux en
  respectant les chaînes de caractères pour ne pas casser la
  structure, zéro perte de données). `insert_n3_vocab_batches.mjs`
  continue de fonctionner tel quel en ciblant le dernier
  `mockVocabPartN` — mais **attention** : rejouer `split_mockvocab.mjs`
  tel quel sur un fichier **déjà chunké** casse tout (le script
  cherche un unique littéral `mockVocabList: VocabWord[] = [...]`, or
  cette expression est devenue `[...mockVocabPart1, ...]` — un tableau
  de *spreads*, pas d'objets — donc 0 entrée trouvée et le fichier est
  réécrit avec une liste vide). Repéré immédiatement car une sauvegarde
  avait été prise juste avant (`cp` manuel dans le scratchpad) —
  restauré sans perte, puis un second script dédié
  `scratchpad/rebalance_mockvocab.mjs` a été écrit spécifiquement pour
  rééquilibrer un fichier déjà scindé (relit tous les
  `mockVocabPartN` existants, réassemble, rescinde en chunks de 400).
  Fichier maintenant en 7 chunks (400×6 + 122), `tsc -b` propre. **À
  toujours utiliser `rebalance_mockvocab.mjs` (jamais `split_mockvocab.mjs`)
  pour tout rééquilibrage futur**, et toujours prendre une sauvegarde
  manuelle avant une opération de restructuration de fichier aussi
  large. Le même risque de complexité TS existe pour `mockKanji.ts` et
  `mockGrammar.ts` s'ils grossissent autant — à garder en tête pour
  N2/N1.
  Source
  **différente** de N5/N4 : le CSV `n3.csv` du même dépôt GitHub
  (`jamsinclair/open-anki-jlpt-decks`) s'est révélé **non fiable** — à
  la différence de `n4.csv`/`n5.csv` qui utilisent le tag moderne
  `JLPT_N4`/`JLPT_N5`, `n3.csv` (et `n2.csv`/`n1.csv`) ne contiennent
  **aucun** tag `JLPT_N3` moderne, seulement des tags de l'ancien
  système (級 2/3/1) — vérifié par grep avant de s'y fier (leçon
  N3-kanjis appliquée à nouveau : toujours vérifier qu'une source
  correspond vraiment au niveau annoncé). Remplacé par **la liste
  cotoacademy.com** (`cotoacademy.com/jlpt-n3-vocabulary/`), qui
  liste spécifiquement le N3 moderne : 5 tableaux HTML par catégorie
  (noms 1068, verbes 186, adjectifs 67, adverbes 89, mots d'emprunt
  85) = 1495 mots au total, extraits par regex sur le HTML brut (pas
  de résumé LLM). Après déduplication contre les 1302 mots N5+N4 déjà
  écrits, **1236 mots génuinement nouveaux** pour N3
  (`n3_vocab_new.json` dans le scratchpad, avec catégorie par mot
  pour accélérer la classification nom/verbe/adjectif/adverbe).
  jlptsensei.com (source utilisée pour les kanjis N3) a aussi une
  liste de vocabulaire N3 mais s'est avérée **trop courte** (192 mots
  seulement, sur 2 pages, pagination cassée après) — écartée comme
  non représentative après comparaison avec cotoacademy et les
  estimations trouvées par recherche web (~1000+ mots N3 spécifiques).
  Pipeline identique à N4 (lots de 25 mots en `.mjs`, format compact
  une ligne par entrée, `serialize`+`insert_n3_vocab_batches.mjs`,
  vérification doublons id après chaque lot). Règle furigana : comme
  N4, mais l'ensemble « connu » est maintenant N5+N4+N3 (625 kanjis,
  `known_n5_n4_n3_kanji.json`, recalculé depuis `mockKanji.ts`
  maintenant que les 341 kanjis N3 sont tous écrits).
- [x] N2 — **TERMINÉ**. cotoacademy.com (source
  N3 gagnante) n'a **pas** de page dédiée `/jlpt-n2-vocabulary-list/`
  (404) — recherché mais aucune liste tabulaire équivalente trouvée sur
  leur site pour N2. jlptsensei.com N2 vocab **rejeté** : même défaut
  que leur liste N3 déjà rencontré — la page affiche "6,000 words"
  (chiffre cumulatif tous niveaux, pas spécifique N2) mais ne contient
  réellement que **99 lignes** sur une seule page, sans pagination
  (vérifié par extraction directe, pas par confiance dans le texte
  affiché). japanesetest4you.com N2 : page récupérée mais **contenu
  vide** côté HTML brut (probablement rendu JS côté client, aucune
  table ni contenu d'article présent dans le HTML statique récupéré
  par `curl`) — abandonné. Source retenue :
  **tanos.co.uk** (référence JLPT classique, largement utilisée), via
  le dépôt GitHub `Bluskyo/JLPT_Vocabulary` qui republie les PDF tanos
  convertis en CSV (`data/vocab/results/JLPT_vocab_ALL.csv`, colonnes
  Kanji/Reading/Level où Level 1-5 correspond directement à N1-N5,
  confirmé par la distribution des tailles : 3475/1846/1835/649/700,
  cohérent avec les proportions connues N1>N2≈N3>N4≈N5). **Défaut
  mineur détecté et corrigé** : quelques lignes corrompues par le
  parsing PDF→CSV d'origine (mots coupés en fragments, ex. アイデア
  scindé en アイ + ディア sur deux lignes séparées) — <1% des lignes
  (9 sur 1846 pour le niveau 2), filtrées à la main (fragments
  kana-seuls d'un caractère, doublons exacts). 1846 mots N2 bruts →
  1770 après nettoyage → **1753 mots génuinement nouveaux** après
  déduplication contre les 2522 mots N5+N4+N3 déjà écrits
  (`n2_vocab_new.json` au scratchpad, colonnes kanji/reading
  seulement — **pas** de sens/catégorie fournis par cette source,
  contrairement à cotoacademy pour N3 ; sens et classification
  nom/verbe/adjectif à déterminer à la main pendant la rédaction de
  chaque lot, comme pour la génération d'exemples). Pipeline à monter :
  adapter `insert_n3_vocab_batches.mjs` → `insert_n2_vocab_batches.mjs`,
  lots ~20-25 mots, vérification doublons id après chaque lot,
  checkpoint périodique ici. **Chantier volumineux** (1753 mots, plus
  gros que N3) — attention à la limite TS2590 (~2200 entrées dans un
  seul littéral de tableau) déjà rencontrée sur `mockVocab.ts` pendant
  N3 : si `mockVocabList` dépasse à nouveau ce seuil, réappliquer le
  pattern de chunking (`rebalance_mockvocab.mjs`), jamais
  `split_mockvocab.mjs` sur un fichier déjà chunké.
  - **TERMINÉ. 70 lots rédigés** (69 lots de 25 + 1 lot final de 11),
    mockVocabList passé de 2521 à **4254 entrées** (+1733 mots nets pour
    N2, sur les ~1753 mots génuinement nouveaux identifiés au départ —
    l'écart s'explique par une vingtaine de mots source écartés en
    route : doublons de contenu sous représentation différente,
    doublons exacts de `word`, ou mots redondants avec des entrées
    N4/N5/N3 déjà présentes). `n2_vocab_new.json` est maintenant vide.
    mockVocabPart7 (le dernier chunk de `mockVocabList`) a fini le
    chantier N2 à un peu plus de 1900 entrées — encore sous le seuil
    TS2590 (~2000-2200) mais **à revérifier en premier avant de
    commencer la rédaction N1**, car ce chantier sera probablement le
    plus gros de tous les niveaux et fera très certainement dépasser ce
    seuil ; prévoir un rebalancing (`rebalance_mockvocab.mjs`) tôt dans
    le chantier N1 plutôt que d'attendre une erreur de compilation.
    Doublons/corrections notables rencontrés pendant tout le chantier N2
    (leçons à retenir pour N1) :
    - "あかんぼう"→赤ん坊, "おくさん"→奥さん, "ごみ" : mots source donnés en
      kana seul par tanos.co.uk qui correspondaient en fait à des
      entrées déjà écrites en kanji dans N5/N4/N3 — un dédoublonnage par
      égalité stricte de chaîne ne détecte pas cette identité de
      contenu sous représentation différente. Seule la vérification
      post-insertion sur le champ `word` (`/tmp/vocab_dupcheck2.js`)
      les révèle. Entrées supprimées (jamais renommées).
    - "紅葉"/もみじ : même chaîne `word` que le 紅葉/こうよう déjà inséré
      plus tôt dans le même chantier — collision entre deux lectures
      distinctes du même kanji composé. Écarté.
    - "見付かる"/"見付ける"/"向う" : mêmes mots que les 見つかる/見つける/
      向かう déjà présents (juste 付 en kanji au lieu de kana, ou
      okurigana manquant) — pas de nouveau contenu, écartés (à ne pas
      confondre avec les cas légitimes de kanji homophones distincts
      comme 掘る/彫る ou 混ざる/交ざる, conservés comme entrées séparées).
    - "分る" : forme sans okurigana か du 分かる déjà existant — écarté.
    - "リポート" : translittération alternative de レポート déjà existant
      (même mot emprunté, deux graphies katakana) — écarté.
    - Doublon "ペン" détecté après un lot tardif (déjà présent plus tôt
      dans le fichier) — supprimé après coup ; l'édition de suppression
      a d'abord mal coupé les accolades du littéral (chevauchement avec
      l'entrée suivante), corrigé par une deuxième passe avant de
      revalider `tsc -b`. **Leçon** : après toute suppression d'entrée
      par `Edit`, relire immédiatement le résultat de `tsc -b` avant de
      continuer — ne pas supposer qu'une édition ciblée a réussi.
    - "湿気"/しっき (doublon source d'une lecture de 湿気/しっけ), "水曜"
      (redondant avec 水曜日 déjà existant) : écartés.
    - "清む" (probable corruption/doublon de 澄む) : écarté.
    - Coquilles source corrigées avant rédaction (troncatures et erreurs
      de transcription du parsing PDF→CSV original) : "消極的" tronqué
      en しょうきょくて→しょうきょくてき, "卒直"→率直 (kanji erroné),
      "田ぼ"→田んぼ (okurigana manquant), "タイア"→タイヤ (erreur de
      transcription), "付合う"→付き合う (okurigana manquant), lecture
      fantôme "（副）" sur だいいち corrigée, "庖丁"→包丁 (kanji rare
      remplacé par la forme standard), "ひゃっかじてん" (kana seul)
      →百科事典 (kanji ajouté), "ぺん"→ペン (casse katakana corrigée),
      "レクリェーショ"→レクリエーション et "ローマじ"→ローマ字 (troncatures
      corrigées en fin de chantier). Défaut de
    source détecté en cours de route (au-delà du <1% déjà documenté) :
    un cluster de 4 lignes consécutives corrompues autour de
    「いってらっしゃい」/「いってまいります」 — deux expressions
    coupées en fragments par le parsing PDF→CSV d'origine
    (`いっていらっし` / `ゃい` / `いってらっしゃ` / `いってまいりま`).
    Nettoyé à la main (fragments supprimés, les 2 expressions correctes
    réinsérées). **Leçon retenue** : la corruption n'est pas uniformément
    répartie sur les 1846 lignes — elle arrive par petits clusters
    localisés (probablement liée à des sauts de page dans le PDF
    source) — donc toujours regarder la fenêtre de contexte
    (`slice(i-2, i+15)` ou similaire) autour de tout nom suspect
    (fragment kana isolé, mot tronqué) plutôt que de supposer un
    incident isolé. **Bug de script à éviter** : lors du retrait des
    mots consommés d'un lot de la queue `n2_vocab_new.json`, ne jamais
    utiliser un filtre par valeur avec un `Set` qui rétrécit pendant
    l'itération (`removedCount < consumed.size` — le `.size` change à
    chaque `.delete()`, ce qui arrête le filtre prématurément) — a
    causé un retrait incomplet après le lot 1, corrigé en repassant
    plusieurs fois puis en adoptant une consommation **par index de
    tête** (`words.slice(N)`) après chaque lot, bien plus fiable
    puisque les lots sont toujours pris dans l'ordre depuis le début du
    fichier restant.
  - Doublon détecté et corrigé après le lot 1 : `あかんぼう` (source,
    kana seul) correspond en fait au mot déjà existant `赤ん坊` (kanji)
    — un dédoublonnage par égalité stricte de chaîne ne peut pas
    détecter cette identité de contenu sous représentation différente.
    Entrée supprimée (même principe que les doublons kanji/grammaire
    précédents : suppression plutôt que renommage). À garder à l'esprit
    pour le reste du chantier N2 (et N1) : si un mot rédigé en kanji
    correspond en fait à une entrée déjà connue sous forme kana-seule
    (ou l'inverse), le dédoublonnage automatique ne le détectera pas —
    seule la vérification post-insertion (`/tmp/vocab_dupcheck2.js`,
    champ `word`) le révèle.
  - 17 doublons de `word` **pré-existants** dans `mockVocab.ts` détectés
    au passage (présents avant le début du chantier N2, 2522 mots dont
    2505 uniques) — hors périmètre de ce chantier, non corrigés pour
    l'instant (`空く`, `止める`, `金`, `数`, `球`, `年月`, `後`, `品`,
    `無`, `文字`, `行き`, `綿`, `描く`, `注ぐ`, `偉大`, `市`,
    `すみません`).
- [x] N4 — **TERMINÉ. 634/634 mots écrits** (index 0 à 633 de
  `n4_vocab_final.json`, scratchpad). Même source que N5 (CSV
  `raw.githubusercontent.com/jamsinclair/open-anki-jlpt-decks/main/src/n4.csv`,
  668 lignes). Parsées avec un vrai parseur CSV cette fois (pas un
  `split(',')` naïf — le fichier a des champs entre guillemets avec des
  virgules dedans, ex. "to step on, to tread on") : `parse_n4_csv.mjs`
  dans le scratchpad. Dédupliqué contre les mots déjà présents (672
  mots existants, dont les 656 N5 + les quelques mots hérités d'autres
  niveaux) → 662 nouveaux, puis **séparé en deux** : les entrées dont
  l'expression commence par `～` (28, ex. `～(に)ついて`,
  `～(て)しまう`, `～員`) sont des **patterns de grammaire**, pas du
  vocabulaire — sorties dans `n4_grammar_candidates.json` pour nourrir
  le chantier grammaire N4 plutôt que d'être forcées en fiches de mots.
  Reste **634 vrais mots de vocabulaire N4** à écrire
  (`n4_vocab_final.json` dans le scratchpad, prêt à consommer index par
  index comme pour N5). Pipeline identique à N5 (lots ~15-25 mots,
  `serialize.mjs`, 1 exemple par mot, vérification doublons après
  chaque lot).
  - **Nouvelle règle de furigana propre à N4** (demandée par l'utilisateur
    en cours de route, ne s'applique pas rétroactivement à N5) : dans les
    `examples` (segments de phrase), un kanji **hors du mot cible
    (`highlight: true`)** ne reçoit `reading` que s'il est **en dehors de
    l'ensemble N5+N4 connu** (282 caractères listés dans
    `scratchpad/known_n5_n4_kanji.json`, extraits de `mockKanji.ts`) —
    l'idée étant de forcer la lecture des kanjis déjà censés être connus
    à ce niveau plutôt que de tout gloser systématiquement comme c'était
    fait pour N5. Le mot cible lui-même (`wordSegments` et le run
    `highlight: true` dans les exemples) garde **toujours** sa lecture,
    peu importe le niveau du kanji — ce n'est pas concerné par la règle,
    c'est la lecture qu'on est justement en train d'enseigner.
  - **Piège id dupliqués** : plusieurs nouveaux ids N4 sont entrés en
    collision avec des ids N5 existants utilisant le même schéma
    `romaji+chiffre` sur un kanji homophone (ex. `aku2` déjà pris par
    開く, `oriru1` déjà pris par 降りる, `ki3` déjà pris par 木, `shi2`
    déjà pris par 四, `shuukan1` déjà pris par 週間) — un script de
    détection de doublons d'id tourne après **chaque** insertion de lot
    (voir commande ci-dessous) et les collisions trouvées ont été
    renommées (aku3, oriru2, ki4, shi3, shuukan2) : à refaire
    systématiquement pour la suite.
  - Script d'insertion : `scratchpad/insert_n4_vocab_batches.mjs
    <numéros de lots>` (sérialise + splice directement, plus fiable que
    `serialize.mjs` en subprocess séparé sous Windows à cause d'un souci
    d'URL ESM avec les chemins absolus `C:/...`).

**Progression grammaire** :
- [x] N5 — **TERMINÉ. 81 points au total** (5 déjà présents + 76
  nouveaux en 10 lots). Pas de liste officielle JLPT (comme pour
  kanjis/vocabulaire) — liste compilée à la main à partir des points
  de grammaire N5 standards (particules は/が/を/に/で/へ/と/から〜
  まで/や/だけ/しか/ね/よ/の/か, copule, adjectifs い/な, formes
  verbales ます/て, comparaison, existence, temps, conjecture/
  citation, suggestions, dons/réceptions, divers : すぎる/やすい/
  にくい/たり〜たりする/たことがあります/ておきます/くて・で/
  くなります・になります/でも/くらい・ぐらい/ずつ/方/見える・聞こえる/
  さ/そうです — équivalent en couverture à Genki I+II ou JLPTSensei).
  0 doublon d'id/pattern, `tsc -b` propre à chaque lot. Pipeline :
  fichiers `.mjs` par lot (id, pattern, jlptLevel, meaning, rule,
  usage, examples — 2 exemples par point comme les points déjà
  présents, contrairement au 1 seul exemple du vocabulaire), vérifiés
  avec `node -e "import(...)"` avant sérialisation (les objets
  imbriqués complexes ont plusieurs fois cassé la syntaxe JS en fin
  de fichier — d'où la vérification systématique avant de sérialiser),
  sérialisés via `serialize.mjs`, insérés dans `mockGrammar.ts`.
- [x] N4 — **TERMINÉ. 43 points au total** (1 déjà présent —
  `〜ましょうか` — + 42 nouveaux). Point de départ : les 28 patterns
  candidats repérés en sourçant le vocabulaire N4 (expressions
  commençant par `～` dans le CSV, `n4_grammar_candidates.json`), mais
  après tri **seuls 10 étaient de vraies constructions grammaticales**
  à ajouter (〜について, 〜によると, 〜おき, 〜おわる, 〜でございます,
  〜だす, 〜続ける, 〜ばかり, 〜始める, 〜まま) — les 15 restants
  étaient des suffixes de comptage/dénomination purs (〜員, 〜家, 〜会,
  〜学部, 〜区, 〜君, 〜軒, 〜様, 〜式, 〜製, 〜代, 〜ちゃん, 〜町,
  〜月, 〜目 — exclus, même logique que les suffixes exclus du
  vocabulaire N5/N4), et 3 étaient **déjà présents dans le module N5**
  sous d'autres tags de niveau (〜てしまう en N3, 〜やすい et 〜にくい
  en N5 — la liste N5 avait déjà largement débordé sur du contenu
  niveau N4/Genki II, contrairement à ce qu'on pourrait supposer :
  vérifié en listant tous les `id` existants avant d'écrire quoi que ce
  soit, pour éviter de dupliquer). Complété par 32 points de grammaire
  N4 standards compilés à la main (conditionnels たら/ば/と/なら,
  ようです/らしい/という, てある/ていく/てくる, voix passive/causative/
  causative-passive, ようになる/ことになる/ことがある/ことにする/
  つもりだ/はずだ, ように/ために/のに/し, forme volitive よう,
  honorifique/humble お〜になる・お〜する, ば〜ほど, 〜んじゃない,
  forme potentielle, たがる/がる, ずに, てほしい). 0 doublon d'id ou de
  `pattern` (un doublon de `pattern` avec 〜と existant a été détecté et
  résolu en renommant l'affichage en `〜と（条件）` pour distinguer le
  と-liste du と-conditionnel ; un vrai doublon de contenu avec
  `to-iu`/〜という existant a été détecté et supprimé plutôt que
  renommé). `tsc -b` propre. Même pipeline que N5 (lots `.mjs`, `node -e
  "import(...)"` avant sérialisation, `insert_n4_grammar_batches.mjs`
  dans le scratchpad pour sérialiser+spliceer directement).
  - **Règle furigana appliquée** : comme pour le vocabulaire N4, dans
    les phrases d'exemple, le run mis en `highlight: true` (l'occurrence
    du point de grammaire) garde toujours sa lecture ; les autres mots
    de contexte n'ont de `reading` que si leur kanji est hors de
    l'ensemble N5+N4 connu (`known_n5_n4_kanji.json`).
- [x] N3 — **TERMINÉ. 68 nouveaux points, 195 au total** (127
  pré-existants + 68 nouveaux en 6 lots de 12). Comme N4/N5, aucune
  liste officielle JLPT de grammaire — compilée à la main à partir des
  points N3 standards (〜たばかり, 〜おかげで, 〜わけだ, 〜に対して,
  〜きり, 〜抜く, 〜てはじめて, 〜ものだ, 〜ものの, 〜として, 〜に
  おいて, 〜に関して, 〜にとって, 〜によって, 〜に基づいて, 〜おそれが
  ある, 〜わりに, 〜一方で, 〜からすると, 〜からといって, 〜抜きで,
  〜末に, 〜上で, 〜上に, 〜次第, 〜たとたんに, 〜がたい, 〜きれない,
  〜っこない, 〜まい, 〜べきだ, 〜どころではない, 〜ないことには,
  〜さえ〜ば, 〜てからでないと, 〜くせに, 〜ものなら, 〜ざるを得ない,
  〜っぱなし, 〜おきに, 〜こそ, 〜つつある, 〜はもちろん, 〜にしては,
  〜にほかならない, 〜に限らず, 〜ばかりでなく, 〜あげく, 〜がち,
  〜っぽい, 〜だらけ, 〜反面, 〜かのように, 〜ようがない, 〜てはならない,
  〜とはいえ, 〜にしても, 〜にもかかわらず, 〜を問わず, 〜ばかりに,
  〜気味, 〜てたまらない, 〜というものではない). Pipeline identique à
  N4/N5 (lots `.mjs`, `node -e "import(...)"` avant sérialisation,
  `insert_n3_grammar_batches.mjs` dans le scratchpad). **3 vrais
  doublons de contenu détectés et supprimés** (pas renommés, même
  précédent que N4) : `〜わけではない` (déjà présent en N2), et
  `〜にほかならない`/`〜あげく`/`〜がち` (déjà présents en N1/N3/N3 —
  ces 3 derniers utilisaient des guillemets doubles dans le fichier,
  d'où leur invisibilité au premier `grep` avec guillemets simples ;
  toujours vérifier avec les deux styles de guillemets lors d'un
  dédoublonnage). Dédoublonnage fait via un script générique
  (`dedupe_grammar.mjs`, parseur par profondeur d'accolades sur le
  tableau top-level) plutôt qu'un `Edit` manuel, après une sauvegarde
  préalable du fichier (leçon retenue de l'incident `mockVocab.ts`).
  0 doublon d'id/pattern restant, `tsc -b` propre.

- [ ] Vocabulaire N1 — **EN COURS**. Avant de commencer la rédaction,
  rééquilibrage préventif de `mockVocab.ts` effectué (comme prévu dans
  la note laissée à la fin du chantier N2 : `mockVocabPart7` était à
  1854 entrées, trop proche du seuil TS2590 pour absorber tout un
  chantier N1 en plus). `rebalance_mockvocab.mjs` (scratchpad, déjà
  présent d'une session précédente) relancé sur les 4254 entrées
  existantes (656 N5 + 634 N4 + 1220 N3 + 1733 N2 + quelques mots
  hérités), rescindées en 11 chunks de 400 (dernier à 254). **Bug
  détected et corrigé dans le script avant de faire confiance au
  résultat** : la ligne `export const mockVocabList = [...]` est la
  toute dernière ligne du fichier, **sans retour à la ligne final** —
  `content.indexOf('\n', exportIdx)` renvoyait donc `-1`, et
  `content.slice(-1 + 1)` = `content.slice(0)` réinjectait tout le
  fichier ORIGINAL en double après le nouveau contenu (7 anciens blocs
  `mockVocabPartN` + l'ancien export réapparaissaient après les 11
  nouveaux blocs) — repéré immédiatement via un comptage de
  déclarations `const mockVocabPartN`/`export const mockVocabList`
  après le premier run (18 parts et 2 exports au lieu de 11 et 1),
  jamais appliqué en aveugle. Corrigé (`newlineAfterExport === -1 ?
  content.length : ...`), sauvegarde préalable restaurée, script
  relancé proprement : 4254 entrées exactes préservées, 0 doublon d'id,
  `tsc -b` propre. **Leçon retenue** : tout script de rééquilibrage/
  restructuration de fichier géant doit être re-testé avec un comptage
  de déclarations avant/après (pas seulement `tsc -b`, qui n'aurait pas
  forcément détecté un export dupliqué selon la position), et une
  sauvegarde prise juste avant reste indispensable même pour un script
  déjà utilisé avec succès par le passé (l'edge case de fin de fichier
  sans retour à la ligne n'avait jamais été exercé avant, le fichier
  ayant toujours eu du contenu après l'export lors des rééquilibrages
  précédents).
  Source : **tanos.co.uk** via `Bluskyo/JLPT_Vocabulary`
  `JLPT_vocab_ALL.csv` (déjà en cache dans le scratchpad depuis N2,
  `jlpt_vocab_all_tanos.csv`, pas besoin de retélécharger), Level 1 =
  N1 → **3475 mots bruts** (distribution confirmée identique à celle
  observée pendant N2 : 3475/1846/1835/649/700 pour N1-N5). Après
  déduplication contre les 4254 mots N5+N4+N3+N2 déjà écrits (`.has()`
  sur le kanji exact) : **185 déjà connus** (écartés), **3278 mots
  génuinement nouveaux pour N1** (`n1_vocab_new.json` au scratchpad,
  colonnes kanji/reading seulement comme pour N2 — sens/catégorie à
  déterminer à la main pendant la rédaction). Pipeline : lots de 25
  mots (`n1_vocab_batch*.mjs`), 1 exemple par mot (même convention que
  N2), `insert_n1_vocab_batches.mjs` (adapté de
  `insert_n2_vocab_batches.mjs`, cible le dernier `mockVocabPartN`),
  vérification **id ET word** après chaque lot contre l'état réel du
  fichier (jamais contre une liste figée en mémoire — leçon du
  chantier kanji N1 appliquée dès le départ ici), `tsc -b` propre après
  chaque lot.
  - **Consommation par compteur explicite, pas par fichier "remaining"
    mutable** : un bug de suivi a été détecté tôt (le fichier
    `n1_vocab_remaining.json` n'était pas remis à jour après un lot,
    ce qui a fait resservir le même lot de mots une seconde fois) —
    corrigé en abandonnant ce fichier au profit d'un simple compteur
    `CONSUMED` recalculé à la main à partir de `n1_vocab_new.json`
    (source de vérité unique, jamais mutée), incrémenté de la taille
    réelle du lot précédent (nombre de lignes sources consommées, pas
    le nombre d'entrées écrites — les deux peuvent diverger si une
    ligne source est scindée en deux entrées ou si une entrée est
    écartée comme doublon de contenu).
  - **Quelques lignes sources corrompues détectées et corrigées** dès
    le premier lot (même défaut que documenté pour N2, kanji/lecture
    mal appariés par le pipeline PDF→CSV d'origine) : `愛憎/あいにく`
    → corrigé en `生憎/あいにく` (le kanji 愛憎 se lit normalement
    あいぞう ; あいにく correspond en fait à 生憎) ; `明白/あからさま`
    → scindé en deux entrées distinctes correctement appariées
    (`明白/めいはく` et `あからさま` en kana seul) ; `空間/あきま` →
    corrigé en `空き間/あきま` ; `悪日/あくび` → identifié comme doublon
    de contenu de l'entrée N2 déjà existante `あくび` (欠伸, bâillement)
    et purement écarté plutôt que corrigé, car le mot était déjà
    couvert sous une autre représentation.
  - **21 lots rédigés à ce stade (batches 1-21), 525/3278 mots bruts
    consommés** (518 entrées écrites nettes : 7 doublons de contenu
    écartés au total, dont `割/かつ` corrigé en `勝つ/かつ` puis écarté
    car déjà présent sous `katsu1`). `tsc -b` propre après chaque lot,
    0 doublon d'id restant (collisions détectées et corrigées à chaque
    lot via recherche du prochain suffixe libre contre l'état réel du
    fichier, jamais de mémoire — attention particulière requise quand
    un même lot contient plusieurs mots partageant la même racine
    romaji, ex. plusieurs "kaku*"/"kakeru*"/"kata*" dans un seul lot :
    il faut vérifier la collision à la fois contre le fichier existant
    ET entre les entrées du lot lui-même). `mockVocabPart11` (le chunk
    en croissance) à ~775 entrées à ce stade — encore sous le seuil
    TS2590 mais à rééquilibrer avant qu'il n'approche 1500-2000
    (`rebalance_mockvocab.mjs` déjà corrigé et prêt si besoin, voir
    plus haut).
  - **Plusieurs coquilles source supplémentaires corrigées** (lots
    16-21, même défaut PDF→CSV documenté depuis N2) : `お八/おやつ` →
    `御八つ/おやつ` ; `音色/おんいろ` → lecture corrigée en `ねいろ` ;
    `個/か` → `課/か` (個 ne se lit jamais か) ; `華奢/かしゃ` → `貨車/かしゃ`
    (華奢 se lit normalement きゃしゃ) ; `鉄棒/かなぼう` → `金棒/かなぼう`
    (鉄棒 se lit てつぼう) ; `金庫/かねぐら` → `金蔵/かねぐら` (金庫 se lit
    きんこ) ; `下番/かばん` → `鞄/かばん` (かばん est un mot bien trop
    courant pour être 下番, inexistant).
  - **Coquilles source corrigées au fil des lots** (même défaut
    PDF→CSV documenté pour N2) : `域外/いきがい` → `生き甲斐/いきがい` ;
    `一別/いちべつ` → `一瞥/いちべつ` ; `甘い/うまい` → `旨い/うまい`
    (甘い se lit あまい, pas うまい) ; `末/うら` → `裏/うら` (末 se lit
    すえ, pas うら) — mais 裏/うら s'est révélé déjà présent en N4
    (`ura1`), donc finalement écarté plutôt qu'inséré ; `伊井/いい`
    gardé tel quel mais traité comme nom propre (toponyme/nom de
    famille rare), même convention que les kanjis rares établie
    pendant le chantier N1 kanji.
    **25 lots rédigés à ce stade (batches 1-25), 625/3278 mots bruts
    consommés** (~604 entrées écrites nettes après les lots 22-25 :
    voir détail ci-dessous). `tsc -b` propre après chaque lot.
  - **Lots 22-25** : rythme de doublons nettement plus élevé que la
    moyenne sur ce quart de la liste (mots en か-/が- très fréquents,
    beaucoup déjà couverts à N2/N3 sous forme kana-seule alors que la
    liste N1 les re-liste en kanji) — **6 doublons de contenu écartés
    rien que sur le lot 22** : `痒い/かゆい` (doublon de `kayui` N2,
    kana), `揶揄う/からかう` (doublon de `karakau` N2), `加留多/かるた`
    (doublon de `karuta` N2), `可愛がる/かわいがる` (doublon de
    `kawaigaru` N2), `可愛らしい/かわいらしい` (doublon de `kawairashii1`
    N3), `可哀想/かわいそう` (doublon de `kawaisou1` N3) — tous des cas
    où le mot existait déjà en kana seul à un niveau inférieur et où le
    lot N1 le re-présente juste avec sa forme kanji : traité comme
    doublon de contenu (écarté), pas comme variante légitime. À
    l'inverse, `涸れる/かれる` (assèchement d'un puits) et `寒気/かんき`
    (frissons) ont été **gardés** malgré une collision d'id avec des
    mots existants de même lecture, car kanji et sens différents
    (`枯れる` = flétrissement d'une plante ; `換気` = ventilation) —
    vraies paires homophones distinctes, pas des doublons. Convention
    de vérification systématique appliquée : avant d'assigner un id en
    collision, comparer aussi le *mot* (kanji) de l'entrée existante,
    pas seulement l'id, pour distinguer homophone légitime de doublon
    de contenu. Plusieurs kanjis isolés agissant comme éléments de
    composé plutôt que mots autonomes traités comme `仮` (type
    `expression`, préfixe/élément lié) : `乾/かん` (sécheresse), `蓋/がい`
    (couvercle, cf. 頭蓋骨), `街/がい` (quartier, cf. 商店街). Suffixe
    grammatical `がる` (lot 25) également traité en `expression` plutôt
    qu'un vrai mot de vocabulaire classique.
  - **28 lots rédigés à ce stade, 700/3278 mots bruts consommés.**
    Lots 26-28 : rythme de doublons revenu à la normale (2 seulement :
    `兆/きざし` doublon de `兆し/きざし` déjà dans le même lot 26 — écarté
    au profit de la forme avec okurigana, plus courante ; `屹度/きっと`
    et `切っ掛け/きっかけ` au lot 27, doublons de mots déjà existants en
    kana seul — `kitto` et `kikkake` N2). Nouveaux éléments de composé
    traités en `expression` (même convention que `仮`/`乾`/`蓋`/`街`) :
    `共/きょう` et `供/きょう` (lot 28, sens différents — "ensemble" vs
    "offrir" — donc deux entrées distinctes malgré la même lecture,
    pas un doublon). Premier adjectif en い rencontré depuis longtemps
    dans ce chantier N1 (`決まり悪い`, lot 28) — format de conjugaison
    différent des adjectifs en な habituels (現在形/否定形/過去形 mais
    formes en 〜くない/〜かった, voir `kawaii1` comme référence de
    format). `mockVocabPart11` à surveiller (~945 entrées après le lot
    28, seuil de rééquilibrage TS2590 autour de 1500-2000).
  - **30 lots rédigés à ce stade, 750/3278 mots bruts consommés**
    (`mockVocabPart11` à 991 entrées après le lot 30 — toujours sous le
    seuil mais à revérifier régulièrement). Lots 29-30 : rythme normal,
    peu de doublons (`奇麗/きれい` au lot 30, doublon de `綺麗/きれい`
    déjà existant en N5 sous `kirei1` — deux ateji différents pour le
    même mot, écarté). Nouveaux éléments de composé en `expression` :
    `共産/きょうさん` (lot 29, préfixe "communisme"), `共和/きょうわ`
    (lot 29, préfixe "république"), `僅/きん` (lot 30, "à peine").
    Homophones distincts gardés malgré collision d'id : `桐/きり`
    (paulownia) vs `霧/きり` (brouillard, déjà existant N3) — kanjis et
    sens différents, pas un doublon.
  - **32 lots rédigés à ce stade, 800/3278 mots bruts consommés**
    (`mockVocabPart11` à 1029 entrées après le lot 32 — encore sous le
    seuil TS2590 mais se rapproche, à rééquilibrer d'ici quelques
    dizaines de lots). Lot 31 propre (0 doublon, ni collision), notable
    pour la paire `禁じる`/`禁ずる` (きんじる/きんずる) — deux formes
    conjuguées différentes du même verbe "interdire", gardées toutes
    les deux (registres différents, forme en ずる classée `irregular`)
    plutôt que traitées comme doublon. **Lot 32 : 6 doublons de contenu
    écartés** (record du chantier), tous des mots très courants déjà
    connus en kana seul à un niveau inférieur mais re-listés ici avec
    un kanji rare/peu usité : `嚏/くしゃみ` (N2), `草臥れる/くたびれる`
    (existant), `下らない/くだらない` (existant), `諄い/くどい` (N2),
    `くっ付く/くっつく` (N2), `くっ付ける/くっつける` (existant) — tous
    identifiés via un nouveau contrôle systématique ajouté à la
    vérification : comparer aussi la forme kana pure du mot candidat
    contre `existing_vocab_word_values.json`, pas seulement sa forme
    kanji exacte (les doublons kanji-vs-kanji étaient déjà détectés,
    mais un doublon kana-vs-kanji-rare ne l'était pas). **Coquille
    source corrigée** : `旧事/くじ` (lecture きゅうじ normale pour 旧事,
    incompatible avec くじ) → identifié comme corruption et corrigé en
    `籤/くじ` (loterie), qui a du sens vu que l'entrée suivante de la
    liste est justement `籤引/くじびき` (tirage au sort).
  - **33 lots rédigés à ce stade, 825/3278 mots bruts consommés**
    (`mockVocabPart11` à 1051 entrées). Lot 33 : 3 doublons écartés
    (`組み合わせ/くみあわせ` doublon de `組合せ` existant — orthographe
    okurigana différente pour le même mot ; `呉れ呉れも/くれぐれも` et
    `呉れる/くれる`, doublons de mots N2/N4 déjà connus en kana).
    Homophone distinct gardé : `群/ぐん` (foule/groupe) vs `軍/ぐん`
    (armée, déjà existant N3, `gun1`) — kanjis et sens différents.
  - **35 lots rédigés à ce stade, 875/3278 mots bruts consommés**
    (`mockVocabPart11` à 1107 entrées, toujours sous le seuil TS2590
    mais à rééquilibrer d'ici quelques dizaines de lots). Lots 34-35
    propres (0 doublon). Rythme stable, aucune coquille source notable
    sur ces deux lots.
  - **36 lots rédigés à ce stade, 900/3278 mots bruts consommés**
    (~27% du total). Lot 36 propre (0 doublon).
  - **37 lots rédigés à ce stade, 925/3278 mots bruts consommés.**
    Lot 37 propre (0 doublon, 0 collision). **Coquille source
    corrigée** : `巨/こ` — 巨 ne se lit jamais こ (son on'yomi est きょ,
    cf. 巨大) ; corrigé en `孤/こ` (élément de composé "seul,
    solitaire", cf. 孤独), cohérent avec le contexte (deux autres
    kanjis isolés lus こ juste avant dans la liste : 故, 児).
  - **38 lots rédigés à ce stade, 950/3278 mots bruts consommés**
    (`mockVocabPart11` à 1182 entrées, toujours sous le seuil TS2590).
    Lot 38 propre (0 doublon).
  - **40 lots rédigés à ce stade, 1000/3278 mots bruts consommés**
    (~30,5% du total — `mockVocabPart11` à 1230 entrées, encore sous
    le seuil TS2590 mais à revérifier régulièrement). Lots 39-40 :
    rythme normal (0 doublon lot 39 ; 2 doublons lot 40 — `箇箇/ここ`
    doublon de contenu de `個々/ここ` **dans le même lot** — variante
    kanji rare du même mot "chacun individuellement", écarté au profit
    de la forme courante ; `拵える/こしらえる` doublon de `こしらえる`
    N2 déjà existant en kana). Plusieurs verbes en `こころ〜` traités
    avec kanji unique 心/志/試/快 portant une lecture longue
    (心, こころ ; 試, こころ ; 快, こころよ) — segmentation par kanji
    unique + okurigana, cohérent avec le reste du chantier.
  - **41 lots rédigés à ce stade, 1025/3278 mots bruts consommés.**
    Lot 41 : 1 doublon écarté (`此の/この` doublon du mot de base この
    déjà existant). `個体/こたい` (N2 existant) vs `固体/こたい` (nouveau,
    "solide" état de la matière) — homophones distincts gardés.
  - **42 lots rédigés à ce stade, 1050/3278 mots bruts consommés.**
    Lot 42 : **6 doublons écartés** (record égalé) — tous des mots
    grammaticaux/de base déjà connus en kana, re-listés ici en kanji
    rare : `零す/こぼす`, `零れる/こぼれる`, `此れ/これ`, `此れ等/これら`,
    `今日は/こんにちは`, `今晩は/こんばんは`. Cette zone de la liste
    (pronoms、saluts、petits verbes très courants) semble
    systématiquement sur-représentée en doublons kanji-rare — à
    surveiller sur les lots suivants dans la même tranche こ-/ご-.
  - **43 lots rédigés à ce stade, 1075/3278 mots bruts consommés**
    (`mockVocabPart11` à 1292 entrées — se rapproche du seuil TS2590,
    rééquilibrage à prévoir dans les prochains lots). Lot 43 :
    confirmation du phénomène anticipé au lot 42 — encore 6 doublons
    écartés dans cette tranche de salutations/formules polies :
    `ご苦労様/ごくろうさま`, `ご馳走/ごちそう`, `ご馳走さま/ごちそうさま`,
    `ご無沙汰/ごぶさた` (doublon de `御無沙汰` N2, même préfixe
    honorifique ご/御 en orthographe différente), `御免ください/
    ごめんください`, `御免なさい/ごめんなさい`.
  - **44 lots rédigés à ce stade, 1100/3278 mots bruts consommés**
    (~33,6% du total — `mockVocabPart11` à 1315 entrées, se rapproche
    du seuil de rééquilibrage TS2590 mais pas encore franchi). Lot 44 :
    2 doublons écartés — `逆上る/さかのぼる` doublon de contenu de
    `遡る/さかのぼる` déjà existant (deux orthographes kanji valides du
    même verbe "remonter", pas des homophones distincts) ; `一昨昨日/
    さきおととい` doublon de `さきおととい` N2 déjà existant en kana.
  - **45 lots rédigés à ce stade, 1125/3278 mots bruts consommés**
    (~34,3% du total — `mockVocabPart11` à 1340 entrées). Lot 45
    propre (0 doublon) — série de verbes composés avec 差し- (差し掛かる,
    差し出す, 差し支える, 差し引く) traités avec segmentation kanji+kana
    cohérente à chaque fois.
  - **46 lots rédigés à ce stade, 1150/3278 mots bruts consommés**
    (`mockVocabPart11` à 1362 entrées). Lot 46 : 3 doublons écartés
    (`偖/さて` doublon de `さて` déjà existant, `左様なら/さようなら`
    doublon de `さようなら` déjà existant, `爽やか/さわやか` doublon de
    `さわやか` N2 déjà existant). **Deux coquilles source corrigées** :
    `真実/さな` — lecture incorrecte du CSV source (真実 se lit しんじつ,
    jamais さな — vérifié directement dans le CSV brut, pas une erreur
    de mon pipeline) → corrigé en `真実/しんじつ`, mot courant absent du
    reste de la base donc légitimement ajouté ici ; `桟橋/さんきょう` →
    corrigé en `桟橋/さんばし` (lecture réelle de ce mot très courant,
    "jetée/ponton" — さんきょう n'existe pas).
  - **47 lots rédigés à ce stade, 1175/3278 mots bruts consommés**
    (`mockVocabPart11` à 1387 entrées). Lot 47 propre (0 doublon).
  - **48 lots rédigés à ce stade, 1200/3278 mots bruts consommés**
    (~36,6% du total — `mockVocabPart11` à 1409 entrées, seuil TS2590
    à surveiller de près désormais). Lot 48 : 3 doublons écartés
    (`明々後日/しあさって`, `然し/しかし`, `而も/しかも` — tous des mots
    grammaticaux très courants déjà connus en kana, re-listés en kanji
    rare, même schéma que les lots 42-43).
  - **49 lots rédigés à ce stade, 1225/3278 mots bruts consommés**
    (`mockVocabPart11` à 1432 entrées). Lot 49 : 2 doublons écartés
    (`従って/したがって`, `確り/しっかり`, mots grammaticaux courants déjà
    connus en kana).
  - **50 lots rédigés — étape symbolique franchie —, 1250/3278 mots
    bruts consommés (~38,1% du total)**. `mockVocabPart11` à 1454
    entrées, se rapproche sérieusement du seuil de rééquilibrage
    TS2590 (1500-2000) — probablement à traiter dans les tout
    prochains lots (`rebalance_mockvocab.mjs` déjà prêt en scratchpad).
    Lot 50 : 3 doublons écartés (`尻尾/しっぽ` et `痺れる/しびれる`,
    doublons N2 déjà connus en kana ; `暫く/しばらく`, doublon d'un mot
    grammatical de base). Rythme de rédaction stable et fiable depuis
    le début du chantier N1 vocab — pipeline (rafraîchir les listes
    existantes, vérifier mot+id, rédiger, réinsérer, `tsc -b`) suivi
    sans écart à chacun des 50 lots.
  - **Rééquilibrage `mockVocab.ts` effectué après le lot 50** (avant
    que `mockVocabPart11` n'approche trop du seuil TS2590) : script
    `rebalance_mockvocab.mjs` relancé sur les 5454 entrées totales →
    **14 parts de 400 entrées** (dernière à 254). Sauvegarde prise
    avant (`mockVocab.ts.backup_before_rebalance_batch50`, supprimée
    après vérification), comptage de déclarations vérifié avant de
    faire confiance au résultat (5455 occurrences de `wordSegments:` =
    5454 entrées + 1 dans la définition d'interface, cohérent), `tsc -b`
    propre après coup. Prochain rééquilibrage à prévoir quand
    `mockVocabPart14` (le chunk en croissance) approchera 1500-2000.
  - **51 lots rédigés à ce stade, 1275/3278 mots bruts consommés**
    (`mockVocabPart14` à 274 entrées après le lot 51 — large marge
    avant le prochain rééquilibrage). Lot 51 : 5 doublons écartés
    (`仕舞う/しまう`, `泌み泌み/しみじみ`, `萎む/しぼむ`, `締め切り/しめきり`,
    `吃逆/しゃっくり` — tous doublons N2 déjà connus en kana).
  - **52 lots rédigés à ce stade, 1300/3278 mots bruts consommés**
    (~39,7% du total). Lot 52 propre (0 doublon).
  - **53 lots rédigés à ce stade, 1325/3278 mots bruts consommés.**
    Lot 53 propre (0 doublon, 0 collision) — plusieurs kanjis isolés
    supplémentaires en `expression` (象/しょう "symbole/phénomène",
    症/しょう "symptôme", 諸/しょ "divers, préfixe").
  - **54 lots rédigés à ce stade, 1350/3278 mots bruts consommés**
    (~41,2% du total). Lot 54 propre (0 doublon).
  - **55 lots rédigés à ce stade, 1375/3278 mots bruts consommés.**
    Lot 55 : 1 doublon écarté (`知り合い/しりあい` doublon de `知合い`
    déjà existant — orthographe okurigana différente pour le même mot).
  - **56 lots rédigés à ce stade, 1400/3278 mots bruts consommés**
    (~42,7% du total). Lot 56 propre (0 doublon).
  - **57 lots rédigés à ce stade, 1425/3278 mots bruts consommés.**
    **Coquille source corrigée** : `地形/じぎょう` (lecture incorrecte,
    confirmée fausse dans le CSV brut — 地形 se lit ちけい, jamais じぎょう ;
    l'entrée juste avant dans la liste, `事業/じぎょう`, semble avoir
    "contaminé" la lecture de la ligne suivante dans la source) →
    corrigé en `地形/ちけい`. **Quasi-collision d'id évitée de justesse** :
    `jiki2` supposé libre après vérification de `jiki1` (時期, N3) sans
    revérifier `jiki2` lui-même — celui-ci était déjà pris par `直`
    (N3) ; détecté par le contrôle de collision avant insertion (pas
    après), corrigé en `jiki3`. Rappel : toujours vérifier l'id exact
    qu'on compte utiliser, pas seulement le précédent de la série.
  - **58 lots rédigés à ce stade, 1450/3278 mots bruts consommés**
    (~44,2% du total). Lot 58 : 2 doublons écartés (`じゃん拳/じゃんけん`
    doublon N2 déjà connu en kana ; `絨毯/じゅうたん` doublon N2 déjà
    connu en kana). **Coquille source corrigée** : `重宝/じゅうほう` — ce
    mot ne se lit jamais じゅうほう (confirmé faux dans le CSV brut), sa
    vraie lecture est ちょうほう ("pratique, utile") → corrigé.
  - **59 lots rédigés à ce stade, 1475/3278 mots bruts consommés**
    (~45% du total). **Coquille source corrigée** : `乗客/じょうかく` —
    vérifié dans le CSV brut que ce même mot apparaît deux fois,
    une fois (niveau 1) avec la lecture fautive じょうかく et une autre
    fois (niveau 3, déjà correcte) avec じょうきゃく → corrigé en
    `乗客/じょうきゃく` (mot absent du reste de la base, donc ajout
    légitime malgré la coquille source). Verbe `準ずる/じゅんずる` (variante
    formelle de `準じる`) gardé séparément, même principe que
    `禁じる`/`禁ずる` au lot 31.
  - **60 lots rédigés — franchi le cap des 1500/3278 mots bruts
    consommés (~45,8% du total)**. `mockVocabPart14` à 495 entrées
    depuis le rééquilibrage du lot 50, large marge encore. Lot 60 :
    1 doublon écarté (`少なくとも/すくなくとも`, mot grammatical de base
    déjà connu en kana). **Coquille source corrigée** : `人目/じんもく` —
    vérifiée fausse dans le CSV brut (la vraie lecture de ce mot très
    courant est ひとめ) → corrigé en `人目/ひとめ`.
  - **61 lots rédigés à ce stade, 1525/3278 mots bruts consommés.**
    Lot 61 : **6 doublons écartés** (`素敵/すてき`, `済みません/すみません`,
    `すれ違う/すれちがう`, `図々しい/ずうずうしい`, `酸っぱい/すっぱい`,
    `済まない/すまない` — tous des mots très courants déjà connus en
    kana à des niveaux inférieurs). Repéré au passage un doublon
    pré-existant dans la base (hors scope, non corrigé ici) : `すり`
    (N4, `suri1`) et `掏摸/すり` (N2, `suri`) sont probablement déjà le
    même mot "pickpocket" sous deux orthographes — signalé pour
    référence future, pas traité maintenant.
  - **62 lots rédigés à ce stade, 1550/3278 mots bruts consommés**
    (~47,3% du total). Lot 62 : 1 doublon écarté (`ずれる` — la liste
    source fournissait la forme kana comme "kanji", doublon de contenu
    de `滑れる/ずれる` déjà existant, même sens "être décalé, glisser").
  - **63 lots rédigés à ce stade, 1575/3278 mots bruts consommés.**
    Lot 63 propre (0 doublon).
  - **64 lots rédigés à ce stade, 1600/3278 mots bruts consommés**
    (~48,8% du total). Lot 64 propre (0 doublon).
  - **65 lots rédigés à ce stade, 1625/3278 mots bruts consommés.**
    Lot 65 : 3 doublons écartés (`先先月/せんせんげつ` doublon de
    `先々月` N2 — même mot, 々 vs 先 répété ; `先先週/せんせんしゅう` même
    cas pour `先々週` N2 ; `是非とも/ぜひとも` doublon de `ぜひとも` N2
    déjà connu en kana).
  - **66 lots rédigés à ce stade, 1650/3278 mots bruts consommés**
    (~50,3% du total — la moitié de la liste brute franchie).
    `mockVocabPart14` à 634 entrées. Lot 66 : 1 doublon écarté
    (`然うして/そうして` doublon de `そうして` déjà existant en kana).
  - **67 lots rédigés à ce stade, 1675/3278 mots bruts consommés.**
    Lot 67 : **9 doublons écartés** (nouveau record) — une zone de la
    liste très riche en mots grammaticaux de base re-listés en kanji
    rare : `其処/そこ`, `其処で/そこで`, `然して/そして`, `其方/そちら`,
    `その上/そのうえ`, `その内/そのうち`, `その為/そのため`, `その外/
    そのほか`, `其の儘/そのまま`. Confirme le schéma déjà observé
    plusieurs fois : les tranches de la liste N1 couvrant démonstratifs/
    connecteurs/pronoms de base ont un taux de doublon nettement plus
    élevé que le reste.
  - **68 lots rédigés à ce stade, 1700/3278 mots bruts consommés**
    (~51,9% du total). Lot 68 : 8 doublons écartés, dont 7 de la même
    famille それ- (`其れ/それ`, `其れから`, `其れで`, `其れでは`, `其れ共`,
    `其れに`, `其れ程` — tous déjà connus en kana) et `徐々/そろそろ`
    (lecture non-standard mais présente dans le CSV brut — écarté
    quand même car そろそろ existe déjà en kana depuis N4, la
    "correction" possible n'aurait fait que recréer un doublon).
    `其れでも/それでも` et `其れ故/それゆえ` gardés (absents du reste de
    la base malgré la même famille それ-).
  - **69 lots rédigés à ce stade, 1725/3278 mots bruts consommés**
    (~52,6% du total). Lot 69 propre (0 doublon) — entrée dans la
    tranche た-/たい- du vocabulaire N1.
  - **70 lots rédigés à ce stade, 1750/3278 mots bruts consommés**
    (~53,4% du total). `mockVocabPart14` à 715 entrées. Lot 70 : 2
    doublons écartés (`忽ち/たちまち` doublon de `たちまち` N2 déjà connu
    en kana ; `貴い/たっとい` doublon de contenu de `尊い/たっとい` dans
    le même lot — deux orthographes kanji valides du même mot, gardé
    `尊い` seul). **Coquille source corrigée** : `立方/たちかた` — 立方
    (sans okurigana) se lit りっぽう ("cube", terme de géométrie),
    jamais たちかた ; corrigé en `立ち方/たちかた` ("manière de se tenir
    debout"), cohérent avec l'okurigana manifestement perdue dans le
    CSV source.
  - **71 lots rédigés à ce stade, 1775/3278 mots bruts consommés.**
    Lot 71 : 4 doublons écartés (`煙草/たばこ`, `偶に/たまに`, `躊躇う/
    ためらう` — tous déjà connus en kana ; `仮令/たとえ` doublon
    sémantique de `たとえ` N3 existant, même sens "même si"). Gardé
    séparément `例え/たとえ` (sens nom "exemple, métaphore", différent
    de l'usage adverbial de `たとえ` déjà couvert) — même mot à
    l'origine mais deux fonctions grammaticales distinctes.
  - **72 lots rédigés à ce stade, 1800/3278 mots bruts consommés**
    (~54,9% du total). Lot 72 : zone たん-/だい-. 2 doublons écartés
    (`箪笥/たんす` doublon de `たんす` N2 déjà connu en kana, même sens
    "commode/armoire" ; `第一/だいいち` doublon sémantique de `だいいち`
    N2 existant, même sens "avant tout, en premier lieu" — vérifié que
    `だいいち` existant signifie bien "avant tout/en premier lieu" avant
    d'écarter). `短気/たんき` gardé distinct de `短期/たんき` (existant,
    "à court terme") — mots différents malgré homophonie totale,
    suffixe `tanki1` attribué. Paires homophones internes au lot
    résolues sans collision : `歎/たん` (élément de composé, sens
    "soupir/lamentation", id `tan`) vs `反/たん` (unité de mesure de
    tissu/terrain, id `tan1`) ; `短歌/たんか` (poème, id `tanka`) vs
    `担架/たんか` (civière, id `tanka1`) ; `大便/だいべん` (excréments, id
    `daiben`) vs `代弁/だいべん` (porte-parole, id `daiben1`).
  - **73 lots rédigés à ce stade, 1825/3278 mots bruts consommés**
    (~55,7% du total). Lot 73 (24 nets) : zone だ-/ち- (だかい→ちくしょう,
    indices 1800-1824). 1 doublon écarté (`騙す/だます` doublon de
    `だます` N2 existant, même sens "tromper"). `契る/ちぎる` gardé
    distinct de `ちぎる` N2 existant (「déchirer en petits morceaux」,
    mot différent) — homophone, sens "faire un serment d'amour",
    suffixe `chigiru1` attribué.
  - **74 lots rédigés à ce stade, 1850/3278 mots bruts consommés**
    (~56,4% du total). Lot 74 (25 nets, 0 doublon) : zone ち-/ちゃ-/
    ちゅ- (蓄積→中枢). `中傷/ちゅうしょう` gardé distinct de `抽象/
    ちゅうしょう` N2 existant (sens différents : "calomnie" vs
    "abstrait") — homophone, suffixe `chuushou1` attribué. Paire
    `著/ちゃく` (élément "remarquable/écrit", id `chaku`) vs `着/ちゃく`
    (élément "arrivée/revêtir", id `chaku1`) — deux kanjis distincts
    bound-morphemes avec la même lecture on'yomi, résolue sans
    collision.
  - **75 lots rédigés à ce stade, 1875/3278 mots bruts consommés**
    (~57,2% du total). Lot 75 (25 nets, 0 doublon) : zone ちゅう-/ちょう-.
    2 coquilles source corrigées (vérifiées dans le CSV brut avant
    correction) : `中腹/ちゅうっぱら` → 中腹 se lit normalement ちゅうふく
    ("mi-pente"), jamais ちゅうっぱら ; corrigé en `中っ腹/ちゅうっぱら`
    ("être de mauvaise humeur"), mot réel cohérent avec la lecture ;
    `昼飯/ちゅうはん` → 昼飯 se lit normalement ひるめし, jamais ちゅうはん ;
    corrigé en `中飯/ちゅうはん` (terme littéraire pour "déjeuner"), mot
    réel. `仲人/ちゅうにん` gardé tel quel (non corrigé) : lecture
    secondaire légitime et attestée de 仲人 (lecture usuelle なこうど,
    mais ちゅうにん existe en registre formel/juridique, même sens
    "entremetteur"). Quatre kanjis isolés homophones ちょう résolus sans
    collision : `腸` (intestin, id `chou`), `蝶` (papillon, id `chou1`),
    `超` (préfixe super-/ultra-, id `chou2`), `庁` (élément agence/
    bureau, id `chou3`).
  - **76 lots rédigés à ce stade, 1900/3278 mots bruts consommés**
    (~58,0% du total). Lot 76 (24 nets) : zone ちょう-/ちん-/つい-.
    1 doublon écarté (`一寸/ちょっと` doublon de `ちょっと` N5 existant,
    même mot, simple orthographe kanji rare). `次いで/ついで` gardé
    distinct de `ついで` N2 existant ("occasion, par la même occasion")
    — homophone, mot différent (adverbe "ensuite, successivement"),
    suffixe `tsuide1` attribué. **Note qualité (non bloquante)** :
    l'entrée `著/chaku` du lot 74 avait indiqué le sens "remarquable/
    ouvrage écrit" pour la lecture ちゃく, alors que cette lecture
    correspond en réalité au sens classique "revêtir/arriver" (variante
    historique de 着) — le sens "remarquable/écrit" est associé à la
    lecture ちょ (著書, 著名, tous deux corrects dans ce lot-ci).
    Imprécision mineure laissée telle quelle (pas de doublon ni
    d'erreur structurelle), à corriger si l'occasion se présente.
  - **77 lots rédigés à ce stade, 1925/3278 mots bruts consommés**
    (~58,7% du total). Lot 77 (25 nets, 0 doublon) : zone つ-.
    Plusieurs paires homophones つぐ résolues sans collision : `次ぐ`
    (N2 existant, id `tsugu`) et `注ぐ` (N3 existant, id `tsugu1`)
    occupaient déjà les suffixes standards ; les deux nouveaux mots
    `接ぐ` ("greffer/souder", id `tsugu2`) et `継ぐ` ("hériter/succéder",
    id `tsugu3`) ont nécessité de sauter au suffixe suivant disponible
    — bon rappel de la leçon "toujours vérifier l'id exact, pas
    supposer qu'il est libre". Autre paire homophone gérée : `作り`
    ("fabrication/structure", id `tsukuri`) vs `造り` ("construction/
    style architectural", id `tsukuri1`). `伝言/つてごと` confirmé dans
    le CSV brut (lecture kun classique légitime, différente de でんごん
    plus courante) — gardé tel quel, pas une coquille.
  - **78 lots rédigés à ce stade, 1950/3278 mots bruts consommés**
    (~59,5% du total). Lot 78 (21 nets) : zone つ- (勤め先→釣鐘). 4
    doublons écartés — record du chantier pour un seul lot :
    `詰らない/つまらない` et `積もり/つもり` (deux mots ultra-courants déjà
    connus en kana depuis N5/N4) ; `躓く/つまずく` doublon de `つまずく`
    N2 existant ; `吊るす/つるす` doublon de contenu de `吊す/つるす` N2
    existant (deux orthographes okurigana valides du même verbe,
    gardé `吊す` seul).
  - **79 lots rédigés à ce stade, 1975/3278 mots bruts consommés**
    (~60,3% du total). Lot 79 (25 nets, 0 doublon) : zone てあ-/てい-/
    てき-. Lot propre, aucune coquille source détectée.
  - **80 lots rédigés à ce stade, 2000/3278 mots bruts consommés**
    (~61,0% du total, cap symbolique des 2000 franchi). Lot 80 (25
    nets, 0 doublon) : zone てっ-/てん-. `転回/てんかい` gardé distinct de
    `展開/てんかい` N2 existant (sens différents : "virage/revirement"
    vs "développement") — homophone, suffixe `tenkai1`. `天才/てんさい`
    ("génie") et `天災/てんさい1` ("catastrophe naturelle") — deux mots
    distincts, même lecture, gérés sans collision dans le même lot.
    `鉄片/てっぺん` confirmé comme lecture réelle (assimilation sokuon +
    handakuten つ+へん→っぺん), homophone non problématique avec 天辺
    (absent de la base).
  - **81 lots rédigés à ce stade, 2025/3278 mots bruts consommés**
    (~61,8% du total). Lot 81 (22 nets) : zone てん-/で-/と-. 3
    entrées écartées : `出入り口/でいりぐち` doublon de contenu de
    `出入口` N2 existant (orthographe okurigana différente, même mot) ;
    `出鱈目/でたらめ` doublon de `でたらめ` N2 existant (kanji ateji rare
    pour le même mot déjà connu en kana) ; `と` (particule seule)
    écartée comme hors-périmètre du chantier vocabulaire — déjà
    couverte de façon exhaustive dans les chantiers de grammaire
    N5/N4, aucun contenu sémantique distinctif à en tirer comme "mot".
    `出切る/できる` (verbe godan rare, "être entièrement épuisé,
    écoulé") gardé distinct de `できる` N5 existant (出来る, "pouvoir",
    verbe ichidan) — vérifié dans le CSV brut, homophonie réelle mais
    mots et conjugaisons différents, suffixe `dekiru2` attribué.
    `電線/でんせん` gardé distinct de `伝染/でんせん` N2 existant (sens
    différents : "câble électrique" vs "contagion"), suffixe
    `densen1`.
  - **82 lots rédigés à ce stade, 2050/3278 mots bruts consommés**
    (~62,5% du total). Lot 82 (24 nets) : zone とう-/とお-. 1 coquille
    source écartée (pas corrigée) : `丁々/とうとう` — 丁々 se lit
    normalement ちょうちょう (onomatopée de chocs répétés), jamais
    とうとう ; confirmé dans le CSV brut, qui contient par ailleurs une
    ligne distincte `とうとう,とうとう,4` (même liste, niveau N4) —
    corruption probable par confusion avec cette entrée voisine.
    `とうとう` (kana) déjà présent dans la base depuis le chantier N4 ;
    corriger aurait recréé un doublon, donc écarté purement (même
    logique que `徐々/そろそろ`). Deux kanjis isolés homophones とう
    gérés sans collision avec l'id `tou` déjà pris (par 問う, lot 81) :
    `棟` (classificateur bâtiment, id `tou1`) et `等` (suffixe "etc.",
    id `tou2`).
  - **83 lots rédigés à ce stade, 2075/3278 mots bruts consommés**
    (~63,3% du total). Lot 83 (21 nets) : zone とか-/とく-/とじ-. 4
    doublons écartés : `通りかかる` doublon de contenu de `通り掛かる`
    N? existant (okurigana différente, même mot) ; `所が/ところが` et
    `所で/ところで` (deux conjonctions ultra-courantes déjà connues en
    kana) ; `疾っくに/とっくに` doublon de contenu de `とっくに` N2
    existant (kanji ateji rare pour le même mot).
  - **84 lots rédigés à ce stade, 2100/3278 mots bruts consommés**
    (~64,1% du total). Lot 84 (22 nets) : zone とっ-/とに-/とも-. 3
    doublons écartés : `迚も/とても` et `兎も角/ともかく` (mots ultra-
    courants déjà connus en kana) ; `捕らえる/とらえる` doublon de
    contenu de `捕える` N2 existant (okurigana différente, même verbe).
    Fait notable : `兎に角/とにかく` et `取りあえず/とりあえず` — deux mots
    extrêmement courants — n'existaient PAS encore dans la base malgré
    leur fréquence ; gardés tels quels (orthographe du CSV source).
  - **85 lots rédigés à ce stade, 2125/3278 mots bruts consommés**
    (~64,8% du total). Lot 85 (24 nets) : longue série 取り- (17 mots
    composés avec 取り). 1 entrée écartée : `副/とりわけ` — confirmé dans
    le CSV brut comme corruption évidente (deux lignes consécutives
    `取り分,とりわけ,1` puis `副,とりわけ,1`, la seconde ayant clairement
    hérité de la lecture de la première par erreur de scraping) ;
    écarté sans tentative de correction faute de mot cible fiable
    (contrairement aux autres coquilles du chantier, aucune lecture
    alternative plausible de 副 ne correspond à とりわけ). **Coquille
    source corrigée** : `取り分/とりわけ` → 取り分 (sans okurigana) se lit
    normalement とりぶん ("part, portion") ; corrigé en `取り分け/
    とりわけ` ("surtout, particulièrement"), cohérent avec l'okurigana
    manifestement perdue, non déjà présent dans la base. Trois kanjis
    isolés homophones どう gérés sans collision avec l'id `dou1` déjà
    pris (par どう "comment", N5) : `胴` (torse, id `dou`), `働`
    (élément travail/action, id `dou2`), `同` (élément même/identique,
    id `dou3`).
  - **86 lots rédigés à ce stade, 2150/3278 mots bruts consommés**
    (~65,6% du total). Lot 86 (21 nets) : zone どう-. 4 doublons
    écartés (`如何して/どうして`, `如何しても/どうしても`, `何卒/どうぞ`,
    `どうぞ宜しく/どうぞよろしく` — tous des mots/expressions ultra-
    courants déjà connus en kana depuis les niveaux inférieurs). Deux
    paires homophones どうし/どうじょう gérées sans collision : `同士`
    (entre/congénères, id `doushi`) vs `同志` (camarade, id `doushi2`
    — `doushi1` déjà pris par 動詞 N3) ; `同情` (compassion, id
    `doujou`) vs `道場` (dojo, id `doujou1`).
  - **87 lots rédigés à ce stade, 2175/3278 mots bruts consommés**
    (~66,4% du total). Lot 87 (20 nets) : zone どく-/どこ-/ない-. 5
    doublons écartés (`何処/どこ`, `何処か/どこか`, `何方/どちら`, `何の/
    どの` — pronoms/déterminants interrogatifs ultra-courants déjà
    connus en kana ; `怒鳴る/どなる` doublon de contenu de `どなる` N2
    existant).
  - **88 lots rédigés à ce stade, 2200/3278 mots bruts consommés**
    (~67,1% du total). Lot 88 (20 nets) : zone なが-/なさ-/なに-. 5
    doublons écartés (`何故/なぜ`, `何故なら/なぜなら`, `為さる/なさる` —
    mots/formes de politesse très courants déjà connus en kana ;
    `殴る/なぐる` et `何しろ/なにしろ` doublons de contenu N2 existants).
  - **89 lots rédigés à ce stade, 2225/3278 mots bruts consommés**
    (~67,9% du total). Lot 89 (23 nets) : zone なま-/なや-/なら-/なん-.
    2 doublons écartés (`何となく/なんとなく`, `何とも/なんとも`, mots
    ultra-courants déjà connus en kana). Paire homophone `慣らす`
    (habituer, id `narasu1`) vs `馴らす` (apprivoiser, id `narasu2`)
    gérée sans collision avec `narasu` déjà pris par `鳴らす` (N2,
    "faire sonner").
  - **90 lots rédigés à ce stade, 2250/3278 mots bruts consommés**
    (~68,6% du total, cap symbolique des 90 lots franchi). Lot 90 (25
    nets, 0 doublon) : zone に-/にゅう-/にん-. Lot entièrement propre —
    aucun doublon ni coquille source détecté.
  - **91 lots rédigés à ce stade, 2275/3278 mots bruts consommés**
    (~69,4% du total). Lot 91 (24 nets) : zone ぬ-/ね-. 1 doublon
    écarté (`捻子/ねじ` doublon de `ねじ` N2 existant, kanji rare pour
    le même mot "vis").
  - **92 lots rédigés à ce stade, 2300/3278 mots bruts consommés**
    (~70,2% du total). Lot 92 (24 nets) : zone ねん-/のう-/の-/は-. 1
    doublon écarté (`鋸/のこぎり` doublon de `のこぎり` N2 existant).
    Deux kanjis isolés homophones は gérés sans collision : les
    suffixes `ha1` (歯, N5) et `ha2` (葉, N4) étaient déjà pris,
    nécessitant de sauter à `ha` (libre, attribué à `刃`) et `ha3`
    (attribué à `派`) — encore un rappel de la leçon "toujours
    vérifier chaque suffixe candidat individuellement".
  - **93 lots rédigés à ce stade, 2325/3278 mots bruts consommés**
    (~70,9% du total). Lot 93 (24 nets) : zone はい-/はか-. 1 doublon
    écarté (`剥がす/はがす` doublon de contenu de `剥す` N2 existant,
    même verbe deux orthographes okurigana). Série de suffixes は
    presque tous déjà occupés, résolue en vérifiant chacun
    individuellement : `映える` (は+える, différent de `生える` N2
    "pousser") → `haeru1` ; `諮る`/`図る` (deux verbes はかる distincts,
    "consulter" vs "planifier") → `hakaru` (libre) et `hakaru2`
    (`hakaru1` pris par `計る` N3) ; `泊` (classificateur nuitée,
    différent de `掃く`/`履く`/`吐く` qui occupaient déjà haku/haku1/
    haku2/haku3) → `haku4`, après avoir dû vérifier quatre suffixes de
    suite avant d'en trouver un libre.
  - **94 lots rédigés à ce stade, 2350/3278 mots bruts consommés**
    (~71,7% du total). Lot 94 (23 nets) : zone はく-/はげ-/はじ-/はた-.
    2 doublons écartés (`始めまして/はじめまして` doublon de contenu N2
    existant ; `果たして/はたして` doublon de contenu de `果して` N2
    existant, même mot deux orthographes okurigana).
  - **95 lots rédigés à ce stade, 2375/3278 mots bruts consommés**
    (~72,5% du total). Lot 95 (22 nets) : zone はつ-/はな-/はま-. 3
    doublons écartés (`話し合い/はなしあい` doublon de `話合い` N2
    existant, `歯磨/はみがき` doublon de `歯磨き` N2 existant, `填める/
    はめる` doublon de `はめる` N2 existant — trois mots avec okurigana
    différente du même mot déjà connu).
  - **96 lots rédigés à ce stade, 2400/3278 mots bruts consommés**
    (~73,2% du total). Lot 96 (25 nets, 0 doublon) : zone はら-/はん-.
    Trois kanjis isolés homophones はん gérés sans collision (`han1`
    déjà pris par `半` N5) : `班` (groupe, id `han`), `判` (sceau, id
    `han2`), `版` (édition, id `han3`). Paire homophone `反乱`
    (rébellion, id `hanran`) vs `氾濫` (inondation, id `hanran1`).
  - **97 lots rédigés à ce stade, 2425/3278 mots bruts consommés**
    (~74,0% du total). Lot 97 (23 nets) : zone ばい-/ばく-/ひ-. 2
    doublons écartés (`馬鹿らしい/ばからしい` et `発条/ばね`, doublons de
    contenu N2 existants). `馬鹿馬鹿しい` (forme intensifiée/redoublée)
    gardé distinct, entrée séparée légitime du dictionnaire.
  - **98 lots rédigés à ce stade, 2450/3278 mots bruts consommés**
    (~74,7% du total). Lot 98 (25 nets, 0 doublon) : zone ひき-/ひさ-/
    ひと-. Deux lectures rares confirmées dans le CSV brut (pas des
    coquilles) : `未/ひつじ` (lecture spécifique au signe du zodiaque
    "chèvre/mouton", 8e des douze branches) et `単/ひとえ` (lecture
    kun rare signifiant "simple, non doublé", cf. 単衣).
  - **99 lots rédigés à ce stade, 2475/3278 mots bruts consommés**
    (~75,5% du total, seuil des trois quarts franchi). Lot 99 (22
    nets) : zone ひと-/ひな-/ひょ-. 3 doublons écartés (`一まず/ひとまず`,
    `一人でに/ひとりでに` — expressions ultra-courantes déjà connues en
    kana ; `百科辞典/ひゃっかじてん` doublon de contenu de `百科事典` N2
    existant, même mot). **Coquille source corrigée** : `一筋/
    ひとすき` — 一筋 se lit normalement ひとすじ ("dévoué corps et âme
    à"), jamais ひとすき ; confirmé dans le CSV brut, corrigé en
    `一筋/ひとすじ`, non déjà présent dans la base.
  - **100 lots rédigés à ce stade, 2500/3278 mots bruts consommés**
    (~76,3% du total — cap symbolique des 100 lots franchi). Lot 100
    (25 nets, 0 doublon) : zone ひれ-/ひん-/び-/ふう-. Lot entièrement
    propre.
    **Rééquilibrage TS2590 effectué après le lot 100** : script
    `rebalance_mockvocab.mjs` relancé sur les 6612 entrées totales →
    17 parts (16×400 + 1×212). Backup `mockVocab.ts.backup_before_rebalance_batch100`
    pris puis supprimé après vérification (comptage d'entrées
    cohérent : 6613 occurrences de `wordSegments:` = 6612 entrées + 1
    déclaration d'interface ; `tsc -b` propre). `mockVocabPart17`
    (nouveau chunk en croissance) à 212 entrées au moment du
    rééquilibrage.
  - **101 lots rédigés à ce stade, 2525/3278 mots bruts consommés**
    (~77,0% du total). Lot 101 (23 nets) : zone ふか-/ふく-/ふさ-/ふし-.
    2 doublons écartés (`不山戯る/ふざける` doublon de contenu N2
    existant ; `付属/ふぞく` doublon sémantique de `附属` N2 existant,
    kanji variant 付/附 interchangeables dans ce composé). **Coquille
    source corrigée** : `復旧/ふくきゅう` — lecture standard ふっきゅう
    (avec sokuon), confirmée dans le CSV brut comme corruption ;
    corrigé, non déjà présent dans la base. Six homophones ふ- gérés
    en trouvant le suffixe libre suivant (`fukin1`, `fuku3` — fuku/
    fuku1/fuku2 déjà pris par 拭く/吹く/服 —, `fukushi1`, `fukeru1`,
    `fugou1`, `fusai1`) ; paire `不審`(id `fushin`)/`不振`(id `fushin1`).
  - **102 lots rédigés à ce stade, 2550/3278 mots bruts consommés**
    (~77,8% du total). Lot 102 (25 nets, 0 doublon) : zone ふちょう-/
    ふん-. Lot entièrement propre.
  - **103 lots rédigés à ce stade, 2575/3278 mots bruts consommés**
    (~78,6% du total). Lot 103 (23 nets) : zone ふん-/ぶ-. 2 doublons
    écartés (`打付ける/ぶつける`, `ぶら下げる/ぶらさげる` — doublons de
    contenu N2 existants, même mot orthographe différente).
  - **104 lots rédigés à ce stade, 2600/3278 mots bruts consommés**
    (~79,3% du total). Lot 104 (24 nets) : zone ぶん-/へい-/へん-. 1
    doublon écarté (`臍/へそ` doublon de `へそ` N2 existant, kanji rare
    pour "nombril"). Plusieurs homophones へ résolus en trouvant le
    suffixe libre suivant : `兵器`(id `heiki1`, `heiki` pris par 平気
    N2) ; `閉口`/`平行` (deux mots distincts, `heikou` pris par 並行 N2)
    → `heikou1`/`heikou2` ; `経る`(id `heru1`, `heru` pris par 減る N2) ;
    `編`/`偏` → `hen` (libre) et `hen3` (`hen1`=辺 N5, `hen2`=変 N4 déjà
    pris).
  - **105 lots rédigés à ce stade, 2625/3278 mots bruts consommés**
    (~80,1% du total, seuil des 80% franchi). Lot 105 (25 nets, 0
    doublon) : zone へん-/べん-/ほう-. Deux paires homophones ほう-
    gérées sans collision : `放棄`(id `houki`)/`宝器`(id `houki1`) ;
    `豊作`(id `housaku`)/`方策`(id `housaku1`). `法学` distinct de
    `方角` N2 existant (`hougaku` déjà pris), suffixe `hougaku1`.
  - **106 lots rédigés à ce stade, 2650/3278 mots bruts consommés**
    (~80,8% du total). Lot 106 (25 nets, 0 doublon) : zone ほう-/ほ-.
    Paire classique じる/ずる continuée (`報じる`/`報ずる`, même schéma
    que 禁じる/禁ずる et 準じる/準ずる des sessions précédentes — le
    ずる prend `verbClass: 'irregular'` avec les radicaux dérivés de
    じる). `保険` distinct de `保健` N2 existant (`hoken` déjà pris),
    suffixe `hoken1`.
  - **107 lots rédigés à ce stade, 2675/3278 mots bruts consommés**
    (~81,6% du total). Lot 107 (24 nets) : zone ほじ-/ほん-. 1 doublon
    écarté (`殆ど/ほとんど` mot ultra-courant déjà connu en kana).
    `保母/ほぼ` gardé tel quel (sens "nourrice/éducatrice", terme
    ancien) malgré l'homophonie avec l'adverbe très courant ほぼ
    ("presque") — absent de la base, donc pas de conflit, aucun risque
    de confusion sémantique (noms vs adverbe).
  - **108 lots rédigés à ce stade, 2700/3278 mots bruts consommés**
    (~82,4% du total). Lot 108 (22 nets) : zone ほん-/ぼう-/ぼ-/ま-. 3
    entrées écartées : `坊ちゃん/ぼっちゃん` et `藍褸/ぼろ` (doublons de
    contenu N2 existants) ; `卯/ぼう` écarté sans correction — confirmé
    dans le CSV brut mais aucune lecture standard de 卯 ne correspond
    à ぼう (contrairement à う pour le signe zodiacal "lapin"), et
    aucun candidat de substitution suffisamment fiable identifié
    (contrairement aux coquilles précédentes où le mot cible était
    évident) ; écarté par prudence plutôt que deviné. `膨脹/ぼうちょう`
    confirmé comme variante kanji légitime de 膨張 (脹/張
    interchangeables), gardé tel quel, non dupliqué.
  - **109 lots rédigés à ce stade, 2725/3278 mots bruts consommés**
    (~83,1% du total). Lot 109 (25 nets, 0 doublon) : zone まえ-/ま-.
    Paire homophone `任す`(confier, id `makasu`)/`負かす`(vaincre, id
    `makasu1`) gérée sans collision.
  - **110 lots rédigés à ce stade, 2750/3278 mots bruts consommés**
    (~83,9% du total, cap des 110 lots franchi). Lot 110 (21 nets) :
    zone まず-/また-/まと-. 4 doublons écartés (`跨ぐ/またぐ`, `眩しい/
    まぶしい`, `目蓋/まぶた`, `間もなく/間も無く` — tous doublons de
    contenu N2 existants avec okurigana différente).
  - **111 lots rédigés à ce stade, 2775/3278 mots bruts consommés**
    (~84,7% du total). Lot 111 (24 nets) : zone まる-/まん-/み-. 1
    doublon écarté (`惨め/みじめ` doublon de contenu N2 existant).
  - **112 lots rédigés à ce stade, 2800/3278 mots bruts consommés**
    (~85,4% du total). Lot 112 (23 nets) : zone み-. 2 entrées
    écartées : `見っともない/みっともない` doublon de contenu N2 existant ;
    `見舞/みまい` — okurigana い manifestement perdue (le mot standard
    est 見舞い), mais `見舞い` existe déjà dans la base, donc corriger
    aurait recréé un doublon → écarté directement (même logique que
    `徐々/そろそろ` et `丁々/とうとう`).
  - **113 lots rédigés à ce stade, 2825/3278 mots bruts consommés**
    (~86,2% du total). Lot 113 (25 nets, 0 doublon) : zone み-/む-.
    Paire homophone `民族`(ethnie, id `minzoku`)/`民俗`(folklore, id
    `minzoku1`) gérée sans collision.
  - **114 lots rédigés à ce stade, 2850/3278 mots bruts consommés**
    (~86,9% du total). Lot 114 (22 nets) : zone む-/めい-/め-. 3
    doublons écartés (`滅茶苦茶/めちゃくちゃ`, `愛でたい/めでたい` — mots
    ultra-courants déjà connus en kana ; `目眩/めまい` doublon de
    contenu N2 existant).
  - **115 lots rédigés à ce stade, 2875/3278 mots bruts consommés**
    (~87,7% du total). Lot 115 (20 nets) : zone めん-/もう-/もし-. 5
    doublons écartés (`若し/もし`, `若しかしたら/もしかしたら`, `若しかす
    ると/もしかすると`, `若しも/もしも` — mots/expressions ultra-courants
    déjà connus en kana ; `凭れる/もたれる` doublon de contenu N2
    existant). `若しかして/もしかして` et `若しくは/もしくは` gardés
    (absents de la base malgré leur fréquence). `設ける` distinct de
    `儲ける` N2 existant (`moukeru` déjà pris), suffixe `moukeru1`.
  - **116 lots rédigés à ce stade, 2900/3278 mots bruts consommés**
    (~88,5% du total). Lot 116 (22 nets) : zone もっ-/もの-/もれ-/や-.
    3 entrées écartées : `物置き/ものおき` doublon de contenu de `物置`
    N2 existant ; `喧しい/やかましい` doublon de contenu N2 existant ;
    `物体ない/もったいない` — coquille évidente (勿体ない corrompu en
    物体ない, confirmé dans le CSV brut), mais `もったいない` déjà
    présent dans la base (ajouté niveau N2) donc écarté sans correction
    (même logique que `徐々/そろそろ` et `丁々/とうとう`). `漏る` gardé
    distinct de `盛る` N2 existant (`moru` déjà pris), suffixe `moru1`.
  - **117 lots rédigés à ce stade, 2925/3278 mots bruts consommés**
    (~89,2% du total). Lot 117 (22 nets) : zone やが-/やす-/やむ-. 3
    doublons écartés (`矢っ張り/やっぱり`, `矢鱈に/やたらに`, `やっ付ける/
    やっつける` — tous doublons de contenu N2 existants, kanji ateji
    pour des mots déjà connus en kana).
  - **118 lots rédigés à ce stade, 2950/3278 mots bruts consommés**
    (~90,0% du total, seuil des 90% franchi). Lot 118 (25 nets, 0
    doublon) : zone やや-/やる-/ゆう-. `勇敢` distinct de `夕刊` N2
    existant (`yuukan` déjà pris), suffixe `yuukan1`.
  - **119 lots rédigés à ce stade, 2975/3278 mots bruts consommés**
    (~90,7% du total). Lot 119 (23 nets) : zone ゆ-/よう-. 2 doublons
    écartés (`好い/よい` mot ultra-courant déjà connu en kana ;
    `茹でる/ゆでる` doublon de contenu N2 existant). Paires homophones
    ようご/ようし résolues sans collision (`yougo`/`youshi` déjà pris
    par 用語/要旨 N2) : `養護`→`yougo1`, `用紙`→`youshi1`.
  - **120 lots rédigés à ce stade, 3000/3278 mots bruts consommés**
    (~91,5% du total). Lot 120 (23 nets) : zone よ-. 2 doublons écartés
    (`宜しく/よろしく` mot ultra-courant déjà connu en kana ; `寄こす/
    よこす` doublon de contenu N2 existant, "envoyer (vers moi)" — kanji
    ateji pour un mot déjà connu en kana). `mockVocabPart17` à 678
    entrées après insertion, toujours largement sous le seuil de
    rééquilibrage (~1500-2000).
  - **121 lots rédigés à ce stade, 3025/3278 mots bruts consommés**
    (~92,3% du total). Lot 121 (25 nets, 0 doublon) : zone よわ-/りょう-.
    `利根/りこん` vérifié dans le CSV brut : pas une corruption (kanji-
    lecture cohérents, distinct de `離婚/りこん` N3 qui est une entrée
    séparée) — mot littéraire authentique signifiant « à l'esprit vif »,
    conservé comme adjectif en -na. Paires homophones りょう/りょうかい
    résolues : `了`→`ryou` (libre), `料`→`ryou1` (`ryou2`=量 N3 déjà
    pris) ; `了解`→`ryoukai` (libre), `領海`→`ryoukai1`.
  - **122 lots rédigés à ce stade, 3050/3278 mots bruts consommés**
    (~93,0% du total). Lot 122 (25 nets, 0 doublon) : zone りょう-/れん-.
    Aucune collision d'id ni de mot.
  - **123 lots rédigés à ce stade, 3075/3278 mots bruts consommés**
    (~93,8% du total, reste ~203 mots soit ~8 lots). Lot 123 (22 nets) :
    zone れん-/ろう-/わ-. 3 doublons écartés (`我がまま/わがまま`,
    `態と/わざと` — mots ultra-courants déjà connus en kana ; `割合に/
    わりあいに` doublon de contenu N2 existant, "relativement"). `枠`
    (nom, "cadre/limite") distinct de `湧く`/`沸く` N-existants
    (`waku`/`waku1` déjà pris), suffixe `waku2`.
  - **124 lots rédigés à ce stade, 3100/3278 mots bruts consommés**
    (~94,6% du total, reste ~178 mots soit ~7 lots). Lot 124 (23 nets) :
    zone わ-, puis **bascule dans la section emprunts katakana** de la
    liste source (`n1_vocab_new.json` passe de vocabulaire kanji à des
    mots étrangers en katakana à partir de l'indice ~3079 — アクセル,
    アップ, etc., jusqu'à la fin de la liste à 3278). 2 doublons écartés
    (`割引き/わりびき` doublon de contenu `割引` N2 existant ; `割り算/
    わりざん` doublon de contenu `割算` N2 existant, même mot avec
    okurigana différente).
  - **125 lots rédigés à ce stade, 3125/3278 mots bruts consommés**
    (~95,3% du total, reste ~153 mots soit ~6 lots). Lot 125 (25 nets, 0
    doublon) : zone katakana オー-/ゲ-. Aucune collision.
  - **126 lots rédigés à ce stade, 3150/3278 mots bruts consommés**
    (~96,1% du total, reste ~128 mots soit ~5 lots). Lot 126 (25 nets, 0
    doublon) : zone katakana コ-/サ-/シ-/ジ-. `サンキュー` homophone
    romaji de `産休` N1 existant (`sankyuu` déjà pris, lectures
    distinctes さんきゅう vs sankyuu), suffixe `sankyuu1`. `サボる` traité
    comme verbe godan (emprunt verbalisé, conjugaison サボる/サボらない/
    サボった).
  - **127 lots rédigés à ce stade, 3175/3278 mots bruts consommés**
    (~96,9% du total, reste ~103 mots soit ~4 lots). Lot 127 (25 nets, 0
    doublon) : zone katakana ジャ-/タイ-. `センス` homophone romaji de
    `扇子` N2 existant (`sensu` déjà pris, lectures distinctes せんす vs
    sensu), suffixe `sensu1`.
  - **128 lots rédigés à ce stade, 3200/3278 mots bruts consommés**
    (~97,6% du total, reste ~78 mots soit ~3 lots). Lot 128 (25 nets, 0
    doublon) : zone katakana タイ-/ダ-/チ-/テ-/デ-/ト-/ドライ. Aucune
    collision.
  - **129 lots rédigés à ce stade, 3225/3278 mots bruts consommés**
    (~98,4% du total, reste ~53 mots soit ~2-3 lots). Lot 129 (25 nets,
    0 doublon) : zone katakana ドライ-/ナ-/ニ-/ネ-/ノ-/ハ-/バ-/パ-/ヒ-/ビ-/
    ファ-. Aucune collision.
  - **130 lots rédigés à ce stade, 3250/3278 mots bruts consommés**
    (~99,1% du total, reste ~28 mots soit le dernier lot). Lot 130 (25
    nets, 0 doublon) : zone katakana フィ-/ブ-/ベ-/ペ-/ホ-/ボ-/ポ-/マ-/ミ-.
    Aucune collision.
  - **131 lots rédigés, 3278/3278 mots bruts consommés (100%) —
    CHANTIER VOCABULAIRE N1 TERMINÉ.** Lot 131 (28 nets, 0 doublon,
    dernier lot) : zone katakana ミ-/ム-/メ-/モ-/ヤ-/ユ-/ラ-/ル-/レ-/ロ-/
    ワット, jusqu'à la toute fin de la liste source. Aucune collision.
    `tsc -b` propre après insertion. Total final : 3099 mots N1 dans la
    base (7351 entrées vocabulaire toutes JLPT confondus).
    `mockVocabPart17` à 951 entrées, toujours sous le seuil de
    rééquilibrage (~1500-2000) mais à surveiller si un futur chantier
    (N1 grammaire ne touche pas ce fichier, donc stable pour l'instant).
    **Bilan du chantier** : ~250 doublons/corruptions détectés et
    corrigés ou écartés sur l'ensemble des 131 lots (vrais doublons
    orthographiques, coquilles de la source CSV confirmées puis
    corrigées ou abandonnées sans cible fiable, homophones légitimes
    résolus par suffixe numérique après vérification individuelle de
    chaque candidat). Méthodologie répétée avec succès sur 131 lots
    consécutifs sans une seule régression `tsc` ni doublon non détecté
    ayant atteint le fichier final.
- [x] Grammaire N1 — **TERMINÉ**. Pas de source scrapée officielle
  (comme N5/N4/N3/N2) : points compilés à la main à partir des
  programmes JLPT N1 standards, en croisant systématiquement contre les
  345 patterns déjà présents dans `mockGrammar.ts` (dédoublonnage sur
  `id` ET `pattern`, leçon retenue du chantier N2). Constat de départ :
  le chantier N2 précédent avait déjà couvert un nombre inhabituellement
  élevé de patterns frontière N1 (tagués N2 dans le fichier — にほかな
  らない, ざるを得ない, てはならない, にもかかわらず, を禁じ得ない,
  んばかりに, ものと思われる, あるまじき, etc.), donc la liste de
  candidats génuinement nouveaux pour N1 était plus courte que prévu
  après filtrage rigoureux des quasi-doublons (ex. いかんによって(は)
  écarté car trop proche de いかんで(は) déjà présent ; にとどまらない
  écarté car trop proche de にとどまらず ; を機に écarté car trop proche
  de をきっかけに). Pipeline : lots `.mjs` dans le scratchpad
  (`n1_grammar_batch1-3.mjs`, format identique aux chantiers précédents :
  `id`/`pattern`/`jlptLevel`/`meaning`/`rule`/`usage` en français +
  exactement 2 `examples` avec `segments` furigana et highlight sur le
  point de grammaire), vérification systématique (compte, dédoublonnage
  id+pattern contre l'existant ET en interne, présence des 2 exemples,
  highlight présent) via script Node, insertion via
  `insert_n1_grammar_batches.mjs` (adapté du script N2), `tsc -b` propre
  après chaque lot. **3 lots, 29 nouveaux points N1** : きらいがある,
  ごとし／ごとく／ごとき, さながら, じゃあるまいし, だに, たところで,
  つ〜つ, であれ〜であれ, といい〜といい, とおぼしき, に至る, にあって,
  にかかわる, にかんがみて, によらず, ひとり〜のみならず, べからざる,
  までだ／までのことだ, んがため(に), あろうことか, ずには済まない,
  のなんのって, も辞さない, をおして, んとする, からして,
  ぐらいのものだ, には及ばない, てはいられない. Total `mockGrammar.ts`
  final : **374 entrées** (81 N5 + 43 N4 + 69 N3 + 151 N2 + 30 N1 dont
  le point `ni-hokanaranai` préexistant). Aucun doublon détecté (374 id
  uniques, 374 patterns uniques). Fichier reste un seul array plat (pas
  de chunking nécessaire, loin du seuil TS2590 contrairement à
  `mockVocab.ts`).

**Chantier de contenu JLPT N5→N1 (kanjis, vocabulaire, grammaire)
intégralement terminé** à ce stade — les 16 tâches de contenu
initialement suivies sont toutes complétées.

**Reste à faire** : rien d'identifié pour l'instant sur N3 (kanjis,
vocabulaire et grammaire tous terminés — 341 kanjis, 1220 mots, 195
points de grammaire dont 68 nouveaux). Prochaine étape : **N2**
(kanjis, en réappliquant la méthode "toujours vérifier le contenu réel
d'une source avant de s'y fier", prouvée deux fois sur N3).

- [x] Kanjis N2 — **TERMINÉ** (374 kanjis).
- [x] Vocabulaire N2 — **TERMINÉ**. 70 lots, 4254 entrées finales dans
  `mockVocab.ts` (2521→4254, +1733 nets). `n2_vocab_new.json` (source
  cotoacademy.com) épuisé. `mockVocabPart7` env. 1900+ entrées en fin
  de chantier — encore sous le seuil TS2590 (~2000-2200) mais à
  surveiller/rééquilibrer tôt sur N1 (script `rebalance_mockvocab.mjs`
  déjà identifié si besoin). Leçons dédoublonnage : toujours vérifier
  après coup sur le champ `word` (jamais avant, le pipeline source ne
  le permet pas) ; supprimer les vrais doublons de contenu (kana vs
  kanji, lecture alternative, okurigana manquant, translittération
  katakana alternative), ne jamais les renommer ; garder en revanche
  les vraies paires homophone-kanji (掘る/彫る, 混ざる/交ざる, 汲む/酌む,
  増える/殖える) qui sont des mots distincts malgré la même lecture.
  Deux incidents de mutilation d'accolades par `Edit` lors de
  suppression de doublon (toujours re-vérifier `tsc -b` immédiatement
  après une suppression d'entrée, corriger par un second `Edit` si le
  fichier est mal formé). Plusieurs coquilles de source PDF→CSV
  corrigées avant rédaction (lectures tronquées, kanji faux, okurigana
  manquant, transcriptions erronées).
- [x] Grammaire N2 — **TERMINÉ**. Pas de source scrapée officielle
  (comme pour N5/N4/N3) : points compilés à la main à partir des
  programmes JLPT standards. Constat de départ : plusieurs patterns
  classiquement N2 sont déjà taggés `N3` dans le fichier existant
  (〜ざるを得ない, 〜てはならない, 〜にもかかわらず, 〜を問わず,
  〜というものではない, 〜っぽい, 〜だらけ, etc. — 195 patterns
  existants au total, considérés comme acquis/non remis en cause) ; les
  nouveaux lots N2 évitent donc ces doublons et visent des patterns
  plus avancés / frontière N1. Pipeline : lots `.mjs` dans le
  scratchpad (`n2_grammar_batch*.mjs`, 8-15 points chacun, format
  identique à N3 : `id`/`pattern`/`jlptLevel`/`meaning`/`rule`/`usage`
  en français + exactement 2 `examples` avec `segments` furigana),
  vérification du compte via `node -e "import(...)"`, insertion via
  `insert_n2_grammar_batches.mjs` (adapté du script N3), `tsc -b`
  propre après chaque lot. **12 lots, 150 nouveaux points N2**, total
  `mockGrammar.ts` final : 345 entrées (81 N5 + 43 N4 + 69 N3 + 151 N2
  dont le `wake-dewa-nai` préexistant + 1 point N1 préexistant hors
  chantier). Échelle comparable à N3 (195), largement au-dessus de N4
  (43). **3 vrais doublons détectés et supprimés** en cours de route
  par un contrôle dédié sur le champ `pattern` (pas seulement `id`,
  qui ne suffit pas — deux lots avaient réutilisé sans le savoir un id
  ET un pattern déjà présents dans le contenu N3 existant) :
  `〜末に`/`〜からすると`/`〜っこない` (déjà taggés N3 dans le fichier).
  **Leçon retenue pour N1** : après extraction de la liste de patterns
  existants avant de démarrer un chantier de grammaire, dédupliquer
  systématiquement à la fois sur `id` ET sur `pattern` après chaque
  lot inséré (pas seulement `tsc -b`), car deux entrées avec des `id`
  différents peuvent quand même dupliquer le même `pattern` japonais si
  le rédacteur n'a pas vérifié la liste complète avant de rédiger.
  Suppression toujours via calcul de plage de lignes + script Node
  (jamais `Edit` sur un bloc multi-lignes de ce fichier généré par
  `tsLiteral`, pour éviter tout risque de mutilation d'accolades).

- [x] Kanjis N1 — **TERMINÉ. 1501/1501 kanjis génuinement nouveaux
  écrits** (75 lots, `mockKanji.ts` passé de 990 à 2491 entrées toutes
  niveaux confondus). Source jlptsensei.com à nouveau
  (`/jlpt-n1-kanji-list/page/N/`, 16 pages, `class=jl-row`/`jl-td-k`/
  `jl-td-on`/`jl-td-kun`/`jl-td-m`), total confirmé par le site lui-même
  ("JLPT N1 Kanji List total: (1504)") — **1504 kanjis**, extraction
  brute par script Node (`parse_n1_kanji_pages.mjs`). Page 3 bloquée par
  un challenge anti-bot (Cloudflare/Ezoic) au fetch direct `curl` :
  contournée via le Browser tool (chargement JS réel, résolution
  automatique du challenge après quelques secondes d'attente), extrait
  via `document.querySelectorAll` dans la page rendue plutôt que par
  regex HTML brut pour cette page précise. **3 des 1504 déjà connus**
  (présents sous un autre niveau) → **1501 kanjis génuinement
  nouveaux pour N1** (`n1_kanji_new.json`). Tracés KanjiVG récupérés
  en bloc pour les 1501 d'un coup (`fetch_strokes_n1.mjs`, zéro échec)
  plutôt qu'au fur et à mesure des lots, pour ne plus avoir à s'en
  soucier ensuite. **Pipeline de réconciliation mis en place dès le
  début** (leçon retenue du chantier N2 kanji : ne jamais suivre un
  offset à la main) : `n1_kanji_reconcile.mjs` recalcule à chaque
  lancement, en comparant `n1_kanji_new.json` à l'état RÉEL de
  `mockKanji.ts` (regex `^ {4}character: "..."` sur les caractères déjà
  écrits), la liste exacte des kanjis N1 restants
  (`n1_kanji_remaining.json`) — lancé après chaque lot pour piocher le
  batch suivant, zéro risque de doublon ou d'oubli même si des lots
  sont rédigés dans le désordre. Lots de 20 kanjis (`n1_kanji_batch*.mjs`
  dans le scratchpad, même format que N2 : id/character/jlptLevel/
  meanings/themes/onyomi/kunyomi/radical/strokeCount/frequentWords/
  examples), insertion via `insert_n1_kanji_batches.mjs` (adapté du
  script N2, pointe vers `n1_strokes_array.json`), `tsc -b` propre
  après chaque lot (75 lots, dernier lot de 21 pour arriver pile à
  1501). Chantier de loin le plus gros de tout le projet (plus grand
  que tout le chantier vocabulaire N2 en nombre d'entrées).
  - **Beaucoup de kanjis N1 sont rares/spécifiques aux noms propres**
    (bien plus que N2) : convention appliquée systématiquement — entrée
    complète quand même (tous les champs), mais `meanings`/`examples`
    notent explicitement "souvent utilisé dans les prénoms/noms de
    famille/toponymes" plutôt que d'inventer un usage courant fictif.
  - **Incident détecté et corrigé après le dernier lot (75) : 449
    doublons d'`id`** (403 groupes) sur les 2491 entrées totales du
    fichier (0 doublon de `character` en revanche — donc pas de contenu
    dupliqué, juste des clés `id` partagées par deux kanjis différents).
    Cause : contrairement aux chantiers N2/N3/N4/N5 précédents où un
    `grep -oE "\"racine[0-9]*\"" mockKanji.ts | sort -V -u` était
    systématiquement relancé avant chaque lot pour trouver le prochain
    suffixe libre, ce chantier N1 a incrémenté les suffixes **de
    mémoire** d'un lot à l'autre (`shi44`, `shi45`, `shi46`...) sans
    revérifier contre l'état réel du fichier ni contre les kanjis
    N2/N3/N4/N5 préexistants partageant la même racine romaji — collision
    silencieuse, jamais détectée par `tsc -b` (deux chaînes `id`
    identiques ne cassent pas la compilation TS). Détecté seulement en
    fin de chantier par un script dédié de comptage id vs character.
    **Corrigé** par un script générique (`fix_duplicate_kanji_ids.mjs`,
    scratchpad) : repère toutes les déclarations `id:` par position dans
    le fichier, garde la première occurrence de chaque id dupliqué
    inchangée, renomme chaque occurrence suivante en cherchant le
    prochain suffixe numérique libre pour la même racine romaji dans
    l'espace **global** de tous les ids du fichier (pas seulement N1) —
    449 renommages appliqués par remplacement ciblé à l'offset exact
    (jamais par chaîne globale, pour ne pas toucher les autres
    occurrences du même id), en partant d'une sauvegarde préalable du
    fichier. Revérifié après coup : 0 doublon d'id, 0 doublon de
    character sur les 2491 entrées, `tsc -b` propre. **Leçon retenue
    pour tout futur chantier de contenu avec des ids `racine+chiffre`** :
    ne jamais incrémenter un suffixe de mémoire d'un lot à l'autre même
    au sein d'un seul chantier — toujours revérifier par script contre
    l'état réel du fichier (et pas seulement la portion du niveau en
    cours) avant de rédiger le lot suivant, comme cela avait déjà été
    établi mais pas assez systématiquement appliqué ici.

## Phase actuelle : contenu mock + première couche de persistance réelle

La règle "ne pas ajouter de persistance tant que ce n'est pas explicitement
demandé" a tenu tout le début du projet — **elle vient d'être levée par une
demande explicite de l'utilisateur** : vrais profils créables/
sélectionnables + mémoire de ce qui est coché "Maîtrisé" en séance. Voir la
section dédiée "Persistance réelle (IndexedDB via Dexie)" plus bas pour le
détail. Ce qui reste vrai malgré tout : **toujours pas de FSRS** (pas
d'intervalle de révision, pas de date de prochaine carte, pas d'ease
factor — seulement mastered/pas mastered par item), et le contenu
pédagogique lui-même (kanjis/vocabulaire/grammaire) reste entièrement
statique dans les fichiers `mock*.ts`, ce n'est que le **suivi de
progression** qui est maintenant réel. Ne pas ajouter ts-fsrs ou une
planification de répétition espacée tant que ce n'est pas, à nouveau,
explicitement demandé.

## Ce qui est fait

- Scaffold Vite + React + TypeScript + React Router + Zustand +
  framer-motion + lucide-react
- Navigation complète entre tous les écrans (barre d'onglets responsive :
  en bas en portrait, sur le côté en paysage/desktop)
- `/` Sélection de profil — soignée, animée
- `/dashboard` — récit unifié de la séance du jour, avec un interrupteur
  entre deux modes qui ne recharge pas le reste de la page :
  - **Recommandée** (turquoise) : stats du jour (kanjis/mots/grammaire/
    cartes) + durée + bouton. Pas de détail d'étapes affiché (source de
    confusion en V1 de ce panneau, retiré)
  - **Personnalisée** (corail — couleur distincte du mode recommandé) :
    niveau JLPT choisi en premier (5 boutons, un seul actif), puis
    sélection libre de modules (Kanjis/Vocabulaire/Grammaire/Révisions),
    configuration par boutons uniquement (esprit Anki, jamais de liste
    déroulante), **jamais de quota chiffré** — règle la plus importante
    de ce mode
  Plus : anneau d'objectif avec compteurs concrets + projection de
  rythme, mot du jour actionnable (favori, voir la fiche),
  micro-interactions
- Bouton de changement de profil (avatar, dans la nav principale) —
  renvoie à `/`, visible sur tous les écrans sous `MainLayout`
- Thème clair/sombre : bouton soleil/lune dans la nav principale,
  bascule manuelle via `themeStore` + attribut `data-theme` sur `<html>`
  (initialisé sur la préférence système). Pas encore persisté (pas de
  storage à ce stade) — repart du système à chaque rechargement
- `/session` — écran de séance flashcard (kanji/vocab/grammaire), voir
  section dédiée ci-dessous. Construit, pas encore explicitement validé
  comme référence visuelle (contrairement au Dashboard et à la
  sélection de profil)
- `/session/test` — Tester mes connaissances, voir section dédiée
- `/explorer` — dictionnaire libre, voir section dédiée
- `/notebook` (Cahier) — voir section dédiée ci-dessous
- `/stats` — développé (voir section dédiée ci-dessous). Les 2 écrans
  restants (`/settings`, `/training`) sont des placeholders fonctionnels
  et navigables, pas encore développés en détail
- Champs lexicaux sur les kanjis (`Kanji.themes`) + filtre "Champ lexical"
  dans Explorer — voir section dédiée ci-dessous

## Persistance réelle (IndexedDB via Dexie)

Demande explicite de l'utilisateur : "avoir la possibilité de créer et
sélectionner de vrais profils et garder les notions en mémoire une fois
qu'on a coché maîtrisé". Package `dexie` + `dexie-react-hooks` ajoutés
(seules nouvelles dépendances de tout le projet à ce stade). Tout vit
dans `src/db/` :

- **`db.ts`** — un seul IndexedDB partagé (`new Dexie('pera-pera')`,
  version 1), pas une base séparée par profil (plus simple à ouvrir/
  gérer) : l'isolation entre profils se fait via `profileId` en préfixe
  de chaque enregistrement, pas via des bases physiquement distinctes.
  Deux tables :
  - `profiles` — `{ id, name, colorIndex, createdAt }`
  - `mastery` — `{ id (auto), profileId, kind: 'kanji'|'vocab'|
    'grammar', itemId, masteredAt }`, index composé
    `[profileId+kind+itemId]` pour l'upsert/lookup d'un item précis,
    `profileId` et `[profileId+kind]` pour compter/lister par profil
    sans charger toute la table
- **`profiles.ts`** — `listProfiles()` (amorce la base avec Alex/Camille
  au tout premier lancement si la table est vide — pour ne pas faire
  disparaître les deux profils qui existaient en dur jusqu'ici) et
  `createProfile(name)` (`colorIndex` qui tourne sur la palette existante
  selon le nombre de profils déjà créés)
  - **Bug corrigé : création de profil silencieusement cassée en accès
    LAN (iPad).** `id` généré à l'origine avec `crypto.randomUUID()`,
    qui n'existe que dans un "secure context" (HTTPS ou `localhost`) —
    indisponible quand l'app est ouverte via l'IP locale du réseau
    (`http://192.168.x.x:5173`, le mode d'accès iPad mis en place plus
    tôt dans le projet), donc `createProfile` levait une exception à
    chaque tentative dans ce cas précis (marchait très bien en
    `localhost`, ce qui masquait le problème pendant le développement).
    Remplacé par `generateId()` dans `profiles.ts` : essaie
    `crypto.randomUUID()`, sinon `crypto.getRandomValues()` (disponible
    partout, contrairement à `randomUUID`) pour fabriquer un UUID v4
    manuellement, sinon un id de secours `Date.now()`+`Math.random()`.
- **`mastery.ts`** — `setMastered(profileId, kind, itemId, decision)` :
  `decision: 'mastered'` ajoute un enregistrement (idempotent, ne
  duplique pas si déjà présent) ; `decision: 'review'` **retire**
  l'enregistrement existant s'il y en a un — la table `mastery` ne
  représente donc que le **dernier verdict connu** par item, pas un
  historique complet des essais. Un item redevient donc "à revoir" si on
  le re-décide ainsi après l'avoir déjà coché "Maîtrisé". Aussi
  `getMasteredIds(profileId, kind)`, `countMastered(profileId, kind)`,
  `getAllMasteredIds(profileId)` (une seule requête, bucket les 3 kinds
  — utilisé par Stats pour dériver plusieurs répartitions sans requêtes
  séparées)

**Profil actif** (`profileStore.ts`) reste volontairement **en mémoire
seulement** (pas de persist middleware) — redemander "qui apprend ?" à
chaque ouverture est un choix produit assumé (cohérent avec
`ProfileSelector`), pas une limitation technique. Seuls la LISTE des
profils et leurs DONNÉES (maîtrise) sont persistées.

**`ProfileSelector.tsx`** — charge `listProfiles()` au montage (plus de
`mockProfiles` statique), "Nouveau profil" n'est plus désactivé
("Bientôt disponible") : clic → petit formulaire inline (prénom, pas de
modale séparée) qui remplace la carte sur place → `createProfile()` →
sélection + navigation automatique vers `/dashboard`.

**Écriture de la maîtrise** — `CardLoopShell.tsx` distinguait déjà "à
revoir"/"maîtrisé" visuellement mais **pas dans le code** : les deux
boutons appelaient le même `advance()` sans passer l'info. Signature
changée : `advance(decision: 'mastered' | 'review')`, propagée à
`onAdvance?: (item, decision) => void` (breaking change du prop, les 4
`*CardLoop` mis à jour). Chacun appelle `onItemSeen` (inchangé,
utilisé par "Tester mes connaissances") **et** `setMastered(profileId,
kind, item.id, decision)` — `RevisionCardLoop` utilise `item.kind`
directement (`RevisionItem` a déjà cette forme), les trois autres
passent leur `kind` en dur ('kanji'/'vocab'/'grammar').

**Lecture en direct** — `useLiveQuery` (dexie-react-hooks) partout où un
chiffre de progression est affiché : se réabonne automatiquement, donc
cocher "Maîtrisé" en séance met à jour Dashboard/Stats dès qu'on y
revient, sans rechargement ni state manuel à synchroniser :
- **Dashboard** — `mockGoal.current` (128 en dur) remplacé par
  `countMastered(profileId, 'kanji')` réel. `mockGoal.target` (500)
  reste inventé (objectif de programme complet, tout n'est pas encore
  authoré) — seul le numérateur est réel, pas le dénominateur
- **Stats** — plus aucun chiffre inventé pour "Répartition par module"
  et "Progression par niveau JLPT" (`mockModuleBreakdown`/
  `mockLevelProgress` supprimés de `mockStats.ts`) : totaux calculés
  depuis `mockKanjiList.length`/`mockVocabList.length`/
  `mockGrammarList.length` (et par niveau via `.filter(jlptLevel)`),
  maîtrisé depuis `getAllMasteredIds`. "Le plus difficile en ce moment"
  et "Temps passé à écrire" restent mock (pas de tracking de
  difficulté/temps demandé — voir plus haut, pas de FSRS)

**Vérifié en direct** (créer un profil → session → cocher Maîtrisé →
Dashboard passe à 1/500 → **rechargement complet de la page** → profil
toujours listé sur l'écran de sélection → re-sélectionné → 1/500 toujours
là → Stats affiche 1/241 kanjis, réparti correctement par module et par
niveau N5).

## Curation de séance par maîtrise (la mémoire sert enfin à quelque chose)

Demande explicite de l'utilisatrice, en testant : "si je mets que je les
maîtrise ça me les enlève de la catégorie nouveaux ?" — la persistance
existait (section ci-dessus) mais **rien ne la consultait** pour décider
quoi montrer en séance. Le "5 nouveaux kanjis" du Dashboard était un
chiffre en dur (`mockRecommendedSession`), les 4 boucles de carte
filtraient uniquement par niveau JLPT (jamais par maîtrise), et le bouton
Nouveaux/Mélange de la séance personnalisée existait visuellement sans
être branché à rien. Corrigé de bout en bout :

- **`KanjiCardLoop.tsx`/`VocabCardLoop.tsx`/`GrammarCardLoop.tsx`** — deux
  nouvelles props optionnelles : `contentMode?: 'new' | 'mix'` (défaut
  `'mix'` = comportement historique, tout le niveau) et `limit?: number`.
  En mode `'new'`, `useLiveQuery(getMasteredIds(profileId, kind))` filtre
  la liste pour exclure ce qui est déjà maîtrisé. `emptyDescription`
  distingue maintenant "rien dans ce niveau" de "tout est déjà maîtrisé,
  bravo" (deux messages différents).
- **`buildRevisionPool.ts`/`RevisionCardLoop.tsx`** — changement de sens :
  Révisions montrait avant *tout* le contenu du niveau mélangé (kanjis +
  vocab + grammaire), maîtrisé ou non, faute de mieux. Montre maintenant
  **seulement ce qui est déjà maîtrisé** (`getAllMasteredIds` + filtre) —
  cohérent avec l'idée de "réviser ce qu'on a appris", même sans vrai
  FSRS/dates d'échéance. `RevisionItem` gagne un champ `itemId` (id brut
  du contenu) distinct de `id` (préfixé `kanji-xxx`/`vocab-xxx`/
  `grammar-xxx`, gardé comme clé React/identité pour le test de
  connaissances) — **bug corrigé en passant** : `onAdvance` appelait
  `setMastered(..., item.id, ...)` avec l'id préfixé, donc cocher
  "Maîtrisé" depuis Révisions écrivait un enregistrement sous un id
  différent de celui utilisé par le module d'origine (`kanji-hito` au
  lieu de `hito`) — jamais remarqué avant puisque rien ne relisait encore
  ces données.
- **`SessionFlow.tsx`** — `location.state` gagne `contentModes` (par
  module : Kanjis/Vocabulaire/Grammaire) et `limits` (par module, y
  compris Révisions), transmis tels quels aux boucles.
- **`sessionOptions.ts`** — nouvel export `CONTENT_TO_MODE` (`'Nouveaux'
  → 'new'`, `'Mélange' → 'mix'`).
- **`CustomSessionBuilder.tsx`** — `onStart` prend maintenant un 3ᵉ
  argument `contentModes` construit depuis les boutons Nouveaux/Mélange
  déjà présents dans l'UI (`kanjiContent`/`vocabContent`/
  `grammarContent`, qui existaient mais n'étaient jamais lus avant) — pas
  de `limit` côté séance personnalisée, elle montre tout ce qui matche
  (comportement historique inchangé, seul le filtre maîtrise s'ajoute).
- **`Dashboard.tsx`** — `mockRecommendedSession` (chiffres en dur)
  supprimé de `mockDashboard.ts` (l'interface `RecommendedSession` reste,
  comme contrat de props). Remplacé par un calcul réel : `SESSION_SIZE =
  { kanji: 5, vocab: 12, grammar: 3, review: 38 }` sert de **taille cible**
  (pas un total), et chaque compte affiché = `Math.min(taille cible,
  disponible réellement)` via `getAllMasteredIds`. La séance recommandée
  envoie `contentModes: 'new'` partout + les `limits` de `SESSION_SIZE`,
  donc les chiffres affichés correspondent exactement à ce que la séance
  contient vraiment en la démarrant. `paceDays` a un dénominateur de
  secours (`SESSION_SIZE.kanji`) pour éviter une division par zéro si
  `newKanjiCount` tombe à 0 (tout maîtrisé).

**Vérifié en direct** : profil "test" tout frais → Dashboard affiche
0 carte à réviser (pas 38 en dur) → séance recommandée → 人 coché
"Maîtrisé" → retour Dashboard → 1/500, 499 restants, **1 carte à
réviser** (mis à jour en direct) → séance personnalisée N5/Kanjis/
Nouveaux → "1 / 100 kanjis N5" (101 − 1, 人 absent, premier kanji
affiché = 大) → séance personnalisée N5/Révisions → 人 apparaît bien
(seul item maîtrisé du profil). Base remise à zéro après vérification
(`db.mastery.clear()`) pour laisser "test" propre.

## Export/import manuel — construit, puis abandonné (compte réel + serveur prévus à la place)

Contexte : l'utilisatrice a remarqué qu'un profil créé sur l'iPad
n'apparaît pas sur le PC (IndexedDB est local à l'appareil/navigateur,
sans aucune synchro — comportement attendu, pas un bug). Une première
clarification avait fait choisir "export/import manuel" (vs compte+synchro
auto vs rien pour l'instant), et un écran `/settings` complet avait été
construit et vérifié en direct (`src/db/backup.ts` : `exportData()`/
`importData()` fusion-sans-écrasement, `Settings.tsx` avec boutons
exporter/importer).

**Revenue dessus dans la foulée** : "je pense que je préfère la version
d'avant pour l'instant et après je l'hébergerai bientôt sur un serveur.
là je veux pouvoir créer mon compte sur l'ipad et tout faire avec l'ipad
et que mes données soient enregistrées sur l'ipad." Autrement dit : pas
de bricolage export/import intermédiaire, elle prévoit d'héberger l'app
sur un vrai serveur bientôt (elle-même, pas demandé à faire maintenant)
— à ce moment-là un vrai compte + synchro serveur remplacera directement
le besoin, sans étape transitoire. D'ici là, elle continue simplement
avec un profil local par appareil (déjà fonctionnel — voir "Persistance
réelle" plus haut), ce qui correspond à "créer son compte [profil] sur
l'iPad et que les données soient enregistrées sur l'iPad" : c'est déjà
le comportement actuel, aucun changement de code nécessaire pour ça.

**Entièrement annulé** : `src/db/backup.ts` supprimé, `Settings.tsx`/
`Settings.css` supprimés, `SettingsPlaceholder.tsx`/`PlaceholderScreen.tsx`
restaurés à l'identique (ils avaient été supprimés comme code mort au
moment de construire `Settings.tsx` — recréés ici, contenu inchangé),
`App.tsx` repointé sur `SettingsPlaceholder`. `/settings` est donc revenu
exactement à l'état d'avant ce chantier.

**À garder en tête pour la suite** : quand l'hébergement serveur sera en
place, ce sera l'occasion d'ajouter un vrai système de compte (email/mot
de passe ou autre) et de migrer `src/db/` d'IndexedDB local vers une
API/base distante (ou un modèle hybride local+sync) — mais **pas avant
que l'utilisatrice ait effectivement l'hébergement en place et le
redemande explicitement**, cohérent avec la règle "ne pas construire
d'infrastructure non demandée" qui a gouverné tout le projet jusqu'ici.

## Système de design (à réutiliser tel quel sur les prochains écrans)

- Tokens dans `src/styles/tokens.css` : accent turquoise
  `--color-accent`, accent chaleureux `--color-warm` (réservé aux moments
  d'énergie/réussite), `--color-success` / `--color-danger` (+ variantes
  `-soft`, réservées au classement maîtrisé/à revoir en fin de carte) —
  ne pas ajouter d'autres couleurs sans raison forte
- Pas de kanji géant décoratif en arrière-plan (testé, rejeté). Le motif
  de signature de l'app, c'est `AmbientGlow` (tache de couleur floue) et
  `ProgressRing` (anneau de progression animé, esprit Apple Watch)
- `PageTransition` enveloppe chaque écran pour une apparition douce —
  à réutiliser sur tout nouvel écran
- Boutons : `.btn-primary` (pilule, action principale) / `.btn-link`
  (action secondaire discrète) — jamais deux boutons de même poids
  visuel sur un même écran
- Micro-interactions via `framer-motion` : apparition en cascade des
  cartes, pop au clic, progression animée
- Important : l'app ne doit jamais donner l'impression de ne concerner
  que les kanjis — toujours montrer la diversité (vocab, verbes,
  adjectifs, expressions) quand c'est pertinent à l'écran
- Les statuts "terminé" (kanji appris, étape de séance faite, etc.)
  ne sont JAMAIS cochés manuellement par l'utilisateur — ils reflètent
  une progression réelle. En phase mock, on simule un état déjà avancé
  (ex. `status: 'done'` sur une étape) plutôt que de rendre la checklist
  cliquable
- `SessionModeToggle` (interrupteur à deux options, indicateur animé via
  `layoutId`) et `ChoiceButtonGroup` (boutons de choix simple/multiple,
  esprit Anki, dans `components/ui`) sont les nouveaux motifs
  réutilisables pour toute future configuration à choix qualitatifs
  (jamais de quota chiffré visible dans l'UI, jamais de liste déroulante
  pour ce type de choix)
- `FuriganaText` (`components/ui/`) : rendu d'un texte japonais segmenté
  en runs `{ text, reading?, highlight? }`, en `<ruby>/<rt>` CSS
  (`ruby-position: under`). La lecture n'apparaît **que** sous les runs
  de kanji qui en ont une — jamais une ligne de lecture séparée pour
  tout un mot/toute une phrase en hiragana, pour forcer à essayer de
  lire le kanji d'abord. Motif à réutiliser partout où du texte japonais
  avec kanji est affiché avec sa lecture (mots, phrases d'exemple,
  futur module grammaire). Le contenu mock doit donc être saisi
  pré-segmenté (voir `mockKanji.ts` / `mockVocab.ts`), pas comme une
  phrase + une lecture globale
- Règle fill vs contour : un bouton de choix sélectionné (`.choice-btn.active`)
  est en CONTOUR seulement (pas de fond plein) — avec plusieurs boutons actifs
  simultanément sur un même écran, un fond plein partout devient vite trop
  chargé. Le bouton d'action principal (`.btn-primary`), lui, reste toujours
  en fond plein : il n'y en a qu'un seul visible à la fois, donc pas de
  surcharge, et ça garde une hiérarchie claire entre "choix" et "action"
- Le mode "personnalisé" du Dashboard bascule sur l'accent chaleureux
  (`--color-warm`, classe `.mode-custom`) pour se distinguer visuellement
  du mode "recommandé" (turquoise) — ce principe de "coloration par
  mode/contexte" pourra se réutiliser ailleurs si un besoin similaire
  apparaît

## Écran `/session` — orchestrateur multi-modules + cartes flashcard

Remplace l'idée initiale de deux écrans séparés ("Découverte d'un kanji"
en fiche longue à faire défiler + "Module Écriture" à part), repensée en
carte flashcard unique, puis reliée à une vraie orchestration
multi-modules, puis étendue au vocabulaire, puis à la grammaire —
plusieurs passes successives à la demande explicite de l'utilisateur.
Orchestrateur + module kanji dans `src/features/kanji/`, vocabulaire
dans `src/features/vocab/`, grammaire dans `src/features/grammar/`
(léger accroc d'organisation, toujours pas résolu : `ModuleEndCard` vit
dans `features/kanji/` mais est importé par `features/vocab/` et
`features/grammar/` — à déplacer vers un dossier neutre du type
`features/session/` si ça continue de grossir) :

- `SessionFlow.tsx` — point d'entrée de la route `/session`. Lit
  `location.state.modules` (tableau de noms de modules, ex. `['Kanjis',
  'Vocabulaire']`) et `location.state.level` (un seul `JlptLevel` ou
  absent), passés par le Dashboard via `navigate('/session', { state:
  { modules, level } })` ; par défaut modules = `['Kanjis']` et level =
  `null` si l'écran est atteint sans state (ex. navigation directe en
  dev). Affiche un badge niveau (`N3`, etc., si présent) et un badge
  "Module · X/Y" dans l'en-tête dès qu'il y a plus d'un module, et
  enchaîne les modules dans l'ordre canonique `['Kanjis', 'Vocabulaire',
  'Grammaire', 'Révisions']` (jamais l'ordre de clic dans le
  sélecteur). Le Dashboard calcule modules + level pour les deux modes :
  **Recommandée** = tous les modules dont le compteur mock est > 0
  (actuellement les 4), **aucun niveau** (`level` absent = tous niveaux
  confondus, comme le ferait un vrai algorithme de révision — cohérent
  avec le fait qu'il n'y a pas de sélecteur Niveau dans ce mode) ;
  **Personnalisée** = exactement ce que l'utilisateur a coché/choisi
  dans `CustomSessionBuilder` (modules + niveau, les deux obligatoires
  pour activer le bouton)
- `KanjiCardLoop.tsx` — la boucle flashcard kanji, filtrée par
  `level` si fourni (`mockKanjiList.filter(k => k.jlptLevel === level)`,
  sinon tous). Si le filtre donne une liste vide, affiche un
  `ModuleEndCard` "Rien à réviser à ce niveau" plutôt que de planter.
  Appelle `onDone()` une fois la liste (filtrée ou complète) passée en
  revue
- `VocabCardLoop.tsx` (`features/vocab/`) — même esprit carte flip que
  les kanjis, même filtrage par `level`, adapté : une seule colonne
  d'exemples (pas de distinction mots/phrases, ça n'a pas de sens pour
  un mot), badge de type (Nom/Verbe/Adjectif/Expression), tableau de
  conjugaison affiché uniquement si le mot en a (verbes/adjectifs). Le
  mot lui-même est affiché en clair sur la face avant (`word`, pas
  d'indice de lecture — la carte doit rester un vrai test) et avec
  furigana via `FuriganaText` sur la face arrière (`wordSegments`) ;
  pour les expressions 100% kana (おはようございます, すみません) ça ne
  produit simplement aucun `<ruby>`, pas de traitement spécial
  nécessaire
- `GrammarCardLoop.tsx` (`features/grammar/`) — même moule que les deux
  précédents, même filtrage par `level`. Face avant : le motif (ex.
  `〜てください`). Face arrière : **Règle** et **Utilisation** dans deux
  blocs bien distincts (`.grammar-rule__block`, fond `--color-bg`,
  jamais mélangés dans un seul paragraphe — la règle est la formation
  grammaticale, pas le sens ni le contexte d'emploi), puis les exemples
  comme les autres modules (`FuriganaText`, traduction révélée au clic)
- `ModulePlaceholder.tsx` — pour Révisions uniquement désormais, pas
  encore construit : juste un message "bientôt disponible" + le bouton
  de continuation
- `ModuleEndCard.tsx` — carte pleine-largeur partagée par les trois
  `*CardLoop` (une fois leur liste passée en revue), `ModulePlaceholder`,
  le cas "liste vide après filtrage par niveau", et par `TestKnowledge`
  (écran de résultat + cas "rien à tester") : un seul bouton, "Passer au
  module suivant" ou "Tester mes connaissances" (libellé choisi par
  `SessionFlow` selon qu'il reste ou non un module après celui-ci).
  "Tester mes connaissances" navigue vers `/session/test` avec
  `{ modules, level }` dans le `location.state` (même mécanisme que
  `/session` lui-même) — voir section dédiée ci-dessous
- `mockKanji.ts` — type `Kanji` + données mock (significations, on'yomi/
  kun'yomi, radical, nombre de traits, mots fréquents, exemples de
  phrases). Champ `strokePaths` : plus utilisé comme guide fantôme dans
  `WritingCanvas` (retiré, voir plus bas), mais **réutilisé sur la face
  arrière de `KanjiCardLoop`** — section "Ordre des traits" (demande
  explicite de l'utilisateur), une mini-vignette cumulative par trait
  (vignette n = traits 1 à n superposés, montre la construction du
  kanji pas à pas plutôt qu'un résultat figé).
  **Corrigé — remplacé par de vraies données.** Les tracés étaient
  initialement des approximations dessinées à la main (5 kanjis
  seulement, 人大山川木) ; l'utilisateur a signalé que 山/川 avaient l'air
  visuellement faux ("un trait discontinu", "les traits rentrent dans
  l'intérieur"). Remplacés — et étendus aux 13 kanjis — par les vraies
  données du projet **KanjiVG** (kanjivg.tagaini.net, CC BY-SA 3.0,
  récupérées via `raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/<codepoint>.svg`).
  Repère `0 0 109 109` (celui de KanjiVG, pas de remise à l'échelle
  manuelle) — `viewBox` du mini-SVG dans `KanjiCardLoop.tsx` mis à jour
  en conséquence (était `0 0 100 100`). Vérifié par inspection DOM
  (`getBBox()` sur chaque `<path>`, bounding box cohérente, pas de
  coordonnée aberrante) plutôt que par capture d'écran (outil de
  screenshot indisponible ce jour-là) — un contrôle visuel direct reste
  à faire à l'occasion. Les 8 kanjis qui n'avaient encore aucun tracé
  (会買全感済域憂蓄, jusqu'à 15 traits) ont maintenant aussi leurs vraies
  données KanjiVG — la réserve précédente ("pas assez confiant pour
  approximer à la main") ne s'applique plus, la source est fiable
- `WritingCanvas.tsx` — zone de dessin libre (Pointer Events,
  `touch-action: none`), **entièrement vierge, sans aucun guide** (un
  tracé fantôme pâle avait été essayé puis retiré — jugé trop "aide
  imposée"), se réinitialise automatiquement (dessin effacé + outil
  remis sur stylo) à chaque changement de carte. **Deux outils** : stylo
  (dessine) et gomme (`globalCompositeOperation: 'destination-out'` —
  efface uniquement là où on passe, pas tout le canvas), plus un bouton
  "Tout effacer" séparé, toujours disponible quel que soit l'outil actif.
  **Toujours affiché à droite de la carte, quel que soit le module**
  (Kanjis, Vocabulaire, Grammaire) — pas réservé aux kanjis, à la
  demande explicite de l'utilisateur ; chaque `*CardLoop` importe et
  rend son propre `<WritingCanvas>` (pas de composant partagé au niveau
  de `SessionFlow`, chaque boucle garde son `index`/`phase` en état
  local donc c'est plus simple que chaque module gère aussi sa colonne
  d'écriture). Double-tap Apple Pencil pour basculer stylo/gomme (comme
  dans Notes) **demandé et refusé** : Apple n'expose pas ce geste
  (`UIPencilInteraction`) au Web/Safari, seulement à UIKit natif — pas
  de solution en rester une app web pure, confirmé par recherche

Comportement commun aux trois cartes de contenu (kanji/vocab/grammaire ;
revu après une première version avec devinette de traduction, jugée
"trop test") :
- Face avant : uniquement le kanji/mot/motif + un indice discret. Toute
  la face est cliquable pour retourner la carte — pas de champ à
  remplir. Le kanji va jusqu'à **176px** (130px sous 860px de large) —
  volontairement énorme, agrandi une première fois puis encore une
  deuxième fois à la demande explicite ("vraiment beaucoup plus gros")
- Face arrière : `.flip-card__back-head` est une **colonne centrée** —
  kanji/mot/motif en haut au centre, **traduction centrée juste en
  dessous** (`.meaning-pill`, 24px/600, la réponse principale). C'était
  à gauche avant, corrigé à la demande explicite pour les trois modules
  (pas juste les kanjis). Puis prononciation (on'yomi/kun'yomi) séparée
  des exemples par un espacement très généreux (`--space-2xl` = 64px,
  plus la bordure existante) pour bien marquer que ce sont deux blocs
  différents, puis **deux colonnes séparées** : mots fréquents à gauche,
  phrases d'exemple à droite (kanjis uniquement). Traduction de chaque
  exemple grisée par défaut, révélée individuellement au clic. Tout
  texte japonais avec kanji (mots, phrases) passe par `FuriganaText` —
  jamais de ligne de lecture séparée en hiragana pour toute la phrase.
  Toutes les tailles de police des cartes ont été augmentées d'un cran
  ("augmente toutes les polices") — si un nouveau module de carte est
  ajouté, repartir de ces tailles-ci comme référence, pas des anciennes
- Panneau d'écriture (`WritingCanvas`) TOUJOURS visible à droite de la
  carte, quel que soit l'état recto/verso — universel aux trois modules
- Deux boutons de classement en bas une fois la carte retournée :
  "Maîtrisé" (vert pâle, `--color-success-soft`) / "À revoir" (rouge
  pâle, `--color-danger-soft`) — mock uniquement (pas de FSRS, pas de
  stockage), le clic avance à la carte suivante ou à l'écran de fin de
  module sur la dernière
- **Aucun compteur "kanji X/5" affiché.** Un module n'a pas de nombre de
  cartes défini à l'avance (cohérent avec la règle "jamais de quota
  chiffré" déjà en place pour le Dashboard) : un lien "Passer au module
  suivant" (ou "Tester mes connaissances" si c'est le dernier module) est
  **toujours visible dans l'en-tête de `SessionFlow`**, cliquable à
  n'importe quel moment de n'importe quelle carte — pas seulement une
  fois arrivé à la dernière. Le passage "naturel" par toutes les cartes
  du mock mène quand même à un écran de fin (`ModuleEndCard`, avec le
  même bouton) une fois qu'on les a réellement toutes vues, mais rien
  n'y oblige
- Toute la mise en page tient dans la hauteur de l'écran (`100dvh`),
  sans scroll de page — seule la face arrière de la carte scrolle en
  interne si son contenu déborde. Empilement vertical sous 860px de
  large, colonnes Mots/Phrases réempilées sous 640px

**Conjugaison des verbes — retravaillée, puis complétée.** (`mockVocab.ts`
/ `VocabCardLoop.tsx`) : plus de libellés bruts "辞書形/ます形/て形" à
côté de la valeur. `VerbConjugation` est une structure typée
(`verbClass: 'ichidan'|'godan'|'irregular'`, plus 8 champs de forme —
voir plus bas — et `teForm`) rendue en vrai `<table>` HTML
(`.conjugation-grid`) — colonnes Positif/Négatif, **4 lignes** : Neutre
(présent), Neutre (passé), Poli (présent), Poli (passé) — présent ET
passé demandés en deux temps par l'utilisateur (présent d'abord, passé
ajouté ensuite pour compléter), plus le て形 affiché à part en dessous
(pas de négatif dans ce contexte). Séparateur visuel un peu plus marqué
(`.conjugation-grid__group-start`, bordure plus épaisse) entre le groupe
Neutre et le groupe Poli. Un vrai tableau plutôt que des lignes flex
avec `justify-content: space-between` élimine le grand vide visuel qu'il
y avait au milieu. La classe (ichidan/godan/irrégulier) s'affiche dans
le badge de type juste au-dessus du mot ("Verbe · Ichidan"). Les 5
verbes du mock ont été reclassés et conjugués à la main aux 8 formes
(présent/passé × positif/négatif × neutre/poli) : 食べる/続ける =
ichidan, 行く/始まる = godan (行く a un て/た irrégulier : 行って/行った,
pas 行いて/行いた), 蓄積する = irrégulier (verbe en する). Les adjectifs
gardent leur structure existante (`AdjectiveConjugation[]`,
現在形/否定形/過去形) mais passent par le même `<table>` pour la même
raison d'espacement.

**Tracés de kanji — 山 et 川, puis tout le reste, corrigés avec de
vraies données KanjiVG.** Historique complet (diagnostic initial,
premier correctif à la main, puis remplacement définitif par les
vraies données KanjiVG pour les 13 kanjis) documenté dans la
description de `mockKanji.ts` plus haut — pas dupliqué ici. **Règle
retenue de l'étape intermédiaire, toujours valable** : si les captures
d'écran deviennent indisponibles, ne pas deviner des coordonnées SVG à
l'aveugle pour du contenu où l'exactitude compte (ordre des traits) —
le dire clairement plutôt que de fabriquer une correction non vérifiée.

## Module Révisions

Dans `src/features/revision/`. Construit sur demande explicite de
l'utilisateur, qui a aussi validé l'approche mock pour contourner le
blocage identifié précédemment (pas de vraie notion de progression sans
persistance — voir section Nouveaux/Mélange plus bas).

- `buildRevisionPool.ts` — simule la file de révision en mélangeant
  **tout** le contenu déjà construit (kanjis + vocabulaire + grammaire,
  filtré par niveau comme les autres modules), plutôt que de suivre un
  vrai statut maîtrisé/à revoir (qui n'existe pas encore, cf. phase
  mock). Mélangé (`shuffle`) plutôt que groupé par type, pour ressembler
  à une vraie file de révision plutôt qu'à trois mini-sessions mises
  bout à bout. Un seul mélange par visite du module
  (`useMemo(..., [level])` dans `RevisionCardLoop` — sans ça, l'ordre
  changerait sous les pieds de l'utilisateur à chaque flip/décision)
- `RevisionCardLoop.tsx` — boucle de cartes qui branche sur `item.kind`
  ('kanji'/'vocab'/'grammar') pour réutiliser exactement le même rendu
  de face avant/arrière que les modules dédiés (stroke order pour les
  kanjis, tableau de conjugaison pour le vocabulaire, blocs Règle/
  Utilisation pour la grammaire) — rien de nouveau visuellement, juste
  mélangé
- **Refactor à l'occasion** : les quatre boucles de cartes
  (Kanjis/Vocabulaire/Grammaire/Révisions) géraient chacune leur propre
  state (index, face, révélés, fin de module) de façon quasi identique
  — dupliquer une quatrième fois pour Révisions n'avait pas de sens.
  Extrait dans `src/features/kanji/CardLoopShell.tsx` (générique sur le
  type d'item, `renderFront`/`renderBack` fournis par l'appelant) ; les
  trois boucles existantes ont été réécrites pour l'utiliser, sans
  changement de comportement (vérifié : chacune retestée après coup,
  identique à avant)
- Accroché à `SessionFlow` comme les trois autres modules ; branché
  aussi dans la séance Recommandée du Dashboard (`recommendedModules`
  inclut déjà 'Révisions' quand `mockRecommendedSession.reviewCount >
  0`, sans filtre de niveau — cohérent avec le principe "tous niveaux
  confondus" de ce mode)

## Compteur de progression sur le niveau (module Kanjis)

Demande explicite de l'utilisateur une fois les listes N5/N4 devenues
volumineuses : savoir où on en est sur TOUT ce qu'il y a à connaître à
un niveau, pas juste dans la séance en cours. Affiché en haut de la
colonne carte (`CardLoopShell`, nouvelle prop `renderCounter?: (index,
total) => ReactNode`, rendu seulement si fournie) : "12 / 101 kanjis
N5" par exemple. Branché uniquement dans `KanjiCardLoop` pour l'instant
(demande scoped au "module kanji") ; `kanjiList` étant déjà filtré et
dans l'ordre canonique du niveau, `index+1`/`kanjiList.length` est
exactement la position dans le programme complet — pas de calcul
séparé nécessaire. Absent quand `level` est `null` (séance Recommandée,
tous niveaux mélangés — le concept "programme d'un niveau" ne
s'applique pas), même condition que le badge de niveau déjà existant.
**Ne pas confondre avec le principe "jamais de quota chiffré"** : celui-ci
concerne le nombre de cartes arbitraire d'UNE séance (mock petit, pas de
vraie fin) — ici c'est une vraie mesure par rapport à un programme
officiel maintenant complet, donc plus dans la même catégorie.

## Navigation toujours visible (barre fine en haut sur grands écrans)

Sur écrans ≥780px (iPad paysage, desktop), `.tab-bar` (`MainLayout.css`)
est passée d'une colonne latérale "étirée à 100vh" (comportement qui
s'appuyait sur le calcul de hauteur du flex parent) à une **barre fine
fixe en haut** (`position: fixed; top:0; height:56px`). Deux itérations
avant d'arriver là :
1. Défilement complet avec la page (essai suite à une mauvaise première
   lecture d'une demande utilisateur) — rejeté aussitôt vérifié : sur un
   écran long, la nav sortait du cadre en bas de page
2. Colonne latérale stretch (`align-items: stretch` sur le flex parent) —
   pas assez fiable en pratique sur iPad Safari, retour direct de
   l'utilisateur : "la barre n'est pas toujours visible"
3. **Fixed top bar (actuel)** — suggestion directe de l'utilisateur,
   garantit la visibilité indépendamment de tout calcul de hauteur du
   parent. `.main-layout__content` récupère un `margin-top: 56px` pour
   ne pas passer sous la barre. Mobile (<780px, barre du bas) non
   concerné, pas dans la demande.

## Ordre des traits déplacé à côté du panneau d'écriture

Demande utilisateur : rapprocher le repère "ordre des traits" (traits du
kanji affichés en mini-vignettes cumulatives) de la zone où on
s'entraîne réellement à tracer, plutôt que de le laisser enterré dans le
contenu de la carte à gauche — et élargir la colonne d'écriture.

- Nouvelle prop `renderWritingExtra?: (item: T) => ReactNode` sur
  `CardLoopShell` (comme `renderCounter`, optionnelle) — rendue en haut
  de `.session__writing-col`, au-dessus de `<WritingCanvas>`
- Branchée dans `KanjiCardLoop` **et** `RevisionCardLoop` (les deux
  endroits qui affichaient l'ordre des traits dans la carte) ; retirée
  du `renderBack` des deux à cet endroit. `KanjiPracticeBox.tsx`
  (Explorer) non touché — contexte différent (pas de `CardLoopShell`),
  garde son propre affichage déjà pensé à côté du canevas
- Nouvelle classe `.stroke-order-panel` (encart séparé, même habillage
  que `WritingCanvas` — surface/bordure/ombre) à ne pas confondre avec
  `.stroke-order` (bloc simple dans le flux d'une carte, toujours utilisé
  ailleurs — pas touché)
- Colonne d'écriture élargie : `.session__writing-col` passe de `flex:1,
  max-width:360px` à `flex:1.6, max-width:520px` (et `flex-direction:
  column` pour empiler panneau + canevas), `.session__card-col` réduit
  en contrepartie de `1.4` à `1.1` pour garder un équilibre visuel

## Test limité à ce qui vient d'être vu dans la séance

Bug de fond signalé une fois les niveaux devenus volumineux : "Tester
mes connaissances" testait tout le contenu du niveau filtré par module
(`buildTestPool`), ce qui avait du sens avec 2-3 items par niveau mais
devient absurde avec 101 kanjis N5 — un test qui n'a plus de rapport
avec ce qui vient d'être étudié dans la séance.

- `SessionFlow.tsx` — `seenItemsRef` (un `useRef`, pas de re-render
  nécessaire) accumule un `SeenItem` (`{ kind, id, data }`, type exporté
  depuis `buildTest.ts`, structurellement identique à `RevisionItem`)
  à chaque fois qu'une décision Maîtrisé/À revoir est prise, sur tous
  les modules de la séance dans l'ordre. Passé à `/session/test` via
  `location.state.seenItems` au lieu de — en plus de — `modules`/`level`
- `CardLoopShell.tsx` — nouvelle prop `onAdvance?: (item: T) => void`,
  appelée dans `advance()` avec l'item qu'on vient de quitter, juste
  avant de passer au suivant ou de déclencher la fin de module. Les
  quatre boucles (`KanjiCardLoop`/`VocabCardLoop`/`GrammarCardLoop`/
  `RevisionCardLoop`) reçoivent chacune un `onItemSeen?: (item:
  SeenItem) => void` et l'y branchent (`RevisionCardLoop` transmet tel
  quel, ses items ont déjà la forme `{kind,id,data}` ; les trois autres
  enveloppent leur item typé dans un `SeenItem`)
- `buildTest.ts` — mappers `kanjiToTestItem`/`vocabToTestItem`/
  `grammarToTestItem` extraits de `buildTestPool` (qui les réutilise
  telle quelle) ; nouvelle `buildTestPoolFromSeen(seenItems)`, qui les
  réutilise aussi, dédoublonnée par id. **`buildTestPool(modules,
  level)` n'est plus le chemin normal** — gardée seulement en repli si
  `/session/test` est atteint sans `seenItems` dans l'état de route
  (navigation directe, cas limite)
- `TestKnowledge.tsx` — utilise `buildTestPoolFromSeen(seenItems)` si
  `seenItems` est présent et non vide, sinon retombe sur
  `buildTestPool(modules, level)`
- Vérifié : séance N5 Kanjis, 3 kanjis vus (人大山) puis "Tester mes
  connaissances" cliqué sans finir le reste du paquet de 101 → test à
  3 questions exactement, QCM avec options tirées uniquement de ces
  3 kanjis (pas de fuite du reste du niveau)

## Écran `/session/test` — Tester mes connaissances

Dans `src/features/test/`. Contrairement aux `*CardLoop` d'apprentissage
(où deviner a été explicitement retiré, jugé "trop test"), c'est ici,
volontairement, un vrai test avec devinette — l'objectif change : pas
apprendre en douceur, mais vérifier ce qui est retenu.

- `buildTest.ts` — construit le pool testable à partir de
  `location.state.modules` + `level` (même filtrage que les
  `*CardLoop`) : kanjis, vocabulaire **et grammaire**. Pour la
  grammaire, le binôme prompt/traduction devient motif ↔ sens (ex.
  "〜てください" ↔ "Veuillez faire ~ / faites ~, s'il vous plaît") — même
  structure `TestItem` que kanji/vocab (`readings: []`, `meanings: [g.meaning]`),
  donc aucune branche spéciale nécessaire dans `TestKnowledge.tsx`, qui
  reste entièrement générique sur `prompt`/`meanings`/`readings`. Testé
  bout en bout (séance N5 Grammaire seule → 5 questions, écrire et QCM,
  jp→fr et fr→jp, toutes correctement évaluées).
  Génère une question par item du pool (mélangé), avec pour chacune :
  - un **sens** tiré au sort : JP→FR (le kanji/mot est affiché, il faut
    trouver la traduction) ou FR→JP (la traduction est affichée, il
    faut trouver le kanji/mot)
  - un **format** tiré au sort : écrire (texte libre) ou QCM (4 options
    si le pool le permet, distracteurs pris au hasard dans le reste du
    pool)
  - **Bug utilisateur corrigé — correspondance des réponses trop
    stricte.** Signalé concrètement : répondre "会う" (le vrai mot,
    orthographe + okurigana) pour le kanji 会 refusé, seule la lecture
    nue "あ" était acceptée ; répondre "大きい" pour la traduction
    "grand" refusé, seul "大" comptait. `isAnswerAccepted()`
    (`buildTest.ts`) remplace l'égalité stricte par une comparaison
    généreuse : correspondance exacte, OU l'un contient l'autre, sur
    des candidats élargis — pour FR→JP en mode écrire, le kanji/mot lui-
    même (`item.prompt`) est maintenant accepté en plus de ses lectures ;
    pour JP→FR, les traductions à sens multiples ("terminer, régler
    (une affaire)") sont éclatées en fragments comparés individuellement
    plutôt qu'exigées mot pour mot. Les lectures elles-mêmes sont aussi
    mieux extraites (`parseReadingEntry`) : "あ(う) (au)" produit
    maintenant DEUX lectures acceptées, "あ" et "あう" (avec okurigana),
    au lieu de perdre la variante avec okurigana
  - **Piège corrigé** : deux items différents peuvent partager le même
    sens affiché (ex. le kanji 大 et le mot 大きい ont tous les deux
    "grand" comme traduction) — les distracteurs de QCM sont
    dédupliqués par **valeur affichée**, pas seulement par id, sinon
    deux options strictement identiques et indiscernables apparaissent
    (repéré via un avertissement React "clés dupliquées", pas juste à
    l'œil)
  - Distracteurs de QCM **groupés par type** (kanji/vocab/grammaire)
    quand c'est possible, complétés par le reste du pool seulement si le
    module n'a pas assez d'items — évite de comparer un motif de
    grammaire à un sens de kanji sans rapport dans les mêmes options,
    surtout utile maintenant que la grammaire est mélangée avec kanjis/
    vocabulaire dans un même test multi-modules
  - **Deuxième round de correction, encore plus généreux** (mode écrire
    uniquement) : (1) katakana et hiragana sont maintenant équivalents
    dans la comparaison (`toHiragana()` dans `normalize()`) — écrire
    "もく" doit valider une lecture on'yomi stockée "モク" en katakana,
    la convention katakana/hiragana ne devrait pas être ce qu'on teste ;
    (2) **peu importe le sens de la question**, la réponse est
    acceptée si elle correspond à la traduction OU la lecture OU le
    mot/kanji lui-même (`writeCandidates` regroupe tout, plus de
    distinction par `direction`) — écrire ce qu'on sait, sous n'importe
    quelle forme, doit suffire plutôt que de deviner quelle forme
    précise est attendue
- `TestKnowledge.tsx` — un écran plein-largeur (comme les `*CardLoop`
  sans écriture), une question à la fois, `ProgressRing` "X/N" dans
  l'en-tête (ici un compteur EST affiché, contrairement aux cartes
  d'apprentissage — un test a une fin naturelle et bornée, ce n'est pas
  la même philosophie que "jamais de quota chiffré" qui concerne
  l'apprentissage libre). Bouton **"Je ne sais pas"** (`.btn-link`, sous
  le champ ou le QCM, disponible tant qu'on n'a pas répondu) — passe la
  question sans obliger à deviner, compte comme non maîtrisée (pas de
  malus particulier, juste pas de point) et révèle la réponse comme un
  mauvais tour, avec un message différent ("Pas grave, on continue.")
  pour ne pas culpabiliser. Après chaque réponse : statut correct/
  incorrect, la ou les réponses acceptées affichées en entier (pas
  seulement la première — accepter "かわ" comme lecture correcte de 川
  puis afficher "せん" comme "la" réponse serait trompeur), bouton
  "Question suivante". **Entrée fait aussi avancer** une fois la réponse
  révélée (`window.addEventListener('keydown', ...)` sur `phase ===
  'answered'`, cf. piège de test ci-dessous) — évite d'avoir à viser le
  bouton à chaque question. À la fin : écran de résultat
  (`ModuleEndCard`, score + message qui varie selon le pourcentage) puis
  retour au dashboard — pas de bouton pour recommencer le test à
  l'identique pour l'instant
- Cas "rien à tester" géré (ex. séance faite uniquement de Grammaire/
  Révisions) : message clair plutôt qu'un écran vide ou un plantage
- Accroché à `SessionFlow` : `handleModuleDone()` navigue vers
  `/session/test` (au lieu de `/training` comme avant) quand c'est le
  dernier module de la séance, en conservant `modules` + `level` dans le
  `location.state`

**Piège récurrent découvert et corrigé à trois endroits** :
`AnimatePresence` avec `exit` reste bloqué à mi-transition dans cet
environnement de dev (l'ancien enfant reste dans le DOM à `opacity: 0`,
invisible mais toujours cliquable, et le nouvel enfant n'apparaît
jamais tant que `mode="wait"` attend une sortie qui ne se termine
jamais). Touché : les boutons de classement de la carte kanji, le
switch de mode Recommandée/Personnalisée du Dashboard (bug déjà présent
avant cette session, découvert en testant ce nouvel écran), et les
panneaux de config par module dans `CustomSessionBuilder`. **Règle
retenue : ne plus utiliser `AnimatePresence`/`exit` pour ce genre de
bascule conditionnelle — animer seulement l'apparition
(`initial`/`animate` sur un `motion.div` avec `key` qui change), la
disparition est instantanée et ne pose pas de problème visuel puisque
le nouveau contenu apparaît en même temps.** À vérifier si un nouvel
usage d'`AnimatePresence` avec `exit` est envisagé ailleurs.

**Piège de test (pas un bug applicatif) : les touches simulées par
l'outil de navigateur ne déclenchent pas toujours l'action native du
navigateur.** Un `KeyboardEvent('keydown', ...)` envoyé par script (ou
par l'outil `computer{action:"key"}`) déclenche bien les écouteurs JS
qui bougent la souris (confirmé : mon écouteur `window` pour "Entrée
après réponse" a réagi correctement), mais PAS le comportement natif du
navigateur lié à un événement de confiance ("trusted"), comme la
validation d'un `<form>` en appuyant sur Entrée dans un champ texte —
les navigateurs ignorent volontairement l'action par défaut pour les
événements synthétiques (limitation de sécurité standard, pas un bug de
cet environnement). **En pratique : ne pas conclure qu'une fonctionnalité
liée à Entrée/soumission de formulaire est cassée juste parce qu'un test
automatisé par script ne la déclenche pas — vérifier séparément la
logique (via un `dispatchEvent` ciblé sur l'écouteur JS concerné) et
faire confiance au comportement HTML natif standard pour le reste.**

## Écran `/explorer` — dictionnaire libre

Dans `src/features/explorer/`. Choisi comme prochaine étape par
l'utilisateur parmi plusieurs options proposées (module Grammaire dans
le test, module Révisions, autre écran périphérique). Contrairement aux
`*CardLoop`, ce n'est ni une carte à retourner ni un test — tout est
affiché directement (traductions non masquées) puisque c'est un outil
de consultation, pas d'apprentissage ni de vérification.

- `buildExplorerItems.ts` — unifie `mockKanjiList` + `mockVocabList` +
  `mockGrammarList` (les trois, contrairement au test qui exclut la
  grammaire) en une liste `ExplorerItem[]` commune
  (`{ id, kind, jlptLevel, headline, subLabel, meanings, searchText,
  data }`, `data` gardant la référence typée d'origine pour le rendu du
  détail). `searchText` précalculé (mot/kanji/motif + lectures +
  traductions concaténés) pour une recherche simple par sous-chaîne
  normalisée (`normalizeSearch`, insensible à la casse/accents)
- `Explorer.tsx` — barre de recherche (live, pas de bouton), deux
  `ChoiceButtonGroup` à sélection unique (Niveau : Tous/N5-N1 ; Type :
  Tous/Kanjis/Vocabulaire/Grammaire), compteur de résultats, liste de
  lignes cliquables (`explorer-row` : badge de type, mot/kanji/motif,
  lecture, traduction, étoile favori, chevron). Une ligne cliquée
  s'étend en accordéon pour montrer le détail complet — un seul élément
  ouvert à la fois n'est PAS imposé (chaque ligne gère son propre état
  d'expansion indépendamment, pas de state global d'exclusivité, plus
  simple et pas gênant pour un outil de consultation)
- **Favoris** : étoile par ligne, `Set<string>` en state local,
  volontairement **non persisté** (même statut que le favori du mot du
  jour sur le Dashboard) — juste pour la session en cours
- Détail par type (réutilise les classes déjà définies pour les cartes
  de session — `meaning-pill`, `conjugation-grid`, `grammar-rule`,
  `flip-card__label`, `FuriganaText` — en important
  `'../kanji/SessionCard.css'` directement dans `Explorer.tsx`, encore
  un exemple du même accroc d'organisation déjà noté pour
  `ModuleEndCard`/`WritingCanvas`) :
  - Kanji : on'yomi/kun'yomi, radical, nombre de traits, mots fréquents,
    exemples — tout affiché, rien à révéler
  - Vocabulaire : badge de type, tableau de conjugaison complet si verbe
    ou adjectif, exemples
  - Grammaire : blocs Règle/Utilisation, exemples
- **Piège évité dès la conception** (grâce aux leçons des sessions
  précédentes) : pas de ligne de sous-titre dupliquant la traduction
  pour la grammaire (`subLabel` vide plutôt que de répéter `meaning`
  dans deux colonnes du même tableau)
- **Entraînement à l'écriture avec vraie correction** (demande explicite
  de l'utilisateur : pouvoir soit déplier la fiche, soit s'entraîner à
  écrire avec un retour correct/pas correct). Sur chaque ligne kanji
  (uniquement si `strokePaths.length > 0`, donc les 13 pour l'instant) :
  un bouton crayon indépendant du chevron de dépliage, ouvre/ferme
  `KanjiPracticeBox` sans interagir avec l'accordéon de détail (les deux
  peuvent être ouverts en même temps, states séparés `practiceId` vs
  `expandedId`)
  - `src/features/kanji/strokeMatch.ts` — comparaison entre les traits
    dessinés et les vrais tracés KanjiVG (`kanji.strokePaths`, voir plus
    haut) : chaque trait dessiné est capturé comme une liste de points
    (pas juste peint sur un bitmap), rééchantillonné à N points
    équidistants par longueur d'arc (`resamplePoints`), comparé au
    tracé de référence échantillonné pareil via
    `SVGPathElement.getPointAtLength` (`samplePath`). **Normalisation
    globale, pas trait par trait** (`normalizeGroup`, voir bug ci-dessous)
    — tous les traits d'un même tracé (dessiné ou référence) sont
    recentrés/mis à l'échelle ENSEMBLE, une seule transformation pour
    tout le caractère, pour comparer forme ET position relative de
    chaque trait dans l'ensemble, pas juste sa silhouette isolée.
    Verdict basé sur le **pire trait** (`maxStrokeScore`), pas la
    moyenne (voir bug ci-dessous) : nombre de traits correct **et**
    aucun trait au-dessus de `MAX_STROKE_THRESHOLD`.
    **C'est une heuristique honnête (vraie mesure de similarité), pas de
    l'OCR ni un résultat bidon.**
  - `src/features/explorer/KanjiPracticeBox.tsx` — capture les traits
    (Pointer Events, même famille que `WritingCanvas` mais avec un
    tableau de points par trait en plus du dessin bitmap), boutons
    Effacer/Vérifier, message de résultat coloré (`--color-success`/
    `--color-danger`, réutilise les tokens ajoutés pour Maîtrisé/À
    revoir)
  - **Bug utilisateur corrigé — seuil bien trop permissif.** Signalé
    concrètement : un tracé n'ayant rien à voir avec le kanji, mais avec
    le bon nombre de traits, était accepté ("Bien écrit !"). Diagnostic
    en ajoutant un log temporaire du score réel plutôt qu'en devinant :
    `SHAPE_THRESHOLD` était à `0.35`, choisi sans mesure. En dessinant
    de vrais traits dans le navigateur et en lisant le score obtenu sur
    山 (3 traits) : tracé fidèle → **0.076**, tracé fidèle mais imprécis
    (angles/position décalés à la main) → **0.112**, tracé délibérément
    faux (mauvaises directions, ex. deux lignes horizontales à la place
    des deux traits diagonaux de 人) → **0.335** — bien en dessous de
    0.35, donc accepté à tort. Seuil resserré à **0.2** (marge des deux
    côtés de cet écart) et reconfirmé sur les trois cas après coup : bon
    tracé → correct, tracé imprécis mais fidèle → toujours correct,
    tracé délibérément faux → rejeté. **Piège méthodo à retenir : pour
    calibrer un seuil numérique, mesurer le score réel sur des cas
    connus plutôt que choisir une valeur "qui semble raisonnable" —
    c'est exactement ce qui avait produit le bug.**
  - **Bug utilisateur corrigé (round 2) — même symptôme, mais persistant
    sur les kanjis à plus de traits (会, 買...).** Signalé après le
    correctif ci-dessus : bon nombre de traits + traits au hasard =
    accepté quand même, mais seulement sur des kanjis avec plus de
    traits que 山 (celui utilisé pour calibrer round 1). Deux défauts de
    conception distincts trouvés en remesurant :
    1. **La moyenne dilue les mauvais traits.** Avec 6 ou 12 traits, un
       ou deux traits n'importe où étaient noyés dans la moyenne par
       plusieurs traits courts qui matchent trivialement — le score
       moyen restait sous le seuil même avec un tracé faux, alors que ça
       n'arrivait pas avec seulement 3 traits (moins de place pour
       diluer). Corrigé en jugeant sur le **pire trait**
       (`maxStrokeScore`) plutôt que la moyenne — un seul trait
       vraiment faux suffit à rejeter, quel que soit le nombre de
       traits du kanji.
    2. **Normaliser chaque trait isolément fait perdre sa position et sa
       taille relative au reste du caractère.** Un tout petit trait
       dessiné n'importe où se remet à l'échelle tout seul pour remplir
       la même boîte `[-0.5,0.5]` qu'un grand trait — les deux peuvent
       sembler "bien formés" une fois isolés, même si l'un est minuscule
       et mal placé par rapport au reste. Corrigé en normalisant TOUS
       les traits d'un même tracé ensemble (`normalizeGroup`, une seule
       transformation pour le caractère entier) : un trait doit
       maintenant être à la bonne place ET à la bonne taille, pas
       seulement avoir la bonne forme isolée.
    Reconfirmé après coup sur les trois complexités de kanji
    disponibles, tracé aléatoire puis tracé fidèle à chaque fois (traits
    aléatoires rejetés partout, tracés fidèles acceptés partout, marge
    confortable dans les deux cas) :
    - 山 (3 traits) : aléatoire → 0.560, fidèle → 0.174
    - 会 (6 traits) : aléatoire → 0.338, fidèle → 0.274
    - 買 (12 traits, le plus complexe du mock) : aléatoire → 0.692,
      fidèle → 0.135
    `MAX_STROKE_THRESHOLD` fixé à **0.3** sur cette base. **Effet de
    bord positif** : le tracé "3 traits verticaux tout simples" pour 山
    (ce qu'un utilisateur qui ne connaît pas l'ordre exact des traits
    dessine naturellement) est maintenant correctement rejeté — le
    deuxième trait réel de 山 n'est pas une simple verticale mais un
    crochet qui part à gauche et balaie vers la droite en bas, et
    l'ancienne normalisation par trait laissait passer cette
    approximation. C'est **pour ça que l'indice après deux essais ratés
    (section dédiée plus bas) a de la valeur** : l'algorithme est
    maintenant strictement correct, donc un utilisateur qui ne connaît
    pas le vrai tracé a besoin qu'on le lui montre plutôt que
    l'algorithme accepte une approximation.
  - **Bug utilisateur corrigé — après un échec, redessiner un nouvel
    essai sans cliquer "Effacer" gardait les traits de l'essai précédent
    en mémoire, donc "Vérifier" comparait un mélange des deux tentatives
    (forcément faux, même nombre de traits impossible à obtenir).**
    `strokesRef` n'était vidé que par le bouton "Effacer" explicite, pas
    par le fait de recommencer à dessiner après un résultat déjà
    affiché. Corrigé dans `handlePointerDown` : si un `result` est déjà
    affiché (donc ce nouveau trait est un nouvel essai, pas la suite du
    précédent), les traits et le bitmap sont réinitialisés avant de
    démarrer le nouveau trait — plus besoin de cliquer "Effacer" entre
    deux essais. `hintUnlocked`/`failCount` ne sont pas concernés (pas de
    raison de recacher l'indice ou de perdre le compte d'échecs juste
    parce qu'on redessine). Vérifié : premier essai faux → sans cliquer
    Effacer, redessiner directement le vrai tracé → "3 traits tracés"
    (pas 6) → "Bien écrit !"
  - **Bug utilisateur corrigé — le stylo se bloquait après le premier
    point en recommençant un tracé après avoir effacé, curseur "interdit"
    au lieu du curseur normal.** Cause : `onPointerLeave` était branché
    sur la même fonction que `onPointerUp` pour terminer un trait —
    convention reprise de `WritingCanvas`. Mais `setPointerCapture`
    (posé au `pointerdown`) garantit que `pointermove`/`pointerup`
    continuent d'être livrés au canvas même quand le curseur sort
    visuellement de sa zone — **`pointerleave` se déclenche quand même**
    sur l'élément capturant dès que le curseur sort géométriquement,
    capture ou non. Sur l'encadré de `WritingCanvas` (grand), la main
    sort rarement de la zone en plein trait, donc le bug ne s'était
    jamais manifesté ; sur le petit encadré d'entraînement (~160px de
    haut, demandé explicitement petit), c'est courant dès qu'on dessine
    un trait de la taille d'un vrai kanji — `pointerleave` coupait le
    trait (`isDrawing.current = false`), et les `pointermove` suivants
    (livrés au canvas par la capture, mais ignorés côté state) ne
    dessinaient plus rien, d'où l'impression de blocage après un seul
    point. Corrigé en retirant `onPointerLeave` du canvas
    d'entraînement (seuls `onPointerUp`/`onPointerCancel` terminent un
    trait désormais) — vérifié avec un tracé qui sort délibérément de la
    zone (jusqu'à ~150px en dehors) puis y revient : le trait reste
    continu, et les traits suivants après un effacement se dessinent
    normalement. **`WritingCanvas` n'a pas été touché** (pas de bug
    signalé dessus, zone assez grande pour que ce ne soit pas un
    problème en pratique) — même correctif à appliquer là-bas si un jour
    ça devient nécessaire.
  - Durcissement au passage : `resize()` (ResizeObserver) ne réinitialise
    plus le bitmap du canvas si les dimensions n'ont pas réellement
    changé — un redéclenchement du ResizeObserver sans changement de
    taille (reflow ailleurs sur la page) pouvait sinon effacer un trait
    en cours de dessin (`canvas.width = ...` réinitialise tout le
    bitmap, même à valeur identique)
  - `.explorer-row` : le bouton crayon est un **slot de grille toujours
    présent** même vide (`.explorer-row__practice-slot`) sur les lignes
    vocabulaire/grammaire — sinon l'étoile et le chevron se décalent
    d'une colonne selon que le bouton est présent ou non
- **Indice après deux essais ratés** (proposition de l'utilisateur, suite
  à un premier signalement "je trace correctement 山 mais ça ne
  l'accepte pas"). À ce moment-là, rejouer des tracés plausibles de 山
  n'avait rien montré d'anormal (l'algorithme jugeait juste sur ce
  kanji à 3 traits) — la vraie cause (dilution par la moyenne +
  normalisation par trait, voir bug round 2 ci-dessus) ne se voyait
  qu'avec plus de traits, révélée par un signalement de suivi sur 会/買.
  La fonctionnalité proposée par l'utilisateur reste utile
  indépendamment de ce bug — une fois l'algorithme corrigé et
  redevenu strict à raison, un utilisateur qui ne connaît pas le tracé
  exact d'un kanji complexe a quand même besoin qu'on le lui montre.
  Après 2 essais ratés sur le même kanji (`failCount`, incrémenté à
  chaque échec, remis à 0 sur réussite), `hintUnlocked` passe à `true`
  et reste vrai pour le reste de la session d'entraînement (pas recaché
  sur un effacement ou une réussite suivante). Affiche alors, **à côté
  de la zone de dessin** (`.kanji-practice__body`, flex row qui empile
  en colonne sur petit écran), le même diagramme cumulatif "Ordre des
  traits" que la carte d'apprentissage (réutilisé tel quel, classes
  `.stroke-order`/`.stroke-order__step` de `SessionCard.css`, pas
  d'explication dupliquée)

## Champs lexicaux sur les kanjis (filtre "par thème" dans Explorer)

Demande explicite de l'utilisateur : pouvoir chercher un champ lexical
(son exemple : "grossesse") et voir tous les kanjis associés, en plus du
classement par niveau JLPT déjà existant.

- `Kanji.themes: string[]` (`mockKanji.ts`) — champ **obligatoire**, un
  kanji peut appartenir à plusieurs thèmes. Les 241 kanjis existants ont
  tous été tagués (0 kanji sans thème), via un script one-off
  (`patch_kanji_themes.mjs` + `kanji_themes.mjs`, scratchpad de session)
  qui insère `themes: [...]` juste après `meanings: [...]` dans chaque
  entrée — mêmes précautions que pour le vocabulaire/la grammaire
  (matching `id:`/`meanings:` insensible aux guillemets simples/doubles,
  puisque les entrées manuelles et celles issues du pipeline
  `merge_kanji.mjs` n'utilisent pas le même style de guillemets)
- **27 thèmes en français**, taxonomie compilée à la main à partir des
  241 sens existants (pas de faux vide sur aucun kanji) : nombres,
  quantité, qualités, couleurs, direction, temps, météo, nature, corps,
  famille, personnes, nourriture, maison, déplacement, éducation,
  communication, travail, argent, santé, ville, animaux, société,
  émotions, naissance, abstrait, quotidien, vêtements. Distribution très
  inégale par construction (ex. "vêtements" n'a qu'un seul kanji pour
  l'instant, "temps" en a 23) — accepté, un thème avec peu de résultats
  reste honnête plutôt que de forcer une couverture artificielle
- `naissance` est la réponse concrète à l'exemple "grossesse" de
  l'utilisateur (生 vivre/naître, 産 produire/naître) — pas de kanji
  taggé littéralement "grossesse" au sens strict dans le contenu actuel
- **Explorer** (`Explorer.tsx`) : nouvelle rangée de filtre "Champ
  lexical" (`ChoiceButtonGroup`, sélection unique, jamais de liste
  déroulante — cohérent avec la règle de design déjà en place), visible
  **uniquement quand le filtre Type = "Kanjis"** (pas de thème sur
  vocabulaire/grammaire pour l'instant ; `theme` revient à "Tous"
  automatiquement si on change de Type). Les thèmes sont aussi ajoutés
  au `searchText` de chaque kanji dans `buildExplorerItems.ts`, donc
  taper directement "naissance" dans la barre de recherche libre marche
  aussi, sans passer par les boutons
- `ExplorerItem.themes: string[]` — tableau vide pour vocab/grammaire
  (seuls les kanjis ont ce champ pour l'instant)

## Écran `/notebook` — Cahier

Dans `src/features/notebook/Notebook.tsx`. Choisi comme prochain écran
par l'utilisateur. Reprend la tagline déjà écrite dans l'ancien
placeholder ("Une grande feuille quadrillée pour écrire librement, sans
score ni minuteur — comme un vrai cahier japonais") — pas de nouvelle
direction, juste la construction de ce qui était annoncé.

- **Réutilise `WritingCanvas` telle quelle** (le moteur de dessin
  Pointer Events déjà construit pour les cartes de séance) plutôt que
  de dupliquer la logique de tracé/redimensionnement/gomme — même
  motif de reuse que `ModuleEndCard`/`Explorer`. Deux nouvelles props
  optionnelles ajoutées à `WritingCanvas`, sans toucher aux 3 usages
  existants (`KanjiCardLoop`/`VocabCardLoop`/`GrammarCardLoop`, qui
  gardent leur comportement par défaut) :
  - `title?: string` — par défaut le texte historique "Entraînement à
    l'écriture" ; le Cahier passe `title=""` pour l'omettre (le titre
    de l'écran suffit déjà), les outils prennent alors toute la largeur
    (`.writing-canvas__head--tools-only`)
  - `grid?: boolean` — grille carrée en fond façon papier japonais
    quadrillé (`.writing-canvas__surface--grid`, deux
    `linear-gradient` sur `--color-border`, cellules de 40px), motif
    posé sous le canvas d'encre transparent
- `strokeKey="cahier"` fixe (jamais de changement de clé, donc jamais
  d'effacement automatique — contrairement aux cartes de séance où
  changer de kanji/mot vide le canvas)
- Page plein format sous `MainLayout` (nav visible) : titre + sous-titre
  dans le même style que `/explorer`, zone de dessin en `flex: 1` pour
  occuper le reste de la hauteur disponible
- Vérifié : dessin, gomme (efface juste au passage), "Tout effacer",
  thème clair/sombre (encre et grille suivent les tokens de couleur),
  et non-régression des trois cartes de séance (titre + pas de grille,
  comportement inchangé)
- Pas de pages multiples, pas d'historique, rien de sauvegardé — cohérent
  avec la phase mock actuelle (pas de persistance) ; à revisiter le jour
  où IndexedDB entre en jeu

## Écran `/notes` — Notes perso (nouveau, 6ᵉ onglet)

Demande explicite : "prendre des notes genre quand je regarde une série,
ou que j'entends une expression ou un nouveau mot... un + pour écrire
une nouvelle note que je peux renommer avec un titre... j'écris
manuscritement ou en tapant et y'a pas besoin de reconnaître ce que
j'écris — c'est juste pour avoir des notes perso". Différent du Cahier
(page unique, jamais sauvegardée, pensée pour s'échauffer à l'écriture) :
ici plusieurs notes **titrées et persistées**, pensées pour être
retrouvées plus tard — d'où un onglet séparé plutôt qu'une fusion avec
Cahier ou Explorer.

- **`src/db/db.ts`** — nouvelle table `notes` (`id, profileId, title,
  text, drawingDataUrl, createdAt, updatedAt`) ajoutée en `version(2)`
  (les tables existantes sont reprises à l'identique dans ce même bloc —
  schéma Dexie additif obligatoire pour que les bases déjà créées sur un
  appareil upgradent sans perdre profils/maîtrise). `src/db/notes.ts` :
  `listNotes`/`getNote`/`createNote`/`updateNote`/`deleteNote`, même
  forme que `profiles.ts`/`mastery.ts`.
- **`src/db/id.ts`** — `generateId()` (repli `crypto.getRandomValues` →
  `Math.random` si `crypto.randomUUID` indisponible, voir le bug LAN/iPad
  documenté plus haut) **extrait de `profiles.ts` vers un module partagé**,
  pour ne pas réintroduire le même bug à chaque nouvelle table qui a
  besoin d'un id. `profiles.ts` importe désormais depuis `./id`.
- **Chaque note a texte tapé ET dessin manuscrit, pas l'un ou l'autre** —
  décision de design : plutôt qu'un bouton pour basculer de mode (friction
  inutile pour un usage aussi spontané — noter vite un mot entendu), les
  deux zones coexistent toujours sur la même note. Aucune reconnaissance
  d'écriture nulle part (demandé explicitement) : le dessin est stocké tel
  quel, en bitmap.
- **`NoteCanvas.tsx`** — variante persistée de `WritingCanvas` (**pas**
  une extension de `WritingCanvas` lui-même : celui-ci est explicitement
  "jamais évalué, jamais sauvegardé" par conception, documenté dans son
  propre commentaire — lui greffer de la persistance serait sortir de son
  périmètre voulu ; préféré un second petit composant, quitte à reprendre
  le même moteur de dessin par Pointer Events, plutôt que complexifier un
  composant central déjà utilisé par les 4 boucles de carte de séance).
  `initialImage` (dataURL PNG) chargée au montage ; `onChange(dataUrl)`
  appelé après chaque trait (`canvas.toDataURL('image/png')`) — le parent
  décide de la persistance. Le contenu est aussi redessiné après chaque
  redimensionnement (`ResizeObserver`), pas seulement au montage : changer
  `canvas.width`/`height` vide le bitmap HTML, donc sans ce redessin une
  rotation d'écran ou un simple resize de fenêtre effacerait
  silencieusement la note.
- **`NotesList.tsx`** (`/notes`) — grille de cartes (titre, date, aperçu
  du texte tapé sur 2 lignes) + carte "+" en pointillés (même motif que
  `profile-card--new`) qui crée la note (`createNote`) et navigue
  directement vers son édition.
- **`NoteEditor.tsx`** (`/notes/:id`) — titre en `<input>` toujours
  éditable (pas de mode "renommer" séparé), `<textarea>` pour le texte
  (sauvegarde 400ms après la dernière frappe, pas à chaque caractère),
  `NoteCanvas` en dessous (grille de fond façon papier japonais, mêmes
  outils stylo/gomme/tout-effacer que Cahier). Bouton supprimer avec
  confirmation navigateur native (`window.confirm`) — pas demandé
  explicitement mais nécessaire dès qu'une liste de notes peut grandir
  sans fin.
- **Onglet "Notes"** ajouté dans `MainLayout.tsx` (icône `StickyNote`,
  entre Cahier et Stats) — 6ᵉ onglet, testé sur mobile (375px) sans
  problème de place dans la barre du bas.
- **Vérifié en direct** : création → titre + texte tapés (persistés
  immédiatement en base) → trait dessiné (`PointerEvent` synthétiques,
  les coordonnées `computer` du navigateur de test ne correspondaient pas
  à l'échelle réelle de la page — vérifié directement via
  `canvas.dispatchEvent`) → retour à la liste (aperçu correct) → note
  rouverte (titre/texte/dessin tous restaurés) → redimensionnement vers
  375px (dessin toujours présent, juste redessiné à la nouvelle taille)
  → suppression (retour à liste vide). Aucune erreur console à aucune
  étape.

## Écran `/stats` — Statistiques

Remplace le placeholder d'origine. `StatsScreen.tsx` + `mockStats.ts` +
`Stats.css`, dans `src/features/stats/`. `StatsPlaceholder.tsx` supprimé
(plus référencé nulle part). **Première version corrigée juste après
coup sur deux points, suite à un retour direct de l'utilisateur** :

1. La page ne parlait que des kanjis (héritage de la description du
   placeholder d'origine) — corrigé en ajoutant une section
   "Répartition par module" (`mockModuleBreakdown` : 3 tuiles kanji/
   vocab/grammaire, chacune `mastered/total` avec une mini-barre) et en
   transformant le classement "Kanjis les plus difficiles" en "Le plus
   difficile en ce moment" (`mockHardestItems`), qui mélange
   volontairement kanji/vocab/grammaire (2 de chaque) plutôt que de ne
   citer que des kanjis — cohérent avec la règle de design déjà en place
   ailleurs ("l'app ne doit jamais donner l'impression de ne concerner
   que les kanjis")
2. **Section "Lectures les plus oubliées" supprimée entièrement**
   (`mockForgottenReadings`/`ForgottenReadingEntry` retirés de
   `mockStats.ts`) — retour utilisateur : dans le flux de test de
   l'app, on ne répond qu'avec **une seule** lecture par kanji (onyomi
   OU kunyomi), jamais les deux. Rater une lecture ne veut donc pas dire
   qu'elle est "oubliée" — juste que ce n'est pas celle qu'on a écrite
   ce jour-là ; on peut très bien connaître l'autre aussi. La métrique
   n'a pas de sens tant qu'il n'y a pas de vraie distinction "lecture
   demandée vs lecture donnée" quelque part dans le moteur de test —
   pas le cas aujourd'hui (pas de FSRS, pas de tracking par carte, voir
   plus bas)

Sections restantes : Répartition par module, Progression par niveau
JLPT (kanjis uniquement — c'est le seul module avec un objectif chiffré
type "128/500" sur le Dashboard, rien d'équivalent à décliner par
niveau côté vocab/grammaire), Le plus difficile en ce moment, Temps
passé à écrire.

- **Aucune lib de graphique installée** dans le projet (`package.json` :
  react/react-router-dom/zustand/lucide-react/framer-motion seulement) —
  tout est fait à la main (barres horizontales/verticales en `div`),
  pas de dépendance ajoutée pour ça
- **Pas de tracking réel par carte** à ce stade (pas de FSRS, confirmé en
  cherchant `difficulty`/`mastery`/`reviewCount`/`easeFactor` dans tout
  `src/` — rien de tel n'existe encore sur `Kanji`/`VocabWord`/
  `GrammarPoint`). Toutes les sections sont donc simulées dans
  `mockStats.ts`, même logique que le reste de l'app en phase mock ("un
  état déjà avancé" plutôt qu'un écran vide). `mockLevelProgress` :
  inventé pour que la somme des `target` fasse 500 et celle des
  `mastered` fasse 128, cohérence avec `mockGoal` du Dashboard plutôt
  que deux chiffres globaux différents. `mockHardestItems` référence de
  vrais `itemId` de `mockKanjiList`/`mockVocabList`/`mockGrammarList`
  (résolus via `find()` dans `StatsScreen.tsx`, jamais de contenu
  dupliqué en dur dans `mockStats.ts`). `mockWritingTime` (7 jours
  glissants) reste purement inventé — aucune durée n'est trackée nulle
  part dans l'app, ni dans `WritingCanvas` ni ailleurs
- **Couleurs** : progression JLPT et répartition par module en accent
  turquoise (cohérent avec `ProgressRing`/Dashboard) ; le classement "le
  plus difficile" utilise l'accent chaleureux (`--color-warm`),
  **jamais** `--color-success`/`--color-danger` — cette paire est
  réservée au jugement binaire maîtrisé/à revoir des cartes de session,
  un principe déjà noté plus haut dans ce fichier et volontairement
  respecté ici
- Carte `.stats-card` définie localement dans `Stats.css` plutôt que de
  réutiliser `.soft-card` de `Dashboard.css` par import croisé — même
  rendu visuel (mêmes tokens), mais évite d'ajouter une dépendance
  cross-feature de plus (voir la remarque déjà présente plus haut sur
  `ModuleEndCard` vivant dans `features/kanji/` alors qu'utilisé
  ailleurs — pattern à ne pas reproduire sans besoin)

## Ce qui manque encore côté données

- **N5 et N4 en cours de passage à une couverture officielle complète**
  (kanjis/vocabulaire/grammaire) — voir le tracker tout en haut de ce
  fichier ("🚧 EN COURS"), qui fait foi sur l'avancement réel plutôt que
  ce paragraphe. N3/N2/N1 restent volontairement petits (2-3 par module,
  contenu d'origine : kanjis 全感/済域/憂蓄, non touchés par ce chantier)
- **Le sélecteur Niveau du Dashboard est maintenant branché sur un vrai
  filtrage** (demande explicite de l'utilisateur, "fais le 1") : chaque
  `*CardLoop` filtre sa liste par `location.state.level` transmis
  depuis `CustomSessionBuilder`. La séance Recommandée reste
  volontairement **sans filtre de niveau** (elle n'a pas de sélecteur
  Niveau) — tous niveaux confondus, comme le ferait un vrai algorithme
  de révision. Cas limite géré : si un niveau+module n'a aucun contenu,
  `ModuleEndCard` affiche "Rien à réviser à ce niveau" plutôt que de
  planter — actuellement jamais déclenché en pratique puisque tous les
  niveaux ont au moins 2 items par module, mais le code le gère
- **Révisions construit — voir section dédiée ci-dessous.** `ModulePlaceholder`
  a été supprimé (n'était utilisé que pour ce module).
- Type `JlptLevel` (`'N5'|'N4'|'N3'|'N2'|'N1'`) défini dans
  `mockKanji.ts`, réutilisé par `mockVocab.ts` et `mockGrammar.ts`
- Le mock est désormais saisi **pré-segmenté pour le furigana**
  (`FuriganaSegment[]` par mot/phrase, voir plus haut) plutôt que comme
  une simple paire texte+lecture globale — plus fidèle à l'affichage
  réel, mais plus coûteux à saisir à la main. À garder en tête pour
  estimer l'effort si le contenu mock est encore étoffé, et pour la
  vraie question du futur import de données : une source réelle
  (KanjiVG, JMdict...) ne fournira pas ce découpage tout fait, il faudra
  soit le générer, soit le saisir

## Serveur de dev et accès réseau (iPad, LAN)

`vite.config.ts` a `server.host: true` — le serveur écoute sur toutes
les interfaces, pas juste `localhost`, pour être accessible depuis
l'iPad sur le même Wi-Fi que le PC (`http://<IP locale du PC>:5173`).

**Piège rencontré, à ne pas reproduire** : `tsconfig.node.json` (qui
type-checke `vite.config.ts`) n'avait pas d'`outDir` — chaque `tsc -b`
compilait silencieusement `vite.config.ts` en `vite.config.js` à la
racine du projet, et Vite charge le `.js` compilé en priorité sur le
`.ts` source s'il en trouve un. Résultat : toute modification de
`vite.config.ts` était ignorée en pratique, écrasée par une version
périmée à chaque `tsc -b`. Corrigé en ajoutant
`"outDir": "node_modules/.tsbuild-node"` à `tsconfig.node.json` — **ne
jamais laisser `tsconfig.node.json` émettre à la racine du projet**, et
si un `vite.config.js`/`.d.ts` réapparaît un jour à côté du `.ts`,
c'est le symptôme de ce même piège, à supprimer et pas à modifier.

Si la connexion depuis l'iPad ne passe toujours pas alors que le
serveur écoute bien sur toutes les interfaces : le réseau Wi-Fi de
l'utilisateur est classé "Public" dans Windows, ce qui bloque par
défaut les connexions entrantes. Deux solutions côté utilisateur
(jamais changées automatiquement par l'agent — réglage réseau/sécurité
qui lui revient) : autoriser node.js dans la popup du Pare-feu Windows
si elle apparaît, ou repasser le réseau en "Privé" dans les réglages
Windows si c'est bien son réseau domestique de confiance.

## Bug iPad : sélection de texte bleue pendant le dessin (corrigé, 3 endroits)

Signalé sur iPad (doigt et Apple Pencil) : après 3-4 traits dans une zone
d'écriture, Safari déclenchait son menu de sélection de texte natif,
sélectionnant la zone (et le texte juste au-dessus) en bleu, sans
possibilité de désélectionner. Cause : `user-select`/`-webkit-touch-
callout` non désactivés sur la zone de dessin (`touch-action: none` seul
ne suffit pas à bloquer ce comportement précis sur Safari iOS).

Corrigé à **deux endroits séparés**, parce que ce sont deux implémentations
de canvas indépendantes :
1. **`WritingCanvas.tsx`** (dessin libre, jamais évalué — séances, Cahier,
   pratique depuis Explorer) : `e.preventDefault()` dans
   `handlePointerDown`/`handlePointerMove`, + `user-select: none`,
   `-webkit-user-select: none`, `-webkit-touch-callout: none` sur
   `.writing-canvas` (tout le panneau, pas juste le canvas) et
   `.writing-canvas__ink`
2. **`KanjiPracticeBox.tsx`** (Explorer, bouton crayon sur une ligne
   kanji) — **implémentation de canvas séparée** (capture chaque trait
   comme liste de points pour comparaison avec `strokeMatch.ts`, pas
   seulement peint sur un bitmap), donc le correctif de `WritingCanvas`
   n'était **pas hérité automatiquement**. Repéré après coup quand
   l'utilisateur a signalé le même bug en essayant d'écrire 花 depuis
   Explorer. Même traitement : `preventDefault()` sur les deux handlers,
   `user-select`/`-webkit-touch-callout` sur `.kanji-practice` (tout
   l'encadré) et `.kanji-practice__ink`
   
   **À surveiller** : toute future zone de dessin par pointer events
   devra reprendre ce même traitement CSS + `preventDefault()` — ce
   n'est pas hérité automatiquement d'un composant à l'autre.
3. **`.stroke-order-panel`** (repère "ordre des traits" affiché à côté du
   canevas dans les séances Kanjis/Révisions, via `renderWritingExtra` de
   `CardLoopShell.tsx`) — resignalé par l'utilisatrice ("ça sélectionne
   les numéros en bas des vignettes"), après le correctif ci-dessus.
   Cause différente des deux premiers : ce n'est **pas un canvas**, donc
   pas de `preventDefault()` à ajouter — c'est un panneau de texte/SVG
   *à côté* du canevas (frère, pas parent/enfant) dans
   `.session__writing-col`, qui n'avait jamais reçu le traitement
   `user-select`/`-webkit-touch-callout` : un tracé qui déborde un peu de
   la zone de dessin sélectionnait le panneau voisin. Corrigé en
   appliquant `user-select: none` / `-webkit-user-select: none` /
   `-webkit-touch-callout: none` sur **`.session__writing-col`** (le
   conteneur commun aux deux), plutôt que sur `.stroke-order-panel` seul —
   protège tout ce qui existe déjà dans cette colonne **et** tout ce qui
   pourrait s'y ajouter plus tard, sans nouveau trou à corriger à chaque
   fois. Vérifié : `getComputedStyle('.stroke-order__step-number')
   .userSelect === 'none'` après le correctif. Audit complet refait à
   cette occasion sur toutes les zones de dessin de l'app (`WritingCanvas`
   dans les séances/Cahier, `KanjiPracticeBox` dans Explorer) — les deux
   autres étaient déjà correctement protégées, seul `.stroke-order-panel`
   avait ce trou.

## Utilisation sur téléphone : carte agrandie + anti-zoom iOS sur les champs

Demande explicite de l'utilisatrice pour pouvoir utiliser l'app sur
téléphone (jusqu'ici surtout testé/pensé pour iPad) : deux problèmes
distincts.

**1. Carte retournée trop petite, défilement confiné à "une toute petite
partie"** — le palier mobile existant (`@media (max-width: 860px)` dans
`SessionCard.css`, qui empile `.session__card-col` au-dessus de
`.session__writing-col`) réservait un budget de hauteur généreux à tout
ce qui n'est PAS la carte (padding de `.session`, colonne d'écriture
fixée à 200px, boutons de décision pleine taille) — sur un écran de
téléphone (`100dvh` bien plus petit qu'une tablette), il ne restait
qu'une fraction de l'écran pour `.flip-card` (`flex: 1; min-height: 0`),
donc pour `.flip-card__face--back` qui ne peut défiler que dans cet
espace résiduel. Corrigé par un **nouveau palier plus étroit**
(`@media (max-width: 600px)`, ajouté après les deux paliers existants
plutôt que de modifier le palier ≤860px pensé pour iPad portrait/paysage
étroit, pour ne pas régresser ce qui marchait déjà là) qui resserre tout
ce qui grignote la hauteur de la carte : padding de `.session`
(`--space-md --space-lg` → `--space-sm --space-md`), marges/écarts de
`.session__header`/`.session__body`/`.session__card-col`, padding des
faces de carte (`--space-lg` → `--space-md`), boutons de décision plus
compacts. La colonne d'écriture elle-même passe de 200px à **150px fixe
+ `overflow-y: auto`** (filet de sécurité si le panneau "ordre des
traits" + le canevas ne tiennent pas tous les deux — elle défile alors
elle-même plutôt que de déborder sur le reste de la page), avec
`.writing-canvas__surface` (min-height 220px → 80px) et
`.stroke-order__step` (44px → 34px) réduits en conséquence : la colonne
d'écriture devient délibérément secondaire/compacte sur téléphone (juste
de quoi vérifier deux-trois traits), au profit de la carte qui récupère
l'essentiel de l'espace. Ajouté aussi `-webkit-overflow-scrolling: touch`
sur `.flip-card__face--back` (scroll iOS plus fluide, sans rapport
direct avec le bug mais gratuit). **Vérifié en direct** à 375×812
(iPhone) : `.flip-card__face--back` passe d'environ 270px estimés à
**480px réels** de hauteur ; `.session__writing-col` reste à 150px avec
`overflow-y: auto` actif.

**2. Zoom automatique de Safari ("la loupe") en tapant dans un champ de
texte** — comportement connu d'iOS Safari : tout `input`/`textarea`/
`select` dont la taille de police calculée est < 16px déclenche un zoom
de la page entière au focus. Deux champs concernés : `.profile-card__input`
(Prénom, 14px) et la recherche Explorer (`.explorer__search input`,
15px) — le champ `.test-write__input` (17px) n'était pas concerné.
Corrigé une fois pour toutes dans `src/styles/global.css` plutôt que
champ par champ (protège aussi tout futur champ de texte) : `@media
(max-width: 600px) { input, textarea, select { font-size: 16px
!important; } }`. Le `!important` est nécessaire — un sélecteur
d'élément nu a une spécificité plus faible qu'un sélecteur de classe
(`.profile-card__input` continuerait sinon à imposer 14px même dans la
media query, et le zoom reviendrait). Vérifié en direct : `14px` de base
→ `16px` à 375px de large → `14px` de nouveau à 1000px de large (le
style desktop d'origine n'est pas touché, seul le palier mobile change).

## Bug iPad : kanjis en bleu foncé sur Vocabulaire/Grammaire (corrigé)

Signalé par l'utilisateur en testant sur iPad Safari : les kanjis/mots
affichés dans les cartes Vocabulaire et Grammaire apparaissaient en
bleu foncé, contrairement à la section Kanjis où ils étaient dans la
bonne couleur (texte primaire). Double cause, corrigée aux deux
niveaux (ceinture et bretelles) :

1. `.flip-card__word` / `.flip-card__mini-word` / `.flip-card__mini-char`
   (utilisées par `VocabCardLoop.tsx`/`GrammarCardLoop.tsx`) n'avaient
   pas de `color` explicite, contrairement à `.flip-card__char`
   (kanjis) qui a `color: var(--color-text-primary)`. Le texte étant
   dans un `<button>`, iOS Safari applique sa couleur de bouton par
   défaut en l'absence de `color` explicite → bleu. Corrigé en
   ajoutant `color: var(--color-text-primary)` aux trois classes dans
   `SessionCard.css`.
2. Ceinture de sécurité : ajout de
   `<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">`
   dans `index.html`, pour désactiver la détection automatique de
   motifs (tél./date/adresse) de Safari iOS qui peut transformer du
   texte en lien bleu souligné — comportement WebKit non reproductible
   dans le navigateur de dev utilisé ici, donc corrigé de façon
   préventive en plus du vrai fix CSS.

Vérifié visuellement (front + back face, Vocabulaire et Grammaire) en
Chromium — la vraie validation sur iPad Safari reste à faire par
l'utilisateur.

## Gomme agrandie

`ERASER_WIDTH` dans `WritingCanvas.tsx` passé de `28` à `42` (trait du
stylo inchangé à `PEN_WIDTH = 4`), suite à un retour utilisateur sur
iPad ("gomme un peu plus grande"). Vérifié visuellement (tracé au
stylo puis passage gomme, gap nettement plus large que le trait).

## Nouveaux / Mélange — sur quoi ça se basera plus tard (question utilisateur)

Actuellement pure UI dans `CustomSessionBuilder` (panneaux "Nouveaux"/
"Mélange" par module) — les boutons ne filtrent rien, tout le mock est
montré quel que soit le choix. Réponse à la question de l'utilisateur
sur le mécanisme prévu : **Nouveaux** = éléments jamais étudiés (pas de
statut enregistré) ; **Mélange** = nouveaux + éléments marqués "à
revoir" (dus pour révision), en excluant normalement ceux récemment
marqués "maîtrisé" sauf si leur intervalle FSRS les fait ressurgir.
Nécessite de stocker un statut maîtrisé/à revoir par carte (donc
IndexedDB/Dexie) et une vraie logique de planification (ts-fsrs) — les
deux restent hors scope tant que non explicitement demandés (cf. phase
actuelle en tête de ce fichier). Dépendance claire pour le futur module
Révisions aussi (voir plus haut).

## Prochaine étape suggérée

La boucle complète de séance personnalisée est bouclée de bout en bout :
Dashboard → modules d'apprentissage (Kanjis/Vocabulaire/Grammaire,
filtrés par niveau) → `/session/test` (Tester mes connaissances,
**kanjis+vocabulaire+grammaire**) → résultat → retour dashboard.
`/explorer` (dictionnaire libre, recherche + filtres + favoris) est
aussi construit. La grammaire a été ajoutée au test (motif ↔ sens,
même moteur de question que kanji/vocab — voir section dédiée
ci-dessus) ; les tracés de tous les kanjis utilisent maintenant de
vraies données KanjiVG. `/notebook` (Cahier) est construit aussi —
feuille libre quadrillée, réutilise `WritingCanvas`. Décision
utilisateur en attente pour la suite : étoffer encore le mock,
s'attaquer au module Révisions (demande une réflexion à part sur la
notion de progression — voir section Nouveaux/Mélange ci-dessus,
bloquée sur la persistance), ou passer aux deux écrans encore en
placeholder (Statistiques, Paramètres — `/training` reste aussi non
développé mais son rôle exact n'a pas été reprécisé depuis la spec V3).

**Mise à jour : module Révisions construit** (mock — mélange tout le
contenu existant, voir section dédiée) et **Explorer permet maintenant
de s'entraîner à écrire un kanji avec une vraie correction de forme**
(voir section Explorer, `strokeMatch.ts`). Les quatre modules de
séance (Kanjis/Vocabulaire/Grammaire/Révisions) sont maintenant tous
construits — reste : Statistiques, Paramètres, `/training`, et
toujours la question de la persistance pour Nouveaux/Mélange et une
vraie logique de révision.

## Bouton "carte précédente" — doit montrer la carte vraiment vue avant (corrigé, 2 passes)

Demande explicite de l'utilisatrice : en séance (Kanjis/Vocabulaire/
Grammaire/Révisions), cliquer sur la flèche "précédente" doit remontrer
la carte qu'on vient réellement de quitter, peu importe la décision
prise dessus (Maîtrisé / À revoir) — pas une carte différente si
l'utilisatrice va vite et clique retour par réflexe.

**Cause racine** : `CardLoopShell` lisait `items[index]` directement
depuis la liste fournie par l'appelant. En `contentMode: 'new'`, cette
liste est filtrée en direct sur `masteredIds` (`useLiveQuery`) — cocher
"Maîtrisé" retire l'item de `items` au rendu suivant, ce qui décale tous
les index après lui. Résultat : "précédente" pointait sur une carte
différente de celle qu'on venait de voir.

**Fix (1ʳᵉ passe)** : figer la file de la session dans un state local
(`queue`) au montage, une seule fois, jamais resynchronisé ensuite —
`goBack`/`advance` naviguent dans `queue`, pas dans `items`. Repose sur
un heuristique "figer dès que `items` non-vide" — **régression
introduite** : signalée par l'utilisatrice ("j'ai toujours 92 kanjis
maîtrisé dans les stats mais l'entraînement sur les nouveaux kanjis me
met les 101, pas uniquement les nouveaux"). Cause : au tout premier
rendu, `masteredIds` vaut sa valeur par défaut synchrone `EMPTY_SET`
(le temps que `useLiveQuery` résolve la vraie valeur IndexedDB) — en
`contentMode: 'new'`, `EMPTY_SET` ne filtre rien, donc `items` est
non-vide dès ce premier rendu mais contient **tout le niveau non
filtré**. L'heuristique "premier items non-vide" figeait donc sur cette
valeur transitoire fausse au lieu d'attendre la vraie liste filtrée.

**Fix (2ᵉ passe, définitif)** : nouvelle prop `itemsReady?: boolean` sur
`CardLoopShell`, calculée par chaque appelant (`KanjiCardLoop` /
`VocabCardLoop` / `GrammarCardLoop` : `contentMode !== 'new' ||
masteredIds !== EMPTY_SET` ; `RevisionCardLoop`, qui dépend de
`masteredIds` même en dehors de `contentMode: 'new'` :
`masteredIds !== EMPTY_MASTERED`) — ne fige la file que quand
l'appelant confirme que `items` reflète la vraie donnée résolue, pas la
valeur par défaut transitoire. Tant que `itemsReady` est `false`,
`CardLoopShell` n'affiche rien (évite un flash "Rien à réviser").

Détail d'implémentation qui a piégé la première tentative : ajuster
`hasFrozen.current`/`queue` **pendant le rendu** (pattern React
"adjust state while rendering") s'est révélé instable sous
**StrictMode** (double-rendu volontaire de React 18 en dev) — logs de
debug montrant `hasFrozenBefore: true, itemsReady: true` mais
`queueLen: 0` alors que `itemsLen: 5`, un état incohérent qui ne
devrait pas être atteignable avec une logique de rendu correcte.
Remplacé par un `useEffect` qui ne fige que lors de la transition
`itemsReady: false → true` (`useState`/`useRef` initialisés
synchrones pour le cas courant où `itemsReady` est déjà vrai au
montage — pas de flash dans ce cas, qui est le plus fréquent).

**Vérifié en navigateur** (profil Alex, kanji 人 déjà marqué maîtrisé) :
la séance recommandée affiche bien "Kanjis · 1/4" (4 nouveaux sur les 5
proposés, 人 exclu) et démarre sur 大, pas 人 — le bug de régression est
résolu. Retour arrière testé sur 大 après l'avoir marqué "Maîtrisé" et
être passé à la carte suivante (山) : la flèche précédente réaffiche
bien 大, la carte réellement vue avant, pas une autre. VocabCardLoop/
GrammarCardLoop/RevisionCardLoop ont reçu le même câblage `itemsReady`
mais n'ont pas été retestés individuellement en navigateur après cette
2ᵉ passe (seul `RevisionCardLoop` avait été vérifié après la 1ʳᵉ passe) —
partagent tous le même `CardLoopShell`, donc risque faible, mais à
garder en tête si un bug similaire resurgit sur un de ces trois modules.

## Contraintes qui restent vraies pour toute la suite

- Offline-first, aucune dépendance réseau au runtime
- Cible : iPad Safari (portrait + paysage) et Windows en développement
- Apple Pencil : pointer events, `touch-action: none` sur les zones de
  dessin, palm rejection à soigner le moment venu

## Explorer / Écriture — modifications ponctuelles (demande utilisatrice)

- **Champ lexical en liste déroulante** : remplace le `ChoiceButtonGroup`
  par un vrai `<select>` (`Explorer.tsx`/`.explorer__select*`), plus
  adapté aux ~50 options de thème que la rangée de boutons.
- **Filtre maîtrisé/non maîtrisé** dans Explorer : 3e `ChoiceButtonGroup`
  ("Tous/Non maîtrisés/Maîtrisés"), branché sur `getAllMasteredIds`
  (`db/mastery.ts`) via `useLiveQuery` — même motif que StatsScreen
  (`EMPTY_MASTERED` par défaut le temps de la résolution). Comparaison
  sur `item.data.id` (id brut) contre `masteredIds[item.kind]`, pas
  `item.id` (préfixé `kanji-`/`vocab-`/`grammar-` côté Explorer).
- **Sélection tactile pendant l'écriture (Apple Pencil/doigt)** : le CSS
  seul (`touch-action`/`user-select`/`-webkit-touch-callout`, déjà en
  place) ne suffisait pas de façon fiable sur iPadOS Safari — un trait
  qui marque un temps d'arrêt pouvait toujours déclencher le geste de
  sélection natif malgré `e.preventDefault()` dans les handlers
  `onPointerDown`/`onPointerMove`. Nouveau hook partagé
  `src/components/ui/useCanvasGestureGuard.ts` : `addEventListener`
  natif (non passif) sur `touchstart`/`touchmove`/`contextmenu`/
  `selectstart`/`dragstart` de la zone de dessin (`wrapRef`, pas le
  canvas seul) — impossible via les handlers React `onTouchStart` (passifs
  par défaut). Appliqué aux trois zones d'écriture : `WritingCanvas`
  (séance + Cahier), `NoteCanvas` (Notes), `KanjiPracticeBox` (Explorer).
- **Boutons stylo/gomme/poubelle agrandis** (28px→38px, écart 6px→12px,
  32px sur mobile ≤600px pour ne pas déborder) + **nouveau bouton
  "annuler le dernier trait"** dans `WritingCanvas` (icône `Undo2`,
  désactivé si aucun trait). Implémentation : chaque trait est gardé en
  mémoire (`strokesRef: {tool, points}[]`, pas seulement peint sur le
  bitmap) — annuler retire le dernier et **rejoue tous les traits
  restants depuis un canevas vidé** (seul moyen fiable une fois l'encre/
  la gomme compositées). `NoteCanvas` n'a pas reçu cette fonctionnalité
  (architecture différente : flatten+persist après chaque trait via
  `saveSnapshot`, pas d'historique de session à annuler sans refonte).
  Testé en navigateur (dispatch de `PointerEvent` synthétiques) : trait
  simple, annulation, annulation multi-traits, "tout effacer" qui
  réinitialise bien aussi l'historique.

## Kanjis — clés (décomposition en composants), premier niveau

Demande utilisatrice : afficher, pour chaque kanji, les clés/composants
visibles qui le composent (pas seulement LE radical classant existant,
`kanji.radical`), avec leur traduction française — "premier niveau"
uniquement (un composant qui se recompose lui-même, ex. 吾 = 五+口 dans
語, n'est pas déplié plus loin).

**Source** : décomposition `kvg:element` du SVG brut KanjiVG (déjà
utilisé pour `strokePaths`, mais le script d'extraction d'origine ne
gardait que les `d=` des `<path>`, pas la hiérarchie `<g kvg:element=…>`
qui encode la décomposition — donnée présente mais jamais exploitée
jusqu'ici). Nouveau champ `Kanji.components: { character; meaning }[]`
(tableau vide pour les kanjis atomiques, ex. 人/大 — le champ `radical`
suffit déjà à les décrire, pas de doublon d'affichage).

**Pipeline** (scripts dans le scratchpad de session, non versionnés) :
1. `fetch_kanjivg_decomposition.mjs` — re-télécharge les 2491 SVG
   KanjiVG (12 requêtes en parallèle, checkpoint tous les 150, 0 échec)
   et parse le **premier niveau** de décomposition : trouve le premier
   `<g … kvg:element="…">` du fichier (le vrai groupe racine sémantique
   — le wrapper `kvg:StrokePaths_XXXXX` qui le précède n'a jamais lui-
   même de `kvg:element`), puis descend d'un seul niveau de profondeur
   en comptant les ouvertures/fermetures `<g>`/`</g>`, collectant les
   `kvg:element` des enfants directs. **Bug initial corrigé** : la regex
   de repli utilisait `\d+` pour l'id hex du groupe racine (`kvg:08a9e`)
   — échouait dès que le codepoint hex contenait une lettre (a-f, ex.
   語=08a9e), donc uniquement sur les kanjis dont le codepoint hex est
   100% numérique. Corrigé en retirant cette contrainte (chercher
   directement le premier `<g … kvg:element="…">` du fichier).
2. Construction du dictionnaire de sens : 905 caractères-composants
   distincts trouvés au total. 629 déjà couverts en réutilisant deux
   sources existantes (222 `radical.meaning` déjà saisis dans les 2491
   kanjis + le sens propre d'un composant quand il est lui-même un kanji
   de la base). **276 traductions manquantes recherchées et saisies à la
   main** (radicaux Kangxi classiques et composants obscurs mais réels —
   `manual_component_meanings.json`), dont 12 variantes graphiques du
   bloc Unicode "CJK Radicals Supplement" vérifiées contre
   `UnicodeData.txt` officiel (ex. U+2E97 CJK RADICAL HEART TWO → même
   sens que le radical plein 心/忄 déjà en base : "cœur") plutôt que
   devinées à l'œil.
3. **7 étiquettes exclues** (ni traduites ni affichées) car ce sont des
   artefacts internes de regroupement graphique de KanjiVG sans sens
   sémantique constant, pas de vraies clés : 2 codes `CDP-XXXX`
   (caractères sans point de code Unicode standard, placeholders), マ
   (katakana réutilisé comme forme graphique dans 予/勇, sans rapport
   avec sa lecture), 龶/龷 (bloc "CJK Strokes", forme de trait générique
   partagée par des kanjis d'étymologies non liées — 青/責/毒/麦/素 pour
   龶 — donc pas un radical cohérent), 𢆉/𬀷 (caractères du plan
   astral, apparaissent chacun dans un seul kanji sans identification
   fiable possible). Vérifié qu'aucun kanji affecté ne se retrouve avec
   une liste de clés vide à cause de cette exclusion (chacun garde au
   moins un autre composant réel).
4. `insert_kanji_components.mjs` — réinsère `components: [...]` juste
   après le bloc `radical: {...}` existant de chacune des 2491 entrées,
   par correspondance positionnelle (2491 blocs `radical:` matchés dans
   l'ordre du fichier ↔ 2491 `{id, character}` extraits dans le même
   ordre), insertion en ordre inverse de fichier pour ne pas invalider
   les offsets déjà calculés. Fichier `mockKanji.ts` sauvegardé avant
   modification, supprimé après vérification (`tsc -b` propre, comptage
   id=2491/components=2492 dont 1 pour la déclaration d'interface,
   parenthèses équilibrées, 2414 kanjis avec clés + 77 atomiques = 2491).
- **Affichage** : nouvelle section "Clés" dans `Explorer.tsx`
  (`KanjiDetail`), sous forme de puces (`.component-chip`, caractère +
  sens), juste après Radical/Traits — absente pour les kanjis atomiques.
  Vérifié en navigateur sur 語 (Clés : 言 "parole", 吾 "je (classique)")
  et sur 人 (aucune section "Clés" affichée, comme attendu).
- **Étendu à la carte de séance** (`KanjiCardLoop.tsx`, demande
  utilisatrice de suivi) : même section "Clés" sur la face arrière de la
  carte d'apprentissage, juste sous On'yomi/Kun'yomi. Styles partagés
  `.component-chip*` déplacés d'`Explorer.css` vers `SessionCard.css`
  (déjà importé par Explorer.tsx) pour éviter la duplication — seul
  l'agencement de la liste diffère par contexte : `.flip-card__components`
  (séance, avec le même séparateur que `.flip-card__readings`) vs
  `.explorer-detail__components` (Explorer, sans séparateur, resté dans
  `Explorer.css`). Vérifié en navigateur : 山/川/木 (atomiques, pas de
  section) puis 会 (Clés : 人 "personne", 云 "dire"), et re-vérifié que
  la fiche Explorer affiche toujours bien ses clés après le déplacement
  de CSS.

## Bug corrigé : écran de fin de test ("Tester mes connaissances") plantait

Signalé par l'utilisatrice : après avoir répondu à la dernière question
du test de fin de séance, rien ne s'affichait (page blanche) au lieu de
l'écran de score déjà prévu dans le code (`if (qIndex >= total)` dans
`TestKnowledge.tsx`, avec `ModuleEndCard` "Test terminé : X/Y bonnes
réponses" + bouton retour dashboard).

**Cause** : violation des Rules of Hooks — le `useEffect` qui gère la
validation au clavier (Entrée = question suivante) était déclaré
**après** les deux `return` anticipés du composant (`total === 0` et
`qIndex >= total`). Tant que ces branches n'étaient pas atteintes, tous
les hooks s'exécutaient dans le même ordre à chaque rendu ; mais dès que
`qIndex >= total` devenait vrai (dernière question validée), le
composant prenait ce chemin de retour AVANT d'appeler `useEffect`,
donc avec un hook de moins que le rendu précédent — React lève alors
`Error: Rendered fewer hooks than expected` et démonte l'arbre (écran
blanc, aucun message d'erreur visible pour l'utilisatrice, juste la
console). Reproduit et confirmé en pilotant une séance complète par
scripts (`PointerEvent`/clics simulés avec délai entre chaque étape
pour laisser React re-rendre, sinon les actions se désynchronisent) et
en interceptant `console.error`/`window.onerror` pour capturer le vrai
message d'erreur (le simple `read_console_messages` ne remontait que le
message générique "The above error occurred in the <TestKnowledge>
component", pas la vraie exception).

**Fix** : `nextQuestion` et le `useEffect` associé déplacés avant les
deux `return` anticipés, pour que tous les hooks du composant soient
appelés inconditionnellement à chaque rendu, quelle que soit la branche
qui finit par retourner du JSX — règle générale à respecter pour tout
nouveau hook ajouté dans ce composant (ou tout composant à `return`
anticipé) à l'avenir.

Revérifié en navigateur, séance complète pilotée par script jusqu'au
bout (`Test terminé : 0/20 bonnes réponses` affiché correctement, avec
trophée, message d'encouragement et bouton "Retour au dashboard"
fonctionnel). **Effet de bord de ce test corrigé** : le pilotage
automatique avait cliqué "À revoir" sur des kanjis déjà marqués
"Maîtrisé" par la vraie utilisatrice (人/大, profil Alex), ce qui les
avait fait disparaître de ses stats (2/500 → 0/500) — restauré
manuellement dans IndexedDB (table `mastery`) après coup, vérifié
2/500 de nouveau sur le dashboard.

## Bug persistant corrigé : sélection tactile sur les boutons de décision

Signalé de nouveau par l'utilisatrice après le fix précédent (Apple
Pencil/doigt sur iPad, écriture en séance) : un tracé qui déborde un peu
sélectionnait en bleu le bouton **"Maîtrisé"**. Le fix précédent
protégeait `.session__writing-col` (colonne d'écriture) et les canevas
eux-mêmes, mais **pas `.session__card-col`** — colonne séparée qui
contient les boutons "À revoir"/"Maîtrisé" (`.session__decision`), donc
strictement aucune protection dessus jusqu'ici. Plutôt que rajouter la
protection zone par zone à chaque nouveau signalement (déjà fait deux
fois), `user-select`/`-webkit-user-select`/`-webkit-touch-callout: none`
posés une fois pour toutes sur `.session` (racine de tout l'écran de
séance) — plus aucun texte de cet écran n'est sélectionnable, peu
importe où un tracé déborde. Vérifié : `getComputedStyle` sur le bouton
"Maîtrisé" confirme `user-select: none` hérité, écran testé visuellement
sans régression (séance personnalisée, N5 Kanjis).

## Déploiement Vercel + vraies stats + mobile (après mise en ligne)

Site en ligne : https://pera-pera-eight.vercel.app/ (repo GitHub
`nortonalexclara-ops/pera-pera`, déploiement continu — chaque push sur
`main` redéploie). `vercel.json` ajouté (rewrite SPA, sinon 404 sur
refresh/lien direct hors `/`).

**Vraies stats par profil** (remplace `mockStreak`/`mockWordOfDay`,
fixes et identiques pour tout le monde) :
- Nouvelle table Dexie `activity` (v3 du schéma, `src/db/db.ts`) : une
  ligne par jour où le profil a fait au moins une carte en séance.
  `src/db/activity.ts` — `recordActivityToday` (appelé depuis
  `CardLoopShell.advance()`, centralisé plutôt que dupliqué dans les 4
  boucles Kanjis/Vocab/Grammaire/Révisions — nouveau prop `profileId` sur
  `CardLoopShell`), `getStreak` (remonte les jours consécutifs depuis
  aujourd'hui, ou hier si pas encore pratiqué aujourd'hui — la série ne
  casse qu'après un jour entier sans activité), `resetActivity`.
- `src/features/dashboard/wordOfDay.ts` — `getWordOfDay()` choisit un
  vrai mot de `mockVocabList` de façon déterministe sur la date du jour
  (même mot pour tout le monde toute la journée, change le lendemain,
  sans état à synchroniser).
- **Écran Réglages construit** (`src/features/settings/Settings.tsx`,
  remplace `SettingsPlaceholder` — supprimé) : réinitialisation
  granulaire par profil (Kanjis/Vocabulaire/Grammaire/Série/Notes,
  cases à cocher indépendantes, pas un unique "tout effacer"), avec
  étape de confirmation avant d'exécuter. Nouvelles fonctions
  `resetMastery(profileId, kinds?)` (db/mastery.ts),
  `resetActivity(profileId)`, `resetNotes(profileId)` (db/notes.ts).
  Nouveau `.btn-danger` dans global.css (même gabarit que `.btn-primary`,
  teinte danger). Testé en navigateur de bout en bout : coché "Série"
  seul → confirmé → streak repassé à 0, mastery kanji (2/500) intacte
  (la sélection granulaire ne touche bien que ce qui est coché).

**Mobile — deux signalements corrigés** :
- Barre de nav du bas disparaissait au scroll (ex. depuis Cahier,
  difficile de revenir au Dashboard). Cause réelle : `.main-layout__content`
  n'avait pas `min-height: 0` — piège flexbox classique, un flex item
  déborde de l'espace alloué au lieu de défiler en interne dès que son
  contenu est intrinsèquement plus grand, ce qui poussait toute
  `.main-layout` au-delà de 100vh. Fix définitif : `.tab-bar` passée en
  `position: fixed; bottom: 0` sur mobile (même stratégie déjà validée
  pour la version desktop `top: 0`, plutôt que refaire confiance à un
  calcul de hauteur flex jugé "pas assez fiable en pratique sur iPad
  Safari" par le passé) + `min-height: 0` corrigé en plus. Vérifié par
  script (scroll à 5000px, `position:fixed` reste ancré au viewport).
- Carte de séance trop grande sur téléphone, colonne d'écriture réduite
  à 150px devenue trop exiguë pour vraiment s'entraîner (nouveau
  signalement après un fix précédent qui avait fait l'inverse — donner
  le maximum de place à la carte). Rééquilibré à ≤600px :
  `flip-card__char` 130px→96px, `flip-card__word` 48px→34px,
  `.session__writing-col` 150px→240px, canevas 80px→120px min-height.
  Vérifié par mesure DOM (`getBoundingClientRect`) : carte 442px de haut
  (contre la quasi-totalité de l'écran avant), colonne d'écriture 240px
  avec un canevas de 120px effectivement utilisable.

**Comptes/PIN multi-appareils** — demandé (~10 utilisateurs, code à 4
chiffres par profil) mais **pas encore implémenté**, nécessite un
backend (l'app est 100% IndexedDB local jusqu'ici). Recommandation
donnée à l'utilisatrice : Vercel KV/Postgres + quelques routes API
serverless (déjà sur Vercel, pas de nouveau service tiers), en backup/
restore explicite plutôt qu'une synchro continue (plus simple, pas de
résolution de conflits à gérer, correspond à la demande littérale
"retrouver son profil sur un autre appareil"). En attente de son accord
avant de commencer — changement d'architecture non trivial (l'app perd
une partie de son fonctionnement hors-ligne pur pour ce qui passe par le
compte).

**Suite (implémenté)** : sauvegarde/récupération par code à 4 chiffres
construite (`api/backup.ts`, `api/restore.ts`, Upstash Redis via
`@upstash/redis`, `src/db/profileSync.ts` pour export/import local,
`src/features/profile/cloudSync.ts` côté client, UI dans Settings
"Sauvegarder en ligne" et ProfileSelector "Récupérer un profil"). Piège
rencontré à la connexion réelle : l'intégration Marketplace "Upstash for
Redis" de Vercel **ne crée pas** `UPSTASH_REDIS_REST_URL`/`_TOKEN`
(noms attendus par `Redis.fromEnv()`) mais des noms différents —
constaté dans Settings → Environment Variables du projet une fois
l'intégration connectée : `UPSTASH_REDIS_REST_KV_REST_API_URL`/
`_TOKEN` (probablement lié à l'héritage de l'ancien produit "Vercel KV"
dans le nommage de l'intégration). Corrigé en construisant le client
explicitement (`api/_redis.ts`, préfixe `_` = fichier partagé non exposé
comme route côté Vercel) avec ces noms précis plutôt que `fromEnv()` —
**à revérifier si l'utilisatrice reconnecte l'intégration sur un
nouveau projet**, les noms exacts ne sont pas garantis stables/
documentés côté Vercel. Autre point noté en passant (non bloquant) :
les variables créées par l'intégration sont scope "Production and
Preview" par défaut, pas "Development" — sans incidence sur le site
déployé, seulement sur `vercel env pull` en local si besoin de tester
avec `vercel dev`.

## Checkpoint — bannière backup, vrais favoris, marquage en masse, reconnaissance de kanji

Suite de 4 demandes traitées dans la foulée, toutes vérifiées en
navigateur (profil Alex, via clics DOM simulés — le pane de preview de
cette session ne compose pas de frames, donc pas de screenshot possible,
vérification faite via `get_page_text`/`innerText`).

1. **Bannière Dashboard → Réglages** : `Dashboard.tsx` affiche une
   bannière discrète ("Retrouve ton compte et ta progression sur tous
   tes appareils : crée un code à 4 chiffres.") avec lien vers
   `/settings`, fermable (croix), mémorisée fermée en `localStorage` par
   profil (`pera-pera:backup-banner-dismissed:{profileId}` — pas en
   IndexedDB, c'est une préférence d'affichage, pas une donnée de
   profil). CSS dans `Dashboard.css` (`.backup-banner*`).

2. **Vrais favoris persistés** : nouvelle table Dexie `favorites` (v4 du
   schéma, `src/db/db.ts`), même forme que `mastery`
   (`profileId+kind+itemId`). `src/db/favorites.ts` :
   `isFavorite`/`toggleFavorite`/`getFavoriteIds`/`getAllFavoriteIds`/
   `resetFavorites`. Remplace les étoiles purement visuelles (`useState`
   local, perdu au rechargement) sur le mot du jour du Dashboard et dans
   Explorer. Explorer a un 4ᵉ filtre "Favoris" (`ChoiceButtonGroup`) qui
   ne montre que les items favoris du profil actif. Reset des favoris
   ajouté aux options de Réglages (`RESET_OPTIONS`).

3. **Marquage en masse d'un niveau JLPT** : nouvelle fonction
   `bulkMarkMastered(profileId, kind, itemIds)` dans `src/db/mastery.ts`
   (idempotente — ignore les itemIds déjà maîtrisés). Nouvelle section
   dans Settings ("Marquer un niveau comme maîtrisé") : deux `<select>`
   (type de contenu / niveau JLPT), affiche "X sur Y pas encore
   marqués", bouton avec confirmation (même pattern que le reset
   existant, mais en accent turquoise plutôt qu'en rouge danger — ce
   n'est pas une action destructive). Testé en marquant les 101 kanjis
   N5 d'un coup pour Alex : le Dashboard reflète immédiatement le
   nouveau total maîtrisé (`useLiveQuery` déjà branché).

4. **Reconnaissance de kanji manuscrit (remplace Cahier)** : l'ancien
   `/notebook` ("Cahier", dessin libre sans but) devient un outil de
   reconnaissance façon Renshuu/SLJFAQ — on dessine, on appuie sur
   "Reconnaître", l'app propose les 5 kanjis les plus proches parmi les
   ~2491 connus. Nouveau fichier `src/features/kanji/kanjiRecognize.ts` :
   contrairement à `strokeMatch.ts` (qui VÉRIFIE un tracé contre UNE
   cible connue, trait par trait, en séance), `recognizeKanji` ne connaît
   pas la cible à l'avance — chaque caractère (dessiné et candidats) est
   aplati en un seul chemin continu (tous les traits mis bout à bout dans
   l'ordre), rééchantillonné à 64 points par longueur d'arc et normalisé,
   puis comparé par distance moyenne point à point ; une petite pénalité
   proportionnelle à l'écart de nombre de traits désambiguïse les paires
   à silhouette quasi identique (ex. 大/犬). Reste une heuristique de
   forme honnête, pas un modèle entraîné — peut se tromper sur des
   tracés ambigus, comme documenté dans le code. Les traits de référence
   (parsés depuis les path SVG KanjiVG) sont mis en cache après le
   premier calcul (`Map` module-level) pour ne pas refaire le travail DOM
   à chaque clic sur "Reconnaître" pour un même kanji.
   `WritingCanvas.tsx` gagne une prop optionnelle `onStrokesChange` pour
   exposer les traits bruts (traits "encre" seulement, pas la gomme) au
   composant parent. Le calcul (potentiellement ~1s la première fois, le
   temps de construire le cache de 2491 candidats) est différé via
   `setTimeout(fn, 0)` pour laisser le bouton se re-rendre en
   "Reconnaissance…" avant le blocage synchrone — **pas**
   `requestAnimationFrame`, qui ne se déclenche pas tant que l'onglet
   n'est pas visuellement composité (piège découvert pendant les tests :
   le pane de preview de cette session ne compose jamais de frames, donc
   rAF ne se déclenchait jamais et le bouton restait bloqué indéfiniment
   sur "Reconnaissance…" — `setTimeout` n'a pas ce problème). Tapoter un
   candidat navigue vers `/explorer` avec le kanji pré-rempli dans la
   recherche (`navigate('/explorer', { state: { query } })`, lu par
   `Explorer.tsx` via `useLocation().state`). Testé avec un simple trait
   horizontal dessiné via `PointerEvent` synthétiques : meilleur candidat
   retourné = 一 (un seul trait horizontal), comme attendu ; clic dessus
   → Explorer bien pré-rempli avec "一" et 62 résultats.

Nav : entrée "Cahier"/`PenLine` renommée "Kanji"/`ScanSearch` dans
`MainLayout.tsx` (même route `/notebook`, fichiers `Notebook.tsx`/
`.css` gardés tels quels par simplicité — seul le contenu a changé,
pas le nom des fichiers/route).

`npx tsc -b` clean après chaque étape. **Pas encore commité/poussé sur
git** — en attente de confirmation utilisateur comme d'habitude.

## Checkpoint — retours utilisatrice : Explorer trop chargé, reconnaissance peu fiable

Deux retours concrets après la vérification ci-dessus, corrigés dans la
foulée.

**Explorer : trop de rangées de filtres.** 4 rangées `ChoiceButtonGroup`
empilées (Niveau/Type/Maîtrise/Favoris) jugées trop chargées. Favoris
sorti de cette pile et transformé en interrupteur compact à côté de la
barre de recherche (`.explorer__search-row` : `.explorer__search` en
`flex:1` + `.explorer__fav-toggle`, pastille étoile qui bascule juste
Tous/Favoris) plutôt qu'une rangée de choix — un favori est un statut
personnel binaire, pas une catégorie parmi d'autres (inspiré du
`session-toggle` du Dashboard évoqué par l'utilisatrice, sans reprendre
le composant tel quel). `.explorer__filters` ne contient plus que 3
rangées (Niveau/Type/Maîtrise). Vérifié : pas de chevauchement à 375px
de large (recherche 223px + interrupteur 96px côte à côte), filtre
Favoris toujours fonctionnel (1 résultat sur le mot favori de test).

**Reconnaissance de kanji peu fiable.** Signalé : dessiner 女 (3 traits)
ne le proposait pas, et les candidats proposés avaient un nombre de
traits sans rapport. Cause réelle : `recognizeKanji` v1 aplatissait tout
le caractère en UN SEUL chemin continu (traits mis bout à bout dans
l'ordre de dessin) et comparait point par point à index égal — very
sensible à l'ordre de dessin (un utilisateur ne dessinant pas exactement
dans l'ordre KanjiVG obtenait un tracé "aplati" complètement différent
du candidat pourtant correct), et la pénalité d'écart de nombre de
traits (0.015/trait) beaucoup trop faible pour repousser des candidats à
nombre de traits très différent. Réécrit dans
`src/features/kanji/kanjiRecognize.ts` : chaque trait dessiné est
maintenant apparié au trait de référence le plus proche par un algorithme
glouton (`greedyStrokeMatchScore` — prend la paire trait-dessiné/trait-
référence la plus proche restante, la retire des deux côtés, recommence),
insensible à l'ordre de dessin par construction ; les traits non
appariés (écart de nombre de traits) coûtent un forfait
(`UNMATCHED_STROKE_COST = 0.55`, du même ordre qu'un mauvais match plutôt
qu'un score écrasant). Testé en dessinant les vrais traits KanjiVG de 女
**dans l'ordre inverse** (3, 2, 1 au lieu de 1, 2, 3) : 女 ressort bien
premier candidat, suivi de 才/丈/寸/大 — tous des kanjis à 3 traits de
forme réellement proche, plus aucun candidat "sans rapport". Re-testé
aussi le cas plus simple (trait horizontal seul → 一 en premier) pour
confirmer l'absence de régression.

`npx tsc -b` clean. Toujours pas commité/poussé.

## Checkpoint — dos de carte mobile, perf Explorer, suppression de profil

Trois nouvelles demandes traitées.

**Dos de carte kanji plus compact sur mobile.** `KanjiCardLoop.tsx` :
`.flip-card__back-head` (mini-kanji + définition) et `.flip-card__readings`
(on'yomi/kun'yomi) regroupés dans un nouveau wrapper
`.flip-card__back-summary` (seulement pour les cartes KANJI — vocab/
grammaire ont leur propre `renderBack`, non touché). Sur desktop ce
wrapper n'a aucun effet (les deux blocs gardent leur mise en page
d'origine, empilés). Sous `@media (max-width: 600px)` dans
`SessionCard.css`, il devient une rangée flex : définition à gauche
(mini-char réduit 60px→40px), prononciations à droite (empilées, plus
petites) — un seul séparateur en bas du duo au lieu de deux. Vérifié à
375px : le kanji constant est bien à gauche (x=0), les lectures à droite
(x=170), et le label "Mots" (début des exemples) tombe à 148px de haut
contre 388px de zone visible — donc visible sans scroller, ce qui était
la vraie demande (pas "tout faire tenir sans scroll", juste "voir qu'il y
a déjà des exemples"). Vérifié aussi que le desktop n'a pas régressé
(bloc classique, 60px, empilé).

Piège de vérification rencontré : dans CE pane de preview (qui ne
compose jamais de frames — voir le piège rAF déjà noté plus haut), les
`transition: transform` CSS ne s'animent jamais jusqu'à leur valeur
finale, donc lire `getComputedStyle` juste après avoir retourné la carte
donnait une matrice figée à l'identité (au lieu de `rotateY(180deg)`),
ce qui faisait paraître les enfants inversés gauche/droite. Contourné en
mettant `transition: none` sur `.flip-card__inner` juste avant la lecture
(force l'application instantanée du transform, sans dépendre du
compositeur) — n'affecte pas le vrai comportement utilisateur, seulement
ma capacité à mesurer dans cet environnement de test.

**Explorer lent à charger — confirmé et corrigé.** Deux causes réelles
(pas `buildExplorerItems`, déjà mémoïsé) : (1) aucune pagination —
jusqu'à ~10 200 `<li>` montés d'un coup sans filtre ; (2)
`normalizeSearch(item.searchText)` (NFD + regex) recalculé pour les
~10 200 items à CHAQUE frappe dans la recherche. Fixé : `searchText`
normalisé une seule fois à la construction (`normalizedSearchText` dans
`buildExplorerItems.ts`) : et affichage par paliers de 60
(`RESULTS_PAGE_SIZE`, `Explorer.tsx`) avec bouton "Afficher plus",
palier remis à zéro à chaque changement de filtre/recherche.

**Suppression de profil, protégée par le code à 4 chiffres.** Nouveau
endpoint `api/delete-account.ts` (même schéma que backup/restore) :
si le profil n'a jamais de sauvegarde en ligne, répond succès direct
(rien à protéger) ; s'il en a une, le code doit correspondre au hash
stocké, sinon 403. Le client (`Settings.tsx`, section "Supprimer ce
profil") appelle toujours cet endpoint avec le code tapé (vide si aucun)
avant de supprimer quoi que ce soit localement — même logique que pour
le reset, mais irréversible et à l'échelle du profil entier (plus ses
données : `deleteProfile` dans `src/db/profiles.ts`, transaction unique
sur profiles/mastery/notes/activity/favorites). Objectif : empêcher
qu'un autre utilisateur du même appareil partagé supprime un profil
sauvegardé qui n'est pas le sien, tout en laissant les profils jamais
sauvegardés (test, essai...) supprimables sans friction.

Bug réel découvert en testant cette suppression : `seedIfEmpty()` (voir
`src/db/profiles.ts`) re-semait Alex/Camille dès que la table
`profiles` repassait à 0 lignes — donc supprimer le tout dernier profil
les faisait *ressusciter* au prochain montage de ProfileSelector,
contredisant le commentaire d'origine qui promettait justement l'inverse
("un utilisateur qui les supprime ensuite ne les reverra pas revenir").
Corrigé avec un flag persistant `localStorage`
(`pera-pera:profiles-seeded`) qui découple "a-t-on déjà semé" de "la
table est-elle vide maintenant" — le seed ne peut plus se redéclencher
après coup, y compris pour les bases existantes qui n'avaient jamais eu
ce flag.

**Nettoyage effectué à la demande de l'utilisatrice** : profils "Alex"
et "Camille" (données de test/mock originelles) supprimés, un seul
profil "Test" créé à la place. Fait en utilisant la vraie fonctionnalité
de suppression ci-dessus (donc aussi un test en conditions quasi
réelles) — l'appel réseau vers `/api/delete-account` a dû être stubé
côté navigateur pendant le test car le serveur de dev local (`npm run
dev`, Vite seul) ne sert pas `/api/*` (seul le site déployé sur Vercel
le fait) ; réponse stubée `{hadBackup: false}`, fidèle à la réalité
puisque ni Alex ni Camille n'avaient jamais été sauvegardés en ligne
dans cette session.

`npx tsc -b` et `npx tsc -p tsconfig.api.json` clean. Toujours pas
commité/poussé.

## Checkpoint — mobile : colonne d'écriture agrandie, exemples resserrés

Demande : sur mobile, plus de place pour s'entraîner à écrire sans
défiler, et voir un peu plus d'exemples au dos de la carte sans passer en
deux colonnes (jugé peu lisible avec le furigana à 375px de large).
Trois leviers combinés dans `SessionCard.css`, tous sous
`@media (max-width: 600px)` :

1. **Ordre des traits déplacé à gauche du canevas, en bande verticale**
   (suggestion explicite de l'utilisatrice) — remplace la rangée de
   vignettes AU-DESSUS du canevas (~70-90px de hauteur perdue) par une
   bande étroite de 52px À GAUCHE (`.session__writing-col` passe en
   `flex-direction: row`), défilement interne propre si beaucoup de
   traits (`.stroke-order__steps` en colonne avec `overflow-y: auto`),
   label "ORDRE DES TRAITS" masqué (illisible à 52px de large, les
   vignettes numérotées suffisent). Le canevas récupère quasi toute la
   hauteur de la colonne.
2. **`.session__writing-col` remonté de 240px à 300px de hauteur fixe**,
   compensé par un rétrécissement du repère "précédent/niveau"
   au-dessus de la carte (`.session__back-btn` 34→28px,
   `.session__level-counter` resserré) — c'est ce repère que
   l'utilisatrice désignait par "le titre et la flèche pour retourner à
   la carte d'avant", pas le bouton "Retour au dashboard" tout en haut
   de l'écran (vérifié via le contexte : "retourner à la CARTE d'avant"
   correspond au bouton "Élément précédent" du deck, pas à la navigation
   de page).
3. **Espacements resserrés autour des exemples** (composants/lectures/
   marges de liste/interligne) plutôt qu'un passage en deux colonnes —
   qui aurait donné ~160px par colonne, trop étroit pour des phrases
   avec furigana sans casse de ligne malvenue.

Vérifié en navigateur (375×812, profil Test) : colonne d'écriture
300px de haut, zone de dessin réellement utilisable 265×240 (contre
~265×120 avant, soit le double) ; bande de traits testée à 2, 4, 6 et 13
traits — tient sans défiler jusqu'à 6, défile proprement en interne à 13
(`overflow-y` s'active correctement, le canevas garde sa taille pleine
dans tous les cas) ; colonne d'écriture elle-même n'a plus besoin de son
propre défilement (`needsOuterScroll: false`).

`npx tsc -b` clean (changements CSS uniquement). Toujours pas commité/
poussé.

## Checkpoint — barre de nav mobile débordait, backend Redis en panne, seed retiré

Trois problèmes distincts remontés après usage réel sur téléphone.

**Barre de nav mobile débordait, "Réglages" inatteignable.** 8 éléments
(avatar, thème, 6 onglets) dans `.tab-bar` sans aucune gestion de
dépassement — mesuré en navigateur à 375px : 424px de contenu pour 375px
disponibles (49px de débordement), "Réglages" poussé quasi entièrement
hors champ, et sans `overflow-x` il était impossible de glisser pour
l'atteindre. Corrigé dans `MainLayout.css`, nouveau bloc
`@media (max-width: 779px)` : rembourrage/marges des onglets et boutons
resserrés (tient sans déborder jusqu'à 320px de large, testé), et
`overflow-x: auto` posé en filet de sécurité pour les écrans encore plus
étroits (scrollbar masquée). `flex-shrink: 0` sur les éléments pour
qu'ils défilent plutôt que de s'écraser illisiblement.

**Suppression de profil échouait même code vide — backend Redis en
panne, pas un bug de logique.** Diagnostiqué en interrogeant directement
les endpoints déployés (`curl` vers pera-pera-eight.vercel.app) :
`/api/backup`, `/api/restore` ET `/api/delete-account` renvoient tous
les trois `500 FUNCTION_INVOCATION_FAILED` en ce moment — un problème
d'infra (très probablement les variables d'env Redis côté Vercel, déjà
signalées comme non garanties stables dans le checkpoint Upstash
ci-dessus), pas quelque chose de cassé par le nouvel endpoint delete-
account : même la lecture "ce profil a-t-il une sauvegarde ?" (première
étape, avant toute vérification de code) nécessite un appel Redis qui
échoue actuellement, donc même laisser le code vide finissait en erreur
— l'utilisatrice n'y est pour rien, ce n'est pas un problème d'usage.
**Pas résolu côté infra** (accès au dashboard Vercel de l'utilisatrice
nécessaire pour rediagnostiquer — même piège de nommage de variables que
précédemment, ou intégration déconnectée) — signalé, en attente qu'elle
vérifie Settings → Environment Variables comme la première fois.

En attendant, rendu la suppression de profil résiliente à une panne
serveur : `deleteAccountBackup` (`cloudSync.ts`) distingue maintenant un
vrai refus serveur (401/403, mauvais code — bloque la suppression) d'un
échec d'infra/réseau (5xx, requête qui échoue carrément — ne bloque
PLUS, juste un `console.warn`). Justifié par le fait que cette
protection par code n'a jamais été une vraie sécurité (~10 utilisateurs
de confiance, déjà documenté) : un backend en panne ne doit pas empêcher
de gérer ses profils localement. Testé en navigateur contre le serveur
de dev local (qui échoue nativement sur `/api/*`, aucun stub nécessaire
cette fois — condition réelle) : profil "Throwaway" créé puis supprimé
avec succès malgré l'échec réseau complet de l'appel serveur.

**Seed Alex/Camille retiré définitivement.** L'utilisatrice a précisé
ne pas vouloir que "les autres utilisateurs voient ces faux profils de
test" — clarifié que profils/données sont 100% locaux par appareil
(IndexedDB), il n'existe aucune liste partagée : supprimer Alex/Camille
sur UN appareil n'a jamais affecté les autres, et tout NOUVEL appareil
ouvrant l'app pour la première fois les recevait encore via
`seedIfEmpty()`. Ce garde-fou n'a plus lieu d'être (l'app est bien
au-delà de sa phase de migration mock) — fonction et flag
`pera-pera:profiles-seeded` retirés de `src/db/profiles.ts`,
`listProfiles()` ne sème plus rien : un nouvel appareil démarre
désormais sur une liste de profils vide.

`npx tsc -b` clean. Pas encore commité/poussé au moment d'écrire ceci —
à faire dans la foulée (comportement habituel de session : commit +
push dès que l'utilisatrice le demande).

## Checkpoint — Explorer mobile : accordéon, exemples cliquables, lectures groupées

Backend Redis toujours en panne (revérifié par curl direct sur
`/api/backup` — même `FUNCTION_INVOCATION_FAILED` que le checkpoint
précédent) — signalé à l'utilisatrice, en attente qu'elle revérifie ses
variables d'environnement Vercel. Quatre demandes indépendantes traitées
côté Explorer pendant ce temps, toutes dans `Explorer.tsx`/`.css` et
`buildExplorerItems.ts` :

1. **Accordéon entre cartes.** `expandedId` était déjà exclusif (une
   seule valeur), mais `practiceId` (entraînement à l'écriture) restait
   indépendant — on pouvait avoir le détail d'un item ET l'entraînement
   d'un AUTRE item ouverts en même temps. `handleToggleExpand`/
   `handleTogglePractice` ferment maintenant le panneau de l'AUTRE type
   quand il appartient à un item différent, sans toucher à l'état de la
   MÊME carte (ouvrir le détail de X n'y ferme pas sa propre pratique
   déjà affichée). Vérifié : un seul `.explorer-detail` monté à la fois,
   y compris en croisant détail/pratique entre deux items différents.

2. **Mots fréquents cliquables** (ex. 安 → 安全). Nouveau helper
   `segmentsToText` (texte brut sans furigana) + `openExample(text)`
   dans Explorer : remplit la recherche avec le mot cliqué et remet TOUS
   les autres filtres à "Tous" (sinon le mot cible pourrait rester caché
   par un filtre actif sans qu'on comprenne pourquoi). Scopé
   volontairement aux `frequentWords` de `KanjiDetail` uniquement, pas
   aux phrases d'exemple (`.explorer-detail__examples` "Exemples") : une
   phrase entière n'est pas une entrée de dictionnaire à elle seule.
   Vérifié : clic sur 安全 depuis la fiche de 安 → recherche mise à jour,
   1 résultat (l'entrée vocabulaire 安全 elle-même).

3. **Lectures groupées avec virgule/slash.** `kanjiReadings()` dans
   `buildExplorerItems.ts` (sub-label des lignes Explorer) et les
   valeurs on'yomi/kun'yomi de `KanjiDetail` : virgule entre lectures du
   même type, slash entre on'yomi et kun'yomi — remplace l'espace simple
   qui ne distinguait pas les deux groupes ("ジン ニン ひと" →
   "ジン, ニン / ひと"). Vérifié sur 安 : "アン / やす" affiché
   correctement dans la ligne de résultat.

4. **Mobile : kanji/mot agrandi, lecture réduite.** Signalé : le
   caractère semblait perdu à côté d'une lecture qui prenait toute la
   largeur en dessous. `.explorer-row__headline` 22px→30px et
   `.explorer-row__sub` 12px→11px, uniquement sous
   `@media (max-width: 600px)` — vérifié que le desktop garde bien
   22px/12px (pas de fuite de la règle mobile).

`npx tsc -b` clean. Toujours pas commité/poussé au moment d'écrire ceci.

## Checkpoint — diagnostic Redis amélioré, texte copiable, bug de scroll, compteur Explorer

Backend Redis **toujours en panne** au moment d'écrire ceci (troisième
signalement) — l'utilisatrice a demandé "dis-moi comment faire" plutôt
que je continue à lui redemander de vérifier sans plus de détail. Deux
choses faites : (1) rendu le diagnostic exploitable côté code — voir
ci-dessous — et (2) des instructions précises lui ont été données pour
son dashboard Vercel (pas dans ce fichier, dans la réponse de chat
directement, hors du scope de ce qui se persiste ici).

**Diagnostic Redis rendu exploitable.** Jusqu'ici `new Redis({ url:
process.env.X!, token: process.env.Y! })` dans `api/_redis.ts` pouvait
planter la fonction serverless ENTIÈRE si les variables sont absentes —
un crash à ce niveau ne renvoie aucun détail au client
(`FUNCTION_INVOCATION_FAILED`, page générique Vercel, confirmé par curl
direct sur `/api/backup` les trois fois), impossible à diagnostiquer de
l'extérieur. Corrigé : `_redis.ts` construit le client avec `?? ''` (ne
plante plus jamais à la construction) et exporte `redisConfigured`
(booléen). Les trois endpoints (`backup.ts`, `restore.ts`,
`delete-account.ts`) vérifient `redisConfigured` en premier (renvoie un
503 explicite si les variables manquent) ET enveloppent leurs appels
Redis dans un `try/catch` (renvoie un 500 avec message plutôt qu'un
crash muet pour toute autre panne). Ne corrige PAS le problème de fond
(toujours besoin que l'utilisatrice vérifie Vercel → Settings →
Environment Variables), mais la PROCHAINE fois que ça casse, un `curl`
direct donnera enfin un message exploitable au lieu d'une page Vercel
générique.

**Texte des exemples copiable sur mobile.** `.session` a un
`user-select: none` global (fix du bug de sélection Apple Pencil, voir
plus haut dans ce fichier) qui empêchait aussi de copier le texte du dos
de carte (lectures, exemples, traductions) — signalé comme gênant.
Réautorisé spécifiquement sur `.flip-card__face--back` dans
`SessionCard.css` (contenu statique, aucun tracé n'y a jamais lieu — le
dessin reste dans `.session__writing-col`, toujours protégée). Vérifié :
`user-select: text` sur le dos de carte, `none` toujours en vigueur sur
la colonne d'écriture et les boutons de décision (pas de régression du
bug Apple Pencil).

**Bug de scroll à la carte suivante.** Signalé : après "Maîtrisé", la
carte suivante s'ouvrait parfois déjà scrollée tout en bas. Cause :
`.flip-card__face--back` est le MÊME élément DOM réutilisé d'une carte à
l'autre (seul le contenu change via `renderBack`), donc son `scrollTop`
ne se réinitialisait jamais tout seul. `CardLoopShell.tsx` : nouveau
`backFaceRef` + `useEffect` qui remet `scrollTop = 0` à chaque passage en
phase 'back' (nouvelle carte OU re-retournement de la même). Vérifié en
navigateur : carte 人 scrollée à 200px manuellement, "Maîtrisé" → carte
suivante (大) s'ouvre avec `scrollTop: 0`.

**Compteur de position dans Explorer.** Nouvelle colonne
`.explorer-row__index` (1, 2, 3...) affichée devant chaque ligne —
position dans la liste FILTRÉE actuelle (`results`, pas les 10216 items
bruts sans filtre) : `visibleResults.map((item, i) => ...)`, `i`
correspond déjà à l'index dans `results` puisque `visibleResults` en est
une slice à partir de 0. Grille desktop : une colonne `auto`
supplémentaire ajoutée en tête. Grille mobile (`grid-template-areas`) :
nouvelle zone `index` en haut-gauche, `.` (cellule vide) dans les 3
autres lignes pour garder une colonne de large cohérente sans forcer de
contenu. Vérifié : 1-6 affichés dans l'ordre sur mobile et desktop, pas
de chevauchement avec le badge de type.

`npx tsc -b` et `npx tsc -p tsconfig.api.json` clean. Toujours pas
commité/poussé.

## Checkpoint — RÉSOLU : cause réelle du crash Redis (rien à voir avec la config)

Fausse piste corrigée. Après trois checkpoints à soupçonner les
variables d'environnement Redis (et l'utilisatrice ayant confirmé via
capture d'écran qu'elles étaient bien présentes, bien nommées, scope
"Production and Preview"), la vraie cause a été trouvée grâce à
`vercel logs` (l'utilisatrice avait déjà la CLI Vercel liée depuis le
setup initial — lui faire lancer `vercel logs pera-pera-eight.vercel.app`
puis réessayer l'action dans l'app a donné le vrai message, invisible
via `curl` qui ne recevait qu'une page générique
`FUNCTION_INVOCATION_FAILED` sans détail) :

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/api/_redis'
imported from /var/task/api/backup.js
```

**Cause : import relatif sans extension.** `backup.ts`/`restore.ts`/
`delete-account.ts` faisaient `import { redis } from './_redis'` (sans
`.js`). Ça compile et fonctionne très bien avec Vite (bundler côté
front, résout les extensions tout seul) mais le runtime Node ESM de
Vercel pour `/api/*` n'est PAS bundlé de la même façon : Node exige
l'extension explicite sur un import relatif en ESM natif. Sans elle, le
module plantait au chargement — avant même la première ligne de
`handler()` — ce qui explique pourquoi ÇA CRASHAIT MÊME SUR UNE REQUÊTE
QUI NE TOUCHE JAMAIS REDIS (testé avec un body `{}` : devrait renvoyer
un 400 "Nom de profil manquant" avant tout appel Redis, plantait quand
même) — la preuve qui aurait dû orienter plus tôt vers un problème de
chargement de module plutôt que de config Redis. Tous les checkpoints
précédents sur `redisConfigured`/try-catch (voir plus haut) étaient donc
inutiles pour CE bug précis (ils ne pouvaient pas s'exécuter, le module
ne chargeait jamais) — gardés quand même, ils restent utiles pour de
vrais futurs problèmes Redis (credentials invalides, service
injoignable...).

**Fix** : `./_redis'` → `./_redis.js'` dans les trois fichiers (le
`.js` pointe vers le FICHIER COMPILÉ, pas le fichier source — `.ts`
aurait été faux ; `moduleResolution: "bundler"` dans
`tsconfig.api.json` accepte cette convention et résout `.js` vers le
`.ts` source correspondant pour la vérification de types). Un piège
TypeScript+ESM classique, pas spécifique à ce projet — à garder en tête
pour tout futur fichier ajouté sous `/api` avec un import relatif vers
un autre fichier du dossier.

**Vérifié en production, bout en bout** (`curl` direct, pas juste en
local) : sauvegarde d'un profil de test → `{"ok":true}` (200) ;
récupération du même profil → payload renvoyé correctement (200) ;
suppression via `delete-account` → `{"hadBackup":true}` (200,
nettoyage du profil de test, rien ne traîne dans Redis). Les trois
endpoints fonctionnent réellement maintenant. Sujet clos.

Effets de bord découverts en cours de route (corrigés, pas commités —
c'était du bruit non lié) : `git status` montrait `package.json`/
`package-lock.json` modifiés avec des montées de version majeures
inattendues (`@vercel/node` 3→5, `vite` 5→8) et un fichier vide nommé
littéralement `{` — origine non identifiée (pas une action volontaire
de cette session), les deux `git restore`/supprimés avant de committer
pour ne pousser que le vrai fix.

## Checkpoint — gros lot : Explorer, Séance, Mot du jour, Objectif, code PIN

Sept demandes traitées d'un coup (liste donnée par l'utilisatrice avant
de pousser le fix Redis).

**Explorer — scroll au dépliage.** Ouvrir une carte pouvait retomber
n'importe où dans la mise en page à cause du déplacement de contenu
(fermeture de l'ancien panneau, ouverture du nouveau) — l'utilisatrice
se retrouvait en bas de la fiche plutôt qu'en haut. Nouveau
`rowRefs` (Map id→élément `<li>`) + `useEffect` sur `[expandedId]` qui
appelle `scrollIntoView({block:'start', behavior:'smooth'})` sur la
ligne concernée. Vérifié en navigateur : `behavior:'instant'` positionne
bien la ligne pile en haut (`rowTop: 1`) — `smooth` ne s'anime pas
jusqu'au bout dans CE pane de test (même limitation de compositing déjà
notée pour le flip-card plus haut dans ce fichier), sans rapport avec un
vrai navigateur.

**Explorer — polices encore réduites.** `.explorer-detail__readings
.flip-card__label`/`.flip-card__reading-value` (On'yomi/Kun'yomi/
Radical/Traits) réduits à 11px/15px sous `@media (max-width: 600px)`
(étaient à 13px/19px, hérités de SessionCard.css, pensés pour la carte
plein écran). Vérifié : 11px/15px appliqués sur mobile.

**Explorer — mots fréquents et liens profonds ouvrent directement la
fiche.** `pendingAutoExpandRef` (ref, pas state) posé par `openExample`
et par un effet au montage sur `initialQuery` ; consommé par un effet
sur `[results]` qui déplie automatiquement la première correspondance
dès qu'elle apparaît. Unifie deux entrées (clic sur un mot fréquent
dans Explorer, arrivée depuis "Voir la fiche" du mot du jour) sous le
même mécanisme plutôt que de le dupliquer.

**Séance — mode "Mélange" maintenant aléatoire.** `KanjiCardLoop`/
`VocabCardLoop`/`GrammarCardLoop` : nouveau `src/utils/shuffle.ts`
(`shuffleArray`, extrait de `buildRevisionPool.ts` qui avait déjà sa
propre copie locale — factorisé). Le mode 'mix' pioche maintenant dans
`shuffledLevel` (mémoïsé sur `level` SEUL, jamais sur `masteredIds`) au
lieu de l'ordre du dataset ; le mode 'new' n'y touche jamais et reste
calculé frais à chaque rendu (toujours à jour vis-à-vis de
`masteredIds` — piège évité : mémoïser le retour de la fonction
elle-même selon le mode aurait figé 'new' sur une valeur périmée).
Vérifié : deux séances N4 Kanjis "Mélange" démarrées à la suite → 冬
puis 私 en première carte (l'ordre naturel du dataset N4 commence par
悪, aucune des deux ne correspond).

**Séance — "Révisions" avec un niveau : PAS un bug.** Testé en direct :
avec du contenu maîtrisé au niveau choisi (N5, 100 kanjis marqués via
Réglages), la révision affiche bien une carte. Avec un niveau sans
aucun contenu maîtrisé (N1), l'app affiche clairement "Rien à réviser à
ce niveau" avec une explication — pas un écran vide. Le comportement
demandé ("mettre tous les kanjis/vocs/grammaire maîtrisés du niveau en
question") est déjà exactement ce que fait `buildRevisionPool.ts`.
Conclusion communiquée à l'utilisatrice plutôt qu'un correctif inventé :
"rien ne s'affiche" venait très probablement d'un niveau sans contenu
encore maîtrisé, pas d'un bug.

**Séance recommandée "toujours la même" : expliqué, pas modifié.** Le
mode 'new' (utilisé par la séance recommandée) prend les N premiers
éléments PAS ENCORE maîtrisés dans l'ordre du dataset — déterministe
par design (un vrai programme à suivre dans l'ordre, pas un tirage).
Si on quitte une séance sans trancher "Maîtrisé"/"À revoir" sur les 5
kanjis proposés, rien n'est enregistré → la prochaine visite propose
exactement les 5 mêmes. Explication donnée à l'utilisatrice, aucun
changement de code (pas clair depuis la question posée si un
changement de comportement était réellement voulu).

**Mot du jour → fiche spécifique.** `Dashboard.tsx` "Voir la fiche" :
`navigate('/explorer')` → `navigate('/explorer', { state: { query:
wordOfDay.word } })`, combiné au dépliage automatique ci-dessus.
Vérifié : clique sur "Voir la fiche" pour 学期 → Explorer s'ouvre avec
la recherche pré-remplie ET la fiche déjà dépliée (exemples visibles
immédiatement, plus besoin de re-cliquer).

**Objectif personnalisable.** Nouvelle table Dexie `profileSettings`
(v5 du schéma, clé primaire `profileId`, une ligne par profil) —
`src/db/settings.ts` : `getKanjiGoal`/`setKanjiGoal` (défaut 500,
`DEFAULT_KANJI_GOAL`) et `getHasCloudBackup`/`setHasCloudBackup` (voir
plus bas). Remplace l'ancien `mockGoal` (`mockDashboard.ts`, retiré) —
le libellé "Maîtriser N kanjis" est maintenant construit dynamiquement
depuis la vraie valeur au lieu d'un texte figé. Nouvelle section
"Objectif" dans Settings (`<input type="number">` + bouton
Enregistrer). Vérifié : objectif changé à 250 dans Réglages → Dashboard
affiche bien "101 / 250" et "Maîtriser 250 kanjis" derrière.

**Code déjà enregistré → plus de re-proposition.** `hasCloudBackup`
(nouveau champ `profileSettings`, mis à `true` juste après un
`backupProfile()` réussi dans `handleBackup` de Settings.tsx) : (1) la
bannière Dashboard ne s'affiche plus automatiquement une fois vrai (en
plus du dismiss manuel existant) ; (2) la section "Retrouver mon profil"
de Settings remplace le champ de code + bouton par un message "Code
déjà enregistré pour {profil}." — plus moyen d'en recréer un par
erreur. Suivi localement (pas d'appel serveur pour vérifier), cohérent
avec le fait que ce n'est de toute façon pas une vraie sécurité (déjà
noté plus haut). Vérifié en navigateur (flag posé directement en base
pour simuler un backup réussi, `backupProfile` réel inatteignable en
dev local) : bannière absente au rechargement, Settings affiche bien le
message "déjà enregistré".

`npx tsc -b` et `npx tsc -p tsconfig.api.json` clean. Pas encore
commité/poussé au moment d'écrire ceci.

## Checkpoint — RÉSOLU : "je me retrouve sur le profil d'un autre" au rafraîchissement

Signalement grave ("le site n'est pas du tout utilisable tel quel") :
active sur le profil Clara, un rafraîchissement de page ramenait sur
Alex ou "un profil aléatoire". Vérifié qu'aucun code applicatif ne
choisit jamais un profil tout seul — `ProfileSelector.tsx` exige
toujours un clic explicite (`handleSelect`), `useProfileStore`
(`profileStore.ts`) n'a pas de middleware `persist`, `App.tsx` ne fait
aucune redirection basée sur un profil "mémorisé". La vraie cause est
côté navigateur, pas côté app : le **bfcache** (back-forward cache) de
Safari iOS notamment peut RESTAURER une page depuis un instantané gelé
de son état JS (au lieu de vraiment la recharger) au retour sur l'onglet
— y compris le store Zustand du profil actif, volontairement en mémoire
seulement (voir plus haut : "redemander qui apprend à chaque ouverture
est un choix produit assumé"). Un instantané gelé pris à un moment où
Alex était encore le profil actif (avant sa suppression) explique
exactement le symptôme, et "aléatoire" correspond à quel instantané
précis le navigateur choisit de restaurer selon les cas.

**Fix (`src/main.tsx`)** : écouteur `pageshow` détectant
`event.persisted === true` (signature d'une restauration bfcache, par
opposition à un vrai chargement) → `window.location.reload()` forcé,
qui repart d'un état JS entièrement frais (store réinitialisé,
`activeProfileId: null`). **Défense en profondeur (`vercel.json`)** :
en-tête `Cache-Control: no-store` ajouté sur toutes les routes SAUF
`/assets/*` (bundles Vite au nom haché, immuables, doivent rester
cachables) — dissuade la formation du bfcache en amont plutôt que de
seulement s'en remettre après coup. Root-cause plutôt que rustine
ciblée : cette classe de bug touche potentiellement TOUT état en
mémoire (pas seulement le profil), donc ce correctif couvre l'ensemble
de la catégorie, pas juste le symptôme signalé. **Non vérifiable dans ce
pane de test** (comportement de bfcache propre au vrai navigateur/OS,
pas reproductible dans un environnement de test automatisé) — technique
standard et bien établie pour cette classe de bug (`pageshow`/
`persisted` est l'API web dédiée exactement à ce cas), mais à confirmer
avec l'utilisatrice une fois déployé.

**Alex/Camille toujours visibles sur certains appareils — clarifié, pas
un bug.** Confirmé (déjà expliqué une fois, reclarifié suite à
incompréhension) : profils et données sont 100% locaux par appareil
(IndexedDB), il n'existe aucune liste de profils partagée entre
appareils/utilisateurs. Supprimer Alex/Camille sur UN appareil ne les
retire pas des AUTRES appareils où ils existent déjà localement — il
n'y a aucun mécanisme pour "supprimer à distance" depuis un autre
appareil (contradictoire avec l'architecture 100% locale actuelle).
Le seed automatique étant déjà retiré (checkpoint précédent), c'est un
nettoyage ponctuel : sur CHAQUE appareil qui les affiche encore, il faut
répéter Réglages → "Supprimer ce profil" une fois — ensuite, plus aucun
appareil (neuf ou déjà utilisé) ne les fera réapparaître.

`npx tsc -b` clean. Pas encore commité/poussé.

## Checkpoint — précision bfcache + retrait du lien "Entraînement libre"

**Précision sur le bug de rafraîchissement** : touchait aussi le PC, pas
seulement mobile — cohérent avec le correctif déjà posé (`pageshow`/
`event.persisted` est une API standard, le bfcache existe sur desktop
Chrome/Firefox/Safari aussi, pas seulement Safari iOS ; rien à changer
au fix lui-même, juste une confirmation que le diagnostic bfcache était
le bon axe, pas spécifique à une plateforme).

**Retrait de "Envie de t'entraîner librement ?"** — menait vers
`/training`, un simple écran statique (`TrainingPlaceholder.tsx`,
aucune fonctionnalité réelle derrière, juste un texte de présentation
via le composant partagé `FullScreenFlow`). Supprimés : le bouton dans
`Dashboard.tsx`, la route `/training` et son import dans `App.tsx`, le
fichier `TrainingPlaceholder.tsx` (dossier `src/features/training/`
entièrement vide, retiré aussi), et la classe CSS
`.dashboard__training-link` devenue orpheline. `FullScreenFlow.tsx`
(composant UI générique partagé) gardé tel quel — pas spécifique à
l'entraînement, réutilisable pour un futur écran de ce type.

`npx tsc -b` clean.

## Checkpoint — Alex/Camille retirés du code source (pas juste du seed)

Suite au retrait du seed automatique (checkpoint précédent), demande de
vérifier qu'il n'en reste aucune trace "à la base". Recherche exhaustive
(`Alex|Camille`) dans tout le dépôt : trouvé un reliquat réel —
`src/features/profile/mockProfiles.ts` gardait encore un tableau
`mockProfiles` (`{id:'p1', name:'Alex', ...}`/`{id:'p2', name:'Camille',
...}`) hérité de la toute première phase mock de l'app, jamais nettoyé.
Vérifié qu'il n'était plus importé nulle part (seul `avatarGradients`,
exporté par le même fichier, est réellement utilisé — par
`MainLayout.tsx` et `ProfileSelector.tsx`) : du code mort, mais du code
mort qui contenait encore leurs noms en dur. Supprimés : le tableau
`mockProfiles` et l'interface `MockProfile` désormais inutilisée ; le
fichier ne contient plus que `avatarGradients` (palette de dégradés,
sans rapport avec des profils précis).

Seules traces restantes dans tout le dépôt (recherche confirmée) : deux
commentaires explicatifs (`main.tsx`, `src/db/profiles.ts`) qui
documentent POURQUOI le seed a été retiré — de la documentation
historique, pas du code actif. Aucune fonction, aucun tableau, aucune
route ne peut plus créer ni référencer Alex/Camille, nulle part dans le
code.

`npx tsc -b` clean. Pas encore commité/poussé.

## Checkpoint — fix scroll desktop (caché sous la barre fixe), favoris ajoutés au backup

**Explorer desktop : le kanji restait caché sous la barre de navigation
fixe.** Signalé : après avoir déplié une carte, on arrivait "en haut"
mais sans le kanji/la traduction, juste au niveau des lectures. Cause :
sur desktop, `.tab-bar` est fixée EN HAUT (`MainLayout.css`, 56px,
`@media (min-width:780px)`) — `scrollIntoView({block:'start'})` (voir
checkpoint précédent) alignait bien la ligne sur y=0 de la fenêtre, mais
cette bande fixe la recouvrait visuellement par-dessus, cachant le
kanji/la traduction (tout en haut de la ligne) ; seule la partie
"lectures" du détail, plus bas, restait visible sous la barre. Fixé avec
`scroll-margin-top: 72px` sur `.explorer-item`, scopé à
`@media (min-width: 780px)` (mobile a sa barre en BAS, aucune
compensation nécessaire là) — propriété faite pour exactement ce cas,
respectée nativement par `scrollIntoView`. Vérifié en navigateur
(desktop, `behavior:'instant'` pour contourner le souci de compositing
de ce pane déjà noté) : le kanji est maintenant à `headlineTop: 85`,
nettement sous les 56px de la barre fixe.

**Favoris ajoutés au payload de sauvegarde/récupération.** En
investiguant le signalement "mes kanjis maîtrisés n'ont pas été
récupérés" (voir plus bas), remarqué que `ProfileBackupPayload`
(`profileSync.ts`) n'incluait que mastery/activity/notes — les favoris
n'ont jamais fait partie de ce qui est sauvegardé/récupéré, alors que
c'est une vraie donnée de profil au même titre. Ajouté : export +
import de `favorites`, avec repli `payload.favorites ?? []` côté import
pour rester compatible avec une sauvegarde plus ancienne (créée avant
cet ajout) qui n'aurait pas ce champ.

**"Mes kanjis maîtrisés n'ont pas été récupérés" — code vérifié
correct, cause probablement le calendrier, pas un bug trouvé.**
Relu `exportProfileData`/`importProfileData` (`profileSync.ts`) et
`handleRestore` (`ProfileSelector.tsx`) en détail : la logique est
correcte — `exportProfileData` capture bien TOUTE la table `mastery` du
profil, `importProfileData` l'écrit bien intégralement sous le nouvel id
local. Le test de bout en bout fait juste après le fix de l'import ESM
(checkpoint précédent : backup → restore → delete-account, tous 200,
payload conforme) confirme que le mécanisme fonctionne quand il tourne
sur le code actuel. Hypothèse la plus probable communiquée à
l'utilisatrice (pas un correctif inventé faute de bug identifié dans le
code) : la tentative de sauvegarde/récupération a probablement eu lieu
AVANT le fix de l'import ESM (`./_redis` → `./_redis.js`) qui faisait
planter `/api/backup` avant même d'écrire quoi que ce soit côté serveur
— ou alors une sauvegarde plus récente mais plus pauvre (depuis un autre
appareil) a écrasé une sauvegarde antérieure plus complète, puisqu'une
sauvegarde REMPLACE entièrement l'enregistrement existant sous ce nom
(pas de fusion, voir `api/backup.ts`). Recommandation donnée :
resauvegarder maintenant depuis l'appareil qui a réellement la
progression à jour, puis récupérer sur l'autre.

`npx tsc -b` et `npx tsc -p tsconfig.api.json` clean. Pas encore
commité/poussé.
