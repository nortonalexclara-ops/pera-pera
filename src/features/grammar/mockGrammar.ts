import type { JlptLevel } from '../kanji/mockKanji'
import type { FuriganaSegment } from '../../components/ui/FuriganaText'

export interface GrammarExample {
  segments: FuriganaSegment[]
  translation: string
}

export interface GrammarPoint {
  id: string
  pattern: string
  // Segments (texte + lecture) du motif, pour l'affichage avec furigana
  // (voir GrammarCardLoop.tsx/buildTest.ts) — absent quand le motif ne
  // contient aucun kanji (rien à décomposer, `pattern` seul suffit).
  patternSegments?: FuriganaSegment[]
  jlptLevel: JlptLevel
  meaning: string
  // La formation du point de grammaire (ex. "verbe en て + ください").
  rule: string
  // Quand et pourquoi on l'utilise, pas juste comment le former.
  usage: string
  examples: GrammarExample[]
}

export const mockGrammarList: GrammarPoint[] = [
  {
    id: 'te-kudasai',
    pattern: '〜てください',
    jlptLevel: 'N5',
    meaning: 'Veuillez faire ~ / faites ~, s’il vous plaît',
    rule: 'Verbe (forme て) + ください',
    usage: "Pour demander poliment à quelqu'un de faire quelque chose.",
    examples: [
      {
        segments: [
          { text: 'ここに' },
          { text: '名前', reading: 'なまえ' },
          { text: 'を' },
          { text: '書', reading: 'か' },
          { text: 'いてください。', highlight: true },
        ],
        translation: 'Veuillez écrire votre nom ici.',
      },
      {
        segments: [{ text: 'ちょっと' }, { text: '待', reading: 'ま' }, { text: 'ってください。', highlight: true }],
        translation: 'Veuillez attendre un instant.',
      },
    ],
  },
  {
    id: 'naide-kudasai',
    pattern: '〜ないでください',
    jlptLevel: 'N5',
    meaning: 'Veuillez ne pas faire ~',
    rule: 'Verbe (forme ない) + でください',
    usage: 'Pour demander poliment à quelqu’un de NE PAS faire quelque chose.',
    examples: [
      {
        segments: [
          { text: 'ここで' },
          { text: '写真', reading: 'しゃしん' },
          { text: 'を' },
          { text: '撮', reading: 'と' },
          { text: 'らないでください。', highlight: true },
        ],
        translation: 'Veuillez ne pas prendre de photos ici.',
      },
      {
        segments: [{ text: '心配', reading: 'しんぱい' }, { text: 'しないでください。', highlight: true }],
        translation: "Ne vous inquiétez pas.",
      },
    ],
  },
  {
    id: 'tai-desu',
    pattern: '〜たいです',
    jlptLevel: 'N5',
    meaning: 'Vouloir faire ~',
    rule: 'Verbe (base ます, sans le ます) + たいです',
    usage: 'Pour exprimer un souhait — ce que la personne qui parle veut faire elle-même.',
    examples: [
      {
        segments: [
          { text: '日本', reading: 'にほん' },
          { text: 'に' },
          { text: '行', reading: 'い' },
          { text: 'きたいです。', highlight: true },
        ],
        translation: 'Je veux aller au Japon.',
      },
      {
        segments: [{ text: '何', reading: 'なに' }, { text: 'か' }, { text: '食', reading: 'た' }, { text: 'べたいです。', highlight: true }],
        translation: 'Je veux manger quelque chose.',
      },
    ],
  },
  {
    id: 'koto-ga-dekimasu',
    pattern: '〜ことができます',
    jlptLevel: 'N5',
    meaning: 'Pouvoir faire ~ (capacité)',
    rule: 'Verbe (forme dictionnaire) + ことができます',
    usage: "Pour exprimer une capacité — ce que quelqu'un est capable de faire.",
    examples: [
      {
        segments: [
          { text: '私', reading: 'わたし' },
          { text: 'は' },
          { text: '漢字', reading: 'かんじ' },
          { text: 'を' },
          { text: '読', reading: 'よ' },
          { text: 'むことができます。', highlight: true },
        ],
        translation: 'Je suis capable de lire des kanjis.',
      },
      {
        segments: [{ text: '泳', reading: 'およ' }, { text: 'ぐことができますか。', highlight: true }],
        translation: 'Est-ce que tu sais nager ?',
      },
    ],
  },
  {
    id: 'mae-ni',
    pattern: '〜前に',
    patternSegments: [
      { text: '〜' },
      { text: '前', reading: 'まえ' },
      { text: 'に' },
    ],
    jlptLevel: 'N5',
    meaning: 'Avant de ~',
    rule: 'Verbe (forme dictionnaire) + 前に, ou Nom + の前に',
    usage: "Pour indiquer qu'une action se passe avant une autre.",
    examples: [
      {
        segments: [
          { text: '寝', reading: 'ね' },
          { text: 'る', highlight: true },
          { text: '前', reading: 'まえ', highlight: true },
          { text: 'に', highlight: true },
          { text: '歯', reading: 'は' },
          { text: 'を' },
          { text: '磨', reading: 'みが' },
          { text: 'きます。' },
        ],
        translation: 'Je me brosse les dents avant de dormir.',
      },
      {
        segments: [
          { text: '食事', reading: 'しょくじ' },
          { text: 'の', highlight: true },
          { text: '前', reading: 'まえ', highlight: true },
          { text: 'に', highlight: true },
          { text: '手', reading: 'て' },
          { text: 'を' },
          { text: '洗', reading: 'あら' },
          { text: 'います。' },
        ],
        translation: 'Je me lave les mains avant le repas.',
      },
    ],
  },
  {
    id: 'mashouka',
    pattern: '〜ましょうか',
    jlptLevel: 'N4',
    meaning: 'On fait ~ ? / Je fais ~ pour toi ?',
    rule: 'Verbe (base ます) + ましょうか',
    usage: 'Pour proposer de faire quelque chose ensemble, ou proposer son aide.',
    examples: [
      {
        segments: [
          { text: '一緒', reading: 'いっしょ' },
          { text: 'に' },
          { text: '行', reading: 'い' },
          { text: 'きましょうか。', highlight: true },
        ],
        translation: 'On y va ensemble ?',
      },
      {
        segments: [
          { text: '荷物', reading: 'にもつ' },
          { text: 'を' },
          { text: '持', reading: 'も' },
          { text: 'ちましょうか。', highlight: true },
        ],
        translation: 'Je porte vos bagages ?',
      },
    ],
  },
  {
    id: 'te-shimau',
    pattern: '〜てしまう',
    jlptLevel: 'N3',
    meaning: 'Finir par faire ~ (souvent avec regret)',
    rule: 'Verbe (forme て) + しまう',
    usage: "Pour exprimer qu'une action est complètement terminée, souvent avec une nuance de regret ou d'involontaire.",
    examples: [
      {
        segments: [
          { text: '宿題', reading: 'しゅくだい' },
          { text: 'を' },
          { text: '忘', reading: 'わす' },
          { text: 'れてしまいました。', highlight: true },
        ],
        translation: "J'ai complètement oublié les devoirs.",
      },
      {
        segments: [
          { text: '全部', reading: 'ぜんぶ' },
          { text: '食', reading: 'た' },
          { text: 'べてしまいました。', highlight: true },
        ],
        translation: "J'ai tout mangé, jusqu'au bout.",
      },
    ],
  },
  {
    id: 'wake-dewa-nai',
    pattern: '〜わけではない',
    jlptLevel: 'N2',
    meaning: 'Ce n’est pas que ~ / ça ne veut pas dire que ~',
    rule: 'Verbe/adjectif (forme neutre) ou Nom + という + わけではない',
    usage: "Pour nuancer une affirmation — dire que ce n'est pas exactement ou entièrement le cas, sans le nier complètement.",
    examples: [
      {
        segments: [
          { text: '嫌', reading: 'きら' },
          { text: 'いな' },
          { text: 'わけではないです。', highlight: true },
        ],
        translation: 'Ce n’est pas que je déteste ça.',
      },
      {
        segments: [
          { text: '忙', reading: 'いそが' },
          { text: 'しい' },
          { text: 'わけではないですが、', highlight: true },
          { text: '時間', reading: 'じかん' },
          { text: 'がないです。' },
        ],
        translation: 'Ce n’est pas que je sois occupé(e), mais je n’ai pas le temps.',
      },
    ],
  },
  {
    id: 'ni-hokanaranai',
    pattern: '〜にほかならない',
    jlptLevel: 'N1',
    meaning: "N'est rien d'autre que ~",
    rule: 'Nom + にほかならない',
    usage: "Pour affirmer catégoriquement que quelque chose est précisément une chose et rien d'autre — registre soutenu, surtout à l'écrit.",
    examples: [
      {
        segments: [
          { text: 'これは' },
          { text: '努力', reading: 'どりょく' },
          { text: 'の' },
          { text: '結果', reading: 'けっか' },
          { text: 'にほかならない。', highlight: true },
        ],
        translation: "Ceci n'est rien d'autre que le résultat des efforts.",
      },
      {
        segments: [
          { text: '彼', reading: 'かれ' },
          { text: 'の' },
          { text: '成功', reading: 'せいこう' },
          { text: 'は' },
          { text: '運', reading: 'うん' },
          { text: 'にほかならない。', highlight: true },
        ],
        translation: "Son succès n'est rien d'autre que de la chance.",
      },
    ],
  },
  {
    id: "wa-topic",
    pattern: "〜は〜です",
    jlptLevel: "N5",
    meaning: "Quant à ~, c’est ~ (marqueur de thème)",
    rule: "Nom + は + prédicat (nom/adjectif + です)",
    usage: "Pour introduire le thème dont on parle, puis dire quelque chose à son sujet.",
    examples: [
      {
        segments: [
          {
            text: "私",
            reading: "わたし",
          },
          {
            text: "は",
            highlight: true,
          },
          {
            text: "学生",
            reading: "がくせい",
          },
          {
            text: "です。",
          },
        ],
        translation: "Moi, je suis étudiant.",
      },
      {
        segments: [
          {
            text: "これ",
          },
          {
            text: "は",
            highlight: true,
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "です。",
          },
        ],
        translation: "Ceci, c’est un livre.",
      },
    ],
  },
  {
    id: "mo-also",
    pattern: "〜も",
    jlptLevel: "N5",
    meaning: "Aussi, également",
    rule: "Nom + も (remplace は ou を/が)",
    usage: "Pour ajouter un élément similaire à ce qui vient d’être dit.",
    examples: [
      {
        segments: [
          {
            text: "私",
            reading: "わたし",
          },
          {
            text: "も",
            highlight: true,
          },
          {
            text: "学生",
            reading: "がくせい",
          },
          {
            text: "です。",
          },
        ],
        translation: "Moi aussi, je suis étudiant.",
      },
      {
        segments: [
          {
            text: "コーヒー",
          },
          {
            text: "も",
            highlight: true,
          },
          {
            text: "紅茶",
            reading: "こうちゃ",
          },
          {
            text: "も",
          },
          {
            text: "好",
            reading: "す",
          },
          {
            text: "きです。",
          },
        ],
        translation: "J’aime le café et le thé aussi.",
      },
    ],
  },
  {
    id: "ga-subject",
    pattern: "〜が",
    jlptLevel: "N5",
    meaning: "Marqueur du sujet",
    rule: "Nom + が + verbe/adjectif",
    usage: "Pour marquer le sujet grammatical, souvent une information nouvelle ou après un mot interrogatif.",
    examples: [
      {
        segments: [
          {
            text: "猫",
            reading: "ねこ",
          },
          {
            text: "が",
            highlight: true,
          },
          {
            text: "います。",
          },
        ],
        translation: "Il y a un chat.",
      },
      {
        segments: [
          {
            text: "誰",
            reading: "だれ",
          },
          {
            text: "が",
            highlight: true,
          },
          {
            text: "来",
            reading: "き",
          },
          {
            text: "ましたか。",
          },
        ],
        translation: "Qui est venu ?",
      },
    ],
  },
  {
    id: "wo-object",
    pattern: "〜を",
    jlptLevel: "N5",
    meaning: "Marqueur du complément d’objet direct",
    rule: "Nom + を + verbe transitif",
    usage: "Pour marquer ce sur quoi porte directement l’action du verbe.",
    examples: [
      {
        segments: [
          {
            text: "パン",
          },
          {
            text: "を",
            highlight: true,
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べます。",
          },
        ],
        translation: "Je mange du pain.",
      },
      {
        segments: [
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "を",
            highlight: true,
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "みます。",
          },
        ],
        translation: "Je lis un livre.",
      },
    ],
  },
  {
    id: "ni-location",
    pattern: "〜に (existence)",
    jlptLevel: "N5",
    meaning: "À, dans, sur (lieu d’existence)",
    rule: "Lieu + に + あります/います",
    usage: "Pour indiquer où se trouve quelque chose ou quelqu’un.",
    examples: [
      {
        segments: [
          {
            text: "机",
            reading: "つくえ",
          },
          {
            text: "の",
          },
          {
            text: "上",
            reading: "うえ",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "があります。",
          },
        ],
        translation: "Il y a un livre sur le bureau.",
      },
      {
        segments: [
          {
            text: "公園",
            reading: "こうえん",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "がいます。",
          },
        ],
        translation: "Il y a des enfants dans le parc.",
      },
    ],
  },
  {
    id: "de-location",
    pattern: "〜で (lieu de l’action)",
    jlptLevel: "N5",
    meaning: "À, dans (lieu où se déroule une action)",
    rule: "Lieu + で + verbe d’action",
    usage: "Pour indiquer où se déroule une action (à distinguer de に, qui marque le lieu d’existence).",
    examples: [
      {
        segments: [
          {
            text: "図書館",
            reading: "としょかん",
          },
          {
            text: "で",
            highlight: true,
          },
          {
            text: "勉強",
            reading: "べんきょう",
          },
          {
            text: "します。",
          },
        ],
        translation: "J’étudie à la bibliothèque.",
      },
      {
        segments: [
          {
            text: "レストラン",
          },
          {
            text: "で",
            highlight: true,
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べます。",
          },
        ],
        translation: "Je mange au restaurant.",
      },
    ],
  },
  {
    id: "e-direction",
    pattern: "〜へ",
    jlptLevel: "N5",
    meaning: "Vers, en direction de",
    rule: "Lieu + へ + verbe de déplacement",
    usage: "Pour indiquer la direction d’un déplacement (souvent interchangeable avec に dans ce cas).",
    examples: [
      {
        segments: [
          {
            text: "学校",
            reading: "がっこう",
          },
          {
            text: "へ",
            highlight: true,
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "きます。",
          },
        ],
        translation: "Je vais à l’école.",
      },
      {
        segments: [
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "へ",
            highlight: true,
          },
          {
            text: "来",
            reading: "き",
          },
          {
            text: "ました。",
          },
        ],
        translation: "Je suis venu au Japon.",
      },
    ],
  },
  {
    id: "to-and",
    pattern: "〜と",
    jlptLevel: "N5",
    meaning: "Et, avec",
    rule: "Nom + と + Nom, ou Nom + と + verbe (compagnie)",
    usage: "Pour lister des noms de façon exhaustive, ou indiquer avec qui on fait une action.",
    examples: [
      {
        segments: [
          {
            text: "犬",
            reading: "いぬ",
          },
          {
            text: "と",
            highlight: true,
          },
          {
            text: "猫",
            reading: "ねこ",
          },
          {
            text: "がいます。",
          },
        ],
        translation: "Il y a un chien et un chat.",
      },
      {
        segments: [
          {
            text: "友達",
            reading: "ともだち",
          },
          {
            text: "と",
            highlight: true,
          },
          {
            text: "映画",
            reading: "えいが",
          },
          {
            text: "を",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "ます。",
          },
        ],
        translation: "Je regarde un film avec un ami.",
      },
    ],
  },
  {
    id: "kara-made",
    pattern: "〜から〜まで",
    jlptLevel: "N5",
    meaning: "De ~ à ~",
    rule: "Nom(temps/lieu) + から + Nom(temps/lieu) + まで",
    usage: "Pour indiquer un point de départ et un point d’arrivée, dans le temps ou l’espace.",
    examples: [
      {
        segments: [
          {
            text: "九時",
            reading: "くじ",
          },
          {
            text: "から",
            highlight: true,
          },
          {
            text: "五時",
            reading: "ごじ",
          },
          {
            text: "まで",
            highlight: true,
          },
          {
            text: "働",
            reading: "はたら",
          },
          {
            text: "きます。",
          },
        ],
        translation: "Je travaille de 9h à 17h.",
      },
      {
        segments: [
          {
            text: "東京",
            reading: "とうきょう",
          },
          {
            text: "から",
            highlight: true,
          },
          {
            text: "大阪",
            reading: "おおさか",
          },
          {
            text: "まで",
            highlight: true,
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "きます。",
          },
        ],
        translation: "Je vais de Tokyo à Osaka.",
      },
    ],
  },
  {
    id: "ya-nado",
    pattern: "〜や〜など",
    jlptLevel: "N5",
    meaning: "Et, entre autres (liste non exhaustive)",
    rule: "Nom + や + Nom + など",
    usage: "Pour donner des exemples parmi d’autres, sans faire une liste complète (contrairement à と).",
    examples: [
      {
        segments: [
          {
            text: "机",
            reading: "つくえ",
          },
          {
            text: "や",
            highlight: true,
          },
          {
            text: "椅子",
            reading: "いす",
          },
          {
            text: "など",
            highlight: true,
          },
          {
            text: "があります。",
          },
        ],
        translation: "Il y a un bureau, une chaise, et d’autres choses.",
      },
      {
        segments: [
          {
            text: "りんご",
          },
          {
            text: "や",
            highlight: true,
          },
          {
            text: "バナナ",
          },
          {
            text: "など",
            highlight: true,
          },
          {
            text: "を",
          },
          {
            text: "買",
            reading: "か",
          },
          {
            text: "いました。",
          },
        ],
        translation: "J’ai acheté des pommes, des bananes, entre autres.",
      },
    ],
  },
  {
    id: "dake",
    pattern: "〜だけ",
    jlptLevel: "N5",
    meaning: "Seulement, juste",
    rule: "Nom/Verbe/Adjectif + だけ",
    usage: "Pour limiter une affirmation à un seul élément, sans nuance particulière.",
    examples: [
      {
        segments: [
          {
            text: "一人",
            reading: "ひとり",
          },
          {
            text: "だけ",
            highlight: true,
          },
          {
            text: "来",
            reading: "き",
          },
          {
            text: "ました。",
          },
        ],
        translation: "Une seule personne est venue.",
      },
      {
        segments: [
          {
            text: "少",
            reading: "すこ",
          },
          {
            text: "し",
          },
          {
            text: "だけ",
            highlight: true,
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べました。",
          },
        ],
        translation: "J’en ai mangé juste un peu.",
      },
    ],
  },
  {
    id: "shika-nai",
    pattern: "〜しか〜ない",
    jlptLevel: "N5",
    meaning: "Seulement, rien que (avec nuance de manque)",
    rule: "Nom + しか + verbe/adjectif à la forme négative",
    usage: "Comme だけ mais avec une nuance de « ce n’est pas assez » — toujours suivi d’une forme négative.",
    examples: [
      {
        segments: [
          {
            text: "千円",
            reading: "せんえん",
          },
          {
            text: "しか",
            highlight: true,
          },
          {
            text: "ありません。",
          },
        ],
        translation: "Je n’ai que mille yens (et c’est peu).",
      },
      {
        segments: [
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "しか",
            highlight: true,
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "せません。",
          },
        ],
        translation: "Je ne parle que japonais.",
      },
    ],
  },
  {
    id: "ne-particle",
    pattern: "〜ね",
    jlptLevel: "N5",
    meaning: "N’est-ce pas ? (recherche d’accord)",
    rule: "Phrase + ね",
    usage: "Pour chercher l’accord ou la confirmation de l’interlocuteur, ou partager une impression.",
    examples: [
      {
        segments: [
          {
            text: "今日",
            reading: "きょう",
          },
          {
            text: "は",
          },
          {
            text: "暑",
            reading: "あつ",
          },
          {
            text: "いです",
          },
          {
            text: "ね。",
            highlight: true,
          },
        ],
        translation: "Il fait chaud aujourd’hui, hein.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "映画",
            reading: "えいが",
          },
          {
            text: "は",
          },
          {
            text: "面白",
            reading: "おもしろ",
          },
          {
            text: "かったです",
          },
          {
            text: "ね。",
            highlight: true,
          },
        ],
        translation: "Ce film était intéressant, n’est-ce pas.",
      },
    ],
  },
  {
    id: "yo-particle",
    pattern: "〜よ",
    jlptLevel: "N5",
    meaning: "Je t’informe que ~ (assertion)",
    rule: "Phrase + よ",
    usage: "Pour informer l’interlocuteur de quelque chose qu’il ne sait probablement pas, ou insister.",
    examples: [
      {
        segments: [
          {
            text: "もう",
          },
          {
            text: "九時",
            reading: "くじ",
          },
          {
            text: "です",
          },
          {
            text: "よ。",
            highlight: true,
          },
        ],
        translation: "Il est déjà 9h, tu sais.",
      },
      {
        segments: [
          {
            text: "これ",
          },
          {
            text: "は",
          },
          {
            text: "美味",
            reading: "おい",
          },
          {
            text: "しいです",
          },
          {
            text: "よ。",
            highlight: true,
          },
        ],
        translation: "C’est délicieux, je t’assure.",
      },
    ],
  },
  {
    id: "no-possessive",
    pattern: "〜の",
    jlptLevel: "N5",
    meaning: "De ~ (possession, appartenance)",
    rule: "Nom + の + Nom",
    usage: "Pour relier deux noms, souvent pour indiquer la possession ou une relation.",
    examples: [
      {
        segments: [
          {
            text: "私",
            reading: "わたし",
          },
          {
            text: "の",
            highlight: true,
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est mon livre.",
      },
      {
        segments: [
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "の",
            highlight: true,
          },
          {
            text: "先生",
            reading: "せんせい",
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est un professeur de japonais.",
      },
    ],
  },
  {
    id: "ka-question",
    pattern: "〜か",
    jlptLevel: "N5",
    meaning: "Marqueur de question",
    rule: "Phrase (forme polie) + か",
    usage: "Pour transformer une phrase affirmative en question.",
    examples: [
      {
        segments: [
          {
            text: "学生",
            reading: "がくせい",
          },
          {
            text: "です",
          },
          {
            text: "か。",
            highlight: true,
          },
        ],
        translation: "Êtes-vous étudiant ?",
      },
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "来",
            reading: "き",
          },
          {
            text: "ます",
          },
          {
            text: "か。",
            highlight: true,
          },
        ],
        translation: "Viendrez-vous demain ?",
      },
    ],
  },
  {
    id: "janai-desu",
    pattern: "〜じゃないです",
    jlptLevel: "N5",
    meaning: "Ce n’est pas ~",
    rule: "Nom/な-adjectif + じゃないです (ou ではありません, plus formel)",
    usage: "Pour nier la copule です au présent.",
    examples: [
      {
        segments: [
          {
            text: "学生",
            reading: "がくせい",
          },
          {
            text: "じゃないです。",
            highlight: true,
          },
        ],
        translation: "Je ne suis pas étudiant.",
      },
      {
        segments: [
          {
            text: "静",
            reading: "しず",
          },
          {
            text: "か",
          },
          {
            text: "じゃないです。",
            highlight: true,
          },
        ],
        translation: "Ce n’est pas calme.",
      },
    ],
  },
  {
    id: "deshita",
    pattern: "〜でした",
    jlptLevel: "N5",
    meaning: "C’était ~",
    rule: "Nom/な-adjectif + でした",
    usage: "Pour mettre la copule です au passé.",
    examples: [
      {
        segments: [
          {
            text: "昨日",
            reading: "きのう",
          },
          {
            text: "は",
          },
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "み",
          },
          {
            text: "でした。",
            highlight: true,
          },
        ],
        translation: "Hier, c’était congé.",
      },
      {
        segments: [
          {
            text: "便利",
            reading: "べんり",
          },
          {
            text: "でした。",
            highlight: true,
          },
        ],
        translation: "C’était pratique.",
      },
    ],
  },
  {
    id: "janakatta-desu",
    pattern: "〜じゃなかったです",
    jlptLevel: "N5",
    meaning: "Ce n’était pas ~",
    rule: "Nom/な-adjectif + じゃなかったです",
    usage: "Pour nier la copule です au passé.",
    examples: [
      {
        segments: [
          {
            text: "暇",
            reading: "ひま",
          },
          {
            text: "じゃなかったです。",
            highlight: true,
          },
        ],
        translation: "Je n’étais pas libre.",
      },
      {
        segments: [
          {
            text: "有名",
            reading: "ゆうめい",
          },
          {
            text: "じゃなかったです。",
            highlight: true,
          },
        ],
        translation: "Ce n’était pas célèbre.",
      },
    ],
  },
  {
    id: "iadj-desu",
    pattern: "〜いです",
    jlptLevel: "N5",
    meaning: "C’est ~ (adjectif en い, présent)",
    rule: "Adjectif en い + です",
    usage: "Pour décrire quelque chose au présent avec un adjectif en い.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "は",
          },
          {
            text: "面白",
            reading: "おもしろ",
          },
          {
            text: "いです。",
            highlight: true,
          },
        ],
        translation: "Ce livre est intéressant.",
      },
      {
        segments: [
          {
            text: "今日",
            reading: "きょう",
          },
          {
            text: "は",
          },
          {
            text: "暑",
            reading: "あつ",
          },
          {
            text: "いです。",
            highlight: true,
          },
        ],
        translation: "Aujourd’hui il fait chaud.",
      },
    ],
  },
  {
    id: "iadj-kunai",
    pattern: "〜くないです",
    jlptLevel: "N5",
    meaning: "Ce n’est pas ~ (adjectif en い, négatif)",
    rule: "Adjectif en い (sans le い final) + くないです",
    usage: "Pour nier un adjectif en い au présent.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "料理",
            reading: "りょうり",
          },
          {
            text: "は",
          },
          {
            text: "辛",
            reading: "から",
          },
          {
            text: "くないです。",
            highlight: true,
          },
        ],
        translation: "Ce plat n’est pas épicé.",
      },
      {
        segments: [
          {
            text: "今日",
            reading: "きょう",
          },
          {
            text: "は",
          },
          {
            text: "寒",
            reading: "さむ",
          },
          {
            text: "くないです。",
            highlight: true,
          },
        ],
        translation: "Aujourd’hui il ne fait pas froid.",
      },
    ],
  },
  {
    id: "iadj-katta",
    pattern: "〜かったです",
    jlptLevel: "N5",
    meaning: "C’était ~ (adjectif en い, passé)",
    rule: "Adjectif en い (sans le い final) + かったです",
    usage: "Pour mettre un adjectif en い au passé.",
    examples: [
      {
        segments: [
          {
            text: "旅行",
            reading: "りょこう",
          },
          {
            text: "は",
          },
          {
            text: "楽",
            reading: "たの",
          },
          {
            text: "しかったです。",
            highlight: true,
          },
        ],
        translation: "Le voyage était amusant.",
      },
      {
        segments: [
          {
            text: "昨日",
            reading: "きのう",
          },
          {
            text: "は",
          },
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しかったです。",
            highlight: true,
          },
        ],
        translation: "Hier j’étais occupé.",
      },
    ],
  },
  {
    id: "iadj-kunakatta",
    pattern: "〜くなかったです",
    jlptLevel: "N5",
    meaning: "Ce n’était pas ~ (adjectif en い, passé négatif)",
    rule: "Adjectif en い (sans le い final) + くなかったです",
    usage: "Pour nier un adjectif en い au passé.",
    examples: [
      {
        segments: [
          {
            text: "テスト",
          },
          {
            text: "は",
          },
          {
            text: "難",
            reading: "むずか",
          },
          {
            text: "くなかったです。",
            highlight: true,
          },
        ],
        translation: "L’examen n’était pas difficile.",
      },
      {
        segments: [
          {
            text: "天気",
            reading: "てんき",
          },
          {
            text: "は",
          },
          {
            text: "悪",
            reading: "わる",
          },
          {
            text: "くなかったです。",
            highlight: true,
          },
        ],
        translation: "Le temps n’était pas mauvais.",
      },
    ],
  },
  {
    id: "naadj-desu",
    pattern: "〜です (な-adjectif)",
    jlptLevel: "N5",
    meaning: "C’est ~ (adjectif en な, présent)",
    rule: "Adjectif en な (sans な) + です",
    usage: "Pour décrire quelque chose au présent avec un adjectif en な.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "町",
            reading: "まち",
          },
          {
            text: "は",
          },
          {
            text: "静",
            reading: "しず",
          },
          {
            text: "か",
          },
          {
            text: "です。",
            highlight: true,
          },
        ],
        translation: "Cette ville est calme.",
      },
      {
        segments: [
          {
            text: "料理",
            reading: "りょうり",
          },
          {
            text: "が",
          },
          {
            text: "上手",
            reading: "じょうず",
          },
          {
            text: "です。",
            highlight: true,
          },
        ],
        translation: "Je suis doué en cuisine.",
      },
    ],
  },
  {
    id: "naadj-janai",
    pattern: "〜じゃないです (な-adjectif)",
    jlptLevel: "N5",
    meaning: "Ce n’est pas ~ (adjectif en な, négatif)",
    rule: "Adjectif en な (sans な) + じゃないです",
    usage: "Pour nier un adjectif en な au présent.",
    examples: [
      {
        segments: [
          {
            text: "ここは",
          },
          {
            text: "便利",
            reading: "べんり",
          },
          {
            text: "じゃないです。",
            highlight: true,
          },
        ],
        translation: "Ce n’est pas pratique ici.",
      },
      {
        segments: [
          {
            text: "暇",
            reading: "ひま",
          },
          {
            text: "じゃないです。",
            highlight: true,
          },
        ],
        translation: "Je ne suis pas libre.",
      },
    ],
  },
  {
    id: "masu-form",
    pattern: "動詞ます形",
    patternSegments: [
      { text: "動詞", reading: "どうし" },
      { text: "ます" },
      { text: "形", reading: "けい" },
    ],
    jlptLevel: "N5",
    meaning: "Forme polie du verbe (présent)",
    rule: "Base ます du verbe + ます",
    usage: "Forme polie standard pour parler d’une action au présent ou au futur.",
    examples: [
      {
        segments: [
          {
            text: "毎日",
            reading: "まいにち",
          },
          {
            text: "勉強",
            reading: "べんきょう",
          },
          {
            text: "します。",
            highlight: true,
          },
        ],
        translation: "J’étudie tous les jours.",
      },
      {
        segments: [
          {
            text: "七時",
            reading: "しちじ",
          },
          {
            text: "に",
          },
          {
            text: "起",
            reading: "お",
          },
          {
            text: "きます。",
            highlight: true,
          },
        ],
        translation: "Je me lève à 7h.",
      },
    ],
  },
  {
    id: "masen",
    pattern: "〜ません",
    jlptLevel: "N5",
    meaning: "Ne pas faire ~ (forme polie négative)",
    rule: "Base ます du verbe + ません",
    usage: "Pour nier une action au présent ou au futur, en registre poli.",
    examples: [
      {
        segments: [
          {
            text: "肉",
            reading: "にく",
          },
          {
            text: "を",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べません。",
            highlight: true,
          },
        ],
        translation: "Je ne mange pas de viande.",
      },
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "は",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "きません。",
            highlight: true,
          },
        ],
        translation: "Je n’irai pas demain.",
      },
    ],
  },
  {
    id: "mashita",
    pattern: "〜ました",
    jlptLevel: "N5",
    meaning: "Ai fait ~ (forme polie passée)",
    rule: "Base ます du verbe + ました",
    usage: "Pour parler d’une action passée, en registre poli.",
    examples: [
      {
        segments: [
          {
            text: "昨日",
            reading: "きのう",
          },
          {
            text: "映画",
            reading: "えいが",
          },
          {
            text: "を",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "ました。",
            highlight: true,
          },
        ],
        translation: "Hier j’ai regardé un film.",
      },
      {
        segments: [
          {
            text: "手紙",
            reading: "てがみ",
          },
          {
            text: "を",
          },
          {
            text: "書",
            reading: "か",
          },
          {
            text: "きました。",
            highlight: true,
          },
        ],
        translation: "J’ai écrit une lettre.",
      },
    ],
  },
  {
    id: "masendeshita",
    pattern: "〜ませんでした",
    jlptLevel: "N5",
    meaning: "N’ai pas fait ~ (forme polie passée négative)",
    rule: "Base ます du verbe + ませんでした",
    usage: "Pour nier une action passée, en registre poli.",
    examples: [
      {
        segments: [
          {
            text: "昨日",
            reading: "きのう",
          },
          {
            text: "学校",
            reading: "がっこう",
          },
          {
            text: "に",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "きませんでした。",
            highlight: true,
          },
        ],
        translation: "Hier je ne suis pas allé à l’école.",
      },
      {
        segments: [
          {
            text: "誰",
            reading: "だれ",
          },
          {
            text: "も",
          },
          {
            text: "来",
            reading: "き",
          },
          {
            text: "ませんでした。",
            highlight: true,
          },
        ],
        translation: "Personne n’est venu.",
      },
    ],
  },
  {
    id: "mashou",
    pattern: "〜ましょう",
    jlptLevel: "N5",
    meaning: "Faisons ~",
    rule: "Base ます du verbe + ましょう",
    usage: "Pour proposer de faire quelque chose ensemble, avec entrain.",
    examples: [
      {
        segments: [
          {
            text: "一緒",
            reading: "いっしょ",
          },
          {
            text: "に",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べましょう。",
            highlight: true,
          },
        ],
        translation: "Mangeons ensemble.",
      },
      {
        segments: [
          {
            text: "そろそろ",
          },
          {
            text: "始",
            reading: "はじ",
          },
          {
            text: "めましょう。",
            highlight: true,
          },
        ],
        translation: "Commençons, il est temps.",
      },
    ],
  },
  {
    id: "teimasu",
    pattern: "〜ています",
    jlptLevel: "N5",
    meaning: "Être en train de ~ / faire ~ habituellement",
    rule: "Verbe (forme て) + います",
    usage: "Pour une action en cours, un état résultant d’une action, ou une habitude.",
    examples: [
      {
        segments: [
          {
            text: "今",
            reading: "いま",
          },
          {
            text: "テレビ",
          },
          {
            text: "を",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "ています。",
            highlight: true,
          },
        ],
        translation: "Je suis en train de regarder la télé.",
      },
      {
        segments: [
          {
            text: "結婚",
            reading: "けっこん",
          },
          {
            text: "しています。",
            highlight: true,
          },
        ],
        translation: "Je suis marié.",
      },
    ],
  },
  {
    id: "tekara",
    pattern: "〜てから",
    jlptLevel: "N5",
    meaning: "Après avoir fait ~",
    rule: "Verbe (forme て) + から",
    usage: "Pour indiquer qu’une action se produit après une autre, en insistant sur l’ordre.",
    examples: [
      {
        segments: [
          {
            text: "手",
            reading: "て",
          },
          {
            text: "を",
          },
          {
            text: "洗",
            reading: "あら",
          },
          {
            text: "ってから、",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べます。",
            highlight: true,
          },
        ],
        translation: "Je mange après m’être lavé les mains.",
      },
      {
        segments: [
          {
            text: "宿題",
            reading: "しゅくだい",
          },
          {
            text: "をしてから、",
          },
          {
            text: "寝",
            reading: "ね",
          },
          {
            text: "ます。",
            highlight: true,
          },
        ],
        translation: "Je me couche après avoir fait mes devoirs.",
      },
    ],
  },
  {
    id: "temoii",
    pattern: "〜てもいいです",
    jlptLevel: "N5",
    meaning: "Il est permis de faire ~",
    rule: "Verbe (forme て) + もいいです",
    usage: "Pour donner ou demander une permission.",
    examples: [
      {
        segments: [
          {
            text: "ここに",
          },
          {
            text: "座",
            reading: "すわ",
          },
          {
            text: "ってもいいです。",
            highlight: true,
          },
        ],
        translation: "Vous pouvez vous asseoir ici.",
      },
      {
        segments: [
          {
            text: "写真",
            reading: "しゃしん",
          },
          {
            text: "を",
          },
          {
            text: "撮",
            reading: "と",
          },
          {
            text: "ってもいいですか。",
            highlight: true,
          },
        ],
        translation: "Puis-je prendre une photo ?",
      },
    ],
  },
  {
    id: "tewaikemasen",
    pattern: "〜てはいけません",
    jlptLevel: "N5",
    meaning: "Il est interdit de faire ~",
    rule: "Verbe (forme て) + はいけません",
    usage: "Pour exprimer une interdiction, souvent avec une autorité (règle, loi).",
    examples: [
      {
        segments: [
          {
            text: "ここで",
          },
          {
            text: "たばこ",
          },
          {
            text: "を",
          },
          {
            text: "吸",
            reading: "す",
          },
          {
            text: "ってはいけません。",
            highlight: true,
          },
        ],
        translation: "Il est interdit de fumer ici.",
      },
      {
        segments: [
          {
            text: "授業中",
            reading: "じゅぎょうちゅう",
          },
          {
            text: "に",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "してはいけません。",
            highlight: true,
          },
        ],
        translation: "Il est interdit de parler pendant le cours.",
      },
    ],
  },
  {
    id: "nakerebanarimasen",
    pattern: "〜なければなりません",
    jlptLevel: "N5",
    meaning: "Il faut faire ~ / devoir faire ~",
    rule: "Verbe (forme ない, sans い) + ければなりません",
    usage: "Pour exprimer une obligation.",
    examples: [
      {
        segments: [
          {
            text: "薬",
            reading: "くすり",
          },
          {
            text: "を",
          },
          {
            text: "飲",
            reading: "の",
          },
          {
            text: "まなければなりません。",
            highlight: true,
          },
        ],
        translation: "Je dois prendre mon médicament.",
      },
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "く",
          },
          {
            text: "起",
            reading: "お",
          },
          {
            text: "きなければなりません。",
            highlight: true,
          },
        ],
        translation: "Je dois me lever tôt demain.",
      },
    ],
  },
  {
    id: "nakutemoii",
    pattern: "〜なくてもいいです",
    jlptLevel: "N5",
    meaning: "Ne pas être obligé de faire ~",
    rule: "Verbe (forme ない, sans い) + くてもいいです",
    usage: "Pour exprimer qu’une action n’est pas obligatoire.",
    examples: [
      {
        segments: [
          {
            text: "今日",
            reading: "きょう",
          },
          {
            text: "は",
          },
          {
            text: "働",
            reading: "はたら",
          },
          {
            text: "かなくてもいいです。",
            highlight: true,
          },
        ],
        translation: "Aujourd’hui je ne suis pas obligé de travailler.",
      },
      {
        segments: [
          {
            text: "心配",
            reading: "しんぱい",
          },
          {
            text: "しなくてもいいです。",
            highlight: true,
          },
        ],
        translation: "Vous n’avez pas besoin de vous inquiéter.",
      },
    ],
  },
  {
    id: "nagara",
    pattern: "〜ながら",
    jlptLevel: "N5",
    meaning: "Tout en faisant ~",
    rule: "Base ます du verbe + ながら",
    usage: "Pour indiquer que deux actions se font en même temps par la même personne.",
    examples: [
      {
        segments: [
          {
            text: "音楽",
            reading: "おんがく",
          },
          {
            text: "を",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "きながら、",
            highlight: true,
          },
          {
            text: "勉強",
            reading: "べんきょう",
          },
          {
            text: "します。",
          },
        ],
        translation: "J’étudie tout en écoutant de la musique.",
      },
      {
        segments: [
          {
            text: "歩",
            reading: "ある",
          },
          {
            text: "きながら、",
            highlight: true,
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "しましょう。",
          },
        ],
        translation: "Parlons tout en marchant.",
      },
    ],
  },
  {
    id: "temimasu",
    pattern: "〜てみます",
    jlptLevel: "N5",
    meaning: "Essayer de faire ~",
    rule: "Verbe (forme て) + みます",
    usage: "Pour exprimer l’idée d’essayer une action pour voir le résultat.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "料理",
            reading: "りょうり",
          },
          {
            text: "を",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べてみます。",
            highlight: true,
          },
        ],
        translation: "Je vais goûter ce plat.",
      },
      {
        segments: [
          {
            text: "新",
            reading: "あたら",
          },
          {
            text: "しい",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "を",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "んでみます。",
            highlight: true,
          },
        ],
        translation: "Je vais essayer de lire ce nouveau livre.",
      },
    ],
  },
  {
    id: "yori-hou-ga",
    pattern: "〜より〜のほうが",
    jlptLevel: "N5",
    meaning: "X est plus ~ que Y",
    rule: "Y + より + X + の方が + adjectif",
    usage: "Pour comparer deux éléments et dire lequel a une caractéristique à un degré plus élevé.",
    examples: [
      {
        segments: [
          {
            text: "飛行機",
            reading: "ひこうき",
          },
          {
            text: "より",
          },
          {
            text: "電車",
            reading: "でんしゃ",
          },
          {
            text: "の",
          },
          {
            text: "方",
            reading: "ほう",
          },
          {
            text: "が",
          },
          {
            text: "安",
            reading: "やす",
          },
          {
            text: "いです。",
            highlight: true,
          },
        ],
        translation: "Le train est moins cher que l’avion.",
      },
      {
        segments: [
          {
            text: "夏",
            reading: "なつ",
          },
          {
            text: "より",
          },
          {
            text: "冬",
            reading: "ふゆ",
          },
          {
            text: "の",
          },
          {
            text: "方",
            reading: "ほう",
          },
          {
            text: "が",
          },
          {
            text: "好",
            reading: "す",
          },
          {
            text: "きです。",
            highlight: true,
          },
        ],
        translation: "Je préfère l’hiver à l’été.",
      },
    ],
  },
  {
    id: "to-dochira",
    pattern: "〜と〜とどちらが",
    jlptLevel: "N5",
    meaning: "Lequel de X et Y est le plus ~ ?",
    rule: "X + と + Y + と + どちらが + adjectif + ですか",
    usage: "Pour demander une comparaison entre deux éléments.",
    examples: [
      {
        segments: [
          {
            text: "犬",
            reading: "いぬ",
          },
          {
            text: "と",
          },
          {
            text: "猫",
            reading: "ねこ",
          },
          {
            text: "と",
          },
          {
            text: "どちら",
            highlight: true,
          },
          {
            text: "が",
          },
          {
            text: "好",
            reading: "す",
          },
          {
            text: "きですか。",
          },
        ],
        translation: "Lequel préférez-vous, les chiens ou les chats ?",
      },
      {
        segments: [
          {
            text: "今日",
            reading: "きょう",
          },
          {
            text: "と",
          },
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "と",
          },
          {
            text: "どちら",
            highlight: true,
          },
          {
            text: "が",
          },
          {
            text: "暇",
            reading: "ひま",
          },
          {
            text: "ですか。",
          },
        ],
        translation: "Lequel vous convient le mieux, aujourd’hui ou demain ?",
      },
    ],
  },
  {
    id: "no-naka-de-ichiban",
    pattern: "〜の中で〜が一番",
    patternSegments: [
      { text: "〜" },
      { text: "の" },
      { text: "中", reading: "なか" },
      { text: "で" },
      { text: "〜" },
      { text: "が" },
      { text: "一番", reading: "いちばん" },
    ],
    jlptLevel: "N5",
    meaning: "Parmi ~, ~ est le plus ~ (superlatif)",
    rule: "Groupe + の中で + Nom + が + 一番 + adjectif",
    usage: "Pour désigner l’élément le plus remarquable parmi un groupe de trois éléments ou plus.",
    examples: [
      {
        segments: [
          {
            text: "果物",
            reading: "くだもの",
          },
          {
            text: "の",
          },
          {
            text: "中",
            reading: "なか",
          },
          {
            text: "で",
          },
          {
            text: "林檎",
            reading: "りんご",
          },
          {
            text: "が",
          },
          {
            text: "一番",
            reading: "いちばん",
            highlight: true,
          },
          {
            text: "好",
            reading: "す",
          },
          {
            text: "きです。",
          },
        ],
        translation: "Parmi les fruits, j’aime le plus les pommes.",
      },
      {
        segments: [
          {
            text: "家族",
            reading: "かぞく",
          },
          {
            text: "の",
          },
          {
            text: "中",
            reading: "なか",
          },
          {
            text: "で",
          },
          {
            text: "父",
            reading: "ちち",
          },
          {
            text: "が",
          },
          {
            text: "一番",
            reading: "いちばん",
            highlight: true,
          },
          {
            text: "背",
            reading: "せ",
          },
          {
            text: "が",
          },
          {
            text: "高",
            reading: "たか",
          },
          {
            text: "いです。",
          },
        ],
        translation: "Dans la famille, mon père est le plus grand.",
      },
    ],
  },
  {
    id: "ga-arimasu-imasu",
    pattern: "〜があります／います",
    jlptLevel: "N5",
    meaning: "Il y a ~",
    rule: "Nom (inanimé) + があります, ou Nom (animé) + がいます",
    usage: "Pour affirmer l’existence de quelque chose ou de quelqu’un.",
    examples: [
      {
        segments: [
          {
            text: "公園",
            reading: "こうえん",
          },
          {
            text: "に",
          },
          {
            text: "木",
            reading: "き",
          },
          {
            text: "が",
          },
          {
            text: "あります。",
            highlight: true,
          },
        ],
        translation: "Il y a des arbres dans le parc.",
      },
      {
        segments: [
          {
            text: "部屋",
            reading: "へや",
          },
          {
            text: "に",
          },
          {
            text: "猫",
            reading: "ねこ",
          },
          {
            text: "が",
          },
          {
            text: "います。",
            highlight: true,
          },
        ],
        translation: "Il y a un chat dans la pièce.",
      },
    ],
  },
  {
    id: "toki",
    pattern: "〜時",
    patternSegments: [
      { text: "〜" },
      { text: "時", reading: "とき" },
    ],
    jlptLevel: "N5",
    meaning: "Quand ~, au moment où ~",
    rule: "Verbe/adjectif (forme neutre) ou Nom + の + 時",
    usage: "Pour situer une action ou un état dans le temps par rapport à un autre événement.",
    examples: [
      {
        segments: [
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "に",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "った",
          },
          {
            text: "時",
            reading: "とき",
            highlight: true,
          },
          {
            text: "に",
          },
          {
            text: "寿司",
            reading: "すし",
          },
          {
            text: "を",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べました。",
          },
        ],
        translation: "Quand je suis allé au Japon, j’ai mangé des sushis.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "の",
          },
          {
            text: "時",
            reading: "とき",
            highlight: true,
          },
          {
            text: "よく",
          },
          {
            text: "公園",
            reading: "こうえん",
          },
          {
            text: "で",
          },
          {
            text: "遊",
            reading: "あそ",
          },
          {
            text: "びました。",
          },
        ],
        translation: "Quand j’étais enfant, je jouais souvent au parc.",
      },
    ],
  },
  {
    id: "atode",
    pattern: "〜後で",
    patternSegments: [
      { text: "〜" },
      { text: "後", reading: "あと" },
      { text: "で" },
    ],
    jlptLevel: "N5",
    meaning: "Après ~",
    rule: "Verbe (forme dictionnaire) + 後で, ou Nom + の後で",
    usage: "Pour indiquer qu’une action se fait après une autre.",
    examples: [
      {
        segments: [
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "の",
          },
          {
            text: "後",
            reading: "あと",
            highlight: true,
          },
          {
            text: "で",
          },
          {
            text: "飲",
            reading: "の",
          },
          {
            text: "みに",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "きます。",
          },
        ],
        translation: "Après le travail, je vais boire un verre.",
      },
      {
        segments: [
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べた",
          },
          {
            text: "後",
            reading: "あと",
            highlight: true,
          },
          {
            text: "で",
          },
          {
            text: "皿",
            reading: "さら",
          },
          {
            text: "を",
          },
          {
            text: "洗",
            reading: "あら",
          },
          {
            text: "います。",
          },
        ],
        translation: "Après avoir mangé, je lave la vaisselle.",
      },
    ],
  },
  {
    id: "aida-ni",
    pattern: "〜間に",
    patternSegments: [
      { text: "〜" },
      { text: "間", reading: "あいだ" },
      { text: "に" },
    ],
    jlptLevel: "N5",
    meaning: "Pendant que ~ (dans l’intervalle)",
    rule: "Verbe (forme neutre présent) ou Nom + の + 間に",
    usage: "Pour indiquer qu’une action ponctuelle se produit à l’intérieur d’une période donnée par une autre action continue.",
    examples: [
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "が",
          },
          {
            text: "寝",
            reading: "ね",
          },
          {
            text: "ている",
          },
          {
            text: "間",
            reading: "あいだ",
            highlight: true,
          },
          {
            text: "に",
          },
          {
            text: "掃除",
            reading: "そうじ",
          },
          {
            text: "します。",
          },
        ],
        translation: "Je fais le ménage pendant que l’enfant dort.",
      },
      {
        segments: [
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "みの",
          },
          {
            text: "間",
            reading: "あいだ",
            highlight: true,
          },
          {
            text: "に",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "を",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "みました。",
          },
        ],
        translation: "J’ai lu un livre pendant les vacances.",
      },
    ],
  },
  {
    id: "deshou",
    pattern: "〜でしょう",
    jlptLevel: "N5",
    meaning: "C’est probablement ~",
    rule: "Nom/adjectif/verbe (forme neutre) + でしょう",
    usage: "Pour exprimer une supposition, souvent à propos de la météo ou du futur.",
    examples: [
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "は",
          },
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "でしょう。",
            highlight: true,
          },
        ],
        translation: "Il pleuvra probablement demain.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "来",
            reading: "こ",
          },
          {
            text: "ないでしょう。",
            highlight: true,
          },
        ],
        translation: "Il ne viendra probablement pas.",
      },
    ],
  },
  {
    id: "kamoshiremasen",
    pattern: "〜かもしれません",
    jlptLevel: "N5",
    meaning: "Il se peut que ~ / peut-être ~",
    rule: "Nom/adjectif/verbe (forme neutre) + かもしれません",
    usage: "Pour exprimer une possibilité, avec moins de certitude que でしょう.",
    examples: [
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "雪",
            reading: "ゆき",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "るかもしれません。",
            highlight: true,
          },
        ],
        translation: "Il se peut qu’il neige demain.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しいかもしれません。",
            highlight: true,
          },
        ],
        translation: "Elle est peut-être occupée.",
      },
    ],
  },
  {
    id: "to-omoimasu",
    pattern: "〜と思います",
    patternSegments: [
      { text: "〜" },
      { text: "と" },
      { text: "思", reading: "おも" },
      { text: "います" },
    ],
    jlptLevel: "N5",
    meaning: "Je pense que ~",
    rule: "Phrase (forme neutre) + と思います",
    usage: "Pour exprimer une opinion personnelle.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "映画",
            reading: "えいが",
          },
          {
            text: "は",
          },
          {
            text: "面白",
            reading: "おもしろ",
          },
          {
            text: "いと",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "います。",
            highlight: true,
          },
        ],
        translation: "Je pense que ce film est intéressant.",
      },
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "晴",
            reading: "は",
          },
          {
            text: "れると",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "います。",
            highlight: true,
          },
        ],
        translation: "Je pense qu’il fera beau demain.",
      },
    ],
  },
  {
    id: "n-desu",
    pattern: "〜んです",
    jlptLevel: "N5",
    meaning: "C’est que ~ (explication)",
    rule: "Phrase (forme neutre) + んです (な-adj/nom + なんです)",
    usage: "Pour donner une explication ou un contexte, souvent en réponse à ce qu’on observe.",
    examples: [
      {
        segments: [
          {
            text: "顔",
            reading: "かお",
          },
          {
            text: "が",
          },
          {
            text: "赤",
            reading: "あか",
          },
          {
            text: "いですね。",
          },
          {
            text: "風邪",
            reading: "かぜ",
          },
          {
            text: "な",
          },
          {
            text: "んです。",
            highlight: true,
          },
        ],
        translation: "Tu es tout rouge. En fait, j’ai un rhume.",
      },
      {
        segments: [
          {
            text: "どうして",
          },
          {
            text: "遅",
            reading: "おく",
          },
          {
            text: "れた",
          },
          {
            text: "んです",
            highlight: true,
          },
          {
            text: "か。",
          },
        ],
        translation: "Pourquoi es-tu en retard, au juste ?",
      },
    ],
  },
  {
    id: "to-iimasu",
    pattern: "〜と言います",
    patternSegments: [
      { text: "〜" },
      { text: "と" },
      { text: "言", reading: "い" },
      { text: "います" },
    ],
    jlptLevel: "N5",
    meaning: "S’appelle ~ / dit ~",
    rule: "Nom/citation + と言います",
    usage: "Pour dire comment quelque chose s’appelle, ou rapporter ce que quelqu’un a dit.",
    examples: [
      {
        segments: [
          {
            text: "私",
            reading: "わたし",
          },
          {
            text: "は",
          },
          {
            text: "田中",
            reading: "たなか",
          },
          {
            text: "と",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "います。",
            highlight: true,
          },
        ],
        translation: "Je m’appelle Tanaka.",
      },
      {
        segments: [
          {
            text: "これ",
            highlight: true,
          },
          {
            text: "は",
          },
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "で",
          },
          {
            text: "何",
            reading: "なん",
          },
          {
            text: "と",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "いますか。",
          },
        ],
        translation: "Comment dit-on ceci en japonais ?",
      },
    ],
  },
  {
    id: "to-iu",
    pattern: "〜という",
    jlptLevel: "N5",
    meaning: "Appelé ~, qui s’appelle ~",
    rule: "Nom + という + Nom",
    usage: "Pour introduire ou préciser le nom de quelque chose, souvent peu connu de l’interlocuteur.",
    examples: [
      {
        segments: [
          {
            text: "寿司",
            reading: "すし",
          },
          {
            text: "という",
            highlight: true,
          },
          {
            text: "料理",
            reading: "りょうり",
          },
          {
            text: "を",
          },
          {
            text: "知",
            reading: "し",
          },
          {
            text: "っていますか。",
          },
        ],
        translation: "Connaissez-vous le plat qui s’appelle sushi ?",
      },
      {
        segments: [
          {
            text: "田中",
            reading: "たなか",
          },
          {
            text: "という",
            highlight: true,
          },
          {
            text: "人",
            reading: "ひと",
          },
          {
            text: "から",
          },
          {
            text: "電話",
            reading: "でんわ",
          },
          {
            text: "がありました。",
          },
        ],
        translation: "Une personne du nom de Tanaka a appelé.",
      },
    ],
  },
  {
    id: "deshouka",
    pattern: "〜でしょうか",
    jlptLevel: "N5",
    meaning: "Est-ce que ~, je me demande ? (question polie et douce)",
    rule: "Phrase (forme neutre) + でしょうか",
    usage: "Version plus douce et polie de か, souvent pour poser une question avec délicatesse.",
    examples: [
      {
        segments: [
          {
            text: "これで",
          },
          {
            text: "いい",
            highlight: true,
          },
          {
            text: "でしょうか。",
            highlight: true,
          },
        ],
        translation: "Est-ce que cela convient ?",
      },
      {
        segments: [
          {
            text: "何時",
            reading: "なんじ",
          },
          {
            text: "に",
          },
          {
            text: "始",
            reading: "はじ",
          },
          {
            text: "まる",
          },
          {
            text: "でしょうか。",
            highlight: true,
          },
        ],
        translation: "À quelle heure cela commence-t-il, je me demande ?",
      },
    ],
  },
  {
    id: "gimonshi-ka",
    pattern: "疑問詞＋か",
    patternSegments: [
      { text: "疑問詞", reading: "ぎもんし" },
      { text: "＋" },
      { text: "か" },
    ],
    jlptLevel: "N5",
    meaning: "Quelque chose, quelque part, quelqu’un (indéfini)",
    rule: "Mot interrogatif (何/どこ/誰 etc.) + か",
    usage: "Pour rendre un mot interrogatif indéfini, comme « quelque chose » plutôt que « quoi ».",
    examples: [
      {
        segments: [
          {
            text: "何",
            reading: "なに",
          },
          {
            text: "か",
            highlight: true,
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べたいです。",
          },
        ],
        translation: "Je veux manger quelque chose.",
      },
      {
        segments: [
          {
            text: "誰",
            reading: "だれ",
          },
          {
            text: "か",
            highlight: true,
          },
          {
            text: "に",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "いてください。",
          },
        ],
        translation: "Demandez à quelqu’un, s’il vous plaît.",
      },
    ],
  },
  {
    id: "hou-ga-ii",
    pattern: "〜ほうがいいです",
    jlptLevel: "N5",
    meaning: "Il vaut mieux faire ~",
    rule: "Verbe (forme た) + 方がいいです",
    usage: "Pour donner un conseil positif.",
    examples: [
      {
        segments: [
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "く",
          },
          {
            text: "寝",
            reading: "ね",
          },
          {
            text: "た",
          },
          {
            text: "方",
            reading: "ほう",
            highlight: true,
          },
          {
            text: "がいいです。",
          },
        ],
        translation: "Il vaut mieux se coucher tôt.",
      },
      {
        segments: [
          {
            text: "病院",
            reading: "びょういん",
          },
          {
            text: "に",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "った",
          },
          {
            text: "方",
            reading: "ほう",
            highlight: true,
          },
          {
            text: "がいいです。",
          },
        ],
        translation: "Il vaut mieux aller à l’hôpital.",
      },
    ],
  },
  {
    id: "nai-hou-ga-ii",
    pattern: "〜ないほうがいいです",
    jlptLevel: "N5",
    meaning: "Il vaut mieux ne pas faire ~",
    rule: "Verbe (forme ない) + 方がいいです",
    usage: "Pour donner un conseil négatif, dissuader quelqu’un de faire quelque chose.",
    examples: [
      {
        segments: [
          {
            text: "お酒",
            reading: "おさけ",
          },
          {
            text: "を",
          },
          {
            text: "飲",
            reading: "の",
          },
          {
            text: "まない",
          },
          {
            text: "方",
            reading: "ほう",
            highlight: true,
          },
          {
            text: "がいいです。",
          },
        ],
        translation: "Il vaut mieux ne pas boire d’alcool.",
      },
      {
        segments: [
          {
            text: "無理",
            reading: "むり",
          },
          {
            text: "しない",
          },
          {
            text: "方",
            reading: "ほう",
            highlight: true,
          },
          {
            text: "がいいです。",
          },
        ],
        translation: "Il vaut mieux ne pas se forcer.",
      },
    ],
  },
  {
    id: "agemasu",
    pattern: "〜をあげます",
    jlptLevel: "N5",
    meaning: "Donner ~ (à quelqu’un d’autre)",
    rule: "Nom + をあげます",
    usage: "Pour dire qu’on donne quelque chose à une autre personne (pas à soi-même).",
    examples: [
      {
        segments: [
          {
            text: "友達",
            reading: "ともだち",
          },
          {
            text: "に",
          },
          {
            text: "プレゼント",
            highlight: true,
          },
          {
            text: "を",
          },
          {
            text: "あげます。",
            highlight: true,
          },
        ],
        translation: "Je donne un cadeau à un ami.",
      },
      {
        segments: [
          {
            text: "猫",
            reading: "ねこ",
          },
          {
            text: "に",
          },
          {
            text: "餌",
            reading: "えさ",
          },
          {
            text: "を",
          },
          {
            text: "あげます。",
            highlight: true,
          },
        ],
        translation: "Je donne à manger au chat.",
      },
    ],
  },
  {
    id: "moraimasu",
    pattern: "〜をもらいます",
    jlptLevel: "N5",
    meaning: "Recevoir ~",
    rule: "Nom + をもらいます",
    usage: "Pour dire qu’on reçoit quelque chose de la part de quelqu’un.",
    examples: [
      {
        segments: [
          {
            text: "友達",
            reading: "ともだち",
          },
          {
            text: "に",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "を",
          },
          {
            text: "もらいました。",
            highlight: true,
          },
        ],
        translation: "J’ai reçu un livre d’un ami.",
      },
      {
        segments: [
          {
            text: "先生",
            reading: "せんせい",
          },
          {
            text: "から",
          },
          {
            text: "手紙",
            reading: "てがみ",
          },
          {
            text: "を",
          },
          {
            text: "もらいました。",
            highlight: true,
          },
        ],
        translation: "J’ai reçu une lettre du professeur.",
      },
    ],
  },
  {
    id: "kuremasu",
    pattern: "〜をくれます",
    jlptLevel: "N5",
    meaning: "Me donner ~",
    rule: "Nom + をくれます",
    usage: "Comme あげます, mais spécifiquement quand quelqu’un donne quelque chose au locuteur (ou à son groupe).",
    examples: [
      {
        segments: [
          {
            text: "友達",
            reading: "ともだち",
          },
          {
            text: "が",
          },
          {
            text: "花",
            reading: "はな",
          },
          {
            text: "を",
          },
          {
            text: "くれました。",
            highlight: true,
          },
        ],
        translation: "Un ami m’a donné des fleurs.",
      },
      {
        segments: [
          {
            text: "母",
            reading: "はは",
          },
          {
            text: "が",
          },
          {
            text: "お",
          },
          {
            text: "菓子",
            reading: "かし",
          },
          {
            text: "を",
          },
          {
            text: "くれました。",
            highlight: true,
          },
        ],
        translation: "Ma mère m’a donné des sucreries.",
      },
    ],
  },
  {
    id: "te-agemasu",
    pattern: "〜てあげます",
    jlptLevel: "N5",
    meaning: "Faire ~ pour quelqu’un",
    rule: "Verbe (forme て) + あげます",
    usage: "Pour dire qu’on rend service à quelqu’un d’autre en faisant une action pour lui.",
    examples: [
      {
        segments: [
          {
            text: "友達",
            reading: "ともだち",
          },
          {
            text: "に",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "を",
          },
          {
            text: "貸",
            reading: "か",
          },
          {
            text: "してあげました。",
            highlight: true,
          },
        ],
        translation: "J’ai prêté un livre à un ami.",
      },
      {
        segments: [
          {
            text: "道",
            reading: "みち",
          },
          {
            text: "を",
          },
          {
            text: "教",
            reading: "おし",
          },
          {
            text: "えてあげました。",
            highlight: true,
          },
        ],
        translation: "Je lui ai indiqué le chemin.",
      },
    ],
  },
  {
    id: "te-moraimasu",
    pattern: "〜てもらいます",
    jlptLevel: "N5",
    meaning: "Faire faire ~ par quelqu’un (à mon bénéfice)",
    rule: "Verbe (forme て) + もらいます",
    usage: "Pour dire que quelqu’un fait une action pour nous, à notre demande ou à notre bénéfice.",
    examples: [
      {
        segments: [
          {
            text: "先生",
            reading: "せんせい",
          },
          {
            text: "に",
          },
          {
            text: "漢字",
            reading: "かんじ",
          },
          {
            text: "を",
          },
          {
            text: "教",
            reading: "おし",
          },
          {
            text: "えてもらいました。",
            highlight: true,
          },
        ],
        translation: "Le professeur m’a appris des kanjis.",
      },
      {
        segments: [
          {
            text: "友達",
            reading: "ともだち",
          },
          {
            text: "に",
          },
          {
            text: "手伝",
            reading: "てつだ",
          },
          {
            text: "ってもらいました。",
            highlight: true,
          },
        ],
        translation: "Un ami m’a aidé.",
      },
    ],
  },
  {
    id: "te-kuremasu",
    pattern: "〜てくれます",
    jlptLevel: "N5",
    meaning: "Faire ~ pour moi (l’autre le fait spontanément)",
    rule: "Verbe (forme て) + くれます",
    usage: "Comme てもらいます, mais le sujet est celui qui fait l’action pour nous, souvent spontanément.",
    examples: [
      {
        segments: [
          {
            text: "友達",
            reading: "ともだち",
          },
          {
            text: "が",
          },
          {
            text: "手伝",
            reading: "てつだ",
          },
          {
            text: "ってくれました。",
            highlight: true,
          },
        ],
        translation: "Un ami m’a aidé (spontanément).",
      },
      {
        segments: [
          {
            text: "母",
            reading: "はは",
          },
          {
            text: "が",
          },
          {
            text: "料理",
            reading: "りょうり",
          },
          {
            text: "を",
          },
          {
            text: "作",
            reading: "つく",
          },
          {
            text: "ってくれました。",
            highlight: true,
          },
        ],
        translation: "Ma mère m’a préparé un plat.",
      },
    ],
  },
  {
    id: "sugiru",
    pattern: "〜すぎる",
    jlptLevel: "N5",
    meaning: "Trop ~",
    rule: "Verbe (base ます) ou Adjectif (sans い/な final) + すぎる",
    usage: "Pour exprimer un excès, quelque chose fait ou étant à un degré excessif.",
    examples: [
      {
        segments: [
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べ",
          },
          {
            text: "すぎました。",
            highlight: true,
          },
        ],
        translation: "J’ai trop mangé.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "は",
          },
          {
            text: "難",
            reading: "むずか",
          },
          {
            text: "し",
          },
          {
            text: "すぎます。",
            highlight: true,
          },
        ],
        translation: "Ce problème est trop difficile.",
      },
    ],
  },
  {
    id: "yasui-suffix",
    pattern: "〜やすい",
    jlptLevel: "N5",
    meaning: "Facile à faire ~",
    rule: "Verbe (base ます) + やすい",
    usage: "Pour dire qu’une action est facile ou agréable à réaliser.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "は",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "み",
          },
          {
            text: "やすいです。",
            highlight: true,
          },
        ],
        translation: "Ce livre est facile à lire.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "靴",
            reading: "くつ",
          },
          {
            text: "は",
          },
          {
            text: "歩",
            reading: "ある",
          },
          {
            text: "き",
          },
          {
            text: "やすいです。",
            highlight: true,
          },
        ],
        translation: "Ces chaussures sont faciles pour marcher.",
      },
    ],
  },
  {
    id: "nikui-suffix",
    pattern: "〜にくい",
    jlptLevel: "N5",
    meaning: "Difficile à faire ~",
    rule: "Verbe (base ます) + にくい",
    usage: "Pour dire qu’une action est difficile ou désagréable à réaliser (contraire de やすい).",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "肉",
            reading: "にく",
          },
          {
            text: "は",
          },
          {
            text: "切",
            reading: "き",
          },
          {
            text: "り",
          },
          {
            text: "にくいです。",
            highlight: true,
          },
        ],
        translation: "Cette viande est difficile à couper.",
      },
      {
        segments: [
          {
            text: "小",
            reading: "ちい",
          },
          {
            text: "さい",
          },
          {
            text: "字",
            reading: "じ",
          },
          {
            text: "は",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "み",
          },
          {
            text: "にくいです。",
            highlight: true,
          },
        ],
        translation: "Les petits caractères sont difficiles à lire.",
      },
    ],
  },
  {
    id: "tari-tari",
    pattern: "〜たり〜たりする",
    jlptLevel: "N5",
    meaning: "Faire des choses comme ~ et ~",
    rule: "Verbe (forme た) + り + Verbe (forme た) + り + する",
    usage: "Pour lister quelques actions parmi d’autres, sans ordre précis ni exhaustivité.",
    examples: [
      {
        segments: [
          {
            text: "週末",
            reading: "しゅうまつ",
          },
          {
            text: "は",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "を",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "んだり",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "映画",
            reading: "えいが",
          },
          {
            text: "を",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "たり",
            highlight: true,
          },
          {
            text: "します。",
          },
        ],
        translation: "Le week-end, je fais des choses comme lire et regarder des films.",
      },
      {
        segments: [
          {
            text: "公園",
            reading: "こうえん",
          },
          {
            text: "で",
          },
          {
            text: "歩",
            reading: "ある",
          },
          {
            text: "いたり",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "写真",
            reading: "しゃしん",
          },
          {
            text: "を",
          },
          {
            text: "撮",
            reading: "と",
          },
          {
            text: "ったり",
            highlight: true,
          },
          {
            text: "しました。",
          },
        ],
        translation: "Au parc, j’ai marché, pris des photos, entre autres.",
      },
    ],
  },
  {
    id: "ta-koto-ga-arimasu",
    pattern: "〜たことがあります",
    jlptLevel: "N5",
    meaning: "Avoir déjà fait ~ (expérience)",
    rule: "Verbe (forme た) + ことがあります",
    usage: "Pour parler d’une expérience vécue au moins une fois dans le passé.",
    examples: [
      {
        segments: [
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "に",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "った",
          },
          {
            text: "ことがあります。",
            highlight: true,
          },
        ],
        translation: "Je suis déjà allé au Japon.",
      },
      {
        segments: [
          {
            text: "納豆",
            reading: "なっとう",
          },
          {
            text: "を",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べた",
          },
          {
            text: "ことがありません。",
            highlight: true,
          },
        ],
        translation: "Je n’ai jamais mangé de nattō.",
      },
    ],
  },
  {
    id: "te-okimasu",
    pattern: "〜ておきます",
    jlptLevel: "N5",
    meaning: "Faire ~ à l’avance / laisser tel quel",
    rule: "Verbe (forme て) + おきます",
    usage: "Pour indiquer qu’une action est faite en préparation de quelque chose, à l’avance.",
    examples: [
      {
        segments: [
          {
            text: "晩御飯",
            reading: "ばんごはん",
          },
          {
            text: "を",
          },
          {
            text: "作",
            reading: "つく",
          },
          {
            text: "っておきます。",
            highlight: true,
          },
        ],
        translation: "Je prépare le dîner à l’avance.",
      },
      {
        segments: [
          {
            text: "部屋",
            reading: "へや",
          },
          {
            text: "を",
          },
          {
            text: "掃除",
            reading: "そうじ",
          },
          {
            text: "しておきます。",
            highlight: true,
          },
        ],
        translation: "Je nettoie la pièce à l’avance.",
      },
    ],
  },
  {
    id: "adj-te-form",
    pattern: "〜くて／〜で (adjectif)",
    jlptLevel: "N5",
    meaning: "Étant ~ et ~ (forme て des adjectifs, pour enchaîner)",
    rule: "Adjectif い (sans い) + くて, ou Adjectif な + で",
    usage: "Pour relier deux adjectifs (ou une phrase) dans une même description.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "部屋",
            reading: "へや",
          },
          {
            text: "は",
          },
          {
            text: "広",
            reading: "ひろ",
          },
          {
            text: "くて、",
            highlight: true,
          },
          {
            text: "明",
            reading: "あか",
          },
          {
            text: "るいです。",
          },
        ],
        translation: "Cette pièce est spacieuse et lumineuse.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "親切",
            reading: "しんせつ",
          },
          {
            text: "で、",
            highlight: true,
          },
          {
            text: "優",
            reading: "やさ",
          },
          {
            text: "しいです。",
          },
        ],
        translation: "Elle est gentille et douce.",
      },
    ],
  },
  {
    id: "naru-change",
    pattern: "〜くなります／になります",
    jlptLevel: "N5",
    meaning: "Devenir ~",
    rule: "Adjectif い (sans い) + くなります, ou Adjectif な/Nom + になります",
    usage: "Pour exprimer un changement d’état.",
    examples: [
      {
        segments: [
          {
            text: "段々",
            reading: "だんだん",
          },
          {
            text: "寒",
            reading: "さむ",
          },
          {
            text: "くなります。",
            highlight: true,
          },
        ],
        translation: "Il fait petit à petit plus froid.",
      },
      {
        segments: [
          {
            text: "有名",
            reading: "ゆうめい",
          },
          {
            text: "になりました。",
            highlight: true,
          },
        ],
        translation: "Il est devenu célèbre.",
      },
    ],
  },
  {
    id: "gimonshi-demo",
    pattern: "疑問詞＋でも",
    patternSegments: [
      { text: "疑問詞", reading: "ぎもんし" },
      { text: "＋" },
      { text: "でも" },
    ],
    jlptLevel: "N5",
    meaning: "N’importe quoi, n’importe où, n’importe qui",
    rule: "Mot interrogatif (何/どこ/誰 etc.) + でも",
    usage: "Pour exprimer l’absence de restriction — tout convient, sans exception.",
    examples: [
      {
        segments: [
          {
            text: "何",
            reading: "なん",
          },
          {
            text: "でも",
            highlight: true,
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べられます。",
          },
        ],
        translation: "Je peux manger n’importe quoi.",
      },
      {
        segments: [
          {
            text: "誰",
            reading: "だれ",
          },
          {
            text: "でも",
            highlight: true,
          },
          {
            text: "参加",
            reading: "さんか",
          },
          {
            text: "できます。",
          },
        ],
        translation: "N’importe qui peut participer.",
      },
    ],
  },
  {
    id: "kurai-approx",
    pattern: "〜くらい／ぐらい",
    jlptLevel: "N5",
    meaning: "Environ ~, à peu près ~",
    rule: "Nombre/Quantité + くらい (ぐらい après un son voisé)",
    usage: "Pour donner une estimation approximative d’une quantité, d’une durée ou d’une distance.",
    examples: [
      {
        segments: [
          {
            text: "三十分",
            reading: "さんじゅっぷん",
          },
          {
            text: "くらい",
            highlight: true,
          },
          {
            text: "かかります。",
          },
        ],
        translation: "Ça prend environ trente minutes.",
      },
      {
        segments: [
          {
            text: "十人",
            reading: "じゅうにん",
          },
          {
            text: "ぐらい",
            highlight: true,
          },
          {
            text: "来",
            reading: "き",
          },
          {
            text: "ました。",
          },
        ],
        translation: "Environ dix personnes sont venues.",
      },
    ],
  },
  {
    id: "zutsu",
    pattern: "〜ずつ",
    jlptLevel: "N5",
    meaning: "Chacun ~, à chaque fois ~",
    rule: "Quantité + ずつ",
    usage: "Pour indiquer une répartition égale — la même quantité à chaque fois ou pour chaque personne.",
    examples: [
      {
        segments: [
          {
            text: "一人",
            reading: "ひとり",
          },
          {
            text: "一",
            reading: "いち",
          },
          {
            text: "枚",
            reading: "まい",
          },
          {
            text: "ずつ",
            highlight: true,
          },
          {
            text: "もらいます。",
          },
        ],
        translation: "Chaque personne en reçoit une.",
      },
      {
        segments: [
          {
            text: "少",
            reading: "すこ",
          },
          {
            text: "し",
          },
          {
            text: "ずつ",
            highlight: true,
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べます。",
          },
        ],
        translation: "J’en mange un peu à chaque fois.",
      },
    ],
  },
  {
    id: "kata-howto",
    pattern: "〜方",
    patternSegments: [
      { text: "〜" },
      { text: "方", reading: "かた" },
    ],
    jlptLevel: "N5",
    meaning: "Façon de faire ~, comment faire ~",
    rule: "Verbe (base ます) + 方",
    usage: "Pour transformer un verbe en nom désignant la manière de faire cette action.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "漢字",
            reading: "かんじ",
          },
          {
            text: "の",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "み",
          },
          {
            text: "方",
            reading: "かた",
            highlight: true,
          },
          {
            text: "が",
          },
          {
            text: "分",
            reading: "わ",
          },
          {
            text: "かりません。",
          },
        ],
        translation: "Je ne sais pas comment lire ce kanji.",
      },
      {
        segments: [
          {
            text: "作",
            reading: "つく",
          },
          {
            text: "り",
          },
          {
            text: "方",
            reading: "かた",
            highlight: true,
          },
          {
            text: "を",
          },
          {
            text: "教",
            reading: "おし",
          },
          {
            text: "えてください。",
          },
        ],
        translation: "Montrez-moi comment le faire, s’il vous plaît.",
      },
    ],
  },
  {
    id: "mieru-kikoeru",
    pattern: "見えます／聞こえます",
    patternSegments: [
      { text: "見", reading: "み" },
      { text: "えます" },
      { text: "／" },
      { text: "聞", reading: "き" },
      { text: "こえます" },
    ],
    jlptLevel: "N5",
    meaning: "Pouvoir voir / pouvoir entendre (perception naturelle)",
    rule: "Nom + が + 見えます／聞こえます",
    usage: "Pour dire que quelque chose est visible ou audible naturellement, sans effort particulier (à distinguer de 見る/聞く, l’action volontaire).",
    examples: [
      {
        segments: [
          {
            text: "ここから",
          },
          {
            text: "富士山",
            reading: "ふじさん",
          },
          {
            text: "が",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "えます。",
            highlight: true,
          },
        ],
        translation: "On voit le mont Fuji d’ici.",
      },
      {
        segments: [
          {
            text: "音楽",
            reading: "おんがく",
          },
          {
            text: "が",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "こえます。",
            highlight: true,
          },
        ],
        translation: "On entend de la musique.",
      },
    ],
  },
  {
    id: "sa-nominalizer",
    pattern: "〜さ",
    jlptLevel: "N5",
    meaning: "Le degré de ~ (nominalise un adjectif)",
    rule: "Adjectif い (sans い) ou な (sans な) + さ",
    usage: "Pour transformer un adjectif en nom désignant le degré ou la mesure de cette qualité.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "山",
            reading: "やま",
          },
          {
            text: "の",
          },
          {
            text: "高",
            reading: "たか",
          },
          {
            text: "さ",
            highlight: true,
          },
          {
            text: "は",
          },
          {
            text: "三千",
            reading: "さんぜん",
          },
          {
            text: "メートル",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "La hauteur de cette montagne est de trois mille mètres.",
      },
      {
        segments: [
          {
            text: "町",
            reading: "まち",
          },
          {
            text: "の",
          },
          {
            text: "静",
            reading: "しず",
          },
          {
            text: "かさ",
            highlight: true,
          },
          {
            text: "が",
          },
          {
            text: "好",
            reading: "す",
          },
          {
            text: "きです。",
          },
        ],
        translation: "J’aime le calme de cette ville.",
      },
    ],
  },
  {
    id: "sou-desu-looks",
    pattern: "〜そうです",
    jlptLevel: "N5",
    meaning: "On dirait que ~ / ça a l’air ~",
    rule: "Adjectif い (sans い) + そうです, ou Adjectif な (sans な) + そうです",
    usage: "Pour exprimer une impression visuelle — l’apparence de quelque chose, sans certitude.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "ケーキ",
          },
          {
            text: "は",
          },
          {
            text: "美味",
            reading: "おい",
          },
          {
            text: "し",
          },
          {
            text: "そうです。",
            highlight: true,
          },
        ],
        translation: "Ce gâteau a l’air délicieux.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "元気",
            reading: "げんき",
          },
          {
            text: "そうです。",
            highlight: true,
          },
        ],
        translation: "Il a l’air en forme.",
      },
    ],
  },
  {
    id: "ni-tsuite",
    pattern: "〜について",
    jlptLevel: "N4",
    meaning: "à propos de ~, concernant ~",
    rule: "Nom + について",
    usage: "Pour indiquer le sujet dont on parle, écrit ou réfléchit.",
    examples: [
      {
        segments: [
          {
            text: "日本",
          },
          {
            text: "の",
          },
          {
            text: "歴史",
            reading: "れきし",
          },
          {
            text: "について",
            highlight: true,
          },
          {
            text: "話",
          },
          {
            text: "します。",
          },
        ],
        translation: "Je vais parler de l'histoire du Japon.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "問題",
          },
          {
            text: "について",
            highlight: true,
          },
          {
            text: "考",
          },
          {
            text: "えてください。",
          },
        ],
        translation: "Réfléchissez à ce problème, s’il vous plaît.",
      },
    ],
  },
  {
    id: "ni-yoruto",
    pattern: "〜によると",
    jlptLevel: "N4",
    meaning: "selon ~ (source d’information)",
    rule: "Nom (source) + によると + phrase (souvent en そうです)",
    usage: "Pour introduire une information rapportée en précisant sa source.",
    examples: [
      {
        segments: [
          {
            text: "天気予報",
            reading: "てんきよほう",
          },
          {
            text: "によると",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "明日",
          },
          {
            text: "は",
          },
          {
            text: "雨",
          },
          {
            text: "だそうです。",
          },
        ],
        translation: "Selon la météo, il pleuvra demain.",
      },
      {
        segments: [
          {
            text: "新聞",
          },
          {
            text: "によると",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "事故",
            reading: "じこ",
          },
          {
            text: "があったそうです。",
          },
        ],
        translation: "Selon le journal, il y a eu un accident.",
      },
    ],
  },
  {
    id: "oki",
    pattern: "〜おき",
    jlptLevel: "N4",
    meaning: "tous les ~ (intervalle régulier)",
    rule: "Nombre + unité + おき(に)",
    usage: "Pour exprimer un intervalle régulier entre deux occurrences.",
    examples: [
      {
        segments: [
          {
            text: "一日",
            reading: "いちにち",
          },
          {
            text: "おき",
            highlight: true,
          },
          {
            text: "に",
          },
          {
            text: "薬",
          },
          {
            text: "を",
          },
          {
            text: "飲",
          },
          {
            text: "みます。",
          },
        ],
        translation: "Je prends le médicament tous les deux jours.",
      },
      {
        segments: [
          {
            text: "二時間",
            reading: "にじかん",
          },
          {
            text: "おき",
            highlight: true,
          },
          {
            text: "に",
          },
          {
            text: "電車",
          },
          {
            text: "が",
          },
          {
            text: "来",
          },
          {
            text: "ます。",
          },
        ],
        translation: "Le train passe toutes les deux heures.",
      },
    ],
  },
  {
    id: "owaru",
    pattern: "〜おわる",
    jlptLevel: "N4",
    meaning: "finir de faire ~",
    rule: "Verbe (base ます, sans ます) + おわる",
    usage: "Pour indiquer qu’une action est totalement terminée.",
    examples: [
      {
        segments: [
          {
            text: "レポート",
          },
          {
            text: "を",
          },
          {
            text: "書",
          },
          {
            text: "きおわりました。",
            highlight: true,
          },
        ],
        translation: "J'ai fini d'écrire le rapport.",
      },
      {
        segments: [
          {
            text: "本",
          },
          {
            text: "を",
          },
          {
            text: "読",
          },
          {
            text: "みおわりました。",
            highlight: true,
          },
        ],
        translation: "J'ai fini de lire le livre.",
      },
    ],
  },
  {
    id: "gozaimasu",
    pattern: "〜でございます",
    jlptLevel: "N4",
    meaning: "être (forme très polie de です/あります)",
    rule: "Nom + でございます ; あります → ございます",
    usage: "Forme très polie utilisée dans un contexte commercial ou formel (magasins, hôtels, accueil).",
    examples: [
      {
        segments: [
          {
            text: "こちら",
          },
          {
            text: "が",
          },
          {
            text: "会議室",
            reading: "かいぎしつ",
          },
          {
            text: "でございます。",
            highlight: true,
          },
        ],
        translation: "Voici la salle de réunion (forme très polie).",
      },
      {
        segments: [
          {
            text: "お",
          },
          {
            text: "手洗",
            reading: "てあら",
          },
          {
            text: "いは",
          },
          {
            text: "二階",
            reading: "にかい",
          },
          {
            text: "にございます。",
            highlight: true,
          },
        ],
        translation: "Les toilettes se trouvent au premier étage (forme très polie).",
      },
    ],
  },
  {
    id: "dasu",
    pattern: "〜だす",
    jlptLevel: "N4",
    meaning: "se mettre soudainement à faire ~",
    rule: "Verbe (base ます, sans ます) + だす",
    usage: "Pour indiquer le début soudain, souvent inattendu, d’une action.",
    examples: [
      {
        segments: [
          {
            text: "赤",
            reading: "あか",
          },
          {
            text: "ちゃんが",
          },
          {
            text: "急",
            reading: "きゅう",
          },
          {
            text: "に",
          },
          {
            text: "泣",
            reading: "な",
          },
          {
            text: "きだしました。",
            highlight: true,
          },
        ],
        translation: "Le bébé s’est soudainement mis à pleurer.",
      },
      {
        segments: [
          {
            text: "雨",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "りだしました。",
            highlight: true,
          },
        ],
        translation: "Il s'est mis à pleuvoir.",
      },
    ],
  },
  {
    id: "tsuzukeru",
    pattern: "〜続ける",
    patternSegments: [
      { text: "〜" },
      { text: "続", reading: "つづ" },
      { text: "ける" },
    ],
    jlptLevel: "N4",
    meaning: "continuer à faire ~",
    rule: "Verbe (base ます, sans ます) + 続ける",
    usage: "Pour indiquer qu’une action se poursuit sans interruption.",
    examples: [
      {
        segments: [
          {
            text: "三時間",
            reading: "さんじかん",
          },
          {
            text: "勉強",
          },
          {
            text: "し",
          },
          {
            text: "続",
            reading: "つづ",
          },
          {
            text: "けました。",
            highlight: true,
          },
        ],
        translation: "J'ai continué à étudier pendant trois heures.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "歩",
            reading: "ある",
          },
          {
            text: "き",
          },
          {
            text: "続",
            reading: "つづ",
          },
          {
            text: "けました。",
            highlight: true,
          },
        ],
        translation: "Il a continué à marcher.",
      },
    ],
  },
  {
    id: "bakari",
    pattern: "〜ばかり",
    jlptLevel: "N4",
    meaning: "vient de faire ~ ; seulement ~",
    rule: "Verbe (forme た) + ばかり ; Nom + ばかり",
    usage: "Pour indiquer qu’une action vient tout juste de se terminer, ou pour exprimer une restriction (\"seulement\", \"rien que\").",
    examples: [
      {
        segments: [
          {
            text: "さっき",
          },
          {
            text: "着",
          },
          {
            text: "いたばかりです。",
            highlight: true,
          },
        ],
        translation: "Je viens tout juste d’arriver.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "ゲーム",
          },
          {
            text: "ばかり",
            highlight: true,
          },
          {
            text: "しています。",
          },
        ],
        translation: "Il ne fait que jouer aux jeux vidéo.",
      },
    ],
  },
  {
    id: "hajimeru-aux",
    pattern: "〜始める",
    patternSegments: [
      { text: "〜" },
      { text: "始", reading: "はじ" },
      { text: "める" },
    ],
    jlptLevel: "N4",
    meaning: "commencer à faire ~",
    rule: "Verbe (base ます, sans ます) + 始める",
    usage: "Pour indiquer le début d’une action.",
    examples: [
      {
        segments: [
          {
            text: "雨",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "り",
          },
          {
            text: "始",
            reading: "はじ",
          },
          {
            text: "めました。",
            highlight: true,
          },
        ],
        translation: "Il a commencé à pleuvoir.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "が",
          },
          {
            text: "話",
          },
          {
            text: "し",
          },
          {
            text: "始",
            reading: "はじ",
          },
          {
            text: "めました。",
            highlight: true,
          },
        ],
        translation: "L'enfant a commencé à parler.",
      },
    ],
  },
  {
    id: "mama",
    pattern: "〜まま",
    jlptLevel: "N4",
    meaning: "tel quel, dans cet état, sans changement",
    rule: "Verbe (forme た) / Nom + の / Adjectif + まま",
    usage: "Pour indiquer qu’un état reste inchangé pendant qu’une autre action se produit.",
    examples: [
      {
        segments: [
          {
            text: "靴",
            reading: "くつ",
          },
          {
            text: "を",
          },
          {
            text: "履",
            reading: "は",
          },
          {
            text: "いたまま",
            highlight: true,
          },
          {
            text: "部屋",
            reading: "へや",
          },
          {
            text: "に",
          },
          {
            text: "入",
          },
          {
            text: "らないでください。",
          },
        ],
        translation: "N'entrez pas dans la pièce en gardant vos chaussures.",
      },
      {
        segments: [
          {
            text: "エアコン",
          },
          {
            text: "をつけたまま",
            highlight: true,
          },
          {
            text: "寝",
            reading: "ね",
          },
          {
            text: "ました。",
          },
        ],
        translation: "J'ai dormi en laissant la climatisation allumée.",
      },
    ],
  },
  {
    id: "tara-conditional",
    pattern: "〜たら",
    jlptLevel: "N4",
    meaning: "si ~, quand ~ (condition)",
    rule: "Verbe/Adjectif/Nom (forme た) + ら",
    usage: "Pour exprimer une condition générale — si/quand une chose se réalise, alors une autre suit. La forme conditionnelle la plus polyvalente.",
    examples: [
      {
        segments: [
          {
            text: "雨",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "ったら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "行",
          },
          {
            text: "きません。",
          },
        ],
        translation: "S'il pleut, je n'irai pas.",
      },
      {
        segments: [
          {
            text: "駅",
          },
          {
            text: "に",
          },
          {
            text: "着",
          },
          {
            text: "いたら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "電話",
          },
          {
            text: "してください。",
          },
        ],
        translation: "Quand vous arriverez à la gare, appelez-moi, s’il vous plaît.",
      },
    ],
  },
  {
    id: "ba-conditional",
    pattern: "〜ば",
    jlptLevel: "N4",
    meaning: "si ~ (condition, forme ば)",
    rule: "Verbe/Adjectif (forme ば) + phrase",
    usage: "Pour exprimer une condition générale, souvent une règle ou une vérité, moins orientée vers un événement unique que たら.",
    examples: [
      {
        segments: [
          {
            text: "たくさん",
          },
          {
            text: "練習",
            reading: "れんしゅう",
          },
          {
            text: "すれば",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "上手",
          },
          {
            text: "になります。",
          },
        ],
        translation: "Si tu t’entraînes beaucoup, tu deviendras doué.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "ボタン",
          },
          {
            text: "を",
          },
          {
            text: "押",
            reading: "お",
          },
          {
            text: "せば",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ドア",
          },
          {
            text: "が",
          },
          {
            text: "開",
          },
          {
            text: "きます。",
          },
        ],
        translation: "Si vous appuyez sur ce bouton, la porte s'ouvre.",
      },
    ],
  },
  {
    id: "to-conditional",
    pattern: "〜と（条件）",
    patternSegments: [
      { text: "〜" },
      { text: "と" },
      { text: "（" },
      { text: "条件", reading: "じょうけん" },
      { text: "）" },
    ],
    jlptLevel: "N4",
    meaning: "si ~, quand ~ (conséquence automatique)",
    rule: "Verbe/Adjectif (forme au présent) + と",
    usage: "Pour exprimer qu’un résultat suit automatiquement et systématiquement une condition — lois naturelles, habitudes, chemins.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "道",
          },
          {
            text: "を",
          },
          {
            text: "真",
            reading: "ま",
          },
          {
            text: "っすぐ",
          },
          {
            text: "行",
          },
          {
            text: "くと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "駅",
          },
          {
            text: "があります。",
          },
        ],
        translation: "Si vous continuez tout droit sur cette route, il y a la gare.",
      },
      {
        segments: [
          {
            text: "春",
          },
          {
            text: "になると",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "花",
          },
          {
            text: "が",
          },
          {
            text: "咲",
            reading: "さ",
          },
          {
            text: "きます。",
          },
        ],
        translation: "Quand le printemps arrive, les fleurs éclosent.",
      },
    ],
  },
  {
    id: "nara-conditional",
    pattern: "〜なら",
    jlptLevel: "N4",
    meaning: "si c’est le cas de ~, dans ce cas",
    rule: "Nom/Verbe/Adjectif (base) + なら",
    usage: "Pour réagir à un sujet ou une situation déjà mentionnée par l’interlocuteur, en proposant un conseil ou une conséquence adaptée.",
    examples: [
      {
        segments: [
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "を",
          },
          {
            text: "勉強",
          },
          {
            text: "するなら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "この",
          },
          {
            text: "本",
          },
          {
            text: "がいいです。",
          },
        ],
        translation: "Si tu veux étudier le japonais, ce livre est bien.",
      },
      {
        segments: [
          {
            text: "東京",
            reading: "とうきょう",
          },
          {
            text: "に",
          },
          {
            text: "行",
          },
          {
            text: "くなら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "新幹線",
            reading: "しんかんせん",
          },
          {
            text: "が",
          },
          {
            text: "便利",
            reading: "べんり",
          },
          {
            text: "です。",
          },
        ],
        translation: "Si vous allez à Tokyo, le shinkansen est pratique.",
      },
    ],
  },
  {
    id: "te-aru",
    pattern: "〜てある",
    jlptLevel: "N4",
    meaning: "être déjà fait, dans un état résultant d’une action",
    rule: "Verbe transitif (forme て) + ある",
    usage: "Pour décrire l’état résultant d’une action intentionnelle effectuée par quelqu’un, avec un effet visible dans le présent.",
    examples: [
      {
        segments: [
          {
            text: "壁",
            reading: "かべ",
          },
          {
            text: "に",
          },
          {
            text: "絵",
            reading: "え",
          },
          {
            text: "が",
          },
          {
            text: "かけてあります。",
            highlight: true,
          },
        ],
        translation: "Un tableau est accroché au mur (quelqu'un l'a fait exprès).",
      },
      {
        segments: [
          {
            text: "テーブル",
          },
          {
            text: "の",
          },
          {
            text: "上",
          },
          {
            text: "に",
          },
          {
            text: "花",
          },
          {
            text: "が",
          },
          {
            text: "置",
            reading: "お",
          },
          {
            text: "いてあります。",
            highlight: true,
          },
        ],
        translation: "Des fleurs sont posées sur la table.",
      },
    ],
  },
  {
    id: "te-iku",
    pattern: "〜ていく",
    jlptLevel: "N4",
    meaning: "s’éloigner en faisant ~, continuer à faire ~ (à partir de maintenant)",
    rule: "Verbe (forme て) + いく",
    usage: "Pour indiquer un changement ou une action qui s’éloigne du présent vers le futur, ou un déplacement qui s’éloigne du locuteur.",
    examples: [
      {
        segments: [
          {
            text: "これから",
          },
          {
            text: "寒",
          },
          {
            text: "くなっていきます。",
            highlight: true,
          },
        ],
        translation: "Il va faire de plus en plus froid à partir de maintenant.",
      },
      {
        segments: [
          {
            text: "荷物",
            reading: "にもつ",
          },
          {
            text: "を",
          },
          {
            text: "持",
          },
          {
            text: "っていきます。",
            highlight: true,
          },
        ],
        translation: "J'emporte les bagages (avec moi, en partant).",
      },
    ],
  },
  {
    id: "te-kuru",
    pattern: "〜てくる",
    jlptLevel: "N4",
    meaning: "se rapprocher en faisant ~, continuer à faire ~ (jusqu’à maintenant)",
    rule: "Verbe (forme て) + くる",
    usage: "Pour indiquer un changement ou une action qui se rapproche du présent, ou un déplacement qui se rapproche du locuteur.",
    examples: [
      {
        segments: [
          {
            text: "最近",
            reading: "さいきん",
          },
          {
            text: "暖",
            reading: "あたた",
          },
          {
            text: "かくなってきました。",
            highlight: true,
          },
        ],
        translation: "Il a commencé à faire plus doux ces derniers temps.",
      },
      {
        segments: [
          {
            text: "猫",
            reading: "ねこ",
          },
          {
            text: "が",
          },
          {
            text: "走",
          },
          {
            text: "ってきました。",
            highlight: true,
          },
        ],
        translation: "Un chat est arrivé en courant.",
      },
    ],
  },
  {
    id: "you-desu",
    pattern: "〜ようです",
    jlptLevel: "N4",
    meaning: "il semble que ~, on dirait que ~",
    rule: "Verbe/Adjectif (forme normale) + よう ; Nom + の + よう",
    usage: "Pour exprimer une supposition basée sur ce qu’on observe ou ressent soi-même.",
    examples: [
      {
        segments: [
          {
            text: "誰",
            reading: "だれ",
          },
          {
            text: "もいないようです。",
            highlight: true,
          },
        ],
        translation: "On dirait qu'il n'y a personne.",
      },
      {
        segments: [
          {
            text: "田中",
            reading: "たなか",
          },
          {
            text: "さんは",
          },
          {
            text: "病気",
            reading: "びょうき",
          },
          {
            text: "のようです。",
            highlight: true,
          },
        ],
        translation: "On dirait que M. Tanaka est malade.",
      },
    ],
  },
  {
    id: "rashii",
    pattern: "〜らしい",
    jlptLevel: "N4",
    meaning: "il paraît que ~, apparemment ~",
    rule: "Verbe/Adjectif/Nom (forme normale) + らしい",
    usage: "Pour rapporter une information entendue ou lue, dont on n’est pas totalement sûr — proche de そうです mais suggère une déduction personnelle en plus du ouï-dire.",
    examples: [
      {
        segments: [
          {
            text: "来年",
            reading: "らいねん",
          },
          {
            text: "、",
          },
          {
            text: "新",
            reading: "あたら",
          },
          {
            text: "しい",
          },
          {
            text: "駅",
          },
          {
            text: "ができるらしいです。",
            highlight: true,
          },
        ],
        translation: "Il paraît qu'une nouvelle gare va ouvrir l'année prochaine.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "来",
            reading: "こ",
          },
          {
            text: "ないらしいです。",
            highlight: true,
          },
        ],
        translation: "Il paraît qu'elle ne viendra pas.",
      },
    ],
  },
  {
    id: "passive-voice",
    pattern: "〜れる・られる（受身形）",
    patternSegments: [
      { text: "〜" },
      { text: "れる・られる" },
      { text: "（" },
      { text: "受身形", reading: "うけみけい" },
      { text: "）" },
    ],
    jlptLevel: "N4",
    meaning: "forme passive : être fait ~ (par quelqu’un)",
    rule: "Godan：あ段 + れる ; Ichidan：語幹 + られる ; する→される、来る→来られる",
    usage: "Pour exprimer qu’on subit une action, souvent avec une nuance de gêne ou de désagrément (mais pas toujours).",
    examples: [
      {
        segments: [
          {
            text: "電車",
            reading: "でんしゃ",
          },
          {
            text: "の",
          },
          {
            text: "中",
            reading: "なか",
          },
          {
            text: "で",
          },
          {
            text: "足",
            reading: "あし",
          },
          {
            text: "を",
          },
          {
            text: "踏",
            reading: "ふ",
          },
          {
            text: "まれました。",
            highlight: true,
          },
        ],
        translation: "On m'a marché sur le pied dans le train.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "本",
          },
          {
            text: "は",
          },
          {
            text: "多",
            reading: "おお",
          },
          {
            text: "くの",
          },
          {
            text: "人",
          },
          {
            text: "に",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "まれています。",
            highlight: true,
          },
        ],
        translation: "Ce livre est lu par beaucoup de gens.",
      },
    ],
  },
  {
    id: "causative-voice",
    pattern: "〜せる・させる（使役形）",
    patternSegments: [
      { text: "〜" },
      { text: "せる・させる" },
      { text: "（" },
      { text: "使役形", reading: "しえきけい" },
      { text: "）" },
    ],
    jlptLevel: "N4",
    meaning: "forme causative : faire faire ~, laisser faire ~",
    rule: "Godan：あ段 + せる ; Ichidan：語幹 + させる ; する→させる、来る→来させる",
    usage: "Pour exprimer qu’on fait faire quelque chose à quelqu’un (obligation) ou qu’on le laisse faire (permission).",
    examples: [
      {
        segments: [
          {
            text: "先生",
          },
          {
            text: "は",
          },
          {
            text: "学生",
            reading: "がくせい",
          },
          {
            text: "に",
          },
          {
            text: "本",
          },
          {
            text: "を",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "ませました。",
            highlight: true,
          },
        ],
        translation: "Le professeur a fait lire un livre aux étudiants.",
      },
      {
        segments: [
          {
            text: "母",
          },
          {
            text: "は",
          },
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "を",
          },
          {
            text: "公園",
            reading: "こうえん",
          },
          {
            text: "で",
          },
          {
            text: "遊",
            reading: "あそ",
          },
          {
            text: "ばせました。",
            highlight: true,
          },
        ],
        translation: "La mère a laissé l'enfant jouer au parc.",
      },
    ],
  },
  {
    id: "causative-passive",
    pattern: "〜させられる（使役受身形）",
    patternSegments: [
      { text: "〜" },
      { text: "させられる" },
      { text: "（" },
      { text: "使役受身形", reading: "しえきうけみけい" },
      { text: "）" },
    ],
    jlptLevel: "N4",
    meaning: "être forcé de faire ~",
    rule: "Verbe (forme causative) + られる",
    usage: "Pour exprimer qu’on est contraint de faire quelque chose contre sa volonté, par une autre personne.",
    examples: [
      {
        segments: [
          {
            text: "毎日",
            reading: "まいにち",
          },
          {
            text: "野菜",
            reading: "やさい",
          },
          {
            text: "を",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べさせられます。",
            highlight: true,
          },
        ],
        translation: "Je suis obligé de manger des légumes tous les jours.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "の",
          },
          {
            text: "時",
            reading: "とき",
          },
          {
            text: "、",
          },
          {
            text: "よく",
          },
          {
            text: "ピアノ",
          },
          {
            text: "を",
          },
          {
            text: "練習",
            reading: "れんしゅう",
          },
          {
            text: "させられました。",
            highlight: true,
          },
        ],
        translation: "Quand j'étais enfant, on me forçait souvent à m'entraîner au piano.",
      },
    ],
  },
  {
    id: "you-ni-naru",
    pattern: "〜ようになる",
    jlptLevel: "N4",
    meaning: "en venir à faire ~, devenir capable de ~",
    rule: "Verbe (forme dictionnaire ou potentielle) + ようになる",
    usage: "Pour exprimer un changement progressif d’état ou de capacité au fil du temps.",
    examples: [
      {
        segments: [
          {
            text: "漢字",
            reading: "かんじ",
          },
          {
            text: "が",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "めるようになりました。",
            highlight: true,
          },
        ],
        translation: "Je suis devenu capable de lire les kanjis.",
      },
      {
        segments: [
          {
            text: "毎日",
            reading: "まいにち",
          },
          {
            text: "運動",
            reading: "うんどう",
          },
          {
            text: "するようになりました。",
            highlight: true,
          },
        ],
        translation: "J'en suis venu à faire du sport tous les jours.",
      },
    ],
  },
  {
    id: "koto-ni-naru",
    pattern: "〜ことになる",
    jlptLevel: "N4",
    meaning: "il a été décidé que ~ (décision impersonnelle)",
    rule: "Verbe (forme dictionnaire ou ない) + ことになる",
    usage: "Pour exprimer une décision ou un arrangement pris, souvent par un groupe ou des circonstances plutôt que par le locuteur lui-même.",
    examples: [
      {
        segments: [
          {
            text: "来月",
            reading: "らいげつ",
          },
          {
            text: "、",
          },
          {
            text: "大阪",
            reading: "おおさか",
          },
          {
            text: "に",
          },
          {
            text: "転勤",
            reading: "てんきん",
          },
          {
            text: "することになりました。",
            highlight: true,
          },
        ],
        translation: "Il a été décidé que je serais transféré à Osaka le mois prochain.",
      },
      {
        segments: [
          {
            text: "会議",
            reading: "かいぎ",
          },
          {
            text: "は",
          },
          {
            text: "中止",
            reading: "ちゅうし",
          },
          {
            text: "ということになりました。",
            highlight: true,
          },
        ],
        translation: "Il a été décidé que la réunion était annulée.",
      },
    ],
  },
  {
    id: "koto-ga-aru-habit",
    pattern: "〜ことがある",
    jlptLevel: "N4",
    meaning: "il arrive parfois que ~, ça arrive de ~",
    rule: "Verbe (forme dictionnaire) + ことがある",
    usage: "Pour exprimer une fréquence occasionnelle — à ne pas confondre avec 〜たことがあります (l’expérience passée).",
    examples: [
      {
        segments: [
          {
            text: "時々",
            reading: "ときどき",
          },
          {
            text: "一人",
            reading: "ひとり",
          },
          {
            text: "で",
          },
          {
            text: "映画",
            reading: "えいが",
          },
          {
            text: "を",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "ることがあります。",
            highlight: true,
          },
        ],
        translation: "Il m'arrive parfois d'aller au cinéma seul.",
      },
      {
        segments: [
          {
            text: "朝",
            reading: "あさ",
          },
          {
            text: "、",
          },
          {
            text: "寝坊",
            reading: "ねぼう",
          },
          {
            text: "することがあります。",
            highlight: true,
          },
        ],
        translation: "Il m’arrive de me réveiller trop tard le matin.",
      },
    ],
  },
  {
    id: "koto-ni-suru",
    pattern: "〜ことにする",
    jlptLevel: "N4",
    meaning: "décider de ~",
    rule: "Verbe (forme dictionnaire ou ない) + ことにする",
    usage: "Pour exprimer une décision personnelle prise par le locuteur lui-même.",
    examples: [
      {
        segments: [
          {
            text: "来年",
            reading: "らいねん",
          },
          {
            text: "、",
          },
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "に",
          },
          {
            text: "留学",
            reading: "りゅうがく",
          },
          {
            text: "することにしました。",
            highlight: true,
          },
        ],
        translation: "J'ai décidé de partir étudier au Japon l'année prochaine.",
      },
      {
        segments: [
          {
            text: "タバコ",
          },
          {
            text: "を",
          },
          {
            text: "吸",
            reading: "す",
          },
          {
            text: "わないことにしました。",
            highlight: true,
          },
        ],
        translation: "J'ai décidé de ne plus fumer.",
      },
    ],
  },
  {
    id: "tsumori-da",
    pattern: "〜つもりだ",
    jlptLevel: "N4",
    meaning: "avoir l’intention de ~",
    rule: "Verbe (forme dictionnaire ou ない) + つもりだ",
    usage: "Pour exprimer une intention ou un plan personnel du locuteur.",
    examples: [
      {
        segments: [
          {
            text: "来月",
            reading: "らいげつ",
          },
          {
            text: "、",
          },
          {
            text: "引",
            reading: "ひ",
          },
          {
            text: "っ",
          },
          {
            text: "越",
            reading: "こ",
          },
          {
            text: "すつもりです。",
            highlight: true,
          },
        ],
        translation: "J'ai l'intention de déménager le mois prochain.",
      },
      {
        segments: [
          {
            text: "今年",
            reading: "ことし",
          },
          {
            text: "は",
          },
          {
            text: "旅行",
            reading: "りょこう",
          },
          {
            text: "しないつもりです。",
            highlight: true,
          },
        ],
        translation: "Je n'ai pas l'intention de voyager cette année.",
      },
    ],
  },
  {
    id: "hazu-da",
    pattern: "〜はずだ",
    jlptLevel: "N4",
    meaning: "ça devrait être ~, c’est censé être ~",
    rule: "Verbe/Adjectif (forme normale) + はず ; Nom + の + はず",
    usage: "Pour exprimer une forte attente logique basée sur des informations connues, pas une simple supposition.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "来",
            reading: "く",
          },
          {
            text: "るはずです。",
            highlight: true,
          },
        ],
        translation: "Il devrait venir (selon ce que je sais).",
      },
      {
        segments: [
          {
            text: "今日",
            reading: "きょう",
          },
          {
            text: "は",
          },
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "みのはずです。",
            highlight: true,
          },
        ],
        translation: "Aujourd'hui devrait être un jour de congé.",
      },
    ],
  },
  {
    id: "you-ni-purpose",
    pattern: "〜ように",
    jlptLevel: "N4",
    meaning: "de sorte que ~, afin que ~",
    rule: "Verbe (forme dictionnaire, ない ou potentielle) + ように",
    usage: "Pour exprimer un but visé, avec un verbe qui n’est pas totalement contrôlable par le locuteur (contrairement à ために).",
    examples: [
      {
        segments: [
          {
            text: "忘",
            reading: "わす",
          },
          {
            text: "れないように",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "メモ",
          },
          {
            text: "をします。",
          },
        ],
        translation: "Je prends des notes pour ne pas oublier.",
      },
      {
        segments: [
          {
            text: "皆",
            reading: "みな",
          },
          {
            text: "さんに",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "こえるように",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "大",
            reading: "おお",
          },
          {
            text: "きい",
          },
          {
            text: "声",
            reading: "こえ",
          },
          {
            text: "で",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "します。",
          },
        ],
        translation: "Je parle fort pour que tout le monde puisse entendre.",
      },
    ],
  },
  {
    id: "tame-ni-purpose",
    pattern: "〜ために",
    jlptLevel: "N4",
    meaning: "afin de ~, à cause de ~ (but ou cause)",
    rule: "Verbe (forme dictionnaire) / Nom + の + ために",
    usage: "Pour exprimer un but visé volontairement (avec un verbe contrôlable), ou une cause selon le contexte.",
    examples: [
      {
        segments: [
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "を",
          },
          {
            text: "上手",
            reading: "じょうず",
          },
          {
            text: "に",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "すために",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "毎日",
            reading: "まいにち",
          },
          {
            text: "練習",
            reading: "れんしゅう",
          },
          {
            text: "します。",
          },
        ],
        translation: "Je m’entraîne tous les jours afin de bien parler japonais.",
      },
      {
        segments: [
          {
            text: "台風",
            reading: "たいふう",
          },
          {
            text: "のために",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "電車",
            reading: "でんしゃ",
          },
          {
            text: "が",
          },
          {
            text: "止",
            reading: "と",
          },
          {
            text: "まりました。",
          },
        ],
        translation: "À cause du typhon, les trains se sont arrêtés.",
      },
    ],
  },
  {
    id: "noni-although",
    pattern: "〜のに",
    jlptLevel: "N4",
    meaning: "alors que ~, bien que ~ (résultat inattendu)",
    rule: "Verbe/Adjectif (forme normale) + のに ; Nom/な形容詞 + な + のに",
    usage: "Pour exprimer une surprise, une déception ou un contraste inattendu entre deux faits.",
    examples: [
      {
        segments: [
          {
            text: "一生懸命",
            reading: "いっしょうけんめい",
          },
          {
            text: "勉強",
            reading: "べんきょう",
          },
          {
            text: "したのに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "試験",
            reading: "しけん",
          },
          {
            text: "に",
          },
          {
            text: "落",
            reading: "お",
          },
          {
            text: "ちました。",
          },
        ],
        translation: "Bien que j'aie étudié dur, j'ai échoué à l'examen.",
      },
      {
        segments: [
          {
            text: "夏",
            reading: "なつ",
          },
          {
            text: "なのに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "今日",
            reading: "きょう",
          },
          {
            text: "は",
          },
          {
            text: "寒",
            reading: "さむ",
          },
          {
            text: "いです。",
          },
        ],
        translation: "Bien qu'on soit en été, il fait froid aujourd'hui.",
      },
    ],
  },
  {
    id: "shi-listing",
    pattern: "〜し",
    jlptLevel: "N4",
    meaning: "~, et en plus ~ (énumération de raisons)",
    rule: "Verbe/Adjectif/Nom (forme normale) + し",
    usage: "Pour énumérer plusieurs raisons ou caractéristiques qui, ensemble, justifient une conclusion.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "レストラン",
          },
          {
            text: "は",
          },
          {
            text: "安",
            reading: "やす",
          },
          {
            text: "いし",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "おいしいです。",
          },
        ],
        translation: "Ce restaurant est bon marché, et en plus c’est délicieux.",
      },
      {
        segments: [
          {
            text: "雨",
          },
          {
            text: "も",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "っているし",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "風",
            reading: "かぜ",
          },
          {
            text: "も",
          },
          {
            text: "強",
            reading: "つよ",
          },
          {
            text: "いです。",
          },
        ],
        translation: "Il pleut, et en plus le vent souffle fort.",
      },
    ],
  },
  {
    id: "volitional-form",
    pattern: "〜よう（意向形）",
    patternSegments: [
      { text: "〜" },
      { text: "よう" },
      { text: "（" },
      { text: "意向形", reading: "いこうけい" },
      { text: "）" },
    ],
    jlptLevel: "N4",
    meaning: "forme volitive : allons faire ~, je vais faire ~",
    rule: "Godan：う段→お段 + う ; Ichidan：語幹 + よう ; する→しよう、来る→来よう",
    usage: "Forme familière équivalente à 〜ましょう — pour proposer une action ou exprimer sa propre intention, souvent suivie de と思う.",
    examples: [
      {
        segments: [
          {
            text: "ちょっと",
          },
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "もう。",
            highlight: true,
          },
        ],
        translation: "Reposons-nous un peu.",
      },
      {
        segments: [
          {
            text: "今年",
            reading: "ことし",
          },
          {
            text: "こそ",
          },
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "を",
          },
          {
            text: "頑張",
            reading: "がんば",
          },
          {
            text: "ろうと",
            highlight: true,
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "います。",
          },
        ],
        translation: "Je me dis que cette année, je vais vraiment m’efforcer en japonais.",
      },
    ],
  },
  {
    id: "o-ni-naru",
    pattern: "お〜になる",
    jlptLevel: "N4",
    meaning: "forme honorifique de faire ~",
    rule: "お + Verbe (base ます, sans ます) + になる",
    usage: "Forme honorifique pour parler des actions d’une personne qu’on respecte (client, supérieur, professeur).",
    examples: [
      {
        segments: [
          {
            text: "先生",
          },
          {
            text: "は",
          },
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "、",
          },
          {
            text: "大阪",
            reading: "おおさか",
          },
          {
            text: "へお",
          },
          {
            text: "帰",
            reading: "かえ",
          },
          {
            text: "りになります。",
            highlight: true,
          },
        ],
        translation: "Le professeur rentrera à Osaka demain (forme honorifique).",
      },
      {
        segments: [
          {
            text: "何時",
            reading: "なんじ",
          },
          {
            text: "にお",
          },
          {
            text: "起",
            reading: "お",
          },
          {
            text: "きになりますか。",
            highlight: true,
          },
        ],
        translation: "À quelle heure vous levez-vous ? (forme honorifique)",
      },
    ],
  },
  {
    id: "o-suru",
    pattern: "お〜する",
    jlptLevel: "N4",
    meaning: "forme humble de faire ~",
    rule: "お + Verbe (base ます, sans ます) + する",
    usage: "Forme humble pour parler de ses propres actions envers une personne qu’on respecte.",
    examples: [
      {
        segments: [
          {
            text: "お",
          },
          {
            text: "荷物",
            reading: "にもつ",
          },
          {
            text: "をお",
          },
          {
            text: "持",
            reading: "も",
          },
          {
            text: "ちします。",
            highlight: true,
          },
        ],
        translation: "Je vais porter vos bagages (forme humble).",
      },
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "、",
          },
          {
            text: "また",
          },
          {
            text: "、",
          },
          {
            text: "お",
          },
          {
            text: "電話",
            reading: "でんわ",
          },
          {
            text: "します。",
            highlight: true,
          },
        ],
        translation: "Je vous rappellerai demain (forme humble).",
      },
    ],
  },
  {
    id: "ba-hodo",
    pattern: "〜ば〜ほど",
    jlptLevel: "N4",
    meaning: "plus ~, plus ~",
    rule: "Verbe/Adjectif (forme ば) + même verbe/adjectif (forme dictionnaire) + ほど",
    usage: "Pour exprimer une corrélation proportionnelle entre deux éléments qui augmentent ensemble.",
    examples: [
      {
        segments: [
          {
            text: "練習",
            reading: "れんしゅう",
          },
          {
            text: "すれば",
            highlight: true,
          },
          {
            text: "する",
            highlight: true,
          },
          {
            text: "ほど",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "上手",
            reading: "じょうず",
          },
          {
            text: "になります。",
          },
        ],
        translation: "Plus on s’entraîne, plus on devient doué.",
      },
      {
        segments: [
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "ければ",
            highlight: true,
          },
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "い",
            highlight: true,
          },
          {
            text: "ほど",
            highlight: true,
          },
          {
            text: "いいです。",
          },
        ],
        translation: "Plus tôt c’est, mieux c’est.",
      },
    ],
  },
  {
    id: "njanai-softened",
    pattern: "〜んじゃない",
    jlptLevel: "N4",
    meaning: "ce n’est pas ~ ? (opinion adoucie, familier)",
    rule: "Verbe/Adjectif (forme normale) + んじゃない ; な形容詞・名詞 + なんじゃない",
    usage: "Forme familière (contraction de 〜のではないか) pour exprimer une opinion ou une supposition de façon adoucie.",
    examples: [
      {
        segments: [
          {
            text: "それ",
          },
          {
            text: "は",
          },
          {
            text: "無理",
            reading: "むり",
          },
          {
            text: "なんじゃない。",
            highlight: true,
          },
        ],
        translation: "C'est pas un peu impossible, ça ?",
      },
      {
        segments: [
          {
            text: "もう",
          },
          {
            text: "遅",
            reading: "おそ",
          },
          {
            text: "いんじゃない。",
            highlight: true,
          },
        ],
        translation: "C'est pas déjà trop tard ?",
      },
    ],
  },
  {
    id: "potential-form",
    pattern: "〜れる・られる（可能形）",
    patternSegments: [
      { text: "〜" },
      { text: "れる・られる" },
      { text: "（" },
      { text: "可能形", reading: "かのうけい" },
      { text: "）" },
    ],
    jlptLevel: "N4",
    meaning: "forme potentielle : pouvoir faire ~",
    rule: "Godan：う段→え段 + る ; Ichidan：語幹 + られる ; する→できる、来る→来られる",
    usage: "Pour exprimer la capacité de faire quelque chose, dans un style plus naturel que 〜ことができる.",
    examples: [
      {
        segments: [
          {
            text: "私",
          },
          {
            text: "は",
          },
          {
            text: "漢字",
            reading: "かんじ",
          },
          {
            text: "が",
          },
          {
            text: "少",
            reading: "すこ",
          },
          {
            text: "し",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "めます。",
            highlight: true,
          },
        ],
        translation: "Je peux lire un peu les kanjis.",
      },
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "は",
          },
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "く",
          },
          {
            text: "起",
            reading: "お",
          },
          {
            text: "きられません。",
            highlight: true,
          },
        ],
        translation: "Je ne pourrai pas me lever tôt demain.",
      },
    ],
  },
  {
    id: "tagaru",
    pattern: "〜たがる",
    jlptLevel: "N4",
    meaning: "(quelqu’un d’autre) veut faire ~",
    rule: "Verbe (base ます, sans ます) + たがる",
    usage: "Pour décrire le désir apparent d’une tierce personne — 〜たい ne s’utilise que pour le locuteur lui-même.",
    examples: [
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "は",
          },
          {
            text: "お",
          },
          {
            text: "菓子",
            reading: "かし",
          },
          {
            text: "を",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べたがります。",
            highlight: true,
          },
        ],
        translation: "L'enfant veut manger des sucreries.",
      },
      {
        segments: [
          {
            text: "弟",
          },
          {
            text: "は",
          },
          {
            text: "新",
            reading: "あたら",
          },
          {
            text: "しい",
          },
          {
            text: "ゲーム",
          },
          {
            text: "を",
          },
          {
            text: "買",
            reading: "か",
          },
          {
            text: "いたがっています。",
            highlight: true,
          },
        ],
        translation: "Mon petit frère veut acheter un nouveau jeu.",
      },
    ],
  },
  {
    id: "garu",
    pattern: "〜がる",
    jlptLevel: "N4",
    meaning: "(quelqu’un d’autre) semble ~, montre des signes de ~",
    rule: "い形容詞 (radical, sans い) + がる",
    usage: "Pour transformer un adjectif de sentiment en verbe décrivant l’état apparent d’une tierce personne.",
    examples: [
      {
        segments: [
          {
            text: "妹",
          },
          {
            text: "は",
          },
          {
            text: "寒",
            reading: "さむ",
          },
          {
            text: "がっています。",
            highlight: true,
          },
        ],
        translation: "Ma petite sœur a l'air d'avoir froid.",
      },
      {
        segments: [
          {
            text: "犬",
          },
          {
            text: "は",
          },
          {
            text: "水",
          },
          {
            text: "を",
          },
          {
            text: "怖",
            reading: "こわ",
          },
          {
            text: "がります。",
            highlight: true,
          },
        ],
        translation: "Le chien a peur de l'eau.",
      },
    ],
  },
  {
    id: "zu-ni",
    pattern: "〜ずに",
    jlptLevel: "N4",
    meaning: "sans faire ~",
    rule: "Verbe (forme ない, sans ない) + ずに ; する → せずに",
    usage: "Équivalent plus littéraire de 〜ないで — indique qu’une action se fait sans qu’une autre soit réalisée.",
    examples: [
      {
        segments: [
          {
            text: "朝",
            reading: "あさ",
          },
          {
            text: "ご",
          },
          {
            text: "飯",
            reading: "はん",
          },
          {
            text: "を",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べずに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "学校",
            reading: "がっこう",
          },
          {
            text: "へ",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "きました。",
          },
        ],
        translation: "Je suis allé à l'école sans prendre de petit-déjeuner.",
      },
      {
        segments: [
          {
            text: "誰",
            reading: "だれ",
          },
          {
            text: "にも",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "わずに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "出",
            reading: "で",
          },
          {
            text: "かけました。",
          },
        ],
        translation: "Je suis sorti sans rien dire à personne.",
      },
    ],
  },
  {
    id: "te-hoshii",
    pattern: "〜てほしい",
    jlptLevel: "N4",
    meaning: "vouloir que quelqu’un fasse ~",
    rule: "Verbe (forme て) + ほしい",
    usage: "Pour exprimer un souhait envers une autre personne — \"je veux que tu fasses ~\".",
    examples: [
      {
        segments: [
          {
            text: "もっと",
          },
          {
            text: "野菜",
            reading: "やさい",
          },
          {
            text: "を",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べてほしいです。",
            highlight: true,
          },
        ],
        translation: "Je veux que tu manges plus de légumes.",
      },
      {
        segments: [
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "く",
          },
          {
            text: "元気",
            reading: "げんき",
          },
          {
            text: "になってほしいです。",
            highlight: true,
          },
        ],
        translation: "J’espère que tu te rétabliras vite.",
      },
    ],
  },
  {
    id: "ta-bakari",
    pattern: "〜たばかり",
    jlptLevel: "N3",
    meaning: "Venir de faire ~",
    rule: "Verbe (forme た) + ばかり",
    usage: "Pour indiquer qu'une action vient de se terminer, souvent avec le sentiment que c'est très récent.",
    examples: [
      {
        segments: [
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "に",
          },
          {
            text: "来",
            reading: "き",
          },
          {
            text: "たばかりです。",
            highlight: true,
          },
        ],
        translation: "Je viens d'arriver au Japon.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "は",
          },
          {
            text: "買",
            reading: "か",
          },
          {
            text: "ったばかりです。",
            highlight: true,
          },
        ],
        translation: "Je viens d'acheter ce livre.",
      },
    ],
  },
  {
    id: "okagede",
    pattern: "〜おかげで",
    jlptLevel: "N3",
    meaning: "Grâce à ~",
    rule: "Nom の / Verbe (forme辞書) + おかげで",
    usage: "Pour exprimer qu'un résultat positif est dû à une cause.",
    examples: [
      {
        segments: [
          {
            text: "先生",
            reading: "せんせい",
          },
          {
            text: "の",
          },
          {
            text: "おかげで",
            highlight: true,
          },
          {
            text: "合格",
            reading: "ごうかく",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Grâce au professeur, j'ai réussi.",
      },
      {
        segments: [
          {
            text: "手伝",
            reading: "てつだ",
          },
          {
            text: "ってくれた",
          },
          {
            text: "おかげで",
            highlight: true,
          },
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "く",
          },
          {
            text: "終",
            reading: "お",
          },
          {
            text: "わりました。",
          },
        ],
        translation: "Grâce à ton aide, j'ai fini plus tôt.",
      },
    ],
  },
  {
    id: "seide",
    pattern: "〜せいで",
    jlptLevel: "N3",
    meaning: "À cause de ~ (nuance de blâme)",
    rule: "Nom の / Verbe (forme辞書) + せいで",
    usage: "Pour exprimer qu'un résultat négatif est dû à une cause, souvent avec une nuance de reproche.",
    examples: [
      {
        segments: [
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "の",
          },
          {
            text: "せいで",
            highlight: true,
          },
          {
            text: "試合",
            reading: "しあい",
          },
          {
            text: "が",
          },
          {
            text: "中止",
            reading: "ちゅうし",
          },
          {
            text: "になりました。",
          },
        ],
        translation: "À cause de la pluie, le match a été annulé.",
      },
      {
        segments: [
          {
            text: "寝坊",
            reading: "ねぼう",
          },
          {
            text: "した",
          },
          {
            text: "せいで",
            highlight: true,
          },
          {
            text: "遅刻",
            reading: "ちこく",
          },
          {
            text: "しました。",
          },
        ],
        translation: "À cause de mon réveil tardif, j'ai été en retard.",
      },
    ],
  },
  {
    id: "tabi-ni",
    pattern: "〜たびに",
    jlptLevel: "N3",
    meaning: "Chaque fois que ~",
    rule: "Verbe (forme辞書) / Nom の + たびに",
    usage: "Pour exprimer qu'à chaque occurrence d'une action, quelque chose se produit également.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "に",
          },
          {
            text: "会",
            reading: "あ",
          },
          {
            text: "うたびに",
            highlight: true,
          },
          {
            text: "元気",
            reading: "げんき",
          },
          {
            text: "になります。",
          },
        ],
        translation: "Chaque fois que je le vois, cela me redonne du courage.",
      },
      {
        segments: [
          {
            text: "旅行",
            reading: "りょこう",
          },
          {
            text: "の",
          },
          {
            text: "たびに",
            highlight: true,
          },
          {
            text: "写真",
            reading: "しゃしん",
          },
          {
            text: "を",
          },
          {
            text: "撮",
            reading: "と",
          },
          {
            text: "ります。",
          },
        ],
        translation: "Je prends des photos à chaque voyage.",
      },
    ],
  },
  {
    id: "ageku",
    pattern: "〜あげく",
    jlptLevel: "N3",
    meaning: "Après tout ça, finalement (résultat souvent négatif)",
    rule: "Verbe (forme た) + あげく",
    usage: "Pour exprimer qu'après beaucoup d'efforts ou de temps, on arrive à un résultat souvent décevant.",
    examples: [
      {
        segments: [
          {
            text: "長",
            reading: "なが",
          },
          {
            text: "い",
          },
          {
            text: "間",
            reading: "あいだ",
          },
          {
            text: "悩",
            reading: "なや",
          },
          {
            text: "んだあげく",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "会社",
            reading: "かいしゃ",
          },
          {
            text: "を",
          },
          {
            text: "辞",
            reading: "や",
          },
          {
            text: "めました。",
          },
        ],
        translation: "Après avoir beaucoup hésité, j'ai finalement démissionné.",
      },
      {
        segments: [
          {
            text: "色々",
            reading: "いろいろ",
          },
          {
            text: "悩",
            reading: "なや",
          },
          {
            text: "んだあげく",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "決",
            reading: "き",
          },
          {
            text: "められませんでした。",
          },
        ],
        translation: "Après avoir beaucoup réfléchi, je n'ai pas pu me décider.",
      },
    ],
  },
  {
    id: "tsutsu",
    pattern: "〜つつ",
    jlptLevel: "N3",
    meaning: "Tout en faisant ~ / bien que",
    rule: "Verbe (forme ます) + つつ",
    usage: "Pour exprimer deux actions simultanées, ou une opposition entre ce qu'on fait et ce qu'on pense.",
    examples: [
      {
        segments: [
          {
            text: "音楽",
            reading: "おんがく",
          },
          {
            text: "を",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "きつつ",
            highlight: true,
          },
          {
            text: "勉強",
            reading: "べんきょう",
          },
          {
            text: "します。",
          },
        ],
        translation: "J'étudie tout en écoutant de la musique.",
      },
      {
        segments: [
          {
            text: "悪",
            reading: "わる",
          },
          {
            text: "いと",
          },
          {
            text: "知",
            reading: "し",
          },
          {
            text: "りつつ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "やめられません。",
          },
        ],
        translation: "Je sais que c'est mauvais, mais je ne peux pas m'arrêter.",
      },
    ],
  },
  {
    id: "wake-da",
    pattern: "〜わけだ",
    jlptLevel: "N3",
    meaning: "Cela veut dire que ~ / logique que",
    rule: "Verbe/adjectif (forme normale) + わけだ",
    usage: "Pour exprimer une conclusion logique tirée d'une situation, ou confirmer qu'on comprend pourquoi.",
    examples: [
      {
        segments: [
          {
            text: "毎日",
            reading: "まいにち",
          },
          {
            text: "練習",
            reading: "れんしゅう",
          },
          {
            text: "しているから",
          },
          {
            text: "、",
          },
          {
            text: "上手",
            reading: "じょうず",
          },
          {
            text: "になる",
          },
          {
            text: "わけだ",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "S'il s'entraîne tous les jours, c'est logique qu'il progresse.",
      },
      {
        segments: [
          {
            text: "十年",
            reading: "じゅうねん",
          },
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "に",
          },
          {
            text: "住",
            reading: "す",
          },
          {
            text: "んでいた",
          },
          {
            text: "わけだ",
            highlight: true,
          },
          {
            text: "から",
          },
          {
            text: "、",
          },
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "が",
          },
          {
            text: "上手",
            reading: "じょうず",
          },
          {
            text: "なんですね。",
          },
        ],
        translation: "Vous avez vécu dix ans au Japon, alors c'est normal que vous parliez si bien japonais.",
      },
    ],
  },
  {
    id: "wake-niwa-ikanai",
    pattern: "〜わけにはいかない",
    jlptLevel: "N3",
    meaning: "Ne peut pas se permettre de ~",
    rule: "Verbe (forme辞書) + わけにはいかない",
    usage: "Pour exprimer qu'on ne peut pas faire quelque chose pour des raisons sociales, morales ou de circonstances.",
    examples: [
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "は",
          },
          {
            text: "大切",
            reading: "たいせつ",
          },
          {
            text: "な",
          },
          {
            text: "会議",
            reading: "かいぎ",
          },
          {
            text: "なので",
          },
          {
            text: "、",
          },
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "む",
          },
          {
            text: "わけにはいかない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Demain il y a une réunion importante, je ne peux pas me permettre de manquer.",
      },
      {
        segments: [
          {
            text: "約束",
            reading: "やくそく",
          },
          {
            text: "したので",
          },
          {
            text: "、",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "かない",
          },
          {
            text: "わけにはいかない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "J'ai promis, je ne peux pas ne pas y aller.",
      },
    ],
  },
  {
    id: "dokoroka",
    pattern: "〜どころか",
    jlptLevel: "N3",
    meaning: "Loin de ~, bien au contraire",
    rule: "Nom / Verbe/adjectif (forme normale) + どころか",
    usage: "Pour contredire fortement une attente, en indiquant que la réalité est à l'opposé.",
    examples: [
      {
        segments: [
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "めるどころか",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "もっと",
          },
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しくなりました。",
          },
        ],
        translation: "Loin de pouvoir me reposer, je suis devenu encore plus occupé.",
      },
      {
        segments: [
          {
            text: "安",
            reading: "やす",
          },
          {
            text: "いどころか",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "とても",
          },
          {
            text: "高",
            reading: "たか",
          },
          {
            text: "かったです。",
          },
        ],
        translation: "Loin d'être bon marché, c'était très cher.",
      },
    ],
  },
  {
    id: "ni-chigainai",
    pattern: "〜に違いない",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "違", reading: "ちが" },
      { text: "いない" },
    ],
    jlptLevel: "N3",
    meaning: "Ça ne peut être que ~, c’est sûrement ~",
    rule: "Nom / Verbe/adjectif (forme normale) + に違いない",
    usage: "Pour exprimer une conviction forte basée sur des indices, même sans certitude absolue.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "味",
            reading: "あじ",
          },
          {
            text: "は",
          },
          {
            text: "母",
            reading: "はは",
          },
          {
            text: "が",
          },
          {
            text: "作",
            reading: "つく",
          },
          {
            text: "った",
          },
          {
            text: "に",
          },
          {
            text: "違",
            reading: "ちが",
          },
          {
            text: "いない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Ce goût, c’est sûrement ma mère qui l’a préparé.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "疲",
            reading: "つか",
          },
          {
            text: "れている",
          },
          {
            text: "に",
          },
          {
            text: "違",
            reading: "ちが",
          },
          {
            text: "いない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il doit sûrement être fatigué.",
      },
    ],
  },
  {
    id: "gachi",
    pattern: "〜がち",
    jlptLevel: "N3",
    meaning: "Avoir tendance à ~",
    rule: "Verbe (forme ます) / Nom + がち",
    usage: "Pour exprimer une tendance fréquente, souvent négative (ex. être souvent malade, oublier souvent).",
    examples: [
      {
        segments: [
          {
            text: "最近",
            reading: "さいきん",
          },
          {
            text: "、",
          },
          {
            text: "風邪",
            reading: "かぜ",
          },
          {
            text: "を",
          },
          {
            text: "引",
            reading: "ひ",
          },
          {
            text: "きがち",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Ces derniers temps, j'ai souvent tendance à attraper froid.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "約束",
            reading: "やくそく",
          },
          {
            text: "を",
          },
          {
            text: "忘",
            reading: "わす",
          },
          {
            text: "れがち",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Il a tendance à oublier ses rendez-vous.",
      },
    ],
  },
  {
    id: "kiri",
    pattern: "〜きり",
    jlptLevel: "N3",
    meaning: "Seulement ~, depuis que ~ (rien d’autre après)",
    rule: "Verbe (forme た) / Nom + きり",
    usage: "Pour exprimer que depuis un événement, rien d'autre ne s'est passé, ou pour limiter à un seul élément.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "とは",
          },
          {
            text: "一度",
            reading: "いちど",
          },
          {
            text: "会",
            reading: "あ",
          },
          {
            text: "ったきり",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "会",
            reading: "あ",
          },
          {
            text: "っていません。",
          },
        ],
        translation: "Je ne l'ai vu qu'une fois, et pas depuis.",
      },
      {
        segments: [
          {
            text: "二人",
            reading: "ふたり",
          },
          {
            text: "きり",
            highlight: true,
          },
          {
            text: "で",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Nous avons parlé seuls tous les deux.",
      },
    ],
  },
  {
    id: "nuku",
    pattern: "〜ぬく",
    jlptLevel: "N3",
    meaning: "Faire ~ jusqu’au bout, complètement",
    rule: "Verbe (forme ます) + 抜く",
    usage: "Pour exprimer qu'une action difficile est menée à son terme, malgré les obstacles.",
    examples: [
      {
        segments: [
          {
            text: "マラソン",
          },
          {
            text: "を",
          },
          {
            text: "走",
            reading: "はし",
          },
          {
            text: "り",
          },
          {
            text: "抜",
            reading: "ぬ",
          },
          {
            text: "きました。",
            highlight: true,
          },
        ],
        translation: "J'ai couru le marathon jusqu'au bout.",
      },
      {
        segments: [
          {
            text: "苦",
            reading: "くる",
          },
          {
            text: "しい",
          },
          {
            text: "時期",
            reading: "じき",
          },
          {
            text: "を",
          },
          {
            text: "生",
            reading: "い",
          },
          {
            text: "き",
          },
          {
            text: "抜",
            reading: "ぬ",
          },
          {
            text: "きました。",
            highlight: true,
          },
        ],
        translation: "J’ai survécu à une période difficile.",
      },
    ],
  },
  {
    id: "te-hajimete",
    pattern: "〜てはじめて",
    jlptLevel: "N3",
    meaning: "Ce n’est qu’après avoir fait ~ que...",
    rule: "Verbe (forme て) + はじめて",
    usage: "Pour exprimer qu'on n'a réalisé/compris quelque chose qu'après avoir vécu une expérience.",
    examples: [
      {
        segments: [
          {
            text: "一人暮",
            reading: "ひとりぐ",
          },
          {
            text: "らしをしてはじめて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "親",
            reading: "おや",
          },
          {
            text: "の",
          },
          {
            text: "大切",
            reading: "たいせつ",
          },
          {
            text: "さが",
          },
          {
            text: "分",
            reading: "わ",
          },
          {
            text: "かりました。",
          },
        ],
        translation: "Ce n'est qu'en vivant seul que j'ai compris l'importance de mes parents.",
      },
      {
        segments: [
          {
            text: "病気",
            reading: "びょうき",
          },
          {
            text: "になってはじめて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "健康",
            reading: "けんこう",
          },
          {
            text: "の",
          },
          {
            text: "大切",
            reading: "たいせつ",
          },
          {
            text: "さに",
          },
          {
            text: "気",
            reading: "き",
          },
          {
            text: "づきました。",
          },
        ],
        translation: "Ce n'est qu'en tombant malade que j'ai pris conscience de l'importance de la santé.",
      },
    ],
  },
  {
    id: "mono-da",
    pattern: "〜ものだ",
    jlptLevel: "N3",
    meaning: "C’est normal de ~ / autrefois, on faisait souvent ~",
    rule: "Verbe/adjectif (forme normale) + ものだ",
    usage: "Pour exprimer une vérité générale, une norme sociale, ou une habitude nostalgique du passé.",
    examples: [
      {
        segments: [
          {
            text: "年",
            reading: "とし",
          },
          {
            text: "を",
          },
          {
            text: "取",
            reading: "と",
          },
          {
            text: "ると",
          },
          {
            text: "、",
          },
          {
            text: "朝早",
            reading: "あさはや",
          },
          {
            text: "く",
          },
          {
            text: "目",
            reading: "め",
          },
          {
            text: "が",
          },
          {
            text: "覚",
            reading: "さ",
          },
          {
            text: "めるものだ",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "En vieillissant, on se réveille naturellement tôt le matin.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "の",
          },
          {
            text: "頃",
            reading: "ころ",
          },
          {
            text: "は",
          },
          {
            text: "よく",
          },
          {
            text: "ここで",
          },
          {
            text: "遊",
            reading: "あそ",
          },
          {
            text: "んだものだ",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Quand j’étais enfant, je jouais souvent ici.",
      },
    ],
  },
  {
    id: "mono-no",
    pattern: "〜ものの",
    jlptLevel: "N3",
    meaning: "Bien que ~ (mais...)",
    rule: "Verbe/adjectif (forme normale) + ものの",
    usage: "Pour exprimer une concession : bien qu'une chose soit vraie, le résultat n'est pas conforme à ce qu'on pourrait attendre.",
    examples: [
      {
        segments: [
          {
            text: "約束",
            reading: "やくそく",
          },
          {
            text: "したものの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "けませんでした。",
          },
        ],
        translation: "J'avais promis, mais je n'ai pas pu y aller.",
      },
      {
        segments: [
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "を",
          },
          {
            text: "五年",
            reading: "ごねん",
          },
          {
            text: "勉強",
            reading: "べんきょう",
          },
          {
            text: "したものの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "まだ",
          },
          {
            text: "上手",
            reading: "じょうず",
          },
          {
            text: "に",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "せません。",
          },
        ],
        translation: "J'étudie le japonais depuis cinq ans, mais je ne le parle pas encore bien.",
      },
    ],
  },
  {
    id: "to-shite",
    pattern: "〜として",
    jlptLevel: "N3",
    meaning: "En tant que ~",
    rule: "Nom + として",
    usage: "Pour indiquer le rôle, la position ou la qualité sous laquelle une personne ou chose agit.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "医者",
            reading: "いしゃ",
          },
          {
            text: "として",
            highlight: true,
          },
          {
            text: "働",
            reading: "はたら",
          },
          {
            text: "いています。",
          },
        ],
        translation: "Il travaille en tant que médecin.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "は",
          },
          {
            text: "重要",
            reading: "じゅうよう",
          },
          {
            text: "な",
          },
          {
            text: "課題",
            reading: "かだい",
          },
          {
            text: "として",
            highlight: true,
          },
          {
            text: "議論",
            reading: "ぎろん",
          },
          {
            text: "されています。",
          },
        ],
        translation: "Ce problème est débattu en tant que question importante.",
      },
    ],
  },
  {
    id: "ni-taishite",
    pattern: "〜に対して",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "対", reading: "たい" },
      { text: "して" },
    ],
    jlptLevel: "N3",
    meaning: "Envers ~, vis-à-vis de ~",
    rule: "Nom + に対して",
    usage: "Pour indiquer la cible ou le destinataire d'une action, une attitude, ou un contraste.",
    examples: [
      {
        segments: [
          {
            text: "先生",
            reading: "せんせい",
          },
          {
            text: "に",
          },
          {
            text: "対",
            reading: "たい",
          },
          {
            text: "して",
            highlight: true,
          },
          {
            text: "失礼",
            reading: "しつれい",
          },
          {
            text: "な",
          },
          {
            text: "態度",
            reading: "たいど",
          },
          {
            text: "をとってはいけません。",
          },
        ],
        translation: "Il ne faut pas être irrespectueux envers le professeur.",
      },
      {
        segments: [
          {
            text: "兄",
            reading: "あに",
          },
          {
            text: "は",
          },
          {
            text: "スポーツ",
          },
          {
            text: "が",
          },
          {
            text: "得意",
            reading: "とくい",
          },
          {
            text: "だが",
          },
          {
            text: "、",
          },
          {
            text: "弟",
            reading: "おとうと",
          },
          {
            text: "に",
          },
          {
            text: "対",
            reading: "たい",
          },
          {
            text: "して",
            highlight: true,
          },
          {
            text: "は",
          },
          {
            text: "苦手",
            reading: "にがて",
          },
          {
            text: "だ。",
          },
        ],
        translation: "Le grand frère est bon en sport, alors que le petit ne l’est pas.",
      },
    ],
  },
  {
    id: "ni-oite",
    pattern: "〜において",
    jlptLevel: "N3",
    meaning: "À, dans, en (contexte formel)",
    rule: "Nom + において",
    usage: "Pour indiquer le lieu, le moment ou le domaine d'une action, de façon formelle et écrite.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "会議",
            reading: "かいぎ",
          },
          {
            text: "は",
          },
          {
            text: "本社",
            reading: "ほんしゃ",
          },
          {
            text: "において",
            highlight: true,
          },
          {
            text: "行",
            reading: "おこな",
          },
          {
            text: "われます。",
          },
        ],
        translation: "Cette réunion se tiendra au siège social.",
      },
      {
        segments: [
          {
            text: "現代社会",
            reading: "げんだいしゃかい",
          },
          {
            text: "において",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "インターネット",
          },
          {
            text: "は",
          },
          {
            text: "欠",
            reading: "か",
          },
          {
            text: "かせません。",
          },
        ],
        translation: "Dans la société moderne, Internet est indispensable.",
      },
    ],
  },
  {
    id: "ni-kanshite",
    pattern: "〜に関して",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "関", reading: "かん" },
      { text: "して" },
    ],
    jlptLevel: "N3",
    meaning: "Concernant ~, à propos de ~",
    rule: "Nom + に関して",
    usage: "Pour introduire le sujet ou thème dont on parle.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "に",
          },
          {
            text: "関",
            reading: "かん",
          },
          {
            text: "して",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "質問",
            reading: "しつもん",
          },
          {
            text: "があります。",
          },
        ],
        translation: "J'ai une question concernant ce problème.",
      },
      {
        segments: [
          {
            text: "経済",
            reading: "けいざい",
          },
          {
            text: "に",
          },
          {
            text: "関",
            reading: "かん",
          },
          {
            text: "して",
            highlight: true,
          },
          {
            text: "詳",
            reading: "くわ",
          },
          {
            text: "しくありません。",
          },
        ],
        translation: "Je ne connais pas bien l'économie.",
      },
    ],
  },
  {
    id: "ni-totte",
    pattern: "〜にとって",
    jlptLevel: "N3",
    meaning: "Pour ~ (du point de vue de)",
    rule: "Nom + にとって",
    usage: "Pour exprimer un point de vue ou une évaluation du point de vue de quelqu'un ou quelque chose.",
    examples: [
      {
        segments: [
          {
            text: "私",
            reading: "わたし",
          },
          {
            text: "にとって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "家族",
            reading: "かぞく",
          },
          {
            text: "が",
          },
          {
            text: "一番",
            reading: "いちばん",
          },
          {
            text: "大切",
            reading: "たいせつ",
          },
          {
            text: "です。",
          },
        ],
        translation: "Pour moi, la famille est ce qui compte le plus.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "は",
          },
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "にとって",
            highlight: true,
          },
          {
            text: "難",
            reading: "むずか",
          },
          {
            text: "しすぎます。",
          },
        ],
        translation: "Ce livre est trop difficile pour les enfants.",
      },
    ],
  },
  {
    id: "ni-yotte",
    pattern: "〜によって",
    jlptLevel: "N3",
    meaning: "Par ~ / selon ~ / à cause de ~",
    rule: "Nom + によって",
    usage: "Pour indiquer l'agent d'une action passive, une cause, ou une variation selon les cas.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "橋",
            reading: "はし",
          },
          {
            text: "は",
          },
          {
            text: "有名",
            reading: "ゆうめい",
          },
          {
            text: "な",
          },
          {
            text: "建築家",
            reading: "けんちくか",
          },
          {
            text: "によって",
            highlight: true,
          },
          {
            text: "設計",
            reading: "せっけい",
          },
          {
            text: "されました。",
          },
        ],
        translation: "Ce pont a été conçu par un architecte célèbre.",
      },
      {
        segments: [
          {
            text: "人",
            reading: "ひと",
          },
          {
            text: "によって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "考",
            reading: "かんが",
          },
          {
            text: "え",
          },
          {
            text: "方",
            reading: "かた",
          },
          {
            text: "が",
          },
          {
            text: "違",
            reading: "ちが",
          },
          {
            text: "います。",
          },
        ],
        translation: "Les façons de penser diffèrent selon les personnes.",
      },
    ],
  },
  {
    id: "ni-motozuite",
    pattern: "〜に基づいて",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "基", reading: "もと" },
      { text: "づいて" },
    ],
    jlptLevel: "N3",
    meaning: "En se basant sur ~",
    rule: "Nom + に基づいて",
    usage: "Pour indiquer la base ou le fondement sur lequel repose une action ou un jugement.",
    examples: [
      {
        segments: [
          {
            text: "事実",
            reading: "じじつ",
          },
          {
            text: "に",
          },
          {
            text: "基",
            reading: "もと",
          },
          {
            text: "づいて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "報告",
            reading: "ほうこく",
          },
          {
            text: "しました。",
          },
        ],
        translation: "J'ai fait un rapport basé sur les faits.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "映画",
            reading: "えいが",
          },
          {
            text: "は",
          },
          {
            text: "実話",
            reading: "じつわ",
          },
          {
            text: "に",
          },
          {
            text: "基",
            reading: "もと",
          },
          {
            text: "づいて",
            highlight: true,
          },
          {
            text: "作",
            reading: "つく",
          },
          {
            text: "られました。",
          },
        ],
        translation: "Ce film est basé sur une histoire vraie.",
      },
    ],
  },
  {
    id: "osore-ga-aru",
    pattern: "〜おそれがある",
    jlptLevel: "N3",
    meaning: "Il y a un risque que ~",
    rule: "Verbe (forme辞書) / Nom の + おそれがある",
    usage: "Pour exprimer qu'il existe un danger ou risque qu'un événement négatif se produise (souvent dans un registre formel).",
    examples: [
      {
        segments: [
          {
            text: "台風",
            reading: "たいふう",
          },
          {
            text: "が",
          },
          {
            text: "来",
            reading: "く",
          },
          {
            text: "るおそれがあります。",
            highlight: true,
          },
        ],
        translation: "Il y a un risque qu’un typhon arrive.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "薬",
            reading: "くすり",
          },
          {
            text: "は",
          },
          {
            text: "副作用",
            reading: "ふくさよう",
          },
          {
            text: "の",
          },
          {
            text: "おそれがあります。",
            highlight: true,
          },
        ],
        translation: "Ce médicament présente un risque d’effets secondaires.",
      },
    ],
  },
  {
    id: "wari-ni",
    pattern: "〜わりに",
    jlptLevel: "N3",
    meaning: "Considérant que ~, relativement",
    rule: "Verbe/adjectif (forme normale) / Nom の + わりに",
    usage: "Pour exprimer un écart entre ce à quoi on s'attendrait et la réalité, en tenant compte d'un facteur donné.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "レストラン",
          },
          {
            text: "は",
          },
          {
            text: "安",
            reading: "やす",
          },
          {
            text: "いわりに",
            highlight: true,
          },
          {
            text: "美味",
            reading: "おい",
          },
          {
            text: "しいです。",
          },
        ],
        translation: "Ce restaurant est bon marché, mais pourtant délicieux.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "若",
            reading: "わか",
          },
          {
            text: "いわりに",
            highlight: true,
          },
          {
            text: "しっかりしています。",
          },
        ],
        translation: "Il est jeune, mais pourtant très sérieux.",
      },
    ],
  },
  {
    id: "ippou-de",
    pattern: "〜一方で",
    patternSegments: [
      { text: "〜" },
      { text: "一方", reading: "いっぽう" },
      { text: "で" },
    ],
    jlptLevel: "N3",
    meaning: "D’un côté ~, d’un autre côté ~",
    rule: "Verbe/adjectif (forme normale) + 一方で",
    usage: "Pour présenter deux aspects contrastés ou complémentaires d'une même situation.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "は",
          },
          {
            text: "大変",
            reading: "たいへん",
          },
          {
            text: "な",
          },
          {
            text: "一方",
            reading: "いっぽう",
          },
          {
            text: "で",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "やりがいがあります。",
          },
        ],
        translation: "Ce travail est difficile, mais il est aussi gratifiant.",
      },
      {
        segments: [
          {
            text: "都会",
            reading: "とかい",
          },
          {
            text: "は",
          },
          {
            text: "便利",
            reading: "べんり",
          },
          {
            text: "な",
          },
          {
            text: "一方",
            reading: "いっぽう",
          },
          {
            text: "で",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "人",
            reading: "ひと",
          },
          {
            text: "が",
          },
          {
            text: "多",
            reading: "おお",
          },
          {
            text: "すぎます。",
          },
        ],
        translation: "La ville est pratique, mais elle est aussi trop peuplée.",
      },
    ],
  },
  {
    id: "kara-suruto",
    pattern: "〜からすると",
    jlptLevel: "N3",
    meaning: "À en juger par ~",
    rule: "Nom + からすると",
    usage: "Pour exprimer un jugement ou une conclusion basée sur un indice ou un point de vue.",
    examples: [
      {
        segments: [
          {
            text: "天気予報",
            reading: "てんきよほう",
          },
          {
            text: "からすると",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "は",
          },
          {
            text: "晴",
            reading: "は",
          },
          {
            text: "れるでしょう。",
          },
        ],
        translation: "À en juger par la météo, il fera probablement beau demain.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "様子",
            reading: "ようす",
          },
          {
            text: "からすると",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "疲",
            reading: "つか",
          },
          {
            text: "れているようです。",
          },
        ],
        translation: "À en juger par son air, il semble fatigué.",
      },
    ],
  },
  {
    id: "kara-to-itte",
    pattern: "〜からといって",
    jlptLevel: "N3",
    meaning: "Ce n’est pas parce que ~ que...",
    rule: "Verbe/adjectif (forme normale) + からといって",
    usage: "Pour rejeter une conclusion hâtive qu'on pourrait tirer d'une raison donnée.",
    examples: [
      {
        segments: [
          {
            text: "高",
            reading: "たか",
          },
          {
            text: "いからといって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "質",
            reading: "しつ",
          },
          {
            text: "がいいとは",
          },
          {
            text: "限",
            reading: "かぎ",
          },
          {
            text: "りません。",
          },
        ],
        translation: "Ce n'est pas parce que c'est cher que la qualité est forcément bonne.",
      },
      {
        segments: [
          {
            text: "日本人",
            reading: "にほんじん",
          },
          {
            text: "だからといって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "皆",
            reading: "みな",
          },
          {
            text: "漢字",
            reading: "かんじ",
          },
          {
            text: "が",
          },
          {
            text: "得意",
            reading: "とくい",
          },
          {
            text: "なわけではありません。",
          },
        ],
        translation: "Ce n'est pas parce qu'on est japonais qu'on est forcément bon en kanji.",
      },
    ],
  },
  {
    id: "nuki-de",
    pattern: "〜抜きで",
    patternSegments: [
      { text: "〜" },
      { text: "抜", reading: "ぬ" },
      { text: "きで" },
    ],
    jlptLevel: "N3",
    meaning: "Sans ~",
    rule: "Nom + 抜きで",
    usage: "Pour exprimer qu'une chose ou personne est exclue d'une action ou situation.",
    examples: [
      {
        segments: [
          {
            text: "今日",
            reading: "きょう",
          },
          {
            text: "は",
          },
          {
            text: "冗談",
            reading: "じょうだん",
          },
          {
            text: "抜",
            reading: "ぬ",
          },
          {
            text: "きで",
            highlight: true,
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "しましょう。",
          },
        ],
        translation: "Aujourd’hui, parlons sérieusement, sans blague.",
      },
      {
        segments: [
          {
            text: "朝食",
            reading: "ちょうしょく",
          },
          {
            text: "抜",
            reading: "ぬ",
          },
          {
            text: "きで",
            highlight: true,
          },
          {
            text: "出",
            reading: "で",
          },
          {
            text: "かけました。",
          },
        ],
        translation: "Je suis sorti sans avoir pris de petit-déjeuner.",
      },
    ],
  },
  {
    id: "sue-ni",
    pattern: "〜末に",
    patternSegments: [
      { text: "〜" },
      { text: "末", reading: "すえ" },
      { text: "に" },
    ],
    jlptLevel: "N3",
    meaning: "Après beaucoup de ~, finalement",
    rule: "Verbe (forme た) / Nom の + 末に",
    usage: "Pour exprimer qu'après un long processus ou de nombreuses difficultés, on arrive à un résultat final.",
    examples: [
      {
        segments: [
          {
            text: "長",
            reading: "なが",
          },
          {
            text: "い",
          },
          {
            text: "議論",
            reading: "ぎろん",
          },
          {
            text: "の",
          },
          {
            text: "末",
            reading: "すえ",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "結論",
            reading: "けつろん",
          },
          {
            text: "が",
          },
          {
            text: "出",
            reading: "で",
          },
          {
            text: "ました。",
          },
        ],
        translation: "Après une longue discussion, une conclusion est finalement sortie.",
      },
      {
        segments: [
          {
            text: "悩",
            reading: "なや",
          },
          {
            text: "んだ",
          },
          {
            text: "末",
            reading: "すえ",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "留学",
            reading: "りゅうがく",
          },
          {
            text: "を",
          },
          {
            text: "決",
            reading: "き",
          },
          {
            text: "めました。",
          },
        ],
        translation: "Après beaucoup d’hésitation, j’ai décidé de partir étudier à l’étranger.",
      },
    ],
  },
  {
    id: "ue-de",
    pattern: "〜上で",
    patternSegments: [
      { text: "〜" },
      { text: "上", reading: "うえ" },
      { text: "で" },
    ],
    jlptLevel: "N3",
    meaning: "Après avoir fait ~ (puis)",
    rule: "Verbe (forme た) / Nom の + 上で",
    usage: "Pour indiquer qu'une action se fait après avoir accompli une étape préalable nécessaire.",
    examples: [
      {
        segments: [
          {
            text: "よく",
          },
          {
            text: "考",
            reading: "かんが",
          },
          {
            text: "えた",
          },
          {
            text: "上",
            reading: "うえ",
          },
          {
            text: "で",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "返事",
            reading: "へんじ",
          },
          {
            text: "をします。",
          },
        ],
        translation: "Je répondrai après avoir bien réfléchi.",
      },
      {
        segments: [
          {
            text: "書類",
            reading: "しょるい",
          },
          {
            text: "を",
          },
          {
            text: "確認",
            reading: "かくにん",
          },
          {
            text: "した",
          },
          {
            text: "上",
            reading: "うえ",
          },
          {
            text: "で",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "サイン",
          },
          {
            text: "してください。",
          },
        ],
        translation: "Après avoir vérifié les documents, signez, s’il vous plaît.",
      },
    ],
  },
  {
    id: "ue-ni",
    pattern: "〜上に",
    patternSegments: [
      { text: "〜" },
      { text: "上", reading: "うえ" },
      { text: "に" },
    ],
    jlptLevel: "N3",
    meaning: "De plus, en plus de ~",
    rule: "Verbe/adjectif (forme normale) + 上に",
    usage: "Pour ajouter une caractéristique supplémentaire à une situation déjà décrite, souvent du même sens (positif ou négatif).",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "部屋",
            reading: "へや",
          },
          {
            text: "は",
          },
          {
            text: "狭",
            reading: "せま",
          },
          {
            text: "い",
          },
          {
            text: "上",
            reading: "うえ",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "暗",
            reading: "くら",
          },
          {
            text: "いです。",
          },
        ],
        translation: "Cette pièce est petite, et en plus, sombre.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "頭",
            reading: "あたま",
          },
          {
            text: "がいい",
          },
          {
            text: "上",
            reading: "うえ",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "努力家",
            reading: "どりょくか",
          },
          {
            text: "です。",
          },
        ],
        translation: "Il est intelligent, et en plus, travailleur.",
      },
    ],
  },
  {
    id: "shidai",
    pattern: "〜次第",
    patternSegments: [
      { text: "〜" },
      { text: "次第", reading: "しだい" },
    ],
    jlptLevel: "N3",
    meaning: "Dès que ~ / cela dépend de ~",
    rule: "Verbe (forme ます) / Nom + 次第",
    usage: "Pour exprimer qu'une action se fera immédiatement après une autre, ou que le résultat dépend d'une condition.",
    examples: [
      {
        segments: [
          {
            text: "駅",
            reading: "えき",
          },
          {
            text: "に",
          },
          {
            text: "着",
            reading: "つ",
          },
          {
            text: "き",
          },
          {
            text: "次第",
            reading: "しだい",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "連絡",
            reading: "れんらく",
          },
          {
            text: "します。",
          },
        ],
        translation: "Dès que j'arrive à la gare, je vous contacte.",
      },
      {
        segments: [
          {
            text: "成功",
            reading: "せいこう",
          },
          {
            text: "するかどうかは",
          },
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "次第",
            reading: "しだい",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Réussir ou non dépend des efforts fournis.",
      },
    ],
  },
  {
    id: "ta-totan-ni",
    pattern: "〜たとたんに",
    jlptLevel: "N3",
    meaning: "Juste au moment où ~",
    rule: "Verbe (forme た) + とたんに",
    usage: "Pour exprimer qu'un événement se produit immédiatement après un autre, de façon soudaine.",
    examples: [
      {
        segments: [
          {
            text: "家",
            reading: "いえ",
          },
          {
            text: "を",
          },
          {
            text: "出",
            reading: "で",
          },
          {
            text: "たとたんに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "り",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Juste au moment où je suis sorti de la maison, il s'est mis à pleuvoir.",
      },
      {
        segments: [
          {
            text: "ドア",
          },
          {
            text: "を",
          },
          {
            text: "開",
            reading: "あ",
          },
          {
            text: "けたとたんに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "猫",
            reading: "ねこ",
          },
          {
            text: "が",
          },
          {
            text: "飛",
            reading: "と",
          },
          {
            text: "び",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Juste au moment où j'ai ouvert la porte, le chat a bondi.",
      },
    ],
  },
  {
    id: "gatai",
    pattern: "〜がたい",
    jlptLevel: "N3",
    meaning: "Difficile de faire ~",
    rule: "Verbe (forme ます) + がたい",
    usage: "Pour exprimer qu'il est très difficile, voire impossible, d'accomplir une action à cause de sa nature.",
    examples: [
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "話",
            reading: "はなし",
          },
          {
            text: "は",
          },
          {
            text: "信",
            reading: "しん",
          },
          {
            text: "じがたい",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Cette histoire est difficile à croire.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "は",
          },
          {
            text: "忘",
            reading: "わす",
          },
          {
            text: "れがたい",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Ses efforts sont inoubliables.",
      },
    ],
  },
  {
    id: "kirenai",
    pattern: "〜きれない",
    jlptLevel: "N3",
    meaning: "Ne pas pouvoir faire ~ complètement",
    rule: "Verbe (forme ます) + きれない",
    usage: "Pour exprimer l'impossibilité de terminer ou d'accomplir complètement une action à cause de sa quantité ou difficulté.",
    examples: [
      {
        segments: [
          {
            text: "料理",
            reading: "りょうり",
          },
          {
            text: "が",
          },
          {
            text: "多",
            reading: "おお",
          },
          {
            text: "すぎて",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べきれません",
            highlight: true,
          },
          {
            text: "でした。",
          },
        ],
        translation: "Il y avait trop de plats, je n’ai pas pu tout manger.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "本",
            reading: "ほん",
          },
          {
            text: "は",
          },
          {
            text: "一日",
            reading: "いちにち",
          },
          {
            text: "では",
          },
          {
            text: "読",
            reading: "よ",
          },
          {
            text: "みきれません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Ce livre ne peut pas être lu entièrement en une journée.",
      },
    ],
  },
  {
    id: "kkonai",
    pattern: "〜っこない",
    jlptLevel: "N3",
    meaning: "Il n’y a aucune chance que ~",
    rule: "Verbe (forme ます) + っこない",
    usage: "Registre familier, pour affirmer avec certitude qu'une chose est impossible.",
    examples: [
      {
        segments: [
          {
            text: "こんな",
          },
          {
            text: "難",
            reading: "むずか",
          },
          {
            text: "しい",
          },
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "、",
          },
          {
            text: "私",
            reading: "わたし",
          },
          {
            text: "に",
          },
          {
            text: "できっこない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Un problème aussi difficile, il n’y a aucune chance que je puisse le résoudre.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "が",
          },
          {
            text: "時間通",
            reading: "じかんどお",
          },
          {
            text: "りに",
          },
          {
            text: "来",
            reading: "く",
          },
          {
            text: "るっこない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il n'y a aucune chance qu'il vienne à l'heure.",
      },
    ],
  },
  {
    id: "mai",
    pattern: "〜まい",
    jlptLevel: "N3",
    meaning: "Ne pas avoir l’intention de ~ / probablement pas",
    rule: "Verbe (forme辞書) + まい",
    usage: "Pour exprimer une forte volonté négative (ne pas faire) ou une supposition négative, dans un registre plutôt formel/littéraire.",
    examples: [
      {
        segments: [
          {
            text: "もう",
          },
          {
            text: "二度",
            reading: "にど",
          },
          {
            text: "と",
          },
          {
            text: "酒",
            reading: "さけ",
          },
          {
            text: "を",
          },
          {
            text: "飲",
            reading: "の",
          },
          {
            text: "むまい",
            highlight: true,
          },
          {
            text: "と",
          },
          {
            text: "決",
            reading: "き",
          },
          {
            text: "めました。",
          },
        ],
        translation: "J’ai décidé de ne plus jamais boire d’alcool.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "そんなことは",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "うまい",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il ne dirait probablement pas une chose pareille.",
      },
    ],
  },
  {
    id: "bekida",
    pattern: "〜べきだ",
    jlptLevel: "N3",
    meaning: "On devrait ~",
    rule: "Verbe (forme辞書) + べきだ",
    usage: "Pour exprimer une obligation morale ou ce qui est jugé correct de faire.",
    examples: [
      {
        segments: [
          {
            text: "約束",
            reading: "やくそく",
          },
          {
            text: "は",
          },
          {
            text: "守",
            reading: "まも",
          },
          {
            text: "るべきです",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "On devrait tenir ses promesses.",
      },
      {
        segments: [
          {
            text: "若",
            reading: "わか",
          },
          {
            text: "いうちに",
          },
          {
            text: "いろいろな",
          },
          {
            text: "経験",
            reading: "けいけん",
          },
          {
            text: "を",
          },
          {
            text: "するべきだ",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "On devrait faire beaucoup d’expériences quand on est jeune.",
      },
    ],
  },
  {
    id: "dokoro-dewa-nai",
    pattern: "〜どころではない",
    jlptLevel: "N3",
    meaning: "Ce n’est pas le moment de ~",
    rule: "Verbe (forme辞書) / Nom + どころではない",
    usage: "Pour exprimer qu'une situation ne permet absolument pas de faire une certaine chose.",
    examples: [
      {
        segments: [
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しくて",
          },
          {
            text: "旅行",
            reading: "りょこう",
          },
          {
            text: "どころではありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Je suis trop occupé, ce n'est pas le moment de voyager.",
      },
      {
        segments: [
          {
            text: "締",
            reading: "し",
          },
          {
            text: "め",
          },
          {
            text: "切",
            reading: "き",
          },
          {
            text: "り",
          },
          {
            text: "前",
            reading: "まえ",
          },
          {
            text: "で",
          },
          {
            text: "、",
          },
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "むどころではありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "C'est avant la date limite, ce n'est pas le moment de se reposer.",
      },
    ],
  },
  {
    id: "nai-koto-ni-wa",
    pattern: "〜ないことには",
    jlptLevel: "N3",
    meaning: "Sans faire ~, on ne peut pas...",
    rule: "Verbe (forme ない) + ことには",
    usage: "Pour exprimer qu'une condition négative doit être levée avant qu'autre chose ne puisse se produire.",
    examples: [
      {
        segments: [
          {
            text: "やってみないことには",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "成功",
            reading: "せいこう",
          },
          {
            text: "するかどうか",
          },
          {
            text: "分",
            reading: "わ",
          },
          {
            text: "かりません。",
          },
        ],
        translation: "Sans essayer, on ne peut pas savoir si ça va réussir.",
      },
      {
        segments: [
          {
            text: "実際",
            reading: "じっさい",
          },
          {
            text: "に",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "ないことには",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "判断",
            reading: "はんだん",
          },
          {
            text: "できません。",
          },
        ],
        translation: "Sans voir réellement, je ne peux pas juger.",
      },
    ],
  },
  {
    id: "sae-eba",
    pattern: "〜さえ〜ば",
    jlptLevel: "N3",
    meaning: "Il suffit de ~ pour...",
    rule: "Nom + さえ + Verbe/adjectif (forme条件形)",
    usage: "Pour exprimer qu'une seule condition suffit à assurer un résultat.",
    examples: [
      {
        segments: [
          {
            text: "お金",
            reading: "かね",
          },
          {
            text: "さえ",
            highlight: true,
          },
          {
            text: "あれば",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "何",
            reading: "なに",
          },
          {
            text: "でも",
          },
          {
            text: "買",
            reading: "か",
          },
          {
            text: "えます。",
          },
        ],
        translation: "Il suffit d’avoir de l’argent pour pouvoir tout acheter.",
      },
      {
        segments: [
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "さえ",
            highlight: true,
          },
          {
            text: "すれば",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "夢",
            reading: "ゆめ",
          },
          {
            text: "は",
          },
          {
            text: "叶",
            reading: "かな",
          },
          {
            text: "います。",
          },
        ],
        translation: "Il suffit de faire des efforts pour que les rêves se réalisent.",
      },
    ],
  },
  {
    id: "te-kara-de-naito",
    pattern: "〜てからでないと",
    jlptLevel: "N3",
    meaning: "Si l’on ne fait pas d’abord ~, on ne peut pas...",
    rule: "Verbe (forme て) + からでないと",
    usage: "Pour exprimer qu'une action doit obligatoirement précéder une autre.",
    examples: [
      {
        segments: [
          {
            text: "予約",
            reading: "よやく",
          },
          {
            text: "してからでないと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "入",
            reading: "はい",
          },
          {
            text: "れません。",
          },
        ],
        translation: "Si l'on ne réserve pas d'abord, on ne peut pas entrer.",
      },
      {
        segments: [
          {
            text: "許可",
            reading: "きょか",
          },
          {
            text: "を",
          },
          {
            text: "得",
            reading: "え",
          },
          {
            text: "てからでないと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "始",
            reading: "はじ",
          },
          {
            text: "められません。",
          },
        ],
        translation: "Si l'on n'obtient pas d'abord la permission, on ne peut pas commencer.",
      },
    ],
  },
  {
    id: "kuse-ni",
    pattern: "〜くせに",
    jlptLevel: "N3",
    meaning: "Alors que ~ (avec reproche)",
    rule: "Verbe/adjectif (forme normale) / Nom の + くせに",
    usage: "Pour exprimer un reproche ou une critique envers une contradiction entre une caractéristique et un comportement.",
    examples: [
      {
        segments: [
          {
            text: "知",
            reading: "し",
          },
          {
            text: "っているくせに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "教",
            reading: "おし",
          },
          {
            text: "えてくれません。",
          },
        ],
        translation: "Alors qu’il le sait, il ne veut pas me le dire.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "の",
          },
          {
            text: "くせに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "生意気",
            reading: "なまいき",
          },
          {
            text: "なことを",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "う。",
          },
        ],
        translation: "Alors que ce n’est qu’un enfant, il dit des choses insolentes.",
      },
    ],
  },
  {
    id: "mono-nara",
    pattern: "〜ものなら",
    jlptLevel: "N3",
    meaning: "Si jamais on pouvait ~",
    rule: "Verbe (forme可能) + ものなら",
    usage: "Pour exprimer un souhait difficilement réalisable, souvent suivi d'une conséquence hypothétique forte.",
    examples: [
      {
        segments: [
          {
            text: "戻",
            reading: "もど",
          },
          {
            text: "れるものなら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "学生時代",
            reading: "がくせいじだい",
          },
          {
            text: "に",
          },
          {
            text: "戻",
            reading: "もど",
          },
          {
            text: "りたいです。",
          },
        ],
        translation: "Si je pouvais revenir en arrière, je voudrais retourner à mes années d’étudiant.",
      },
      {
        segments: [
          {
            text: "行",
            reading: "い",
          },
          {
            text: "けるものなら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "宇宙",
            reading: "うちゅう",
          },
          {
            text: "に",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "ってみたいです。",
          },
        ],
        translation: "Si je pouvais y aller, j’aimerais aller dans l’espace.",
      },
    ],
  },
  {
    id: "zaru-wo-enai",
    pattern: "〜ざるを得ない",
    patternSegments: [
      { text: "〜" },
      { text: "ざるを" },
      { text: "得", reading: "え" },
      { text: "ない" },
    ],
    jlptLevel: "N3",
    meaning: "On ne peut s’empêcher de ~ / on est obligé de ~",
    rule: "Verbe (forme ない、sans ない) + ざるを得ない",
    usage: "Pour exprimer qu'on est contraint de faire une action malgré soi.",
    examples: [
      {
        segments: [
          {
            text: "状況",
            reading: "じょうきょう",
          },
          {
            text: "を",
          },
          {
            text: "考",
            reading: "かんが",
          },
          {
            text: "えると",
          },
          {
            text: "、",
          },
          {
            text: "中止",
            reading: "ちゅうし",
          },
          {
            text: "せざるを",
          },
          {
            text: "得",
            reading: "え",
          },
          {
            text: "ません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Vu la situation, on est obligé d’annuler.",
      },
      {
        segments: [
          {
            text: "会社",
            reading: "かいしゃ",
          },
          {
            text: "の",
          },
          {
            text: "指示",
            reading: "しじ",
          },
          {
            text: "だから",
          },
          {
            text: "、",
          },
          {
            text: "従",
            reading: "したが",
          },
          {
            text: "わざるを",
          },
          {
            text: "得",
            reading: "え",
          },
          {
            text: "ません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "C’est un ordre de l’entreprise, donc je suis obligé d’obéir.",
      },
    ],
  },
  {
    id: "ppanashi",
    pattern: "〜っぱなし",
    jlptLevel: "N3",
    meaning: "Laisser ~ sans s’en occuper",
    rule: "Verbe (forme ます) + っぱなし",
    usage: "Pour exprimer qu'une action est laissée dans un état négligé, souvent avec une nuance de reproche.",
    examples: [
      {
        segments: [
          {
            text: "電気",
            reading: "でんき",
          },
          {
            text: "を",
          },
          {
            text: "つけっぱなしに",
            highlight: true,
          },
          {
            text: "しないでください。",
          },
        ],
        translation: "Ne laissez pas la lumière allumée sans raison.",
      },
      {
        segments: [
          {
            text: "ドア",
          },
          {
            text: "を",
          },
          {
            text: "開",
            reading: "あ",
          },
          {
            text: "けっぱなしに",
            highlight: true,
          },
          {
            text: "したまま",
          },
          {
            text: "出",
            reading: "で",
          },
          {
            text: "かけました。",
          },
        ],
        translation: "Il est sorti en laissant la porte ouverte.",
      },
    ],
  },
  {
    id: "okini",
    pattern: "〜おきに",
    jlptLevel: "N3",
    meaning: "Tous les ~ (intervalle)",
    rule: "Nom (quantité) + おきに",
    usage: "Pour exprimer un intervalle régulier entre deux occurrences d'une action ou d'un événement.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "バス",
          },
          {
            text: "は",
          },
          {
            text: "十分",
            reading: "じゅっぷん",
          },
          {
            text: "おきに",
            highlight: true,
          },
          {
            text: "来",
            reading: "き",
          },
          {
            text: "ます。",
          },
        ],
        translation: "Ce bus passe toutes les dix minutes.",
      },
      {
        segments: [
          {
            text: "一日",
            reading: "いちにち",
          },
          {
            text: "おきに",
            highlight: true,
          },
          {
            text: "薬",
            reading: "くすり",
          },
          {
            text: "を",
          },
          {
            text: "飲",
            reading: "の",
          },
          {
            text: "みます。",
          },
        ],
        translation: "Je prends le médicament un jour sur deux.",
      },
    ],
  },
  {
    id: "koso",
    pattern: "〜こそ",
    jlptLevel: "N3",
    meaning: "C’est justement ~ / précisément ~",
    rule: "Nom + こそ",
    usage: "Pour mettre l'accent fortement sur un élément particulier, souligné par contraste.",
    examples: [
      {
        segments: [
          {
            text: "今年",
            reading: "ことし",
          },
          {
            text: "こそ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "合格",
            reading: "ごうかく",
          },
          {
            text: "したいです。",
          },
        ],
        translation: "Cette année précisément, je veux réussir.",
      },
      {
        segments: [
          {
            text: "あなた",
          },
          {
            text: "こそ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "この",
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "に",
          },
          {
            text: "ふさわしい",
          },
          {
            text: "人",
            reading: "ひと",
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est justement vous qui êtes la personne idéale pour ce travail.",
      },
    ],
  },
  {
    id: "tsutsu-aru",
    pattern: "〜つつある",
    jlptLevel: "N3",
    meaning: "Être en train de ~ (évolution progressive)",
    rule: "Verbe (forme ます) + つつある",
    usage: "Pour exprimer qu'un changement ou un processus est en cours d'évolution progressive, registre plutôt formel.",
    examples: [
      {
        segments: [
          {
            text: "環境問題",
            reading: "かんきょうもんだい",
          },
          {
            text: "は",
          },
          {
            text: "改善",
            reading: "かいぜん",
          },
          {
            text: "されつつあります",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Le problème environnemental est en train de s'améliorer progressivement.",
      },
      {
        segments: [
          {
            text: "状況",
            reading: "じょうきょう",
          },
          {
            text: "は",
          },
          {
            text: "悪化",
            reading: "あっか",
          },
          {
            text: "しつつあります",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "La situation est en train de se dégrader progressivement.",
      },
    ],
  },
  {
    id: "wa-mochiron",
    pattern: "〜はもちろん",
    jlptLevel: "N3",
    meaning: "~ bien sûr, mais aussi",
    rule: "Nom + はもちろん",
    usage: "Pour indiquer qu'un élément est évident, puis ajouter un autre élément qui l'est tout autant ou davantage.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "英語",
            reading: "えいご",
          },
          {
            text: "はもちろん",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "中国語",
            reading: "ちゅうごくご",
          },
          {
            text: "も",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "せます。",
          },
        ],
        translation: "Il parle bien sûr anglais, mais aussi chinois.",
      },
      {
        segments: [
          {
            text: "週末",
            reading: "しゅうまつ",
          },
          {
            text: "はもちろん",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "平日",
            reading: "へいじつ",
          },
          {
            text: "も",
          },
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しいです。",
          },
        ],
        translation: "Le week-end bien sûr, mais aussi en semaine, je suis occupé.",
      },
    ],
  },
  {
    id: "ni-shitewa",
    pattern: "〜にしては",
    jlptLevel: "N3",
    meaning: "Pour ~ (contrairement à ce qu’on attendrait)",
    rule: "Nom / Verbe (forme辞書) + にしては",
    usage: "Pour exprimer un écart entre une attente basée sur une catégorie et la réalité observée.",
    examples: [
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "にしては",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "よく",
          },
          {
            text: "知",
            reading: "し",
          },
          {
            text: "っていますね。",
          },
        ],
        translation: "Pour un enfant, il en sait beaucoup.",
      },
      {
        segments: [
          {
            text: "初心者",
            reading: "しょしんしゃ",
          },
          {
            text: "にしては",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "上手",
            reading: "じょうず",
          },
          {
            text: "です。",
          },
        ],
        translation: "Pour un débutant, c’est bien fait.",
      },
    ],
  },
  {
    id: "ni-kagirazu",
    pattern: "〜に限らず",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "限", reading: "かぎ" },
      { text: "らず" },
    ],
    jlptLevel: "N3",
    meaning: "Sans se limiter à ~",
    rule: "Nom + に限らず",
    usage: "Pour exprimer qu'une affirmation ne concerne pas seulement l'élément mentionné, mais s'étend au-delà.",
    examples: [
      {
        segments: [
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "に",
          },
          {
            text: "限",
            reading: "かぎ",
          },
          {
            text: "らず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "世界中",
            reading: "せかいじゅう",
          },
          {
            text: "で",
          },
          {
            text: "人気",
            reading: "にんき",
          },
          {
            text: "があります。",
          },
        ],
        translation: "Sans se limiter au Japon, c’est populaire dans le monde entier.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "に",
          },
          {
            text: "限",
            reading: "かぎ",
          },
          {
            text: "らず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "大人",
            reading: "おとな",
          },
          {
            text: "も",
          },
          {
            text: "楽",
            reading: "たの",
          },
          {
            text: "しめます。",
          },
        ],
        translation: "Sans se limiter aux enfants, les adultes peuvent aussi en profiter.",
      },
    ],
  },
  {
    id: "bakari-de-naku",
    pattern: "〜ばかりでなく",
    jlptLevel: "N3",
    meaning: "Pas seulement ~, mais aussi",
    rule: "Verbe/adjectif (forme normale) / Nom + ばかりでなく",
    usage: "Pour ajouter un élément supplémentaire à ce qui vient d'être mentionné.",
    examples: [
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "美人",
            reading: "びじん",
          },
          {
            text: "なばかりでなく",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "頭",
            reading: "あたま",
          },
          {
            text: "もいいです。",
          },
        ],
        translation: "Elle n’est pas seulement belle, mais aussi intelligente.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "製品",
            reading: "せいひん",
          },
          {
            text: "は",
          },
          {
            text: "安",
            reading: "やす",
          },
          {
            text: "いばかりでなく",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "性能",
            reading: "せいのう",
          },
          {
            text: "もいいです。",
          },
        ],
        translation: "Ce produit n’est pas seulement bon marché, mais aussi performant.",
      },
    ],
  },
  {
    id: "ppoi",
    pattern: "〜っぽい",
    jlptLevel: "N3",
    meaning: "Avoir l’air ~, ressembler à ~",
    rule: "Nom / Verbe (forme ます) + っぽい",
    usage: "Registre familier, pour exprimer qu'une chose a une forte tendance à être ou paraître d'une certaine manière.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "っぽい",
            highlight: true,
          },
          {
            text: "性格",
            reading: "せいかく",
          },
          {
            text: "です。",
          },
        ],
        translation: "Il a un caractère un peu puéril.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "水",
            reading: "みず",
          },
          {
            text: "は",
          },
          {
            text: "白",
            reading: "しろ",
          },
          {
            text: "っぽい",
            highlight: true,
          },
          {
            text: "色",
            reading: "いろ",
          },
          {
            text: "をしています。",
          },
        ],
        translation: "Cette eau a une couleur blanchâtre.",
      },
    ],
  },
  {
    id: "darake",
    pattern: "〜だらけ",
    jlptLevel: "N3",
    meaning: "Couvert de ~, plein de ~",
    rule: "Nom + だらけ",
    usage: "Pour exprimer qu'une chose est entièrement couverte ou remplie d'un élément, souvent négatif.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "レポート",
          },
          {
            text: "は",
          },
          {
            text: "間違",
            reading: "まちが",
          },
          {
            text: "いだらけ",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Ce rapport est plein d’erreurs.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "は",
          },
          {
            text: "泥",
            reading: "どろ",
          },
          {
            text: "だらけ",
            highlight: true,
          },
          {
            text: "になって",
          },
          {
            text: "帰",
            reading: "かえ",
          },
          {
            text: "ってきました。",
          },
        ],
        translation: "L’enfant est rentré couvert de boue.",
      },
    ],
  },
  {
    id: "hanmen",
    pattern: "〜反面",
    patternSegments: [
      { text: "〜" },
      { text: "反面", reading: "はんめん" },
    ],
    jlptLevel: "N3",
    meaning: "D’un côté ~, mais d’un autre côté",
    rule: "Verbe/adjectif (forme normale) / Nom な・の + 反面",
    usage: "Pour présenter deux aspects contrastés d'une même chose, l'un positif et l'autre négatif (ou inversement).",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "は",
          },
          {
            text: "給料",
            reading: "きゅうりょう",
          },
          {
            text: "がいい",
          },
          {
            text: "反面",
            reading: "はんめん",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しいです。",
          },
        ],
        translation: "Ce travail est bien payé, mais en contrepartie il est éprouvant.",
      },
      {
        segments: [
          {
            text: "便利",
            reading: "べんり",
          },
          {
            text: "な",
          },
          {
            text: "反面",
            reading: "はんめん",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "危険",
            reading: "きけん",
          },
          {
            text: "も",
          },
          {
            text: "あります。",
          },
        ],
        translation: "C’est pratique, mais il y a aussi des dangers.",
      },
    ],
  },
  {
    id: "kano-youni",
    pattern: "〜かのように",
    jlptLevel: "N3",
    meaning: "Comme si ~",
    rule: "Verbe/adjectif (forme normale) + かのように",
    usage: "Pour exprimer qu'une chose donne l'impression d'être ainsi, alors qu'en réalité elle ne l'est pas forcément.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "何",
            reading: "なに",
          },
          {
            text: "も",
          },
          {
            text: "知",
            reading: "し",
          },
          {
            text: "らないかのように",
            highlight: true,
          },
          {
            text: "振",
            reading: "ふ",
          },
          {
            text: "る",
          },
          {
            text: "舞",
            reading: "ま",
          },
          {
            text: "いました。",
          },
        ],
        translation: "Il s’est comporté comme s’il ne savait rien.",
      },
      {
        segments: [
          {
            text: "まるで",
          },
          {
            text: "夢",
            reading: "ゆめ",
          },
          {
            text: "を",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "ているかのように",
            highlight: true,
          },
          {
            text: "感",
            reading: "かん",
          },
          {
            text: "じました。",
          },
        ],
        translation: "J’ai eu l’impression que c’était comme si je rêvais.",
      },
    ],
  },
  {
    id: "you-ga-nai",
    pattern: "〜ようがない",
    jlptLevel: "N3",
    meaning: "Il n’y a aucun moyen de ~",
    rule: "Verbe (forme ます) + ようがない",
    usage: "Pour exprimer qu'il est impossible de faire quelque chose faute de moyen ou de méthode.",
    examples: [
      {
        segments: [
          {
            text: "連絡先",
            reading: "れんらくさき",
          },
          {
            text: "を",
          },
          {
            text: "知",
            reading: "し",
          },
          {
            text: "らないので",
          },
          {
            text: "、",
          },
          {
            text: "連絡",
            reading: "れんらく",
          },
          {
            text: "のしようがありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Comme je ne connais pas ses coordonnées, il n'y a aucun moyen de le contacter.",
      },
      {
        segments: [
          {
            text: "こんなに",
          },
          {
            text: "複雑",
            reading: "ふくざつ",
          },
          {
            text: "だと",
          },
          {
            text: "、",
          },
          {
            text: "説明",
            reading: "せつめい",
          },
          {
            text: "のしようがありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Si c'est aussi compliqué, il n'y a aucun moyen d'expliquer.",
      },
    ],
  },
  {
    id: "tewa-naranai",
    pattern: "〜てはならない",
    jlptLevel: "N3",
    meaning: "Il ne faut pas ~",
    rule: "Verbe (forme て) + はならない",
    usage: "Pour exprimer une interdiction forte, souvent une règle générale ou morale, registre formel.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "規則",
            reading: "きそく",
          },
          {
            text: "を",
          },
          {
            text: "破",
            reading: "やぶ",
          },
          {
            text: "ってはなりません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il ne faut pas enfreindre cette règle.",
      },
      {
        segments: [
          {
            text: "人",
            reading: "ひと",
          },
          {
            text: "の",
          },
          {
            text: "悪口",
            reading: "わるぐち",
          },
          {
            text: "を",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "ってはなりません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il ne faut pas dire du mal des gens.",
      },
    ],
  },
  {
    id: "towa-ie",
    pattern: "〜とはいえ",
    jlptLevel: "N3",
    meaning: "Bien que ~, cela dit",
    rule: "Verbe/adjectif (forme normale) / Nom + とはいえ",
    usage: "Pour nuancer une affirmation en présentant une réserve ou un contraste malgré ce qui vient d'être dit.",
    examples: [
      {
        segments: [
          {
            text: "春",
            reading: "はる",
          },
          {
            text: "とはいえ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "まだ",
          },
          {
            text: "寒",
            reading: "さむ",
          },
          {
            text: "いです。",
          },
        ],
        translation: "Même si c’est le printemps, il fait encore froid.",
      },
      {
        segments: [
          {
            text: "経験",
            reading: "けいけん",
          },
          {
            text: "があるとはいえ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "油断",
            reading: "ゆだん",
          },
          {
            text: "はできません。",
          },
        ],
        translation: "Même si j’ai de l’expérience, je ne peux pas relâcher ma vigilance.",
      },
    ],
  },
  {
    id: "ni-shitemo",
    pattern: "〜にしても",
    jlptLevel: "N3",
    meaning: "Même en supposant ~",
    rule: "Verbe/adjectif (forme normale) / Nom + にしても",
    usage: "Pour exprimer que même en admettant une certaine situation, la conclusion reste la même.",
    examples: [
      {
        segments: [
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しいにしても",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "返事",
            reading: "へんじ",
          },
          {
            text: "ぐらいはできるはずです。",
          },
        ],
        translation: "Même en admettant que vous soyez occupé, vous devriez pouvoir au moins répondre.",
      },
      {
        segments: [
          {
            text: "冗談",
            reading: "じょうだん",
          },
          {
            text: "にしても",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ひどすぎます。",
          },
        ],
        translation: "Même si c’était une blague, c’est trop cruel.",
      },
    ],
  },
  {
    id: "ni-mo-kakawarazu",
    pattern: "〜にもかかわらず",
    jlptLevel: "N3",
    meaning: "Malgré ~",
    rule: "Verbe/adjectif (forme normale) / Nom + にもかかわらず",
    usage: "Pour exprimer un contraste fort entre une situation attendue et la réalité.",
    examples: [
      {
        segments: [
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "にもかかわらず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "試合",
            reading: "しあい",
          },
          {
            text: "は",
          },
          {
            text: "行",
            reading: "おこな",
          },
          {
            text: "われました。",
          },
        ],
        translation: "Malgré la pluie, le match a eu lieu.",
      },
      {
        segments: [
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "したにもかかわらず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "失敗",
            reading: "しっぱい",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Malgré mes efforts, j’ai échoué.",
      },
    ],
  },
  {
    id: "wo-towazu",
    pattern: "〜を問わず",
    patternSegments: [
      { text: "〜" },
      { text: "を" },
      { text: "問", reading: "と" },
      { text: "わず" },
    ],
    jlptLevel: "N3",
    meaning: "Sans distinction de ~, quel que soit ~",
    rule: "Nom + を問わず",
    usage: "Pour exprimer qu'une chose s'applique sans tenir compte d'une distinction particulière (âge, sexe, saison, etc.).",
    examples: [
      {
        segments: [
          {
            text: "年齢",
            reading: "ねんれい",
          },
          {
            text: "を",
          },
          {
            text: "問",
            reading: "と",
          },
          {
            text: "わず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "誰",
            reading: "だれ",
          },
          {
            text: "でも",
          },
          {
            text: "参加",
            reading: "さんか",
          },
          {
            text: "できます。",
          },
        ],
        translation: "Sans distinction d’âge, tout le monde peut participer.",
      },
      {
        segments: [
          {
            text: "昼夜",
            reading: "ちゅうや",
          },
          {
            text: "を",
          },
          {
            text: "問",
            reading: "と",
          },
          {
            text: "わず",
            highlight: true,
          },
          {
            text: "営業",
            reading: "えいぎょう",
          },
          {
            text: "しています。",
          },
        ],
        translation: "Ouvert jour et nuit, sans distinction.",
      },
    ],
  },
  {
    id: "bakari-ni",
    pattern: "〜ばかりに",
    jlptLevel: "N3",
    meaning: "Juste parce que ~ (conséquence négative)",
    rule: "Verbe/adjectif (forme normale) + ばかりに",
    usage: "Pour exprimer qu'une cause, souvent mineure, a entraîné un résultat négatif et regrettable.",
    examples: [
      {
        segments: [
          {
            text: "嘘",
            reading: "うそ",
          },
          {
            text: "をついたばかりに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "信用",
            reading: "しんよう",
          },
          {
            text: "を",
          },
          {
            text: "失",
            reading: "うしな",
          },
          {
            text: "いました。",
          },
        ],
        translation: "Juste parce que j’ai menti, j’ai perdu la confiance des autres.",
      },
      {
        segments: [
          {
            text: "寝坊",
            reading: "ねぼう",
          },
          {
            text: "したばかりに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "電車",
            reading: "でんしゃ",
          },
          {
            text: "に",
          },
          {
            text: "乗",
            reading: "の",
          },
          {
            text: "り",
          },
          {
            text: "遅",
            reading: "おく",
          },
          {
            text: "れました。",
          },
        ],
        translation: "Juste parce que je me suis réveillé en retard, j’ai raté le train.",
      },
    ],
  },
  {
    id: "gimi",
    pattern: "〜気味",
    patternSegments: [
      { text: "〜" },
      { text: "気味", reading: "ぎみ" },
    ],
    jlptLevel: "N3",
    meaning: "Légère tendance à ~",
    rule: "Verbe (forme ます) / Nom + 気味",
    usage: "Pour exprimer une légère tendance ou un léger symptôme, souvent physique ou d'état d'esprit.",
    examples: [
      {
        segments: [
          {
            text: "最近",
            reading: "さいきん",
          },
          {
            text: "、",
          },
          {
            text: "疲",
            reading: "つか",
          },
          {
            text: "れ",
          },
          {
            text: "気味",
            reading: "ぎみ",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Ces derniers temps, je suis un peu fatigué.",
      },
      {
        segments: [
          {
            text: "風邪",
            reading: "かぜ",
          },
          {
            text: "気味",
            reading: "ぎみ",
            highlight: true,
          },
          {
            text: "なので",
          },
          {
            text: "、",
          },
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "く",
          },
          {
            text: "寝",
            reading: "ね",
          },
          {
            text: "ます。",
          },
        ],
        translation: "J’ai un léger rhume qui s’annonce, donc je vais me coucher tôt.",
      },
    ],
  },
  {
    id: "te-tamaranai",
    pattern: "〜てたまらない",
    jlptLevel: "N3",
    meaning: "Insupportablement ~",
    rule: "Verbe (forme て) / Adjectif (forme て/くて) + たまらない",
    usage: "Pour exprimer un sentiment ou une sensation physique extrêmement forte, insupportable.",
    examples: [
      {
        segments: [
          {
            text: "喉",
            reading: "のど",
          },
          {
            text: "が",
          },
          {
            text: "渇",
            reading: "かわ",
          },
          {
            text: "いてたまりません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "J’ai une soif insupportable.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "に",
          },
          {
            text: "会",
            reading: "あ",
          },
          {
            text: "いたくてたまりません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "J’ai une envie insupportable de la voir.",
      },
    ],
  },
  {
    id: "to-iu-mono-dewa-nai",
    pattern: "〜というものではない",
    jlptLevel: "N3",
    meaning: "Ce n’est pas forcément vrai que ~",
    rule: "Verbe/adjectif (forme normale) + というものではない",
    usage: "Pour nuancer ou rejeter une généralisation qui pourrait sembler évidente.",
    examples: [
      {
        segments: [
          {
            text: "お金",
            reading: "かね",
          },
          {
            text: "があれば",
          },
          {
            text: "幸",
            reading: "しあわ",
          },
          {
            text: "せというものではありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Ce n’est pas parce qu’on a de l’argent qu’on est forcément heureux.",
      },
      {
        segments: [
          {
            text: "安",
            reading: "やす",
          },
          {
            text: "ければいいというものではありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Ce n’est pas parce que c’est bon marché que c’est forcément bien.",
      },
    ],
  },
  {
    id: "mono-dakara",
    pattern: "〜ものだから",
    jlptLevel: "N2",
    meaning: "C’est parce que ~ (excuse)",
    rule: "Verbe/adjectif (forme normale) + ものだから",
    usage: "Pour donner une raison, souvent comme excuse ou justification d'un comportement inhabituel, avec un ton un peu plaintif.",
    examples: [
      {
        segments: [
          {
            text: "急",
            reading: "きゅう",
          },
          {
            text: "に",
          },
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "ったものだから",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "遅",
            reading: "おく",
          },
          {
            text: "れました。",
          },
        ],
        translation: "C’est parce qu’il s’est mis à pleuvoir soudainement que je suis en retard.",
      },
      {
        segments: [
          {
            text: "眠",
            reading: "ねむ",
          },
          {
            text: "かったものだから",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "授業",
            reading: "じゅぎょう",
          },
          {
            text: "中",
            reading: "ちゅう",
          },
          {
            text: "に",
          },
          {
            text: "寝",
            reading: "ね",
          },
          {
            text: "てしまいました。",
          },
        ],
        translation: "C’est parce que j’avais sommeil que je me suis endormi en cours.",
      },
    ],
  },
  {
    id: "ni-seyo",
    pattern: "〜にせよ／〜にしろ",
    jlptLevel: "N2",
    meaning: "Que ce soit ~ (concession)",
    rule: "Verbe/adjectif (forme normale) / Nom + にせよ・にしろ",
    usage: "Pour exprimer que, quelle que soit l'hypothèse envisagée, la conclusion reste la même.",
    examples: [
      {
        segments: [
          {
            text: "冗談",
            reading: "じょうだん",
          },
          {
            text: "にせよ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "あの",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "い",
          },
          {
            text: "方",
            reading: "かた",
          },
          {
            text: "はひどいです。",
          },
        ],
        translation: "Même si c’était une blague, cette façon de parler était méchante.",
      },
      {
        segments: [
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しいにしろ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "連絡",
            reading: "れんらく",
          },
          {
            text: "ぐらいはできるはずです。",
          },
        ],
        translation: "Même si l’on est occupé, on devrait pouvoir au moins donner des nouvelles.",
      },
    ],
  },
  {
    id: "koto-naku",
    pattern: "〜ことなく",
    jlptLevel: "N2",
    meaning: "Sans faire ~",
    rule: "Verbe (forme辞書) + ことなく",
    usage: "Pour exprimer qu'une action se déroule sans qu'une autre ne se produise, dans un registre écrit ou formel.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "諦",
            reading: "あきら",
          },
          {
            text: "めることなく",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "練習",
            reading: "れんしゅう",
          },
          {
            text: "を",
          },
          {
            text: "続",
            reading: "つづ",
          },
          {
            text: "けました。",
          },
        ],
        translation: "Il a continué à s’entraîner sans jamais abandonner.",
      },
      {
        segments: [
          {
            text: "一度",
            reading: "いちど",
          },
          {
            text: "も",
          },
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "むことなく",
            highlight: true,
          },
          {
            text: "働",
            reading: "はたら",
          },
          {
            text: "きました。",
          },
        ],
        translation: "J’ai travaillé sans jamais me reposer.",
      },
    ],
  },
  {
    id: "wo-yoso-ni",
    pattern: "〜をよそに",
    jlptLevel: "N2",
    meaning: "Sans se soucier de ~",
    rule: "Nom + をよそに",
    usage: "Pour exprimer qu'on ignore délibérément une préoccupation, une inquiétude ou une opposition pour agir autrement.",
    examples: [
      {
        segments: [
          {
            text: "親",
            reading: "おや",
          },
          {
            text: "の",
          },
          {
            text: "心配",
            reading: "しんぱい",
          },
          {
            text: "をよそに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "一人",
            reading: "ひとり",
          },
          {
            text: "で",
          },
          {
            text: "旅",
            reading: "たび",
          },
          {
            text: "に",
          },
          {
            text: "出",
            reading: "で",
          },
          {
            text: "ました。",
          },
        ],
        translation: "Sans se soucier de l’inquiétude de ses parents, il est parti seul en voyage.",
      },
      {
        segments: [
          {
            text: "周囲",
            reading: "しゅうい",
          },
          {
            text: "の",
          },
          {
            text: "反対",
            reading: "はんたい",
          },
          {
            text: "をよそに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "結婚",
            reading: "けっこん",
          },
          {
            text: "を",
          },
          {
            text: "決",
            reading: "き",
          },
          {
            text: "めました。",
          },
        ],
        translation: "Sans se soucier de l’opposition de son entourage, elle a décidé de se marier.",
      },
    ],
  },
  {
    id: "nakushite-wa",
    pattern: "〜なくして(は)",
    jlptLevel: "N2",
    meaning: "Sans ~ (il n’y aurait pas de...)",
    rule: "Nom + なくして(は)",
    usage: "Pour exprimer qu'un élément est indispensable, souvent suivi d'une conséquence négative ou impossible sans lui.",
    examples: [
      {
        segments: [
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "なくして",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "成功",
            reading: "せいこう",
          },
          {
            text: "はありません。",
          },
        ],
        translation: "Sans efforts, il n’y a pas de réussite.",
      },
      {
        segments: [
          {
            text: "皆様",
            reading: "みなさま",
          },
          {
            text: "の",
          },
          {
            text: "ご協力",
            reading: "ごきょうりょく",
          },
          {
            text: "なくしては",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "この",
          },
          {
            text: "プロジェクト",
            highlight: false,
          },
          {
            text: "は",
          },
          {
            text: "成功",
            reading: "せいこう",
          },
          {
            text: "しませんでした。",
          },
        ],
        translation: "Sans la coopération de tous, ce projet n’aurait pas réussi.",
      },
    ],
  },
  {
    id: "mamire",
    pattern: "〜まみれ",
    jlptLevel: "N2",
    meaning: "Couvert de ~ (salissure)",
    rule: "Nom + まみれ",
    usage: "Pour exprimer qu'une chose ou une personne est entièrement recouverte d'une substance salissante (sueur, sang, boue, poussière...).",
    examples: [
      {
        segments: [
          {
            text: "汗",
            reading: "あせ",
          },
          {
            text: "まみれ",
            highlight: true,
          },
          {
            text: "になって",
          },
          {
            text: "働",
            reading: "はたら",
          },
          {
            text: "きました。",
          },
        ],
        translation: "J’ai travaillé, couvert de sueur.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "たちは",
          },
          {
            text: "泥",
            reading: "どろ",
          },
          {
            text: "まみれ",
            highlight: true,
          },
          {
            text: "になって",
          },
          {
            text: "遊",
            reading: "あそ",
          },
          {
            text: "んでいました。",
          },
        ],
        translation: "Les enfants jouaient, couverts de boue.",
      },
    ],
  },
  {
    id: "zukume",
    pattern: "〜ずくめ",
    jlptLevel: "N2",
    meaning: "Rien que des ~",
    rule: "Nom + ずくめ",
    usage: "Pour exprimer qu'une situation est entièrement composée d'une seule chose (souvent une bonne nouvelle, ou une couleur).",
    examples: [
      {
        segments: [
          {
            text: "今年",
            reading: "ことし",
          },
          {
            text: "は",
          },
          {
            text: "いいこと",
          },
          {
            text: "ずくめ",
            highlight: true,
          },
          {
            text: "でした。",
          },
        ],
        translation: "Cette année n’a été que de bonnes nouvelles.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "黒",
            reading: "くろ",
          },
          {
            text: "ずくめ",
            highlight: true,
          },
          {
            text: "の",
          },
          {
            text: "服装",
            reading: "ふくそう",
          },
          {
            text: "をしています。",
          },
        ],
        translation: "Il porte une tenue entièrement noire.",
      },
    ],
  },
  {
    id: "bekarazu",
    pattern: "〜べからず",
    jlptLevel: "N2",
    meaning: "Il est interdit de ~ (formel, écrit)",
    rule: "Verbe (forme辞書) + べからず",
    usage: "Pour exprimer une interdiction formelle, souvent sur des panneaux ou des règlements écrits, dans un registre très soutenu.",
    examples: [
      {
        segments: [
          {
            text: "ここに",
          },
          {
            text: "駐車",
            reading: "ちゅうしゃ",
          },
          {
            text: "すべからず",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il est interdit de se garer ici.",
      },
      {
        segments: [
          {
            text: "芝生",
            reading: "しばふ",
          },
          {
            text: "に",
          },
          {
            text: "入",
            reading: "はい",
          },
          {
            text: "るべからず",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il est interdit de marcher sur la pelouse.",
      },
    ],
  },
  {
    id: "nashini",
    pattern: "〜なしに",
    jlptLevel: "N2",
    meaning: "Sans faire ~",
    rule: "Nom + なしに",
    usage: "Pour exprimer qu'une action se réalise sans qu'une étape ou une permission préalable n'ait eu lieu.",
    examples: [
      {
        segments: [
          {
            text: "許可",
            reading: "きょか",
          },
          {
            text: "なしに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "中",
            reading: "なか",
          },
          {
            text: "に",
          },
          {
            text: "入",
            reading: "はい",
          },
          {
            text: "らないでください。",
          },
        ],
        translation: "Veuillez ne pas entrer sans autorisation.",
      },
      {
        segments: [
          {
            text: "連絡",
            reading: "れんらく",
          },
          {
            text: "なしに",
            highlight: true,
          },
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "むのは",
          },
          {
            text: "困",
            reading: "こま",
          },
          {
            text: "ります。",
          },
        ],
        translation: "C’est gênant de s’absenter sans prévenir.",
      },
    ],
  },
  {
    id: "nuki-ni-shite",
    pattern: "〜ぬきにして(は)",
    jlptLevel: "N2",
    meaning: "Sans ~ / mis à part ~",
    rule: "Nom + ぬきにして(は)",
    usage: "Pour exprimer qu'une chose est écartée d'une discussion, ou qu'une autre chose serait impossible sans elle.",
    examples: [
      {
        segments: [
          {
            text: "冗談",
            reading: "じょうだん",
          },
          {
            text: "はぬきにして",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "真面目",
            reading: "まじめ",
          },
          {
            text: "に",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "しましょう。",
          },
        ],
        translation: "Mettons les plaisanteries de côté, et parlons sérieusement.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "協力",
            reading: "きょうりょく",
          },
          {
            text: "をぬきにしては",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "このプロジェクトは",
          },
          {
            text: "完成",
            reading: "かんせい",
          },
          {
            text: "しませんでした。",
          },
        ],
        translation: "Sans sa coopération, ce projet n’aurait pas été achevé.",
      },
    ],
  },
  {
    id: "wo-motte",
    pattern: "〜をもって",
    jlptLevel: "N2",
    meaning: "Au moyen de ~ / à partir de ~ (formel)",
    rule: "Nom + をもって",
    usage: "Pour indiquer un moyen, un instrument, ou un point précis dans le temps de manière formelle (souvent dans des annonces officielles).",
    examples: [
      {
        segments: [
          {
            text: "本日",
            reading: "ほんじつ",
          },
          {
            text: "をもって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "閉店",
            reading: "へいてん",
          },
          {
            text: "いたします。",
          },
        ],
        translation: "Nous fermons boutique à compter d’aujourd’hui.",
      },
      {
        segments: [
          {
            text: "実力",
            reading: "じつりょく",
          },
          {
            text: "をもって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "証明",
            reading: "しょうめい",
          },
          {
            text: "します。",
          },
        ],
        translation: "Je le prouverai par mes compétences.",
      },
    ],
  },
  {
    id: "wo-megutte",
    pattern: "〜をめぐって",
    jlptLevel: "N2",
    meaning: "Au sujet de ~ (conflit, débat)",
    rule: "Nom + をめぐって",
    usage: "Pour exprimer qu'un débat, un conflit ou une discussion tourne autour d'un sujet donné.",
    examples: [
      {
        segments: [
          {
            text: "土地",
            reading: "とち",
          },
          {
            text: "の",
          },
          {
            text: "所有権",
            reading: "しょゆうけん",
          },
          {
            text: "をめぐって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "争",
            reading: "あらそ",
          },
          {
            text: "いが",
          },
          {
            text: "起",
            reading: "お",
          },
          {
            text: "きました。",
          },
        ],
        translation: "Un conflit a éclaté au sujet de la propriété du terrain.",
      },
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "政策",
            reading: "せいさく",
          },
          {
            text: "をめぐって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "議論",
            reading: "ぎろん",
          },
          {
            text: "が",
          },
          {
            text: "続",
            reading: "つづ",
          },
          {
            text: "いています。",
          },
        ],
        translation: "Le débat se poursuit au sujet de cette politique.",
      },
    ],
  },
  {
    id: "wo-kikkake-ni",
    pattern: "〜をきっかけに",
    jlptLevel: "N2",
    meaning: "Ayant pour déclencheur ~",
    rule: "Nom + をきっかけに",
    usage: "Pour indiquer l'événement qui a déclenché ou motivé un changement, une décision ou un nouveau départ.",
    examples: [
      {
        segments: [
          {
            text: "友達",
            reading: "ともだち",
          },
          {
            text: "の",
          },
          {
            text: "一言",
            reading: "ひとこと",
          },
          {
            text: "をきっかけに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "留学",
            reading: "りゅうがく",
          },
          {
            text: "を",
          },
          {
            text: "決意",
            reading: "けつい",
          },
          {
            text: "しました。",
          },
        ],
        translation: "C’est une remarque d’un ami qui m’a poussé à décider de partir étudier à l’étranger.",
      },
      {
        segments: [
          {
            text: "病気",
            reading: "びょうき",
          },
          {
            text: "をきっかけに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "生活",
            reading: "せいかつ",
          },
          {
            text: "習慣",
            reading: "しゅうかん",
          },
          {
            text: "を",
          },
          {
            text: "見直",
            reading: "みなお",
          },
          {
            text: "しました。",
          },
        ],
        translation: "C’est une maladie qui m’a poussé à revoir mes habitudes de vie.",
      },
    ],
  },
  {
    id: "wo-tsujite",
    pattern: "〜を通じて／〜を通して",
    patternSegments: [
      { text: "〜" },
      { text: "を" },
      { text: "通", reading: "つう" },
      { text: "じて" },
      { text: "／" },
      { text: "〜" },
      { text: "を" },
      { text: "通", reading: "とお" },
      { text: "して" },
    ],
    jlptLevel: "N2",
    meaning: "À travers ~ / durant tout ~",
    rule: "Nom + を通じて・を通して",
    usage: "Pour exprimer un moyen (à travers un intermédiaire) ou une durée continue (tout au long de).",
    examples: [
      {
        segments: [
          {
            text: "友人",
            reading: "ゆうじん",
          },
          {
            text: "を",
          },
          {
            text: "通",
            reading: "つう",
          },
          {
            text: "じて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "を",
          },
          {
            text: "知",
            reading: "し",
          },
          {
            text: "りました。",
          },
        ],
        translation: "C’est par l’intermédiaire d’un ami que je l’ai connu.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "地方",
            reading: "ちほう",
          },
          {
            text: "は",
          },
          {
            text: "一年",
            reading: "いちねん",
          },
          {
            text: "を",
          },
          {
            text: "通",
            reading: "つう",
          },
          {
            text: "して",
            highlight: true,
          },
          {
            text: "暖",
            reading: "あたた",
          },
          {
            text: "かいです。",
          },
        ],
        translation: "Cette région est chaude toute l’année.",
      },
    ],
  },
  {
    id: "ni-watatte",
    pattern: "〜にわたって",
    jlptLevel: "N2",
    meaning: "S’étendant sur ~ (durée, portée)",
    rule: "Nom + にわたって",
    usage: "Pour exprimer qu'une action ou un état s'étend sur une longue période de temps ou une large portée.",
    examples: [
      {
        segments: [
          {
            text: "三年間",
            reading: "さんねんかん",
          },
          {
            text: "にわたって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "調査",
            reading: "ちょうさ",
          },
          {
            text: "を",
          },
          {
            text: "行",
            reading: "おこな",
          },
          {
            text: "いました。",
          },
        ],
        translation: "L’enquête s’est déroulée sur trois ans.",
      },
      {
        segments: [
          {
            text: "全国",
            reading: "ぜんこく",
          },
          {
            text: "にわたって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "っています。",
          },
        ],
        translation: "Il pleut sur l’ensemble du pays.",
      },
    ],
  },
  {
    id: "ni-tsuke-te",
    pattern: "〜につけ(て)",
    jlptLevel: "N2",
    meaning: "Chaque fois que ~",
    rule: "Verbe (forme辞書) / Nom + につけ(て)",
    usage: "Pour exprimer que chaque fois qu'une situation se présente, un même sentiment ou une même pensée survient.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "歌",
            reading: "うた",
          },
          {
            text: "を",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "くにつけ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "昔",
            reading: "むかし",
          },
          {
            text: "を",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "い",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "します。",
          },
        ],
        translation: "Chaque fois que j’entends cette chanson, je me souviens du passé.",
      },
      {
        segments: [
          {
            text: "何事",
            reading: "なにごと",
          },
          {
            text: "につけ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "文句",
            reading: "もんく",
          },
          {
            text: "を",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "います。",
          },
        ],
        translation: "Pour tout et n’importe quoi, il se plaint.",
      },
    ],
  },
  {
    id: "ni-tsurete",
    pattern: "〜につれて",
    jlptLevel: "N2",
    meaning: "À mesure que ~",
    rule: "Verbe (forme辞書) / Nom + につれて",
    usage: "Pour exprimer qu'un changement s'accompagne progressivement d'un autre changement.",
    examples: [
      {
        segments: [
          {
            text: "時間",
            reading: "じかん",
          },
          {
            text: "が",
          },
          {
            text: "経",
            reading: "た",
          },
          {
            text: "つにつれて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "傷",
            reading: "きず",
          },
          {
            text: "は",
          },
          {
            text: "治",
            reading: "なお",
          },
          {
            text: "っていきました。",
          },
        ],
        translation: "À mesure que le temps passait, la blessure guérissait.",
      },
      {
        segments: [
          {
            text: "都市化",
            reading: "としか",
          },
          {
            text: "が",
          },
          {
            text: "進",
            reading: "すす",
          },
          {
            text: "むにつれて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "自然",
            reading: "しぜん",
          },
          {
            text: "が",
          },
          {
            text: "減",
            reading: "へ",
          },
          {
            text: "っています。",
          },
        ],
        translation: "À mesure que l’urbanisation progresse, la nature diminue.",
      },
    ],
  },
  {
    id: "ni-shitagatte",
    pattern: "〜にしたがって",
    jlptLevel: "N2",
    meaning: "En suivant ~ / à mesure que ~",
    rule: "Verbe (forme辞書) / Nom + にしたがって",
    usage: "Pour exprimer qu'on se conforme à une règle, un ordre, ou qu'un changement suit proportionnellement un autre.",
    examples: [
      {
        segments: [
          {
            text: "規則",
            reading: "きそく",
          },
          {
            text: "にしたがって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "行動",
            reading: "こうどう",
          },
          {
            text: "してください。",
          },
        ],
        translation: "Veuillez agir en suivant le règlement.",
      },
      {
        segments: [
          {
            text: "収入",
            reading: "しゅうにゅう",
          },
          {
            text: "が",
          },
          {
            text: "増",
            reading: "ふ",
          },
          {
            text: "えるにしたがって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "支出",
            reading: "ししゅつ",
          },
          {
            text: "も",
          },
          {
            text: "増",
            reading: "ふ",
          },
          {
            text: "えました。",
          },
        ],
        translation: "À mesure que les revenus augmentaient, les dépenses augmentaient aussi.",
      },
    ],
  },
  {
    id: "ni-tomonatte",
    pattern: "〜に伴って",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "伴", reading: "ともな" },
      { text: "って" },
    ],
    jlptLevel: "N2",
    meaning: "Accompagnant ~ / avec ~",
    rule: "Nom / Verbe (forme辞書) + に伴って",
    usage: "Pour exprimer qu'un changement se produit en accompagnement d'un autre changement, dans un registre plutôt formel.",
    examples: [
      {
        segments: [
          {
            text: "人口",
            reading: "じんこう",
          },
          {
            text: "の",
          },
          {
            text: "増加",
            reading: "ぞうか",
          },
          {
            text: "に",
          },
          {
            text: "伴",
            reading: "ともな",
          },
          {
            text: "って",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "住宅",
            reading: "じゅうたく",
          },
          {
            text: "不足",
            reading: "ぶそく",
          },
          {
            text: "が",
          },
          {
            text: "深刻化",
            reading: "しんこくか",
          },
          {
            text: "しています。",
          },
        ],
        translation: "Avec l’augmentation de la population, la pénurie de logements s’aggrave.",
      },
      {
        segments: [
          {
            text: "台風",
            reading: "たいふう",
          },
          {
            text: "の",
          },
          {
            text: "接近",
            reading: "せっきん",
          },
          {
            text: "に",
          },
          {
            text: "伴",
            reading: "ともな",
          },
          {
            text: "い",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "電車",
            reading: "でんしゃ",
          },
          {
            text: "が",
          },
          {
            text: "止",
            reading: "と",
          },
          {
            text: "まりました。",
          },
        ],
        translation: "Avec l’approche du typhon, les trains se sont arrêtés.",
      },
    ],
  },
  {
    id: "to-douji-ni",
    pattern: "〜と同時に",
    patternSegments: [
      { text: "〜" },
      { text: "と" },
      { text: "同時", reading: "どうじ" },
      { text: "に" },
    ],
    jlptLevel: "N2",
    meaning: "En même temps que ~",
    rule: "Verbe (forme辞書) / Nom + と同時に",
    usage: "Pour exprimer que deux événements ou deux états se produisent simultanément, ou qu'une chose a deux aspects à la fois.",
    examples: [
      {
        segments: [
          {
            text: "ドア",
            highlight: false,
          },
          {
            text: "が",
          },
          {
            text: "開",
            reading: "あ",
          },
          {
            text: "くと",
          },
          {
            text: "同時",
            reading: "どうじ",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "客",
            reading: "きゃく",
          },
          {
            text: "が",
          },
          {
            text: "入",
            reading: "はい",
          },
          {
            text: "ってきました。",
          },
        ],
        translation: "Au moment même où la porte s’est ouverte, un client est entré.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "医者",
            reading: "いしゃ",
          },
          {
            text: "であると",
          },
          {
            text: "同時",
            reading: "どうじ",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "作家",
            reading: "さっか",
          },
          {
            text: "でもあります。",
          },
        ],
        translation: "Il est médecin et écrivain à la fois.",
      },
    ],
  },
  {
    id: "katawara",
    pattern: "〜かたわら",
    jlptLevel: "N2",
    meaning: "Tout en faisant ~ (activité secondaire)",
    rule: "Verbe (forme辞書) / Nom+の + かたわら",
    usage: "Pour exprimer qu'on mène une activité secondaire régulière en parallèle d'une activité principale.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "会社員",
            reading: "かいしゃいん",
          },
          {
            text: "の",
          },
          {
            text: "かたわら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "小説",
            reading: "しょうせつ",
          },
          {
            text: "を",
          },
          {
            text: "書",
            reading: "か",
          },
          {
            text: "いています。",
          },
        ],
        translation: "Tout en étant salarié, il écrit des romans.",
      },
      {
        segments: [
          {
            text: "家事",
            reading: "かじ",
          },
          {
            text: "の",
          },
          {
            text: "かたわら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "語学",
            reading: "ごがく",
          },
          {
            text: "を",
          },
          {
            text: "勉強",
            reading: "べんきょう",
          },
          {
            text: "しています。",
          },
        ],
        translation: "Tout en s’occupant du foyer, elle étudie les langues.",
      },
    ],
  },
  {
    id: "ka-to-omou-to",
    pattern: "〜かと思うと／〜かと思ったら",
    patternSegments: [
      { text: "〜" },
      { text: "かと" },
      { text: "思", reading: "おも" },
      { text: "うと" },
      { text: "／" },
      { text: "〜" },
      { text: "かと" },
      { text: "思", reading: "おも" },
      { text: "ったら" },
    ],
    jlptLevel: "N2",
    meaning: "À peine ~ que ~ déjà",
    rule: "Verbe (forme辞書・た形) + かと思うと・かと思ったら",
    usage: "Pour exprimer qu'un changement inattendu et immédiat suit une action, souvent avec une nuance de surprise.",
    examples: [
      {
        segments: [
          {
            text: "空",
            reading: "そら",
          },
          {
            text: "が",
          },
          {
            text: "晴",
            reading: "は",
          },
          {
            text: "れたかと",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "うと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "また",
          },
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "ってきました。",
          },
        ],
        translation: "À peine le ciel s’était-il éclairci qu’il s’est remis à pleuvoir.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "が",
          },
          {
            text: "泣",
            reading: "な",
          },
          {
            text: "いたかと",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "ったら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "すぐに",
          },
          {
            text: "笑",
            reading: "わら",
          },
          {
            text: "い",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "しました。",
          },
        ],
        translation: "À peine l’enfant avait-il pleuré qu’il s’est mis à rire.",
      },
    ],
  },
  {
    id: "nari",
    pattern: "〜なり",
    jlptLevel: "N2",
    meaning: "Aussitôt après ~",
    rule: "Verbe (forme辞書) + なり",
    usage: "Pour exprimer qu'une deuxième action suit immédiatement la première, sans délai.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "家",
            reading: "いえ",
          },
          {
            text: "に",
          },
          {
            text: "帰",
            reading: "かえ",
          },
          {
            text: "るなり",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "寝",
            reading: "ね",
          },
          {
            text: "てしまいました。",
          },
        ],
        translation: "Aussitôt rentré chez lui, il s’est endormi.",
      },
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "知",
            reading: "し",
          },
          {
            text: "らせを",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "くなり",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "泣",
            reading: "な",
          },
          {
            text: "き",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Aussitôt qu’elle a entendu cette nouvelle, elle s’est mise à pleurer.",
      },
    ],
  },
  {
    id: "ya-ina-ya",
    pattern: "〜や否や",
    patternSegments: [
      { text: "〜" },
      { text: "や" },
      { text: "否", reading: "いな" },
      { text: "や" },
    ],
    jlptLevel: "N2",
    meaning: "À peine ~ que (immédiatement)",
    rule: "Verbe (forme辞書) + や否や",
    usage: "Pour exprimer qu'une action se produit immédiatement après une autre, dans un registre écrit et soutenu.",
    examples: [
      {
        segments: [
          {
            text: "ベル",
          },
          {
            text: "が",
          },
          {
            text: "鳴",
            reading: "な",
          },
          {
            text: "るや",
          },
          {
            text: "否",
            reading: "いな",
          },
          {
            text: "や",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "生徒",
            reading: "せいと",
          },
          {
            text: "たちは",
          },
          {
            text: "教室",
            reading: "きょうしつ",
          },
          {
            text: "を",
          },
          {
            text: "飛",
            reading: "と",
          },
          {
            text: "び",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "しました。",
          },
        ],
        translation: "À peine la cloche a-t-elle sonné que les élèves se sont précipités hors de la salle.",
      },
      {
        segments: [
          {
            text: "発売",
            reading: "はつばい",
          },
          {
            text: "される",
          },
          {
            text: "や",
          },
          {
            text: "否",
            reading: "いな",
          },
          {
            text: "や",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "売",
            reading: "う",
          },
          {
            text: "り",
          },
          {
            text: "切",
            reading: "き",
          },
          {
            text: "れました。",
          },
        ],
        translation: "Dès sa mise en vente, il a été épuisé.",
      },
    ],
  },
  {
    id: "sobakara",
    pattern: "〜そばから",
    jlptLevel: "N2",
    meaning: "À peine ~ que déjà (répétitif)",
    rule: "Verbe (forme辞書・た形) + そばから",
    usage: "Pour exprimer qu'une action est immédiatement annulée ou répétée par une autre, souvent de façon répétitive et un peu agaçante.",
    examples: [
      {
        segments: [
          {
            text: "片付",
            reading: "かたづ",
          },
          {
            text: "けるそばから",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "が",
          },
          {
            text: "散",
            reading: "ち",
          },
          {
            text: "らかします。",
          },
        ],
        translation: "À peine je range que l’enfant remet le désordre.",
      },
      {
        segments: [
          {
            text: "覚",
            reading: "おぼ",
          },
          {
            text: "えたそばから",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "忘",
            reading: "わす",
          },
          {
            text: "れてしまいます。",
          },
        ],
        translation: "À peine appris, j’oublie déjà.",
      },
    ],
  },
  {
    id: "tekara-to-iu-mono",
    pattern: "〜てからというもの",
    jlptLevel: "N2",
    meaning: "Depuis que ~ (changement durable)",
    rule: "Verbe (て形) + からというもの",
    usage: "Pour exprimer que depuis un événement précis, une situation nouvelle et durable s'est installée.",
    examples: [
      {
        segments: [
          {
            text: "結婚",
            reading: "けっこん",
          },
          {
            text: "してからというもの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "料理",
            reading: "りょうり",
          },
          {
            text: "が",
          },
          {
            text: "上手",
            reading: "じょうず",
          },
          {
            text: "になりました。",
          },
        ],
        translation: "Depuis que je me suis marié, je suis devenu bon en cuisine.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "病気",
            reading: "びょうき",
          },
          {
            text: "をしてからというもの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "健康",
            reading: "けんこう",
          },
          {
            text: "に",
          },
          {
            text: "気",
            reading: "き",
          },
          {
            text: "を",
          },
          {
            text: "使",
            reading: "つか",
          },
          {
            text: "うようになりました。",
          },
        ],
        translation: "Depuis sa maladie, il fait attention à sa santé.",
      },
    ],
  },
  {
    id: "wo-oite",
    pattern: "〜をおいて",
    jlptLevel: "N2",
    meaning: "À part ~ (personne d’autre que)",
    rule: "Nom + をおいて",
    usage: "Pour exprimer, souvent avec une négation, qu'il n'existe personne ou rien d'autre à part l'élément mentionné.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "をおいて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "適任者",
            reading: "てきにんしゃ",
          },
          {
            text: "はいません。",
          },
        ],
        translation: "Il n’y a personne d’autre que lui pour ce poste.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "をおいて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "私",
            reading: "わたし",
          },
          {
            text: "にできることはありません。",
          },
        ],
        translation: "À part ce travail, il n’y a rien que je puisse faire.",
      },
    ],
  },
  {
    id: "narade-wa",
    pattern: "〜ならでは",
    jlptLevel: "N2",
    meaning: "Typique de ~ (que seul ~ peut offrir)",
    rule: "Nom + ならでは",
    usage: "Pour exprimer qu'une qualité ou une caractéristique est propre et unique à un sujet donné, dans un sens positif.",
    examples: [
      {
        segments: [
          {
            text: "これは",
          },
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "ならでは",
            highlight: true,
          },
          {
            text: "の",
          },
          {
            text: "文化",
            reading: "ぶんか",
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est une culture typiquement japonaise.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "味",
            reading: "あじ",
          },
          {
            text: "は",
          },
          {
            text: "この",
          },
          {
            text: "店",
            reading: "みせ",
          },
          {
            text: "ならでは",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Ce goût est propre à ce restaurant.",
      },
    ],
  },
  {
    id: "ni-taenai",
    pattern: "〜にたえない",
    jlptLevel: "N2",
    meaning: "Ne pas pouvoir supporter ~ / être digne de ~",
    rule: "Nom + にたえない",
    usage: "Pour exprimer soit qu'on ne peut supporter de voir/entendre quelque chose (souvent négatif), soit un sentiment intense (formel, positif comme 感謝にたえない).",
    examples: [
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "光景",
            reading: "こうけい",
          },
          {
            text: "は",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "るにたえない",
            highlight: true,
          },
          {
            text: "ものでした。",
          },
        ],
        translation: "Ce spectacle était insupportable à regarder.",
      },
      {
        segments: [
          {
            text: "皆様",
            reading: "みなさま",
          },
          {
            text: "の",
          },
          {
            text: "ご支援",
            reading: "ごしえん",
          },
          {
            text: "に",
          },
          {
            text: "感謝",
            reading: "かんしゃ",
          },
          {
            text: "にたえません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Je suis profondément reconnaissant de votre soutien.",
      },
    ],
  },
  {
    id: "ni-katakunai",
    pattern: "〜にかたくない",
    jlptLevel: "N2",
    meaning: "Facile à ~ (imaginer, comprendre)",
    rule: "Nom / Verbe (辞書形) + にかたくない",
    usage: "Pour exprimer qu'il est facile d'imaginer ou de comprendre quelque chose, souvent avec 想像.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "悲",
            reading: "かな",
          },
          {
            text: "しみは",
          },
          {
            text: "想像",
            reading: "そうぞう",
          },
          {
            text: "にかたくありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il est facile d’imaginer sa tristesse.",
      },
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "結果",
            reading: "けっか",
          },
          {
            text: "は",
          },
          {
            text: "予測",
            reading: "よそく",
          },
          {
            text: "にかたくない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Ce résultat était facile à prévoir.",
      },
    ],
  },
  {
    id: "made-mo-nai",
    pattern: "〜までもない",
    jlptLevel: "N2",
    meaning: "Pas la peine de ~",
    rule: "Verbe (辞書形) + までもない",
    usage: "Pour exprimer qu'une action est trop évidente ou trop simple pour qu'il soit nécessaire de la faire.",
    examples: [
      {
        segments: [
          {
            text: "これは",
          },
          {
            text: "説明",
            reading: "せつめい",
          },
          {
            text: "するまでもない",
            highlight: true,
          },
          {
            text: "ことです。",
          },
        ],
        translation: "Ce n’est même pas la peine de l’expliquer.",
      },
      {
        segments: [
          {
            text: "わざわざ",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "くまでもない",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "電話",
            reading: "でんわ",
          },
          {
            text: "で",
          },
          {
            text: "済",
            reading: "す",
          },
          {
            text: "みます。",
          },
        ],
        translation: "Pas la peine d’y aller exprès, un coup de téléphone suffit.",
      },
    ],
  },
  {
    id: "to-kitara",
    pattern: "〜ときたら",
    jlptLevel: "N2",
    meaning: "Pour ce qui est de ~ (critique)",
    rule: "Nom + ときたら",
    usage: "Pour introduire un sujet en vue d'une critique ou d'une plainte, souvent avec une nuance familière et négative.",
    examples: [
      {
        segments: [
          {
            text: "うちの",
          },
          {
            text: "息子",
            reading: "むすこ",
          },
          {
            text: "ときたら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "全然",
            reading: "ぜんぜん",
          },
          {
            text: "勉強",
            reading: "べんきょう",
          },
          {
            text: "しません。",
          },
        ],
        translation: "Pour ce qui est de mon fils, il n’étudie pas du tout.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "パソコン",
          },
          {
            text: "ときたら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "すぐ",
          },
          {
            text: "固",
            reading: "かた",
          },
          {
            text: "まってしまいます。",
          },
        ],
        translation: "Cet ordinateur, il se fige tout le temps.",
      },
    ],
  },
  {
    id: "to-ittara",
    pattern: "〜といったら",
    jlptLevel: "N2",
    meaning: "Ce que ~ peut être ! (intensité)",
    rule: "Nom / Adjectif + といったら",
    usage: "Pour exprimer une émotion ou une intensité extrême à propos d'un sujet, avec un ton exclamatif.",
    examples: [
      {
        segments: [
          {
            text: "あの",
          },
          {
            text: "時",
            reading: "とき",
          },
          {
            text: "の",
          },
          {
            text: "嬉",
            reading: "うれ",
          },
          {
            text: "しさ",
          },
          {
            text: "といったら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "言葉",
            reading: "ことば",
          },
          {
            text: "に",
          },
          {
            text: "できません。",
          },
        ],
        translation: "La joie que j’ai ressentie à ce moment-là, impossible à décrire avec des mots.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "頑固",
            reading: "がんこ",
          },
          {
            text: "さ",
          },
          {
            text: "といったら",
            highlight: true,
          },
          {
            text: "ありません。",
          },
        ],
        translation: "Son entêtement est sans limite.",
      },
    ],
  },
  {
    id: "ni-hikikae",
    pattern: "〜にひきかえ",
    jlptLevel: "N2",
    meaning: "Contrairement à ~ (contraste)",
    rule: "Nom + にひきかえ",
    usage: "Pour souligner un contraste marqué entre deux situations ou deux personnes.",
    examples: [
      {
        segments: [
          {
            text: "兄",
            reading: "あに",
          },
          {
            text: "にひきかえ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "弟",
            reading: "おとうと",
          },
          {
            text: "は",
          },
          {
            text: "とても",
          },
          {
            text: "真面目",
            reading: "まじめ",
          },
          {
            text: "です。",
          },
        ],
        translation: "Contrairement à son frère aîné, le cadet est très sérieux.",
      },
      {
        segments: [
          {
            text: "去年",
            reading: "きょねん",
          },
          {
            text: "の",
          },
          {
            text: "不況",
            reading: "ふきょう",
          },
          {
            text: "にひきかえ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "今年",
            reading: "ことし",
          },
          {
            text: "は",
          },
          {
            text: "景気",
            reading: "けいき",
          },
          {
            text: "がいいです。",
          },
        ],
        translation: "Contrairement à la récession de l’an dernier, la conjoncture est bonne cette année.",
      },
    ],
  },
  {
    id: "ni-mo-mashite",
    pattern: "〜にもまして",
    jlptLevel: "N2",
    meaning: "Plus encore que ~",
    rule: "Nom + にもまして",
    usage: "Pour exprimer qu'un degré dépasse encore celui, déjà élevé, d'un point de comparaison.",
    examples: [
      {
        segments: [
          {
            text: "今年",
            reading: "ことし",
          },
          {
            text: "は",
          },
          {
            text: "去年",
            reading: "きょねん",
          },
          {
            text: "にもまして",
            highlight: true,
          },
          {
            text: "暑",
            reading: "あつ",
          },
          {
            text: "いです。",
          },
        ],
        translation: "Cette année est encore plus chaude que l’an dernier.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "以前",
            reading: "いぜん",
          },
          {
            text: "にもまして",
            highlight: true,
          },
          {
            text: "美",
            reading: "うつく",
          },
          {
            text: "しくなりました。",
          },
        ],
        translation: "Elle est devenue plus belle encore qu’avant.",
      },
    ],
  },
  {
    id: "no-itari",
    pattern: "〜の至り",
    patternSegments: [
      { text: "〜" },
      { text: "の" },
      { text: "至", reading: "いた" },
      { text: "り" },
    ],
    jlptLevel: "N2",
    meaning: "Le comble de ~",
    rule: "Nom + の至り",
    usage: "Pour exprimer, dans un registre formel, que l'on atteint le comble d'un sentiment (honte, honneur...).",
    examples: [
      {
        segments: [
          {
            text: "このような",
          },
          {
            text: "賞",
            reading: "しょう",
          },
          {
            text: "をいただき、",
          },
          {
            text: "光栄",
            reading: "こうえい",
          },
          {
            text: "の",
          },
          {
            text: "至",
            reading: "いた",
          },
          {
            text: "り",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Recevoir un tel prix est un immense honneur.",
      },
      {
        segments: [
          {
            text: "あの",
          },
          {
            text: "発言",
            reading: "はつげん",
          },
          {
            text: "は",
          },
          {
            text: "若気",
            reading: "わかげ",
          },
          {
            text: "の",
          },
          {
            text: "至",
            reading: "いた",
          },
          {
            text: "り",
            highlight: true,
          },
          {
            text: "でした。",
          },
        ],
        translation: "Cette déclaration était le fruit de l’inconscience de la jeunesse.",
      },
    ],
  },
  {
    id: "kiwamarinai",
    pattern: "〜きわまりない",
    jlptLevel: "N2",
    meaning: "Extrêmement ~ (au comble de)",
    rule: "Adjectif-na (racine) + きわまりない",
    usage: "Pour exprimer qu'un état négatif atteint son comble, dans un registre soutenu et souvent critique.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "態度",
            reading: "たいど",
          },
          {
            text: "は",
          },
          {
            text: "失礼",
            reading: "しつれい",
          },
          {
            text: "きわまりない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Son attitude est on ne peut plus impolie.",
      },
      {
        segments: [
          {
            text: "それは",
          },
          {
            text: "危険",
            reading: "きけん",
          },
          {
            text: "きわまりない",
            highlight: true,
          },
          {
            text: "行為",
            reading: "こうい",
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est un acte extrêmement dangereux.",
      },
    ],
  },
  {
    id: "to-iedomo",
    pattern: "〜といえども",
    jlptLevel: "N2",
    meaning: "Même si ~ (concession, soutenu)",
    rule: "Nom / Verbe (forme normale) + といえども",
    usage: "Pour exprimer une concession forte dans un registre très soutenu, proche de 〜ても.",
    examples: [
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "といえども",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "責任",
            reading: "せきにん",
          },
          {
            text: "を",
          },
          {
            text: "免",
            reading: "まぬが",
          },
          {
            text: "れません。",
          },
        ],
        translation: "Même s’il s’agit d’un enfant, il n’échappe pas à sa responsabilité.",
      },
      {
        segments: [
          {
            text: "専門家",
            reading: "せんもんか",
          },
          {
            text: "といえども",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "間違",
            reading: "まちが",
          },
          {
            text: "うことはあります。",
          },
        ],
        translation: "Même un spécialiste peut se tromper.",
      },
    ],
  },
  {
    id: "naku-mo-nai",
    pattern: "〜なくもない",
    jlptLevel: "N2",
    meaning: "Ce n’est pas impossible que ~",
    rule: "Verbe (ない形) / Adjectif (く形) + なくもない",
    usage: "Pour exprimer, par litote (double négation), une possibilité admise avec réserve.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "気持",
            reading: "きも",
          },
          {
            text: "ちも",
          },
          {
            text: "分",
            reading: "わ",
          },
          {
            text: "からなくもない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Je comprends un peu ce qu’il ressent.",
      },
      {
        segments: [
          {
            text: "時間",
            reading: "じかん",
          },
          {
            text: "があれば",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "けなくもない",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Si j’ai le temps, ce n’est pas impossible que j’y aille.",
      },
    ],
  },
  {
    id: "to-itta-tokoroda",
    pattern: "〜といったところだ",
    jlptLevel: "N2",
    meaning: "C’est à peu près ~ (estimation modeste)",
    rule: "Nom / Verbe (辞書形) + といったところだ",
    usage: "Pour donner une estimation approximative et modeste d'une quantité ou d'un niveau.",
    examples: [
      {
        segments: [
          {
            text: "参加者",
            reading: "さんかしゃ",
          },
          {
            text: "は",
          },
          {
            text: "十人",
            reading: "じゅうにん",
          },
          {
            text: "といったところ",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Il y a environ dix participants, pas plus.",
      },
      {
        segments: [
          {
            text: "今",
            reading: "いま",
          },
          {
            text: "の",
          },
          {
            text: "実力",
            reading: "じつりょく",
          },
          {
            text: "では",
          },
          {
            text: "合格",
            reading: "ごうかく",
          },
          {
            text: "は",
          },
          {
            text: "五分",
            reading: "ごぶ",
          },
          {
            text: "五分",
            reading: "ごぶ",
          },
          {
            text: "といったところ",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Avec le niveau actuel, réussir est à peu près cinquante-cinquante.",
      },
    ],
  },
  {
    id: "ga-hayaika",
    pattern: "〜が早いか",
    patternSegments: [
      { text: "〜" },
      { text: "が" },
      { text: "早", reading: "はや" },
      { text: "いか" },
    ],
    jlptLevel: "N2",
    meaning: "À peine ~ que (aussitôt)",
    rule: "Verbe (辞書形) + が早いか",
    usage: "Pour exprimer qu'une deuxième action a lieu au moment même où la première se termine, dans un registre écrit.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "席",
            reading: "せき",
          },
          {
            text: "に",
          },
          {
            text: "着",
            reading: "つ",
          },
          {
            text: "くが",
          },
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "いか",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "眠",
            reading: "ねむ",
          },
          {
            text: "ってしまいました。",
          },
        ],
        translation: "À peine assis, il s’est endormi.",
      },
      {
        segments: [
          {
            text: "号砲",
            reading: "ごうほう",
          },
          {
            text: "が",
          },
          {
            text: "鳴",
            reading: "な",
          },
          {
            text: "るが",
          },
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "いか",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "選手",
            reading: "せんしゅ",
          },
          {
            text: "たちは",
          },
          {
            text: "走",
            reading: "はし",
          },
          {
            text: "り",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Dès le coup de feu, les athlètes se sont élancés.",
      },
    ],
  },
  {
    id: "kototote",
    pattern: "〜こととて",
    jlptLevel: "N2",
    meaning: "Comme c’est ~ (excuse, soutenu)",
    rule: "Verbe/adjectif (forme normale) + こととて",
    usage: "Pour présenter une excuse formelle en indiquant la cause d'une erreur ou d'un manquement, registre très soutenu.",
    examples: [
      {
        segments: [
          {
            text: "不慣",
            reading: "ふな",
          },
          {
            text: "れな",
          },
          {
            text: "こととて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ご",
          },
          {
            text: "迷惑",
            reading: "めいわく",
          },
          {
            text: "を",
          },
          {
            text: "おかけしました。",
          },
        ],
        translation: "Comme je manquais d’expérience, je vous ai causé des désagréments.",
      },
      {
        segments: [
          {
            text: "知",
            reading: "し",
          },
          {
            text: "らぬ",
          },
          {
            text: "こととて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ご容赦",
            reading: "ごようしゃ",
          },
          {
            text: "ください。",
          },
        ],
        translation: "Comme je l’ignorais, veuillez m’excuser.",
      },
    ],
  },
  {
    id: "tomonaruto",
    pattern: "〜ともなると／〜ともなれば",
    jlptLevel: "N2",
    meaning: "Quand il s’agit de ~ (changement de degré)",
    rule: "Nom + ともなると・ともなれば",
    usage: "Pour exprimer que lorsqu'une situation atteint un certain niveau ou statut, les conséquences changent en conséquence.",
    examples: [
      {
        segments: [
          {
            text: "社長",
            reading: "しゃちょう",
          },
          {
            text: "ともなると",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "責任",
            reading: "せきにん",
          },
          {
            text: "も",
          },
          {
            text: "重",
            reading: "おも",
          },
          {
            text: "くなります。",
          },
        ],
        translation: "Quand on devient président de l’entreprise, la responsabilité s’alourdit aussi.",
      },
      {
        segments: [
          {
            text: "週末",
            reading: "しゅうまつ",
          },
          {
            text: "ともなれば",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "この",
          },
          {
            text: "店",
            reading: "みせ",
          },
          {
            text: "は",
          },
          {
            text: "混",
            reading: "こ",
          },
          {
            text: "み",
          },
          {
            text: "合",
            reading: "あ",
          },
          {
            text: "います。",
          },
        ],
        translation: "Le week-end venu, ce magasin est bondé.",
      },
    ],
  },
  {
    id: "narini",
    pattern: "〜なりに／〜なりの",
    jlptLevel: "N2",
    meaning: "À sa propre manière ~",
    rule: "Nom / Verbe (辞書形) + なりに・なりの",
    usage: "Pour exprimer que quelqu'un fait de son mieux selon ses propres capacités ou circonstances, sans prétendre à la perfection.",
    examples: [
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "は",
          },
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "なりに",
            highlight: true,
          },
          {
            text: "考",
            reading: "かんが",
          },
          {
            text: "えています。",
          },
        ],
        translation: "Les enfants réfléchissent à leur propre manière.",
      },
      {
        segments: [
          {
            text: "私",
            reading: "わたし",
          },
          {
            text: "なりの",
            highlight: true,
          },
          {
            text: "方法",
            reading: "ほうほう",
          },
          {
            text: "で",
          },
          {
            text: "頑張",
            reading: "がんば",
          },
          {
            text: "ります。",
          },
        ],
        translation: "Je vais faire de mon mieux à ma propre façon.",
      },
    ],
  },
  {
    id: "atteno",
    pattern: "〜あっての",
    jlptLevel: "N2",
    meaning: "Qui n’existe que grâce à ~",
    rule: "Nom + あっての + Nom",
    usage: "Pour exprimer qu'une chose n'est possible ou n'existe que grâce à l'existence d'une autre.",
    examples: [
      {
        segments: [
          {
            text: "お客様",
            reading: "おきゃくさま",
          },
          {
            text: "あっての",
            highlight: true,
          },
          {
            text: "商売",
            reading: "しょうばい",
          },
          {
            text: "です。",
          },
        ],
        translation: "Le commerce n’existe que grâce aux clients.",
      },
      {
        segments: [
          {
            text: "健康",
            reading: "けんこう",
          },
          {
            text: "あっての",
            highlight: true,
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "です。",
          },
        ],
        translation: "Le travail n’a de sens que si l’on est en bonne santé.",
      },
    ],
  },
  {
    id: "zuniwairarenai",
    pattern: "〜ずにはいられない",
    jlptLevel: "N2",
    meaning: "Ne pas pouvoir s’empêcher de ~",
    rule: "Verbe (ない形の語幹) + ずにはいられない",
    usage: "Pour exprimer qu'on ne peut résister à une pulsion ou une émotion, l'action se produit malgré soi.",
    examples: [
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "話",
            reading: "はなし",
          },
          {
            text: "を",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "いて、",
          },
          {
            text: "笑",
            reading: "わら",
          },
          {
            text: "わずにはいられませんでした",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "En entendant cette histoire, je n’ai pas pu m’empêcher de rire.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "勇気",
            reading: "ゆうき",
          },
          {
            text: "に",
          },
          {
            text: "感動",
            reading: "かんどう",
          },
          {
            text: "せずにはいられません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Je ne peux m’empêcher d’être touché par son courage.",
      },
    ],
  },
  {
    id: "naidewairarenai",
    pattern: "〜ないではいられない",
    jlptLevel: "N2",
    meaning: "Ne pas pouvoir s’empêcher de ~",
    rule: "Verbe (ない形) + ではいられない",
    usage: "Variante de 〜ずにはいられない, pour exprimer l'impossibilité de résister à une envie ou une émotion.",
    examples: [
      {
        segments: [
          {
            text: "このケーキを",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "ると、",
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べないではいられません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Quand je vois ce gâteau, je ne peux pas m’empêcher d’en manger.",
      },
      {
        segments: [
          {
            text: "心配",
            reading: "しんぱい",
          },
          {
            text: "で、",
          },
          {
            text: "電話",
            reading: "でんわ",
          },
          {
            text: "をかけないではいられませんでした",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Inquiet, je n’ai pas pu m’empêcher de l’appeler.",
      },
    ],
  },
  {
    id: "teyamanai",
    pattern: "〜てやまない",
    jlptLevel: "N2",
    meaning: "Ne cesser de ~ (sentiment fort, soutenu)",
    rule: "Verbe (て形) + やまない",
    usage: "Pour exprimer un sentiment (espoir, souhait) intense et durable, dans un registre écrit très soutenu.",
    examples: [
      {
        segments: [
          {
            text: "ご",
          },
          {
            text: "成功",
            reading: "せいこう",
          },
          {
            text: "を",
          },
          {
            text: "願",
            reading: "ねが",
          },
          {
            text: "ってやみません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Je ne cesse de souhaiter votre réussite.",
      },
      {
        segments: [
          {
            text: "皆様",
            reading: "みなさま",
          },
          {
            text: "の",
          },
          {
            text: "ご",
          },
          {
            text: "健康",
            reading: "けんこう",
          },
          {
            text: "を",
          },
          {
            text: "祈",
            reading: "いの",
          },
          {
            text: "ってやみません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Je ne cesse de prier pour votre santé.",
      },
    ],
  },
  {
    id: "bekuu",
    pattern: "〜べく",
    jlptLevel: "N2",
    meaning: "Afin de ~ (dans le but de)",
    rule: "Verbe (辞書形) + べく",
    usage: "Pour exprimer un but que l'on cherche à atteindre, dans un registre écrit et formel.",
    examples: [
      {
        segments: [
          {
            text: "目標",
            reading: "もくひょう",
          },
          {
            text: "を",
          },
          {
            text: "達成",
            reading: "たっせい",
          },
          {
            text: "すべく",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "しています。",
          },
        ],
        translation: "Je fais des efforts afin d’atteindre mon objectif.",
      },
      {
        segments: [
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "を",
          },
          {
            text: "解決",
            reading: "かいけつ",
          },
          {
            text: "すべく",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "会議",
            reading: "かいぎ",
          },
          {
            text: "を",
          },
          {
            text: "開",
            reading: "ひら",
          },
          {
            text: "きました。",
          },
        ],
        translation: "Une réunion a été organisée afin de résoudre le problème.",
      },
    ],
  },
  {
    id: "ikanni-yotte",
    pattern: "〜いかんで(は)",
    jlptLevel: "N2",
    meaning: "Selon ~ (en fonction de)",
    rule: "Nom(+の) + いかんで(は)",
    usage: "Pour exprimer que le résultat dépend d'une condition ou d'une circonstance particulière, registre formel.",
    examples: [
      {
        segments: [
          {
            text: "結果",
            reading: "けっか",
          },
          {
            text: "いかんでは",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "計画",
            reading: "けいかく",
          },
          {
            text: "を",
          },
          {
            text: "変更",
            reading: "へんこう",
          },
          {
            text: "します。",
          },
        ],
        translation: "Selon les résultats, nous modifierons le projet.",
      },
      {
        segments: [
          {
            text: "天候",
            reading: "てんこう",
          },
          {
            text: "いかんで",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "中止",
            reading: "ちゅうし",
          },
          {
            text: "になることもあります。",
          },
        ],
        translation: "Selon la météo, il se peut que ce soit annulé.",
      },
    ],
  },
  {
    id: "wo-monomo-sezu",
    pattern: "〜をものともせず(に)",
    jlptLevel: "N2",
    meaning: "Sans se laisser abattre par ~",
    rule: "Nom + をものともせず(に)",
    usage: "Pour exprimer qu'on surmonte une difficulté avec courage, sans en être affecté.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "困難",
            reading: "こんなん",
          },
          {
            text: "をものともせず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "前",
            reading: "まえ",
          },
          {
            text: "に",
          },
          {
            text: "進",
            reading: "すす",
          },
          {
            text: "みました。",
          },
        ],
        translation: "Sans se laisser abattre par les difficultés, il a avancé.",
      },
      {
        segments: [
          {
            text: "悪天候",
            reading: "あくてんこう",
          },
          {
            text: "をものともせずに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "試合",
            reading: "しあい",
          },
          {
            text: "は",
          },
          {
            text: "行",
            reading: "おこな",
          },
          {
            text: "われました。",
          },
        ],
        translation: "Le match a eu lieu sans se laisser arrêter par le mauvais temps.",
      },
    ],
  },
  {
    id: "wo-yogi-nakusareru",
    pattern: "〜を余儀なくされる",
    patternSegments: [
      { text: "〜" },
      { text: "を" },
      { text: "余儀", reading: "よぎ" },
      { text: "なくされる" },
    ],
    jlptLevel: "N2",
    meaning: "Être contraint de ~",
    rule: "Nom + を余儀なくされる",
    usage: "Pour exprimer qu'on est forcé, contre sa volonté, à une situation par des circonstances extérieures.",
    examples: [
      {
        segments: [
          {
            text: "台風",
            reading: "たいふう",
          },
          {
            text: "のため、",
          },
          {
            text: "試合",
            reading: "しあい",
          },
          {
            text: "は",
          },
          {
            text: "中止",
            reading: "ちゅうし",
          },
          {
            text: "を",
          },
          {
            text: "余儀",
            reading: "よぎ",
          },
          {
            text: "なくされました",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "À cause du typhon, le match a dû être annulé.",
      },
      {
        segments: [
          {
            text: "会社",
            reading: "かいしゃ",
          },
          {
            text: "は",
          },
          {
            text: "事業",
            reading: "じぎょう",
          },
          {
            text: "の",
          },
          {
            text: "縮小",
            reading: "しゅくしょう",
          },
          {
            text: "を",
          },
          {
            text: "余儀",
            reading: "よぎ",
          },
          {
            text: "なくされました",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "L’entreprise a été contrainte de réduire ses activités.",
      },
    ],
  },
  {
    id: "ni-tariru",
    pattern: "〜に足る",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "足", reading: "た" },
      { text: "る" },
    ],
    jlptLevel: "N2",
    meaning: "Digne de ~ / suffisant pour ~",
    rule: "Nom / Verbe (辞書形) + に足る",
    usage: "Pour exprimer qu'une chose ou une personne mérite ou suffit pour une qualification donnée, registre soutenu.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "信頼",
            reading: "しんらい",
          },
          {
            text: "するに",
          },
          {
            text: "足",
            reading: "た",
          },
          {
            text: "る",
            highlight: true,
          },
          {
            text: "人物",
            reading: "じんぶつ",
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est une personne digne de confiance.",
      },
      {
        segments: [
          {
            text: "これは",
          },
          {
            text: "証拠",
            reading: "しょうこ",
          },
          {
            text: "に",
          },
          {
            text: "足",
            reading: "た",
          },
          {
            text: "る",
            highlight: true,
          },
          {
            text: "資料",
            reading: "しりょう",
          },
          {
            text: "ではありません。",
          },
        ],
        translation: "Ce n’est pas un document suffisant pour servir de preuve.",
      },
    ],
  },
  {
    id: "tobakarini",
    pattern: "〜とばかりに",
    jlptLevel: "N2",
    meaning: "Comme pour dire ~ (attitude, geste)",
    rule: "Verbe/adjectif (forme normale) + とばかりに",
    usage: "Pour décrire une attitude ou un geste qui semble exprimer clairement une pensée, sans que celle-ci soit dite à voix haute.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "もう",
          },
          {
            text: "帰",
            reading: "かえ",
          },
          {
            text: "れとばかりに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ドア",
            highlight: false,
          },
          {
            text: "を",
          },
          {
            text: "指",
            reading: "ゆび",
          },
          {
            text: "さしました。",
          },
        ],
        translation: "Comme pour dire « rentre déjà », il a pointé la porte du doigt.",
      },
      {
        segments: [
          {
            text: "チャンス",
            highlight: false,
          },
          {
            text: "とばかりに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "手",
            reading: "て",
          },
          {
            text: "を",
          },
          {
            text: "挙",
            reading: "あ",
          },
          {
            text: "げました。",
          },
        ],
        translation: "Comme saisissant sa chance, elle a levé la main.",
      },
    ],
  },
  {
    id: "to-iwanbakarini",
    pattern: "〜と言わんばかりに",
    patternSegments: [
      { text: "〜" },
      { text: "と" },
      { text: "言", reading: "い" },
      { text: "わんばかりに" },
    ],
    jlptLevel: "N2",
    meaning: "Comme pour dire presque ~",
    rule: "Phrase (forme normale) + と言わんばかりに",
    usage: "Variante plus explicite de とばかりに, où l'attitude semble presque prononcer les mots eux-mêmes.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "興味",
            reading: "きょうみ",
          },
          {
            text: "がないと",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "わんばかりに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "あくびをしました。",
          },
        ],
        translation: "Comme pour dire clairement que ça ne l’intéressait pas, il a bâillé.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "く",
          },
          {
            text: "帰",
            reading: "かえ",
          },
          {
            text: "れと",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "わんばかりの",
            highlight: true,
          },
          {
            text: "顔",
            reading: "かお",
          },
          {
            text: "をしました。",
          },
        ],
        translation: "Elle a fait une tête qui disait presque « rentre vite ».",
      },
    ],
  },
  {
    id: "nashiniwa-nai",
    pattern: "〜なしには〜ない",
    jlptLevel: "N2",
    meaning: "Sans ~, il n’y a pas de ~",
    rule: "Nom + なしには + forme négative",
    usage: "Pour exprimer qu'une chose est absolument indispensable à une autre, dans une structure négative renforcée.",
    examples: [
      {
        segments: [
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "なしには",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "成果",
            reading: "せいか",
          },
          {
            text: "は",
          },
          {
            text: "得",
            reading: "え",
          },
          {
            text: "られません。",
          },
        ],
        translation: "Sans efforts, on n’obtient pas de résultats.",
      },
      {
        segments: [
          {
            text: "皆",
            reading: "みな",
          },
          {
            text: "さんの",
          },
          {
            text: "支",
            reading: "し",
          },
          {
            text: "えなしには",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ここまで",
          },
          {
            text: "来",
            reading: "こ",
          },
          {
            text: "られませんでした。",
          },
        ],
        translation: "Sans le soutien de tous, je ne serais pas arrivé jusque-là.",
      },
    ],
  },
  {
    id: "toatte",
    pattern: "〜とあって",
    jlptLevel: "N2",
    meaning: "Étant donné que ~ (situation spéciale)",
    rule: "Nom / Verbe (forme normale) + とあって",
    usage: "Pour exprimer une cause liée à une situation particulière ou exceptionnelle, souvent journalistique.",
    examples: [
      {
        segments: [
          {
            text: "連休",
            reading: "れんきゅう",
          },
          {
            text: "とあって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "空港",
            reading: "くうこう",
          },
          {
            text: "は",
          },
          {
            text: "大変",
            reading: "たいへん",
          },
          {
            text: "混",
            reading: "こ",
          },
          {
            text: "んでいます。",
          },
        ],
        translation: "Comme c’est un long week-end, l’aéroport est très bondé.",
      },
      {
        segments: [
          {
            text: "人気",
            reading: "にんき",
          },
          {
            text: "歌手",
            reading: "かしゅ",
          },
          {
            text: "の",
          },
          {
            text: "コンサート",
            highlight: false,
          },
          {
            text: "とあって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "チケット",
            highlight: false,
          },
          {
            text: "はすぐ",
          },
          {
            text: "売",
            reading: "う",
          },
          {
            text: "り",
          },
          {
            text: "切",
            reading: "き",
          },
          {
            text: "れました。",
          },
        ],
        translation: "Comme c’était le concert d’un chanteur populaire, les billets se sont vite épuisés.",
      },
    ],
  },
  {
    id: "ni-kakatteiru",
    pattern: "〜にかかっている",
    jlptLevel: "N2",
    meaning: "Dépendre de ~",
    rule: "Nom + にかかっている",
    usage: "Pour exprimer qu'un résultat futur dépend entièrement d'un facteur donné.",
    examples: [
      {
        segments: [
          {
            text: "成功",
            reading: "せいこう",
          },
          {
            text: "するかどうかは",
          },
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "次第",
            reading: "しだい",
          },
          {
            text: "にかかっています",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "La réussite ou non dépend des efforts fournis.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "計画",
            reading: "けいかく",
          },
          {
            text: "の",
          },
          {
            text: "成否",
            reading: "せいひ",
          },
          {
            text: "は",
          },
          {
            text: "資金",
            reading: "しきん",
          },
          {
            text: "にかかっている",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Le succès ou l’échec de ce projet dépend du financement.",
      },
    ],
  },
  {
    id: "shimatsu-da",
    pattern: "〜始末だ",
    patternSegments: [
      { text: "〜" },
      { text: "始末", reading: "しまつ" },
      { text: "だ" },
    ],
    jlptLevel: "N2",
    meaning: "Pour finir, ça en arrive à ~ (résultat fâcheux)",
    rule: "Verbe (辞書形) + 始末だ",
    usage: "Pour exprimer, avec un ton de reproche ou de résignation, l'issue finalement mauvaise d'une série d'événements.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "はいつも",
          },
          {
            text: "約束",
            reading: "やくそく",
          },
          {
            text: "を",
          },
          {
            text: "破",
            reading: "やぶ",
          },
          {
            text: "り、",
          },
          {
            text: "今回",
            reading: "こんかい",
          },
          {
            text: "も",
          },
          {
            text: "来",
            reading: "こ",
          },
          {
            text: "ない",
          },
          {
            text: "始末",
            reading: "しまつ",
            highlight: true,
          },
          {
            text: "だ。",
          },
        ],
        translation: "Il rompt toujours ses promesses, et cette fois encore, il n’est même pas venu, pour finir.",
      },
      {
        segments: [
          {
            text: "注意",
            reading: "ちゅうい",
          },
          {
            text: "したのに、",
          },
          {
            text: "また",
          },
          {
            text: "失敗",
            reading: "しっぱい",
          },
          {
            text: "する",
          },
          {
            text: "始末",
            reading: "しまつ",
            highlight: true,
          },
          {
            text: "だ。",
          },
        ],
        translation: "Malgré mes mises en garde, il a encore échoué, pour finir.",
      },
    ],
  },
  {
    id: "nara-madashimo",
    pattern: "〜ならまだしも",
    jlptLevel: "N2",
    meaning: "Si c’était encore ~, mais...",
    rule: "Nom / Verbe (forme normale) + ならまだしも",
    usage: "Pour exprimer qu'une situation serait encore acceptable, mais que la réalité est pire ou différente.",
    examples: [
      {
        segments: [
          {
            text: "一度",
            reading: "いちど",
          },
          {
            text: "ならまだしも",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "三度",
            reading: "さんど",
          },
          {
            text: "も",
          },
          {
            text: "遅刻",
            reading: "ちこく",
          },
          {
            text: "するとは。",
          },
        ],
        translation: "Une fois encore, mais être en retard trois fois !",
      },
      {
        segments: [
          {
            text: "安",
            reading: "やす",
          },
          {
            text: "いなら",
          },
          {
            text: "まだしも",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "この",
          },
          {
            text: "値段",
            reading: "ねだん",
          },
          {
            text: "では",
          },
          {
            text: "買",
            reading: "か",
          },
          {
            text: "えません。",
          },
        ],
        translation: "Si c’était bon marché, encore, mais à ce prix, je ne peux pas l’acheter.",
      },
    ],
  },
  {
    id: "to-areba",
    pattern: "〜とあれば",
    jlptLevel: "N2",
    meaning: "Si c’est le cas de ~",
    rule: "Nom / Verbe (forme normale) + とあれば",
    usage: "Pour exprimer que si une condition particulière est vraie, on est prêt à agir en conséquence, souvent avec détermination.",
    examples: [
      {
        segments: [
          {
            text: "必要",
            reading: "ひつよう",
          },
          {
            text: "とあれば",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "いつでも",
          },
          {
            text: "協力",
            reading: "きょうりょく",
          },
          {
            text: "します。",
          },
        ],
        translation: "Si c’est nécessaire, je coopérerai à tout moment.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "のためとあれば",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "どんな",
          },
          {
            text: "苦労",
            reading: "くろう",
          },
          {
            text: "も",
          },
          {
            text: "厭",
            reading: "いと",
          },
          {
            text: "いません。",
          },
        ],
        translation: "Si c’est pour ses enfants, aucune peine ne rebute.",
      },
    ],
  },
  {
    id: "te-wa-habakaranai",
    pattern: "〜てはばからない",
    jlptLevel: "N2",
    meaning: "Affirmer ~ sans hésiter (audacieusement)",
    rule: "Verbe (て形) + はばからない",
    usage: "Pour exprimer que quelqu'un déclare ouvertement et sans gêne une opinion souvent audacieuse ou controversée.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "自分",
            reading: "じぶん",
          },
          {
            text: "が",
          },
          {
            text: "一番",
            reading: "いちばん",
          },
          {
            text: "だと",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "ってはばかりません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il affirme sans hésiter qu’il est le meilleur.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "批判",
            reading: "ひはん",
          },
          {
            text: "してはばからない",
            highlight: true,
          },
          {
            text: "態度",
            reading: "たいど",
          },
          {
            text: "を",
          },
          {
            text: "取",
            reading: "と",
          },
          {
            text: "りました。",
          },
        ],
        translation: "Elle a adopté une attitude qui critique sans se gêner.",
      },
    ],
  },
  {
    id: "gatera",
    pattern: "〜がてら",
    jlptLevel: "N2",
    meaning: "En profitant de ~ pour faire",
    rule: "Nom / Verbe (ます形) + がてら",
    usage: "Pour exprimer qu'on fait une deuxième chose en profitant d'une action principale, sans effort supplémentaire.",
    examples: [
      {
        segments: [
          {
            text: "散歩",
            reading: "さんぽ",
          },
          {
            text: "がてら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "買",
            reading: "か",
          },
          {
            text: "い",
          },
          {
            text: "物",
            reading: "もの",
          },
          {
            text: "をしました。",
          },
        ],
        translation: "J’ai fait des courses en profitant de ma promenade.",
      },
      {
        segments: [
          {
            text: "駅",
            reading: "えき",
          },
          {
            text: "まで",
          },
          {
            text: "送",
            reading: "おく",
          },
          {
            text: "りがてら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "本屋",
            reading: "ほんや",
          },
          {
            text: "に",
          },
          {
            text: "寄",
            reading: "よ",
          },
          {
            text: "りました。",
          },
        ],
        translation: "Tout en te raccompagnant à la gare, je suis passé à la librairie.",
      },
    ],
  },
  {
    id: "katagata",
    pattern: "〜かたがた",
    jlptLevel: "N2",
    meaning: "À l’occasion de ~ (dans le but conjoint de)",
    rule: "Nom + かたがた",
    usage: "Pour exprimer qu'une action est accomplie en même temps qu'une autre à valeur sociale, registre formel et écrit.",
    examples: [
      {
        segments: [
          {
            text: "お礼",
            reading: "おれい",
          },
          {
            text: "かたがた",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ご",
          },
          {
            text: "挨拶",
            reading: "あいさつ",
          },
          {
            text: "に",
          },
          {
            text: "伺",
            reading: "うかが",
          },
          {
            text: "いました。",
          },
        ],
        translation: "Je suis venu vous rendre visite, à l’occasion de vous remercier.",
      },
      {
        segments: [
          {
            text: "報告",
            reading: "ほうこく",
          },
          {
            text: "かたがた",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "お",
          },
          {
            text: "詫",
            reading: "わ",
          },
          {
            text: "びに",
          },
          {
            text: "参",
            reading: "まい",
          },
          {
            text: "りました。",
          },
        ],
        translation: "Je suis venu vous présenter mes excuses, en même temps que mon rapport.",
      },
    ],
  },
  {
    id: "ni-todomarazu",
    pattern: "〜にとどまらず",
    jlptLevel: "N2",
    meaning: "Ne se limitant pas à ~",
    rule: "Nom / Verbe (辞書形) + にとどまらず",
    usage: "Pour exprimer qu'une chose dépasse un cadre donné et s'étend plus largement.",
    examples: [
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "影響",
            reading: "えいきょう",
          },
          {
            text: "は",
          },
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "にとどまらず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "世界中",
            reading: "せかいじゅう",
          },
          {
            text: "に",
          },
          {
            text: "広",
            reading: "ひろ",
          },
          {
            text: "がりました。",
          },
        ],
        translation: "L’influence ne s’est pas limitée au Japon, elle s’est répandue dans le monde entier.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "活動",
            reading: "かつどう",
          },
          {
            text: "は",
          },
          {
            text: "音楽",
            reading: "おんがく",
          },
          {
            text: "にとどまらず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "映画",
            reading: "えいが",
          },
          {
            text: "にも",
          },
          {
            text: "及",
            reading: "およ",
          },
          {
            text: "んでいます。",
          },
        ],
        translation: "Ses activités ne se limitent pas à la musique, elles s’étendent aussi au cinéma.",
      },
    ],
  },
  {
    id: "zujimai",
    pattern: "〜ずじまい",
    jlptLevel: "N2",
    meaning: "Finir sans avoir pu ~ (regret)",
    rule: "Verbe (ない形の語幹) + ずじまい",
    usage: "Pour exprimer, avec un regret, qu'une action prévue n'a finalement jamais été réalisée.",
    examples: [
      {
        segments: [
          {
            text: "結局",
            reading: "けっきょく",
          },
          {
            text: "、",
          },
          {
            text: "会",
            reading: "あ",
          },
          {
            text: "えずじまい",
            highlight: true,
          },
          {
            text: "でした。",
          },
        ],
        translation: "Finalement, je n’ai jamais pu le rencontrer.",
      },
      {
        segments: [
          {
            text: "お",
          },
          {
            text: "礼",
            reading: "れい",
          },
          {
            text: "も",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "えずじまい",
            highlight: true,
          },
          {
            text: "で、",
          },
          {
            text: "別",
            reading: "わか",
          },
          {
            text: "れてしまいました。",
          },
        ],
        translation: "Nous nous sommes séparés sans même que j’aie pu le remercier.",
      },
    ],
  },
  {
    id: "magiwani",
    pattern: "〜まぎわに",
    jlptLevel: "N2",
    meaning: "Juste avant ~ (au dernier moment)",
    rule: "Nom(+の) / Verbe (辞書形) + まぎわに",
    usage: "Pour exprimer que quelque chose se produit juste au moment où une autre chose est sur le point de commencer.",
    examples: [
      {
        segments: [
          {
            text: "出発",
            reading: "しゅっぱつ",
          },
          {
            text: "まぎわに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "忘",
            reading: "わす",
          },
          {
            text: "れ",
          },
          {
            text: "物",
            reading: "もの",
          },
          {
            text: "に",
          },
          {
            text: "気",
            reading: "き",
          },
          {
            text: "づきました。",
          },
        ],
        translation: "Juste avant le départ, je me suis aperçu d’un oubli.",
      },
      {
        segments: [
          {
            text: "死",
            reading: "し",
          },
          {
            text: "ぬまぎわに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "家族",
            reading: "かぞく",
          },
          {
            text: "に",
          },
          {
            text: "会",
            reading: "あ",
          },
          {
            text: "いたいと",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "いました。",
          },
        ],
        translation: "Juste avant de mourir, il a dit vouloir voir sa famille.",
      },
    ],
  },
  {
    id: "mo-saru-koto-nagara",
    pattern: "〜もさることながら",
    jlptLevel: "N2",
    meaning: "Non seulement ~ mais surtout",
    rule: "Nom + もさることながら",
    usage: "Pour exprimer qu'un premier élément est déjà notable, mais qu'un second l'est encore davantage.",
    examples: [
      {
        segments: [
          {
            text: "味",
            reading: "あじ",
          },
          {
            text: "もさることながら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "た",
          },
          {
            text: "目",
            reading: "め",
          },
          {
            text: "も",
          },
          {
            text: "美",
            reading: "うつく",
          },
          {
            text: "しいです。",
          },
        ],
        translation: "Le goût est déjà remarquable, mais l’apparence l’est encore plus.",
      },
      {
        segments: [
          {
            text: "実力",
            reading: "じつりょく",
          },
          {
            text: "もさることながら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "運",
            reading: "うん",
          },
          {
            text: "も",
          },
          {
            text: "必要",
            reading: "ひつよう",
          },
          {
            text: "です。",
          },
        ],
        translation: "Les compétences comptent déjà beaucoup, mais la chance aussi est nécessaire.",
      },
    ],
  },
  {
    id: "ikantomo-shigatai",
    pattern: "〜いかんともしがたい",
    jlptLevel: "N2",
    meaning: "Impossible à faire quoi que ce soit",
    rule: "Nom + はいかんともしがたい",
    usage: "Pour exprimer, dans un registre soutenu, qu'une situation échappe totalement à toute action possible.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "状況",
            reading: "じょうきょう",
          },
          {
            text: "は",
          },
          {
            text: "いかんともしがたい",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il n’y a rien à faire face à cette situation.",
      },
      {
        segments: [
          {
            text: "自然",
            reading: "しぜん",
          },
          {
            text: "の",
          },
          {
            text: "力",
            reading: "ちから",
          },
          {
            text: "は",
          },
          {
            text: "人間",
            reading: "にんげん",
          },
          {
            text: "に",
          },
          {
            text: "いかんともしがたい",
            highlight: true,
          },
          {
            text: "ものです。",
          },
        ],
        translation: "La force de la nature échappe totalement au pouvoir humain.",
      },
    ],
  },
  {
    id: "nimo-hodo-ga-aru",
    pattern: "〜にもほどがある",
    jlptLevel: "N2",
    meaning: "Il y a des limites à ~ (excès)",
    rule: "Nom / Adjectif-な / Verbe (辞書形) + にもほどがある",
    usage: "Pour critiquer un comportement ou une situation jugée excessive, en indiquant qu'il y a des limites à ne pas dépasser.",
    examples: [
      {
        segments: [
          {
            text: "冗談",
            reading: "じょうだん",
          },
          {
            text: "にもほどがあります",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il y a des limites à la plaisanterie.",
      },
      {
        segments: [
          {
            text: "無責任",
            reading: "むせきにん",
          },
          {
            text: "にもほどがある",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il y a des limites à l’irresponsabilité.",
      },
    ],
  },
  {
    id: "wo-kawakirini",
    pattern: "〜を皮切りに",
    patternSegments: [
      { text: "〜" },
      { text: "を" },
      { text: "皮切", reading: "かわき" },
      { text: "りに" },
    ],
    jlptLevel: "N2",
    meaning: "À partir de ~ (point de départ d’une série)",
    rule: "Nom + を皮切りに",
    usage: "Pour indiquer le point de départ d'une série d'événements similaires qui se succèdent.",
    examples: [
      {
        segments: [
          {
            text: "東京",
            reading: "とうきょう",
          },
          {
            text: "公演",
            reading: "こうえん",
          },
          {
            text: "を",
          },
          {
            text: "皮切",
            reading: "かわき",
          },
          {
            text: "りに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "全国",
            reading: "ぜんこく",
          },
          {
            text: "ツアー",
            highlight: false,
          },
          {
            text: "が",
          },
          {
            text: "始",
            reading: "はじ",
          },
          {
            text: "まります。",
          },
        ],
        translation: "La tournée nationale débute avec le concert de Tokyo.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "発見",
            reading: "はっけん",
          },
          {
            text: "を",
          },
          {
            text: "皮切",
            reading: "かわき",
          },
          {
            text: "りに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "研究",
            reading: "けんきゅう",
          },
          {
            text: "が",
          },
          {
            text: "進",
            reading: "すす",
          },
          {
            text: "みました。",
          },
        ],
        translation: "À partir de cette découverte, la recherche a progressé.",
      },
    ],
  },
  {
    id: "wo-kagirini",
    pattern: "〜を限りに",
    patternSegments: [
      { text: "〜" },
      { text: "を" },
      { text: "限", reading: "かぎ" },
      { text: "りに" },
    ],
    jlptLevel: "N2",
    meaning: "À partir de ~ (dernier moment)",
    rule: "Nom + を限りに",
    usage: "Pour indiquer le point final d'une situation, à partir duquel elle cesse ou change définitivement.",
    examples: [
      {
        segments: [
          {
            text: "今日",
            reading: "きょう",
          },
          {
            text: "を",
          },
          {
            text: "限",
            reading: "かぎ",
          },
          {
            text: "りに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "タバコ",
            highlight: false,
          },
          {
            text: "をやめます。",
          },
        ],
        translation: "À partir d’aujourd’hui, j’arrête de fumer.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "公演",
            reading: "こうえん",
          },
          {
            text: "を",
          },
          {
            text: "限",
            reading: "かぎ",
          },
          {
            text: "りに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "引退",
            reading: "いんたい",
          },
          {
            text: "します。",
          },
        ],
        translation: "Je prends ma retraite à partir de ce concert.",
      },
    ],
  },
  {
    id: "ageku-no-hateni",
    pattern: "〜挙句（の果て）に",
    patternSegments: [
      { text: "〜" },
      { text: "挙句", reading: "あげく" },
      { text: "（" },
      { text: "の" },
      { text: "果", reading: "は" },
      { text: "て" },
      { text: "）" },
      { text: "に" },
    ],
    jlptLevel: "N2",
    meaning: "Après tant de ~, finalement ~ (résultat négatif)",
    rule: "Verbe (た形) + 挙句（の果て）に",
    usage: "Pour exprimer qu'après une longue série d'efforts ou d'hésitations, le résultat final est négatif ou décevant.",
    examples: [
      {
        segments: [
          {
            text: "悩",
            reading: "なや",
          },
          {
            text: "んだ",
          },
          {
            text: "挙句",
            reading: "あげく",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "を",
          },
          {
            text: "辞",
            reading: "や",
          },
          {
            text: "めました。",
          },
        ],
        translation: "Après avoir longtemps hésité, j’ai finalement démissionné.",
      },
      {
        segments: [
          {
            text: "長時間",
            reading: "ちょうじかん",
          },
          {
            text: "待",
            reading: "ま",
          },
          {
            text: "たされた",
          },
          {
            text: "挙句",
            reading: "あげく",
          },
          {
            text: "の",
          },
          {
            text: "果",
            reading: "は",
          },
          {
            text: "てに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "取",
            reading: "と",
          },
          {
            text: "り",
          },
          {
            text: "消",
            reading: "け",
          },
          {
            text: "されました。",
          },
        ],
        translation: "Après avoir attendu très longtemps, cela a finalement été annulé.",
      },
    ],
  },
  {
    id: "temae",
    pattern: "〜手前",
    patternSegments: [
      { text: "〜" },
      { text: "手前", reading: "てまえ" },
    ],
    jlptLevel: "N2",
    meaning: "Étant donné que ~ (souci du regard d’autrui)",
    rule: "Nom(+の) / Verbe (forme normale) + 手前",
    usage: "Pour exprimer qu'on agit d'une certaine façon en raison du regard ou du jugement d'autrui, souvent pour ne pas perdre la face.",
    examples: [
      {
        segments: [
          {
            text: "部下",
            reading: "ぶか",
          },
          {
            text: "の",
          },
          {
            text: "手前",
            reading: "てまえ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "弱音",
            reading: "よわね",
          },
          {
            text: "は",
          },
          {
            text: "吐",
            reading: "は",
          },
          {
            text: "けません。",
          },
        ],
        translation: "Devant mes subordonnés, je ne peux pas me plaindre.",
      },
      {
        segments: [
          {
            text: "約束",
            reading: "やくそく",
          },
          {
            text: "した",
          },
          {
            text: "手前",
            reading: "てまえ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "やめるわけにはいきません。",
          },
        ],
        translation: "Puisque je l’ai promis, je ne peux pas abandonner maintenant.",
      },
    ],
  },
  {
    id: "to-aimatte",
    pattern: "〜とあいまって",
    jlptLevel: "N2",
    meaning: "Combiné à ~",
    rule: "Nom + とあいまって",
    usage: "Pour exprimer que deux facteurs se combinent pour produire un effet renforcé.",
    examples: [
      {
        segments: [
          {
            text: "美",
            reading: "うつく",
          },
          {
            text: "しい",
          },
          {
            text: "景色",
            reading: "けしき",
          },
          {
            text: "が",
          },
          {
            text: "涼",
            reading: "すず",
          },
          {
            text: "しい",
          },
          {
            text: "風",
            reading: "かぜ",
          },
          {
            text: "とあいまって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "最高",
            reading: "さいこう",
          },
          {
            text: "の",
          },
          {
            text: "気分",
            reading: "きぶん",
          },
          {
            text: "でした。",
          },
        ],
        translation: "Le beau paysage combiné à la brise fraîche m’a procuré une sensation formidable.",
      },
      {
        segments: [
          {
            text: "技術",
            reading: "ぎじゅつ",
          },
          {
            text: "の",
          },
          {
            text: "進歩",
            reading: "しんぽ",
          },
          {
            text: "が",
          },
          {
            text: "需要",
            reading: "じゅよう",
          },
          {
            text: "の",
          },
          {
            text: "増加",
            reading: "ぞうか",
          },
          {
            text: "とあいまって",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "市場",
            reading: "しじょう",
          },
          {
            text: "が",
          },
          {
            text: "拡大",
            reading: "かくだい",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Le progrès technique combiné à l’augmentation de la demande a fait croître le marché.",
      },
    ],
  },
  {
    id: "taritomo-nai",
    pattern: "〜たりとも〜ない",
    jlptLevel: "N2",
    meaning: "Pas même un seul ~",
    rule: "Nom (quantité, ex: 一日) + たりとも + forme négative",
    usage: "Pour exprimer, dans un registre soutenu, qu'absolument aucune unité (même la plus petite) n'est concernée.",
    examples: [
      {
        segments: [
          {
            text: "一日",
            reading: "いちにち",
          },
          {
            text: "たりとも",
            highlight: true,
          },
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "んだことはありません。",
          },
        ],
        translation: "Je n’ai jamais pris ne serait-ce qu’un seul jour de repos.",
      },
      {
        segments: [
          {
            text: "一円",
            reading: "いちえん",
          },
          {
            text: "たりとも",
            highlight: true,
          },
          {
            text: "無駄",
            reading: "むだ",
          },
          {
            text: "にできません。",
          },
        ],
        translation: "On ne peut gaspiller ne serait-ce qu’un seul yen.",
      },
    ],
  },
  {
    id: "tada-nomi",
    pattern: "〜ただ〜のみ",
    jlptLevel: "N2",
    meaning: "Il n’y a que ~ / seulement ~",
    rule: "ただ + Nom/Verbe (辞書形) + のみ",
    usage: "Pour exprimer, dans un registre soutenu, qu'une seule chose reste ou est possible, en excluant tout le reste.",
    examples: [
      {
        segments: [
          {
            text: "今",
            reading: "いま",
          },
          {
            text: "はただ",
          },
          {
            text: "結果",
            reading: "けっか",
          },
          {
            text: "を",
          },
          {
            text: "待",
            reading: "ま",
          },
          {
            text: "つのみ",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Maintenant, il ne reste plus qu’à attendre les résultats.",
      },
      {
        segments: [
          {
            text: "ただ",
          },
          {
            text: "前",
            reading: "まえ",
          },
          {
            text: "に",
          },
          {
            text: "進",
            reading: "すす",
          },
          {
            text: "むのみ",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Il ne reste plus qu’à avancer.",
      },
    ],
  },
  {
    id: "manukarenai",
    pattern: "〜は免れない",
    patternSegments: [
      { text: "〜" },
      { text: "は" },
      { text: "免", reading: "まぬか" },
      { text: "れない" },
    ],
    jlptLevel: "N2",
    meaning: "On ne peut échapper à ~",
    rule: "Nom + は免れない",
    usage: "Pour exprimer qu'une conséquence, souvent négative, est inévitable.",
    examples: [
      {
        segments: [
          {
            text: "経済",
            reading: "けいざい",
          },
          {
            text: "の",
          },
          {
            text: "悪化",
            reading: "あっか",
          },
          {
            text: "は",
          },
          {
            text: "免",
            reading: "まぬが",
          },
          {
            text: "れません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "La dégradation de l’économie est inévitable.",
      },
      {
        segments: [
          {
            text: "批判",
            reading: "ひはん",
          },
          {
            text: "は",
          },
          {
            text: "免",
            reading: "まぬが",
          },
          {
            text: "れない",
            highlight: true,
          },
          {
            text: "だろう。",
          },
        ],
        translation: "Les critiques seront sans doute inévitables.",
      },
    ],
  },
  {
    id: "wo-fumaete",
    pattern: "〜を踏まえて",
    patternSegments: [
      { text: "〜" },
      { text: "を" },
      { text: "踏", reading: "ふ" },
      { text: "まえて" },
    ],
    jlptLevel: "N2",
    meaning: "En se basant sur ~",
    rule: "Nom + を踏まえて",
    usage: "Pour exprimer qu'on prend en compte une information, une situation ou un résultat pour agir ou juger.",
    examples: [
      {
        segments: [
          {
            text: "前回",
            reading: "ぜんかい",
          },
          {
            text: "の",
          },
          {
            text: "結果",
            reading: "けっか",
          },
          {
            text: "を",
          },
          {
            text: "踏",
            reading: "ふ",
          },
          {
            text: "まえて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "計画",
            reading: "けいかく",
          },
          {
            text: "を",
          },
          {
            text: "見直",
            reading: "みなお",
          },
          {
            text: "しました。",
          },
        ],
        translation: "En me basant sur les résultats précédents, j’ai révisé le plan.",
      },
      {
        segments: [
          {
            text: "現状",
            reading: "げんじょう",
          },
          {
            text: "を",
          },
          {
            text: "踏",
            reading: "ふ",
          },
          {
            text: "まえて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "対策",
            reading: "たいさく",
          },
          {
            text: "を",
          },
          {
            text: "考",
            reading: "かんが",
          },
          {
            text: "えます。",
          },
        ],
        translation: "En tenant compte de la situation actuelle, je vais réfléchir à des mesures.",
      },
    ],
  },
  {
    id: "ni-sokushite",
    pattern: "〜に即して",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "即", reading: "そく" },
      { text: "して" },
    ],
    jlptLevel: "N2",
    meaning: "Conformément à ~",
    rule: "Nom + に即して",
    usage: "Pour exprimer qu'une action se conforme précisément à une norme, une réalité, ou des faits concrets.",
    examples: [
      {
        segments: [
          {
            text: "現実",
            reading: "げんじつ",
          },
          {
            text: "に",
          },
          {
            text: "即",
            reading: "そく",
          },
          {
            text: "して",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "判断",
            reading: "はんだん",
          },
          {
            text: "すべきです。",
          },
        ],
        translation: "Il faut juger en se conformant à la réalité.",
      },
      {
        segments: [
          {
            text: "法律",
            reading: "ほうりつ",
          },
          {
            text: "に",
          },
          {
            text: "即",
            reading: "そく",
          },
          {
            text: "して",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "処理",
            reading: "しょり",
          },
          {
            text: "されます。",
          },
        ],
        translation: "Cela sera traité conformément à la loi.",
      },
    ],
  },
  {
    id: "towa-iu-monono",
    pattern: "〜とは言うものの",
    patternSegments: [
      { text: "〜" },
      { text: "とは" },
      { text: "言", reading: "い" },
      { text: "うものの" },
    ],
    jlptLevel: "N2",
    meaning: "Cela dit, ~ (concession)",
    rule: "Phrase (forme normale) + とは言うものの",
    usage: "Pour introduire une réserve ou une nuance après avoir énoncé un fait, en signalant que la réalité complique la chose.",
    examples: [
      {
        segments: [
          {
            text: "便利",
            reading: "べんり",
          },
          {
            text: "だとは",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "うものの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "使",
            reading: "つか",
          },
          {
            text: "いこなすのは",
          },
          {
            text: "難",
            reading: "むずか",
          },
          {
            text: "しいです。",
          },
        ],
        translation: "Cela dit, même si c’est pratique, il est difficile de bien le maîtriser.",
      },
      {
        segments: [
          {
            text: "春",
            reading: "はる",
          },
          {
            text: "とは",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "うものの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "まだ",
          },
          {
            text: "寒",
            reading: "さむ",
          },
          {
            text: "い",
          },
          {
            text: "日",
            reading: "ひ",
          },
          {
            text: "が",
          },
          {
            text: "続",
            reading: "つづ",
          },
          {
            text: "きます。",
          },
        ],
        translation: "Cela dit, même si c’est le printemps, les jours froids continuent.",
      },
    ],
  },
  {
    id: "wa-oroka",
    pattern: "〜はおろか",
    jlptLevel: "N2",
    meaning: "Sans même parler de ~ / encore moins ~",
    rule: "Nom + はおろか",
    usage: "Pour exprimer que même un fait moins exigeant que celui mentionné est impossible, renforçant une négation.",
    examples: [
      {
        segments: [
          {
            text: "漢字",
            reading: "かんじ",
          },
          {
            text: "はおろか",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ひらがな",
          },
          {
            text: "も",
          },
          {
            text: "書",
            reading: "か",
          },
          {
            text: "けません。",
          },
        ],
        translation: "Sans même parler des kanji, il ne sait même pas écrire en hiragana.",
      },
      {
        segments: [
          {
            text: "旅行",
            reading: "りょこう",
          },
          {
            text: "はおろか",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "外出",
            reading: "がいしゅつ",
          },
          {
            text: "する",
          },
          {
            text: "時間",
            reading: "じかん",
          },
          {
            text: "もありません。",
          },
        ],
        translation: "Sans même parler de voyager, je n’ai même pas le temps de sortir.",
      },
    ],
  },
  {
    id: "nara-iza-shirazu",
    pattern: "〜ならいざしらず",
    jlptLevel: "N2",
    meaning: "Si c’était ~, je ne dis pas, mais...",
    rule: "Nom + ならいざしらず",
    usage: "Pour exprimer qu'une situation hypothétique serait compréhensible, mais que la réalité, différente, ne l'est pas.",
    examples: [
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "ならいざしらず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "大人",
            reading: "おとな",
          },
          {
            text: "がそんなことをするなんて。",
          },
        ],
        translation: "Si c’était un enfant, je ne dis pas, mais qu’un adulte fasse ça !",
      },
      {
        segments: [
          {
            text: "昔",
            reading: "むかし",
          },
          {
            text: "ならいざしらず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "今",
            reading: "いま",
          },
          {
            text: "はそんな",
          },
          {
            text: "習慣",
            reading: "しゅうかん",
          },
          {
            text: "はありません。",
          },
        ],
        translation: "Autrefois, je ne dis pas, mais aujourd’hui cette coutume n’existe plus.",
      },
    ],
  },
  {
    id: "nai-mademo",
    pattern: "〜ないまでも",
    jlptLevel: "N2",
    meaning: "Même si ce n’est pas ~ (au moins)",
    rule: "Verbe (ない形) + までも",
    usage: "Pour exprimer que même si un niveau élevé n'est pas atteint, un niveau minimal l'est tout de même.",
    examples: [
      {
        segments: [
          {
            text: "毎日",
            reading: "まいにち",
          },
          {
            text: "とは",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "わないまでも",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "週",
            reading: "しゅう",
          },
          {
            text: "に",
          },
          {
            text: "一度",
            reading: "いちど",
          },
          {
            text: "は",
          },
          {
            text: "運動",
            reading: "うんどう",
          },
          {
            text: "しましょう。",
          },
        ],
        translation: "Même si ce n’est pas tous les jours, faisons au moins de l’exercice une fois par semaine.",
      },
      {
        segments: [
          {
            text: "完璧",
            reading: "かんぺき",
          },
          {
            text: "ではないまでも",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "かなり",
          },
          {
            text: "良",
            reading: "よ",
          },
          {
            text: "い",
          },
          {
            text: "出来",
            reading: "でき",
          },
          {
            text: "です。",
          },
        ],
        translation: "Même si ce n’est pas parfait, c’est un résultat plutôt bon.",
      },
    ],
  },
  {
    id: "kara-aru",
    pattern: "〜からある",
    jlptLevel: "N2",
    meaning: "Au moins ~ (quantité impressionnante)",
    rule: "Nombre + からある",
    usage: "Pour souligner qu'une quantité mentionnée est déjà considérable, voire supérieure.",
    examples: [
      {
        segments: [
          {
            text: "百",
            reading: "ひゃっ",
          },
          {
            text: "キロ",
            highlight: false,
          },
          {
            text: "からある",
            highlight: true,
          },
          {
            text: "荷物",
            reading: "にもつ",
          },
          {
            text: "を",
          },
          {
            text: "運",
            reading: "はこ",
          },
          {
            text: "びました。",
          },
        ],
        translation: "J’ai transporté un bagage d’au moins cent kilos.",
      },
      {
        segments: [
          {
            text: "十",
            reading: "じゅう",
          },
          {
            text: "メートル",
            highlight: false,
          },
          {
            text: "からある",
            highlight: true,
          },
          {
            text: "木",
            reading: "き",
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est un arbre d’au moins dix mètres.",
      },
    ],
  },
  {
    id: "naitomo-kagiranai",
    pattern: "〜ないとも限らない",
    patternSegments: [
      { text: "〜" },
      { text: "ないとも" },
      { text: "限", reading: "かぎ" },
      { text: "らない" },
    ],
    jlptLevel: "N2",
    meaning: "On ne peut pas dire que ~ ne se produira pas",
    rule: "Verbe (ない形) + とも限らない",
    usage: "Pour exprimer, par double négation, qu'une possibilité ne peut pas être totalement exclue.",
    examples: [
      {
        segments: [
          {
            text: "地震",
            reading: "じしん",
          },
          {
            text: "が",
          },
          {
            text: "起",
            reading: "お",
          },
          {
            text: "きないとも",
          },
          {
            text: "限",
            reading: "かぎ",
          },
          {
            text: "りません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "On ne peut pas exclure qu’un séisme se produise.",
      },
      {
        segments: [
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "らないとも",
          },
          {
            text: "限",
            reading: "かぎ",
          },
          {
            text: "らない",
            highlight: true,
          },
          {
            text: "ので、",
          },
          {
            text: "傘",
            reading: "かさ",
          },
          {
            text: "を",
          },
          {
            text: "持",
            reading: "も",
          },
          {
            text: "っていきます。",
          },
        ],
        translation: "Comme il n’est pas exclu qu’il pleuve, je prends un parapluie.",
      },
    ],
  },
  {
    id: "youga-youto",
    pattern: "〜ようが／〜ようと",
    jlptLevel: "N2",
    meaning: "Quoi qu’il arrive, même si ~",
    rule: "Verbe (意向形) + が・と",
    usage: "Pour exprimer que, quelle que soit l'hypothèse envisagée, le résultat ou la décision ne change pas.",
    examples: [
      {
        segments: [
          {
            text: "何",
            reading: "なに",
          },
          {
            text: "を",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "われようが",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "私",
            reading: "わたし",
          },
          {
            text: "の",
          },
          {
            text: "考",
            reading: "かんが",
          },
          {
            text: "えは",
          },
          {
            text: "変",
            reading: "か",
          },
          {
            text: "わりません。",
          },
        ],
        translation: "Quoi qu’on me dise, mon avis ne changera pas.",
      },
      {
        segments: [
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "ろうと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "試合",
            reading: "しあい",
          },
          {
            text: "は",
          },
          {
            text: "行",
            reading: "おこな",
          },
          {
            text: "われます。",
          },
        ],
        translation: "Même s’il pleut, le match aura lieu.",
      },
    ],
  },
  {
    id: "uto-maito",
    pattern: "〜うと〜まいと",
    jlptLevel: "N2",
    meaning: "Que l’on fasse ~ ou non",
    rule: "Verbe (意向形) + と + Verbe (辞書形) + まいと",
    usage: "Pour exprimer que le résultat est le même, que l'action se produise ou non.",
    examples: [
      {
        segments: [
          {
            text: "行",
            reading: "い",
          },
          {
            text: "こうと",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "くまいと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "自由",
            reading: "じゆう",
          },
          {
            text: "です。",
          },
        ],
        translation: "Que tu y ailles ou non, c’est libre.",
      },
      {
        segments: [
          {
            text: "信",
            reading: "しん",
          },
          {
            text: "じようと",
          },
          {
            text: "信",
            reading: "しん",
          },
          {
            text: "じまいと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "これは",
          },
          {
            text: "事実",
            reading: "じじつ",
          },
          {
            text: "です。",
          },
        ],
        translation: "Que tu le croies ou non, c’est un fait.",
      },
    ],
  },
  {
    id: "gurumi",
    pattern: "〜ぐるみ",
    jlptLevel: "N2",
    meaning: "Entier / y compris (tout entier)",
    rule: "Nom + ぐるみ",
    usage: "Pour exprimer qu'une chose est prise dans son intégralité, incluant tous ses éléments.",
    examples: [
      {
        segments: [
          {
            text: "町",
            reading: "まち",
          },
          {
            text: "ぐるみ",
            highlight: true,
          },
          {
            text: "で",
          },
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "たちを",
          },
          {
            text: "見守",
            reading: "みまも",
          },
          {
            text: "っています。",
          },
        ],
        translation: "La ville entière veille sur les enfants.",
      },
      {
        segments: [
          {
            text: "家族",
            reading: "かぞく",
          },
          {
            text: "ぐるみ",
            highlight: true,
          },
          {
            text: "の",
          },
          {
            text: "つきあいをしています。",
          },
        ],
        translation: "Nous entretenons des relations qui incluent toute la famille.",
      },
    ],
  },
  {
    id: "meku",
    pattern: "〜めく",
    jlptLevel: "N2",
    meaning: "Avoir des allures de ~",
    rule: "Nom + めく",
    usage: "Pour exprimer que quelque chose commence à ressembler ou à évoquer une saison, une ambiance ou une qualité.",
    examples: [
      {
        segments: [
          {
            text: "三月",
            reading: "さんがつ",
          },
          {
            text: "に",
          },
          {
            text: "なると",
          },
          {
            text: "、",
          },
          {
            text: "春",
            reading: "はる",
          },
          {
            text: "めいて",
            highlight: true,
          },
          {
            text: "きます。",
          },
        ],
        translation: "En mars, l’air commence à sentir le printemps.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "謎",
            reading: "なぞ",
          },
          {
            text: "めいた",
            highlight: true,
          },
          {
            text: "発言",
            reading: "はつげん",
          },
          {
            text: "に",
          },
          {
            text: "驚",
            reading: "おどろ",
          },
          {
            text: "きました。",
          },
        ],
        translation: "J’ai été surpris par ses propos mystérieux.",
      },
    ],
  },
  {
    id: "zunisumu",
    pattern: "〜ずにすむ",
    jlptLevel: "N2",
    meaning: "Pouvoir se dispenser de ~",
    rule: "Verbe (ない形の語幹) + ずにすむ",
    usage: "Pour exprimer qu'une action pénible ou coûteuse s'avère finalement inutile.",
    examples: [
      {
        segments: [
          {
            text: "保険",
            reading: "ほけん",
          },
          {
            text: "のおかげで、",
          },
          {
            text: "お",
          },
          {
            text: "金",
            reading: "かね",
          },
          {
            text: "を",
          },
          {
            text: "払",
            reading: "はら",
          },
          {
            text: "わずにすみました",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Grâce à l’assurance, je n’ai pas eu besoin de payer.",
      },
      {
        segments: [
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "く",
          },
          {
            text: "出",
            reading: "で",
          },
          {
            text: "たので、",
          },
          {
            text: "遅刻",
            reading: "ちこく",
          },
          {
            text: "せずにすみました",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Comme je suis parti tôt, j’ai pu éviter d’être en retard.",
      },
    ],
  },
  {
    id: "kaigaaru",
    pattern: "〜甲斐がある",
    patternSegments: [
      { text: "〜" },
      { text: "甲斐", reading: "かい" },
      { text: "がある" },
    ],
    jlptLevel: "N2",
    meaning: "Cela vaut la peine de ~",
    rule: "Verbe (ます形) + 甲斐がある",
    usage: "Pour exprimer qu'un effort ou une action a été récompensé, qu'il en valait la peine.",
    examples: [
      {
        segments: [
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "した",
          },
          {
            text: "甲斐",
            reading: "かい",
            highlight: true,
          },
          {
            text: "があって",
          },
          {
            text: "合格",
            reading: "ごうかく",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Mes efforts ont porté leurs fruits, j’ai réussi.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "は",
          },
          {
            text: "やり",
          },
          {
            text: "甲斐",
            reading: "かい",
            highlight: true,
          },
          {
            text: "があります。",
          },
        ],
        translation: "Ce travail vaut la peine d’être fait.",
      },
    ],
  },
  {
    id: "ni-koshita-koto-wa-nai",
    pattern: "〜に越したことはない",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "越", reading: "こ" },
      { text: "したことはない" },
    ],
    jlptLevel: "N2",
    meaning: "Rien ne vaut ~ / mieux vaut ~",
    rule: "Verbe (辞書形) / Adjectif + に越したことはない",
    usage: "Pour exprimer qu'une option est clairement préférable, même si d'autres restent acceptables.",
    examples: [
      {
        segments: [
          {
            text: "用心",
            reading: "ようじん",
          },
          {
            text: "するに",
          },
          {
            text: "越",
            reading: "こ",
          },
          {
            text: "したことはありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Mieux vaut être prudent.",
      },
      {
        segments: [
          {
            text: "お",
          },
          {
            text: "金",
            reading: "かね",
          },
          {
            text: "は",
          },
          {
            text: "多",
            reading: "おお",
          },
          {
            text: "いに",
          },
          {
            text: "越",
            reading: "こ",
          },
          {
            text: "したことはない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Rien ne vaut d’avoir plus d’argent.",
      },
    ],
  },
  {
    id: "temotomoto",
    pattern: "〜てもともと",
    jlptLevel: "N2",
    meaning: "Même si ça échoue, on ne perd rien",
    rule: "Verbe (て形) + もともと",
    usage: "Pour exprimer qu'on tente une action sans grand risque, car on n'avait rien à perdre au départ.",
    examples: [
      {
        segments: [
          {
            text: "駄目",
            reading: "だめ",
          },
          {
            text: "で",
          },
          {
            text: "もともと",
            highlight: true,
          },
          {
            text: "だから、",
          },
          {
            text: "応募",
            reading: "おうぼ",
          },
          {
            text: "してみます。",
          },
        ],
        translation: "Je n’ai rien à perdre, donc je vais tenter ma candidature.",
      },
      {
        segments: [
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "いてもともと",
            highlight: true,
          },
          {
            text: "だと",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "って、",
          },
          {
            text: "質問",
            reading: "しつもん",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Me disant que je n’avais rien à perdre à demander, j’ai posé la question.",
      },
    ],
  },
  {
    id: "sashitsukaenai",
    pattern: "〜てもさしつかえない",
    jlptLevel: "N2",
    meaning: "Il n’y a pas de problème à ~",
    rule: "Verbe (て形) + もさしつかえない",
    usage: "Pour donner une permission formelle, en indiquant qu'une action ne pose aucun inconvénient.",
    examples: [
      {
        segments: [
          {
            text: "ここで",
          },
          {
            text: "写真",
            reading: "しゃしん",
          },
          {
            text: "を",
          },
          {
            text: "撮",
            reading: "と",
          },
          {
            text: "ってもさしつかえありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il n’y a pas de problème à prendre des photos ici.",
      },
      {
        segments: [
          {
            text: "明日",
            reading: "あした",
          },
          {
            text: "までに",
          },
          {
            text: "提出",
            reading: "ていしゅつ",
          },
          {
            text: "してもさしつかえない",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Il n’y a pas de problème à le remettre d’ici demain.",
      },
    ],
  },
  {
    id: "monowo",
    pattern: "〜ものを",
    jlptLevel: "N2",
    meaning: "Alors que ~ (regret, reproche)",
    rule: "Verbe/adjectif (forme normale) + ものを",
    usage: "Pour exprimer un regret ou un reproche : une chose aurait pu être différente si une autre condition avait été remplie.",
    examples: [
      {
        segments: [
          {
            text: "早",
            reading: "はや",
          },
          {
            text: "く",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "ってくれれば",
          },
          {
            text: "手伝",
            reading: "てつだ",
          },
          {
            text: "ったものを",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Si tu me l’avais dit plus tôt, je t’aurais aidé, alors que...",
      },
      {
        segments: [
          {
            text: "素直",
            reading: "すなお",
          },
          {
            text: "に",
          },
          {
            text: "謝",
            reading: "あやま",
          },
          {
            text: "ればいいものを",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "意地",
            reading: "いじ",
          },
          {
            text: "を",
          },
          {
            text: "張",
            reading: "は",
          },
          {
            text: "っている。",
          },
        ],
        translation: "Il suffirait de s’excuser sincèrement, alors qu’il s’entête.",
      },
    ],
  },
  {
    id: "ga-yueni",
    pattern: "〜が故に",
    patternSegments: [
      { text: "〜" },
      { text: "が" },
      { text: "故", reading: "ゆえ" },
      { text: "に" },
    ],
    jlptLevel: "N2",
    meaning: "À cause de ~ (soutenu)",
    rule: "Nom(+の) / Verbe・adjectif (forme normale) + が故に",
    usage: "Pour exprimer une cause dans un registre littéraire et très soutenu.",
    examples: [
      {
        segments: [
          {
            text: "若",
            reading: "わか",
          },
          {
            text: "さ",
          },
          {
            text: "故",
            reading: "ゆえ",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "過",
            reading: "あやま",
          },
          {
            text: "ちを",
          },
          {
            text: "犯",
            reading: "おか",
          },
          {
            text: "しました。",
          },
        ],
        translation: "À cause de sa jeunesse, il a commis une erreur.",
      },
      {
        segments: [
          {
            text: "真面目",
            reading: "まじめ",
          },
          {
            text: "である",
          },
          {
            text: "故",
            reading: "ゆえ",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "融通",
            reading: "ゆうずう",
          },
          {
            text: "がきかないこともあります。",
          },
        ],
        translation: "Étant sérieux, il manque parfois de souplesse.",
      },
    ],
  },
  {
    id: "tomonashini",
    pattern: "〜ともなく／〜ともなしに",
    jlptLevel: "N2",
    meaning: "Sans intention particulière ~",
    rule: "Verbe (辞書形) + ともなく・ともなしに",
    usage: "Pour exprimer qu'une action se fait sans but précis ni intention consciente.",
    examples: [
      {
        segments: [
          {
            text: "誰",
            reading: "だれ",
          },
          {
            text: "に",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "うともなく",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "独",
            reading: "ひと",
          },
          {
            text: "り",
          },
          {
            text: "言",
            reading: "ごと",
          },
          {
            text: "を",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "いました。",
          },
        ],
        translation: "Sans s’adresser à personne en particulier, il a parlé tout seul.",
      },
      {
        segments: [
          {
            text: "窓",
            reading: "まど",
          },
          {
            text: "の",
          },
          {
            text: "外",
            reading: "そと",
          },
          {
            text: "を",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "るともなしに",
            highlight: true,
          },
          {
            text: "眺",
            reading: "なが",
          },
          {
            text: "めていました。",
          },
        ],
        translation: "Je regardais dehors sans vraiment y prêter attention.",
      },
    ],
  },
  {
    id: "ni-kamakete",
    pattern: "〜にかまけて",
    jlptLevel: "N2",
    meaning: "Absorbé par ~ (au point de négliger)",
    rule: "Nom + にかまけて",
    usage: "Pour exprimer qu'on néglige une chose parce qu'on est trop occupé par une autre.",
    examples: [
      {
        segments: [
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "にかまけて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "家族",
            reading: "かぞく",
          },
          {
            text: "との",
          },
          {
            text: "時間",
            reading: "じかん",
          },
          {
            text: "を",
          },
          {
            text: "大切",
            reading: "たいせつ",
          },
          {
            text: "にしていませんでした。",
          },
        ],
        translation: "Absorbé par le travail, je n’accordais pas assez d’importance au temps avec ma famille.",
      },
      {
        segments: [
          {
            text: "遊",
            reading: "あそ",
          },
          {
            text: "びにかまけて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "宿題",
            reading: "しゅくだい",
          },
          {
            text: "を",
          },
          {
            text: "忘",
            reading: "わす",
          },
          {
            text: "れていました。",
          },
        ],
        translation: "Trop absorbé par les jeux, j’avais oublié mes devoirs.",
      },
    ],
  },
  {
    id: "nagarani",
    pattern: "〜ながらに",
    jlptLevel: "N2",
    meaning: "Tout en restant dans l’état de ~",
    rule: "Nom / Verbe (ます形) + ながらに",
    usage: "Pour exprimer qu'une action se déroule tout en gardant un état particulier, souvent figé.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "涙",
            reading: "なみだ",
          },
          {
            text: "ながらに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "事件",
            reading: "じけん",
          },
          {
            text: "を",
          },
          {
            text: "語",
            reading: "かた",
          },
          {
            text: "りました。",
          },
        ],
        translation: "En larmes, il a raconté l’incident.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "生",
            reading: "う",
          },
          {
            text: "まれながらに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "素晴",
            reading: "すば",
          },
          {
            text: "らしい",
          },
          {
            text: "才能",
            reading: "さいのう",
          },
          {
            text: "を",
          },
          {
            text: "持",
            reading: "も",
          },
          {
            text: "っています。",
          },
        ],
        translation: "Elle possède un talent extraordinaire depuis sa naissance.",
      },
    ],
  },
  {
    id: "toomoikiya",
    pattern: "〜とおもいきや",
    jlptLevel: "N2",
    meaning: "Alors que je pensais que ~ (contre toute attente)",
    rule: "Phrase (forme normale) + とおもいきや",
    usage: "Pour exprimer qu'un événement contredit une attente ou une supposition initiale.",
    examples: [
      {
        segments: [
          {
            text: "晴",
            reading: "は",
          },
          {
            text: "れる",
          },
          {
            text: "とおもいきや",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "急",
            reading: "きゅう",
          },
          {
            text: "に",
          },
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "り",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Alors que je pensais qu’il ferait beau, il s’est mis à pleuvoir soudainement.",
      },
      {
        segments: [
          {
            text: "簡単",
            reading: "かんたん",
          },
          {
            text: "だとおもいきや",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "意外",
            reading: "いがい",
          },
          {
            text: "に",
          },
          {
            text: "難",
            reading: "むずか",
          },
          {
            text: "しかったです。",
          },
        ],
        translation: "Alors que je pensais que ce serait facile, c’était étonnamment difficile.",
      },
    ],
  },
  {
    id: "nashi-to-shinai",
    pattern: "〜なしとしない",
    jlptLevel: "N2",
    meaning: "On ne peut nier qu’il y ait ~",
    rule: "Nom + なしとしない",
    usage: "Pour exprimer, dans un registre soutenu, qu'une possibilité (souvent un risque) ne peut être totalement écartée.",
    examples: [
      {
        segments: [
          {
            text: "失敗",
            reading: "しっぱい",
          },
          {
            text: "の",
          },
          {
            text: "可能性",
            reading: "かのうせい",
          },
          {
            text: "は",
          },
          {
            text: "なしとしません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "On ne peut nier une possibilité d’échec.",
      },
      {
        segments: [
          {
            text: "反対",
            reading: "はんたい",
          },
          {
            text: "の",
          },
          {
            text: "声",
            reading: "こえ",
          },
          {
            text: "も",
          },
          {
            text: "なしとしない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Il n’est pas exclu qu’il y ait des voix opposées.",
      },
    ],
  },
  {
    id: "kararu-mono",
    pattern: "〜たる者",
    patternSegments: [
      { text: "〜" },
      { text: "たる" },
      { text: "者", reading: "もの" },
    ],
    jlptLevel: "N2",
    meaning: "En tant que ~ (devoir, statut)",
    rule: "Nom + たる者",
    usage: "Pour exprimer les devoirs ou qualités attendues d'une personne occupant un certain statut, registre soutenu.",
    examples: [
      {
        segments: [
          {
            text: "リーダー",
            highlight: false,
          },
          {
            text: "たる",
          },
          {
            text: "者",
            reading: "もの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "責任",
            reading: "せきにん",
          },
          {
            text: "を",
          },
          {
            text: "持",
            reading: "も",
          },
          {
            text: "つべきです。",
          },
        ],
        translation: "En tant que dirigeant, on doit assumer ses responsabilités.",
      },
      {
        segments: [
          {
            text: "教師",
            reading: "きょうし",
          },
          {
            text: "たる",
          },
          {
            text: "者",
            reading: "もの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "生徒",
            reading: "せいと",
          },
          {
            text: "の",
          },
          {
            text: "手本",
            reading: "てほん",
          },
          {
            text: "とならねばならない。",
          },
        ],
        translation: "En tant qu’enseignant, on doit être un modèle pour ses élèves.",
      },
    ],
  },
  {
    id: "denakute-nandarou",
    pattern: "〜でなくてなんだろう",
    jlptLevel: "N2",
    meaning: "Si ce n’est pas ~, qu’est-ce que c’est ?",
    rule: "Nom + でなくてなんだろう",
    usage: "Pour affirmer avec force, par une question rhétorique, qu'une chose correspond exactement à une notion donnée.",
    examples: [
      {
        segments: [
          {
            text: "これが",
          },
          {
            text: "愛",
            reading: "あい",
          },
          {
            text: "でなくてなんだろう",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Si ce n’est pas de l’amour, qu’est-ce que c’est ?",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "偶然",
            reading: "ぐうぜん",
          },
          {
            text: "が",
          },
          {
            text: "運命",
            reading: "うんめい",
          },
          {
            text: "でなくてなんだろう",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Si ce hasard n’est pas le destin, qu’est-ce que c’est ?",
      },
    ],
  },
  {
    id: "wo-motte-shitemo",
    pattern: "〜をもってしても",
    jlptLevel: "N2",
    meaning: "Même avec ~ (concession forte)",
    rule: "Nom + をもってしても",
    usage: "Pour exprimer que même un moyen puissant ou remarquable ne suffit pas à atteindre un but.",
    examples: [
      {
        segments: [
          {
            text: "最新",
            reading: "さいしん",
          },
          {
            text: "の",
          },
          {
            text: "技術",
            reading: "ぎじゅつ",
          },
          {
            text: "をもってしても",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "解決",
            reading: "かいけつ",
          },
          {
            text: "できない",
          },
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "があります。",
          },
        ],
        translation: "Même avec la technologie la plus récente, certains problèmes restent insolubles.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "実力",
            reading: "じつりょく",
          },
          {
            text: "をもってしても",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "優勝",
            reading: "ゆうしょう",
          },
          {
            text: "できませんでした。",
          },
        ],
        translation: "Même avec ses compétences, il n’a pas pu remporter la victoire.",
      },
    ],
  },
  {
    id: "kiwami",
    pattern: "〜の極み",
    patternSegments: [
      { text: "〜" },
      { text: "の" },
      { text: "極", reading: "きわ" },
      { text: "み" },
    ],
    jlptLevel: "N2",
    meaning: "Le comble de ~",
    rule: "Nom + の極み",
    usage: "Pour exprimer qu'un état ou un sentiment atteint son point culminant, registre soutenu et souvent élogieux.",
    examples: [
      {
        segments: [
          {
            text: "これは",
          },
          {
            text: "贅沢",
            reading: "ぜいたく",
          },
          {
            text: "の",
          },
          {
            text: "極",
            reading: "きわ",
          },
          {
            text: "み",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est le comble du luxe.",
      },
      {
        segments: [
          {
            text: "疲労",
            reading: "ひろう",
          },
          {
            text: "の",
          },
          {
            text: "極",
            reading: "きわ",
          },
          {
            text: "み",
            highlight: true,
          },
          {
            text: "に",
          },
          {
            text: "達",
            reading: "たっ",
          },
          {
            text: "しました。",
          },
        ],
        translation: "J’ai atteint le comble de la fatigue.",
      },
    ],
  },
  {
    id: "wo-hikaete",
    pattern: "〜をひかえて",
    jlptLevel: "N2",
    meaning: "À l’approche de ~",
    rule: "Nom + をひかえて",
    usage: "Pour exprimer qu'un événement important approche, souvent avec une nuance d'anticipation ou de préparation.",
    examples: [
      {
        segments: [
          {
            text: "試験",
            reading: "しけん",
          },
          {
            text: "をひかえて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "緊張",
            reading: "きんちょう",
          },
          {
            text: "しています。",
          },
        ],
        translation: "À l’approche de l’examen, je suis nerveux.",
      },
      {
        segments: [
          {
            text: "結婚式",
            reading: "けっこんしき",
          },
          {
            text: "をひかえて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "準備",
            reading: "じゅんび",
          },
          {
            text: "に",
          },
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しいです。",
          },
        ],
        translation: "À l’approche du mariage, je suis occupé par les préparatifs.",
      },
    ],
  },
  {
    id: "ni-kakotsukete",
    pattern: "〜にかこつけて",
    jlptLevel: "N2",
    meaning: "Sous prétexte de ~",
    rule: "Nom + にかこつけて",
    usage: "Pour exprimer qu'on utilise une chose comme excuse ou prétexte pour faire autre chose.",
    examples: [
      {
        segments: [
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "にかこつけて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "飲",
            reading: "の",
          },
          {
            text: "みに",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "きました。",
          },
        ],
        translation: "Sous prétexte de travail, je suis allé boire un verre.",
      },
      {
        segments: [
          {
            text: "出張",
            reading: "しゅっちょう",
          },
          {
            text: "にかこつけて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "観光",
            reading: "かんこう",
          },
          {
            text: "を",
          },
          {
            text: "楽",
            reading: "たの",
          },
          {
            text: "しみました。",
          },
        ],
        translation: "Sous prétexte d’un voyage d’affaires, j’ai profité du tourisme.",
      },
    ],
  },
  {
    id: "to-miruya",
    pattern: "〜とみるや",
    jlptLevel: "N2",
    meaning: "Dès qu’on a vu ~",
    rule: "Phrase (forme normale) + とみるや",
    usage: "Pour exprimer qu'une réaction immédiate suit dès qu'une situation est perçue, registre écrit.",
    examples: [
      {
        segments: [
          {
            text: "危険",
            reading: "きけん",
          },
          {
            text: "だとみるや",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "はすぐに",
          },
          {
            text: "逃",
            reading: "に",
          },
          {
            text: "げました。",
          },
        ],
        translation: "Dès qu’il a vu que c’était dangereux, il s’est aussitôt enfui.",
      },
      {
        segments: [
          {
            text: "勝",
            reading: "か",
          },
          {
            text: "ち",
          },
          {
            text: "目",
            reading: "め",
          },
          {
            text: "がないとみるや",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "交渉",
            reading: "こうしょう",
          },
          {
            text: "を",
          },
          {
            text: "始",
            reading: "はじ",
          },
          {
            text: "めました。",
          },
        ],
        translation: "Dès qu’il a vu qu’il n’avait aucune chance de gagner, il a entamé des négociations.",
      },
    ],
  },
  {
    id: "ni-tarinai",
    pattern: "〜に足りない",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "足", reading: "た" },
      { text: "りない" },
    ],
    jlptLevel: "N2",
    meaning: "Ne pas mériter ~ / insuffisant pour ~",
    rule: "Nom / Verbe (辞書形) + に足りない",
    usage: "Pour exprimer qu'une chose ne mérite pas une attention ou une qualification donnée.",
    examples: [
      {
        segments: [
          {
            text: "それは",
          },
          {
            text: "恐",
            reading: "おそ",
          },
          {
            text: "れるに",
          },
          {
            text: "足",
            reading: "た",
          },
          {
            text: "りません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Cela ne mérite pas qu’on le craigne.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "程度",
            reading: "ていど",
          },
          {
            text: "の",
          },
          {
            text: "失敗",
            reading: "しっぱい",
          },
          {
            text: "は",
          },
          {
            text: "取",
            reading: "と",
          },
          {
            text: "り",
          },
          {
            text: "上",
            reading: "あ",
          },
          {
            text: "げるに",
          },
          {
            text: "足",
            reading: "た",
          },
          {
            text: "りません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Un échec de ce niveau ne mérite pas qu’on s’y attarde.",
      },
    ],
  },
  {
    id: "iuni-oyobazu",
    pattern: "〜は言うに及ばず",
    patternSegments: [
      { text: "〜" },
      { text: "は" },
      { text: "言", reading: "い" },
      { text: "うに" },
      { text: "及", reading: "およ" },
      { text: "ばず" },
    ],
    jlptLevel: "N2",
    meaning: "Sans même parler de ~ (évident)",
    rule: "Nom + は言うに及ばず",
    usage: "Pour exprimer qu'un premier élément est si évident qu'il n'a même pas besoin d'être mentionné, et qu'un autre s'y ajoute.",
    examples: [
      {
        segments: [
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "は",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "うに",
          },
          {
            text: "及",
            reading: "およ",
          },
          {
            text: "ばず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "英語",
            reading: "えいご",
          },
          {
            text: "も",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "せます。",
          },
        ],
        translation: "Sans même parler du japonais, il parle aussi anglais.",
      },
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "は",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "うに",
          },
          {
            text: "及",
            reading: "およ",
          },
          {
            text: "ばず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "大人",
            reading: "おとな",
          },
          {
            text: "にも",
          },
          {
            text: "人気",
            reading: "にんき",
          },
          {
            text: "です。",
          },
        ],
        translation: "Sans même parler des enfants, c’est aussi populaire chez les adultes.",
      },
    ],
  },
  {
    id: "wa-sateoki",
    pattern: "〜はさておき",
    jlptLevel: "N2",
    meaning: "Laissons de côté ~ (pour le moment)",
    rule: "Nom + はさておき",
    usage: "Pour exprimer qu'on met provisoirement un sujet de côté afin de passer à un autre.",
    examples: [
      {
        segments: [
          {
            text: "冗談",
            reading: "じょうだん",
          },
          {
            text: "はさておき",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "本題",
            reading: "ほんだい",
          },
          {
            text: "に",
          },
          {
            text: "入",
            reading: "はい",
          },
          {
            text: "りましょう。",
          },
        ],
        translation: "Laissons de côté les plaisanteries, entrons dans le vif du sujet.",
      },
      {
        segments: [
          {
            text: "結果",
            reading: "けっか",
          },
          {
            text: "はさておき",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "は",
          },
          {
            text: "評価",
            reading: "ひょうか",
          },
          {
            text: "できます。",
          },
        ],
        translation: "Laissant de côté le résultat, les efforts sont appréciables.",
      },
    ],
  },
  {
    id: "nagaramo",
    pattern: "〜ながらも",
    jlptLevel: "N2",
    meaning: "Bien que ~ (concession)",
    rule: "Verbe (ます形) / Adjectif + ながらも",
    usage: "Pour exprimer une concession entre deux états contradictoires qui coexistent malgré tout.",
    examples: [
      {
        segments: [
          {
            text: "狭",
            reading: "せま",
          },
          {
            text: "いながらも",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "快適",
            reading: "かいてき",
          },
          {
            text: "な",
          },
          {
            text: "部屋",
            reading: "へや",
          },
          {
            text: "です。",
          },
        ],
        translation: "Bien qu’elle soit petite, c’est une pièce confortable.",
      },
      {
        segments: [
          {
            text: "知",
            reading: "し",
          },
          {
            text: "りながらも",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "何",
            reading: "なに",
          },
          {
            text: "も",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "えませんでした。",
          },
        ],
        translation: "Bien que je le savais, je n’ai rien pu dire.",
      },
    ],
  },
  {
    id: "tohaurahani",
    pattern: "〜とはうらはらに",
    jlptLevel: "N2",
    meaning: "Contrairement à ~ (attentes déçues)",
    rule: "Nom + とはうらはらに",
    usage: "Pour exprimer qu'un résultat contredit complètement une attente, une apparence ou un sentiment initial.",
    examples: [
      {
        segments: [
          {
            text: "期待",
            reading: "きたい",
          },
          {
            text: "とはうらはらに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "結果",
            reading: "けっか",
          },
          {
            text: "は",
          },
          {
            text: "悪",
            reading: "わる",
          },
          {
            text: "かったです。",
          },
        ],
        translation: "Contrairement à mes attentes, le résultat a été mauvais.",
      },
      {
        segments: [
          {
            text: "穏",
            reading: "おだ",
          },
          {
            text: "やかな",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "た",
          },
          {
            text: "目",
            reading: "め",
          },
          {
            text: "とはうらはらに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "性格",
            reading: "せいかく",
          },
          {
            text: "は",
          },
          {
            text: "激",
            reading: "はげ",
          },
          {
            text: "しいです。",
          },
        ],
        translation: "Contrairement à son apparence douce, son caractère est vif.",
      },
    ],
  },
  {
    id: "to-itte-mo-kagon-dewanai",
    pattern: "〜と言っても過言ではない",
    patternSegments: [
      { text: "〜" },
      { text: "と" },
      { text: "言", reading: "い" },
      { text: "っても" },
      { text: "過言", reading: "かごん" },
      { text: "ではない" },
    ],
    jlptLevel: "N2",
    meaning: "On ne peut pas dire que c’est exagéré de dire ~",
    rule: "Phrase (forme normale) + と言っても過言ではない",
    usage: "Pour affirmer avec force une opinion en indiquant qu'elle n'est pas exagérée malgré son caractère extrême.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "天才",
            reading: "てんさい",
          },
          {
            text: "だと",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "っても",
          },
          {
            text: "過言",
            reading: "かごん",
          },
          {
            text: "ではありません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "On peut dire sans exagérer qu’il est un génie.",
      },
      {
        segments: [
          {
            text: "これは",
          },
          {
            text: "史上最高",
            reading: "しじょうさいこう",
          },
          {
            text: "の",
          },
          {
            text: "作品",
            reading: "さくひん",
          },
          {
            text: "だと",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "っても",
          },
          {
            text: "過言",
            reading: "かごん",
          },
          {
            text: "ではない",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "On peut dire sans exagérer que c’est la meilleure œuvre de tous les temps.",
      },
    ],
  },
  {
    id: "iwazumogana",
    pattern: "〜は言わずもがな",
    patternSegments: [
      { text: "〜" },
      { text: "は" },
      { text: "言", reading: "い" },
      { text: "わずもがな" },
    ],
    jlptLevel: "N2",
    meaning: "Il va sans dire que ~",
    rule: "Nom + は言わずもがな",
    usage: "Pour exprimer qu'un fait est si évident qu'il n'a pas besoin d'être exprimé.",
    examples: [
      {
        segments: [
          {
            text: "結果",
            reading: "けっか",
          },
          {
            text: "は",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "わずもがな",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Le résultat va sans dire.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "実力",
            reading: "じつりょく",
          },
          {
            text: "は",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "わずもがな",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Son talent va sans dire.",
      },
    ],
  },
  {
    id: "tomo-arou-monoga",
    pattern: "〜ともあろう者が",
    patternSegments: [
      { text: "〜" },
      { text: "ともあろう" },
      { text: "者", reading: "もの" },
      { text: "が" },
    ],
    jlptLevel: "N2",
    meaning: "Quelqu’un d’aussi qualifié que ~ (reproche)",
    rule: "Nom + ともあろう者が",
    usage: "Pour exprimer, avec un ton de reproche, la surprise ou la déception qu'une personne de haut statut se comporte mal.",
    examples: [
      {
        segments: [
          {
            text: "社長",
            reading: "しゃちょう",
          },
          {
            text: "ともあろう",
          },
          {
            text: "者",
            reading: "もの",
          },
          {
            text: "が",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "そんなミスをするなんて。",
          },
        ],
        translation: "Que quelqu’un d’aussi haut placé que le président commette une telle erreur !",
      },
      {
        segments: [
          {
            text: "医者",
            reading: "いしゃ",
          },
          {
            text: "ともあろう",
          },
          {
            text: "者",
            reading: "もの",
          },
          {
            text: "が",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "患者",
            reading: "かんじゃ",
          },
          {
            text: "を",
          },
          {
            text: "見捨",
            reading: "みす",
          },
          {
            text: "てるとは。",
          },
        ],
        translation: "Qu’un médecin abandonne ainsi son patient !",
      },
    ],
  },
  {
    id: "sura",
    pattern: "〜すら",
    jlptLevel: "N2",
    meaning: "Même ~ (renforcement)",
    rule: "Nom + すら",
    usage: "Pour souligner, par un exemple extrême, l'ampleur d'une situation, proche de さえ mais plus littéraire.",
    examples: [
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "ですら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "その",
          },
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "が",
          },
          {
            text: "解",
            reading: "と",
          },
          {
            text: "けます。",
          },
        ],
        translation: "Même un enfant peut résoudre ce problème.",
      },
      {
        segments: [
          {
            text: "想像",
            reading: "そうぞう",
          },
          {
            text: "すら",
            highlight: true,
          },
          {
            text: "できません。",
          },
        ],
        translation: "Je ne peux même pas l’imaginer.",
      },
    ],
  },
  {
    id: "wo-kinjienai",
    pattern: "〜を禁じ得ない",
    patternSegments: [
      { text: "〜" },
      { text: "を" },
      { text: "禁", reading: "きん" },
      { text: "じ" },
      { text: "得", reading: "え" },
      { text: "ない" },
    ],
    jlptLevel: "N2",
    meaning: "Ne pouvoir s’empêcher de ressentir ~",
    rule: "Nom + を禁じ得ない",
    usage: "Pour exprimer qu'on ne peut retenir un sentiment fort (colère, émotion, surprise), registre soutenu.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "行動",
            reading: "こうどう",
          },
          {
            text: "に",
          },
          {
            text: "怒",
            reading: "いか",
          },
          {
            text: "りを",
          },
          {
            text: "禁",
            reading: "きん",
          },
          {
            text: "じ",
          },
          {
            text: "得",
            reading: "え",
          },
          {
            text: "ません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Je ne peux m’empêcher de ressentir de la colère face à son comportement.",
      },
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "光景",
            reading: "こうけい",
          },
          {
            text: "に",
          },
          {
            text: "涙",
            reading: "なみだ",
          },
          {
            text: "を",
          },
          {
            text: "禁",
            reading: "きん",
          },
          {
            text: "じ",
          },
          {
            text: "得",
            reading: "え",
          },
          {
            text: "なかった",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Je n’ai pas pu retenir mes larmes devant ce spectacle.",
      },
    ],
  },
  {
    id: "ni-terashite",
    pattern: "〜に照らして",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "照", reading: "て" },
      { text: "らして" },
    ],
    jlptLevel: "N2",
    meaning: "À la lumière de ~ / conformément à ~",
    rule: "Nom + に照らして",
    usage: "Pour exprimer qu'on juge ou agit en se référant à une norme, une règle ou une expérience établie.",
    examples: [
      {
        segments: [
          {
            text: "法律",
            reading: "ほうりつ",
          },
          {
            text: "に",
          },
          {
            text: "照",
            reading: "て",
          },
          {
            text: "らして",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "判断",
            reading: "はんだん",
          },
          {
            text: "します。",
          },
        ],
        translation: "Nous jugerons à la lumière de la loi.",
      },
      {
        segments: [
          {
            text: "経験",
            reading: "けいけん",
          },
          {
            text: "に",
          },
          {
            text: "照",
            reading: "て",
          },
          {
            text: "らして",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "アドバイス",
            highlight: false,
          },
          {
            text: "します。",
          },
        ],
        translation: "Je vous conseillerai en me basant sur mon expérience.",
      },
    ],
  },
  {
    id: "youdewa",
    pattern: "〜ようでは",
    jlptLevel: "N2",
    meaning: "Si les choses en sont là où ~ (mauvais signe)",
    rule: "Verbe (辞書形) + ようでは",
    usage: "Pour exprimer qu'une situation, si elle persiste dans cet état, mènera à un résultat négatif.",
    examples: [
      {
        segments: [
          {
            text: "そんなに",
          },
          {
            text: "簡単",
            reading: "かんたん",
          },
          {
            text: "に",
          },
          {
            text: "あきらめるようでは",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "成功",
            reading: "せいこう",
          },
          {
            text: "できません。",
          },
        ],
        translation: "Si tu abandonnes aussi facilement, tu ne pourras pas réussir.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "程度",
            reading: "ていど",
          },
          {
            text: "で",
          },
          {
            text: "疲",
            reading: "つか",
          },
          {
            text: "れるようでは",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "先",
            reading: "さき",
          },
          {
            text: "が",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "いやられます。",
          },
        ],
        translation: "Si on est déjà fatigué à ce stade, on peut s’inquiéter pour la suite.",
      },
    ],
  },
  {
    id: "to-miete",
    pattern: "〜とみえて",
    jlptLevel: "N2",
    meaning: "À en juger par les apparences, il semble que ~",
    rule: "Phrase (forme normale) + とみえて",
    usage: "Pour exprimer une conjecture fondée sur un indice observable.",
    examples: [
      {
        segments: [
          {
            text: "疲",
            reading: "つか",
          },
          {
            text: "れているとみえて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "何",
            reading: "なに",
          },
          {
            text: "も",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "しません。",
          },
        ],
        translation: "Il semble fatigué, il ne parle pas du tout.",
      },
      {
        segments: [
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "が",
          },
          {
            text: "降",
            reading: "ふ",
          },
          {
            text: "ったとみえて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "道",
            reading: "みち",
          },
          {
            text: "が",
          },
          {
            text: "濡",
            reading: "ぬ",
          },
          {
            text: "れています。",
          },
        ],
        translation: "Il semble qu’il ait plu, la route est mouillée.",
      },
    ],
  },
  {
    id: "nbakarini",
    pattern: "〜んばかりに",
    jlptLevel: "N2",
    meaning: "Comme si sur le point de ~",
    rule: "Verbe (ない形の語幹) + んばかりに",
    usage: "Pour décrire une action qui semble sur le point de se produire, exprimée par une intensité visible.",
    examples: [
      {
        segments: [
          {
            text: "今",
            reading: "いま",
          },
          {
            text: "にも",
          },
          {
            text: "泣",
            reading: "な",
          },
          {
            text: "き",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "さんばかりに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "訴",
            reading: "うった",
          },
          {
            text: "えました。",
          },
        ],
        translation: "Elle a plaidé sa cause, comme sur le point d’éclater en sanglots.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "飛",
            reading: "と",
          },
          {
            text: "び",
          },
          {
            text: "上",
            reading: "あ",
          },
          {
            text: "がらんばかりに",
            highlight: true,
          },
          {
            text: "喜",
            reading: "よろこ",
          },
          {
            text: "びました。",
          },
        ],
        translation: "Il s’est réjoui, comme s’il allait bondir de joie.",
      },
    ],
  },
  {
    id: "zuni-okanai",
    pattern: "〜ずにおかない",
    jlptLevel: "N2",
    meaning: "Ne pas manquer de ~ (effet inévitable)",
    rule: "Verbe (ない形の語幹) + ずにおかない",
    usage: "Pour exprimer qu'une chose provoque inévitablement un effet ou une réaction, registre soutenu.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "映画",
            reading: "えいが",
          },
          {
            text: "は",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "る",
          },
          {
            text: "人",
            reading: "ひと",
          },
          {
            text: "を",
          },
          {
            text: "感動",
            reading: "かんどう",
          },
          {
            text: "させずにおきません",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Ce film ne manque pas d’émouvoir ceux qui le voient.",
      },
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "発言",
            reading: "はつげん",
          },
          {
            text: "は",
          },
          {
            text: "反発",
            reading: "はんぱつ",
          },
          {
            text: "を",
          },
          {
            text: "招",
            reading: "まね",
          },
          {
            text: "かずにおかなかった",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Cette déclaration n’a pas manqué de provoquer des réactions hostiles.",
      },
    ],
  },
  {
    id: "mono-to-omowareru",
    pattern: "〜ものと思われる",
    patternSegments: [
      { text: "〜" },
      { text: "ものと" },
      { text: "思", reading: "おも" },
      { text: "われる" },
    ],
    jlptLevel: "N2",
    meaning: "On pense que ~ (conjecture objective)",
    rule: "Phrase (forme normale) + ものと思われる",
    usage: "Pour exprimer une conjecture présentée de façon objective et formelle, typique des rapports ou articles.",
    examples: [
      {
        segments: [
          {
            text: "原因",
            reading: "げんいん",
          },
          {
            text: "は",
          },
          {
            text: "整備",
            reading: "せいび",
          },
          {
            text: "不足",
            reading: "ぶそく",
          },
          {
            text: "にある",
          },
          {
            text: "ものと",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "われます",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "On pense que la cause réside dans un manque d’entretien.",
      },
      {
        segments: [
          {
            text: "今後",
            reading: "こんご",
          },
          {
            text: "、",
          },
          {
            text: "需要",
            reading: "じゅよう",
          },
          {
            text: "は",
          },
          {
            text: "増",
            reading: "ふ",
          },
          {
            text: "える",
          },
          {
            text: "ものと",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "われます",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "On pense que la demande va augmenter à l’avenir.",
      },
    ],
  },
  {
    id: "wo-sakaini",
    pattern: "〜を境に",
    patternSegments: [
      { text: "〜" },
      { text: "を" },
      { text: "境", reading: "さかい" },
      { text: "に" },
    ],
    jlptLevel: "N2",
    meaning: "À partir de ~ (comme tournant)",
    rule: "Nom + を境に",
    usage: "Pour indiquer un moment charnière à partir duquel une situation change nettement.",
    examples: [
      {
        segments: [
          {
            text: "結婚",
            reading: "けっこん",
          },
          {
            text: "を",
          },
          {
            text: "境",
            reading: "さかい",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "生活",
            reading: "せいかつ",
          },
          {
            text: "が",
          },
          {
            text: "一変",
            reading: "いっぺん",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Avec le mariage comme tournant, ma vie a totalement changé.",
      },
      {
        segments: [
          {
            text: "その",
          },
          {
            text: "事故",
            reading: "じこ",
          },
          {
            text: "を",
          },
          {
            text: "境",
            reading: "さかい",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "安全",
            reading: "あんぜん",
          },
          {
            text: "対策",
            reading: "たいさく",
          },
          {
            text: "が",
          },
          {
            text: "強化",
            reading: "きょうか",
          },
          {
            text: "されました。",
          },
        ],
        translation: "À la suite de cet accident, les mesures de sécurité ont été renforcées.",
      },
    ],
  },
  {
    id: "ichito-wo-tadoru",
    pattern: "〜一途をたどる",
    patternSegments: [
      { text: "〜" },
      { text: "一途", reading: "いっと" },
      { text: "をたどる" },
    ],
    jlptLevel: "N2",
    meaning: "Continuer sur la voie de ~ (évolution constante)",
    rule: "Nom + 一途をたどる",
    usage: "Pour exprimer qu'une tendance évolue de manière constante et unidirectionnelle, souvent négative.",
    examples: [
      {
        segments: [
          {
            text: "人口",
            reading: "じんこう",
          },
          {
            text: "は",
          },
          {
            text: "減少",
            reading: "げんしょう",
          },
          {
            text: "の",
          },
          {
            text: "一途",
            reading: "いっと",
          },
          {
            text: "をたどっています",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "La population continue de baisser sans arrêt.",
      },
      {
        segments: [
          {
            text: "状況",
            reading: "じょうきょう",
          },
          {
            text: "は",
          },
          {
            text: "悪化",
            reading: "あっか",
          },
          {
            text: "の",
          },
          {
            text: "一途",
            reading: "いっと",
          },
          {
            text: "をたどっている",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "La situation continue de se dégrader sans cesse.",
      },
    ],
  },
  {
    id: "towataishoteki-ni",
    pattern: "〜とは対照的に",
    patternSegments: [
      { text: "〜" },
      { text: "とは" },
      { text: "対照的", reading: "たいしょうてき" },
      { text: "に" },
    ],
    jlptLevel: "N2",
    meaning: "Contrairement à ~ (contraste net)",
    rule: "Nom + とは対照的に",
    usage: "Pour souligner un contraste net et objectif entre deux éléments comparés.",
    examples: [
      {
        segments: [
          {
            text: "兄",
            reading: "あに",
          },
          {
            text: "の",
          },
          {
            text: "性格",
            reading: "せいかく",
          },
          {
            text: "とは",
          },
          {
            text: "対照的",
            reading: "たいしょうてき",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "弟",
            reading: "おとうと",
          },
          {
            text: "は",
          },
          {
            text: "おとなしいです。",
          },
        ],
        translation: "Contrairement au caractère de son frère aîné, le cadet est calme.",
      },
      {
        segments: [
          {
            text: "去年",
            reading: "きょねん",
          },
          {
            text: "とは",
          },
          {
            text: "対照的",
            reading: "たいしょうてき",
          },
          {
            text: "に",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "今年",
            reading: "ことし",
          },
          {
            text: "は",
          },
          {
            text: "雪",
            reading: "ゆき",
          },
          {
            text: "が",
          },
          {
            text: "少",
            reading: "すく",
          },
          {
            text: "ないです。",
          },
        ],
        translation: "Contrairement à l’an dernier, il y a peu de neige cette année.",
      },
    ],
  },
  {
    id: "fushi-ga-aru",
    pattern: "〜ふしがある",
    jlptLevel: "N2",
    meaning: "Il y a des signes/indices que ~",
    rule: "Verbe (辞書形) + ふしがある",
    usage: "Pour exprimer qu'il existe des indices laissant penser à quelque chose, sans certitude absolue.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "何",
            reading: "なに",
          },
          {
            text: "か",
          },
          {
            text: "隠",
            reading: "かく",
          },
          {
            text: "している",
          },
          {
            text: "ふし",
            highlight: true,
          },
          {
            text: "があります。",
          },
        ],
        translation: "Il y a des indices qu’il cache quelque chose.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "事情",
            reading: "じじょう",
          },
          {
            text: "を",
          },
          {
            text: "知",
            reading: "し",
          },
          {
            text: "っている",
          },
          {
            text: "ふし",
            highlight: true,
          },
          {
            text: "がある。",
          },
        ],
        translation: "Il y a des signes qu’elle est au courant de la situation.",
      },
    ],
  },
  {
    id: "kotodashi",
    pattern: "〜ことだし",
    jlptLevel: "N2",
    meaning: "Puisque ~ (raison, familier)",
    rule: "Verbe/adjectif (forme normale) + ことだし",
    usage: "Pour donner une raison légère à une décision, dans un registre familier et conversationnel.",
    examples: [
      {
        segments: [
          {
            text: "天気",
            reading: "てんき",
          },
          {
            text: "もいい",
          },
          {
            text: "ことだし",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "散歩",
            reading: "さんぽ",
          },
          {
            text: "に",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "きましょう。",
          },
        ],
        translation: "Puisqu’il fait beau, allons nous promener.",
      },
      {
        segments: [
          {
            text: "もう",
          },
          {
            text: "遅",
            reading: "おそ",
          },
          {
            text: "い",
          },
          {
            text: "ことだし",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "そろそろ",
          },
          {
            text: "帰",
            reading: "かえ",
          },
          {
            text: "りましょう。",
          },
        ],
        translation: "Puisqu’il se fait déjà tard, rentrons bientôt.",
      },
    ],
  },
  {
    id: "naritomo",
    pattern: "〜なりとも",
    jlptLevel: "N2",
    meaning: "Ne serait-ce que ~ (petite quantité)",
    rule: "Nom + なりとも",
    usage: "Pour exprimer qu'une petite quantité ou un effort minimal, même modeste, est appréciable.",
    examples: [
      {
        segments: [
          {
            text: "少",
            reading: "すこ",
          },
          {
            text: "し",
          },
          {
            text: "なりとも",
            highlight: true,
          },
          {
            text: "お",
          },
          {
            text: "役",
            reading: "やく",
          },
          {
            text: "に",
          },
          {
            text: "立",
            reading: "た",
          },
          {
            text: "てれば",
          },
          {
            text: "幸",
            reading: "さいわ",
          },
          {
            text: "いです。",
          },
        ],
        translation: "Je serais heureux si je pouvais être ne serait-ce qu’un peu utile.",
      },
      {
        segments: [
          {
            text: "一言",
            reading: "ひとこと",
          },
          {
            text: "なりとも",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "お",
          },
          {
            text: "礼",
            reading: "れい",
          },
          {
            text: "を",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "いたいです。",
          },
        ],
        translation: "Je voudrais dire ne serait-ce qu’un mot de remerciement.",
      },
    ],
  },
  {
    id: "nominarazu",
    pattern: "〜のみならず",
    jlptLevel: "N2",
    meaning: "Non seulement ~ mais aussi",
    rule: "Nom / Verbe (辞書形) + のみならず",
    usage: "Pour exprimer qu'un fait dépasse le cadre attendu, avec un élément supplémentaire ajouté, registre soutenu.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "日本語",
            reading: "にほんご",
          },
          {
            text: "のみならず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "中国語",
            reading: "ちゅうごくご",
          },
          {
            text: "も",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "せます。",
          },
        ],
        translation: "Non seulement il parle japonais, mais il parle aussi chinois.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "は",
          },
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "のみならず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "世界中",
            reading: "せかいじゅう",
          },
          {
            text: "の",
          },
          {
            text: "課題",
            reading: "かだい",
          },
          {
            text: "です。",
          },
        ],
        translation: "Ce problème n’est pas propre au Japon, c’est un enjeu mondial.",
      },
    ],
  },
  {
    id: "bakoso",
    pattern: "〜ばこそ",
    jlptLevel: "N2",
    meaning: "C’est précisément parce que ~",
    rule: "Verbe/adjectif (ば形) + こそ",
    usage: "Pour souligner avec force la véritable raison d'une chose, en excluant toute autre explication.",
    examples: [
      {
        segments: [
          {
            text: "あなたを",
          },
          {
            text: "愛",
            reading: "あい",
          },
          {
            text: "していれば",
            highlight: true,
          },
          {
            text: "こそ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "厳",
            reading: "きび",
          },
          {
            text: "しく",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "うのです。",
          },
        ],
        translation: "C’est précisément parce que je vous aime que je suis sévère.",
      },
      {
        segments: [
          {
            text: "健康",
            reading: "けんこう",
          },
          {
            text: "であれば",
            highlight: true,
          },
          {
            text: "こそ",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "ができます。",
          },
        ],
        translation: "C’est précisément parce qu’on est en bonne santé qu’on peut travailler.",
      },
    ],
  },
  {
    id: "tara-saigo",
    pattern: "〜たら最後",
    patternSegments: [
      { text: "〜" },
      { text: "たら" },
      { text: "最後", reading: "さいご" },
    ],
    jlptLevel: "N2",
    meaning: "Une fois que ~, c’en est fini (irréversible)",
    rule: "Verbe (た形) + ら最後",
    usage: "Pour exprimer qu'une fois qu'une action est réalisée, une conséquence inévitable et souvent négative s'ensuit.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "ボタン",
            highlight: false,
          },
          {
            text: "を",
          },
          {
            text: "押",
            reading: "お",
          },
          {
            text: "したら",
          },
          {
            text: "最後",
            reading: "さいご",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "止",
            reading: "と",
          },
          {
            text: "まりません。",
          },
        ],
        translation: "Une fois ce bouton pressé, il n’y a plus moyen d’arrêter.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "寝",
            reading: "ね",
          },
          {
            text: "たら",
          },
          {
            text: "最後",
            reading: "さいご",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "朝",
            reading: "あさ",
          },
          {
            text: "まで",
          },
          {
            text: "起",
            reading: "お",
          },
          {
            text: "きません。",
          },
        ],
        translation: "Une fois endormi, il ne se réveille plus jusqu’au matin.",
      },
    ],
  },
  {
    id: "itatte-wa",
    pattern: "〜に至っては",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "至", reading: "いた" },
      { text: "っては" },
    ],
    jlptLevel: "N2",
    meaning: "Quand il s’agit de ~ (cas extrême)",
    rule: "Nom + に至っては",
    usage: "Pour introduire un exemple extrême parmi plusieurs, souvent le pire, dans un registre soutenu.",
    examples: [
      {
        segments: [
          {
            text: "弟",
            reading: "おとうと",
          },
          {
            text: "に",
          },
          {
            text: "至",
            reading: "いた",
          },
          {
            text: "っては",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "全然",
            reading: "ぜんぜん",
          },
          {
            text: "勉強",
            reading: "べんきょう",
          },
          {
            text: "しません。",
          },
        ],
        translation: "Quant à mon petit frère, il n’étudie pas du tout.",
      },
      {
        segments: [
          {
            text: "売",
            reading: "う",
          },
          {
            text: "り",
          },
          {
            text: "上",
            reading: "あ",
          },
          {
            text: "げに",
          },
          {
            text: "至",
            reading: "いた",
          },
          {
            text: "っては",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "前年",
            reading: "ぜんねん",
          },
          {
            text: "の",
          },
          {
            text: "半分",
            reading: "はんぶん",
          },
          {
            text: "です。",
          },
        ],
        translation: "Quant au chiffre d’affaires, il représente la moitié de l’année précédente.",
      },
    ],
  },
  {
    id: "nishite",
    pattern: "〜にして",
    jlptLevel: "N2",
    meaning: "Même à ~ (moment/étape) / seulement à ~",
    rule: "Nom (âge, nombre d’essais) + にして",
    usage: "Pour souligner qu'un fait s'est produit à un moment précis, souvent tardif ou remarquable.",
    examples: [
      {
        segments: [
          {
            text: "三十歳",
            reading: "さんじゅっさい",
          },
          {
            text: "にして",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ようやく",
          },
          {
            text: "夢",
            reading: "ゆめ",
          },
          {
            text: "が",
          },
          {
            text: "叶",
            reading: "かな",
          },
          {
            text: "いました。",
          },
        ],
        translation: "Ce n’est qu’à trente ans que son rêve s’est enfin réalisé.",
      },
      {
        segments: [
          {
            text: "三度目",
            reading: "さんどめ",
          },
          {
            text: "にして",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "やっと",
          },
          {
            text: "成功",
            reading: "せいこう",
          },
          {
            text: "しました。",
          },
        ],
        translation: "Ce n’est qu’à la troisième tentative que j’ai enfin réussi.",
      },
    ],
  },
  {
    id: "nannarito",
    pattern: "〜何なりと",
    patternSegments: [
      { text: "〜" },
      { text: "何", reading: "なん" },
      { text: "なりと" },
    ],
    jlptLevel: "N2",
    meaning: "Tout ce que vous voulez ~ (offre formelle)",
    rule: "何なりと + Verbe",
    usage: "Pour offrir formellement son aide, en laissant l'interlocuteur libre de choisir n'importe quoi.",
    examples: [
      {
        segments: [
          {
            text: "ご",
          },
          {
            text: "用",
            reading: "よう",
          },
          {
            text: "があれば",
          },
          {
            text: "何",
            reading: "なん",
          },
          {
            text: "なりと",
            highlight: true,
          },
          {
            text: "お",
          },
          {
            text: "申",
            reading: "もう",
          },
          {
            text: "し",
          },
          {
            text: "付",
            reading: "つ",
          },
          {
            text: "けください。",
          },
        ],
        translation: "Si vous avez besoin de quoi que ce soit, n’hésitez pas à demander.",
      },
      {
        segments: [
          {
            text: "何",
            reading: "なん",
          },
          {
            text: "なりと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "お",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "きください。",
          },
        ],
        translation: "N’hésitez pas à poser n’importe quelle question.",
      },
    ],
  },
  {
    id: "toiuto",
    pattern: "〜というと",
    jlptLevel: "N2",
    meaning: "En parlant de ~ / si on dit ~",
    rule: "Nom + というと",
    usage: "Pour introduire un sujet évoqué par association d'idées à partir de ce qui vient d'être dit.",
    examples: [
      {
        segments: [
          {
            text: "日本料理",
            reading: "にほんりょうり",
          },
          {
            text: "というと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "寿司",
            reading: "すし",
          },
          {
            text: "を",
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "い",
          },
          {
            text: "出",
            reading: "だ",
          },
          {
            text: "します。",
          },
        ],
        translation: "En parlant de cuisine japonaise, ça me fait penser aux sushis.",
      },
      {
        segments: [
          {
            text: "田中",
            reading: "たなか",
          },
          {
            text: "さん",
          },
          {
            text: "というと",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "最近",
            reading: "さいきん",
          },
          {
            text: "結婚",
            reading: "けっこん",
          },
          {
            text: "したそうですね。",
          },
        ],
        translation: "En parlant de M. Tanaka, il paraît qu’il vient de se marier.",
      },
    ],
  },
  {
    id: "wo-ii-koto-ni",
    pattern: "〜をいいことに",
    jlptLevel: "N2",
    meaning: "Profitant de ~ (abusivement)",
    rule: "Nom / Verbe(辞書形の)+ことに + をいいことに",
    usage: "Pour exprimer qu'on profite abusivement d'une situation favorable pour agir de façon inappropriée.",
    examples: [
      {
        segments: [
          {
            text: "親",
            reading: "おや",
          },
          {
            text: "が",
          },
          {
            text: "いない",
          },
          {
            text: "のをいいことに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "たちは",
          },
          {
            text: "遊",
            reading: "あそ",
          },
          {
            text: "び",
          },
          {
            text: "回",
            reading: "まわ",
          },
          {
            text: "りました。",
          },
        ],
        translation: "Profitant de l’absence des parents, les enfants sont allés jouer sans limite.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "立場",
            reading: "たちば",
          },
          {
            text: "をいいことに",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "不正",
            reading: "ふせい",
          },
          {
            text: "を",
          },
          {
            text: "働",
            reading: "はたら",
          },
          {
            text: "きました。",
          },
        ],
        translation: "Profitant abusivement de sa position, il a commis des malversations.",
      },
    ],
  },
  {
    id: "ni-oyonde",
    pattern: "〜に及んで",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "及", reading: "およ" },
      { text: "んで" },
    ],
    jlptLevel: "N2",
    meaning: "Lorsqu’on en arrive à ~ (situation extrême, tardive)",
    rule: "Nom / Verbe (辞書形) + に及んで",
    usage: "Pour exprimer que ce n'est qu'à un stade avancé, voire trop tardif, qu'une action se produit enfin.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "期",
            reading: "き",
          },
          {
            text: "に",
          },
          {
            text: "及",
            reading: "およ",
          },
          {
            text: "んで",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "今更",
            reading: "いまさら",
          },
          {
            text: "文句",
            reading: "もんく",
          },
          {
            text: "を",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "っても",
          },
          {
            text: "遅",
            reading: "おそ",
          },
          {
            text: "い。",
          },
        ],
        translation: "Maintenant que les choses en sont arrivées là, se plaindre est trop tard.",
      },
      {
        segments: [
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "が",
          },
          {
            text: "明",
            reading: "あき",
          },
          {
            text: "らかになるに",
          },
          {
            text: "及",
            reading: "およ",
          },
          {
            text: "んで",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "ようやく",
          },
          {
            text: "対応",
            reading: "たいおう",
          },
          {
            text: "が",
          },
          {
            text: "始",
            reading: "はじ",
          },
          {
            text: "まった。",
          },
        ],
        translation: "Ce n’est qu’une fois le problème rendu public que la réponse a enfin commencé.",
      },
    ],
  },
  {
    id: "kagirida",
    pattern: "〜限りだ",
    patternSegments: [
      { text: "〜" },
      { text: "限", reading: "かぎ" },
      { text: "りだ" },
    ],
    jlptLevel: "N2",
    meaning: "C’est vraiment très ~ (sentiment intense)",
    rule: "Adjectif (辞書形) + 限りだ",
    usage: "Pour exprimer avec force un sentiment personnel intense, souvent de joie ou de regret.",
    examples: [
      {
        segments: [
          {
            text: "嬉",
            reading: "うれ",
          },
          {
            text: "しい",
          },
          {
            text: "限",
            reading: "かぎ",
          },
          {
            text: "り",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Je suis vraiment très content.",
      },
      {
        segments: [
          {
            text: "残念",
            reading: "ざんねん",
          },
          {
            text: "な",
          },
          {
            text: "限",
            reading: "かぎ",
          },
          {
            text: "り",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est vraiment très regrettable.",
      },
    ],
  },
  {
    id: "mo-douzen-da",
    pattern: "〜も同然だ",
    patternSegments: [
      { text: "〜" },
      { text: "も" },
      { text: "同然", reading: "どうぜん" },
      { text: "だ" },
    ],
    jlptLevel: "N2",
    meaning: "C’est comme si c’était ~",
    rule: "Nom / Verbe (辞書形) + も同然だ",
    usage: "Pour exprimer qu'une situation, bien que non identique en théorie, équivaut en pratique à une autre.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "試合",
            reading: "しあい",
          },
          {
            text: "は",
          },
          {
            text: "もう",
          },
          {
            text: "勝",
            reading: "か",
          },
          {
            text: "ったも",
          },
          {
            text: "同然",
            reading: "どうぜん",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Ce match est déjà pratiquement gagné.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "家族",
            reading: "かぞく",
          },
          {
            text: "も",
          },
          {
            text: "同然",
            reading: "どうぜん",
            highlight: true,
          },
          {
            text: "の",
          },
          {
            text: "存在",
            reading: "そんざい",
          },
          {
            text: "です。",
          },
        ],
        translation: "Il est comme un membre de la famille.",
      },
    ],
  },
  {
    id: "rokuni-nai",
    pattern: "〜ろくに〜ない",
    jlptLevel: "N2",
    meaning: "À peine, pas correctement ~",
    rule: "ろくに + Verbe (ない形)",
    usage: "Pour exprimer qu'une action n'est pas faite de façon satisfaisante ou suffisante.",
    examples: [
      {
        segments: [
          {
            text: "忙",
            reading: "いそが",
          },
          {
            text: "しくて、",
          },
          {
            text: "ろくに",
            highlight: true,
          },
          {
            text: "食",
            reading: "た",
          },
          {
            text: "べていません。",
          },
        ],
        translation: "Je suis tellement occupé que je ne mange presque pas correctement.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "ろくに",
            highlight: true,
          },
          {
            text: "挨拶",
            reading: "あいさつ",
          },
          {
            text: "もしませんでした。",
          },
        ],
        translation: "Il n’a même pas correctement salué.",
      },
    ],
  },
  {
    id: "arumajiki",
    pattern: "〜あるまじき",
    jlptLevel: "N2",
    meaning: "Indigne de ~ (comportement inacceptable)",
    rule: "Nom + にあるまじき + Nom",
    usage: "Pour qualifier un comportement totalement inapproprié au statut ou à la fonction d'une personne, registre très soutenu.",
    examples: [
      {
        segments: [
          {
            text: "それは",
          },
          {
            text: "教師",
            reading: "きょうし",
          },
          {
            text: "に",
          },
          {
            text: "あるまじき",
            highlight: true,
          },
          {
            text: "行為",
            reading: "こうい",
          },
          {
            text: "です。",
          },
        ],
        translation: "C’est un acte indigne d’un enseignant.",
      },
      {
        segments: [
          {
            text: "医者",
            reading: "いしゃ",
          },
          {
            text: "に",
          },
          {
            text: "あるまじき",
            highlight: true,
          },
          {
            text: "発言",
            reading: "はつげん",
          },
          {
            text: "でした。",
          },
        ],
        translation: "C’était une déclaration indigne d’un médecin.",
      },
    ],
  },
  {
    id: "toiu-mono-duration",
    pattern: "〜というもの",
    jlptLevel: "N2",
    meaning: "Pendant tout ce temps de ~",
    rule: "Période + というもの",
    usage: "Pour souligner la durée écoulée, en insistant sur son caractère long et continu.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "一",
            reading: "ひと",
          },
          {
            text: "か",
          },
          {
            text: "月",
            reading: "つき",
          },
          {
            text: "というもの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "休",
            reading: "やす",
          },
          {
            text: "みなく",
          },
          {
            text: "働",
            reading: "はたら",
          },
          {
            text: "いています。",
          },
        ],
        translation: "Depuis ce mois entier, je travaille sans relâche.",
      },
      {
        segments: [
          {
            text: "ここ",
          },
          {
            text: "数年",
            reading: "すうねん",
          },
          {
            text: "というもの",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "に",
          },
          {
            text: "会",
            reading: "あ",
          },
          {
            text: "っていません。",
          },
        ],
        translation: "Cela fait plusieurs années que je ne l’ai pas vu.",
      },
    ],
  },
  {
    id: "sobireru",
    pattern: "〜そびれる",
    jlptLevel: "N2",
    meaning: "Manquer l’occasion de ~",
    rule: "Verbe (ます形) + そびれる",
    usage: "Pour exprimer qu'on a manqué le moment opportun pour faire quelque chose, souvent avec regret.",
    examples: [
      {
        segments: [
          {
            text: "言",
            reading: "い",
          },
          {
            text: "いそびれて",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "まだ",
          },
          {
            text: "本当",
            reading: "ほんとう",
          },
          {
            text: "のことを",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "していません。",
          },
        ],
        translation: "J’ai manqué l’occasion de le dire, je n’ai toujours pas dit la vérité.",
      },
      {
        segments: [
          {
            text: "電車",
            reading: "でんしゃ",
          },
          {
            text: "の",
          },
          {
            text: "中",
            reading: "なか",
          },
          {
            text: "で",
          },
          {
            text: "寝",
            reading: "ね",
          },
          {
            text: "てしまい、",
          },
          {
            text: "降",
            reading: "お",
          },
          {
            text: "りそびれました",
            highlight: true,
          },
          {
            text: "。",
          },
        ],
        translation: "Je me suis endormi dans le train et j’ai manqué l’occasion de descendre.",
      },
    ],
  },
  {
    id: "ippentou",
    pattern: "〜一辺倒",
    patternSegments: [
      { text: "〜" },
      { text: "一辺倒", reading: "いっぺんとう" },
    ],
    jlptLevel: "N2",
    meaning: "Entièrement tourné vers ~ (exclusif)",
    rule: "Nom + 一辺倒",
    usage: "Pour exprimer qu'une attitude ou une politique se concentre exclusivement sur un seul aspect, souvent avec une nuance critique.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "意見",
            reading: "いけん",
          },
          {
            text: "は",
          },
          {
            text: "批判",
            reading: "ひはん",
          },
          {
            text: "一辺倒",
            reading: "いっぺんとう",
            highlight: true,
          },
          {
            text: "です。",
          },
        ],
        translation: "Son avis n’est que critique, rien d’autre.",
      },
      {
        segments: [
          {
            text: "輸出",
            reading: "ゆしゅつ",
          },
          {
            text: "一辺倒",
            reading: "いっぺんとう",
            highlight: true,
          },
          {
            text: "の",
          },
          {
            text: "政策",
            reading: "せいさく",
          },
          {
            text: "は",
          },
          {
            text: "見直",
            reading: "みなお",
          },
          {
            text: "されるべきです。",
          },
        ],
        translation: "Une politique tournée exclusivement vers l’exportation devrait être révisée.",
      },
    ],
  },
  {
    id: "ikan-ni-kakawarazu",
    pattern: "〜いかんにかかわらず",
    jlptLevel: "N2",
    meaning: "Indépendamment de ~ (quel que soit)",
    rule: "Nom(+の) + いかんにかかわらず",
    usage: "Pour exprimer qu'un résultat ou une règle s'applique quelle que soit la nature ou le contenu d'une condition.",
    examples: [
      {
        segments: [
          {
            text: "理由",
            reading: "りゆう",
          },
          {
            text: "の",
          },
          {
            text: "いかんにかかわらず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "遅刻",
            reading: "ちこく",
          },
          {
            text: "は",
          },
          {
            text: "遅刻",
            reading: "ちこく",
          },
          {
            text: "です。",
          },
        ],
        translation: "Quelle que soit la raison, un retard reste un retard.",
      },
      {
        segments: [
          {
            text: "結果",
            reading: "けっか",
          },
          {
            text: "の",
          },
          {
            text: "いかんにかかわらず",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "参加",
            reading: "さんか",
          },
          {
            text: "することに",
          },
          {
            text: "意義",
            reading: "いぎ",
          },
          {
            text: "があります。",
          },
        ],
        translation: "Indépendamment du résultat, participer a une valeur en soi.",
      },
    ],
  },
  {
    id: "sarugamama",
    pattern: "〜がまま",
    jlptLevel: "N2",
    meaning: "Tel quel, sans résister à ~",
    rule: "Verbe (れる・られる形) + がまま",
    usage: "Pour exprimer qu'on subit une action de façon passive, sans opposer de résistance ni de volonté propre.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "言",
            reading: "い",
          },
          {
            text: "われるがまま",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "をしました。",
          },
        ],
        translation: "Il a fait le travail exactement comme on le lui disait, sans discuter.",
      },
      {
        segments: [
          {
            text: "足",
            reading: "あし",
          },
          {
            text: "の",
          },
          {
            text: "向",
            reading: "む",
          },
          {
            text: "くがまま",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "街",
            reading: "まち",
          },
          {
            text: "を",
          },
          {
            text: "歩",
            reading: "ある",
          },
          {
            text: "きました。",
          },
        ],
        translation: "J’ai marché dans la ville, laissant mes pas me guider.",
      },
    ],
  },
  {
    id: "gurainara",
    pattern: "〜ぐらいなら",
    jlptLevel: "N2",
    meaning: "Plutôt que de ~ (option jugée pire)",
    rule: "Verbe (辞書形) + ぐらいなら",
    usage: "Pour exprimer un rejet fort d'une option en la comparant à une alternative jugée préférable, même désagréable.",
    examples: [
      {
        segments: [
          {
            text: "謝",
            reading: "あやま",
          },
          {
            text: "るぐらいなら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "死",
            reading: "し",
          },
          {
            text: "んだ",
          },
          {
            text: "方",
            reading: "ほう",
          },
          {
            text: "がましだ。",
          },
        ],
        translation: "Plutôt que de m’excuser, je préférerais mourir.",
      },
      {
        segments: [
          {
            text: "あんな",
          },
          {
            text: "人",
            reading: "ひと",
          },
          {
            text: "に",
          },
          {
            text: "頼",
            reading: "たよ",
          },
          {
            text: "るぐらいなら",
            highlight: true,
          },
          {
            text: "、",
          },
          {
            text: "自分",
            reading: "じぶん",
          },
          {
            text: "でやります。",
          },
        ],
        translation: "Plutôt que de compter sur une personne pareille, je le ferai moi-même.",
      },
    ],
  },
  {
    id: "kirai-ga-aru",
    pattern: "〜きらいがある",
    jlptLevel: "N1",
    meaning: "Avoir tendance à ~ (défaut, aspect négatif)",
    rule: "Verbe (forme dictionnaire) / Nom + の + きらいがある",
    usage: "Pour indiquer une tendance regrettable ou un défaut de caractère récurrent chez quelqu'un ou quelque chose.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "物事",
            reading: "ものごと",
          },
          {
            text: "を",
          },
          {
            text: "悲観的",
            reading: "ひかんてき",
          },
          {
            text: "に",
          },
          {
            text: "考",
            reading: "かんが",
          },
          {
            text: "える",
          },
          {
            text: "きらいがある。",
            highlight: true,
          },
        ],
        translation: "Il a tendance à voir les choses de façon pessimiste.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "データ",
          },
          {
            text: "は",
          },
          {
            text: "古",
            reading: "ふる",
          },
          {
            text: "い",
          },
          {
            text: "情報",
            reading: "じょうほう",
          },
          {
            text: "に",
          },
          {
            text: "偏",
            reading: "かたよ",
          },
          {
            text: "る",
          },
          {
            text: "きらいがある。",
            highlight: true,
          },
        ],
        translation: "Ces données ont tendance à privilégier des informations anciennes.",
      },
    ],
  },
  {
    id: "gotoshi",
    pattern: "〜ごとし／〜ごとく／〜ごとき",
    jlptLevel: "N1",
    meaning: "Comme, tel que ~ (littéraire)",
    rule: "Nom + の + ごとし／ごとく／ごとき",
    usage: "Registre très soutenu et littéraire, équivalent classique de 〜のようだ／〜ような.",
    examples: [
      {
        segments: [
          {
            text: "光陰",
            reading: "こういん",
          },
          {
            text: "矢",
            reading: "や",
          },
          {
            text: "の",
          },
          {
            text: "ごとし。",
            highlight: true,
          },
        ],
        translation: "Le temps passe comme une flèche.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "稲妻",
            reading: "いなずま",
          },
          {
            text: "の",
          },
          {
            text: "ごとく",
            highlight: true,
          },
          {
            text: "去",
            reading: "さ",
          },
          {
            text: "っていった。",
          },
        ],
        translation: "Il est parti comme un éclair.",
      },
    ],
  },
  {
    id: "sanagara",
    pattern: "〜さながら",
    jlptLevel: "N1",
    meaning: "Tout comme, exactement comme ~",
    rule: "さながら + Nom / Nom + さながらだ",
    usage: "Pour comparer une situation à quelque chose d'autre de façon vive et imagée, proche de まるで.",
    examples: [
      {
        segments: [
          {
            text: "会場",
            reading: "かいじょう",
          },
          {
            text: "は",
          },
          {
            text: "さながら",
            highlight: true,
          },
          {
            text: "戦場",
            reading: "せんじょう",
          },
          {
            text: "のようだった。",
          },
        ],
        translation: "La salle ressemblait littéralement à un champ de bataille.",
      },
      {
        segments: [
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "の",
          },
          {
            text: "演技",
            reading: "えんぎ",
          },
          {
            text: "は",
          },
          {
            text: "さながら",
            highlight: true,
          },
          {
            text: "プロの",
          },
          {
            text: "女優",
            reading: "じょゆう",
          },
          {
            text: "だった。",
          },
        ],
        translation: "Son jeu d'actrice était exactement celui d'une professionnelle.",
      },
    ],
  },
  {
    id: "ja-arumaishi",
    pattern: "〜じゃあるまいし",
    jlptLevel: "N1",
    meaning: "Ce n'est pas comme si ~ (reproche)",
    rule: "Nom + じゃあるまいし",
    usage: "Pour souligner, avec une nuance de reproche ou de moquerie, qu'une situation évidente ne justifie pas un comportement.",
    examples: [
      {
        segments: [
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "じゃあるまいし、",
            highlight: true,
          },
          {
            text: "そんなことで",
          },
          {
            text: "泣",
            reading: "な",
          },
          {
            text: "かないでよ。",
          },
        ],
        translation: "Tu n'es pas un enfant, ne pleure pas pour ça.",
      },
      {
        segments: [
          {
            text: "プロ",
          },
          {
            text: "じゃあるまいし、",
            highlight: true,
          },
          {
            text: "完璧",
            reading: "かんぺき",
          },
          {
            text: "にできるわけがない。",
          },
        ],
        translation: "On n'est pas des professionnels, on ne peut pas le faire parfaitement.",
      },
    ],
  },
  {
    id: "dani",
    pattern: "〜だに",
    jlptLevel: "N1",
    meaning: "Même (pas) ~, rien que ~ suffit à",
    rule: "Verbe (forme dictionnaire) / Nom + だに",
    usage: "Pour souligner qu'une simple pensée ou évocation suffit à provoquer une réaction forte, souvent avec une négation.",
    examples: [
      {
        segments: [
          {
            text: "想像",
            reading: "そうぞう",
          },
          {
            text: "する",
          },
          {
            text: "だに",
            highlight: true,
          },
          {
            text: "恐",
            reading: "おそ",
          },
          {
            text: "ろしい。",
          },
        ],
        translation: "Rien que d'y penser, c'est terrifiant.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "が",
          },
          {
            text: "失敗",
            reading: "しっぱい",
          },
          {
            text: "するとは",
          },
          {
            text: "夢",
            reading: "ゆめ",
          },
          {
            text: "に",
          },
          {
            text: "だに",
            highlight: true,
          },
          {
            text: "思",
            reading: "おも",
          },
          {
            text: "わなかった。",
          },
        ],
        translation: "Je n'aurais jamais imaginé, même en rêve, qu'il échouerait.",
      },
    ],
  },
  {
    id: "tatokorode",
    pattern: "〜たところで",
    jlptLevel: "N1",
    meaning: "Même si ~ (ça ne changera rien)",
    rule: "Verbe (forme た) + ところで",
    usage: "Pour indiquer que même si l'action se réalise, le résultat espéré n'en découlera pas — souvent suivi d'une négation.",
    examples: [
      {
        segments: [
          {
            text: "今",
            reading: "いま",
          },
          {
            text: "から",
          },
          {
            text: "急",
            reading: "いそ",
          },
          {
            text: "いだ",
          },
          {
            text: "ところで、",
            highlight: true,
          },
          {
            text: "間",
            reading: "ま",
          },
          {
            text: "に",
          },
          {
            text: "合",
            reading: "あ",
          },
          {
            text: "わないだろう。",
          },
        ],
        translation: "Même si on se dépêche maintenant, on n'arrivera sans doute pas à temps.",
      },
      {
        segments: [
          {
            text: "いくら",
          },
          {
            text: "謝",
            reading: "あやま",
          },
          {
            text: "った",
          },
          {
            text: "ところで、",
            highlight: true,
          },
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "許",
            reading: "ゆる",
          },
          {
            text: "してくれないだろう。",
          },
        ],
        translation: "Même si je m'excuse tant que je veux, elle ne me pardonnera probablement pas.",
      },
    ],
  },
  {
    id: "tsu-tsu",
    pattern: "〜つ〜つ",
    jlptLevel: "N1",
    meaning: "Tantôt ~, tantôt ~ (alternance)",
    rule: "Verbe (base ます) + つ + Verbe antonyme (base ます) + つ",
    usage: "Pour décrire une action qui alterne entre deux états opposés, forme figée et littéraire.",
    examples: [
      {
        segments: [
          {
            text: "二人",
            reading: "ふたり",
          },
          {
            text: "は",
          },
          {
            text: "行",
            reading: "い",
          },
          {
            text: "きつ",
            highlight: true,
          },
          {
            text: "戻",
            reading: "もど",
          },
          {
            text: "りつ",
            highlight: true,
          },
          {
            text: "しながら",
          },
          {
            text: "話",
            reading: "はな",
          },
          {
            text: "し",
          },
          {
            text: "合",
            reading: "あ",
          },
          {
            text: "った。",
          },
        ],
        translation: "Les deux discutaient en allant et venant.",
      },
      {
        segments: [
          {
            text: "川",
            reading: "かわ",
          },
          {
            text: "の",
          },
          {
            text: "水",
            reading: "みず",
          },
          {
            text: "は",
          },
          {
            text: "浮",
            reading: "う",
          },
          {
            text: "きつ",
            highlight: true,
          },
          {
            text: "沈",
            reading: "しず",
          },
          {
            text: "みつ",
            highlight: true,
          },
          {
            text: "流",
            reading: "なが",
          },
          {
            text: "れていった。",
          },
        ],
        translation: "L'eau de la rivière s'écoulait en flottant et en coulant tour à tour.",
      },
    ],
  },
  {
    id: "de-are-de-are",
    pattern: "〜であれ〜であれ",
    jlptLevel: "N1",
    meaning: "Que ce soit ~ ou ~",
    rule: "Nom + であれ + Nom + であれ",
    usage: "Pour indiquer que, quel que soit le cas parmi plusieurs alternatives citées, la conclusion reste la même.",
    examples: [
      {
        segments: [
          {
            text: "晴",
            reading: "は",
          },
          {
            text: "れ",
          },
          {
            text: "であれ",
            highlight: true,
          },
          {
            text: "雨",
            reading: "あめ",
          },
          {
            text: "であれ、",
            highlight: true,
          },
          {
            text: "試合",
            reading: "しあい",
          },
          {
            text: "は",
          },
          {
            text: "行",
            reading: "おこな",
          },
          {
            text: "われる。",
          },
        ],
        translation: "Qu'il pleuve ou qu'il fasse beau, le match aura lieu.",
      },
      {
        segments: [
          {
            text: "大人",
            reading: "おとな",
          },
          {
            text: "であれ",
            highlight: true,
          },
          {
            text: "子供",
            reading: "こども",
          },
          {
            text: "であれ、",
            highlight: true,
          },
          {
            text: "ルールを",
          },
          {
            text: "守",
            reading: "まも",
          },
          {
            text: "るべきだ。",
          },
        ],
        translation: "Que l'on soit adulte ou enfant, il faut respecter les règles.",
      },
    ],
  },
  {
    id: "to-ii-to-ii",
    pattern: "〜といい〜といい",
    jlptLevel: "N1",
    meaning: "Aussi bien ~ que ~",
    rule: "Nom + といい + Nom + といい",
    usage: "Pour donner deux exemples représentatifs qui illustrent tous les deux la même caractéristique générale.",
    examples: [
      {
        segments: [
          {
            text: "色",
            reading: "いろ",
          },
          {
            text: "といい",
            highlight: true,
          },
          {
            text: "デザイン",
          },
          {
            text: "といい、",
            highlight: true,
          },
          {
            text: "この",
          },
          {
            text: "バッグは",
          },
          {
            text: "完璧",
            reading: "かんぺき",
          },
          {
            text: "だ。",
          },
        ],
        translation: "Aussi bien la couleur que le design, ce sac est parfait.",
      },
      {
        segments: [
          {
            text: "味",
            reading: "あじ",
          },
          {
            text: "といい",
            highlight: true,
          },
          {
            text: "値段",
            reading: "ねだん",
          },
          {
            text: "といい、",
            highlight: true,
          },
          {
            text: "この",
          },
          {
            text: "店",
            reading: "みせ",
          },
          {
            text: "は",
          },
          {
            text: "文句",
            reading: "もんく",
          },
          {
            text: "なしだ。",
          },
        ],
        translation: "Le goût comme le prix, ce restaurant est irréprochable.",
      },
    ],
  },
  {
    id: "to-obooshiki",
    pattern: "〜とおぼしき",
    jlptLevel: "N1",
    meaning: "Qui semble être ~, apparemment ~",
    rule: "Nom + とおぼしき + Nom",
    usage: "Registre littéraire pour qualifier un nom en indiquant qu'il semble correspondre à une catégorie, d'après les apparences.",
    examples: [
      {
        segments: [
          {
            text: "犯人",
            reading: "はんにん",
          },
          {
            text: "とおぼしき",
            highlight: true,
          },
          {
            text: "人物",
            reading: "じんぶつ",
          },
          {
            text: "が",
          },
          {
            text: "現場",
            reading: "げんば",
          },
          {
            text: "から",
          },
          {
            text: "走",
            reading: "はし",
          },
          {
            text: "り",
          },
          {
            text: "去",
            reading: "さ",
          },
          {
            text: "った。",
          },
        ],
        translation: "Une personne qui semblait être le coupable s'est enfuie des lieux en courant.",
      },
      {
        segments: [
          {
            text: "二十歳",
            reading: "はたち",
          },
          {
            text: "前後",
            reading: "ぜんご",
          },
          {
            text: "とおぼしき",
            highlight: true,
          },
          {
            text: "女性",
            reading: "じょせい",
          },
          {
            text: "が",
          },
          {
            text: "受付",
            reading: "うけつけ",
          },
          {
            text: "にいた。",
          },
        ],
        translation: "Une femme qui semblait avoir environ vingt ans se trouvait à l'accueil.",
      },
    ],
  },
  {
    id: "ni-itaru",
    pattern: "〜に至る",
    patternSegments: [
      { text: "〜" },
      { text: "に" },
      { text: "至", reading: "いた" },
      { text: "る" },
    ],
    jlptLevel: "N1",
    meaning: "En arriver à ~, aboutir à ~",
    rule: "Nom / Verbe (forme dictionnaire) + に至る",
    usage: "Pour indiquer qu'un long processus ou une évolution aboutit finalement à un état, souvent extrême.",
    examples: [
      {
        segments: [
          {
            text: "長",
            reading: "なが",
          },
          {
            text: "い",
          },
          {
            text: "議論",
            reading: "ぎろん",
          },
          {
            text: "の",
          },
          {
            text: "末",
            reading: "すえ",
          },
          {
            text: "、",
          },
          {
            text: "ようやく",
          },
          {
            text: "合意",
            reading: "ごうい",
          },
          {
            text: "に",
          },
          {
            text: "至",
            reading: "いた",
          },
          {
            text: "った。",
            highlight: true,
          },
        ],
        translation: "Après une longue discussion, on est finalement parvenu à un accord.",
      },
      {
        segments: [
          {
            text: "病状",
            reading: "びょうじょう",
          },
          {
            text: "が",
          },
          {
            text: "悪化",
            reading: "あっか",
          },
          {
            text: "し、",
          },
          {
            text: "入院",
            reading: "にゅういん",
          },
          {
            text: "する",
          },
          {
            text: "に",
          },
          {
            text: "至",
            reading: "いた",
          },
          {
            text: "った。",
            highlight: true,
          },
        ],
        translation: "Son état s'est aggravé au point de nécessiter une hospitalisation.",
      },
    ],
  },
  {
    id: "ni-atte",
    pattern: "〜にあって",
    jlptLevel: "N1",
    meaning: "Dans ces circonstances, en cette occasion",
    rule: "Nom + にあって",
    usage: "Registre soutenu pour situer une action ou un état dans un contexte ou une circonstance particulière, souvent difficile.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "非常事態",
            reading: "ひじょうじたい",
          },
          {
            text: "にあって、",
            highlight: true,
          },
          {
            text: "冷静",
            reading: "れいせい",
          },
          {
            text: "さを",
          },
          {
            text: "保",
            reading: "たも",
          },
          {
            text: "つのは",
          },
          {
            text: "難",
            reading: "むずか",
          },
          {
            text: "しい。",
          },
        ],
        translation: "Dans cette situation d'urgence, il est difficile de garder son calme.",
      },
      {
        segments: [
          {
            text: "現代",
            reading: "げんだい",
          },
          {
            text: "社会",
            reading: "しゃかい",
          },
          {
            text: "にあっては、",
            highlight: true,
          },
          {
            text: "情報",
            reading: "じょうほう",
          },
          {
            text: "の",
          },
          {
            text: "取捨選択",
            reading: "しゅしゃせんたく",
          },
          {
            text: "が",
          },
          {
            text: "重要",
            reading: "じゅうよう",
          },
          {
            text: "だ。",
          },
        ],
        translation: "Dans la société actuelle, savoir trier l'information est important.",
      },
    ],
  },
  {
    id: "ni-kakawaru",
    pattern: "〜にかかわる",
    jlptLevel: "N1",
    meaning: "Être en jeu, concerner (vitalement)",
    rule: "Nom + にかかわる",
    usage: "Pour indiquer qu'une chose est liée de façon vitale ou sérieuse à un enjeu important, comme la vie, l'honneur ou la réputation.",
    examples: [
      {
        segments: [
          {
            text: "これは",
          },
          {
            text: "命",
            reading: "いのち",
          },
          {
            text: "にかかわる",
            highlight: true,
          },
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "だ。",
          },
        ],
        translation: "C'est une question qui met la vie en jeu.",
      },
      {
        segments: [
          {
            text: "会社",
            reading: "かいしゃ",
          },
          {
            text: "の",
          },
          {
            text: "信用",
            reading: "しんよう",
          },
          {
            text: "にかかわる",
            highlight: true,
          },
          {
            text: "ことなので、",
          },
          {
            text: "慎重",
            reading: "しんちょう",
          },
          {
            text: "に",
          },
          {
            text: "対応",
            reading: "たいおう",
          },
          {
            text: "した。",
          },
        ],
        translation: "Comme cela concernait la réputation de l'entreprise, on a agi avec prudence.",
      },
    ],
  },
  {
    id: "ni-kangamite",
    pattern: "〜にかんがみて",
    jlptLevel: "N1",
    meaning: "Compte tenu de ~, à la lumière de ~",
    rule: "Nom + にかんがみて",
    usage: "Pour indiquer qu'une décision ou un jugement est pris en tenant compte d'un précédent, d'une situation ou d'une expérience passée.",
    examples: [
      {
        segments: [
          {
            text: "過去",
            reading: "かこ",
          },
          {
            text: "の",
          },
          {
            text: "失敗",
            reading: "しっぱい",
          },
          {
            text: "にかんがみて、",
            highlight: true,
          },
          {
            text: "新",
            reading: "あたら",
          },
          {
            text: "しい",
          },
          {
            text: "対策",
            reading: "たいさく",
          },
          {
            text: "を",
          },
          {
            text: "立",
            reading: "た",
          },
          {
            text: "てた。",
          },
        ],
        translation: "Compte tenu des échecs passés, on a établi de nouvelles mesures.",
      },
      {
        segments: [
          {
            text: "現状",
            reading: "げんじょう",
          },
          {
            text: "にかんがみて、",
            highlight: true,
          },
          {
            text: "計画",
            reading: "けいかく",
          },
          {
            text: "を",
          },
          {
            text: "見直",
            reading: "みなお",
          },
          {
            text: "すことにした。",
          },
        ],
        translation: "À la lumière de la situation actuelle, on a décidé de revoir le plan.",
      },
    ],
  },
  {
    id: "ni-yorazu",
    pattern: "〜によらず",
    jlptLevel: "N1",
    meaning: "Indépendamment de ~, quel que soit ~",
    rule: "Nom + によらず",
    usage: "Pour indiquer qu'un fait reste vrai indépendamment d'un facteur donné (âge, origine, apparence...).",
    examples: [
      {
        segments: [
          {
            text: "年齢",
            reading: "ねんれい",
          },
          {
            text: "によらず、",
            highlight: true,
          },
          {
            text: "誰",
            reading: "だれ",
          },
          {
            text: "でも",
          },
          {
            text: "参加",
            reading: "さんか",
          },
          {
            text: "できます。",
          },
        ],
        translation: "Indépendamment de l'âge, tout le monde peut participer.",
      },
      {
        segments: [
          {
            text: "見",
            reading: "み",
          },
          {
            text: "かけ",
          },
          {
            text: "によらず、",
            highlight: true,
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "とても",
          },
          {
            text: "優",
            reading: "やさ",
          },
          {
            text: "しい",
          },
          {
            text: "人",
            reading: "ひと",
          },
          {
            text: "だ。",
          },
        ],
        translation: "Contrairement aux apparences, c'est quelqu'un de très gentil.",
      },
    ],
  },
  {
    id: "hitori-nominarazu",
    pattern: "〜ひとり〜のみならず",
    jlptLevel: "N1",
    meaning: "Pas seulement ~, mais aussi ~ (emphatique)",
    rule: "ひとり + Nom + のみならず",
    usage: "Version emphatique et littéraire de 〜だけでなく, pour souligner qu'un phénomène dépasse largement le seul élément cité.",
    examples: [
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "問題",
            reading: "もんだい",
          },
          {
            text: "は",
          },
          {
            text: "ひとり",
            highlight: true,
          },
          {
            text: "日本",
            reading: "にほん",
          },
          {
            text: "のみならず、",
            highlight: true,
          },
          {
            text: "世界中",
            reading: "せかいじゅう",
          },
          {
            text: "で",
          },
          {
            text: "起",
            reading: "お",
          },
          {
            text: "きている。",
          },
        ],
        translation: "Ce problème ne concerne pas seulement le Japon, mais se produit dans le monde entier.",
      },
      {
        segments: [
          {
            text: "被害",
            reading: "ひがい",
          },
          {
            text: "は",
          },
          {
            text: "ひとり",
            highlight: true,
          },
          {
            text: "住民",
            reading: "じゅうみん",
          },
          {
            text: "のみならず、",
            highlight: true,
          },
          {
            text: "周辺",
            reading: "しゅうへん",
          },
          {
            text: "地域",
            reading: "ちいき",
          },
          {
            text: "全体",
            reading: "ぜんたい",
          },
          {
            text: "に",
          },
          {
            text: "及",
            reading: "およ",
          },
          {
            text: "んだ。",
          },
        ],
        translation: "Les dégâts n'ont pas touché que les habitants, mais toute la région environnante.",
      },
    ],
  },
  {
    id: "bekarazaru",
    pattern: "〜べからざる",
    jlptLevel: "N1",
    meaning: "Qu'on ne doit pas ~ (forme attributive)",
    rule: "Verbe (forme dictionnaire) + べからざる + Nom",
    usage: "Forme attributive, très soutenue, de 〜べからず, pour qualifier un nom en indiquant que l'action est absolument interdite ou inacceptable.",
    examples: [
      {
        segments: [
          {
            text: "それは",
          },
          {
            text: "許",
            reading: "ゆる",
          },
          {
            text: "す",
          },
          {
            text: "べからざる",
            highlight: true,
          },
          {
            text: "行為",
            reading: "こうい",
          },
          {
            text: "だ。",
          },
        ],
        translation: "C'est un acte qu'on ne saurait pardonner.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "発言",
            reading: "はつげん",
          },
          {
            text: "は",
          },
          {
            text: "聞",
            reading: "き",
          },
          {
            text: "く",
          },
          {
            text: "べからざる",
            highlight: true,
          },
          {
            text: "暴言",
            reading: "ぼうげん",
          },
          {
            text: "だった。",
          },
        ],
        translation: "Ses propos étaient des paroles injurieuses qu'on ne devrait pas entendre.",
      },
    ],
  },
  {
    id: "made-da",
    pattern: "〜までだ／〜までのことだ",
    jlptLevel: "N1",
    meaning: "Il suffira de ~, je n'aurai qu'à ~",
    rule: "Verbe (forme dictionnaire／た) + までだ／までのことだ",
    usage: "Pour exprimer qu'en cas d'échec d'une option, on se contentera simplement d'une solution de repli, sans grande inquiétude.",
    examples: [
      {
        segments: [
          {
            text: "断",
            reading: "ことわ",
          },
          {
            text: "られたら、",
          },
          {
            text: "また",
          },
          {
            text: "頼",
            reading: "たの",
          },
          {
            text: "む",
          },
          {
            text: "までだ。",
            highlight: true,
          },
        ],
        translation: "Si on me refuse, il me suffira de redemander.",
      },
      {
        segments: [
          {
            text: "ダメなら",
          },
          {
            text: "諦",
            reading: "あきら",
          },
          {
            text: "める",
          },
          {
            text: "までのことだ。",
            highlight: true,
          },
        ],
        translation: "Si ça ne marche pas, je n'aurai qu'à abandonner.",
      },
    ],
  },
  {
    id: "ngatame-ni",
    pattern: "〜んがため(に)",
    jlptLevel: "N1",
    meaning: "Afin de ~ (littéraire, volonté forte)",
    rule: "Verbe (base ない, sans ない) + んがため(に)",
    usage: "Registre très soutenu et littéraire, équivalent de 〜するために, pour exprimer un but poursuivi avec détermination.",
    examples: [
      {
        segments: [
          {
            text: "生",
            reading: "い",
          },
          {
            text: "きんがために、",
            highlight: true,
          },
          {
            text: "必死",
            reading: "ひっし",
          },
          {
            text: "で",
          },
          {
            text: "働",
            reading: "はたら",
          },
          {
            text: "いた。",
          },
        ],
        translation: "On a travaillé avec acharnement afin de survivre.",
      },
      {
        segments: [
          {
            text: "夢",
            reading: "ゆめ",
          },
          {
            text: "を",
          },
          {
            text: "叶",
            reading: "かな",
          },
          {
            text: "えんがため、",
            highlight: true,
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "全",
            reading: "すべ",
          },
          {
            text: "てを",
          },
          {
            text: "犠牲",
            reading: "ぎせい",
          },
          {
            text: "にした。",
          },
        ],
        translation: "Afin de réaliser son rêve, il a tout sacrifié.",
      },
    ],
  },
  {
    id: "arokotoka",
    pattern: "〜あろうことか",
    jlptLevel: "N1",
    meaning: "Incroyablement, on n'ose y croire, mais ~",
    rule: "あろうことか + phrase (fait choquant)",
    usage: "Pour introduire un fait choquant ou scandaleux, en soulignant l'incrédulité du locuteur.",
    examples: [
      {
        segments: [
          {
            text: "あろうことか、",
            highlight: true,
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "約束",
            reading: "やくそく",
          },
          {
            text: "をすっかり",
          },
          {
            text: "忘",
            reading: "わす",
          },
          {
            text: "れていた。",
          },
        ],
        translation: "Incroyable mais vrai, il avait complètement oublié sa promesse.",
      },
      {
        segments: [
          {
            text: "あろうことか、",
            highlight: true,
          },
          {
            text: "犯人",
            reading: "はんにん",
          },
          {
            text: "は",
          },
          {
            text: "被害者",
            reading: "ひがいしゃ",
          },
          {
            text: "の",
          },
          {
            text: "親友",
            reading: "しんゆう",
          },
          {
            text: "だった。",
          },
        ],
        translation: "On n'ose y croire, mais le coupable était le meilleur ami de la victime.",
      },
    ],
  },
  {
    id: "zuniwa-sumanai",
    pattern: "〜ずには済まない",
    patternSegments: [
      { text: "〜" },
      { text: "ずには" },
      { text: "済", reading: "す" },
      { text: "まない" },
    ],
    jlptLevel: "N1",
    meaning: "Ne pas pouvoir s'en tirer sans ~, être inévitablement contraint de ~",
    rule: "Verbe (forme ない, sans ない) + ずには済まない",
    usage: "Pour indiquer qu'une situation rend une action inévitable — on ne peut pas s'en sortir sans la faire.",
    examples: [
      {
        segments: [
          {
            text: "これだけ",
          },
          {
            text: "迷惑",
            reading: "めいわく",
          },
          {
            text: "をかけたのだから、",
          },
          {
            text: "謝",
            reading: "あやま",
          },
          {
            text: "らずには",
          },
          {
            text: "済",
            reading: "す",
          },
          {
            text: "まない。",
            highlight: true,
          },
        ],
        translation: "Vu le dérangement causé, on ne peut pas s'en tirer sans s'excuser.",
      },
      {
        segments: [
          {
            text: "証拠",
            reading: "しょうこ",
          },
          {
            text: "が",
          },
          {
            text: "揃",
            reading: "そろ",
          },
          {
            text: "った",
          },
          {
            text: "以上",
            reading: "いじょう",
          },
          {
            text: "、",
          },
          {
            text: "罰",
            reading: "ばっ",
          },
          {
            text: "せられずには",
          },
          {
            text: "済",
            reading: "す",
          },
          {
            text: "まないだろう。",
            highlight: true,
          },
        ],
        translation: "Maintenant que les preuves sont réunies, il ne pourra pas échapper à une sanction.",
      },
    ],
  },
  {
    id: "no-nanotte",
    pattern: "〜のなんのって",
    jlptLevel: "N1",
    meaning: "On ne peut pas dire à quel point ~ ! (emphatique, familier)",
    rule: "Adjectif／Verbe (forme dictionnaire) + のなんのって",
    usage: "Registre familier et emphatique pour souligner l'intensité extrême d'un état, souvent avec une nuance ironique ou amusée.",
    examples: [
      {
        segments: [
          {
            text: "疲",
            reading: "つか",
          },
          {
            text: "れた",
          },
          {
            text: "のなんのって、",
            highlight: true,
          },
          {
            text: "もう",
          },
          {
            text: "動",
            reading: "うご",
          },
          {
            text: "けないくらいだった。",
          },
        ],
        translation: "Fatigué, on ne peut pas dire à quel point ! On ne pouvait plus bouger.",
      },
      {
        segments: [
          {
            text: "あの",
          },
          {
            text: "店",
            reading: "みせ",
          },
          {
            text: "の",
          },
          {
            text: "店員",
            reading: "てんいん",
          },
          {
            text: "は",
          },
          {
            text: "態度",
            reading: "たいど",
          },
          {
            text: "が",
          },
          {
            text: "悪",
            reading: "わる",
          },
          {
            text: "い",
          },
          {
            text: "のなんのって、",
            highlight: true,
          },
          {
            text: "驚",
            reading: "おどろ",
          },
          {
            text: "いた。",
          },
        ],
        translation: "Le personnel de ce magasin était d'une impolitesse incroyable, ça nous a choqués.",
      },
    ],
  },
  {
    id: "mo-jisanai",
    pattern: "〜も辞さない",
    patternSegments: [
      { text: "〜" },
      { text: "も" },
      { text: "辞", reading: "じ" },
      { text: "さない" },
    ],
    jlptLevel: "N1",
    meaning: "Être prêt à aller jusqu'à ~, ne pas reculer devant ~",
    rule: "Nom／Verbe (forme dictionnaire + こと) + も辞さない",
    usage: "Pour exprimer une détermination forte : on est prêt à accepter même une option extrême pour atteindre son but.",
    examples: [
      {
        segments: [
          {
            text: "会社",
            reading: "かいしゃ",
          },
          {
            text: "は",
          },
          {
            text: "法的",
            reading: "ほうてき",
          },
          {
            text: "措置",
            reading: "そち",
          },
          {
            text: "も",
          },
          {
            text: "辞",
            reading: "じ",
          },
          {
            text: "さない",
            highlight: true,
          },
          {
            text: "構",
            reading: "かま",
          },
          {
            text: "えだ。",
          },
        ],
        translation: "L'entreprise est prête à aller jusqu'à des poursuites judiciaires.",
      },
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "辞職",
            reading: "じしょく",
          },
          {
            text: "も",
          },
          {
            text: "辞",
            reading: "じ",
          },
          {
            text: "さない",
            highlight: true,
          },
          {
            text: "覚悟",
            reading: "かくご",
          },
          {
            text: "でその",
          },
          {
            text: "件",
            reading: "けん",
          },
          {
            text: "に",
          },
          {
            text: "取",
            reading: "と",
          },
          {
            text: "り",
          },
          {
            text: "組",
            reading: "く",
          },
          {
            text: "んだ。",
          },
        ],
        translation: "Il s'est attaqué à cette affaire avec la détermination d'aller jusqu'à démissionner s'il le fallait.",
      },
    ],
  },
  {
    id: "wo-oshite",
    pattern: "〜をおして",
    jlptLevel: "N1",
    meaning: "En dépit de ~, malgré ~ (en forçant)",
    rule: "Nom + をおして",
    usage: "Pour indiquer qu'une action est accomplie en surmontant un obstacle ou une difficulté importante, avec une nuance de détermination.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "は",
          },
          {
            text: "病気",
            reading: "びょうき",
          },
          {
            text: "をおして",
            highlight: true,
          },
          {
            text: "仕事",
            reading: "しごと",
          },
          {
            text: "を",
          },
          {
            text: "続",
            reading: "つづ",
          },
          {
            text: "けた。",
          },
        ],
        translation: "Il a continué à travailler malgré sa maladie.",
      },
      {
        segments: [
          {
            text: "反対",
            reading: "はんたい",
          },
          {
            text: "をおして、",
            highlight: true,
          },
          {
            text: "彼女",
            reading: "かのじょ",
          },
          {
            text: "は",
          },
          {
            text: "計画",
            reading: "けいかく",
          },
          {
            text: "を",
          },
          {
            text: "実行",
            reading: "じっこう",
          },
          {
            text: "した。",
          },
        ],
        translation: "Malgré l'opposition, elle a mis son projet à exécution.",
      },
    ],
  },
  {
    id: "nto-suru",
    pattern: "〜んとする",
    jlptLevel: "N1",
    meaning: "Être sur le point de ~, chercher à ~ (littéraire)",
    rule: "Verbe (base ない, sans ない) + んとする",
    usage: "Registre très soutenu et littéraire, pour indiquer qu'un sujet est sur le point de se produire, ou qu'on cherche activement à accomplir quelque chose.",
    examples: [
      {
        segments: [
          {
            text: "太陽",
            reading: "たいよう",
          },
          {
            text: "が",
          },
          {
            text: "沈",
            reading: "しず",
          },
          {
            text: "まんとする",
            highlight: true,
          },
          {
            text: "瞬間",
            reading: "しゅんかん",
          },
          {
            text: "、",
          },
          {
            text: "空",
            reading: "そら",
          },
          {
            text: "が",
          },
          {
            text: "赤",
            reading: "あか",
          },
          {
            text: "く",
          },
          {
            text: "染",
            reading: "そ",
          },
          {
            text: "まった。",
          },
        ],
        translation: "Au moment où le soleil était sur le point de se coucher, le ciel s'est teinté de rouge.",
      },
      {
        segments: [
          {
            text: "真実",
            reading: "しんじつ",
          },
          {
            text: "を",
          },
          {
            text: "明",
            reading: "あき",
          },
          {
            text: "らかにせんとする",
            highlight: true,
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "努力",
            reading: "どりょく",
          },
          {
            text: "は",
          },
          {
            text: "実",
            reading: "み",
          },
          {
            text: "を",
          },
          {
            text: "結",
            reading: "むす",
          },
          {
            text: "んだ。",
          },
        ],
        translation: "Ses efforts pour chercher à révéler la vérité ont porté leurs fruits.",
      },
    ],
  },
  {
    id: "karashite",
    pattern: "〜からして",
    jlptLevel: "N1",
    meaning: "Rien que ~ (le premier signe suffit à juger)",
    rule: "Nom + からして",
    usage: "Pour indiquer qu'un seul exemple, souvent le plus évident, suffit déjà à porter un jugement sur l'ensemble.",
    examples: [
      {
        segments: [
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "の",
          },
          {
            text: "態度",
            reading: "たいど",
          },
          {
            text: "からして、",
            highlight: true,
          },
          {
            text: "やる",
          },
          {
            text: "気",
            reading: "き",
          },
          {
            text: "がないのは",
          },
          {
            text: "明",
            reading: "あき",
          },
          {
            text: "らかだ。",
          },
        ],
        translation: "Rien que son attitude suffit à montrer clairement qu'il n'a pas envie.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "料理",
            reading: "りょうり",
          },
          {
            text: "は",
          },
          {
            text: "見",
            reading: "み",
          },
          {
            text: "た",
          },
          {
            text: "目",
            reading: "め",
          },
          {
            text: "からして",
            highlight: true,
          },
          {
            text: "おいしそうだ。",
          },
        ],
        translation: "Rien qu'à son apparence, ce plat a déjà l'air délicieux.",
      },
    ],
  },
  {
    id: "gurai-no-mono-da",
    pattern: "〜ぐらいのものだ",
    jlptLevel: "N1",
    meaning: "Ce n'est que ~, il n'y a que ~ (limitation)",
    rule: "Nom／Verbe (forme dictionnaire) + ぐらいのものだ",
    usage: "Pour souligner que très peu de choses ou de personnes correspondent à ce qui est décrit, avec une nuance de restriction ou de dépit.",
    examples: [
      {
        segments: [
          {
            text: "こんな",
          },
          {
            text: "無茶",
            reading: "むちゃ",
          },
          {
            text: "なことをするのは",
          },
          {
            text: "彼",
            reading: "かれ",
          },
          {
            text: "ぐらいのものだ。",
            highlight: true,
          },
        ],
        translation: "Il n'y a que lui pour faire des choses aussi insensées.",
      },
      {
        segments: [
          {
            text: "この",
          },
          {
            text: "町",
            reading: "まち",
          },
          {
            text: "で",
          },
          {
            text: "残",
            reading: "のこ",
          },
          {
            text: "っている",
          },
          {
            text: "店",
            reading: "みせ",
          },
          {
            text: "は",
          },
          {
            text: "もう",
          },
          {
            text: "ここ",
          },
          {
            text: "ぐらいのものだ。",
            highlight: true,
          },
        ],
        translation: "Dans cette ville, il ne reste plus que ce magasin.",
      },
    ],
  },
  {
    id: "niwa-oyobanai",
    pattern: "〜には及ばない",
    patternSegments: [
      { text: "〜" },
      { text: "には" },
      { text: "及", reading: "およ" },
      { text: "ばない" },
    ],
    jlptLevel: "N1",
    meaning: "Il n'y a pas lieu de ~, inutile d'aller jusqu'à ~",
    rule: "Verbe (forme dictionnaire)／Nom + には及ばない",
    usage: "Pour indiquer qu'il n'est pas nécessaire d'aller jusqu'à une action ou une réaction donnée, souvent pour rassurer quelqu'un.",
    examples: [
      {
        segments: [
          {
            text: "たいした",
          },
          {
            text: "ことではないので、",
          },
          {
            text: "心配",
            reading: "しんぱい",
          },
          {
            text: "する",
          },
          {
            text: "には",
          },
          {
            text: "及",
            reading: "およ",
          },
          {
            text: "ばない。",
            highlight: true,
          },
        ],
        translation: "Ce n'est pas grand-chose, il n'y a pas lieu de s'inquiéter.",
      },
      {
        segments: [
          {
            text: "これぐらいのお",
          },
          {
            text: "礼",
            reading: "れい",
          },
          {
            text: "には",
          },
          {
            text: "及",
            reading: "およ",
          },
          {
            text: "びません。",
            highlight: true,
          },
        ],
        translation: "Ce n'était pas la peine de me remercier autant pour ça.",
      },
    ],
  },
  {
    id: "tewa-irarenai",
    pattern: "〜てはいられない",
    jlptLevel: "N1",
    meaning: "Ne pas pouvoir continuer à ~, ne pas avoir le temps de rester ~",
    rule: "Verbe (forme て) + はいられない",
    usage: "Pour indiquer que la situation ne permet pas de rester dans un état ou de continuer une action tranquillement, souvent face à l'urgence.",
    examples: [
      {
        segments: [
          {
            text: "締",
            reading: "し",
          },
          {
            text: "め",
          },
          {
            text: "切",
            reading: "き",
          },
          {
            text: "りが",
          },
          {
            text: "近",
            reading: "ちか",
          },
          {
            text: "いので、",
          },
          {
            text: "のんびりして",
            highlight: true,
          },
          {
            text: "はいられない。",
          },
        ],
        translation: "La date limite approche, on ne peut pas se permettre de traîner.",
      },
      {
        segments: [
          {
            text: "こんな",
          },
          {
            text: "状況",
            reading: "じょうきょう",
          },
          {
            text: "で",
          },
          {
            text: "じっとして",
            highlight: true,
          },
          {
            text: "はいられない。",
          },
        ],
        translation: "Dans une telle situation, on ne peut pas rester les bras croisés.",
      },
    ],
  },
]
