import type { SectionMeta, TopicMeta } from '../types/math';

export const CURRICULUM_SECTIONS: SectionMeta[] = [
  {
    id: 1,
    title: "1-bo'lim: Kasrlar, manfiy sonlar va ko'phadlar",
    rangeLabel: '3–20-mavzular',
  },
  {
    id: 2,
    title: "2-bo'lim: Ratsional kasrlar, chiziqli funksiya va tengsizliklar",
    rangeLabel: '21–32-mavzular',
  },
  {
    id: 3,
    title: "3-bo'lim: Kvadrat ildiz, kvadrat tenglama, parabola va progressiyalar",
    rangeLabel: '33–49 + Variant 35–42',
  },
  {
    id: 4,
    title: "4-bo'lim: Funksiyalar, n-darajali ildiz va amaliy masalalar",
    rangeLabel: '50–57-mavzular',
  },
  {
    id: 5,
    title: "5-bo'lim: Ko'rsatkichli va logarifmik funksiyalar va tenglamalar",
    rangeLabel: '58–68 + Variant 54–73',
  },
  {
    id: 6,
    title: "6-bo'lim: Trigonometriya asoslari, ayniyatlar va grafiklar",
    rangeLabel: '69–82-mavzular',
  },
  {
    id: 7,
    title: "7-bo'lim: Trigonometrik tenglamalar va tengsizliklar",
    rangeLabel: '83–94-mavzular',
  },
  {
    id: 8,
    title: "8-bo'lim: Matematik analiz — Limit, Hosila va Integral",
    rangeLabel: '95–107-mavzular',
  },
];

export const SECTION_ONE = CURRICULUM_SECTIONS[0];

const VARIANT_35_42: TopicMeta[] = Array.from({ length: 8 }, (_, idx) => {
  const num = 35 + idx;
  const startPage = 237 + idx * 3;
  return {
    id: 1000 + num,
    sectionId: 3,
    displayCode: `V${num}`,
    title: `Variant ${num} — Mustahkamlovchi to'plam`,
    shortDesc: `M. Usmonov to'plami: ${num}-variant aralash masalalar va testlar`,
    pageRange: [startPage, startPage + 2],
    isVariant: true,
    variantGroup: '35-42',
  };
});

const VARIANT_54_73: TopicMeta[] = Array.from({ length: 20 }, (_, idx) => {
  const num = 54 + idx;
  const startPage = 371 + idx * 3;
  return {
    id: 2000 + num,
    sectionId: 5,
    displayCode: `V${num}`,
    title: `Variant ${num} — Yakuniy nazorat to'plami`,
    shortDesc: `M. Usmonov to'plami: ${num}-variant murakkab aralash misollar`,
    pageRange: [startPage, startPage + 2],
    isVariant: true,
    variantGroup: '54-73',
  };
});

export const TOPICS_META: TopicMeta[] = [
  // ===================== 1-BO'LIM (3–20) =====================
  { id: 3, sectionId: 1, title: 'Oddiy kasrlar ustida amallar', shortDesc: "Bo'laklarni qo'shish, ayirish, ko'paytirish va bo'lish", pageRange: [15, 22] },
  { id: 4, sectionId: 1, title: "O'nli kasrlarga doir misollar", shortDesc: "O'nlik sanoq tizimida ulushlar va aniq hisoblashlar", pageRange: [23, 25] },
  { id: 5, sectionId: 1, title: "Oddiy va o'nli kasrlar birgalikda", shortDesc: "Aralash ifodalarni qulay shaklga o'tkazish strategiyasi", pageRange: [26, 27] },
  { id: 6, sectionId: 1, title: "Cheksiz o'nli davriy kasrlar", shortDesc: "Takrorlanuvchi raqamlar ketma-ketligini oddiy kasrga aylantirish", pageRange: [28, 28] },
  { id: 7, sectionId: 1, title: 'Musbat va manfiy sonlar ustida amallar', shortDesc: "Yo'nalishli miqdorlar, ishoralar qoidasi va modul", pageRange: [29, 30] },
  { id: 8, sectionId: 1, title: 'Ifodalarni shakl almashtirish', shortDesc: "Qavslarni ochish va o'xshash hadlarni ixchamlash", pageRange: [33, 33] },
  { id: 9, sectionId: 1, title: "Bir o'zgaruvchili chiziqli tenglama", shortDesc: "Tarozi muvozanati tamoyili bilan noma'lumni topish", pageRange: [34, 36] },
  { id: 10, sectionId: 1, title: 'Daraja va uning xossalari', shortDesc: "Takroriy ko'paytirishni ixcham yozish va daraja qonunlari", pageRange: [37, 39] },
  { id: 11, sectionId: 1, title: 'Birhadlar', shortDesc: "Birhadning standart shakli, koeffitsiyenti va darajasi", pageRange: [40, 42] },
  { id: 12, sectionId: 1, title: "Ko'phadlarning yig'indisi va ayirmasi", shortDesc: "Ko'phadlarni standart shaklga keltirish va birlashtirish", pageRange: [43, 45] },
  { id: 13, sectionId: 1, title: "Ko'phad bilan birhadning ko'paytmasi", shortDesc: "Taqsimot qonuni orqali qavslarni kengaytirish", pageRange: [46, 48] },
  { id: 14, sectionId: 1, title: "Ko'phadni ko'paytuvchilarga ajratish", shortDesc: "Umumiy ko'paytuvchini qavsdan tashqariga chiqarish va guruhlash", pageRange: [49, 53] },
  { id: 15, sectionId: 1, title: "Ko'phadlarning ko'paytmasi", shortDesc: "Har bir hadni har bir hadga ko'paytirish va yuzalar modeli", pageRange: [54, 57] },
  { id: 16, sectionId: 1, title: "Yig'indining va ayirmaning kvadrati", shortDesc: "Kvadrat yuzasini bo'laklash orqali qisqa ko'paytirish", pageRange: [58, 61] },
  { id: 17, sectionId: 1, title: "Yig'indining va ayirmaning kubi", shortDesc: "Fazoviy kub hajmini bo'laklash va uch darajali yoyilma", pageRange: [62, 64] },
  { id: 18, sectionId: 1, title: 'Kvadratlar ayirmasi', shortDesc: "Kvadratdan kichik kvadratni kesib olib to'rtburchak yasash", pageRange: [65, 68] },
  { id: 19, sectionId: 1, title: "Kublarning yig'indisi va ayirmasi", shortDesc: "Uchinchi darajali ifodalarni tezkor ko'paytuvchiga ajratish", pageRange: [69, 72] },
  { id: 20, sectionId: 1, title: 'Butun ifodalarni shakl almashtirish', shortDesc: "Barcha qisqa ko'paytirish va guruhlash usullarini birlashtirish", pageRange: [73, 78] },

  // ===================== 2-BO'LIM (21–32) =====================
  { id: 21, sectionId: 2, title: 'Ratsional kasrlar va ularni qisqartirish', shortDesc: "Ko'phadlar nisbatini qisqartirish va aniqlanish sohasi", pageRange: [79, 83] },
  { id: 22, sectionId: 2, title: 'Ratsional kasrlar ustida amallar', shortDesc: "Umumiy maxraj topish, ko'paytirish va bo'lish", pageRange: [84, 90] },
  { id: 23, sectionId: 2, title: 'Chiziqli funksiya va uning grafigi', shortDesc: "To'g'ri chiziq qiyaligi k va siljishi b ni tahlil qilish", pageRange: [91, 95] },
  { id: 24, sectionId: 2, title: "Ikki o'zgaruvchili chiziqli tenglamalar sistemasi", shortDesc: "O'rniga qo'yish, qo'shish va grafik kesishish usullari", pageRange: [96, 102] },
  { id: 25, sectionId: 2, title: 'Matnli masalalar: harakatga doir masalalar', shortDesc: "Uchrashuv, quvish, oqim bo'ylab va oqimga qarshi harakat", pageRange: [103, 108] },
  { id: 26, sectionId: 2, title: 'Matnli masalalar: aralashma va foiz', shortDesc: "Konsentratsiya, qotishma va foiz o'zgarishlarini modellashtirish", pageRange: [109, 113] },
  { id: 27, sectionId: 2, title: 'Matnli masalalar: birgalikda ishlash', shortDesc: "Mehnat unumdorligi, kranlar va umumiy vaqtni topish", pageRange: [114, 117] },
  { id: 28, sectionId: 2, title: 'Sonli tengsizliklar va ularning xossalari', shortDesc: "Tengsizliklarni qo'shish, ko'paytirish va manfiy songa bo'lish", pageRange: [118, 121] },
  { id: 29, sectionId: 2, title: "Bir o'zgaruvchili chiziqli tengsizliklar", shortDesc: "Sonlar o'qida yechimlar to'plamini shtrixlash", pageRange: [122, 125] },
  { id: 30, sectionId: 2, title: 'Chiziqli tengsizliklar sistemasi', shortDesc: "Oraliqlar kesishmasini topish va qo'sh tengsizliklar", pageRange: [126, 129] },
  { id: 31, sectionId: 2, title: 'Modulli chiziqli tenglamalar', shortDesc: "Sonlar o'qidagi masofa tamoyili: |x - a| = r", pageRange: [130, 133] },
  { id: 32, sectionId: 2, title: 'Modulli chiziqli tengsizliklar', shortDesc: "Markazdan yaqin (|x - a| < r) va uzoq (|x - a| > r) oraliqlar", pageRange: [134, 138] },

  // ===================== 3-BO'LIM (33–49 + Variant 35–42) =====================
  { id: 33, sectionId: 3, title: 'Arifmetik kvadrat ildiz va uning xossalari', shortDesc: "Kvadrat yuzasidan tomon uzunligini tiklash", pageRange: [139, 144] },
  { id: 34, sectionId: 3, title: 'Kvadrat ildizli ifodalarni shakl almashtirish', shortDesc: "Ko'paytuvchini ildizdan chiqarish va maxrajni irratsionallikdan qutqarish", pageRange: [145, 150] },
  { id: 35, sectionId: 3, title: 'Kvadrat tenglama va diskriminant formulasi', shortDesc: "To'liq kvadrat ajratish orqali ildizlar formulasini keltirib chiqarish", pageRange: [151, 156] },
  { id: 36, sectionId: 3, title: 'Viyet teoremasi va uning tatbiqlari', shortDesc: "Ildizlar yig'indisi, ko'paytmasi va kvadrat uchhadni ajratish", pageRange: [157, 162] },
  { id: 37, sectionId: 3, title: 'Bikvadrat va ratsional tenglamalar', shortDesc: "Yangi o'zgaruvchi kiritish va chet ildizlarni tekshirish", pageRange: [163, 168] },
  { id: 38, sectionId: 3, title: 'Kvadrat tengsizliklar va intervallar usuli', shortDesc: "Parabola ishorasi va sonlar o'qida oraliqlarni ajratish", pageRange: [169, 174] },
  { id: 39, sectionId: 3, title: 'Kvadrat funksiya va parabola grafigi', shortDesc: "Tepa nuqta, simmetriya o'qi va a, b, c koeffitsiyentlar ta'siri", pageRange: [175, 180] },
  { id: 40, sectionId: 3, title: 'Ikkinchi darajali tenglamalar sistemasi', shortDesc: "Chiziqli-kvadrat va simmetrik sistemalarni yechish", pageRange: [181, 186] },
  { id: 41, sectionId: 3, title: 'Kvadrat tenglama tuzishga doir matnli masalalar', shortDesc: "Geometrik, harakat va ish unumdorligi masalalari", pageRange: [187, 192] },
  { id: 42, sectionId: 3, title: 'Irratsional tenglamalar', shortDesc: "Kvadratga oshirish, aniqlanish sohasi va tekshirish", pageRange: [193, 198] },
  { id: 43, sectionId: 3, title: 'Irratsional tengsizliklar', shortDesc: "Ildiz osti shartlari va teng kuchli sistemalarga o'tish", pageRange: [199, 204] },
  { id: 44, sectionId: 3, title: 'Parametrli chiziqli tenglama va tengsizliklar', shortDesc: "Parametr qiymatiga ko'ra yechimlar sonini tahlil qilish", pageRange: [205, 209] },
  { id: 45, sectionId: 3, title: 'Parametrli kvadrat tenglamalar', shortDesc: "Diskriminant va Viyet shartlari bilan parametrni topish", pageRange: [210, 215] },
  { id: 46, sectionId: 3, title: 'Modulli va kasr-ratsional tengsizliklar', shortDesc: "Oraliqlar usulida juft/toq karrali ildizlar qoidasi", pageRange: [216, 220] },
  { id: 47, sectionId: 3, title: 'Arifmetik progressiya', shortDesc: "Teng qadamli sonlar ketma-ketligi va n ta had yig'indisi", pageRange: [221, 226] },
  { id: 48, sectionId: 3, title: 'Geometrik progressiya', shortDesc: "Teng karrali o'sish va cheksiz kamayuvchi yig'indi", pageRange: [227, 231] },
  { id: 49, sectionId: 3, title: 'Progressiyalarga doir matnli va aralash masalalar', shortDesc: "Bank foizlari, bosqichli harakat va aralash ketma-ketliklar", pageRange: [232, 236] },
  ...VARIANT_35_42,

  // ===================== 4-BO'LIM (50–57) =====================
  { id: 50, sectionId: 4, title: "Funksiya, aniqlanish sohasi va qiymatlar to'plami", shortDesc: "Kirish-chiqish qoidasi, D(f) va E(f) ni grafikda o'qish", pageRange: [261, 266] },
  { id: 51, sectionId: 4, title: 'Juft-toqlik, monotonlik va teskari funksiya', shortDesc: "Simmetriya, o'sish oraliqlari va y = x ga nisbatan aks ettirish", pageRange: [267, 272] },
  { id: 52, sectionId: 4, title: 'n-darajali ildiz va uning xossalari', shortDesc: "Juft va toq darajali ildizlar orasidagi muhim farqlar", pageRange: [273, 278] },
  { id: 53, sectionId: 4, title: "Ratsional ko'rsatkichli daraja", shortDesc: "Kasr ko'rsatkichli darajalar bilan tez hisoblash", pageRange: [279, 283] },
  { id: 54, sectionId: 4, title: 'Darajali ifodalarni soddalashtirish', shortDesc: "Kasr darajalar va qisqa ko'paytirish formulalari sintezi", pageRange: [284, 289] },
  { id: 55, sectionId: 4, title: 'Murakkab ildizli ifodalar ustida amallar', shortDesc: "Ichma-ich ildizlar va murakkab radikalni ochish", pageRange: [290, 294] },
  { id: 56, sectionId: 4, title: 'Foiz, nisbat va proporsiyaga doir amaliy masalalar', shortDesc: "Murakkab foizlar, soliq, chegirma va qotishmalar", pageRange: [295, 300] },
  { id: 57, sectionId: 4, title: 'Harakat, ish va aralashma murakkab masalalari', shortDesc: "Ko'p bosqichli matnli masalalarni sxematik yechish", pageRange: [301, 306] },

  // ===================== 5-BO'LIM (58–68 + Variant 54–73) =====================
  { id: 58, sectionId: 5, title: "Ko'rsatkichli funksiya va uning grafigi", shortDesc: "a > 1 o'sish va 0 < a < 1 kamayish eksponensial egri chizig'i", pageRange: [307, 311] },
  { id: 59, sectionId: 5, title: "Ko'rsatkichli tenglamalar", shortDesc: "Bir xil asosga keltirish, guruhlash va almashtirish", pageRange: [312, 318] },
  { id: 60, sectionId: 5, title: "Ko'rsatkichli tengsizliklar", shortDesc: "Asos 0 < a < 1 bo'lganda tengsizlik ishorasining almashishi", pageRange: [319, 324] },
  { id: 61, sectionId: 5, title: 'Logarifm tushunchasi va logarifmik funksiya grafigi', shortDesc: "Daraja ko'rsatkichini topuvchi teskari amal", pageRange: [325, 330] },
  { id: 62, sectionId: 5, title: 'Logarifmning asosiy xossalari', shortDesc: "Ko'paytmani yig'indiga, darajani ko'paytuvchiga aylantirish", pageRange: [331, 336] },
  { id: 63, sectionId: 5, title: 'Logarifmik ifodalarni shakl almashtirish', shortDesc: "Yangi asosga o'tish formulasi va murakkab hisoblashlar", pageRange: [337, 342] },
  { id: 64, sectionId: 5, title: "Logarifmik va ko'rsatkichli funksiyalar tahlili", shortDesc: "Asimptotalar, aniqlanish sohasi va qiymatlar to'plami", pageRange: [343, 347] },
  { id: 65, sectionId: 5, title: 'Logarifmik tenglamalar', shortDesc: "Potensiallash, asos shartlari (a > 0, a ≠ 1) va tekshirish", pageRange: [348, 354] },
  { id: 66, sectionId: 5, title: 'Logarifmik tengsizliklar', shortDesc: "Aniqlanish sohasi va monotonlik bilan aniq oraliq topish", pageRange: [355, 360] },
  { id: 67, sectionId: 5, title: "Ko'rsatkichli va logarifmik tenglamalar sistemasi", shortDesc: "Sistemalarni almashtirish va grafik kesishish tahlili", pageRange: [361, 365] },
  { id: 68, sectionId: 5, title: "Aralash ko'rsatkichli-logarifmik masalalar", shortDesc: "Logarifmlash usuli va DTM darajasidagi murakkab misollar", pageRange: [366, 370] },
  ...VARIANT_54_73,

  // ===================== 6-BO'LIM (69–82) =====================
  { id: 69, sectionId: 6, title: "Burchakning radian o'lchovi va birlik aylana", shortDesc: "Gradus va radian bog'lanishi, aylanada aylanish", pageRange: [431, 436] },
  { id: 70, sectionId: 6, title: "Sinus, kosinus, tangens va kotangens ta'riflari", shortDesc: "Birlik aylanadagi koordinatalar va proyeksiyalar", pageRange: [437, 442] },
  { id: 71, sectionId: 6, title: 'Trigonometrik funksiyalarning choraklardagi ishoralari', shortDesc: "I–IV choraklarda sin, cos, tan, cot ishoralari va jadvallar", pageRange: [443, 447] },
  { id: 72, sectionId: 6, title: 'Asosiy trigonometrik ayniyatlar', shortDesc: "Pifagor ayniyati: sin²α + cos²α = 1 va uning natijalari", pageRange: [448, 454] },
  { id: 73, sectionId: 6, title: 'Keltirish formulalari', shortDesc: "Chorak ishorasi va nom o'zgarishi qoidasi (π/2 vs π)", pageRange: [455, 460] },
  { id: 74, sectionId: 6, title: "Qo'shish formulalari", shortDesc: "sin(α ± β), cos(α ± β) va tan(α ± β) ni qo'llash", pageRange: [461, 467] },
  { id: 75, sectionId: 6, title: 'Ikkilangan burchak formulalari', shortDesc: "sin 2α, cos 2α ning 3 xil ko'rinishi va daraja pasaytirish", pageRange: [468, 474] },
  { id: 76, sectionId: 6, title: 'Yarim burchak formulalari', shortDesc: "α/2 burchak funksiyalarini cos α orqali ifodalash", pageRange: [475, 480] },
  { id: 77, sectionId: 6, title: "Yig'indini ko'paytmaga aylantirish", shortDesc: "sin α ± sin β va cos α ± cos β formulalari", pageRange: [481, 486] },
  { id: 78, sectionId: 6, title: "Ko'paytmani yig'indiga aylantirish", shortDesc: "sin α · cos β va o'xshash ko'paytmalarni yoyish", pageRange: [487, 492] },
  { id: 79, sectionId: 6, title: 'Trigonometrik ifodalarni soddalashtirish', shortDesc: "Barcha trigonometrik ayniyatlarni uyg'unlashtirib hisoblash", pageRange: [493, 499] },
  { id: 80, sectionId: 6, title: 'Teskari trigonometrik funksiyalar', shortDesc: "arcsin, arccos, arctan, arccot va ularning qiymatlar sohasi", pageRange: [500, 505] },
  { id: 81, sectionId: 6, title: 'Teskari trigonometrik ifodalarni hisoblash', shortDesc: "Murakkab tarkibli trigonometrik-teskari ifodalar", pageRange: [506, 512] },
  { id: 82, sectionId: 6, title: 'Trigonometrik funksiyalarning davri va grafiklari', shortDesc: "Sinusoida, kosinusoida, amplituda va davrni topish", pageRange: [513, 518] },

  // ===================== 7-BO'LIM (83–94) =====================
  { id: 83, sectionId: 7, title: 'Eng sodda trigonometrik tenglamalar (sin x, cos x)', shortDesc: "Birlik aylanada cheksiz yechimlar oilasini yozish", pageRange: [519, 525] },
  { id: 84, sectionId: 7, title: 'Tangens va kotangensli tenglamalar', shortDesc: "π davrli yechimlar va aniqlanish sohasi nazorati", pageRange: [526, 531] },
  { id: 85, sectionId: 7, title: 'Kvadrat tenglamaga keltiriladigan trigonometrik tenglamalar', shortDesc: "Asosiy ayniyat yordamida bitta funksiyaga o'tish", pageRange: [532, 538] },
  { id: 86, sectionId: 7, title: 'Bir jinsli trigonometrik tenglamalar', shortDesc: "1- va 2-darajali bir jinsli tenglamalarni cos x ga bo'lish", pageRange: [539, 544] },
  { id: 87, sectionId: 7, title: 'Yordamchi burchak usuli', shortDesc: "a sin x + b cos x = c ko'rinishidagi tenglamalar", pageRange: [545, 550] },
  { id: 88, sectionId: 7, title: "Ko'paytuvchilarga ajratish orqali trigonometrik tenglamalar", shortDesc: "Yig'indini ko'paytmaga o'tkazib nolga tenglash", pageRange: [551, 557] },
  { id: 89, sectionId: 7, title: 'Universal almashtirish usuli', shortDesc: "tan(x/2) = t orqali ratsional tenglamaga o'tish", pageRange: [558, 563] },
  { id: 90, sectionId: 7, title: 'Chegaralanganlik va baholash usuli', shortDesc: "|sin x| ≤ 1 va |cos x| ≤ 1 chegaralaridan foydalanish", pageRange: [564, 569] },
  { id: 91, sectionId: 7, title: 'Trigonometrik tenglamalar sistemasi', shortDesc: "Ikki burchakli trigonometrik sistemalarni yechish", pageRange: [570, 575] },
  { id: 92, sectionId: 7, title: 'Eng sodda trigonometrik tengsizliklar', shortDesc: "Birlik aylanada yoy bo'ylab yechim oralig'ini o'qish", pageRange: [576, 582] },
  { id: 93, sectionId: 7, title: 'Tangens va kotangensli tengsizliklar', shortDesc: "Tangens chizig'i va asimptotalar orasidagi oraliqlar", pageRange: [583, 588] },
  { id: 94, sectionId: 7, title: 'Murakkab trigonometrik tenglama va tengsizliklar', shortDesc: "Oraliqdagi ildizlar sonini sanash va aralash sinovlar", pageRange: [589, 595] },

  // ===================== 8-BO'LIM (95–107) =====================
  { id: 95, sectionId: 8, title: 'Funksiyaning limiti va uzluksizligi', shortDesc: "Cheksiz yaqinlashish g'oyasi va 0/0 aniqmaslikni ochish", pageRange: [596, 602] },
  { id: 96, sectionId: 8, title: "Hosila tushunchasi, geometrik va fizik ma'nosi", shortDesc: "Oniy tezlik va egri chiziq urinmasining burchak koeffitsiyenti", pageRange: [603, 609] },
  { id: 97, sectionId: 8, title: 'Hosila olish qoidalari', shortDesc: "Yig'indi, ko'paytma va bo'linmaning hosilasi", pageRange: [610, 616] },
  { id: 98, sectionId: 8, title: 'Murakkab funksiyaning hosilasi', shortDesc: "Zanjir qoidasi: ichki va tashqi funksiya hosilalari ko'paytmasi", pageRange: [617, 623] },
  { id: 99, sectionId: 8, title: "Trigonometrik, ko'rsatkichli va logarifmik funksiyalar hosilasi", shortDesc: "Elementar funksiyalar hosila jadvali va tatbiqlari", pageRange: [624, 630] },
  { id: 100, sectionId: 8, title: 'Urinma tenglamasi', shortDesc: "Berilgan nuqtada egri chiziqqa o'tkazilgan urinma", pageRange: [631, 637] },
  { id: 101, sectionId: 8, title: "Funksiyaning o'sish va kamayish oraliqlari", shortDesc: "f'(x) > 0 va f'(x) < 0 orqali monotonlikni aniqlash", pageRange: [638, 644] },
  { id: 102, sectionId: 8, title: 'Ekstremum nuqtalari (maksimum va minimum)', shortDesc: "Kritik nuqtalar va hosila ishorasi o'zgarishi mezoni", pageRange: [645, 651] },
  { id: 103, sectionId: 8, title: 'Kesmadagi eng katta va eng kichik qiymat', shortDesc: "Chekka nuqtalar va kritik nuqtalarni solishtirish", pageRange: [652, 658] },
  { id: 104, sectionId: 8, title: "Boshlang'ich funksiya va aniqmas integral", shortDesc: "Hosilaga teskari amal va C integrallash doimiysi", pageRange: [659, 665] },
  { id: 105, sectionId: 8, title: 'Aniq integral va Nyuton–Leybnis formulasi', shortDesc: "Riman to'rtburchaklarining aniq yuzaga intilishi", pageRange: [666, 672] },
  { id: 106, sectionId: 8, title: 'Egri chiziqli trapetsiyaning yuzini hisoblash', shortDesc: "Ikki grafik orasidagi yuzani aniq integral bilan topish", pageRange: [673, 679] },
  { id: 107, sectionId: 8, title: 'Hosila va integralga doir optimallashtirish masalalari', shortDesc: "Maksimal hajm, minimal xarajat va fizik masalalar", pageRange: [680, 686] },
];
