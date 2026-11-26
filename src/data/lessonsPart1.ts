import type { TopicLesson } from '../types/math';

export const LESSONS_PART_1: Record<number, TopicLesson> = {
  3: {
    topicId: 3,
    muammo: {
      headline: "Butun sonlar tugagan joyda ulushni qanday aniq bo'lamiz?",
      contextLabel: "Tarixiy va hayotiy muammo · Qadimgi Misr va Xorazm savdosi",
      story: [
        "Tasavvur qiling: uch nafar quruvchi kun bo'yi ishlab, atigi ikkita bir xil tandir non oldi. Agar ularni adolatli bo'lish kerak bo'lsa, har bir kishiga bittadan butun non yetmaydi, lekin nol non ham emas.",
        "Qadimgi yer o'lchovchilar Nil daryosi toshqinidan keyin dalalarni qayta taqsimlayotganda, hamda Samarqand va Buxoro bozorlarida zargarlar oltin og'irligini o'lchayotganda xuddi shu muammoga duch kelishgan: bitta butun birlikdan kichik bo'lgan aniq miqdorni qanday ifodalash va ularni bir-biriga qo'shish mumkin?",
        "Yana bir murakkablik: bir dehqon yerining uchdan bir qismiga bug'doy, to'rtdan bir qismiga arpa ekdi. Jami yerning qancha qismi ekilganini bilish uchun turli kattalikdagi bo'laklarni bitta umumiy o'lchovga keltirmasdan qo'shib bo'lmaydi.",
      ],
      coreQuestion:
        "Turli xil kesilgan bo'laklarni qanday qilib yo'qotishsiz birlashtirish, taqqoslash va bo'lish mumkin?",
      historicalNote:
        "IX asrda buyuk vatandoshimiz Muhammad al-Xorazmiy o'zining arifmetika asarlarida oddiy kasrlar ustida amallarni tizimli qoida sifatida bayon qilib, Sharq va Yevropa ilm-faniga olib kirdi.",
    },
    chegara: {
      headline: "Natural sonlar qayerda ojiz qoldi?",
      whatWorkedBefore:
        "Natural sonlar (1, 2, 3, ...) sanoqli narsalarni — qo'ylar sonini, daraxtlarni yoki qadamlarni sanashda mukammal ishladi. Qo'shish va ko'paytirish har doim yana natural son berardi.",
      breakingPoint:
        "Biroq bo'lish amali hamma vaqt ham natural son ichida yechimga ega emas. Masalan, 6 ni 3 ga bo'lsak aniq 2 chiqadi, lekin 2 ni 3 ga yoki 5 ni 4 ga bo'lganda natural sonlar olamida javob mavjud emas.",
      deadEndExample:
        "Agar faqat butun sonlar bilan cheklansak, «2 ta nonni 3 kishiga teng bo'ling» topshirig'i yechimsiz boshi berk ko'chaga kirib qoladi. Bundan tashqari, har xil kattalikdagi bo'laklarni (masalan, yarim non bilan chorak nonni) to'g'ridan-to'g'ri «1 + 1 = 2» deb qo'shish qo'pol xatoga olib keladi.",
      whyNewIdeaNeeded:
        "Shu sababli matematika bitta butunni nechta teng qismga bo'lingani va ulardan nechtasi olinganini bir juft son orqali tasvirlaydigan yangi tushunchaga — oddiy kasrga muhtoj bo'ldi.",
    },
    intuisiya: {
      headline: "Formulalarsiz tasavvur: bo'laklash, taqqoslash va sonlar o'qi",
      analogyTitle: "Tandir non va yo'l kesmasi o'xshatishi",
      analogyStory:
        "Bitta butun tandir nonni teng bo'laklarga kesing. Bo'laklar soni qancha ko'paysa, har bir bo'lak shuncha kichrayadi. Ikkita har xil kesilgan non bo'laklarini qo'shmoqchi bo'lsangiz, avval ikkalasini ham bir xil mayda o'lchamga keltirib kesib olish kifoya — shunda shunchaki bir xil bo'laklarni sanab qo'yasiz.",
      guidedPrompts: [
        "Pastdagi simulyatorda lenta va doira ko'rinishlarini almashtirib ko'ring: 4 ta teng bo'lakdan 2 tasi bilan 8 ta teng bo'lakdan 4 tasi sonlar o'qida qaysi nuqtaga tushmoqda?",
        "«Taqqoslash» rejimiga o'ting va 3 bo'lakdan 2 tasini hamda 5 bo'lakdan 3 tasini solishtiring — qaysi biri kattaroq ekanini ko'z bilan ko'ring.",
        "«Birlashtirish» rejimida har xil bo'laklarni qo'shib ko'ring va ular qanday qilib umumiy mayda panjaraga tushishini kuzating.",
      ],
      defaultSimulatorMode: 'single',
      defaultPreset: { numA: 3, denA: 4, numB: 1, denB: 3 },
    },
    formula: {
      headline: "Intuisiyadan aniq belgilarga: oddiy kasrlar qonunlari",
      bridgeFromIntuition:
        "Simulyatorda ko'rgan «nechta teng bo'lakka bo'lingan» soni maxraj ($b$), «nechta bo'lak olingan» soni esa surat ($a$) deb ataladi. Bo'laklarni teng maydalash esa kasrning asosiy xossasidir.",
      items: [
        {
          title: 'Kasrning asosiy xossasi (ekvivalentlik)',
          latex: '\\frac{a}{b} = \\frac{a \\cdot k}{b \\cdot k}, \\quad b \\neq 0, \\; k \\neq 0',
          explanation:
            "Kasrning surat va maxrajini nolga teng bo'lmagan bir xil songa ko'paytirsak yoki bo'lsak, uning qiymati o'zgarmaydi — shunchaki bo'laklar maydalanadi yoki yiriklashadi.",
          example: '$\\frac{2}{3} = \\frac{2 \\cdot 4}{3 \\cdot 4} = \\frac{8}{12}$',
        },
        {
          title: "Har xil maxrajli kasrlarni qo'shish va ayirish",
          latex: '\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{a \\cdot d \\pm c \\cdot b}{b \\cdot d}',
          explanation:
            "Har xil o'lchamdagi bo'laklarni qo'shishdan oldin ularni eng kichik umumiy maxraj (EKUK) ga keltiramiz, so'ngra faqat suratlarni qo'shamiz yoki ayiramiz.",
          example: '$\\frac{2}{3} + \\frac{1}{4} = \\frac{8 + 3}{12} = \\frac{11}{12}$',
        },
        {
          title: "Kasrlarni ko'paytirish",
          latex: '\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}',
          explanation:
            "Bir kasrning ikkinchi kasr ulushini olishda suratlar o'zaro, maxrajlar o'zaro ko'paytiriladi. Ko'paytirishdan oldin qisqartirish hisobni keskin osonlashtiradi.",
          example: '$\\frac{4}{9} \\cdot \\frac{3}{8} = \\frac{1}{3} \\cdot \\frac{1}{2} = \\frac{1}{6}$',
        },
        {
          title: "Kasrlarni bo'lish",
          latex: '\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}, \\quad c \\neq 0',
          explanation:
            "Birinchi kasrni ikkinchisiga bo'lish — uni ikkinchi kasrning teskari qiymatiga ko'paytirish demakdir.",
          example: '$\\frac{5}{6} : \\frac{5}{12} = \\frac{5}{6} \\cdot \\frac{12}{5} = 2$',
        },
      ],
      keyPitfall: {
        title: "Eng ko'p uchraydigan xato",
        wrong: '$\\frac{1}{2} + \\frac{1}{3} = \\frac{1+1}{2+3} = \\frac{2}{5}$',
        right: '$\\frac{1}{2} + \\frac{1}{3} = \\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$',
        reason:
          "Maxrajlar hech qachon qo'shilmaydi! Yarim non bilan uchdan bir non qo'shilsa, yarimdan katta chiqishi kerak ($\\frac{5}{6}$), ammo $\\frac{2}{5}$ hatto yarimdan ham kichik!",
      },
    },
    problems: {
      orta: [
        {
          id: 't3-m-1',
          difficulty: 'orta',
          statement: "Hisoblang: $$\\frac{2}{3} + \\frac{1}{6}$$",
          answer: '5/6',
          acceptedEquivalents: ['5/6'],
          socraticHint:
            "Ikkala kasrning maxrajlari har xil ($3$ va $6$). $3$ ni qaysi songa ko'paytirsak umumiy maxraj $6$ hosil bo'ladi?",
          steps: [
            "Umumiy maxrajni topamiz: $\\text{EKUK}(3, 6) = 6$.",
            "Birinchi kasrning surat va maxrajini $2$ ga ko'paytiramiz: $\\frac{2}{3} = \\frac{4}{6}$.",
            "Endi bir xil maxrajli kasrlarni qo'shamiz: $\\frac{4}{6} + \\frac{1}{6} = \\frac{5}{6}$.",
          ],
          sourceLabel: 'Usmonov uslubi · 3.1',
        },
        {
          id: 't3-m-2',
          difficulty: 'orta',
          statement: "Ifodaning qiymatini toping: $$\\frac{7}{8} - \\frac{3}{4} + \\frac{1}{2}$$",
          answer: '5/8',
          acceptedEquivalents: ['0.625', '0,625'],
          socraticHint:
            "$8$, $4$ va $2$ sonlarining barchasi uchun eng qulay umumiy maxraj qaysi son?",
          steps: [
            "$8$, $4$ va $2$ ning eng kichik umumiy karralisi $8$ ga teng.",
            "Kasrlarni $8$ maxrajga keltiramiz: $\\frac{3}{4} = \\frac{6}{8}$ va $\\frac{1}{2} = \\frac{4}{8}$.",
            "Amallarni bajaramiz: $\\frac{7 - 6 + 4}{8} = \\frac{5}{8}$.",
          ],
          sourceLabel: 'Usmonov uslubi · 3.2',
        },
        {
          id: 't3-m-3',
          difficulty: 'orta',
          statement: "Ko'paytmani hisoblang: $$2\\frac{1}{3} \\cdot \\frac{9}{14}$$",
          answer: '3/2',
          acceptedEquivalents: ['1.5', '1,5', '1 1/2'],
          socraticHint:
            "Aralash sonni ko'paytirishdan oldin qanday ko'rinishga o'tkazish kerak? $2\\frac{1}{3}$ da jami nechta $\\frac{1}{3}$ bor?",
          steps: [
            "Aralash sonni noto'g'ri kasrga aylantiramiz: $2\\frac{1}{3} = \\frac{2 \\cdot 3 + 1}{3} = \\frac{7}{3}$.",
            "Ko'paytmani yozamiz va qisqartiramiz: $\\frac{7}{3} \\cdot \\frac{9}{14} = \\frac{1}{1} \\cdot \\frac{3}{2}$.",
            "Natija: $\\frac{3}{2} = 1\\frac{1}{2} = 1{,}5$.",
          ],
          sourceLabel: 'Usmonov uslubi · 3.3',
        },
        {
          id: 't3-m-4',
          difficulty: 'orta',
          statement: "Hisoblang: $$\\left(\\frac{5}{6} - \\frac{1}{4}\\right) : \\frac{7}{12}$$",
          answer: '1',
          acceptedEquivalents: ['1/1'],
          socraticHint:
            "Avval qavs ichidagi ayirmani $12$ umumiy maxrajga keltirib hisoblang. So'ng bo'lishni teskari kasrga ko'paytirish bilan almashtiring.",
          steps: [
            "Qavs ichini hisoblaymiz: $\\frac{5}{6} - \\frac{1}{4} = \\frac{10}{12} - \\frac{3}{12} = \\frac{7}{12}$.",
            "Bo'lish amalini bajaramiz: $\\frac{7}{12} : \\frac{7}{12} = \\frac{7}{12} \\cdot \\frac{12}{7} = 1$.",
          ],
          sourceLabel: 'Usmonov uslubi · 3.4',
        },
        {
          id: 't3-m-5',
          difficulty: 'orta',
          statement: "Amallar tartibiga rioya qilib hisoblang: $$\\frac{3}{5} + \\frac{2}{5} \\cdot \\frac{5}{8}$$",
          answer: '17/20',
          acceptedEquivalents: ['0.85', '0,85'],
          socraticHint:
            "Diqqat! Avval qo'shish bajariladimi yoki ko'paytirish? Avval $\\frac{2}{5} \\cdot \\frac{5}{8}$ ni qisqartirib oling.",
          steps: [
            "Avval ko'paytirishni bajaramiz: $\\frac{2}{5} \\cdot \\frac{5}{8} = \\frac{2}{8} = \\frac{1}{4}$.",
            "Endi qo'shamiz: $\\frac{3}{5} + \\frac{1}{4} = \\frac{12}{20} + \\frac{5}{20} = \\frac{17}{20}$.",
          ],
          sourceLabel: 'Usmonov uslubi · 3.5',
        },
      ],
      murakkab: [
        {
          id: 't3-h-1',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$\\left(3\\frac{1}{4} - 1\\frac{5}{6}\\right) : \\left(2\\frac{1}{2} - 1\\frac{1}{12}\\right)$$",
          answer: '1',
          acceptedEquivalents: ['1/1'],
          socraticHint:
            "Har ikkala qavs ichidagi aralash sonlarni $12$ umumiy maxrajga keltirib hisoblab ko'ring. Qiziq bir tenglik sezdingizmi?",
          steps: [
            "Birinchi qavs: $3\\frac{1}{4} - 1\\frac{5}{6} = \\frac{13}{4} - \\frac{11}{6} = \\frac{39 - 22}{12} = \\frac{17}{12}$.",
            "Ikkinchi qavs: $2\\frac{1}{2} - 1\\frac{1}{12} = \\frac{5}{2} - \\frac{13}{12} = \\frac{30 - 13}{12} = \\frac{17}{12}$.",
            "Nisbatni hisoblaymiz: $\\frac{17}{12} : \\frac{17}{12} = 1$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 3.11',
        },
        {
          id: 't3-h-2',
          difficulty: 'murakkab',
          statement: "Ko'p qavatli kasrning qiymatini toping: $$\\frac{\\frac{2}{3} + \\frac{3}{4} - \\frac{5}{12}}{\\frac{5}{6} - \\frac{1}{3}}$$",
          answer: '2',
          acceptedEquivalents: ['2/1'],
          socraticHint:
            "Katta kasrning suratini ($12$ maxrajda) va maxrajini ($6$ maxrajda) alohida-alohida hisoblang, keyin suratni maxrajga bo'ling.",
          steps: [
            "Suratni hisoblaymiz: $\\frac{8 + 9 - 5}{12} = \\frac{12}{12} = 1$.",
            "Maxrajni hisoblaymiz: $\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$.",
            "Kasrni soddalashtiramiz: $1 : \\frac{1}{2} = 1 \\cdot 2 = 2$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 3.14',
        },
        {
          id: 't3-h-3',
          difficulty: 'murakkab',
          statement: "Qulay usul (teleskopik yoyilma) bilan hisoblang: $$\\frac{1}{1 \\cdot 2} + \\frac{1}{2 \\cdot 3} + \\frac{1}{3 \\cdot 4} + \\frac{1}{4 \\cdot 5}$$",
          answer: '4/5',
          acceptedEquivalents: ['0.8', '0,8'],
          socraticHint:
            "Har bir qo'shiluvchini ikki kasrning ayirmasi shaklida yozib ko'ring: masalan, $\\frac{1}{2 \\cdot 3} = \\frac{1}{2} - \\frac{1}{3}$. O'rtadagi hadlar nima bo'ladi?",
          steps: [
            "Har bir hadni $\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$ qoidasiga ko'ra yoyamiz.",
            "$\\left(1 - \\frac{1}{2}\\right) + \\left(\\frac{1}{2} - \\frac{1}{3}\\right) + \\left(\\frac{1}{3} - \\frac{1}{4}\\right) + \\left(\\frac{1}{4} - \\frac{1}{5}\\right)$.",
            "Qarama-qarshi hadlar qisqarib ketadi va faqat $1 - \\frac{1}{5} = \\frac{4}{5}$ qoladi.",
          ],
          sourceLabel: 'Usmonov · Murakkab 3.19',
        },
        {
          id: 't3-h-4',
          difficulty: 'murakkab',
          statement: "Uzluksiz kasrni hisoblang: $$\\frac{1}{1 + \\frac{1}{2 + \\frac{1}{3}}}$$",
          answer: '7/10',
          acceptedEquivalents: ['0.7', '0,7'],
          socraticHint:
            "Eng pastki qavatdan yuqoriga qarab hisoblang: avval $2 + \\frac{1}{3}$ nechaga teng?",
          steps: [
            "Eng pastki qavat: $2 + \\frac{1}{3} = \\frac{7}{3}$.",
            "O'rta qavat: $\\frac{1}{7/3} = \\frac{3}{7}$, demak $1 + \\frac{3}{7} = \\frac{10}{7}$.",
            "Yuqori qavat: $\\frac{1}{10/7} = \\frac{7}{10}$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 3.22',
        },
        {
          id: 't3-h-5',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$\\left(4\\frac{1}{6} - 2\\frac{3}{4}\\right) \\cdot \\frac{24}{17} - \\frac{1}{2}$$",
          answer: '3/2',
          acceptedEquivalents: ['1.5', '1,5', '1 1/2'],
          socraticHint:
            "Avval $4\\frac{1}{6} - 2\\frac{3}{4}$ ni $12$ umumiy maxrajda hisoblang. Suratda $17$ chiqqanini ko'rdingizmi?",
          steps: [
            "Qavs ichi: $\\frac{25}{6} - \\frac{11}{4} = \\frac{50 - 33}{12} = \\frac{17}{12}$.",
            "Ko'paytiramiz: $\\frac{17}{12} \\cdot \\frac{24}{17} = 2$.",
            "Ayiramiz: $2 - \\frac{1}{2} = \\frac{3}{2} = 1{,}5$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 3.25',
        },
      ],
    },
  },

  4: {
    topicId: 4,
    muammo: {
      headline: "Savdo va muhandislikda minglab har xil maxrajlardan qanday qutulamiz?",
      contextLabel: "Tarixiy muammo · Al-Koshiy va Yevropa olimlari",
      story: [
        "Oddiy kasrlar juda aniq, ammo tasavvur qiling: bir dorixonachi $\\frac{7}{16}$ gramm va $\\frac{9}{25}$ gramm kukunni tezda qo'shishi yoki qaysi biri kattaroq ekanini bir qarashda aytishi kerak. Har safar umumiy maxraj izlash juda sekin!",
        "XV asrda Samarqandda Ulug'bek rasadxonasida ishlagan buyuk matematik G'iyosiddin Jamshid al-Koshiy astronomik jadvallarni hisoblayotib, maxrajlari faqat 10, 100, 1000 bo'lgan yagona standart tizimni taklif qildi.",
      ],
      coreQuestion:
        "Agar barcha bo'laklarni faqat o'nlik zinapoyada (10, 100, 1000 qism) o'lchasak, hisob-kitob qanchalik tezlashadi?",
      historicalNote:
        "Al-Koshiy 1427-yilda yozilgan «Miftoh al-hisob» (Hisob kaliti) asarida o'nli kasrlar nazariyasini to'liq yaratib, $\\pi$ sonini verguldan keyin 16 xonagacha aniqlikda hisoblagan.",
    },
    chegara: {
      headline: "Har xil maxrajlar tezlikka to'siq bo'ldi",
      whatWorkedBefore: "Oddiy kasrlar istalgan bo'lakni aniq ifodalay oldi.",
      breakingPoint:
        "Ikki kasrni tez taqqoslash (masalan, $\\frac{13}{17}$ kattami yoki $\\frac{19}{25}$?) va ko'p xonali o'lchovlarni jamlash uchun har safar yangi umumiy maxraj qidirishga to'g'ri kelardi.",
      deadEndExample:
        "Muhandislik chizmasida uzunliklar $\\frac{3}{8}$, $\\frac{7}{20}$ va $\\frac{5}{16}$ metr deb yozilsa, bitta chizg'ichda ularni tez o'lchash imkonsiz bo'ladi.",
      whyNewIdeaNeeded:
        "Butun sonlardagi o'nlik xonalar (birlik, o'nlik, yuzlik) g'oyasini verguldan o'ng tomonga davom ettirish orqali o'nli kasrlar vujudga keldi.",
    },
    intuisiya: {
      headline: "O'n bo'lakka bo'lingan chizg'ich va tanga tizimi",
      analogyTitle: "1 metrni 10 detsimetrga va 100 santimetrga bo'lish",
      analogyStory:
        "Bitta butun lentani 10 ta teng bo'lakka bo'lsangiz, har bir bo'lak bitta o'ndan bir ulushdir. Endi o'sha kichik bo'lakning o'zini yana 10 ga bo'lsangiz, yuzdan bir ulush hosil bo'ladi. Shuning uchun bir xil xonalarni ustun shaklida tagma-tag yozib qo'shish kifoya!",
      guidedPrompts: [
        "Simulyatorda maxrajni 10 ga qo'ying va bo'laklarni bosib o'nli ulushlar sonlar o'qida qanday joylashishini kuzating.",
        "«Taqqoslash» rejimida 10 dan 5 bo'lak bilan 2 dan 1 bo'lakning bir xil nuqtada turishini tekshiring.",
      ],
      defaultSimulatorMode: 'compare',
      defaultPreset: { numA: 5, denA: 10, numB: 1, denB: 2 },
    },
    formula: {
      headline: "O'nli kasrlar ustida asosiy qoidalar",
      bridgeFromIntuition:
        "O'nli kasr — maxraji $10^n$ ko'rinishidagi oddiy kasrning vergulli qisqa yozuvidir.",
      items: [
        {
          title: "Qo'shish va ayirish (vergul tagiga vergul)",
          latex: 'a{,}bc \\pm d{,}ef',
          explanation:
            "Bir xil xonalar (o'ndan birlar, yuzdan birlar) mos tushishi uchun vergullar qat'iy bir vertikal chiziqda joylashtiriladi.",
          example: '$2{,}45 + 0{,}8 = 2{,}45 + 0{,}80 = 3{,}25$',
        },
        {
          title: "O'nli kasrlarni ko'paytirish",
          latex: '0{,}a \\cdot 0{,}b = \\frac{a \\cdot b}{100}',
          explanation:
            "Avval vergullarga e'tibor bermay natural sonlardek ko'paytiramiz, so'ngra ikkala ko'paytuvchidagi verguldan keyingi raqamlar soni yig'indisicha o'ngdan chapga vergul suramiz.",
          example: '$1{,}2 \\cdot 0{,}05 = 0{,}060 = 0{,}06$',
        },
        {
          title: "O'nli kasrga bo'lish",
          latex: '\\frac{A}{B} = \\frac{A \\cdot 10^k}{B \\cdot 10^k}',
          explanation:
            "Bo'luvchini natural songa aylantirish uchun bo'linuvchi va bo'luvchidagi vergulni bir xil xona o'ngga suramiz.",
          example: '$3{,}6 : 0{,}12 = 360 : 12 = 30$',
        },
      ],
      keyPitfall: {
        title: "Vergulni noto'g'ri surish xatosi",
        wrong: '$0{,}2 \\cdot 0{,}3 = 0{,}6$',
        right: '$0{,}2 \\cdot 0{,}3 = 0{,}06$',
        reason:
          "Har ikki ko'paytuvchida bittadan, jami 2 ta kasr xonasi bor: $\\frac{2}{10} \\cdot \\frac{3}{10} = \\frac{6}{100} = 0{,}06$.",
      },
    },
    problems: {
      orta: [
        {
          id: 't4-m-1',
          difficulty: 'orta',
          statement: "Hisoblang: $$3{,}75 + 1{,}4 - 0{,}65$$",
          answer: '4.5',
          acceptedEquivalents: ['4,5', '9/2'],
          socraticHint: "Avval $3{,}75 - 0{,}65$ ni ayirib olsangiz hisob yanada osonlashadi!",
          steps: [
            "Qulay tartibda guruhlaymiz: $(3{,}75 - 0{,}65) + 1{,}4$.",
            "$3{,}75 - 0{,}65 = 3{,}10$.",
            "$3{,}1 + 1{,}4 = 4{,}5$.",
          ],
          sourceLabel: 'Usmonov uslubi · 4.1',
        },
        {
          id: 't4-m-2',
          difficulty: 'orta',
          statement: "Hisoblang: $$0{,}48 : 0{,}16 + 1{,}5 \\cdot 0{,}4$$",
          answer: '3.6',
          acceptedEquivalents: ['3,6', '18/5'],
          socraticHint:
            "Bo'lishda vergulni 2 xona o'ngga suring ($48 : 16$). Ko'paytirishda esa $15 \\cdot 4$ ni hisoblab, 2 xona ajrating.",
          steps: [
            "$0{,}48 : 0{,}16 = 48 : 16 = 3$.",
            "$1{,}5 \\cdot 0{,}4 = 0{,}60 = 0{,}6$.",
            "$3 + 0{,}6 = 3{,}6$.",
          ],
          sourceLabel: 'Usmonov uslubi · 4.2',
        },
        {
          id: 't4-m-3',
          difficulty: 'orta',
          statement: "Hisoblang: $$(4{,}2 - 1{,}7) : 0{,}25$$",
          answer: '10',
          acceptedEquivalents: ['10.0', '10,0'],
          socraticHint: "$0{,}25$ ga bo'lish — $4$ ga ko'paytirish bilan bir xil ekanini bilasizmi?",
          steps: [
            "Qavs ichi: $4{,}2 - 1{,}7 = 2{,}5$.",
            "$2{,}5 : 0{,}25 = 250 : 25 = 10$.",
          ],
          sourceLabel: 'Usmonov uslubi · 4.3',
        },
      ],
      murakkab: [
        {
          id: 't4-h-1',
          difficulty: 'murakkab',
          statement: "Qulay usulda hisoblang: $$\\frac{3{,}6 \\cdot 0{,}45 \\cdot 0{,}14}{0{,}18 \\cdot 0{,}7 \\cdot 0{,}9}$$",
          answer: '2',
          acceptedEquivalents: ['2.0', '2,0'],
          socraticHint:
            "Surat va maxrajdagi verguldan keyingi raqamlar sonini sanang: ikkalasida ham jami nechta raqam bor? Keyin natural sonlarni qisqartiring.",
          steps: [
            "Suratda $1 + 2 + 2 = 5$ ta, maxrajda $2 + 1 + 1 = 4$ ta kasr xonasi bor. Ikkalasini $10^5$ ga ko'paytiramiz:",
            "$\\frac{36 \\cdot 45 \\cdot 14}{18 \\cdot 7 \\cdot 9 \\cdot 10}$.",
            "Qisqartiramiz: $\\frac{36}{18} = 2$, $\\frac{45}{9} = 5$, $\\frac{14}{7} = 2$.",
            "$\\frac{2 \\cdot 5 \\cdot 2}{10} = \\frac{20}{10} = 2$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 4.12',
        },
        {
          id: 't4-h-2',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$\\frac{0{,}36 \\cdot 4{,}2 + 0{,}36 \\cdot 5{,}8}{0{,}09 \\cdot 1{,}6 + 0{,}09 \\cdot 0{,}4}$$",
          answer: '20',
          acceptedEquivalents: ['20.0'],
          socraticHint:
            "Ko'paytirishga shoshilmang! Suratda $0{,}36$ ni, maxrajda $0{,}09$ ni qavsdan tashqariga chiqarib ko'ring.",
          steps: [
            "Surat: $0{,}36 \\cdot (4{,}2 + 5{,}8) = 0{,}36 \\cdot 10 = 3{,}6$.",
            "Maxraj: $0{,}09 \\cdot (1{,}6 + 0{,}4) = 0{,}09 \\cdot 2 = 0{,}18$.",
            "Bo'lamiz: $3{,}6 : 0{,}18 = 360 : 18 = 20$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 4.18',
        },
      ],
    },
  },

  5: {
    topicId: 5,
    muammo: {
      headline: "Bitta masalada ham oddiy, ham o'nli kasr kelsa qaysi yo'lni tanlaymiz?",
      contextLabel: "Amaliy muammo · Qurilish va kimyoviy eritmalar",
      story: [
        "Laboratoriyada bir idishga $0{,}75$ litr suv, ikkinchisidan esa $\\frac{2}{3}$ litr eritma quyildi. Agar $\\frac{2}{3}$ ni o'nli kasrga o'tkazmoqchi bo'lsangiz, $0{,}6666...$ cheksiz davom etadi va yaxlitlash xatolik keltirib chiqaradi.",
        "Aksincha, $0{,}75$ ni oddiy kasrga ($\\frac{3}{4}$) aylantirsangiz, mutlaqo aniq hisob chiqadi. Demak, eng muhim mahorat — qaysi kasrni qaysi shaklga o'tkazishni oldindan ko'ra bilish!",
      ],
      coreQuestion:
        "Qachon hamma sonni o'nli kasrga, qachon esa oddiy kasrga o'tkazish aniqroq va tezroq bo'ladi?",
      historicalNote:
        "M. Usmonov to'plamida aynan 5-mavzu DTM va olimpiada imtihonlarida eng ko'p vaqt tejaydigan hisoblash madaniyatini shakllantiradi.",
    },
    chegara: {
      headline: "Har qanday oddiy kasr chekli o'nli kasr bo'la olmaydi",
      whatWorkedBefore: "Maxraji faqat 2 va 5 ning ko'paytmasidan iborat kasrlar oson o'nli kasrga aylanardi.",
      breakingPoint:
        "Maxrajda 3, 7, 11 kabi tub ko'paytuvchi qatnashsa, kasr chekli o'nli shaklga tushmaydi.",
      deadEndExample:
        "$\\frac{1}{3} + 0{,}25$ ni o'nli kasrda $0{,}33 + 0{,}25 = 0{,}58$ deb hisoblash aniq qiymatdan ($\\frac{7}{12} = 0{,}58333...$) og'ish beradi.",
      whyNewIdeaNeeded:
        "Maxrajning tub ko'paytuvchilarini tekshirish mezoni va ikki til (oddiy va o'nli kasr) o'rtasida erkin tarjima qilish qoidasi kerak.",
    },
    intuisiya: {
      headline: "Bir xil nuqta — ikki xil nom",
      analogyTitle: "Soat siferblati va metr chizg'ichi",
      analogyStory:
        "Chorak soat (4 dan 1) bilan $0{,}25$ soat sonlar o'qida bitta nuqta. Lekin soatning uchdan bir qismini (20 daqiqani) o'nli chizg'ichda aniq nuqta bilan yozib bo'lmaydi — uni bo'lak ko'rinishida qoldirish aniqroq.",
      guidedPrompts: [
        "Simulyatorda «Taqqoslash» rejimini oching va 4 dan 3 bo'lak bilan 12 dan 9 bo'lakning ustma-ust tushishini kuzating.",
        "«Birlashtirish» rejimida 4 dan 1 (ya'ni 0,25) va 3 dan 1 ni qo'shib ko'ring.",
      ],
      defaultSimulatorMode: 'combine',
      defaultPreset: { numA: 1, denA: 4, numB: 1, denB: 3 },
    },
    formula: {
      headline: "Aralash kasrlarni o'tkazish oltin qoidasi",
      bridgeFromIntuition:
        "Qisqarmas $\\frac{a}{b}$ kasr faqat va faqat $b$ maxrajning tub ko'paytuvchilari ichida $2$ va $5$ dan boshqa son bo'lmagandagina chekli o'nli kasrga aylanadi.",
      items: [
        {
          title: 'Chekli o‘nli kasrga aylanish mezoni',
          latex: 'b = 2^m \\cdot 5^n \\iff \\frac{a}{b} \\text{ chekli o‘nli kasr}',
          explanation:
            "Agar barcha kasrlarning maxrajlari faqat $2$ va $5$ dan iborat bo'lsa — o'nli kasrga o'tkazish qulay; aks holda barchasini oddiy kasrga o'tkazing.",
          example: '$\\frac{3}{8} = 0{,}375$, ammo $\\frac{5}{6}$ ni oddiy kasrda qoldiramiz.',
        },
        {
          title: "Tez yodda tutish juftliklari",
          latex: '\\frac{1}{2}=0{,}5, \\quad \\frac{1}{4}=0{,}25, \\quad \\frac{1}{5}=0{,}2, \\quad \\frac{1}{8}=0{,}125',
          explanation:
            "Ushbu asosiy ekvivalentliklar aralash misollarni soniyalar ichida yechish imkonini beradi.",
          example: '$0{,}75 + \\frac{1}{3} = \\frac{3}{4} + \\frac{1}{3} = \\frac{13}{12}$',
        },
      ],
      keyPitfall: {
        title: "Taqribiy yaxlitlash xatosi",
        wrong: '$\\frac{2}{3} \\cdot 0{,}6 \\approx 0{,}67 \\cdot 0{,}6 = 0{,}402$',
        right: '$\\frac{2}{3} \\cdot \\frac{3}{5} = \\frac{2}{5} = 0{,}4$',
        reason:
          "Hech qachon oraliq bosqichda $\\frac{2}{3}$ ni $0{,}67$ deb yaxlitlamang — $0{,}6 = \\frac{3}{5}$ ga o'tkazsangiz $3$ lar qisqarib aniq $0{,}4$ chiqadi!",
      },
    },
    problems: {
      orta: [
        {
          id: 't5-m-1',
          difficulty: 'orta',
          statement: "Hisoblang: $$0{,}75 + \\frac{5}{12}$$",
          answer: '7/6',
          acceptedEquivalents: ['1 1/6'],
          socraticHint: "$0{,}75$ ni oddiy kasrga ($\\frac{3}{4}$) aylantiring va $12$ umumiy maxrajga keltiring.",
          steps: [
            "$0{,}75 = \\frac{3}{4} = \\frac{9}{12}$.",
            "$\\frac{9}{12} + \\frac{5}{12} = \\frac{14}{12} = \\frac{7}{6} = 1\\frac{1}{6}$.",
          ],
          sourceLabel: 'Usmonov uslubi · 5.1',
        },
        {
          id: 't5-m-2',
          difficulty: 'orta',
          statement: "Hisoblang: $$\\left(1\\frac{2}{5} - 0{,}65\\right) : \\frac{3}{4}$$",
          answer: '1',
          acceptedEquivalents: ['1.0'],
          socraticHint: "$1\\frac{2}{5}$ osonlikcha o'nli kasrga aylanadi ($1{,}4$). Qavs ichi nechaga teng?",
          steps: [
            "$1\\frac{2}{5} = 1{,}4$, demak $1{,}4 - 0{,}65 = 0{,}75$.",
            "$0{,}75 : \\frac{3}{4} = \\frac{3}{4} : \\frac{3}{4} = 1$.",
          ],
          sourceLabel: 'Usmonov uslubi · 5.2',
        },
      ],
      murakkab: [
        {
          id: 't5-h-1',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$\\frac{\\left(2\\frac{1}{3} - 1{,}25\\right) \\cdot 1{,}2}{0{,}65 : \\frac{1}{2}}$$",
          answer: '1',
          acceptedEquivalents: ['1.0'],
          socraticHint:
            "Suratdagi barcha sonlarni oddiy kasrga o'tkazing ($1{,}25 = \\frac{5}{4}$, $1{,}2 = \\frac{6}{5}$), maxrajda esa $0{,}65 \\cdot 2$ ni hisoblang.",
          steps: [
            "Qavs ichi: $\\frac{7}{3} - \\frac{5}{4} = \\frac{28 - 15}{12} = \\frac{13}{12}$.",
            "Surat: $\\frac{13}{12} \\cdot \\frac{6}{5} = \\frac{13}{10} = 1{,}3$.",
            "Maxraj: $0{,}65 : 0{,}5 = 1{,}3$.",
            "Nisbat: $\\frac{1{,}3}{1{,}3} = 1$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 5.11',
        },
        {
          id: 't5-h-2',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$\\left(3{,}5 - 2\\frac{1}{3}\\right) : 0{,}7 + \\frac{1}{3}$$",
          answer: '2',
          acceptedEquivalents: ['2.0'],
          socraticHint:
            "$3{,}5 = \\frac{7}{2}$ deb oling. Qavs ichida $\\frac{7}{2} - \\frac{7}{3}$ dan suratda $7$ chiqadi va $0{,}7 = \\frac{7}{10}$ bilan qisqaradi!",
          steps: [
            "$3{,}5 - 2\\frac{1}{3} = \\frac{7}{2} - \\frac{7}{3} = \\frac{21 - 14}{6} = \\frac{7}{6}$.",
            "$\\frac{7}{6} : \\frac{7}{10} = \\frac{7}{6} \\cdot \\frac{10}{7} = \\frac{5}{3}$.",
            "$\\frac{5}{3} + \\frac{1}{3} = \\frac{6}{3} = 2$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 5.15',
        },
      ],
    },
  },

  6: {
    topicId: 6,
    muammo: {
      headline: "Cheksiz takrorlanadigan raqamlar ortida aniq oddiy kasr yashiringanmi?",
      contextLabel: "Mantiqiy muammo · Cheksizlikni tutish",
      story: [
        "1 ni 3 ga burchakli bo'lib ko'ring: $0{,}333333...$ Jarayon hech qachon tugamaydi! Yoki 5 ni 6 ga bo'ling: $0{,}833333...$",
        "Agar qarshingizda $0{,}272727...$ yoki $0{,}16666...$ kabi cheksiz yozuv tursa, u qaysi aniq oddiy kasrdan kelib chiqqanini cheksiz ko'p raqamni yozmasdan qanday topish mumkin?",
      ],
      coreQuestion:
        "Cheksiz ko'p takrorlanuvchi raqamlar yig'indisini bir nechta oddiy amal bilan qanday qilib aniq kasrga aylantiramiz?",
      historicalNote:
        "Cheksiz davriy kasrlarning har biri ratsional son ekani va ularni 10 ning darajasiga ko'paytirib ayirish orqali «cheksiz dum» ni yo'qotish usuli klassik algebraning eng nafis g'oyalaridan biridir.",
    },
    chegara: {
      headline: "Chekli o'nli kasrlar qoidasi bu yerda to'xtaydi",
      whatWorkedBefore: "$0{,}25 = \\frac{25}{100}$ kabi chekli kasrlar osongina 10 ning darajasiga bo'lib yozilardi.",
      breakingPoint:
        "$0{,}333...$ ning oxiri yo'q, shuning uchun maxrajga nechta nol qo'yishni bilib bo'lmaydi.",
      deadEndExample:
        "$0{,}999...$ ni chekli raqam bilan almashtirishga urinish uni $1$ dan kichik deb noto'g'ri tasavvur qilishga olib keladi.",
      whyNewIdeaNeeded:
        "Takrorlanuvchi «dum» ni siljitib, o'zidan o'zini ayirish orqali cheksizlikni bir zarbada yo'q qiladigan usul kerak.",
    },
    intuisiya: {
      headline: "Bir qadam surib ayirish: cheksiz dumni qisqartirish",
      analogyTitle: "Cheksiz poyezd vagonlarini tenglashtirish",
      analogyStory:
        "Tasavvur qiling, bir xil raqamlar yozilgan cheksiz uzun poyezd bor. Agar shu poyezdni bitta davr uzunligicha chapga sursangiz, verguldan keyingi cheksiz qism avvalgisi bilan bir xil bo'lib qoladi. Biridan ikkinchisini ayirsangiz, cheksiz dum butunlay yo'qoladi va faqat oddiy butun son qoladi!",
      guidedPrompts: [
        "Simulyatorda 3 bo'lakdan 1 tasini va 9 bo'lakdan 3 tasini taqqoslang — ularning sonlar o'qidagi o'rni mutlaqo bir xil.",
        "9 bo'lakli lentani tanlab, 1, 2, 3, ..., 9 ta bo'lakni belgilang va $9$ ning davriy kasrlardagi o'rnini his qiling.",
      ],
      defaultSimulatorMode: 'compare',
      defaultPreset: { numA: 1, denA: 3, numB: 3, denB: 9 },
    },
    formula: {
      headline: "Sof va aralash davriy kasrlarni aylantirish formulalari",
      bridgeFromIntuition:
        "Agar $x = 0{,}(a)$ bo'lsa, $10x - x = 9x = a$, demak $x = \\frac{a}{9}$. Har bir davr raqami maxrajga bitta $9$, davrgacha bo'lgan raqam esa bitta $0$ beradi.",
      items: [
        {
          title: 'Sof davriy kasr',
          latex: '0{,}(\\overline{a_1 a_2 \\dots a_k}) = \\frac{\\overline{a_1 a_2 \\dots a_k}}{\\underbrace{99\\dots 9}_{k\\text{ ta}}}',
          explanation:
            "Suratga davrdagi son yoziladi, maxrajga esa davrda nechta raqam bo'lsa shuncha 9 yoziladi.",
          example: '$0{,}(27) = \\frac{27}{99} = \\frac{3}{11}$',
        },
        {
          title: 'Aralash davriy kasr',
          latex: '0{,}b(a) = \\frac{\\overline{ba} - b}{9\\dots90\\dots0}',
          explanation:
            "Surat: verguldan keyingi barcha raqamlardan davrgacha bo'lgan qism ayiriladi. Maxraj: davr uzunligicha 9 va davrgacha bo'lgan raqamlar sonicha 0.",
          example: '$0{,}1(6) = \\frac{16 - 1}{90} = \\frac{15}{90} = \\frac{1}{6}$',
        },
      ],
      keyPitfall: {
        title: "Davrgacha bo'lgan qismni ayirishni unutish",
        wrong: '$0{,}2(3) = \\frac{23}{90}$',
        right: '$0{,}2(3) = \\frac{23 - 2}{90} = \\frac{21}{90} = \\frac{7}{30}$',
        reason:
          "Aralash davriy kasrda $100x - 10x = 90x = 23 - 2 = 21$ bo'lgani uchun davrgacha turgan $2$ ni ayirish shart.",
      },
    },
    problems: {
      orta: [
        {
          id: 't6-m-1',
          difficulty: 'orta',
          statement: "Oddiy kasrga aylantirib hisoblang: $$0{,}(3) + 0{,}(6)$$",
          answer: '1',
          acceptedEquivalents: ['9/9'],
          socraticHint: "$0{,}(3)$ va $0{,}(6)$ ning maxraji qaysi son bo'ladi?",
          steps: [
            "$0{,}(3) = \\frac{3}{9} = \\frac{1}{3}$ va $0{,}(6) = \\frac{6}{9} = \\frac{2}{3}$.",
            "$\\frac{1}{3} + \\frac{2}{3} = 1$.",
          ],
          sourceLabel: 'Usmonov uslubi · 6.1',
        },
        {
          id: 't6-m-2',
          difficulty: 'orta',
          statement: "Qisqarmas oddiy kasr ko'rinishida yozing: $$0{,}1(6)$$",
          answer: '1/6',
          acceptedEquivalents: ['1/6'],
          socraticHint: "Bu aralash davriy kasr: suratda $16 - 1$, maxrajda esa bitta $9$ va bitta $0$ bo'ladi.",
          steps: [
            "$0{,}1(6) = \\frac{16 - 1}{90} = \\frac{15}{90}$.",
            "Surat va maxrajni $15$ ga qisqartiramiz: $\\frac{1}{6}$.",
          ],
          sourceLabel: 'Usmonov uslubi · 6.2',
        },
      ],
      murakkab: [
        {
          id: 't6-h-1',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$\\frac{0{,}(6) + 0{,}1(6)}{0{,}8(3)}$$",
          answer: '1',
          acceptedEquivalents: ['1/1'],
          socraticHint: "Har uchala davriy kasrni oddiy kasrga o'tkazing va $6$ umumiy maxrajda tekshiring.",
          steps: [
            "$0{,}(6) = \\frac{2}{3} = \\frac{4}{6}$, $0{,}1(6) = \\frac{15}{90} = \\frac{1}{6}$.",
            "Maxraj: $0{,}8(3) = \\frac{83 - 8}{90} = \\frac{75}{90} = \\frac{5}{6}$.",
            "Natija: $\\frac{\\frac{4}{6} + \\frac{1}{6}}{\\frac{5}{6}} = \\frac{5/6}{5/6} = 1$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 6.10',
        },
      ],
    },
  },

  7: {
    topicId: 7,
    muammo: {
      headline: "Noldan past harorat va qarzni qanday hisoblaymiz?",
      contextLabel: "Hayotiy va tarixiy muammo · Harorat, qarz va dengiz sathidan pastlik",
      story: [
        "Toshkentda kechqurun harorat $+3^\\circ$ edi, kechasi $7$ darajaga sovib ketdi. Yoki savdogarda $50$ ming so'm pul bor edi, u $80$ ming so'mlik xarajat qildi. Natija «hech narsa» (nol) emas — hali $30$ ming qarz qoldi!",
        "VII asrda hind matematigi Brahmagupta ilk bor «mulk» (musbat) va «qarz» (manfiy) sonlar ustida to'liq amal qoidalarini ishlab chiqdi.",
      ],
      coreQuestion:
        "Qarama-qarshi yo'nalishdagi miqdorlarni (foyda–qarz, issiq–sovuq, o'ng–chap) yagona qoidalar bilan qanday hisoblaymiz?",
      historicalNote:
        "Yevropada manfiy sonlar uzoq vaqt «soxta sonlar» deb atalgan, ammo Dekartning koordinatalar o'qi ularga aniq geometrik ma'no berdi.",
    },
    chegara: {
      headline: "Kichik sondan katta sonni ayirish taqiqlangan edi",
      whatWorkedBefore: "Musbat sonlarda $8 - 5 = 3$ har doim ma'noga ega edi.",
      breakingPoint:
        "Ammo $5 - 8$ amalida musbat sonlar chizig'i $0$ da tugab qolardi.",
      deadEndExample:
        "Harorat $+2$ dan $5$ daraja tushganda yangi holatni faqat musbat sonlar bilan yozib bo'lmaydi.",
      whyNewIdeaNeeded:
        "Sonlar nurini $0$ dan chap tomonga cheksiz davom ettirib, har bir sonning qarama-qarshi juftini kiritish talab qilindi.",
    },
    intuisiya: {
      headline: "Sonlar o'qida yurish: o'ngga qo'shish, chapga ayirish",
      analogyTitle: "Lift qavatlari va termometr shkalasi",
      analogyStory:
        "Nolinchi qavatdan yuqoriga chiqish musbat, yerto'la qavatlariga tushish manfiy. Qarzni olib tashlash (manfiy sonni ayirish) — sizni boyroq qiladi, ya'ni o'ngga siljitadi!",
      guidedPrompts: [
        "Sonlar o'qida musbat va manfiy qadamlarni sinab ko'ring: 0 dan teng masofada turgan qarama-qarshi nuqtalarni toping.",
        "Manfiy sondan yana ayirganda nuqta qaysi tomonga siljishini kuzating.",
      ],
      defaultSimulatorMode: 'numberline',
      defaultPreset: { numA: -3, denA: 1, numB: 5, denB: 1 },
    },
    formula: {
      headline: "Ishoralar va modul qoidalari",
      bridgeFromIntuition:
        "Sonning moduli $|a|$ — uning sonlar o'qida $0$ dan uzoqligi (masofa har doim manfiy emas).",
      items: [
        {
          title: 'Manfiy sonni ayirish',
          latex: 'a - (-b) = a + b',
          explanation:
            "Qarzni bekor qilish foydaga teng: ikki minus ketma-ket kelsa plyusga aylanadi.",
          example: '$4 - (-6) = 4 + 6 = 10$',
        },
        {
          title: "Ko'paytirish va bo'lishda ishoralar",
          latex: '(-a) \\cdot (-b) = ab, \\quad (-a) \\cdot b = -ab',
          explanation:
            "Bir xil ishorali sonlar ko'paytmasi (bo'linmasi) musbat, har xil ishoraliniki manfiy bo'ladi.",
          example: '$(-3) \\cdot (-5) = 15$, $(-12) : 4 = -3$',
        },
      ],
      keyPitfall: {
        title: "Ikki manfiy sonni qo'shish bilan ko'paytirishni adashtirish",
        wrong: '$-4 - 5 = +9$',
        right: '$-4 - 5 = -9$, ammo $(-4) \\cdot (-5) = +20$',
        reason:
          "«Minusga minus plyus» qoidasi faqat ko'paytirish, bo'lish va qavs ochishda ishlaydi. Ikki qarz qo'shilsa, qarz yanada ortadi ($-9$).",
      },
    },
    problems: {
      orta: [
        {
          id: 't7-m-1',
          difficulty: 'orta',
          statement: "Hisoblang: $$-12 + 7 - (-9) - 14$$",
          answer: '-10',
          acceptedEquivalents: ['-10'],
          socraticHint: "Avval $-(-9)$ ni $+9$ ko'rinishida yozing, so'ng musbatlarni alohida, manfiylarni alohida qo'shing.",
          steps: [
            "$-12 + 7 + 9 - 14$.",
            "Musbatlar: $7 + 9 = 16$. Manfiylar: $-12 - 14 = -26$.",
            "$16 - 26 = -10$.",
          ],
          sourceLabel: 'Usmonov uslubi · 7.1',
        },
        {
          id: 't7-m-2',
          difficulty: 'orta',
          statement: "Hisoblang: $$(-2{,}5) \\cdot (-4) + (-18) : 3$$",
          answer: '4',
          acceptedEquivalents: ['4.0'],
          socraticHint: "Birinchi ko'paytmada ikki manfiy son bor, ikkinchi bo'linmada esa har xil ishoralar.",
          steps: [
            "$(-2{,}5) \\cdot (-4) = +10$.",
            "$(-18) : 3 = -6$.",
            "$10 + (-6) = 4$.",
          ],
          sourceLabel: 'Usmonov uslubi · 7.2',
        },
      ],
      murakkab: [
        {
          id: 't7-h-1',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$\\frac{(-3) \\cdot (-8) - 4 \\cdot (-6)}{(-2) \\cdot 6}$$",
          answer: '-4',
          acceptedEquivalents: ['-4'],
          socraticHint: "Suratdagi $-4 \\cdot (-6)$ ning ishorasiga diqqat qiling: u $+24$ bo'ladi!",
          steps: [
            "Surat: $(-3)(-8) = 24$ va $-4(-6) = +24$, jami $24 + 24 = 48$.",
            "Maxraj: $(-2) \\cdot 6 = -12$.",
            "Bo'linma: $48 : (-12) = -4$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 7.9',
        },
      ],
    },
  },

  8: {
    topicId: 8,
    muammo: {
      headline: "Uzun va chalkash hisob formulalarini qanday qisqartiramiz?",
      contextLabel: "Muhandislik muammosi · Umumiy qoida topish",
      story: [
        "Bir omborda har bir qutida $x$ ta olma bor. Ertalab 5 ta quti keldi, keyin yana 3 ta quti qo'shildi, tushda 2 ta quti sotildi. Har safar $x$ ning aniq qiymatini bilmasdan ham jami $6$ ta quti qolganini oldindan aytish mumkin!",
        "Harfli ifodalarni shakl almashtirish — murakkab jarayonni eng ixcham va tushunarli holatga keltirish san'atidir.",
      ],
      coreQuestion:
        "Ifodaning qiymatini o'zgartirmasdan uni qanday qilib eng sodda va qulay ko'rinishga keltirish mumkin?",
      historicalNote:
        "Fransua Viyet va Al-Xorazmiy harfli belgilashlarni kiritishi bilan matematika alohida sonlardan umumiy qonuniyatlarga o'tdi.",
    },
    chegara: {
      headline: "Har bir son uchun alohida hisoblash befoyda edi",
      whatWorkedBefore: "Sonli ifodalarda barcha sonlar ma'lum bo'lgani uchun darhol yakuniy son chiqardi.",
      breakingPoint:
        "Noma'lum $x$ yoki $a$ qatnashganda $3x + 5x$ ni son bilan qo'shib bo'lmaydi, qavs oldidagi minus ishora esa ko'p xatolarga sabab bo'ladi.",
      deadEndExample:
        "Qavs oldidagi minusni faqat birinchi hadga ta'sir ettirish butun masalaning natijasini buzadi.",
      whyNewIdeaNeeded:
        "Ayniy almashtirish qonunlari: taqsimot qonuni, qavslarni ochish va o'xshash hadlarni ixchamlash qoidalari zarur.",
    },
    intuisiya: {
      headline: "Bir xil turdagi qutilarni birga sanash",
      analogyTitle: "Meva savatlari va qarz qog'ozlari",
      analogyStory:
        "3 ta olma qutisi bilan 2 ta olma qutisini qo'shib 5 ta olma qutisi deya olasiz, lekin 3 ta olma qutisi bilan 4 ta alohida bananni bitta songa qo'shib bo'lmaydi — ular har xil turdagi hadlardir.",
      guidedPrompts: [
        "Simulyatorda «Birlashtirish» rejimida bir xil maxrajli bo'laklar qanday qilib o'xshash hadlar kabi to'g'ridan-to'g'ri qo'shilishini ko'ring.",
      ],
      defaultSimulatorMode: 'combine',
      defaultPreset: { numA: 2, denA: 5, numB: 1, denB: 5 },
    },
    formula: {
      headline: "Shakl almashtirishning asosiy qonunlari",
      bridgeFromIntuition:
        "Ayniy teng ifodalar o'zgaruvchining istalgan qiymatida bir xil natija beradi.",
      items: [
        {
          title: 'Taqsimot qonuni (qavs ochish)',
          latex: 'a(b + c) = ab + ac, \\quad -(b + c) = -b - c',
          explanation:
            "Qavs oldida minus tursa, qavs ichidagi BARCHA hadlarning ishorasi qarama-qarshisiga o'zgaradi.",
          example: '$-(2x - 5) = -2x + 5$',
        },
        {
          title: "O'xshash hadlarni ixchamlash",
          latex: 'kx + mx = (k + m)x',
          explanation:
            "Harfli qismi bir xil bo'lgan hadlarning faqat koeffitsiyentlari qo'shiladi.",
          example: '$5a - 3b - 2a + 7b = 3a + 4b$',
        },
      ],
      keyPitfall: {
        title: "Qavs oldidagi minusni unutish",
        wrong: '$7 - (x - 3) = 7 - x - 3 = 4 - x$',
        right: '$7 - (x - 3) = 7 - x + 3 = 10 - x$',
        reason: "Minus qavs ichidagi $-3$ ga ham ta'sir qilib, uni $+3$ ga aylantiradi.",
      },
    },
    problems: {
      orta: [
        {
          id: 't8-m-1',
          difficulty: 'orta',
          statement: "Ifodani soddalashtiring: $$3(2x - 4) - 2(x - 5)$$",
          answer: '4x - 2',
          acceptedEquivalents: ['4x-2', '-2+4x'],
          socraticHint: "Ikkinchi qavsni ochayotganda $(-2) \\cdot (-5)$ ning ishorasiga diqqat qiling!",
          steps: [
            "Qavslarni ochamiz: $6x - 12 - 2x + 10$.",
            "O'xshash hadlarni ixchamlaymiz: $(6x - 2x) + (-12 + 10) = 4x - 2$.",
          ],
          sourceLabel: 'Usmonov uslubi · 8.1',
        },
        {
          id: 't8-m-2',
          difficulty: 'orta',
          statement: "$a = 3$ bo'lganda ifodaning qiymatini toping: $$5a - (2a - 7) + (1 - 3a)$$",
          answer: '8',
          acceptedEquivalents: ['8'],
          socraticHint: "Avval $a = 3$ ni qo'yishga shoshilmang — ifodani soddalashtirsangiz $a$ lar yo'qolib ketadi!",
          steps: [
            "Qavslarni ochamiz: $5a - 2a + 7 + 1 - 3a$.",
            "$(5 - 2 - 3)a + 8 = 0 \\cdot a + 8 = 8$.",
            "Ifoda $a$ ning qiymatiga bog'liq emas, javob $8$.",
          ],
          sourceLabel: 'Usmonov uslubi · 8.4',
        },
      ],
      murakkab: [
        {
          id: 't8-h-1',
          difficulty: 'murakkab',
          statement: "Ichma-ich qavslarni ochib soddalashtiring: $$4x - [3x - (2x - 1)]$$",
          answer: '3x - 1',
          acceptedEquivalents: ['3x-1'],
          socraticHint: "Eng ichki yumaloq qavsdan boshlab tashqariga qarab oching.",
          steps: [
            "Ichki qavs: $3x - (2x - 1) = 3x - 2x + 1 = x + 1$.",
            "Tashqi qavs: $4x - (x + 1) = 4x - x - 1 = 3x - 1$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 8.11',
        },
      ],
    },
  },

  9: {
    topicId: 9,
    muammo: {
      headline: "Natija ma'lum, lekin boshlang'ich son yashirin — uni qanday topamiz?",
      contextLabel: "Tarixiy muammo · Al-Xorazmiyning «Al-jabr val-muqobala» asari",
      story: [
        "Bir sonni 3 ga ko'paytirib, 5 qo'shilganda 26 hosil bo'ldi. Yoki ikki shahardan qarama-qarshi chiqqan mashinalar necha soatdan keyin uchrashadi? Taxmin qilib qidirish qiyin masalalarda ishlamaydi.",
        "820-yilda Muhammad al-Xorazmiy «Al-jabr» (tenglikning bir tomonidan ikkinchi tomoniga o'tkazish) usulini yaratib, butun algebra faniga nom berdi.",
      ],
      coreQuestion:
        "Tenglik muvozanatini buzmasdan noma'lum $x$ ni qanday qilib yolg'iz qoldirish mumkin?",
      historicalNote:
        "«Algebra» so'zi aynan al-Xorazmiyning tenglamalarni yechishdagi «al-jabr» (to'ldirish/o'tkazish) amalidan olingan.",
    },
    chegara: {
      headline: "Orqaga sanash murakkab tenglamalarda yetarli emas",
      whatWorkedBefore: "Oddiy $x + 5 = 12$ misolida shunchaki $12 - 5$ qilib topish oson edi.",
      breakingPoint:
        "Noma'lum $x$ tenglikning HAR IKKI tomonida qatnashsa (masalan, $5x - 3 = 2x + 9$), oddiy orqaga sanash ishlamaydi.",
      deadEndExample: "Taxminiy sonlar qo'yib tekshirish kasrli ildizlarda (masalan $x = \\frac{17}{13}$) umuman samara bermaydi.",
      whyNewIdeaNeeded:
        "Tenglikning ikkala pallasiga bir xil amal bajarish — tarozi muvozanati prinsipi kerak.",
    },
    intuisiya: {
      headline: "Ikki pallali tarozi muvozanati",
      analogyTitle: "Muvozanatdagi tarozi pallalari",
      analogyStory:
        "Tenglik — bu mukammal muvozanatdagi tarozi. Chap palladan 2 ta bir xil qopni olsangiz, muvozanat buzilmasligi uchun o'ng palladan ham xuddi 2 ta qop olishingiz kerak. Oxirida bir pallada bitta qop, ikkinchisida aniq toshlar qoladi.",
      guidedPrompts: [
        "Sonlar o'qida ikki teng masofa qanday muvozanatda turishini ko'z oldingizga keltiring.",
      ],
      defaultSimulatorMode: 'numberline',
      defaultPreset: { numA: 2, denA: 1, numB: 6, denB: 1 },
    },
    formula: {
      headline: "Chiziqli tenglama va uning yechim hollari",
      bridgeFromIntuition:
        "Har qanday chiziqli tenglama al-jabr amallari yordamida $ax = b$ standart shaklga keltiriladi.",
      items: [
        {
          title: 'Standart chiziqli tenglama',
          latex: 'ax = b \\implies x = \\frac{b}{a} \\quad (a \\neq 0)',
          explanation:
            "Noma'lumli hadlarni bir tomonga, ozod hadlarni ikkinchi tomonga ishorasini o'zgartirib o'tkazamiz.",
          example: '$5x - 3 = 2x + 9 \\implies 3x = 12 \\implies x = 4$',
        },
        {
          title: 'Maxsus hollar ($a = 0$)',
          latex: '0 \\cdot x = 0 \\; (\\forall x \\in \\mathbb{R}), \\qquad 0 \\cdot x = b \\neq 0 \\; (x \\in \\varnothing)',
          explanation:
            "Agar $a=0$ va $b=0$ bo'lsa, cheksiz ko'p yechim; $a=0$ va $b \\neq 0$ bo'lsa, yechim yo'q.",
        },
      ],
      keyPitfall: {
        title: "Hadni tenglikdan o'tkazganda ishorani unutish",
        wrong: '$3x + 7 = 19 \\implies 3x = 19 + 7$',
        right: '$3x + 7 = 19 \\implies 3x = 19 - 7 = 12 \\implies x = 4$',
        reason: "Had tenglik belgisi orqali qarama-qarshi tomonga o'tganda ishorasi doim almashadi.",
      },
    },
    problems: {
      orta: [
        {
          id: 't9-m-1',
          difficulty: 'orta',
          statement: "Tenglamani yeching: $$5x - 7 = 2x + 8$$",
          answer: '5',
          acceptedEquivalents: ['x=5', 'x = 5'],
          socraticHint: "$2x$ ni chap tomonga, $-7$ ni o'ng tomonga qanday ishora bilan o'tkazasiz?",
          steps: [
            "$5x - 2x = 8 + 7$.",
            "$3x = 15$.",
            "$x = 5$.",
          ],
          sourceLabel: 'Usmonov uslubi · 9.1',
        },
        {
          id: 't9-m-2',
          difficulty: 'orta',
          statement: "Tenglamani yeching: $$4(x - 2) = 3(x + 1) - 6$$",
          answer: '5',
          acceptedEquivalents: ['x=5', 'x = 5'],
          socraticHint: "Avval ikkala tomondagi qavslarni oching va o'xshash hadlarni ixchamlang.",
          steps: [
            "$4x - 8 = 3x + 3 - 6$.",
            "$4x - 8 = 3x - 3$.",
            "$4x - 3x = 8 - 3 \\implies x = 5$.",
          ],
          sourceLabel: 'Usmonov uslubi · 9.3',
        },
      ],
      murakkab: [
        {
          id: 't9-h-1',
          difficulty: 'murakkab',
          statement: "Kasrli chiziqli tenglamani yeching: $$\\frac{2x - 1}{3} - \\frac{x + 2}{4} = 1$$",
          answer: '22/5',
          acceptedEquivalents: ['4.4', '4,4', 'x=4.4', 'x=22/5'],
          socraticHint: "Tenglikning ikkala tomonini $3$ va $4$ ning umumiy maxraji — $12$ ga ko'paytirib kasrdan qutuling!",
          steps: [
            "Ikkala tomonni $12$ ga ko'paytiramiz: $4(2x - 1) - 3(x + 2) = 12$.",
            "Qavslarni ochamiz: $8x - 4 - 3x - 6 = 12$.",
            "$5x - 10 = 12 \\implies 5x = 22 \\implies x = \\frac{22}{5} = 4{,}4$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 9.12',
        },
      ],
    },
  },

  10: {
    topicId: 10,
    muammo: {
      headline: "Shaxmat donalaridan kosmik masofalargacha — tez o'sishni qanday yozamiz?",
      contextLabel: "Tarixiy muammo · Shaxmat taxtasi va bakteriyalar bo'linishi",
      story: [
        "Afsonaga ko'ra, shaxmat ixtirochisi birinchi katakka 1 ta, ikkinchisiga 2 ta, uchinchisiga 4 ta, har bir keyingi katakka oldingisidan 2 baravar ko'p bug'doy donasi so'ragan. 64-katakda 2 sonini 63 marta o'ziga ko'paytirish kerak bo'ladi!",
        "Shuningdek, astronomiyada Yerdan Quyoshgacha masofa $150\\,000\\,000\\,000$ metr. Bunday bahaybat sonlarni qisqa yozish va ular ustida tez amal bajarish uchun daraja tushunchasi tug'ildi.",
      ],
      coreQuestion:
        "Bir xil sonning o'z-o'ziga ko'p marta ko'paytmasini qanday qilib ixcham yozish va ko'paytirib-bo'lish mumkin?",
      historicalNote:
        "Hozirgi $a^n$ yozuvini XVII asrda Rene Dekart muomalaga kiritgan.",
    },
    chegara: {
      headline: "Oddiy ko'paytirish yozuvi haddan tashqari uzun bo'lib ketdi",
      whatWorkedBefore: "Takroriy qo'shishni ko'paytirish ($2+2+2+2 = 4 \\cdot 2$) qisqartirgan edi.",
      breakingPoint:
        "Takroriy ko'paytirishni ($2 \\cdot 2 \\cdot 2 \\cdots 2$, 50 marta) qisqa yozish va ikki ulkan ko'paytmani bo'lishning tezkor qoidasi yo'q edi.",
      deadEndExample:
        "$2^{30} : 2^{27}$ ni avval $1\\,073\\,741\\,824$ ni hisoblab keyin bo'lish o'rniga bir soniyada $2^3 = 8$ deb topish mumkin!",
      whyNewIdeaNeeded:
        "Asos va ko'rsatkichga tayanuvchi daraja qonunlari murakkab hisoblarni oddiy qo'shish va ayirishga aylantiradi.",
    },
    intuisiya: {
      headline: "Daraja ko'rsatkichi — nechta ko'paytuvchi safda turganini sanash",
      analogyTitle: "Qog'ozni ikki buklash zanjiri",
      analogyStory:
        "Qog'ozni 1 marta buklasangiz 2 qatlam, 2 marta buklasangiz 4 qatlam, 3 marta buklasangiz 8 qatlam bo'ladi. 3 marta buklangan qatlamni yana 2 marta buklasangiz, jami $3 + 2 = 5$ marta buklagan bo'lasiz — ko'paytirishda ko'rsatkichlar shuning uchun qo'shiladi!",
      guidedPrompts: [
        "Simulyatorda 2, 4 va 8 ta teng bo'laklarga bo'lish qanday qilib ikkilanib borishini kuzating.",
      ],
      defaultSimulatorMode: 'compare',
      defaultPreset: { numA: 1, denA: 4, numB: 2, denB: 8 },
    },
    formula: {
      headline: "Darajaning asosiy xossalari",
      bridgeFromIntuition:
        "$a^n = \\underbrace{a \\cdot a \\cdots a}_{n\\text{ marta}}$ ta'rifidan barcha qoidalar bevosita kelib chiqadi.",
      items: [
        {
          title: "Bir xil asosli darajalarni ko'paytirish va bo'lish",
          latex: 'a^m \\cdot a^n = a^{m+n}, \\qquad \\frac{a^m}{a^n} = a^{m-n} \\; (a \\neq 0)',
          explanation: "Asos o'zgarishsiz qoladi, ko'paytirishda ko'rsatkichlar qo'shiladi, bo'lishda ayiriladi.",
          example: '$2^5 \\cdot 2^3 = 2^8$, $\\frac{5^9}{5^6} = 5^3 = 125$',
        },
        {
          title: 'Darajani darajaga ko‘tarish va nol daraja',
          latex: '(a^m)^n = a^{m \\cdot n}, \\qquad (ab)^n = a^n b^n, \\qquad a^0 = 1 \\; (a \\neq 0)',
          explanation: "Darajaning darajasida ko'rsatkichlar ko'paytiriladi; noldan farqli har qanday sonning 0-darajasi 1 ga teng.",
          example: '$(3^2)^3 = 3^6 = 729$',
        },
      ],
      keyPitfall: {
        title: "Ko'paytirishda ko'rsatkichlarni ko'paytirib yuborish",
        wrong: '$2^3 \\cdot 2^4 = 2^{12}$',
        right: '$2^3 \\cdot 2^4 = 2^{3+4} = 2^7 = 128$',
        reason: "3 ta ikkilik va 4 ta ikkilik yonma-yon tursa, jami $3 + 4 = 7$ ta ikkilik bo'ladi, 12 ta emas.",
      },
    },
    problems: {
      orta: [
        {
          id: 't10-m-1',
          difficulty: 'orta',
          statement: "Hisoblang: $$\\frac{2^7 \\cdot 2^5}{2^9}$$",
          answer: '8',
          acceptedEquivalents: ['2^3'],
          socraticHint: "Avval suratdagi ko'rsatkichlarni qo'shing, keyin maxrajdagi $9$ ni ayiring.",
          steps: [
            "Surat: $2^{7+5} = 2^{12}$.",
            "Bo'lish: $2^{12-9} = 2^3 = 8$.",
          ],
          sourceLabel: 'Usmonov uslubi · 10.1',
        },
        {
          id: 't10-m-2',
          difficulty: 'orta',
          statement: "Hisoblang: $$\\frac{(3^2)^4 \\cdot 3^3}{3^9}$$",
          answer: '9',
          acceptedEquivalents: ['3^2'],
          socraticHint: "$(3^2)^4$ da ko'rsatkichlar qo'shiladimi yoki ko'paytiriladimi?",
          steps: [
            "$(3^2)^4 = 3^8$.",
            "$\\frac{3^8 \\cdot 3^3}{3^9} = \\frac{3^{11}}{3^9} = 3^2 = 9$.",
          ],
          sourceLabel: 'Usmonov uslubi · 10.3',
        },
      ],
      murakkab: [
        {
          id: 't10-h-1',
          difficulty: 'murakkab',
          statement: "Hisoblang: $$\\frac{6^5 \\cdot 2^3}{4^4 \\cdot 3^4}$$",
          answer: '3',
          acceptedEquivalents: ['3'],
          socraticHint: "Barcha sonlarni $2$ va $3$ tub asoslarga keltiring: $6 = 2 \\cdot 3$ va $4 = 2^2$.",
          steps: [
            "$6^5 = 2^5 \\cdot 3^5$ va $4^4 = (2^2)^4 = 2^8$.",
            "Surat: $2^5 \\cdot 3^5 \\cdot 2^3 = 2^8 \\cdot 3^5$.",
            "Nisbat: $\\frac{2^8 \\cdot 3^5}{2^8 \\cdot 3^4} = 3^{5-4} = 3$.",
          ],
          sourceLabel: 'Usmonov · Murakkab 10.14',
        },
      ],
    },
  },
};
