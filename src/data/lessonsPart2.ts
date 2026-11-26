import type { TopicLesson } from '../types/math';

export const LESSONS_PART_2: Record<number, TopicLesson> = {
  11: {
    topicId: 11,
    muammo: {
      headline: "Fizika va geometriya formulalarining eng kichik qurilish g'ishti nima?",
      contextLabel: "Ilmiy muammo · Yuzalar, hajmlar va tezlik formulalari",
      story: [
        "Kvadratning yuzi $a^2$, kubning hajmi $a^3$, silindr hajmi $\\pi r^2 h$, kinetik energiya $\\frac{1}{2}mv^2$. E'tibor bering: bularning barchasi faqat sonlar, harflar va ularning darajalarining KO'PAYTMASIDAN iborat!",
        "Bunday ixcham ko'paytma bloklarini bir standartga keltirmasdan turib, kattaroq algebraik ifodalarni qurib bo'lmaydi.",
      ],
      coreQuestion:
        "Son va harf darajalarining aralash ko'paytmasini qanday qilib yagona standart ko'rinishda yozamiz?",
      historicalNote:
        "Algebraik ko'phadlar nazariyasida birhadlar (monomlar) kimyodagi atomlar kabi eng asosiy elementar blok vazifasini bajaradi.",
    },
    chegara: {
      headline: "Tartibsiz yozilgan ko'paytmalarni solishtirib bo'lmaydi",
      whatWorkedBefore: "Bitta o'zgaruvchili darajalarni hisoblash oson edi.",
      breakingPoint:
        "$2a \\cdot 3b \\cdot a^2$ va $6a^3b$ aslida bitta ifoda, ammo standart shaklga keltirmasdan ularning tengligini darhol ilg'ash qiyin.",
      deadEndExample:
        "Har xil tartibda yozilgan birhadlarni o'xshash yoki o'xshash emasligini ajratish xatolikka olib keladi.",
      whyNewIdeaNeeded:
        "Har bir birhadni bitta sonli koeffitsiyent va alifbo tartibidagi noyob harf darajalariga keltirish qoidasi kerak.",
    },
    intuisiya: {
      headline: "Hamma sonlarni oldinga, bir xil harflarni bir joyga yig'ish",
      analogyTitle: "Yuk poyezdini saralash",
      analogyStory:
        "Tasavvur qiling, poyezd vagonlari aralash turibdi: sonli vagonlar, $x$ vagonlari, $y$ vagonlari. Standart shakl — barcha sonlarni ko'paytirib eng boshiga qo'yish, har bir harf turini esa darajasini qo'shib bitta vagonga birlashtirishdir.",
      guidedPrompts: [
        "Ko'paytirishning o'rin almashtirish xossasi harflarni qanday saralashini tasavvur qiling.",
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 2, denA: 3, numB: 1, denB: 3 },
    },
    formula: {
      headline: "Birhadning standart shakli, koeffitsiyenti va darajasi",
      bridgeFromIntuition:
        "Standart birhadda faqat bitta sonli ko'paytuvchi (koeffitsiyent) va har bir o'zgaruvchi faqat bir marta qatnashadi.",
      items: [
        {
          title: 'Birhadlarni ko‘paytirish',
          latex: '(k_1 x^m y^n) \\cdot (k_2 x^p y^q) = (k_1 k_2) x^{m+p} y^{n+q}',
          explanation: "Koeffitsiyentlar o'zaro ko'paytiriladi, bir xil harflarning darajalari qo'shiladi.",
          example: '$(-2a^2b) \\cdot (5ab^3) = -10a^3b^4$',
        },
        {
          title: 'Birhadning darajasi',
          latex: '\\deg(k x^m y^n) = m + n',
          explanation: "Birhaddagi barcha o'zgaruvchilar daraja ko'rsatkichlarining yig'indisidir.",
          example: '$-7x^3y^2z$ birhadining darajasi $3 + 2 + 1 = 6$.',
        },
      ],
      keyPitfall: {
        title: "Ko'rsatkichi yozilmagan harfning darajasini 0 deb olish",
        wrong: '$x^2 \\cdot x = x^2$',
        right: '$x^2 \\cdot x^1 = x^3$',
        reason: "Yolg'iz $x$ harfining darajasi $0$ emas, balki $1$ ga teng.",
      },
    },
    problems: {
      orta: [
        {
          id: 't11-m-1',
          difficulty: 'orta',
          statement: "Standart shaklga keltiring: $$(-3x^2y) \\cdot (2xy^3)$$",
          answer: '-6x^3y^4',
          acceptedEquivalents: ['-6x^3y^4'],
          socraticHint: "Sonlarni $(-3 \\cdot 2)$, $x$ larni $(x^2 \\cdot x)$ va $y$ larni $(y \\cdot y^3)$ alohida ko'paytiring.",
          steps: [
            "Koeffitsiyent: $(-3) \\cdot 2 = -6$.",
            "$x^2 \\cdot x^1 = x^3$ va $y^1 \\cdot y^3 = y^4$.",
            "Natija: $-6x^3y^4$.",
          ],
          sourceLabel: 'Usmonov uslubi · 11.1',
        },
        {
          id: 't11-m-2',
          difficulty: 'orta',
          statement: "Darajaga ko'taring: $$(-2a^2b^3)^3$$",
          answer: '-8a^6b^9',
          acceptedEquivalents: ['-8a^6b^9'],
          socraticHint: "Koeffitsiyent $-2$ ni ham kubga ko'tarishni unutmang! $(-2)^3$ nechaga teng?",
          steps: [
            "$(-2)^3 = -8$.",
            "$(a^2)^3 = a^6$ va $(b^3)^3 = b^9$.",
            "Natija: $-8a^6b^9$.",
          ],
          sourceLabel: 'Usmonov uslubi · 11.4',
        },
      ],
      murakkab: [
        {
          id: 't11-h-1',
          difficulty: 'murakkab',
          statement: "Soddalashtiring: $$\\left(-\\frac{1}{2}a^2b\\right)^3 \\cdot (4ab^2)^2$$",
          answer: '-2a^8b^7',
          acceptedEquivalents: ['-2a^8b^7'],
          socraticHint: "Avval har ikki qavsni alohida darajaga ko'taring: $(-\\frac{1}{2})^3 = -\\frac{1}{8}$ va $4^2 = 16$.",
          steps: [
            "Birinchi ko'paytuvchi: $-\\frac{1}{8}a^6b^3$.",
            "Ikkinchi ko'paytuvchi: $16a^2b^4$.",
            "Ko'paytiramiz: $(-\\frac{1}{8} \\cdot 16)a^{6+2}b^{3+4} = -2a^8b^7$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 11.9',
        },
      ],
    },
  },

  12: {
    topicId: 12,
    muammo: {
      headline: "Bir nechta jarayon birga sodir bo'lganda ularni qanday jamlaymiz?",
      contextLabel: "Iqtisodiy va fizik muammo · Daromad va xarajat funksiyalari",
      story: [
        "Korxonaning daromadi $3x^2 + 5x + 10$ formula bilan, xarajati esa $x^2 + 2x + 4$ formula bilan ifodalanadi. Sof foydani topish uchun bitta ko'phaddan ikkinchisini ayirish kerak.",
      ],
      coreQuestion:
        "Ikki ko'phadni qo'shish va ayirishda qaysi hadlar birlashadi, qaysilari alohida qoladi?",
      historicalNote:
        "Ko'phadlar (polinomlar) butun sonlarning umumlashmasi bo'lib, kompyuter grafikasi va muhandislikda egri chiziqlarni qurishda asosiy vositadir.",
    },
    chegara: {
      headline: "Bitta birhad murakkab bog'lanishni ifodalay olmaydi",
      whatWorkedBefore: "Birhadlar bitta sodda ko'paytma munosabatini berardi.",
      breakingPoint: "Ko'p omilli hodisalarda (yig'indi va ayirmalar) bir nechta har xil darajali hadlar birga keladi.",
      deadEndExample: "$x^2 + x$ ni $x^3$ deb qo'shib yuborish keng tarqalgan xato bo'lib, geometrik jihatdan kvadrat yuzi bilan kesma uzunligini qo'shishga o'xshaydi.",
      whyNewIdeaNeeded:
        "Ko'phadlar ustida standart shakl, o'xshash hadlarni birlashtirish va ishora nazorati kerak.",
    },
    intuisiya: {
      headline: "Kvadratlar kvadratlar bilan, kesmalar kesmalar bilan qo'shiladi",
      analogyTitle: "Valyuta ayirboshlash kassasi",
      analogyStory:
        "Kassada yuztalik ($x^2$), o'ntalik ($x$) va birlik ($1$) pullar bor. Ikki kassani birlashtirganda yuztaliklar yuztaliklarga, o'ntaliklar o'ntaliklarga qo'shiladi — ular bir-biriga aralashib ketmaydi.",
      guidedPrompts: [
        "Bir xil maxrajli bo'laklar kabi faqat bir xil darajali hadlar qo'shilishini esda tuting.",
      ],
      defaultSimulatorMode: 'combine',
      defaultPreset: { numA: 3, denA: 6, numB: 2, denB: 6 },
    },
    formula: {
      headline: "Ko'phadlarni qo'shish va ayirish",
      bridgeFromIntuition: "Ko'phad — birhadlarning algebraik yig'indisidir.",
      items: [
        {
          title: "Ko'phadlar yig'indisi va ayirmasi",
          latex: '(ax^2 + bx + c) - (dx^2 + ex + f) = (a-d)x^2 + (b-e)x + (c-f)',
          explanation: "Ayirishda ikkinchi ko'phadning har bir hadining ishorasi o'zgaradi.",
          example: '$(3x^2 + 5x) - (x^2 - 2x) = 2x^2 + 7x$',
        },
      ],
      keyPitfall: {
        title: "Har xil darajalarni qo'shib yuborish",
        wrong: '$2x^2 + 3x = 5x^3$',
        right: '$2x^2 + 3x$ — o‘xshash hadlar yo‘q, shunday qoladi',
        reason: "$x^2$ va $x$ harfli qismlari har xil, ularni qo'shib bo'lmaydi.",
      },
    },
    problems: {
      orta: [
        {
          id: 't12-m-1',
          difficulty: 'orta',
          statement: "Soddalashtiring: $$(4x^2 - 3x + 5) - (2x^2 - 5x + 1)$$",
          answer: '2x^2 + 2x + 4',
          acceptedEquivalents: ['2x^2+2x+4'],
          socraticHint: "Ikkinchi qavs ichidagi $-5x$ qavs ochilganda qanday ishoraga aylanadi?",
          steps: [
            "$4x^2 - 3x + 5 - 2x^2 + 5x - 1$.",
            "$(4-2)x^2 + (-3+5)x + (5-1) = 2x^2 + 2x + 4$.",
          ],
          sourceLabel: 'Usmonov uslubi · 12.1',
        },
      ],
      murakkab: [
        {
          id: 't12-h-1',
          difficulty: 'murakkab',
          statement: "Agar $P(x) = 3x^2 - 2x + 1$ va $Q(x) = x^2 + 4x - 5$ bo'lsa, $P(x) - 2Q(x)$ ni toping.",
          answer: 'x^2 - 10x + 11',
          acceptedEquivalents: ['x^2-10x+11'],
          socraticHint: "Avval $-2Q(x)$ ning barcha uchta hadini diqqat bilan hisoblab oling.",
          steps: [
            "$-2Q(x) = -2x^2 - 8x + 10$.",
            "$P(x) - 2Q(x) = (3x^2 - 2x + 1) + (-2x^2 - 8x + 10) = x^2 - 10x + 11$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 12.8',
        },
      ],
    },
  },

  13: {
    topicId: 13,
    muammo: {
      headline: "Kengayib boruvchi to'rtburchak yuzasini qanday hisoblaymiz?",
      contextLabel: "Geometrik muammo · Yerlarni kengaytirish",
      story: [
        "Eni $x$ metr, bo'yi $a + b$ metr bo'lgan yer maydoni ikkita qo'shni daladan iborat. Umumiy yuza $x(a + b)$ bitta bo'laklar yuzalari yig'indisi $xa + xb$ ga teng.",
      ],
      coreQuestion:
        "Birhadni ko'phadga ko'paytirganda har bir had qanday o'zgaradi?",
      historicalNote:
        "Evklidning «Boshlang'ichlar» kitobida (2-kitob, 1-teorema) taqsimot qonuni aynan to'rtburchaklar yuzasi orqali isbotlangan.",
    },
    chegara: {
      headline: "Qavs ichidagi hadlarni qo'shib bo'lmaganda ko'paytirish qanday bajariladi?",
      whatWorkedBefore: "Sonlarda $3 \\cdot (4 + 5) = 3 \\cdot 9 = 27$ qilib qavs ichini avval hisoblash mumkin edi.",
      breakingPoint: "$2x(x^2 - 3x + 4)$ da qavs ichini bitta songa keltirib bo'lmaydi.",
      deadEndExample: "Faqat birinchi hadni ko'paytirib qolganlarini tashlab ketish eng ko'p uchraydigan xatodir.",
      whyNewIdeaNeeded: "Birhad ko'phadning istisnosiz HAR BIR hadiga ko'paytirilishi kerak.",
    },
    intuisiya: {
      headline: "Bo'lingan to'rtburchakning umumiy yuzi",
      analogyTitle: "Xonalarga bo'lingan zal",
      analogyStory:
        "Eni bir xil $3$ metr, uzunliklari $a$, $b$ va $c$ bo'lgan uchta yonma-yon xonaning umumiy yuzi — har bir xona yuzining yig'indisidir.",
      guidedPrompts: [
        "Butun kesmani qismlarga ajratib har bir bo'lakni teng miqyosda oshirishni tasavvur qiling.",
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 3, denA: 5, numB: 1, denB: 5 },
    },
    formula: {
      headline: "Birhadni ko'phadga ko'paytirish qoidasi",
      bridgeFromIntuition: "Taqsimot qonuni harflar va darajalar uchun ham aynan o'rinli.",
      items: [
        {
          title: 'Umumiy formula',
          latex: 'M(A + B - C) = MA + MB - MC',
          explanation: "Birhad $M$ qavs ichidagi har bir hadga ishorasini saqlagan holda ko'paytiriladi.",
          example: '$-2x(x^2 - 3x + 5) = -2x^3 + 6x^2 - 10x$',
        },
      ],
      keyPitfall: {
        title: "Oxirgi hadni ko'paytirishni unutish",
        wrong: '$3x(2x + 4) = 6x^2 + 4$',
        right: '$3x(2x + 4) = 6x^2 + 12x$',
        reason: "$3x$ nafaqat $2x$ ga, balki $4$ ga ham ko'paytirilishi shart.",
      },
    },
    problems: {
      orta: [
        {
          id: 't13-m-1',
          difficulty: 'orta',
          statement: "Ko'paytmani ko'phad shaklida yozing: $$2x(3x^2 - 4x + 5)$$",
          answer: '6x^3 - 8x^2 + 10x',
          acceptedEquivalents: ['6x^3-8x^2+10x'],
          socraticHint: "$2x$ ni uchala hadga ketma-ket ko'paytiring va $x$ darajalarini qo'shing.",
          steps: [
            "$2x \\cdot 3x^2 = 6x^3$.",
            "$2x \\cdot (-4x) = -8x^2$ va $2x \\cdot 5 = 10x$.",
            "Natija: $6x^3 - 8x^2 + 10x$.",
          ],
          sourceLabel: 'Usmonov uslubi · 13.1',
        },
      ],
      murakkab: [
        {
          id: 't13-h-1',
          difficulty: 'murakkab',
          statement: "Tenglamani yeching: $$3x(x - 2) - x(3x - 5) = 4$$",
          answer: '-4',
          acceptedEquivalents: ['x=-4', 'x = -4'],
          socraticHint: "Qavslarni ochsangiz $3x^2$ lar qisqarib ketadi va oddiy chiziqli tenglama qoladi!",
          steps: [
            "$3x^2 - 6x - 3x^2 + 5x = 4$.",
            "$-x = 4 \\implies x = -4$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 13.9',
        },
      ],
    },
  },

  14: {
    topicId: 14,
    muammo: {
      headline: "Yig'indini teskari yo'l bilan ko'paytmaga aylantirish nega kerak?",
      contextLabel: "Algebraik muammo · Tenglama ildizlari va kasrlarni qisqartirish",
      story: [
        "Agar $x^2 - 5x = 0$ tenglamasini yechmoqchi bo'lsangiz, yig'indi ko'rinishida ildizlarni topish qiyin. Ammo $x(x - 5) = 0$ deb ko'paytmaga ajratsangiz, darhol ikkala yechim ko'rinadi: $x = 0$ yoki $x = 5$!",
      ],
      coreQuestion:
        "Ko'phad ichida yashiringan umumiy ko'paytuvchini qanday topib tashqariga chiqaramiz?",
      historicalNote:
        "Ko'paytuvchilarga ajratish (faktorizatsiya) nafaqat tenglamalar, balki zamonaviy kriptografiyaning ham yuragidir.",
    },
    chegara: {
      headline: "Yig'indi nolga teng bo'lsa, hadlar haqida hech narsa deya olmaymiz",
      whatWorkedBefore: "Qavslarni ochib ko'paytmani yig'indiga aylantirishni o'rgandik.",
      breakingPoint: "$A + B = 0$ dan $A$ va $B$ ning aniq qiymati chiqmaydi, lekin $A \\cdot B = 0$ dan albatta $A=0$ yoki $B=0$ kelib chiqadi!",
      deadEndExample: "Kasr surat va maxrajida yig'indi tursa, uni qisqartirib bo'lmaydi.",
      whyNewIdeaNeeded: "Taqsimot qonunini teskari yo'nalishda qo'llash va guruhlash usuli zarur.",
    },
    intuisiya: {
      headline: "Umumiy kalitni qavsdan tashqariga chiqarish",
      analogyTitle: "Bir xil qadoqlash",
      analogyStory:
        "Har bir had tarkibida bir xil ko'paytuvchi bo'lsa, uni barcha hadlardan «tortib olib» qavs oldiga yozamiz. Qavs ichida esa bo'lingandan keyin qolgan qismlar qoladi.",
      guidedPrompts: [
        "Simulyatorda umumiy mayda bo'lak (EKUB) topish orqali kasrlarni qisqartirish g'oyasini kuzating.",
      ],
      defaultSimulatorMode: 'compare',
      defaultPreset: { numA: 6, denA: 12, numB: 1, denB: 2 },
    },
    formula: {
      headline: "Umumiy ko'paytuvchi va guruhlash usuli",
      bridgeFromIntuition: "Bu 13-mavzudagi ko'paytirishning aynan teskari jarayonidir.",
      items: [
        {
          title: "Umumiy ko'paytuvchini chiqarish",
          latex: 'ab + ac = a(b + c)',
          explanation: "Koeffitsiyentlarning EKUBi va umumiy harflarning eng kichik darajasi chiqariladi.",
          example: '$6x^3 - 9x^2 = 3x^2(2x - 3)$',
        },
        {
          title: 'Guruhlash usuli',
          latex: 'ax + ay + bx + by = a(x+y) + b(x+y) = (x+y)(a+b)',
          explanation: "4 hadli ko'phadni 2 tadan guruhlab, bir xil qavs hosil qilamiz.",
          example: '$x^2 + 3x + 2x + 6 = x(x+3) + 2(x+3) = (x+3)(x+2)$',
        },
      ],
      keyPitfall: {
        title: "Butun had tashqariga chiqqanda 1 o'rniga 0 qoldirish",
        wrong: '$3x^2 + 3x = 3x(x)$',
        right: '$3x^2 + 3x = 3x(x + 1)$',
        reason: "$3x : 3x = 1$ bo'lgani uchun qavs ichida $+1$ qolishi shart.",
      },
    },
    problems: {
      orta: [
        {
          id: 't14-m-1',
          difficulty: 'orta',
          statement: "Ko'paytuvchilarga ajrating: $$6x^2y - 9xy^2$$",
          answer: '3xy(2x - 3y)',
          acceptedEquivalents: ['3xy(2x-3y)'],
          socraticHint: "$6$ va $9$ ning eng katta umumiy bo'luvchisi nima? $x$ va $y$ ning eng kichik darajalari-chi?",
          steps: [
            "Umumiy ko'paytuvchi: $3xy$.",
            "Har bir hadni $3xy$ ga bo'lamiz: $6x^2y : 3xy = 2x$, $-9xy^2 : 3xy = -3y$.",
            "Natija: $3xy(2x - 3y)$.",
          ],
          sourceLabel: 'Usmonov uslubi · 14.1',
        },
      ],
      murakkab: [
        {
          id: 't14-h-1',
          difficulty: 'murakkab',
          statement: "Guruhlash usuli bilan ko'paytuvchilarga ajrating: $$ax - ay + 2x - 2y$$",
          answer: '(x - y)(a + 2)',
          acceptedEquivalents: ['(a+2)(x-y)', '(x-y)(a+2)'],
          socraticHint: "Birinchi ikki haddan $a$ ni, oxirgi ikki haddan $2$ ni qavsdan tashqariga chiqaring.",
          steps: [
            "$a(x - y) + 2(x - y)$.",
            "Endi umumiy qavs $(x - y)$ ni tashqariga chiqaramiz: $(x - y)(a + 2)$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 14.10',
        },
      ],
    },
  },

  15: {
    topicId: 15,
    muammo: {
      headline: "Ikkala tomoni ham o'zgargan bog'ning yangi yuzasi qancha?",
      contextLabel: "Geometrik muammo · Ikki o'lchamli kengayish",
      story: [
        "Eni $a$ va bo'yi $c$ bo'lgan bog'ning enini $b$ ga, bo'yini esa $d$ ga kengaytirishdi. Yangi bog' $(a+b)(c+d)$ nechta kichik to'rtburchakdan iborat bo'ladi? Ikkita emas — to'rtta!",
      ],
      coreQuestion:
        "Ikki ko'phadni ko'paytirganda biron had qolib ketmasligi uchun qanday tizimli qoida ishlaydi?",
      historicalNote:
        "Ko'phadlarni ko'paytirishning geometrik to'rtburchak modeli qisqa ko'paytirish formulalarining barchasiga bevosita eshik ochadi.",
    },
    chegara: {
      headline: "Faqat mos hadlarni ko'paytirish noto'g'ri",
      whatWorkedBefore: "Birhadni ko'phadga ko'paytirishda bitta ko'paytuvchi bor edi.",
      breakingPoint: "$(a+b)(c+d)$ da ikkala qavs ham ko'p hadli.",
      deadEndExample: "$(x+2)(x+3) = x^2 + 6$ deb yozish $3x + 2x = 5x$ qismini yo'qotib qo'yadi!",
      whyNewIdeaNeeded: "Har bir hadni ikkinchi qavsning har bir hadiga ko'paytirish qoidasi kerak.",
    },
    intuisiya: {
      headline: "Ikki jamoaning har bir o'yinchisi bir-biri bilan qo'l berib ko'rishadi",
      analogyTitle: "2x2 to'rtburchak kataklar",
      analogyStory:
        "Agar birinchi jamoada 2 kishi, ikkinchisida 3 kishi bo'lsa, jami $2 \\cdot 3 = 6$ ta qo'l berishish bo'ladi. Ko'phadlar ko'paytmasida ham shunday: birinchi qavsdagi har bir had ikkinchi qavsning har bir hadi bilan uchrashadi.",
      guidedPrompts: [
        "Har bir ko'paytishda dastlabki hadlar soni $m \\cdot n$ bo'lishini tekshirib oling.",
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 2, denA: 4, numB: 1, denB: 4 },
    },
    formula: {
      headline: "Ko'phadlar ko'paytmasi formulasi",
      bridgeFromIntuition: "Birinchi qavsni vaqtincha bitta harf deb qarab, taqsimot qonunini ikki marta qo'llaymiz.",
      items: [
        {
          title: 'Asosiy qoida',
          latex: '(a + b)(c + d) = ac + ad + bc + bd',
          explanation: "Har bir had har bir hadga ko'paytiriladi, so'ng o'xshash hadlar ixchamlanadi.",
          example: '$(x + 2)(x + 3) = x^2 + 3x + 2x + 6 = x^2 + 5x + 6$',
        },
      ],
      keyPitfall: {
        title: "O'rta hadlarni unutish",
        wrong: '$(x + 4)(x - 2) = x^2 - 8$',
        right: '$(x + 4)(x - 2) = x^2 - 2x + 4x - 8 = x^2 + 2x - 8$',
        reason: "To'rtburchakning 4 ta bo'lagi bor, 2 ta emas!",
      },
    },
    problems: {
      orta: [
        {
          id: 't15-m-1',
          difficulty: 'orta',
          statement: "Ko'phad shaklida yozing: $$(2x - 3)(x + 4)$$",
          answer: '2x^2 + 5x - 12',
          acceptedEquivalents: ['2x^2+5x-12'],
          socraticHint: "4 ta ko'paytmani yozib chiqing va $x$ li ikkita o'rta hadni qo'shing.",
          steps: [
            "$2x \\cdot x + 2x \\cdot 4 - 3 \\cdot x - 3 \\cdot 4$.",
            "$2x^2 + 8x - 3x - 12 = 2x^2 + 5x - 12$.",
          ],
          sourceLabel: 'Usmonov uslubi · 15.1',
        },
      ],
      murakkab: [
        {
          id: 't15-h-1',
          difficulty: 'murakkab',
          statement: "Soddalashtiring: $$(x + 3)(x - 5) - (x - 2)(x + 1)$$",
          answer: '-x - 13',
          acceptedEquivalents: ['-x-13', '-13-x'],
          socraticHint: "Ikkinchi ko'paytma oldida minus bor! Uni avval qavs ichida hisoblang, keyin ishoralarini o'zgartiring.",
          steps: [
            "$(x + 3)(x - 5) = x^2 - 2x - 15$.",
            "$(x - 2)(x + 1) = x^2 - x - 2$.",
            "Ayiramiz: $(x^2 - 2x - 15) - (x^2 - x - 2) = -x - 13$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 15.11',
        },
      ],
    },
  },

  16: {
    topicId: 16,
    muammo: {
      headline: "Kvadrat xonaning har tomonini kengaytirsak yuzi qanchaga ortadi?",
      contextLabel: "Geometrik muammo · Yuzaning to'liq o'sishi",
      story: [
        "Tomoni $10$ metr bo'lgan kvadrat bog'ning enini ham, bo'yini ham $2$ metrga kengaytirdingiz. Ko'pchilik yangi yuzani $10^2 + 2^2 = 104$ deb adashadi, aslida esa $12^2 = 144$! Qolgan $40\\text{ m}^2$ qayerdan keldi?",
      ],
      coreQuestion:
        "$(a + b)^2$ nima uchun $a^2 + b^2$ dan aynan $2ab$ ga katta?",
      historicalNote:
        "Bu formula «Ikki hadning kvadrati» bo'lib, keyinchalik kvadrat tenglamalarni yechishdagi diskriminant formulasining asosiga aylanadi.",
    },
    chegara: {
      headline: "Daraja yig'indiga tarqalmaydi!",
      whatWorkedBefore: "Ko'paytma uchun $(ab)^2 = a^2b^2$ to'g'ri edi.",
      breakingPoint: "Yig'indi uchun $(a+b)^2 \\neq a^2 + b^2$ (agar $a, b \\neq 0$).",
      deadEndExample: "$(3+4)^2 = 49$, lekin $3^2 + 4^2 = 25$ — o'rtada $24$ yo'qolib qoladi!",
      whyNewIdeaNeeded: "Har safar qavslarni uzun ochmasdan to'g'ridan-to'g'ri ishlatiladigan qisqa ko'paytirish formulasi kerak.",
    },
    intuisiya: {
      headline: "Kvadrat 4 ta bo'lakdan iborat: 2 ta kvadrat va 2 ta bir xil to'rtburchak",
      analogyTitle: "Kvadrat gilamni kengaytirish",
      analogyStory:
        "Tomoni $a$ bo'lgan katta kvadrat yoniga o'ngdan va pastdan eni $b$, uzunligi $a$ bo'lgan IKKITA bir xil tasma qo'shiladi, burchakda esa $b \\times b$ kichik kvadrat paydo bo'ladi. Ana o'sha ikki tasma — $2ab$!",
      guidedPrompts: [
        "$102^2 = (100 + 2)^2$ ni kalkulyatorsiz og'zaki hisoblab ko'ring: $10000 + 400 + 4 = 10404$.",
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 3, denA: 4, numB: 1, denB: 4 },
    },
    formula: {
      headline: "Yig'indining va ayirmaning kvadrati",
      bridgeFromIntuition: "Ikkita teng qavsni ko'paytirishdan o'rtadagi ikki bir xil $ab$ qo'shilib $2ab$ hosil bo'ladi.",
      items: [
        {
          title: "Yig'indining kvadrati",
          latex: '(a + b)^2 = a^2 + 2ab + b^2',
          explanation: "Birinchi had kvadrati, plyus ikkilangan ko'paytma, plyus ikkinchi had kvadrati.",
          example: '$(2x + 3)^2 = 4x^2 + 12x + 9$',
        },
        {
          title: 'Ayirmaning kvadrati',
          latex: '(a - b)^2 = a^2 - 2ab + b^2',
          explanation: "Faqat o'rtadagi ikkilangan ko'paytmaning ishorasi minus bo'ladi; $b^2$ doim plyus!",
          example: '$(3a - 5)^2 = 9a^2 - 30a + 25$',
        },
      ],
      keyPitfall: {
        title: "Ikkilangan ko'paytmani ($2ab$) unutish",
        wrong: '$(x - 5)^2 = x^2 - 25$',
        right: '$(x - 5)^2 = x^2 - 10x + 25$',
        reason: "O'rtadagi $-2 \\cdot x \\cdot 5 = -10x$ had va oxirgi $+25$ ishorasi hal qiluvchi.",
      },
    },
    problems: {
      orta: [
        {
          id: 't16-m-1',
          difficulty: 'orta',
          statement: "Yoyib yozing: $$(3x - 4)^2$$",
          answer: '9x^2 - 24x + 16',
          acceptedEquivalents: ['9x^2-24x+16'],
          socraticHint: "Birinchi had $3x$ ning kvadrati $9x^2$. Ikkilangan ko'paytma $-2 \\cdot 3x \\cdot 4$ nechaga teng?",
          steps: [
            "$(3x)^2 - 2 \\cdot 3x \\cdot 4 + 4^2$.",
            "$9x^2 - 24x + 16$.",
          ],
          sourceLabel: 'Usmonov uslubi · 16.1',
        },
      ],
      murakkab: [
        {
          id: 't16-h-1',
          difficulty: 'murakkab',
          statement: "Agar $a + b = 7$ va $ab = 10$ bo'lsa, $a^2 + b^2$ ni toping.",
          answer: '29',
          acceptedEquivalents: ['29'],
          socraticHint: "$(a + b)^2 = a^2 + 2ab + b^2$ tenglikdan $a^2 + b^2$ ni yakkalab oling!",
          steps: [
            "$a^2 + b^2 = (a + b)^2 - 2ab$.",
            "$7^2 - 2 \\cdot 10 = 49 - 20 = 29$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 16.14',
        },
      ],
    },
  },

  17: {
    topicId: 17,
    muammo: {
      headline: "Kvadratdan fazoviy kubga o'tganda hajm nechta bo'lakka bo'linadi?",
      contextLabel: "Fazoviy muammo · 3 o'lchamli kub kengayishi",
      story: [
        "Tomoni $a + b$ bo'lgan kubni tasavvur qiling. Uni tekisliklar bilan kesganda jami $2 \\times 2 \\times 2 = 8$ ta kichik fazoviy bo'lak hosil bo'ladi: 1 ta katta kub ($a^3$), 3 ta yassi plita ($a^2b$), 3 ta ustuncha ($ab^2$) va 1 ta kichik kub ($b^3$).",
      ],
      coreQuestion: "Nega kub formulasida aynan $1, 3, 3, 1$ koeffitsiyentlari paydo bo'ladi?",
      historicalNote:
        "Umar Xayyom va Al-Karajiy XI asrdayoq $(a+b)^n$ yoyilmasining koeffitsiyentlar uchburchagini bilishgan.",
    },
    chegara: {
      headline: "Uchta qavsni har safar qo'lda ko'paytirish uzoq va xatoga moyil",
      whatWorkedBefore: "Ikki qavsda 4 ta had bor edi.",
      breakingPoint: "Uchta qavsni $(a+b)(a+b)(a+b)$ qo'lda ochishda 8 ta had chiqadi va ishoralar oson adashadi.",
      deadEndExample: "$(a-b)^3 = a^3 - b^3$ deb yozish butun 6 ta ichki bo'lakni tashlab ketadi.",
      whyNewIdeaNeeded: "Yig'indi va ayirma kubining tayyor qisqa formulasi zarur.",
    },
    intuisiya: {
      headline: "8 ta kubik blok: 1 + 3 + 3 + 1",
      analogyTitle: "Rubik kubi kabi bo'laklash",
      analogyStory:
        "Katta kubning uchta yoqida uchta bir xil plita ($3a^2b$), uchta qirrasida uchta uzunchoq tayoqcha ($3ab^2$), ikki qarama-qarshi burchagida esa katta ($a^3$) va kichik ($b^3$) kublar joylashadi.",
      guidedPrompts: [
        "Ko'rsatkichlar yig'indisi har bir hadda doim 3 ga teng ekanini kuzating: $a^3$, $a^2b$, $ab^2$, $b^3$.",
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 1, denA: 8, numB: 3, denB: 8 },
    },
    formula: {
      headline: "Yig'indining va ayirmaning kubi",
      bridgeFromIntuition: "$(a \\pm b)^3 = (a \\pm b)^2 (a \\pm b)$ ni ochish orqali hosil qilinadi.",
      items: [
        {
          title: "Yig'indining kubi",
          latex: '(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3',
          explanation: "Barcha hadlar musbat, koeffitsiyentlar 1, 3, 3, 1.",
          example: '$(x + 2)^3 = x^3 + 6x^2 + 12x + 8$',
        },
        {
          title: 'Ayirmaning kubi',
          latex: '(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3',
          explanation: "Ishoralar navbatma-navbat almashadi: $+, -, +, -$.",
          example: '$(x - 1)^3 = x^3 - 3x^2 + 3x - 1$',
        },
      ],
      keyPitfall: {
        title: "Ayirma kubida uchinchi had ishorasini minus qilish",
        wrong: '$(a - b)^3 = a^3 - 3a^2b - 3ab^2 - b^3$',
        right: '$(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$',
        reason: "Uchinchi hadda $(-b)^2 = +b^2$ bo'lgani uchun ishora plyus bo'ladi.",
      },
    },
    problems: {
      orta: [
        {
          id: 't17-m-1',
          difficulty: 'orta',
          statement: "Ko'phad shaklida yozing: $$(x + 2)^3$$",
          answer: 'x^3 + 6x^2 + 12x + 8',
          acceptedEquivalents: ['x^3+6x^2+12x+8'],
          socraticHint: "$a = x$, $b = 2$ deb formulaga qo'ying: $3a^2b = 3x^2 \\cdot 2$, $3ab^2 = 3x \\cdot 4$.",
          steps: [
            "$x^3 + 3 \\cdot x^2 \\cdot 2 + 3 \\cdot x \\cdot 2^2 + 2^3$.",
            "$x^3 + 6x^2 + 12x + 8$.",
          ],
          sourceLabel: 'Usmonov uslubi · 17.1',
        },
      ],
      murakkab: [
        {
          id: 't17-h-1',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$11^3 - 3 \\cdot 11^2 + 3 \\cdot 11 - 1$$",
          answer: '1000',
          acceptedEquivalents: ['1000'],
          socraticHint: "Bu ifoda qaysi ikki son ayirmasining kubi ko'rinishida yozilgan?",
          steps: [
            "Ayirmaning kubi formulasini teskari qo'llaymiz: $(11 - 1)^3$.",
            "$10^3 = 1000$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 17.8',
        },
      ],
    },
  },

  18: {
    topicId: 18,
    muammo: {
      headline: "99 · 101 ni bir soniyada qog'ozsiz qanday hisoblaymiz?",
      contextLabel: "Tezkor hisob va geometriya · Kvadratdan kvadratni kesish",
      story: [
        "Katta $a \\times a$ kvadratning burchagidan kichik $b \\times b$ kvadratni qirqib tashlang. Qolgan L-shaklidagi qog'ozni bitta to'g'ri kesish bilan ikkiga bo'lib qayta qo'ysangiz, eni $(a-b)$ va bo'yi $(a+b)$ bo'lgan tekis to'rtburchak hosil bo'ladi!",
        "Shuning uchun $99 \\cdot 101 = (100 - 1)(100 + 1) = 100^2 - 1^2 = 9999$!",
      ],
      coreQuestion:
        "Ikki kvadratning ayirmasi nega har doim ularning ayirmasi va yig'indisi ko'paytmasiga teng?",
      historicalNote:
        "Kvadratlar ayirmasi maktab va universitet algebrasida eng ko'p ishlatiladigan faktorizatsiya qurolidir.",
    },
    chegara: {
      headline: "$a^2 - b^2$ da umumiy ko'paytuvchi yo'q",
      whatWorkedBefore: "14-mavzuda umumiy ko'paytuvchini qavsdan tashqariga chiqarar edik.",
      breakingPoint: "$x^2 - 9$ da na sonli, na harfli umumiy ko'paytuvchi mavjud.",
      deadEndExample: "Oddiy guruhlash bilan $x^2 - 9$ ni ko'paytmaga ajratib bo'lmaydi.",
      whyNewIdeaNeeded: "O'rta hadlari qarama-qarshi bo'lib qisqaradigan $(a-b)(a+b)$ konstruksiyasi kerak.",
    },
    intuisiya: {
      headline: "Kesib qayta yopishtirish: L-shakl to'rtburchakka aylanadi",
      analogyTitle: "Qog'oz varag'ini qaychi bilan kesish",
      analogyStory:
        "Katta kvadratdan kichik burchak kvadratni kesib oling. Qolgan shaklning bir qismini aylantirib yoniga qo'ysangiz, uzunligi $a+b$, eni $a-b$ bo'lgan aniq to'rtburchak chiqadi — hech qanday qoldiq qolmaydi!",
      guidedPrompts: [
        "$(50 - 3)(50 + 3) = 47 \\cdot 53$ ni $2500 - 9 = 2491$ shaklida tekshiring.",
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 3, denA: 4, numB: 1, denB: 4 },
    },
    formula: {
      headline: 'Kvadratlar ayirmasi formulasi',
      bridgeFromIntuition: "$(a-b)(a+b) = a^2 + ab - ab - b^2 = a^2 - b^2$.",
      items: [
        {
          title: 'Asosiy formula (ikki yo‘nalishda)',
          latex: 'a^2 - b^2 = (a - b)(a + b)',
          explanation: "Ham qavsni tez ochishda, ham ko'paytuvchilarga ajratishda ishlatiladi.",
          example: '$25x^2 - 16 = (5x - 4)(5x + 4)$',
        },
      ],
      keyPitfall: {
        title: "Kvadratlar yig'indisini ajratishga urinish",
        wrong: '$a^2 + b^2 = (a + b)(a + b)$',
        right: '$a^2 - b^2 = (a - b)(a + b)$ ($a^2 + b^2$ haqiqiy sonlarda ajralmaydi)',
        reason: "Formula faqat kvadratlar AYIRMASI uchun ishlaydi, yig'indi uchun emas.",
      },
    },
    problems: {
      orta: [
        {
          id: 't18-m-1',
          difficulty: 'orta',
          statement: "Hisoblang: $$53^2 - 47^2$$",
          answer: '600',
          acceptedEquivalents: ['600'],
          socraticHint: "53 va 47 ni kvadratga ko'tarish shart emas! $(53 - 47)(53 + 47)$ ni hisoblang.",
          steps: [
            "$53^2 - 47^2 = (53 - 47)(53 + 47)$.",
            "$6 \\cdot 100 = 600$.",
          ],
          sourceLabel: 'Usmonov uslubi · 18.1',
        },
      ],
      murakkab: [
        {
          id: 't18-h-1',
          difficulty: 'murakkab',
          statement: "Qulay usulda hisoblang: $$\\frac{78^2 - 22^2}{64^2 - 36^2}$$",
          answer: '2',
          acceptedEquivalents: ['2'],
          socraticHint: "Ham suratda, ham maxrajda kvadratlar ayirmasi formulasini qo'llang — ikkalasida ham $100$ chiqadi!",
          steps: [
            "Surat: $(78 - 22)(78 + 22) = 56 \\cdot 100$.",
            "Maxraj: $(64 - 36)(64 + 36) = 28 \\cdot 100$.",
            "Qisqartiramiz: $\\frac{56 \\cdot 100}{28 \\cdot 100} = 2$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 18.12',
        },
      ],
    },
  },

  19: {
    topicId: 19,
    muammo: {
      headline: "Kvadratlar yig'indisi ajralmadi, lekin kublar yig'indisi ajraladimi?",
      contextLabel: "Algebraik kashfiyot · Juft va toq darajalar farqi",
      story: [
        "$a^2 + b^2$ haqiqiy sonlarda ko'paytuvchilarga ajralmaydi. Lekin ajablanarlisi, $a^3 + b^3$ AJRALADI! Masalan, $8^3 + 2^3 = 520$ soni $8 + 2 = 10$ ga qoldiqsiz bo'linadi.",
      ],
      coreQuestion:
        "Kublar yig'indisi va ayirmasini qanday qilib bir chiziqli va bir kvadrat qavs ko'paytmasiga ajratamiz?",
      historicalNote:
        "Bu formulalar ratsional kasrlarni qisqartirishda va uchinchi darajali tenglamalarni yechishda ajralmas rol o'ynaydi.",
    },
    chegara: {
      headline: "Kvadratlar ayirmasi 3-darajada ishlamaydi",
      whatWorkedBefore: "2-darajali ayirmani $(a-b)(a+b)$ qilib ajratdik.",
      breakingPoint: "$x^3 - 8$ yoki $x^3 + 27$ ni kvadratlar ayirmasi bilan ajratib bo'lmaydi.",
      deadEndExample: "$(a-b)(a^2 + 2ab + b^2)$ deb ikkilangan ko'paytma qo'yib yuborish o'rta hadlarni qisqartirmaydi.",
      whyNewIdeaNeeded: "«Chala kvadrat» ($a^2 \\mp ab + b^2$) ishtirokidagi kublar yig'indisi va ayirmasi formulalari kerak.",
    },
    intuisiya: {
      headline: "Chala kvadrat — barcha ortiqcha hadlarni o'chiradigan qulf",
      analogyTitle: "Zanjirli qisqarish",
      analogyStory:
        "$(a - b)$ ni $(a^2 + ab + b^2)$ ga ko'paytirganingizda, o'rtadagi $+a^2b$ bilan $-a^2b$ va $+ab^2$ bilan $-ab^2$ xuddi ko'zgu kabi bir-birini yo'q qiladi — faqat ikki chetdagi $a^3 - b^3$ qoladi!",
      guidedPrompts: [
        "Ikkinchi qavsda $2ab$ emas, atigi bitta $ab$ borligiga e'tibor bering — shuning uchun u «chala kvadrat» deyiladi.",
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 1, denA: 3, numB: 2, denB: 3 },
    },
    formula: {
      headline: "Kublarning yig'indisi va ayirmasi",
      bridgeFromIntuition: "Birinchi qavs ishorasi asl ifoda bilan bir xil, chala kvadratdagi o'rta had ishorasi esa qarama-qarshi.",
      items: [
        {
          title: "Kublarning yig'indisi",
          latex: 'a^3 + b^3 = (a + b)(a^2 - ab + b^2)',
          explanation: "Yig'indida birinchi qavs $(a+b)$, chala kvadratda minus ($-ab$).",
          example: '$x^3 + 8 = (x + 2)(x^2 - 2x + 4)$',
        },
        {
          title: 'Kublarning ayirmasi',
          latex: 'a^3 - b^3 = (a - b)(a^2 + ab + b^2)',
          explanation: "Ayirmada birinchi qavs $(a-b)$, chala kvadratda plyus ($+ab$).",
          example: '$27a^3 - 1 = (3a - 1)(9a^2 + 3a + 1)$',
        },
      ],
      keyPitfall: {
        title: "Chala kvadratga 2 koeffitsiyent qo'shib qo'yish",
        wrong: '$x^3 - 1 = (x - 1)(x^2 + 2x + 1)$',
        right: '$x^3 - 1 = (x - 1)(x^2 + x + 1)$',
        reason: "Bu yerda to'liq kvadrat emas, chala kvadrat ($x^2 + x + 1$) ishlatiladi.",
      },
    },
    problems: {
      orta: [
        {
          id: 't19-m-1',
          difficulty: 'orta',
          statement: "Ko'paytuvchilarga ajrating: $$x^3 - 27$$",
          answer: '(x - 3)(x^2 + 3x + 9)',
          acceptedEquivalents: ['(x-3)(x^2+3x+9)'],
          socraticHint: "$27 = 3^3$. Kublar ayirmasi formulasida $a = x$ va $b = 3$ qo'ying.",
          steps: [
            "$x^3 - 3^3 = (x - 3)(x^2 + 3x + 3^2)$.",
            "Natija: $(x - 3)(x^2 + 3x + 9)$.",
          ],
          sourceLabel: 'Usmonov uslubi · 19.1',
        },
      ],
      murakkab: [
        {
          id: 't19-h-1',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$\\frac{17^3 + 13^3}{30} - 17 \\cdot 13$$",
          answer: '16',
          acceptedEquivalents: ['16'],
          socraticHint: "Suratni kublar yig'indisi bilan ajrating: $17 + 13 = 30$ maxraj bilan qisqaradi! Qolgan ifoda qaysi ayirmaning kvadrati?",
          steps: [
            "$\\frac{(17+13)(17^2 - 17\\cdot 13 + 13^2)}{30} - 17 \\cdot 13 = 17^2 - 17 \\cdot 13 + 13^2 - 17 \\cdot 13$.",
            "$17^2 - 2 \\cdot 17 \\cdot 13 + 13^2 = (17 - 13)^2 = 4^2 = 16$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 19.11',
        },
      ],
    },
  },

  20: {
    topicId: 20,
    muammo: {
      headline: "Barcha algebra qurollarini bitta murakkab ifodada qanday uyg'unlashtiramiz?",
      contextLabel: "Yakuniy sintez · 1-bo'lim cho'qqisi",
      story: [
        "Haqiqiy olimpiada va DTM misollari ustida «bu yerda kvadratlar ayirmasini ishlat» deb yozib qo'yilmaydi. Ba'zan avval umumiy ko'paytuvchi chiqarish, keyin to'liq kvadrat ajratish va nihoyat kvadratlar ayirmasini qo'llash talab qilinadi.",
      ],
      coreQuestion:
        "Ixtiyoriy butun ifodani ko'rganda qaysi ketma-ketlikda fikrlash eng samarali natija beradi?",
      historicalNote:
        "20-mavzu 1-bo'limning barcha 17 ta oldingi mavzusini yagona strategiyaga jamlaydi.",
    },
    chegara: {
      headline: "Bitta formula bilan hal bo'lmaydigan aralash ifodalar",
      whatWorkedBefore: "Har bir qisqa ko'paytirish formulasini alohida-alohida qo'llashni o'rgandik.",
      breakingPoint:
        "$2x^3 - 18x$ yoki $a^2 - b^2 + 2b - 1$ kabi ifodalarga bitta formula to'g'ridan-to'g'ri tushmaydi.",
      deadEndExample:
        "Avval umumiy ko'paytuvchini chiqarmasdan qolgan amallarga o'tish misolni sun'iy murakkablashtiradi.",
      whyNewIdeaNeeded:
        "3 bosqichli oltin algoritm: (1) Umumiy ko'paytuvchi → (2) Qisqa ko'paytirish → (3) Guruhlash.",
    },
    intuisiya: {
      headline: "Qatlamlarni piyoz po'stidek ketma-ket ochish",
      analogyTitle: "Muhandisning diagnostika ro'yxati",
      analogyStory:
        "Har qanday murakkab ifodaga duch kelganda uchta savol bering: barcha hadlarda umumiy narsa bormi? Qisqa ko'paytirish formulasi ko'rinyaptimi? Hadlarni guruhlab yangi formula yasash mumkinmi?",
      guidedPrompts: [
        "Har bir qadamdan keyin hosil bo'lgan qavslarni yana ajratish mumkin-yo'qligini tekshiring.",
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 4, denA: 6, numB: 2, denB: 6 },
    },
    formula: {
      headline: "Butun ifodalarni shakl almashtirish oltin algoritmi",
      bridgeFromIntuition: "Oldingi 14–19-mavzularning barchasi bir tizimda ishlaydi.",
      items: [
        {
          title: '1-qadam: Umumiy ko‘paytuvchi',
          latex: '2x^3 - 18x = 2x(x^2 - 9) = 2x(x - 3)(x + 3)',
          explanation: "Har doim birinchi navbatda umumiy ko'paytuvchi bor-yo'qligini tekshiring.",
        },
        {
          title: '2-qadam: Guruhlab kvadratlar ayirmasiga o‘tish',
          latex: 'a^2 - b^2 + 2b - 1 = a^2 - (b - 1)^2 = (a - b + 1)(a + b - 1)',
          explanation: "Uchta hadni to'liq kvadratga yig'ib, to'rtinchi had bilan kvadratlar ayirmasini qo'llang.",
        },
      ],
      keyPitfall: {
        title: "Ajratishni yarim yo'lda to'xtatish",
        wrong: '$x^4 - 1 = (x^2 - 1)(x^2 + 1)$ (tugallanmagan)',
        right: '$x^4 - 1 = (x - 1)(x + 1)(x^2 + 1)$',
        reason: "$x^2 - 1$ yana kvadratlar ayirmasi bilan ajraladi — oxirigacha ajratish kerak.",
      },
    },
    problems: {
      orta: [
        {
          id: 't20-m-1',
          difficulty: 'orta',
          statement: "To'liq ko'paytuvchilarga ajrating: $$3x^2 - 12$$",
          answer: '3(x - 2)(x + 2)',
          acceptedEquivalents: ['3(x-2)(x+2)', '3(x+2)(x-2)'],
          socraticHint: "Avval umumiy ko'paytuvchi $3$ ni qavsdan tashqariga chiqaring. Qavs ichida nima qoldi?",
          steps: [
            "$3(x^2 - 4)$.",
            "Kvadratlar ayirmasi: $3(x - 2)(x + 2)$.",
          ],
          sourceLabel: 'Usmonov uslubi · 20.1',
        },
      ],
      murakkab: [
        {
          id: 't20-h-1',
          difficulty: 'murakkab',
          statement: "Soddalashtiring va $x = 5$ da qiymatini toping: $$(x + 2)^2 - (x - 2)(x + 2) - 4x$$",
          answer: '8',
          acceptedEquivalents: ['8'],
          socraticHint: "Qavslarni ochishdan oldin $(x + 2)$ ni umumiy ko'paytuvchi sifatida chiqarsangiz ancha tez bo'ladi!",
          steps: [
            "$(x + 2)[(x + 2) - (x - 2)] - 4x = (x + 2) \\cdot 4 - 4x$.",
            "$4x + 8 - 4x = 8$.",
            "Qiymat $x$ ga bog'liq emas, javob $8$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 20.15',
        },
      ],
    },
  },
};
