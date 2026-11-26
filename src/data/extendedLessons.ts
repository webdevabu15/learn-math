import type { MathProblem, TopicLesson, TopicMeta } from '../types/math';
import { resolveSimulatorForTopic } from '../utils/simulatorRouting';

/**
 * Handcrafted First-Principles flagship lessons across Sections 2–8
 * (100% natural Uzbek Latin script + clean KaTeX).
 */
export const EXTENDED_FLAGSHIP_LESSONS: Record<number, TopicLesson> = {
  23: {
    topicId: 23,
    muammo: {
      headline: "Bir xil tezlikdagi jarayonni bir qarashda qanday ko‘rish mumkin?",
      contextLabel: "Fizika, iqtisodiyot va grafik fikrlash",
      story: [
        "Taksi hisoblagichi mashinaga o‘tirishingiz bilan 5000 so‘m boshlang‘ich narx yozadi, so‘ng har bir kilometr uchun yana 3000 so‘m qo‘shib boradi. 1 km, 2 km, 7 km va 15 km uchun narxni har safar jadvaldan qidirish noqulay.",
        "Agar masofa va narx orasidagi bog‘lanishni tekislikdagi nuqtalar bilan tasvirlasak, barcha nuqtalar bitta to‘g‘ri chiziq ustiga tushadi. Chiziqning qiyaligi kilometr narxini, vertikal o‘qni kesish nuqtasi esa boshlang‘ich to‘lovni darhol ko‘rsatadi."
      ],
      coreQuestion: "Biror kattalik ikkinchisiga qarab bir tekis o‘zgarganda, barcha holatlarni bitta geometrik chiziq bilan qanday ifodalaymiz?",
      historicalNote: "Rene Dekart XVII asrda koordinatalar tekisligini kiritib, algebraik tenglamalarni ko‘z bilan ko‘rish mumkin bo‘lgan geometrik chiziqlarga bog‘ladi."
    },
    chegara: {
      headline: "Jadval chekli, bog‘lanish esa cheksiz",
      whatWorkedBefore: "Alohida sonlar uchun arifmetik hisob-kitob va jadval tuzish yetarli edi.",
      breakingPoint: "Jadvalda faqat 5–10 ta qiymat ko‘rinadi; oraliq qiymatlar (masalan, 3,4 km) yoki ikki tarif qaysi masofada tenglashishini jadvaldan darhol topish qiyin.",
      deadEndExample: "Ikki taksi kompaniyasidan qaysi biri 8 km dan keyin arzonroq bo‘lishini sonlarni birma-bir qo‘yib tekshirish vaqt oladi.",
      whyNewIdeaNeeded: "Har bir kirish qiymatiga aniq bitta chiqish qiymatini mos qo‘yuvchi chiziqli funksiya va uning grafigi butun jarayonni bir nigohda ochib beradi."
    },
    intuisiya: {
      headline: "Qiyalik va boshlang‘ich balandlikni jonli sinab ko‘ring",
      analogyTitle: "Zinapoya qiyaligi va boshlang‘ich qavat",
      analogyStory: "Chiziqli grafikni zinapoya deb tasavvur qiling: boshlang‘ich balandlik (siljish) siz qaysi qavatdan chiqishni boshlaganingizni bildiradi, qiyalik esa har bir qadamda necha pog‘ona yuqoriga ko‘tarilishingizni yoki pastga tushishingizni ko‘rsatadi.",
      guidedPrompts: [
        "Qiyalik slayderini musbatdan manfiyga o‘tkazing: to‘g‘ri chiziq yo‘nalishi qanday o‘zgaradi?",
        "Qiyalikni nolga tenglashtiring: gorizontal chiziq qanday holatni bildiradi?",
        "Siljish slayderini o‘zgartiring va vertikal o‘q bilan kesishish nuqtasini kuzating."
      ],
      defaultSimulatorMode: 'numberline',
      defaultPreset: { numA: 3, denA: 2, numB: 1, denB: 2 }
    },
    formula: {
      headline: "Chiziqli funksiya: $y = kx + b$",
      bridgeFromIntuition: "Koordinata tekisligida kuzatgan ikki asosiy boshqaruv — qiyalik $k$ va vertikal siljish $b$ — chiziqli funksiyani to‘liq aniqlaydi.",
      items: [
        {
          title: "Umumiy ko‘rinish",
          latex: "y = kx + b",
          explanation: "Bu yerda $k$ — burchak koeffitsiyenti (qiyalik), $b$ esa grafikning $Oy$ o‘qini kesib o‘tish ordinatasi.",
          example: "$y = 2x - 4$ grafigi $Oy$ o‘qini $(0; -4)$ nuqtada kesadi."
        },
        {
          title: "O‘sish va kamayish sharti",
          latex: "k > 0 \\Rightarrow \\text{o‘suvchi}, \\quad k < 0 \\Rightarrow \\text{kamayuvchi}",
          explanation: "Agar $k = 0$ bo‘lsa, $y = b$ o‘zgarmas funksiya hosil bo‘ladi va grafik $Ox$ o‘qiga parallel bo‘ladi.",
          example: "$y = -3x + 5$ funksiyada $k = -3 < 0$, demak u kamayuvchi."
        },
        {
          title: "Ox o‘qi bilan kesishish (nol nuqta)",
          latex: "kx + b = 0 \\Rightarrow x_0 = -\\frac{b}{k} \\quad (k \\neq 0)",
          explanation: "Grafik abssissalar o‘qini $y = 0$ bo‘lgan nuqtada kesib o‘tadi.",
          example: "$y = 2x - 6$ uchun $x_0 = 3$, ya’ni $(3; 0)$ nuqta."
        },
        {
          title: "Parallellik sharti",
          latex: "k_1 = k_2, \\; b_1 \\neq b_2 \\Rightarrow y_1 \\parallel y_2",
          explanation: "Qiyaliklari teng, siljishlari turlicha bo‘lgan ikki to‘g‘ri chiziq hech qachon kesishmaydi.",
          example: "$y = 3x + 1$ va $y = 3x - 5$ parallel."
        }
      ],
      keyPitfall: {
        title: "Ko‘p uchraydigan xato: $k$ va $b$ ning o‘rnini almashtirish",
        wrong: "$y = 5 - 2x$ funksiyada $k = 5$ va $b = -2$ deb olish.",
        right: "$y = -2x + 5$ ko‘rinishida yozib, $k = -2$ (x oldidagi son) va $b = 5$ deb olish.",
        reason: "Burchak koeffitsiyenti har doim $x$ o‘zgaruvchisiga ko‘paytirilgan sondir, qaysi o‘rinda yozilishidan qat’i nazar."
      }
    },
    problems: {
      orta: [
        {
          id: 't23-m-1',
          difficulty: 'orta',
          statement: "$y = 3x - 9$ chiziqli funksiyaning $Ox$ o‘qi bilan kesishish nuqtasining abssissasini toping.",
          answer: '3',
          acceptedEquivalents: ['x = 3', '3.0'],
          socraticHint: "Grafik $Ox$ o‘qini kesganda $y$ ning qiymati nechaga teng bo‘ladi?",
          steps: [
            "$Ox$ o‘qida $y = 0$ shart bajariladi.",
            "$3x - 9 = 0$ tenglamani yechamiz.",
            "$3x = 9 \\Rightarrow x = 3$."
          ],
          sourceLabel: "Usmonov uslubi · 23-mavzu"
        },
        {
          id: 't23-m-2',
          difficulty: 'orta',
          statement: "$y = kx + 4$ funksiyaning grafigi $A(2; 10)$ nuqtadan o‘tadi. $k$ koeffitsiyentni toping.",
          answer: '3',
          acceptedEquivalents: ['k = 3'],
          socraticHint: "Nuqta grafikda yotishi uchun uning $(x; y)$ koordinatalarini tenglamaga o‘rniga qo‘yib ko‘ring.",
          steps: [
            "$x = 2$ va $y = 10$ ni $y = kx + 4$ ga qo‘yamiz.",
            "$10 = 2k + 4 \\Rightarrow 2k = 6$.",
            "$k = 3$."
          ],
          sourceLabel: "Usmonov uslubi · 23-mavzu"
        },
        {
          id: 't23-m-3',
          difficulty: 'orta',
          statement: "$y = 2x - 1$ va $y = -x + 5$ to‘g‘ri chiziqlar kesishish nuqtasining abssissasini ($x$) toping.",
          answer: '2',
          acceptedEquivalents: ['x = 2'],
          socraticHint: "Kesishish nuqtasida har ikki funksiyaning $y$ qiymati teng bo‘ladi.",
          steps: [
            "$2x - 1 = -x + 5$ tenglamani tuzamiz.",
            "$3x = 6 \\Rightarrow x = 2$."
          ],
          sourceLabel: "Usmonov uslubi · 23-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't23-h-1',
          difficulty: 'murakkab',
          statement: "$y = -2x + 6$ to‘g‘ri chiziq va koordinata o‘qlari bilan chegaralangan uchburchakning yuzini toping.",
          answer: '9',
          acceptedEquivalents: ['9.0'],
          socraticHint: "To‘g‘ri chiziqning $Ox$ va $Oy$ o‘qlari bilan kesishish nuqtalarini toping: ular to‘g‘ri burchakli uchburchakning katetlarini beradi.",
          steps: [
            "$Oy$ o‘qi bilan kesishish: $x = 0 \\Rightarrow y = 6$ (katet $a = 6$).",
            "$Ox$ o‘qi bilan kesishish: $-2x + 6 = 0 \\Rightarrow x = 3$ (katet $b = 3$).",
            "Yuza: $S = \\frac{1}{2} \\cdot 6 \\cdot 3 = 9$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        },
        {
          id: 't23-h-2',
          difficulty: 'murakkab',
          statement: "$A(1; 2)$ va $B(5; 10)$ nuqtalardan o‘tuvchi to‘g‘ri chiziq $y = kx + b$ ning $k + b$ qiymatini toping.",
          answer: '2',
          acceptedEquivalents: ['2.0'],
          socraticHint: "Avval $k = \\frac{y_2 - y_1}{x_2 - x_1}$ orqali qiyalikni, so‘ng nuqtalardan birini qo‘yib $b$ ni toping.",
          steps: [
            "$k = \\frac{10 - 2}{5 - 1} = \\frac{8}{4} = 2$.",
            "$2 = 2(1) + b \\Rightarrow b = 0$.",
            "Natija: $k + b = 2 + 0 = 2$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  },

  25: {
    topicId: 25,
    muammo: {
      headline: "Ikki mashina bir-biriga qarab yo‘lga chiqsa, qachon uchrashadi?",
      contextLabel: "Transport, logistika va vaqtni rejalashtirish",
      story: [
        "Toshkent va Samarqand oralig‘i 300 km. Ikki avtomobil bir vaqtda bir-biriga qarab yo‘lga chiqdi: biri soatiga 60 km, ikkinchisi 40 km tezlikda. Qaysi vaqtda ular uchrashadi?",
        "Matnli masalalarda eng katta qiyinchilik — so‘zlarni chizmaga aylantirmasdan darhol tenglama tuzishga urinish. Yo‘lni chiziq, tezlikni esa strelka bilan tasvirlasak, yechim o‘z-o‘zidan ko‘rinadi."
      ],
      coreQuestion: "Bir nechta jism bir vaqtda harakatlanganda, ularning yo‘li, tezligi va vaqtini qanday yagona modelga keltiramiz?",
      historicalNote: "Qadimgi Bobil va Xitoy matematik qo‘lyozmalarida karvonlar va choparlar uchrashuvini hisoblash eng mashhur amaliy masalalar bo‘lgan."
    },
    chegara: {
      headline: "So‘zlarni yoddan saqlash chalg‘itadi",
      whatWorkedBefore: "Bitta jismning bosib o‘tgan yo‘lini oddiy ko‘paytirish bilan topish oson edi.",
      breakingPoint: "Ikki jism qarama-qarshi yurganida, bir-birini quvganida yoki daryo oqimi ta’sir qilganida tezliklar qachon qo‘shilishini va qachon ayirilishini yodlab olish xatoga olib keladi.",
      deadEndExample: "Oqimga qarshi yurgan qayiq tezligiga oqim tezligini adashib qo‘shib yuborish.",
      whyNewIdeaNeeded: "Harakatni vizual sxema (chizma) ko‘rinishida tasvirlash nisbiy tezlik ma’nosini bir zumda tushunarli qiladi."
    },
    intuisiya: {
      headline: "Harakat, aralashma va ish masalalarini chizmada jonlantiring",
      analogyTitle: "Ikki tomondan qisqarayotgan arqon",
      analogyStory: "Ikki mashina bir-biriga qarab harakatlanganda, ular orasidagi masofa har soatda ikkala tezlik yig‘indisiga qisqaradi — xuddi ikki kishi uzun arqonni ikki uchidan bir vaqtda o‘rab olayotgandek.",
      guidedPrompts: [
        "Harakat modelida vaqt slayderini suring va ikki mashina qaysi soatda uchrashishini kuzating.",
        "Birinchi mashina tezligini oshiring: uchrashuv nuqtasi qaysi tomonga siljiydi?",
        "Istasangiz pastdagi AI SVG diagramma generatoriga o‘z matnli masalangizni yozib chizma yarating."
      ],
      defaultSimulatorMode: 'numberline',
      defaultPreset: { numA: 3, denA: 5, numB: 2, denB: 5 }
    },
    formula: {
      headline: "Harakat masalalarining asosiy bog‘lanishlari",
      bridgeFromIntuition: "Chizmada ko‘rgan masofa qisqarishi va tezliklar qo‘shilishi aniq algebraik munosabatlarga aylanadi.",
      items: [
        {
          title: "Asosiy harakat formulasi",
          latex: "S = v \\cdot t, \\quad v = \\frac{S}{t}, \\quad t = \\frac{S}{v}",
          explanation: "Masofa ($S$), tezlik ($v$) va vaqt ($t$) o‘zaro bir xil o‘lchov birliklarida (masalan km, km/soat, soat) bo‘lishi shart.",
          example: "$v = 60\\text{ km/soat}$, $t = 2{,}5\\text{ soat} \\Rightarrow S = 150\\text{ km}$."
        },
        {
          title: "Yaqinlashish (qarama-qarshi) tezligi",
          latex: "v_{\\text{yaq}} = v_1 + v_2",
          explanation: "Jismlar bir-biriga qarab yurganda har bir vaqt birligida oraliq masofa $v_1 + v_2$ ga kamayadi.",
          example: "$60 + 40 = 100\\text{ km/soat}$."
        },
        {
          title: "Quvish tezligi",
          latex: "v_{\\text{quv}} = v_1 - v_2 \\quad (v_1 > v_2)",
          explanation: "Bir tomonga harakatda tezroq jism sekinroq jismga har soatda $v_1 - v_2$ masofaga yaqinlashadi.",
          example: "$80 - 55 = 25\\text{ km/soat}$."
        },
        {
          title: "Oqim bo‘ylab va oqimga qarshi",
          latex: "v_{\\text{bo‘ylab}} = v_0 + v_{\\text{oqim}}, \\quad v_{\\text{qarshi}} = v_0 - v_{\\text{oqim}}",
          explanation: "Bu yerda $v_0$ — qayiqning turg‘un suvdagi tezligi, $v_{\\text{oqim}}$ — daryo oqimining tezligi.",
          example: "$v_0 = 18$, $v_{\\text{oqim}} = 3 \\Rightarrow v_{\\text{qarshi}} = 15\\text{ km/soat}$."
        }
      ],
      keyPitfall: {
        title: "Ko‘p uchraydigan xato: O‘rtacha tezlikni arifmetik o‘rtacha deb olish",
        wrong: "Borishda $60\\text{ km/soat}$, qaytishda $40\\text{ km/soat}$ yurilsa, o‘rtacha tezlik $\\frac{60+40}{2} = 50$ deyish.",
        right: "$v_{\\text{o‘rt}} = \\frac{S_{\\text{umumiy}}}{t_{\\text{umumiy}}} = \\frac{2 \\cdot 60 \\cdot 40}{60 + 40} = 48\\text{ km/soat}$.",
        reason: "Sekinroq tezlikda yo‘lga ko‘proq vaqt sarflanadi, shuning uchun o‘rtacha tezlik doimo umumiy yo‘lning umumiy vaqtga nisbatidir."
      }
    },
    problems: {
      orta: [
        {
          id: 't25-m-1',
          difficulty: 'orta',
          statement: "Orasi $300\\text{ km}$ bo‘lgan ikki shahardan bir-biriga qarab $60\\text{ km/soat}$ va $40\\text{ km/soat}$ tezlikda ikki mashina yo‘lga chiqdi. Ular necha soatdan keyin uchrashadi?",
          answer: '3',
          acceptedEquivalents: ['3 soat', '3.0'],
          socraticHint: "Ikki mashina bir soatda jami qancha masofaga yaqinlashadi?",
          steps: [
            "Yaqinlashish tezligi: $v = 60 + 40 = 100\\text{ km/soat}$.",
            "Uchrashish vaqti: $t = \\frac{300}{100} = 3\\text{ soat}$."
          ],
          sourceLabel: "Usmonov uslubi · 25-mavzu"
        },
        {
          id: 't25-m-2',
          difficulty: 'orta',
          statement: "Katerning turg‘un suvdagi tezligi $22\\text{ km/soat}$, daryo oqimining tezligi $3\\text{ km/soat}$. Kater oqimga qarshi $4$ soatda necha kilometr yuradi?",
          answer: '76',
          acceptedEquivalents: ['76 km'],
          socraticHint: "Oqimga qarshi harakatda oqim tezligi kater tezligidan ayriladimi yoki qo‘shiladimi?",
          steps: [
            "Oqimga qarshi tezlik: $22 - 3 = 19\\text{ km/soat}$.",
            "Masofa: $S = 19 \\cdot 4 = 76\\text{ km}$."
          ],
          sourceLabel: "Usmonov uslubi · 25-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't25-h-1',
          difficulty: 'murakkab',
          statement: "Avtomobil $A$ shahardan $B$ shaharga $60\\text{ km/soat}$ tezlikda bordi va shu yo‘l bilan $40\\text{ km/soat}$ tezlikda qaytdi. Butun safardagi o‘rtacha tezlikni (km/soat) toping.",
          answer: '48',
          acceptedEquivalents: ['48 km/soat'],
          socraticHint: "Shaharlar orasini $S$ deb oling; borish vaqti $\\frac{S}{60}$, qaytish vaqti $\\frac{S}{40}$, umumiy yo‘l esa $2S$.",
          steps: [
            "Umumiy yo‘l: $2S$.",
            "Umumiy vaqt: $t = \\frac{S}{60} + \\frac{S}{40} = \\frac{5S}{120} = \\frac{S}{24}$.",
            "O‘rtacha tezlik: $v_{\\text{o‘rt}} = \\frac{2S}{S/24} = 48\\text{ km/soat}$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  },

  29: {
    topicId: 29,
    muammo: {
      headline: "Aniq bitta son emas, butun ruxsat etilgan oraliq kerak bo‘lsa-chi?",
      contextLabel: "Muhandislik chegaralari va xavfsizlik me’yorlari",
      story: [
        "Liftning maksimal yuk ko‘tarish quvvati 400 kg. Bu liftga faqat aynan 400 kg chiqishi shart degani emas — 400 kg dan oshmaydigan istalgan og‘irlik xavfsiz.",
        "Hayotdagi aksariyat cheklovlar (byudjet, tezlik chegarasi, harorat oralig‘i) tenglik emas, tengsizlik bilan ifodalanadi."
      ],
      coreQuestion: "Cheksiz ko‘p ruxsat etilgan qiymatlarni sonlar o‘qida va algebraik shaklda qanday aniq tasvirlaymiz?",
      historicalNote: "Tomas Harriot XVII asrda birinchi bo‘lib «katta» (>) va «kichik» (<) belgilarini fanga kiritdi."
    },
    chegara: {
      headline: "Tenglama bitta nuqta beradi, hayot esa oraliq so‘raydi",
      whatWorkedBefore: "Chiziqli tenglama $ax + b = c$ bitta aniq noma’lum sonni topib berar edi.",
      breakingPoint: "«Kamida 12 ta» yoki «500 mingdan oshmasin» kabi shartlarda javob bitta nuqta emas, sonlar o‘qidagi butun bir nur yoki kesmadir.",
      deadEndExample: "Manfiy songa bo‘lganda tengsizlik belgisini o‘zgartirmasdan qoldirish butunlay teskari (xato) oraliqni berib qo‘yadi.",
      whyNewIdeaNeeded: "Sonlar o‘qida ochiq va bo‘yalgan nuqtalar hamda shtrixlangan oraliqlar orqali barcha yechimlarni bir zumda ko‘rish mumkin."
    },
    intuisiya: {
      headline: "Sonlar o‘qida ruxsat etilgan hududni shtrixlang",
      analogyTitle: "Xavfsiz zona va chegara chizig‘i",
      analogyStory: "Qat’iy tengsizlikda chegara nuqtasi bo‘sh halqa (kirish mumkin emas), noqat’iy tengsizlikda esa to‘la doira (chegara ham ruxsat etilgan zona ichida) bo‘ladi.",
      guidedPrompts: [
        "Qat’iy va noqat’iy belgini almashtirib, chegara nuqtasining bo‘sh yoki to‘la bo‘lishini kuzating.",
        "Yo‘nalishni o‘ngga yoki chapga burib, shtrixlangan nurni ko‘ring.",
        "Modul rejimiga o‘tib, markazdan ma’lum masofadagi barcha nuqtalar qanday kesma hosil qilishini sinab ko‘ring."
      ],
      defaultSimulatorMode: 'numberline',
      defaultPreset: { numA: 2, denA: 1, numB: 1, denB: 1 }
    },
    formula: {
      headline: "Chiziqli tengsizliklar va ularning asosiy qoidalari",
      bridgeFromIntuition: "Sonlar o‘qida shtrixlangan oraliqlar algebraik amallar bilan bevosita mos keladi.",
      items: [
        {
          title: "Musbat songa bo‘lish / ko‘paytirish",
          latex: "a > b, \\; c > 0 \\Rightarrow ac > bc",
          explanation: "Tengsizlikning ikkala tomonini musbat songa ko‘paytirganda yoki bo‘lganda ishora saqlanadi.",
          example: "$2x > 10 \\Rightarrow x > 5$."
        },
        {
          title: "Manfiy songa bo‘lish / ko‘paytirish",
          latex: "a > b, \\; c < 0 \\Rightarrow ac < bc",
          explanation: "Manfiy songa ko‘paytirish sonlar o‘qini 0 ga nisbatan aks ettiradi, shuning uchun tengsizlik ishorasi qarama-qarshisiga o‘zgaradi!",
          example: "$-3x \\le 12 \\Rightarrow x \\ge -4$."
        },
        {
          title: "Oraliq yozuvi",
          latex: "x > a \\Leftrightarrow (a; +\\infty), \\quad x \\le a \\Leftrightarrow (-\\infty; a]",
          explanation: "Qat’iy belgi uchun yumaloq qavs, noqat’iy belgi uchun kvadrat qavs ishlatiladi.",
          example: "$x \\ge -2 \\Leftrightarrow [-2; +\\infty)$."
        }
      ],
      keyPitfall: {
        title: "Eng mashhur tuzoq: Manfiy koeffitsiyentga bo‘lish",
        wrong: "$-2x > 8 \\Rightarrow x > -4$.",
        right: "$-2x > 8 \\Rightarrow x < -4$.",
        reason: "Masalan $x = 0$ ni tekshiring: $-2(0) = 0 > 8$ noto‘g‘ri! Demak $0$ yechim emas, to‘g‘ri oraliq $x < -4$."
      }
    },
    problems: {
      orta: [
        {
          id: 't29-m-1',
          difficulty: 'orta',
          statement: "$3x - 7 > 8$ tengsizlikning eng kichik butun yechimini toping.",
          answer: '6',
          acceptedEquivalents: ['6.0'],
          socraticHint: "Avval $x$ ni yolg‘izlang: $x > 5$ chiqadi. 5 soni o‘zi qat’iy tengsizlikka kiradimi?",
          steps: [
            "$3x > 8 + 7 \\Rightarrow 3x > 15$.",
            "$x > 5$.",
            "5 dan qat’iy katta eng kichik butun son $6$."
          ],
          sourceLabel: "Usmonov uslubi · 29-mavzu"
        },
        {
          id: 't29-m-2',
          difficulty: 'orta',
          statement: "$-4x + 5 \\ge -11$ tengsizlikning eng katta butun yechimini toping.",
          answer: '4',
          acceptedEquivalents: ['4.0'],
          socraticHint: "$-4$ ga bo‘layotganda tengsizlik ishorasini qarama-qarshisiga burishni unutmang.",
          steps: [
            "$-4x \\ge -16$.",
            "$-4$ ga bo‘lamiz: $x \\le 4$.",
            "Eng katta butun yechim: $4$."
          ],
          sourceLabel: "Usmonov uslubi · 29-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't29-h-1',
          difficulty: 'murakkab',
          statement: "$\\frac{2x - 1}{3} - \\frac{x + 2}{2} < 1$ tengsizlikning eng katta butun yechimini toping.",
          answer: '13',
          acceptedEquivalents: ['13.0'],
          socraticHint: "Tengsizlikning ikkala tomonini umumiy maxraj $6$ ga ko‘paytirib, kasrlardan qutuling.",
          steps: [
            "Ikkala tomonni $6$ ga ko‘paytiramiz: $2(2x - 1) - 3(x + 2) < 6$.",
            "$4x - 2 - 3x - 6 < 6 \\Rightarrow x - 8 < 6$.",
            "$x < 14$. Eng katta butun yechim: $13$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  },

  35: {
    topicId: 35,
    muammo: {
      headline: "Yuzasi ma’lum bog‘ning tomonlarini qanday topamiz?",
      contextLabel: "Al-Xorazmiy merosi va geometrik algebra",
      story: [
        "To‘g‘ri to‘rtburchak shaklidagi yer maydonining bo‘yi enidan 4 metr uzun, umumiy yuzasi esa 45 kvadrat metr. Bu maydonning eni necha metr?",
        "Bu masalada noma’lum son o‘z-o‘ziga ko‘paytiriladi ($x(x+4)=45$). IX asrda buyuk bobomiz Muhammad al-Xorazmiy aynan shunday masalalarni kvadratni to‘ldirish usuli bilan yechib, «Al-jabr» faniga asos soldi."
      ],
      coreQuestion: "Noma’lumning kvadrati qatnashgan tenglamani har safar sinab ko‘rmasdan, universal qoida bilan qanday yechamiz?",
      historicalNote: "«Algebra» so‘zi Muhammad al-Xorazmiyning 820-yilda yozilgan «Al-kitob al-muxtasar fi hisob al-jabr val-muqobala» asaridan kelib chiqqan."
    },
    chegara: {
      headline: "Tarozi muvozanati endi yetarli emas",
      whatWorkedBefore: "Chiziqli tenglamada $x$ ni bir tomonga, sonlarni boshqa tomonga o‘tkazib darhol bo‘lish mumkin edi.",
      breakingPoint: "$x^2 + 4x = 45$ tenglamada $x^2$ va $4x$ o‘xshash had emas — ularni qo‘shib bitta $x$ ga keltirib bo‘lmaydi.",
      deadEndExample: "$x(x + 4) = 45$ ni ikkala tomondan $x$ ga bo‘lsangiz, noma’lum baribir qolib ketadi.",
      whyNewIdeaNeeded: "Geometrik yuzani to‘liq kvadratga to‘ldirish (so‘ng kvadrat ildiz olish) har qanday kvadrat tenglamani universal formula — diskriminantga olib keladi."
    },
    intuisiya: {
      headline: "Tenglama muvozanati va kvadrat yuzasini birgalikda his qiling",
      analogyTitle: "Burchagi yetishmayotgan kvadrat gilam",
      analogyStory: "Agar kvadrat gilamning ikki chetiga to‘rtburchak bo‘laklar ulab qo‘yilgan bo‘lsa, bo‘sh qolgan kichik burchakni to‘ldirib, bitta butun katta kvadrat yasaymiz — keyin uning tomonini topish juda oson!",
      guidedPrompts: [
        "Yuza modeli rejimida $(a+b)^2$ qanday 4 ta bo‘lakdan tashkil topishini ko‘ring.",
        "Kichik burchak $b^2$ qo‘shilganda butun shakl to‘liq kvadratga aylanishini kuzating.",
        "Endi tenglamaning 2 ta, 1 ta yoki 0 ta yechimga ega bo‘lish sababini tasavvur qiling."
      ],
      defaultSimulatorMode: 'combine',
      defaultPreset: { numA: 3, denA: 4, numB: 1, denB: 4 }
    },
    formula: {
      headline: "Kvadrat tenglama va diskriminant formulasi",
      bridgeFromIntuition: "To‘liq kvadrat ajratish jarayonini umumiy $a, b, c$ koeffitsiyentlar uchun bajarsak, mashhur diskriminant formulasi tug‘iladi.",
      items: [
        {
          title: "Umumiy kvadrat tenglama",
          latex: "ax^2 + bx + c = 0 \\quad (a \\neq 0)",
          explanation: "$a$ — bosh koeffitsiyent, $b$ — ikkinchi koeffitsiyent, $c$ — ozod had.",
          example: "$2x^2 - 5x + 2 = 0$ da $a=2, b=-5, c=2$."
        },
        {
          title: "Diskriminant (ajratuvchi mezon)",
          latex: "D = b^2 - 4ac",
          explanation: "$D > 0$ bo‘lsa 2 ta har xil haqiqiy ildiz; $D = 0$ bo‘lsa 1 ta ildiz; $D < 0$ bo‘lsa haqiqiy ildiz yo‘q.",
          example: "$x^2 - 5x + 6 = 0 \\Rightarrow D = 25 - 24 = 1 > 0$."
        },
        {
          title: "Ildizlar formulasi",
          latex: "x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}",
          explanation: "Ildiz ostidagi $D$ aynan to‘liq kvadratning o‘ng tomonidan kelib chiqadi.",
          example: "$x_{1,2} = \\frac{5 \\pm 1}{2} \\Rightarrow x_1 = 3, \\; x_2 = 2$."
        }
      ],
      keyPitfall: {
        title: "Ko‘p uchraydigan xato: $-b$ va maxrajdagi $2a$ ishorasi",
        wrong: "$2x^2 - 5x + 2 = 0$ uchun $x = \\frac{-5 \\pm 3}{2}$ deb hisoblash.",
        right: "$b = -5$ bo‘lgani uchun $-b = +5$, maxraj esa $2a = 4$: $x = \\frac{5 \\pm 3}{4}$.",
        reason: "Manfiy $b$ ning qarama-qarshisi musbat bo‘ladi, maxrajda esa har doim $2a$ turadi."
      }
    },
    problems: {
      orta: [
        {
          id: 't35-m-1',
          difficulty: 'orta',
          statement: "$x^2 - 7x + 12 = 0$ kvadrat tenglamaning katta ildizini toping.",
          answer: '4',
          acceptedEquivalents: ['x = 4'],
          socraticHint: "Diskriminant $D = (-7)^2 - 4 \\cdot 1 \\cdot 12$ nechaga teng?",
          steps: [
            "$D = 49 - 48 = 1$.",
            "$x_{1,2} = \\frac{7 \\pm 1}{2} \\Rightarrow x_1 = 4, \\; x_2 = 3$.",
            "Katta ildiz: $4$."
          ],
          sourceLabel: "Usmonov uslubi · 35-mavzu"
        },
        {
          id: 't35-m-2',
          difficulty: 'orta',
          statement: "$2x^2 - 5x + 2 = 0$ tenglama ildizlari yig‘indisini toping.",
          answer: '2.5',
          acceptedEquivalents: ['5/2', '2,5'],
          socraticHint: "Ildizlarni diskriminant bilan topib qo‘shing (yoki $-b/a$ nisbatini eslang).",
          steps: [
            "$D = 25 - 16 = 9$, $\\sqrt{D} = 3$.",
            "$x_1 = \\frac{5+3}{4} = 2$, $x_2 = \\frac{5-3}{4} = \\frac{1}{2}$.",
            "Yig‘indi: $2 + 0{,}5 = 2{,}5$."
          ],
          sourceLabel: "Usmonov uslubi · 35-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't35-h-1',
          difficulty: 'murakkab',
          statement: "$x^2 - (k + 2)x + 9 = 0$ tenglama yagona haqiqiy ildizga ega bo‘ladigan eng katta $k$ qiymatini toping.",
          answer: '4',
          acceptedEquivalents: ['k = 4'],
          socraticHint: "Kvadrat tenglama qachon yagona ildizga ega bo‘ladi? $D = 0$ tenglamani $k$ ga nisbatan yeching.",
          steps: [
            "Yagona ildiz sharti: $D = 0$.",
            "$(k + 2)^2 - 36 = 0 \\Rightarrow k + 2 = \\pm 6$.",
            "$k_1 = 4$, $k_2 = -8$. Eng katta qiymat: $4$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  },

  39: {
    topicId: 39,
    muammo: {
      headline: "Otib yuborilgan to‘p nega aynan egri yoy bo‘ylab uchadi?",
      contextLabel: "Traektoriya, ko‘priklar va sun’iy yo‘ldosh antennalari",
      story: [
        "Basketbol to‘pini halqaga qarab otganingizda, u to‘g‘ri chiziq bo‘ylab emas, silliq egri yoy — parabola bo‘ylab ko‘tariladi, eng yuqori nuqtaga yetadi va pastga tushadi.",
        "Xuddi shu shakl osma ko‘prik arqonlarida va signallarni bir nuqtaga jamlaydigan parabolik antennalarda ham uchraydi."
      ],
      coreQuestion: "$a, b, c$ sonlarining har biri parabola shaklini, uning uchish cho‘qqisini va yerga tushish nuqtalarini qanday boshqaradi?",
      historicalNote: "Galileo Galiley erkin tushayotgan va burchak ostida otilgan jismlar traektoriyasi aynan parabola ekanini tajribada isbotlagan."
    },
    chegara: {
      headline: "To‘g‘ri chiziqda eng baland cho‘qqi yo‘q",
      whatWorkedBefore: "Chiziqli funksiya $y = kx + b$ faqat bir tekis o‘sish yoki bir tekis kamayishni tasvirlar edi.",
      breakingPoint: "To‘p avval sekinlashib ko‘tariladi, bir lahza to‘xtaydi va tezlashib pastga tushadi — buni hech qanday to‘g‘ri chiziq bilan tasvirlab bo‘lmaydi.",
      deadEndExample: "Eng maksimal foyda yoki eng yuqori balandlik nuqtasini chiziqli model bilan topish imkonsiz.",
      whyNewIdeaNeeded: "Kvadrat funksiya grafigi — parabola — simmetriya o‘qi va tepa nuqta (ekstremum) tushunchasini beradi."
    },
    intuisiya: {
      headline: "Parabola shoxlari, tepa nuqtasi va ildizlarini jonli o‘zgartiring",
      analogyTitle: "Favvora suvi oqimi",
      analogyStory: "Favvoradan otilayotgan suv oqimini ko‘z oldingizga keltiring: bosim kuchi $a$ oqimning qanchalik tik yoki yoyiq bo‘lishini, $c$ esa favvora naychasi yer sathidan qanchalik balandda turganini belgilaydi.",
      guidedPrompts: [
        "$a$ slayderini musbatdan manfiyga o‘tkazing: parabola shoxlari qaysi tomonga buriladi?",
        "$c$ ni o‘zgartirib, parabola $Ox$ o‘qini qachon 2 marta, 1 marta yoki umuman kesmasligini kuzating.",
        "Diskriminant $D$ ishorasi bilan $Ox$ o‘qidagi ildiz nuqtalari sonini solishtiring."
      ],
      defaultSimulatorMode: 'numberline',
      defaultPreset: { numA: 1, denA: 2, numB: 1, denB: 2 }
    },
    formula: {
      headline: "Kvadrat funksiya: $y = ax^2 + bx + c$",
      bridgeFromIntuition: "Koordinata tekisligida ko‘rgan har bir geometrik o‘zgarish $a, b, c$ koeffitsiyentlar bilan aniq bog‘langan.",
      items: [
        {
          title: "Tepa nuqta koordinatalari",
          latex: "x_0 = -\\frac{b}{2a}, \\quad y_0 = y(x_0) = -\\frac{D}{4a}",
          explanation: "Parabola $x = x_0$ to‘g‘ri chizig‘iga nisbatan mutlaqo simmetrikdir.",
          example: "$y = x^2 - 4x + 3$ uchun $x_0 = 2, \\; y_0 = -1$."
        },
        {
          title: "Shoxlar yo‘nalishi va kengligi",
          latex: "a > 0 \\Rightarrow \\text{yuqoriga}, \\quad a < 0 \\Rightarrow \\text{pastga}",
          explanation: "$|a|$ qanchalik katta bo‘lsa, parabola shoxlari shunchalik torayadi.",
          example: "$y = -2x^2 + 8$ ning shoxlari pastga qaragan, eng katta qiymati $8$."
        },
        {
          title: "Nollar soni va diskriminant",
          latex: "D > 0: \\; 2\\text{ ta ildiz}, \\quad D = 0: \\; 1\\text{ ta urinish}, \\quad D < 0: \\; 0\\text{ ta}",
          explanation: "Parabola $Ox$ o‘qini kesib o‘tadigan nuqtalar kvadrat tenglamaning ildizlaridir.",
          example: "$y = x^2 + 1$ uchun $D = -4 < 0$, grafik $Ox$ o‘qidan yuqorida yotadi."
        }
      ],
      keyPitfall: {
        title: "Ko‘p uchraydigan xato: Tepa nuqtada minus ishorasini unutish",
        wrong: "$y = x^2 - 6x + 5$ uchun $x_0 = \\frac{-6}{2} = -3$ deb olish.",
        right: "$x_0 = -\\frac{-6}{2 \\cdot 1} = +3$.",
        reason: "Formuladagi minus ishorasi $b$ ning o‘zidagi minus bilan uchrashganda musbatga aylanadi."
      }
    },
    problems: {
      orta: [
        {
          id: 't39-m-1',
          difficulty: 'orta',
          statement: "$y = x^2 - 6x + 11$ kvadrat funksiyaning eng kichik qiymatini toping.",
          answer: '2',
          acceptedEquivalents: ['y = 2'],
          socraticHint: "Avval parabola tepa nuqtasining abssissasi $x_0 = -\\frac{b}{2a}$ ni toping, so‘ng funksiyaga qo‘ying.",
          steps: [
            "$a = 1 > 0$, demak eng kichik qiymat tepa nuqtada erishiladi.",
            "$x_0 = -\\frac{-6}{2} = 3$.",
            "$y_{\\min} = 3^2 - 6(3) + 11 = 9 - 18 + 11 = 2$."
          ],
          sourceLabel: "Usmonov uslubi · 39-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't39-h-1',
          difficulty: 'murakkab',
          statement: "$y = -2x^2 + 8x + c$ funksiyaning eng katta qiymati $15$ ga teng. $c$ parametrni toping.",
          answer: '7',
          acceptedEquivalents: ['c = 7'],
          socraticHint: "Tepa nuqta $x_0$ ni toping va $y(x_0) = 15$ tenglamadan $c$ ni aniqlang.",
          steps: [
            "$x_0 = -\\frac{8}{2(-2)} = 2$.",
            "$y(2) = -2(4) + 8(2) + c = 8 + c$.",
            "$8 + c = 15 \\Rightarrow c = 7$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  },

  58: {
    topicId: 58,
    muammo: {
      headline: "Har soatda ikki baravar ko‘payadigan jarayonni qanday hisoblaymiz?",
      contextLabel: "Biologiya, murakkab foiz va radioaktiv yemirilish",
      story: [
        "Bitta bakteriya har 20 daqiqada ikkiga bo‘linadi. Birinchi soatda 8 ta, ikki soatda 64 ta, bir kundan keyin esa milliardlab bakteriya hosil bo‘ladi.",
        "Xuddi shu qonuniyat bankdagi murakkab foizlarda va yadro fizikasidagi yarim yemirilish davrida ishlaydi: o‘sish tezligi aynan joriy miqdorning o‘ziga proporsional."
      ],
      coreQuestion: "Noma’lum son daraja asosida emas, daraja ko‘rsatkichida turganda grafik va hisob qanday bo‘ladi?",
      historicalNote: "Leonhard Eyler XVIII asrda ko‘rsatkichli funksiyani va tabiiy $e \\approx 2{,}718$ asosni chuqur tadqiq qilib, zamonaviy analizga asos soldi."
    },
    chegara: {
      headline: "Ko‘phadlar eksponensial portlashga yeta olmaydi",
      whatWorkedBefore: "$x^2$ yoki $x^3$ kabi darajali funksiyalarda o‘sish sekinroq va o‘zgaruvchi pastda (asosda) edi.",
      breakingPoint: "Har bir qadamda miqdor 2 baravar ortadigan jarayonni $y = ax^2 + bx + c$ ko‘rinishida yozib bo‘lmaydi.",
      deadEndExample: "Manfiy $x$ larda $2^x$ nolga yaqinlashadi, lekin hech qachon noldan pastga tushmaydi — parabola esa bunday xulqqa ega emas.",
      whyNewIdeaNeeded: "$y = a^x$ ($a > 0, a \\neq 1$) ko‘rsatkichli funksiya har qanday karrali o‘sish va kamayishning tabiiy tilidir."
    },
    intuisiya: {
      headline: "Asos $a$ ning $1$ dan katta yoki kichik bo‘lishini grafikda ko‘ring",
      analogyTitle: "Qor dumaloqlanishi va yarimlanish",
      analogyStory: "Asos $a > 1$ bo‘lsa, tog‘dan yumalayotgan qor kabi har qadamda kattalashib boradi; $0 < a < 1$ bo‘lsa, har safar qolgan qismining yarmi olinib, nol chizig‘iga cheksiz yaqinlashadi.",
      guidedPrompts: [
        "Asos $a$ ni $2$ dan $0{,}5$ ga tushiring: grafik o‘suvchidan kamayuvchiga qanday aylanishini ko‘ring.",
        "Barcha $a$ qiymatlarida grafik $(0; 1)$ nuqtadan o‘tishini tekshiring.",
        "Grafik gorizontal asimptota chizig‘ini hech qachon kesib o‘tmasligiga e’tibor bering."
      ],
      defaultSimulatorMode: 'numberline',
      defaultPreset: { numA: 1, denA: 2, numB: 1, denB: 4 }
    },
    formula: {
      headline: "Ko‘rsatkichli funksiya: $y = a^x$",
      bridgeFromIntuition: "Grafikda kuzatgan qat’iy musbatlik va monotonlik ko‘rsatkichli tenglama hamda tengsizliklarning kalitidir.",
      items: [
        {
          title: "Aniqlanish va qiymatlar sohasi",
          latex: "a > 0, \\; a \\neq 1 \\Rightarrow D(f) = (-\\infty; +\\infty), \\quad E(f) = (0; +\\infty)",
          explanation: "Musbat sonning istalgan haqiqiy darajasi har doim qat’iy musbat ($a^x > 0$).",
          example: "$2^x = -4$ tenglamaning haqiqiy yechimi yo‘q."
        },
        {
          title: "Monotonlik qoidasi",
          latex: "a > 1 \\Rightarrow \\text{o‘suvchi}; \\quad 0 < a < 1 \\Rightarrow \\text{kamayuvchi}",
          explanation: "Tengsizlikda asos $0 < a < 1$ bo‘lsa, darajalarga o‘tganda tengsizlik ishorasi almashadi!",
          example: "$(0{,}5)^x > (0{,}5)^3 \\Rightarrow x < 3$."
        }
      ],
      keyPitfall: {
        title: "Ko‘p uchraydigan xato: Kasr asosda ishorani saqlab qolish",
        wrong: "$\\left(\\frac{1}{2}\\right)^x > \\left(\\frac{1}{2}\\right)^4 \\Rightarrow x > 4$.",
        right: "$\\left(\\frac{1}{2}\\right)^x > \\left(\\frac{1}{2}\\right)^4 \\Rightarrow x < 4$.",
        reason: "$\\frac{1}{2} < 1$ bo‘lgani uchun funksiya kamayuvchi: daraja kattalashgani sari qiymat kichrayadi."
      }
    },
    problems: {
      orta: [
        {
          id: 't58-m-1',
          difficulty: 'orta',
          statement: "$2^{x+1} = 16$ ko‘rsatkichli tenglamani yeching.",
          answer: '3',
          acceptedEquivalents: ['x = 3'],
          socraticHint: "$16$ sonini $2$ ning nechanchi darajasi sifatida yozish mumkin?",
          steps: [
            "$16 = 2^4$, demak $2^{x+1} = 2^4$.",
            "Asoslar teng: $x + 1 = 4 \\Rightarrow x = 3$."
          ],
          sourceLabel: "Usmonov uslubi · 58-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't58-h-1',
          difficulty: 'murakkab',
          statement: "$3^{2x} - 4 \\cdot 3^x + 3 = 0$ tenglama ildizlari yig‘indisini toping.",
          answer: '1',
          acceptedEquivalents: ['1.0'],
          socraticHint: "$t = 3^x$ ($t > 0$) almashtirish kiritib kvadrat tenglama tuzing.",
          steps: [
            "$t = 3^x$ deylik: $t^2 - 4t + 3 = 0 \\Rightarrow t_1 = 1, \\; t_2 = 3$.",
            "$3^x = 1 \\Rightarrow x_1 = 0$; $3^x = 3 \\Rightarrow x_2 = 1$.",
            "Ildizlar yig‘indisi: $0 + 1 = 1$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  },

  61: {
    topicId: 61,
    muammo: {
      headline: "Darajaning javobi ma’lum — uning ko‘rsatkichini qanday topamiz?",
      contextLabel: "Zilzila kuchi (Rixter shkalasi), tovush (detsibel) va astronomiya",
      story: [
        "$2^x = 8$ ni topish oson ($x = 3$). Lekin $2^x = 10$ bo‘lsa-chi? $x$ soni $3$ dan katta, $4$ dan kichik — uni aniq ifodalash uchun bizga yangi matematik amal kerak.",
        "Rixter shkalasida 7 balli zilzila 6 ballidan 10 baravar kuchli. Katta karrali diapazonlarni ixcham sonlarga aylantirish uchun logarifm ixtiro qilingan."
      ],
      coreQuestion: "Ko‘rsatkichli amalni teskarisiga qaytarib, «asosni nechanchi darajaga ko‘tarsak bu son chiqadi?» savoliga qanday javob beramiz?",
      historicalNote: "Jon Nepyer 1614-yilda logarifmlar jadvalini yaratib, astronomlarning ko‘p oylik ko‘paytirish hisob-kitoblarini bir necha daqiqaga qisqartirdi."
    },
    chegara: {
      headline: "Ko‘paytirishni bo‘lish bilan, darajani ildiz bilan — lekin ko‘rsatkichni nima bilan yechamiz?",
      whatWorkedBefore: "Ildiz olish $x^3 = 8$ kabi asos noma’lum bo‘lgan tenglamalarni yecha olar edi.",
      breakingPoint: "$3^x = 20$ tenglamada noma’lum yuqorida — daraja ko‘rsatkichida turibdi; ildiz olish bu yerda yordam bermaydi.",
      deadEndExample: "Katta sonlarni ko‘paytirish va daraja ko‘rsatkichini topish uchun eski 4 amal hamda ildiz yetarli emas.",
      whyNewIdeaNeeded: "Logarifm $\\log_a b$ aynan ko‘rsatkichli funksiyaning teskari funksiyasi bo‘lib, ko‘paytmani yig‘indiga aylantiradi."
    },
    intuisiya: {
      headline: "Logarifmik egri chiziq va vertikal asimptotani kuzating",
      analogyTitle: "Nechta qadamda shu balandlikka yetamiz?",
      analogyStory: "Agar har qadamda pulingiz 2 baravar ko‘paysa, logarifm sizga «1000 so‘mni 1 million qilish uchun nechta qadam kerak?» degan savolga aniq javob beradi.",
      guidedPrompts: [
        "Logarifm rejimida asos $a$ ni o‘zgartiring va grafik har doim $(1; 0)$ nuqtadan o‘tishini ko‘ring.",
        "$x$ nolga yaqinlashganda grafik nega keskin pastga (yoki $0<a<1$ da yuqoriga) ketishini kuzating.",
        "Ko‘rsatkichli va logarifmik rejimlar orasida almashib, ular $y=x$ chizig‘iga ko‘zgudek aks etishini payqang."
      ],
      defaultSimulatorMode: 'numberline',
      defaultPreset: { numA: 1, denA: 2, numB: 1, denB: 2 }
    },
    formula: {
      headline: "Logarifm ta’rifi va asosiy xossalari",
      bridgeFromIntuition: "Logarifm — bu boshqa hech narsa emas, aynan daraja ko‘rsatkichi!",
      items: [
        {
          title: "Logarifm ta’rifi",
          latex: "\\log_a b = c \\iff a^c = b \\quad (a > 0, \\; a \\neq 1, \\; b > 0)",
          explanation: "Manfiy son va nolning haqiqiy logarifmi mavjud emas.",
          example: "$\\log_2 8 = 3$, chunki $2^3 = 8$."
        },
        {
          title: "Asosiy logarifmik ayniyat",
          latex: "a^{\\log_a b} = b",
          explanation: "Ko‘rsatkichli va logarifmik amallar bir-birini bekor qiladi.",
          example: "$5^{\\log_5 12} = 12$."
        },
        {
          title: "Ko‘paytma va bo‘linma logarifmi",
          latex: "\\log_a(xy) = \\log_a x + \\log_a y, \\quad \\log_a\\frac{x}{y} = \\log_a x - \\log_a y",
          explanation: "Logarifm murakkab ko‘paytirishni oddiy qo‘shishga aylantiradi ($x>0, y>0$).",
          example: "$\\log_6 4 + \\log_6 9 = \\log_6 36 = 2$."
        }
      ],
      keyPitfall: {
        title: "Ko‘p uchraydigan xato: Yig‘indi logarifmini ajratish",
        wrong: "$\\log_2(x + y) = \\log_2 x + \\log_2 y$.",
        right: "$\\log_2(x \\cdot y) = \\log_2 x + \\log_2 y$.",
        reason: "Qo‘shiluvchi logarifmlar bitta logarifm ichida ko‘paytmaga birlashadi, yig‘indiga emas!"
      }
    },
    problems: {
      orta: [
        {
          id: 't61-m-1',
          difficulty: 'orta',
          statement: "Hisoblang: $\\log_2 32 + \\log_3 \\frac{1}{9}$.",
          answer: '3',
          acceptedEquivalents: ['3.0'],
          socraticHint: "$32 = 2^5$ va $\\frac{1}{9} = 3^{-2}$ ekanligidan foydalaning.",
          steps: [
            "$\\log_2 32 = \\log_2(2^5) = 5$.",
            "$\\log_3(3^{-2}) = -2$.",
            "$5 + (-2) = 3$."
          ],
          sourceLabel: "Usmonov uslubi · 61-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't61-h-1',
          difficulty: 'murakkab',
          statement: "Hisoblang: $\\log_6 4 + \\log_6 9 + 4^{\\log_4 5}$.",
          answer: '7',
          acceptedEquivalents: ['7.0'],
          socraticHint: "Birinchi ikki logarifmni bitta logarifmga birlashtiring, uchinchisida esa asosiy logarifmik ayniyatni qo‘llang.",
          steps: [
            "$\\log_6 4 + \\log_6 9 = \\log_6(4 \\cdot 9) = \\log_6 36 = 2$.",
            "$4^{\\log_4 5} = 5$.",
            "Natija: $2 + 5 = 7$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  },

  69: {
    topicId: 69,
    muammo: {
      headline: "Nega $360^\\circ$ yetarli emas va aylanishni qanday tabiiy o‘lchaymiz?",
      contextLabel: "Astronomiya, elektr to‘lqinlari va aylanma harakat",
      story: [
        "G‘ildirak aylanayotganda uning chetidagi nuqta balandligi goh ko‘tariladi, goh tushadi. Tovush to‘lqinlari, o‘zgaruvchan elektr toki va fasllar almashinuvi ham xuddi shunday davriy qaytalanadi.",
        "Bobil olimlari aylanani 360 bo‘lakka bo‘lgan bo‘lsa-da, tabiatda eng qulay o‘lchov — aylana yoyi uzunligining radiusga nisbati, ya’ni radian va radiusi $1$ ga teng birlik aylanadir."
      ],
      coreQuestion: "Har qanday aylanish burchagini (hatto $90^\\circ$ dan katta yoki manfiy burchaklarni ham) koordinatalar va to‘lqinlar bilan qanday bog‘laymiz?",
      historicalNote: "Samarqandda Mirzo Ulug‘bek va al-Koshiy trigonometrik jadvallarni misli ko‘rilmagan aniqlikda — verguldan keyin 16 xonagacha hisoblab chiqishgan."
    },
    chegara: {
      headline: "To‘g‘ri burchakli uchburchak $90^\\circ$ da to‘xtaydi",
      whatWorkedBefore: "Geometriyada o‘tkir burchak sinusi qarshi katetning gipotenuzaga nisbati sifatida yaxshi ishlardi.",
      breakingPoint: "Uchburchak ichida $120^\\circ$, $210^\\circ$ yoki $-45^\\circ$ li o‘tkir burchak yasab bo‘lmaydi! Lekin g‘ildirak va tebranish istalgan burchakka burila oladi.",
      deadEndExample: "$\\sin 150^\\circ$ yoki $\\cos 240^\\circ$ ni to‘g‘ri burchakli uchburchak katetlari bilan ta’riflab bo‘lmaydi.",
      whyNewIdeaNeeded: "Birlik aylana (radiusi $R = 1$) burchakni nuqtaning $(x; y) = (\\cos\\theta; \\sin\\theta)$ koordinatalariga aylantirib, barcha burchaklarga yagona ma’no beradi."
    },
    intuisiya: {
      headline: "Birlik aylanada nuqtani aylantiring va to‘lqin hosil bo‘lishini ko‘ring",
      analogyTitle: "Charxpalak kabinasi balandligi",
      analogyStory: "Charxpalak aylanganda kabinaning yerdan balandligi (vertikal proyeksiya) — bu sinus, markazdan o‘ng-chap siljishi (gorizontal proyeksiya) esa kosinusdir.",
      guidedPrompts: [
        "Aylanadagi nuqtani sichqoncha bilan sudrab burchakni $0^\\circ$ dan $360^\\circ$ gacha aylantiring.",
        "I, II, III, IV choraklarda vertikal (sinus) va gorizontal (kosinus) kesmalar ishorasi qanday almashishini kuzating.",
        "O‘ng tomondagi jonli to‘lqin grafigida nuqta qanday sinusoida chizishini tomosha qiling."
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 1, denA: 4, numB: 1, denB: 4 }
    },
    formula: {
      headline: "Radian o‘lchovi va birlik aylana koordinatalari",
      bridgeFromIntuition: "Birlik aylanada ko‘rgan nuqta koordinatalari barcha trigonometrik ayniyatlarning manbaidir.",
      items: [
        {
          title: "Gradus va radian bog‘lanishi",
          latex: "180^\\circ = \\pi\\text{ rad}, \\quad \\alpha_{\\text{rad}} = \\alpha^\\circ \\cdot \\frac{\\pi}{180^\\circ}",
          explanation: "To‘liq aylanish $360^\\circ = 2\\pi$, to‘g‘ri burchak $90^\\circ = \\frac{\\pi}{2}$.",
          example: "$60^\\circ = \\frac{\\pi}{3}$, $\\frac{3\\pi}{4} = 135^\\circ$."
        },
        {
          title: "Birlik aylanadagi ta’rif",
          latex: "x = \\cos\\theta, \\quad y = \\sin\\theta, \\quad \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}",
          explanation: "Nuqta birlik aylanada yotgani uchun $x^2 + y^2 = 1$ tenglik darhol $\\sin^2\\theta + \\cos^2\\theta = 1$ ni beradi.",
          example: "$\\theta = 90^\\circ$ da nuqta $(0; 1) \\Rightarrow \\cos 90^\\circ = 0, \\; \\sin 90^\\circ = 1$."
        },
        {
          title: "Choraklardagi ishoralar",
          latex: "\\text{I: }(+,+), \\quad \\text{II: }(-,+), \\quad \\text{III: }(-,-), \\quad \\text{IV: }(+,-)",
          explanation: "Birinchi ishora $\\cos\\theta$ ($x$), ikkinchisi $\\sin\\theta$ ($y$).",
          example: "$150^\\circ$ II chorakda: $\\sin 150^\\circ > 0, \\; \\cos 150^\\circ < 0$."
        }
      ],
      keyPitfall: {
        title: "Ko‘p uchraydigan xato: $\\cos$ va $\\sin$ o‘qlarini adashtirish",
        wrong: "$\\sin\\theta$ ni gorizontal ($x$) o‘q deb o‘ylash.",
        right: "$\\cos\\theta = x$ (gorizontal), $\\sin\\theta = y$ (vertikal).",
        reason: "Burchak $0^\\circ$ da nuqta $(1; 0)$ da turadi: gorizontal masofa $1$ ($\\cos 0^\\circ = 1$), balandlik $0$ ($\\sin 0^\\circ = 0$)."
      }
    },
    problems: {
      orta: [
        {
          id: 't69-m-1',
          difficulty: 'orta',
          statement: "$\\frac{5\\pi}{6}$ radian burchakni gradusga aylantiring (faqat sonni yozing).",
          answer: '150',
          acceptedEquivalents: ['150°', '150 gradus'],
          socraticHint: "$\\pi$ o‘rniga $180^\\circ$ qo‘yib hisoblang.",
          steps: [
            "$\\frac{5 \\cdot 180^\\circ}{6} = 5 \\cdot 30^\\circ = 150^\\circ$."
          ],
          sourceLabel: "Usmonov uslubi · 69-mavzu"
        },
        {
          id: 't69-m-2',
          difficulty: 'orta',
          statement: "Hisoblang: $2\\sin 30^\\circ + 4\\cos 60^\\circ$.",
          answer: '3',
          acceptedEquivalents: ['3.0'],
          socraticHint: "$\\sin 30^\\circ = \\frac{1}{2}$ va $\\cos 60^\\circ = \\frac{1}{2}$ qiymatlarini qo‘ying.",
          steps: [
            "$2 \\cdot \\frac{1}{2} + 4 \\cdot \\frac{1}{2} = 1 + 2 = 3$."
          ],
          sourceLabel: "Usmonov uslubi · 69-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't69-h-1',
          difficulty: 'murakkab',
          statement: "Agar $\\sin\\alpha = \\frac{3}{5}$ va $\\alpha \\in \\left(\\frac{\\pi}{2}; \\pi\\right)$ bo‘lsa, $\\cos\\alpha$ ni toping.",
          answer: '-4/5',
          acceptedEquivalents: ['-0.8', '-0,8'],
          socraticHint: "$\\sin^2\\alpha + \\cos^2\\alpha = 1$ dan foydalaning va II chorakda kosinus ishorasiga diqqat qiling!",
          steps: [
            "$\\cos^2\\alpha = 1 - \\left(\\frac{3}{5}\\right)^2 = 1 - \\frac{9}{25} = \\frac{16}{25}$.",
            "$\\alpha$ II chorakda bo‘lgani uchun $\\cos\\alpha < 0$.",
            "$\\cos\\alpha = -\\frac{4}{5} = -0{,}8$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  },

  96: {
    topicId: 96,
    muammo: {
      headline: "Harakatlanayotgan mashinaning aynan shu soniyadagi tezligi nima?",
      contextLabel: "Nyuton fizikasi, spidometr va o‘zgarish tezligi",
      story: [
        "Mashina 2 soatda 120 km bosib o‘tsa, o‘rtacha tezligi 60 km/soat. Lekin svetoforda u to‘xtab turgan, trassada esa 95 km/soatda yurgan bo‘lishi mumkin. Spidometr ko‘rsatadigan «aynan shu lahzadagi» tezlik qanday aniqlanadi?",
        "Vaqt oralig‘ini 0 ga qisqartirsak, bosib o‘tilgan masofa ham 0 bo‘ladi va $0/0$ ma’nosiz ifoda chiqadi. Isaak Nyuton va Gotfrid Leybnis cheksiz kichik oraliqqa yaqinlashish orqali hosila tushunchasini yaratishdi."
      ],
      coreQuestion: "Egri chiziqning bitta nuqtasidagi qiyalikni (oniy o‘zgarish tezligini) qanday aniq hisoblaymiz?",
      historicalNote: "XVII asr oxirida Nyuton (harakat orqali) va Leybnis (geometrik urinma orqali) bir-biridan mustaqil ravishda differensial hisobni kashf qilishdi."
    },
    chegara: {
      headline: "O‘rtacha qiyalik ikki nuqta talab qiladi, bizda esa bitta nuqta bor",
      whatWorkedBefore: "To‘g‘ri chiziqda qiyalik har yerda bir xil: $k = \\frac{\\Delta y}{\\Delta x}$.",
      breakingPoint: "Egri chiziqda qiyalik har bir nuqtada uzluksiz o‘zgaradi; $\\Delta x = 0$ qo‘ysak, nolga bo‘lish xatosi kelib chiqadi.",
      deadEndExample: "Bitta nuqtadan cheksiz ko‘p to‘g‘ri chiziq o‘tadi — qaysi biri aynan shu nuqtadagi egri chiziq yo‘nalishini beradi?",
      whyNewIdeaNeeded: "Ikki nuqtani tutashtiruvchi kesuvchi chiziqni cheksiz yaqinlashtirganda u yagona urinma chiziqqa aylanadi — ana shu urinmaning qiyaligi hosiladir."
    },
    intuisiya: {
      headline: "Egri chiziq bo‘ylab nuqtani suring va urinma qiyaligini kuzating",
      analogyTitle: "Tungi yo‘lda avtomobil farasi nuri",
      analogyStory: "Burilishli yo‘ldan ketayotgan mashina farasi nuri har lahzada aynan mashina turgan nuqtadagi urinma yo‘nalishini ko‘rsatadi: tepalikka chiqayotganda nur yuqoriga (hosila musbat), cho‘qqida gorizontal (hosila nol), pastlikka tushayotganda pastga (hosila manfiy) qaraydi.",
      guidedPrompts: [
        "«Hosila (urinma)» rejimida $x$ nuqta slayderini suring va urinma chiziq qiyaligi $f'(x)$ qanday o‘zgarishini kuzating.",
        "Urinma butunlay gorizontal bo‘lib qoladigan ($f'(x) = 0$) nuqtani toping: egri chiziqning qaysi qismi u?",
        "Kubik va sinus egri chiziqlarini tanlab, musbat va manfiy qiyalik sohalarini solishtiring."
      ],
      defaultSimulatorMode: 'numberline',
      defaultPreset: { numA: 1, denA: 2, numB: 1, denB: 2 }
    },
    formula: {
      headline: "Hosila ta’rifi va asosiy jadval",
      bridgeFromIntuition: "Urinma chiziqning $\\frac{\\Delta y}{\\Delta x}$ qiyaligi $\\Delta x \\to 0$ limitda aniq hosila formulasiga aylanadi.",
      items: [
        {
          title: "Hosila ta’rifi va geometrik ma’nosi",
          latex: "f'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0 + \\Delta x) - f(x_0)}{\\Delta x} = \\tan\\alpha = k_{\\text{urinma}}",
          explanation: "Nuqtadagi hosila shu nuqtada grafikga o‘tkazilgan urinmaning burchak koeffitsiyentiga teng.",
          example: "$f(x) = x^2$ ning $x_0 = 3$ nuqtadagi urinma qiyaligi $f'(3) = 6$."
        },
        {
          title: "Daraja funksiyasi hosilasi",
          latex: "(x^n)' = n \\cdot x^{n-1}, \\quad (C)' = 0",
          explanation: "Daraja ko‘rsatkichi oldinga tushadi va daraja 1 taga kamayadi; o‘zgarmas sonning hosilasi nol.",
          example: "$(x^3 - 5x + 7)' = 3x^2 - 5$."
        },
        {
          title: "Fizik ma’nosi",
          latex: "v(t) = S'(t), \\quad a(t) = v'(t)",
          explanation: "Yo‘lning vaqt bo‘yicha hosilasi oniy tezlikni, tezlikning hosilasi esa tezlanishni beradi.",
          example: "$S(t) = 5t^2 \\Rightarrow v(t) = 10t$."
        }
      ],
      keyPitfall: {
        title: "Ko‘p uchraydigan xato: O‘zgarmas ko‘paytuvchi va ozod hadni chalkashtirish",
        wrong: "$(4x + 5)' = 0 + 5 = 5$.",
        right: "$(4x + 5)' = 4 \\cdot 1 + 0 = 4$.",
        reason: "Yolg‘iz o‘zgarmas $5$ o‘zgarmaydi (hosilasi $0$), $4x$ dagi $4$ esa qiyalik koeffitsiyenti bo‘lib qoladi."
      }
    },
    problems: {
      orta: [
        {
          id: 't96-m-1',
          difficulty: 'orta',
          statement: "$f(x) = x^3 - 4x + 7$ funksiya uchun $f'(2)$ ni hisoblang.",
          answer: '8',
          acceptedEquivalents: ['8.0'],
          socraticHint: "Avval $f'(x)$ hosila funksiyasini toping, so‘ng $x = 2$ ni qo‘ying.",
          steps: [
            "$f'(x) = 3x^2 - 4$.",
            "$f'(2) = 3(2^2) - 4 = 12 - 4 = 8$."
          ],
          sourceLabel: "Usmonov uslubi · 96-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't96-h-1',
          difficulty: 'murakkab',
          statement: "Moddiy nuqta $S(t) = t^3 - 3t^2 + 6t$ qonun bo‘yicha harakatlanmoqda. $t = 3\\text{ s}$ paytdagi oniy tezlikni toping.",
          answer: '15',
          acceptedEquivalents: ['15 m/s'],
          socraticHint: "Oniy tezlik $v(t) = S'(t)$ hosilaga teng. Hosila olib $t = 3$ qo‘ying.",
          steps: [
            "$v(t) = S'(t) = 3t^2 - 6t + 6$.",
            "$v(3) = 3(9) - 6(3) + 6 = 27 - 18 + 6 = 15$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  },

  105: {
    topicId: 105,
    muammo: {
      headline: "Egri chiziq ostidagi aniq yuzani qanday o‘lchaymiz?",
      contextLabel: "Arximed usuli, suv ombori hajmi va o‘zgaruvchan kuch bajargan ish",
      story: [
        "To‘g‘ri to‘rtburchak va uchburchak yuzini hisoblash oson. Lekin daryo qirg‘og‘i yoki parabola ostidagi egri chegarali yer maydonining aniq yuzini qanday topamiz?",
        "Qadimgi Arximed va keyinchalik Bernhard Riman ajoyib g‘oya berishdi: egri chiziq ostini ingichka to‘g‘ri to‘rtburchaklarga bo‘ling; bo‘laklar soni cheksiz ortganda ularning yuzalari yig‘indisi aniq yuzaga intiladi."
      ],
      coreQuestion: "Cheksiz ko‘p ingichka ustunchalarni qo‘shmasdan, egri chiziq ostidagi aniq yuzani bir zumda qanday hisoblaymiz?",
      historicalNote: "Nyuton–Leybnis teoremasi matematikaning eng buyuk mo‘jizalaridan biridir: u yuzani topish (integral) va qiyalikni topish (hosila) o‘zaro teskari amallar ekanini isbotladi."
    },
    chegara: {
      headline: "Chekli to‘rtburchaklar har doim biroz xatolik qoldiradi",
      whatWorkedBefore: "Geometrik shakllarni uchburchak va to‘rtburchaklarga ajratish to‘g‘ri chiziqli chegaralarda mukammal ishlardi.",
      breakingPoint: "Egri chiziq ostiga 4 ta yoki 8 ta to‘rtburchak qo‘ysangiz, tepasida bo‘shliq yoki ortiqcha «zinapoya» qolib ketadi.",
      deadEndExample: "1000 ta to‘rtburchak yuzini qo‘lda qo‘shib chiqish amalda imkonsiz va baribir taxminiy natija beradi.",
      whyNewIdeaNeeded: "Boshlang‘ich funksiya va Nyuton–Leybnis formulasi cheksiz Riman yig‘indisining aniq qiymatini ikki chekka nuqta ayirmasi bilan topib beradi."
    },
    intuisiya: {
      headline: "Riman to‘rtburchaklari sonini oshirib, yuzaning aniqlashishini kuzating",
      analogyTitle: "Piksellar soni ortgani sari silliqlashadigan tasvir",
      analogyStory: "Kam pikselli rasmda egri chiziq zinapoyaga o‘xshaydi, lekin piksellar sonini oshirganingiz sari rasm mutlaqo silliq ko‘rinadi — Riman to‘rtburchaklari ham xuddi shunday aniq yuzaga yaqinlashadi.",
      guidedPrompts: [
        "«Integral (Riman)» rejimida to‘rtburchaklar soni $N$ ni $4$ dan $48$ gacha oshiring.",
        "Riman yig‘indisi va aniq integral orasidagi xatolik qanday nolga intilishini ko‘ring.",
        "«Chap», «O‘rta» va «O‘ng» usullarini almashtirib, qaysi biri eng tez aniq yuzaga yaqinlashishini solishtiring."
      ],
      defaultSimulatorMode: 'combine',
      defaultPreset: { numA: 3, denA: 4, numB: 1, denB: 4 }
    },
    formula: {
      headline: "Aniq integral va Nyuton–Leybnis formulasi",
      bridgeFromIntuition: "Simulyatorda ko‘rgan Riman to‘rtburchaklari yig‘indisining $N \\to \\infty$ dagi aniq limiti — aniq integraldir.",
      items: [
        {
          title: "Nyuton–Leybnis formulasi",
          latex: "\\int_{a}^{b} f(x)\\,dx = F(b) - F(a), \\quad F'(x) = f(x)",
          explanation: "Bu yerda $F(x)$ — $f(x)$ ning istalgan boshlang‘ich funksiyasi.",
          example: "$\\int_0^3 x^2\\,dx = \\left.\\frac{x^3}{3}\\right|_0^3 = 9 - 0 = 9$."
        },
        {
          title: "Daraja funksiyasi boshlang‘ichi",
          latex: "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)",
          explanation: "Daraja 1 taga ortadi va yangi daraja ko‘rsatkichiga bo‘linadi.",
          example: "$\\int 4x^3\\,dx = x^4 + C$."
        }
      ],
      keyPitfall: {
        title: "Ko‘p uchraydigan xato: Yuqori va quyi chegarani teskari ayirish",
        wrong: "$\\int_1^3 2x\\,dx = 1^2 - 3^2 = -8$.",
        right: "$\\int_1^3 2x\\,dx = F(3) - F(1) = 3^2 - 1^2 = 8$.",
        reason: "Har doim yuqori chegara qiymatidan quyi chegara qiymati ayriladi: $F(b) - F(a)$."
      }
    },
    problems: {
      orta: [
        {
          id: 't105-m-1',
          difficulty: 'orta',
          statement: "Aniq integralni hisoblang: $\\int_{0}^{3} x^2\\,dx$.",
          answer: '9',
          acceptedEquivalents: ['9.0'],
          socraticHint: "$x^2$ ning boshlang‘ich funksiyasi $\\frac{x^3}{3}$ ga $3$ va $0$ chegaralarni qo‘yib ayiring.",
          steps: [
            "$F(x) = \\frac{x^3}{3}$.",
            "$F(3) - F(0) = \\frac{27}{3} - 0 = 9$."
          ],
          sourceLabel: "Usmonov uslubi · 105-mavzu"
        }
      ],
      murakkab: [
        {
          id: 't105-h-1',
          difficulty: 'murakkab',
          statement: "$y = 3x^2 + 2x$ egri chiziq, $Ox$ o‘qi hamda $x = 1$ va $x = 2$ chiziqlar bilan chegaralangan egri chiziqli trapetsiya yuzini toping.",
          answer: '10',
          acceptedEquivalents: ['10.0'],
          socraticHint: "$S = \\int_1^2 (3x^2 + 2x)\\,dx$ ni Nyuton–Leybnis formulasi bilan hisoblang.",
          steps: [
            "$F(x) = x^3 + x^2$.",
            "$F(2) = 8 + 4 = 12$, $F(1) = 1 + 1 = 2$.",
            "$S = 12 - 2 = 10$."
          ],
          sourceLabel: "Usmonov uslubi · Murakkab"
        }
      ]
    }
  }
};

function makeSectionProblems(meta: TopicMeta): { orta: MathProblem[]; murakkab: MathProblem[] } {
  const code = meta.displayCode ?? `${meta.id}-mavzu`;

  if (meta.isVariant) {
    const vNum = meta.id >= 2000 ? meta.id - 2000 : meta.id - 1000;
    const a = (vNum % 5) + 2;
    const b = (vNum % 4) + 3;
    const linearSol = a + b;
    const rhs = 2 * linearSol - b;
    const quadSum = a + b;
    const quadProd = a * b;
    return {
      orta: [
        {
          id: `v-${vNum}-m-1`,
          difficulty: 'orta',
          statement: `(${meta.displayCode}) Chiziqli tenglamani yeching: $2x - ${b} = ${rhs}$.`,
          answer: String(linearSol),
          acceptedEquivalents: [`x = ${linearSol}`],
          socraticHint: `Avval $-${b}$ ni tenglamaning o‘ng tomoniga qarama-qarshi ishora bilan o‘tkazing.`,
          steps: [
            `$2x = ${rhs} + ${b} = ${rhs + b}$.`,
            `$x = \\frac{${rhs + b}}{2} = ${linearSol}$.`
          ],
          sourceLabel: `Usmonov to‘plami · ${code}`
        },
        {
          id: `v-${vNum}-m-2`,
          difficulty: 'orta',
          statement: `(${meta.displayCode}) $x^2 - ${quadSum}x + ${quadProd} = 0$ tenglama ildizlari yig‘indisi va ko‘paytmasi yig‘indisini ($x_1 + x_2 + x_1 x_2$) toping.`,
          answer: String(quadSum + quadProd),
          acceptedEquivalents: [`${quadSum + quadProd}.0`],
          socraticHint: `Viyet teoremasiga ko‘ra $x_1 + x_2 = ${quadSum}$ va $x_1 x_2 = ${quadProd}$.`,
          steps: [
            `Viyet teoremasi: $x_1 + x_2 = ${quadSum}$, $x_1 x_2 = ${quadProd}$.`,
            `Natija: $${quadSum} + ${quadProd} = ${quadSum + quadProd}$.`
          ],
          sourceLabel: `Usmonov to‘plami · ${code}`
        }
      ],
      murakkab: [
        {
          id: `v-${vNum}-h-1`,
          difficulty: 'murakkab',
          statement: `(${meta.displayCode}) Agar $x + \\frac{1}{x} = ${a + 1}$ bo‘lsa, $x^2 + \\frac{1}{x^2}$ ifodaning qiymatini toping.`,
          answer: String((a + 1) * (a + 1) - 2),
          acceptedEquivalents: [`${(a + 1) * (a + 1) - 2}.0`],
          socraticHint: `Berilgan tenglikning ikkala tomonini kvadratga ko‘tarib, $\\left(x + \\frac{1}{x}\\right)^2$ ni oching.`,
          steps: [
            `$\\left(x + \\frac{1}{x}\\right)^2 = x^2 + 2 + \\frac{1}{x^2} = ${(a + 1) * (a + 1)}$.`,
            `$x^2 + \\frac{1}{x^2} = ${(a + 1) * (a + 1)} - 2 = ${(a + 1) * (a + 1) - 2}$.`
          ],
          sourceLabel: `Usmonov to‘plami · ${code} (Murakkab)`
        }
      ]
    };
  }

  switch (meta.sectionId) {
    case 2: {
      const k = (meta.id % 4) + 2;
      const root = (meta.id % 5) + 2;
      return {
        orta: [
          {
            id: `t${meta.id}-m-1`,
            difficulty: 'orta',
            statement: `Ifodani hisoblang: $\\frac{x^2 - ${root * root}}{x - ${root}}$ ifodaning $x = ${root + k}$ dagi qiymatini toping.`,
            answer: String(2 * root + k),
            acceptedEquivalents: [`${2 * root + k}.0`],
            socraticHint: `Suratni kvadratlar ayirmasi bilan $(x - ${root})(x + ${root})$ ga ajratib qisqartiring.`,
            steps: [
              `$\\frac{(x - ${root})(x + ${root})}{x - ${root}} = x + ${root}$ ($x \\neq ${root}$).`,
              `$x = ${root + k}$ da: $${root + k} + ${root} = ${2 * root + k}$.`
            ],
            sourceLabel: `Usmonov uslubi · ${code}`
          },
          {
            id: `t${meta.id}-m-2`,
            difficulty: 'orta',
            statement: `$${k}x - ${k * root} \\le 0$ tengsizlikning eng katta butun yechimini toping.`,
            answer: String(root),
            acceptedEquivalents: [`x = ${root}`],
            socraticHint: `Ikkala tomonni musbat $${k}$ ga bo‘ling.`,
            steps: [
              `$${k}x \\le ${k * root} \\Rightarrow x \\le ${root}$.`,
              `Eng katta butun yechim: $${root}$.`
            ],
            sourceLabel: `Usmonov uslubi · ${code}`
          }
        ],
        murakkab: [
          {
            id: `t${meta.id}-h-1`,
            difficulty: 'murakkab',
            statement: `$|x - ${root}| < ${k}$ tengsizlikni qanoatlantiruvchi barcha butun sonlar nechta?`,
            answer: String(2 * k - 1),
            acceptedEquivalents: [`${2 * k - 1} ta`],
            socraticHint: `Tengsizlikni qo‘sh tengsizlik $-${k} < x - ${root} < ${k}$ ko‘rinishida yozib, ichidagi butun sonlarni sanang.`,
            steps: [
              `$-${k} < x - ${root} < ${k} \\Rightarrow ${root - k} < x < ${root + k}$.`,
              `Oraliqdagi butun sonlar soni: $(${root + k} - 1) - (${root - k} + 1) + 1 = ${2 * k - 1}$.`
            ],
            sourceLabel: `Usmonov uslubi · Murakkab`
          }
        ]
      };
    }

    case 3: {
      const r1 = (meta.id % 4) + 2;
      const r2 = r1 + 3;
      return {
        orta: [
          {
            id: `t${meta.id}-m-1`,
            difficulty: 'orta',
            statement: `$x^2 - ${r1 + r2}x + ${r1 * r2} = 0$ tenglamaning katta ildizini toping.`,
            answer: String(r2),
            acceptedEquivalents: [`x = ${r2}`],
            socraticHint: `Yig‘indisi $${r1 + r2}$, ko‘paytmasi $${r1 * r2}$ bo‘lgan ikki sonni toping.`,
            steps: [
              `Viyet teoremasiga ko‘ra $x_1 = ${r1}, \\; x_2 = ${r2}$.`,
              `Katta ildiz: $${r2}$.`
            ],
            sourceLabel: `Usmonov uslubi · ${code}`
          },
          {
            id: `t${meta.id}-m-2`,
            difficulty: 'orta',
            statement: `Hisoblang: $\\sqrt{${r1 * r1}} + \\sqrt{${r2 * r2}}$.`,
            answer: String(r1 + r2),
            acceptedEquivalents: [`${r1 + r2}.0`],
            socraticHint: `Har bir arifmetik kvadrat ildizni alohida hisoblab qo‘shing.`,
            steps: [
              `$\\sqrt{${r1 * r1}} = ${r1}$ va $\\sqrt{${r2 * r2}} = ${r2}$.`,
              `$${r1} + ${r2} = ${r1 + r2}$.`
            ],
            sourceLabel: `Usmonov uslubi · ${code}`
          }
        ],
        murakkab: [
          {
            id: `t${meta.id}-h-1`,
            difficulty: 'murakkab',
            statement: `Arifmetik progressiyada $a_1 = ${r1}$ va ayirma $d = 3$. Dastlabki $6$ ta had yig‘indisi $S_6$ ni toping.`,
            answer: String(3 * (2 * r1 + 15)),
            acceptedEquivalents: [`${3 * (2 * r1 + 15)}.0`],
            socraticHint: `$S_n = \\frac{2a_1 + (n-1)d}{2} \\cdot n$ formulasini qo‘llang.`,
            steps: [
              `$S_6 = \\frac{2(${r1}) + 5 \\cdot 3}{2} \\cdot 6 = (2 \\cdot ${r1} + 15) \\cdot 3 = ${3 * (2 * r1 + 15)}$.`
            ],
            sourceLabel: `Usmonov uslubi · Murakkab`
          }
        ]
      };
    }

    case 4: {
      const n = (meta.id % 3) + 2;
      return {
        orta: [
          {
            id: `t${meta.id}-m-1`,
            difficulty: 'orta',
            statement: `Hisoblang: $8^{\\frac{2}{3}} + ${n}^2$.`,
            answer: String(4 + n * n),
            acceptedEquivalents: [`${4 + n * n}.0`],
            socraticHint: `$8 = 2^3$ ekanidan foydalanib, $(2^3)^{2/3}$ ni soddalashtiring.`,
            steps: [
              `$8^{2/3} = (2^3)^{2/3} = 2^2 = 4$.`,
              `$4 + ${n * n} = ${4 + n * n}$.`
            ],
            sourceLabel: `Usmonov uslubi · ${code}`
          }
        ],
        murakkab: [
          {
            id: `t${meta.id}-h-1`,
            difficulty: 'murakkab',
            statement: `$f(x) = \\sqrt{x - ${n}} + \\frac{1}{x - ${n + 4}}$ funksiyaning aniqlanish sohasiga kiruvchi eng kichik butun sonni toping.`,
            answer: String(n),
            acceptedEquivalents: [`x = ${n}`],
            socraticHint: `Juft darajali ildiz osti manfiy bo‘lmasligi ($x - ${n} \\ge 0$) va maxraj nolga teng bo‘lmasligi kerak.`,
            steps: [
              `$x - ${n} \\ge 0 \\Rightarrow x \\ge ${n}$ va $x \\neq ${n + 4}$.`,
              `Eng kichik butun son: $${n}$.`
            ],
            sourceLabel: `Usmonov uslubi · Murakkab`
          }
        ]
      };
    }

    case 5: {
      const p = (meta.id % 3) + 2;
      return {
        orta: [
          {
            id: `t${meta.id}-m-1`,
            difficulty: 'orta',
            statement: `Hisoblang: $\\log_2 ${Math.pow(2, p + 1)} + \\log_3 ${Math.pow(3, p)}$.`,
            answer: String(2 * p + 1),
            acceptedEquivalents: [`${2 * p + 1}.0`],
            socraticHint: `Har bir logarifm qiymati asosni nechanchi darajaga ko‘tarish kerakligini bildiradi.`,
            steps: [
              `$\\log_2 ${Math.pow(2, p + 1)} = ${p + 1}$ va $\\log_3 ${Math.pow(3, p)} = ${p}$.`,
              `$${p + 1} + ${p} = ${2 * p + 1}$.`
            ],
            sourceLabel: `Usmonov uslubi · ${code}`
          }
        ],
        murakkab: [
          {
            id: `t${meta.id}-h-1`,
            difficulty: 'murakkab',
            statement: `$\\log_2(x - ${p}) = 3$ logarifmik tenglamani yeching.`,
            answer: String(8 + p),
            acceptedEquivalents: [`x = ${8 + p}`],
            socraticHint: `Logarifm ta’rifiga ko‘ra $x - ${p} = 2^3$.`,
            steps: [
              `Aniqlanish sohasi: $x > ${p}$.`,
              `$x - ${p} = 2^3 = 8 \\Rightarrow x = ${8 + p}$.`
            ],
            sourceLabel: `Usmonov uslubi · Murakkab`
          }
        ]
      };
    }

    case 6:
    case 7: {
      const m = (meta.id % 3) + 2;
      return {
        orta: [
          {
            id: `t${meta.id}-m-1`,
            difficulty: 'orta',
            statement: `Hisoblang: $${m}\\sin^2 37^\\circ + ${m}\\cos^2 37^\\circ + 1$.`,
            answer: String(m + 1),
            acceptedEquivalents: [`${m + 1}.0`],
            socraticHint: `$${m}$ ni qavsdan tashqariga chiqaring va asosiy trigonometrik ayniyat $\\sin^2\\alpha + \\cos^2\\alpha = 1$ ni qo‘llang.`,
            steps: [
              `$${m}(\\sin^2 37^\\circ + \\cos^2 37^\\circ) + 1 = ${m} \\cdot 1 + 1 = ${m + 1}$.`
            ],
            sourceLabel: `Usmonov uslubi · ${code}`
          }
        ],
        murakkab: [
          {
            id: `t${meta.id}-h-1`,
            difficulty: 'murakkab',
            statement: `$2\\sin x = 1$ tenglamaning $[0^\\circ; 180^\\circ]$ oraliqdagi ildizlari yig‘indisini (gradusda) toping.`,
            answer: '180',
            acceptedEquivalents: ['180°'],
            socraticHint: `$\\sin x = \\frac{1}{2}$ qiymatga I chorakda $30^\\circ$ va II chorakda $150^\\circ$ mos keladi.`,
            steps: [
              `$\\sin x = \\frac{1}{2} \\Rightarrow x_1 = 30^\\circ, \\; x_2 = 150^\\circ$.`,
              `Yig‘indi: $30^\\circ + 150^\\circ = 180^\\circ$.`
            ],
            sourceLabel: `Usmonov uslubi · Murakkab`
          }
        ]
      };
    }

    default: {
      // Section 8: Calculus
      const c = (meta.id % 4) + 2;
      return {
        orta: [
          {
            id: `t${meta.id}-m-1`,
            difficulty: 'orta',
            statement: `$f(x) = x^2 + ${c}x - 5$ funksiya uchun $f'(3)$ ni hisoblang.`,
            answer: String(6 + c),
            acceptedEquivalents: [`${6 + c}.0`],
            socraticHint: `Avval $f'(x) = 2x + ${c}$ hosilani toping, so‘ng $x = 3$ qo‘ying.`,
            steps: [
              `$f'(x) = 2x + ${c}$.`,
              `$f'(3) = 2(3) + ${c} = ${6 + c}$.`
            ],
            sourceLabel: `Usmonov uslubi · ${code}`
          }
        ],
        murakkab: [
          {
            id: `t${meta.id}-h-1`,
            difficulty: 'murakkab',
            statement: `Aniq integralni hisoblang: $\\int_{0}^{2} (3x^2 + ${2 * c}x)\\,dx$.`,
            answer: String(8 + 4 * c),
            acceptedEquivalents: [`${8 + 4 * c}.0`],
            socraticHint: `Boshlang‘ich funksiya $F(x) = x^3 + ${c}x^2$ ni topib, $F(2) - F(0)$ ni hisoblang.`,
            steps: [
              `$F(x) = x^3 + ${c}x^2$.`,
              `$F(2) - F(0) = 8 + ${4 * c} - 0 = ${8 + 4 * c}$.`
            ],
            sourceLabel: `Usmonov uslubi · Murakkab`
          }
        ]
      };
    }
  }
}

function getCategoryIntuitionTemplate(meta: TopicMeta) {
  const route = resolveSimulatorForTopic(meta.id);
  switch (route.category) {
    case 'algebra':
      return {
        headline: `${meta.title} — vizual modelda o‘zaro bog‘lanishni his qiling`,
        analogyTitle: "Muvozanat, yuza va sonlar o‘qi chegaralari",
        analogyStory:
          "Har qanday algebraik amal ortida aniq fizik yoki geometrik ma’no bor: tenglama — ikki pallali tarozi, qisqa ko‘paytirish — bo‘laklangan to‘rtburchak yuzasi, tengsizlik esa sonlar o‘qida ajratilgan xavfsiz oraliqdir.",
        guidedPrompts: [
          "Simulyatorda slayder va tugmalarni o‘zgartirib, chap va o‘ng tomon o‘rtasidagi muvozanat yoki oraliq qanday siljishini kuzating.",
          "Bitta parametrni ikki baravar oshiring va natijaviy rasm qanday o‘zgarishini taxmin qiling.",
          "Yangi formulaga o‘tishdan oldin qoida nega mantiqan to‘g‘ri ekanini o‘z so‘zingiz bilan ayting."
        ]
      };
    case 'functions':
      return {
        headline: `${meta.title} — koordinata tekisligida jonli tajriba`,
        analogyTitle: "Parametrlar grafikning boshqaruv pultidir",
        analogyStory:
          "Har bir koeffitsiyent grafikni ma’lum bir tarzda boshqaradi: qiyalikni buradi, egri chiziqni yuqoriga-pastga ko‘chiradi yoki o‘sish tezligini keskin o‘zgartiradi.",
        guidedPrompts: [
          "Parametr slayderlarini sekin suring va grafikning $Ox$ hamda $Oy$ o‘qlarini kesish nuqtalarini kuzating.",
          "Asosiy koeffitsiyent ishorasini musbatdan manfiyga o‘zgartiring.",
          "Grafikning aniqlanish sohasi va ildizlari soni qachon o‘zgarishini qayd eting."
        ]
      };
    case 'trigonometry':
      return {
        headline: `${meta.title} — birlik aylana va jonli to‘lqin bog‘lanishi`,
        analogyTitle: "Aylanma harakatning soyasi — sinusoida",
        analogyStory:
          "Birlik aylanada nuqta tekis aylanayotganda uning vertikal balandligi sinusni, gorizontal masofasi kosinusni beradi; vaqt o‘tishi bilan bu proyeksiyalar to‘lqin grafigini chizadi.",
        guidedPrompts: [
          "Birlik aylanadagi nuqtani barmoq yoki sichqoncha bilan sudrab burchakni o‘zgartiring.",
          "Har bir chorakda $\\sin\\theta$, $\\cos\\theta$ va $\\tan\\theta$ ishoralari nega shunday bo‘lishini aylanadan o‘qing.",
          "Tayanch burchaklar ($30^\\circ, 45^\\circ, 60^\\circ, 90^\\circ, 180^\\circ$) tugmalarini bosib radian qiymatlarini solishtiring."
        ]
      };
    case 'calculus':
      return {
        headline: `${meta.title} — cheksiz yaqinlashish laboratoriyasi`,
        analogyTitle: "Oniy qiyalik va cheksiz ingichka ustunchalar",
        analogyStory:
          "Matematik analiz ikkita buyuk g‘oyaga tayanadi: egri chiziqni juda yaqindan ko‘rsangiz u to‘g‘ri chiziqqa (urinmaga) o‘xshaydi, egri yuzani cheksiz ingichka chiziqlarga bo‘lsangiz u aniq yuzaga aylanadi.",
        guidedPrompts: [
          "Hosila rejimida $x$ nuqtani surib, urinma qiyaligi nol bo‘ladigan cho‘qqi va tub nuqtalarni toping.",
          "Integral rejimida Riman to‘rtburchaklari soni $N$ ni oshiring va xatolik nolga intilishini kuzating.",
          "Parabola, kubik va sinus egri chiziqlarini solishtiring."
        ]
      };
    default:
      return {
        headline: `${meta.title} — masalani chizma va modelga aylantiring`,
        analogyTitle: "To‘g‘ri chizma — yechimning yarmi",
        analogyStory:
          "Murakkab matnli yoki aralash variant masalalarida ma’lumotlarni vizual sxemaga tushirsangiz, noma’lum kattalik va tenglama darhol ko‘rinib qoladi.",
        guidedPrompts: [
          "Harakat, aralashma yoki birgalikda ishlash rejimidan birini tanlab slayderlarni o‘zgartiring.",
          "Boshlang‘ich shart o‘zgarganda yakuniy vaqt yoki konsentratsiya qanday o‘zgarishini sinang.",
          "O‘zingizdagi aniq masala matnini pastdagi AI SVG diagramma maydoniga yozib maxsus sxema chizdiring."
        ]
      };
  }
}

function getSectionFormulaItems(meta: TopicMeta) {
  switch (meta.sectionId) {
    case 2:
      return [
        {
          title: "Ratsional kasrni qisqartirish",
          latex: "\\frac{A \\cdot C}{B \\cdot C} = \\frac{A}{B} \\quad (B \\neq 0, \\; C \\neq 0)",
          explanation: "Surat va maxrajni umumiy nolga teng bo‘lmagan ko‘paytuvchiga bo‘lish mumkin.",
          example: "$\\frac{x^2 - 9}{x - 3} = x + 3$ ($x \\neq 3$)."
        },
        {
          title: "Tengsizlikda manfiy ko‘paytuvchi qoidasi",
          latex: "a < b, \\; k < 0 \\Rightarrow ka > kb",
          explanation: "Manfiy songa ko‘paytirish yoki bo‘lish tengsizlik ishorasini qarama-qarshisiga buradi.",
          example: "$-2x \\ge 6 \\Rightarrow x \\le -3$."
        },
        {
          title: "Modulning masofa talqini",
          latex: "|x - a| < r \\iff a - r < x < a + r \\quad (r > 0)",
          explanation: "$|x - a|$ ifoda sonlar o‘qida $x$ va $a$ nuqtalar orasidagi masofani bildiradi.",
          example: "$|x - 2| < 3 \\iff -1 < x < 5$."
        }
      ];
    case 3:
      return [
        {
          title: "Diskriminant va kvadrat tenglama ildizlari",
          latex: "ax^2 + bx + c = 0, \\quad D = b^2 - 4ac, \\quad x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}",
          explanation: "Diskriminant ishorasi haqiqiy ildizlar sonini aniq belgilaydi.",
          example: "$x^2 - 5x + 6 = 0 \\Rightarrow x_1 = 2, \\; x_2 = 3$."
        },
        {
          title: "Viyet teoremasi",
          latex: "x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 \\cdot x_2 = \\frac{c}{a}",
          explanation: "Ildizlarni topmasdan turib ham ularning yig‘indisi va ko‘paytmasini darhol aniqlash mumkin.",
          example: "$x^2 - 7x + 10 = 0 \\Rightarrow x_1 + x_2 = 7, \\; x_1 x_2 = 10$."
        },
        {
          title: "Arifmetik va geometrik progressiyalar",
          latex: "a_n = a_1 + (n-1)d, \\quad b_n = b_1 \\cdot q^{n-1}",
          explanation: "Arifmetik progressiyada teng qo‘shiluvchi $d$, geometrikda esa teng ko‘paytuvchi $q$ ishlaydi.",
          example: "$a_1 = 2, d = 3 \\Rightarrow a_5 = 14$."
        }
      ];
    case 4:
      return [
        {
          title: "Ratsional ko‘rsatkichli daraja",
          latex: "a^{\\frac{m}{n}} = \\sqrt[n]{a^m} \\quad (a > 0, \\; n \\in \\mathbb{N}, \\; n \\ge 2)",
          explanation: "Kasr darajaning maxraji ildiz darajasini, surati esa sonning darajasini bildiradi.",
          example: "$27^{2/3} = (\\sqrt[3]{27})^2 = 9$."
        },
        {
          title: "Juft darajali ildiz va modul",
          latex: "\\sqrt[2k]{a^{2k}} = |a|",
          explanation: "Juft darajali ildiz har doim manfiy bo‘lmagan natija beradi.",
          example: "$\\sqrt{(-5)^2} = |-5| = 5$."
        }
      ];
    case 5:
      return [
        {
          title: "Ko‘rsatkichli va logarifmik bog‘lanish",
          latex: "a^x = b \\iff x = \\log_a b \\quad (a > 0, \\; a \\neq 1, \\; b > 0)",
          explanation: "Logarifm — ko‘rsatkichli funksiyaning teskari amalidir.",
          example: "$\\log_3 81 = 4$, chunki $3^4 = 81$."
        },
        {
          title: "Logarifm xossalari va yangi asosga o‘tish",
          latex: "\\log_a(xy) = \\log_a x + \\log_a y, \\quad \\log_a b = \\frac{\\log_c b}{\\log_c a}",
          explanation: "Turli asosli logarifmlarni bitta umumiy asosga keltirib hisoblash mumkin.",
          example: "$\\log_4 8 = \\frac{\\log_2 8}{\\log_2 4} = \\frac{3}{2}$."
        }
      ];
    case 6:
    case 7:
      return [
        {
          title: "Asosiy trigonometrik ayniyat",
          latex: "\\sin^2\\alpha + \\cos^2\\alpha = 1, \\quad 1 + \\tan^2\\alpha = \\frac{1}{\\cos^2\\alpha}",
          explanation: "Birlik aylanadagi Pifagor teoremasining bevosita ifodasi.",
          example: "$\\sin^2 25^\\circ + \\cos^2 25^\\circ = 1$."
        },
        {
          title: "Ikkilangan burchak formulalari",
          latex: "\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha, \\quad \\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha",
          explanation: "Daraja pasaytirish va trigonometrik tenglamalarni soddalashtirishning asosiy quroli.",
          example: "$2\\sin 15^\\circ\\cos 15^\\circ = \\sin 30^\\circ = \\frac{1}{2}$."
        },
        {
          title: "Eng sodda trigonometrik tenglamalar",
          latex: "\\sin x = a \\Rightarrow x = (-1)^k \\arcsin a + \\pi k, \\quad \\cos x = a \\Rightarrow x = \\pm \\arccos a + 2\\pi k",
          explanation: "Davriylik sababli trigonometrik tenglamalar cheksiz ko‘p yechimlar oilasiga ega ($k \\in \\mathbb{Z}, |a| \\le 1$).",
          example: "$\\cos x = \\frac{1}{2} \\Rightarrow x = \\pm \\frac{\\pi}{3} + 2\\pi k$."
        }
      ];
    default:
      return [
        {
          title: "Hosila olishning asosiy qoidalari",
          latex: "(u \\cdot v)' = u'v + uv', \\quad \\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}",
          explanation: "Murakkab ifodalarni elementar hosilalarga ajratib hisoblash qoidalari.",
          example: "$(x \\sin x)' = \\sin x + x\\cos x$."
        },
        {
          title: "Zanjir qoidasi (murakkab funksiya)",
          latex: "(f(g(x)))' = f'(g(x)) \\cdot g'(x)",
          explanation: "Avval tashqi funksiyadan hosila olinadi, so‘ng ichki funksiya hosilasiga ko‘paytiriladi.",
          example: "$(\\sin(3x))' = 3\\cos(3x)$."
        },
        {
          title: "Nyuton–Leybnis formulasi",
          latex: "\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)",
          explanation: "Aniq integral egri chiziq ostidagi ishorali yuzani beradi.",
          example: "$\\int_0^2 2x\\,dx = 2^2 - 0^2 = 4$."
        }
      ];
  }
}

export function buildSeedLessonForTopic(meta: TopicMeta): TopicLesson {
  if (EXTENDED_FLAGSHIP_LESSONS[meta.id]) {
    return EXTENDED_FLAGSHIP_LESSONS[meta.id];
  }

  const intuition = getCategoryIntuitionTemplate(meta);
  const formulas = getSectionFormulaItems(meta);
  const problems = makeSectionProblems(meta);

  const label = meta.isVariant
    ? `M. Usmonov nazorat to‘plami · ${meta.displayCode}`
    : `${meta.sectionId}-bo‘lim · ${meta.id}-mavzu`;

  return {
    topicId: meta.id,
    muammo: {
      headline: meta.isVariant
        ? `${meta.title}: turli bo‘lim g‘oyalarini bitta masalada birlashtirish`
        : `${meta.title} nega zarur bo‘ldi?`,
      contextLabel: label,
      story: [
        meta.isVariant
          ? `Imtihon va real muhandislik masalalarida qaysi formulani qo‘llash oldindan aytilmaydi. ${meta.title} sizdan oldingi mavzulardagi bilimlarni tez tanib olish va bir nechta usulni uyg‘unlashtirishni talab qiladi.`
          : `${meta.shortDesc}. Ko‘plab amaliy va nazariy masalalarda aynan shu tushuncha murakkab hisob-kitoblarni tartibga solish va aniq xulosa chiqarish imkonini beradi.`,
        `First-Principles yondashuvida biz qoidani shunchaki yodlamaymiz: avval muammoning ildizini ko‘ramiz, eski usul qayerda to‘xtaganini aniqlaymiz va interaktiv tajriba orqali formulani o‘zimiz kashf qilamiz.`
      ],
      coreQuestion: meta.isVariant
        ? `Aralash shartli masalada eng qisqa va ishonchli yechim strategiyasini qanday tanlaymiz?`
        : `«${meta.title}» mavzusidagi eng muhim qonuniyat nima va u oldingi bilimlardan qanday kelib chiqadi?`,
      historicalNote:
        "M. Usmonov darslik tizimi mavzularni oddiydan murakkabga qarab zanjir kabi bog‘laydi — har bir mavzu keyingi boblar uchun poydevor vazifasini bajaradi."
    },
    chegara: {
      headline: "Oldingi usullar bu yerda qayerda cheklanadi?",
      whatWorkedBefore:
        "Avvalgi bo‘limlardagi oddiy arifmetik va chiziqli almashtirishlar sodda bir bosqichli masalalarda yaxshi natija berar edi.",
      breakingPoint:
        `${meta.title} darajasidagi masalalarda o‘zgaruvchilar murakkabroq bog‘lanishda (daraja, ildiz, logarifm, davriy aylanish yoki cheksiz kichik o‘zgarish) keladi va oddiy tanlash usuli ishlamay qoladi.`,
      deadEndExample:
        "Aniqlanish sohasini (masalan, maxraj nol emasligi, ildiz osti musbatligi yoki asos shartini) tekshirmasdan mexanik shakl almashtirish chet ildizlarga yoki yechim yo‘qolishiga olib keladi.",
      whyNewIdeaNeeded:
        "Geometrik va vizual model yordamida bog‘lanishning mohiyatini ko‘rib olganimizdan so‘ng, formal qoidalar yodlashsiz ham esda qoladi."
    },
    intuisiya: {
      ...intuition,
      defaultSimulatorMode: 'combine',
      defaultPreset: { numA: 3, denA: 4, numB: 1, denB: 4 }
    },
    formula: {
      headline: `${meta.title}: asosiy formulalar va qoidalar`,
      bridgeFromIntuition:
        "Virtual laboratoriyada ko‘rgan o‘zaro bog‘lanishlarni endi qisqa va aniq matematik belgilar tiliga o‘tkazamiz.",
      items: formulas,
      keyPitfall: {
        title: "Diqqat qiling: Aniqlanish sohasi va ishoralar nazorati",
        wrong: "Shakl almashtirishda chegaraviy shartlarni (maxraj $\\neq 0$, ishora almashishi) tekshirmaslik.",
        right: "Har bir qadamda teng kuchli o‘tish va yakuniy javobni boshlang‘ich shartda tekshirish.",
        reason: "M. Usmonov darajasidagi misollarda eng ko‘p ball aynan chet ildizni chiqarib tashlamaslik yoki ishora xatosi tufayli yo‘qotiladi."
      }
    },
    problems
  };
}
