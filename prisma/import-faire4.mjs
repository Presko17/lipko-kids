// Batch import from Faire #4 (2026-11-04). Price = MSRP, cost = wholesale (€ → stored in лв).
// Every photo of Faire's full gallery is uploaded to Vercel Blob. Created as hidden drafts.
import { promises as fs } from "fs";

const H = (s) => s.trim().split(/\s+/);
const DODO = { shipsFrom: "Украйна", supplierMinimum: 88.47 };
const PLUSH = { shipsFrom: "Испания", supplierMinimum: 60 };
const ADORA = { shipsFrom: "Словения", supplierMinimum: 100 };
const MH = { shipsFrom: "Германия", supplierMinimum: 100 };
const VINT = { shipsFrom: "Испания", supplierMinimum: 50 };
const BUSY = { shipsFrom: "Чехия", supplierMinimum: 200 };
const KIKA = { shipsFrom: "България", supplierMinimum: 500 };
const F = (id) => "https://www.faire.com/product/" + id;

const products = [
  { ...DODO, supplierUrl: F("p_qgwm5dqqc7"), name: "Пъзел „Горски животни“ (200 части)", category: "Пъзели", material: "Картон", age: "6+", dim: "33 × 47 см (кутия 24 × 16 × 7 см)", emoji: "🦊", wholesaleEur: 6.23, msrpEur: 11.21,
    desc: `Цветен пъзел от 200 части с горски животни, който развива паметта, вниманието и логическото мислене. Големите части се хващат лесно, а готовата картина е пълна с детайли за разглеждане.

• 200 части, готов размер 33 × 47 см
• Големи, здрави части от картон
• Чудесен за игра сам или със семейството
• За деца от 6 години
• Произведен в Украйна`,
    images: H(`5c0016f23f57a6d99570f5e4fa15f1e9d438d835143b1e922feb647f18e010e4.jpeg a295867183d140d0158a1ffe0d13e4a1829ba28e59210cee2fb4171046ca3f15.jpeg 044a588732a6b7087cb36d4ea0a73c64109ce1b9e6f3e60a60c5a9b6ba98c548.jpeg b89defdc29c2efa56d5bae0521921f208c8fd32110b089fad80f5a66b227a3cf.jpeg d922dbc22552090855a97a3fc5348192fb607925251bc4c1592249682370f7e1.jpeg c73f30f293d0c1c1fd551dad929c4f35cb4c67b1ffd791f7ace67d327cecf1d3.jpeg e1e8681690eef377edfd14f318dedfc6198f593abbe4709de2fe59b08124d6ef.jpeg`) },

  { ...DODO, supplierUrl: F("p_qwfsbeckku"), name: "Пъзел „Намери и покажи – Коледа“ (80 части)", category: "Пъзели", material: "Картон", age: "5+", dim: "28 × 39 см (кутия 19.8 × 16.2 × 5.8 см)", emoji: "🎄", wholesaleEur: 5.92, msrpEur: 10.65,
    desc: `Двойно предизвикателство в една кутия: първо детето нарежда пъзела, а после търси скритите предмети в празничната коледна картина. Играта развива концентрацията, наблюдателността и паметта и учи на търпение.

• 80 части, готов размер 28 × 39 см
• Здрав, екологичен картон — нарежда се много пъти
• За игра сам, със семейството или с приятели
• За момичета и момчета от 5 години
• Произведен в Украйна`,
    images: H(`c58e5dfa06a6dc5207479e5e1cab6c43b36355e655f4d92d96e19b7525545510.jpeg 995db673e5c0650ffa7aa77d72d272617af35bee77ed7fb49bc14bb9e5856d20.jpeg 29e5de3aa4f504e2841d92a15cbb50632a729d1817032c850906ab3987ac12bd.jpeg 4e5c53d143d0ae7e32f3dd9f43e8ff7ecb999f6900025dc22d102727b183ccf6.jpeg ed218c932a9b920e19a418b76088c368940edcde7c5dc0fd3cad79f8350d2faa.jpeg 6755cc571e5ebfb8ab268116948727e2dad1782ed631db7ab6d781601ab627d8.jpeg 7e4404092d85ca9ccd60c0835da39d758bac8f754cff71f3fd57c2f5c8778a24.jpeg`) },

  { ...DODO, supplierUrl: F("p_tbmt88x4zx"), name: "Монтесори тактилни карти „Животни“ (10 бр.)", category: "Монтесори", material: "Картон с тактилни елементи", age: "12 мес.+", dim: "Карти 14 × 10 см (кутия 15 × 12 × 6 см)", emoji: "🐾", wholesaleEur: 8.33, msrpEur: 15.0,
    desc: `Сензорна игра по метода Монтесори за деца от 12 месеца, която съчетава опознаването на света с допир. Комплектът съдържа 10 големи карти с различни текстури, които развиват сетивата, фината моторика и чувствителността на пръстчетата, а детето разпознава животните и обогатява речника си.

• 10 тактилни карти, всяка 14 × 10 см
• Ярки картинки и различни материи за пипане
• Подходящи за вкъщи, детска градина и път
• За деца от 12 месеца
• Произведени в Украйна`,
    images: H(`f736c2b0e2f257c28093b0a03cb186338623b40483c5ea2b314e142cc8f529a5.jpeg ae743782598c10c41df3e011600f65bffcb1e89c5bae3f042f1828f023786d69.jpeg ed5d9a9d2558eedc595161b1e7a8f33f5adf26b04d20b9ae318f7458618c8f5c.jpeg 28c43fb1f74e87793d00a6720205c88788017aa837f1ea95330eed5b89cbb946.jpeg 54897302eec45f42161e3cadc4926c09bca44c264f980eca5d130455ca721f09.jpeg e421e598012975929eeb57b9083a39da92e8cabd5cdda661be77ba7848bd1eae.jpeg 04f9e64058ba641ead8ea9eaea770d9c42a87bc39b7f33d5ba29855eb2869e1d.jpeg da2c09ba55205063b5a8771321e031fd4c53d389ef26bd1fec383306b479ea98.jpeg`) },

  { ...PLUSH, supplierUrl: F("p_q3fcbe6v5w"), name: "Плюшена играчка Disney Стич (35 см)", category: "Ролеви игри", material: "Плюш", age: "3+", dim: "35 см", emoji: "🧸", wholesaleEur: 13.95, msrpEur: 69.76,
    desc: `Мека плюшена играчка Стич от „Лило и Стич“ на Disney, висока 35 см. Приятна на допир и чудесен подарък за всеки почитател на анимацията.

• Оригинален лицензиран продукт на Disney
• Височина 35 см
• Мек и приятен плюш`,
    images: H(`54a83fad9121a17ef049d77e9a761baf6de7e520eb0ba8ba108265dd99f7746e.jpeg`) },

  { ...PLUSH, supplierUrl: F("p_32tbggcqgz"), name: "Плюшена играчка Disney Лерой от „Лило и Стич“ (40 см)", category: "Ролеви игри", material: "Плюш", age: "3+", dim: "40 см", emoji: "🧸", wholesaleEur: 13.95, msrpEur: 69.76,
    desc: `Мека плюшена играчка Лерой от „Лило и Стич“ на Disney, висока 40 см. Чудесен подарък за малки и големи почитатели на анимацията.

• Оригинален лицензиран продукт на Disney
• Височина 40 см
• Мек и приятен плюш`,
    images: H(`073c7db8c573cd339ed35b1efbdc51f75511944328a513dcdaae7b1379f06b0f.jpeg`) },

  { ...PLUSH, supplierUrl: F("p_ynkprfjngu"), name: "Плюшена играчка Disney Мики Маус (61 см)", category: "Ролеви игри", material: "Плюш", age: "3+", dim: "61 см", emoji: "🧸", wholesaleEur: 28.22, msrpEur: 141.09,
    desc: `Голям плюшен Мики Маус на Disney, висок 61 см, в изпълнение с високо качество. Мек и приятен на допир — любим приятел за игра и красив подарък.

• Оригинален лицензиран продукт на Disney
• Височина 61 см
• Мек и приятен плюш`,
    images: H(`667efc7861baa9d265dcc21d831ab71f22e485111c7d2572dda484bb35dfda74.jpeg`) },

  { ...ADORA, supplierUrl: F("p_5ywhdtdmgj"), name: "Логическа игра „Вълкът и седемте козлета“ (48 задачи)", category: "Образователни", material: "Пластмаса и картон", age: "3-7", dim: "29 × 24 × 6 см (кутия)", emoji: "🐐", wholesaleEur: 15.0, msrpEur: 29.99,
    desc: `Помогнете на седемте козлета да се скрият от вълка! В тази приказна логическа игра детето трябва да скрие всичките 7 козлета под мебелите, преди вълкът да ги намери — но внимание: не всяко козле се побира под всяка мебел.

Играта развива логическото мислене, разсъжденията, разпознаването на форми и пространственото възприятие. Съдържа 48 задачи за деца от 3 до 7 години и красива книжка с приказката.

Съдържание:
• 7 козлета с различна форма
• 5 мебели-пъзел
• 1 вълк и игрално поле
• Книжка с 48 задачи и решения
• Книжка с приказката`,
    images: H(`44b63c0db9e7304fc0e0bb87eaa97271b8eb9faa86ab12d55b995fd75a49ba55.jpeg`) },

  { ...ADORA, supplierUrl: F("p_bdq69t5s25"), name: "Логическа игра Smart Games IQ XL (120 задачи)", category: "Образователни", material: "Пластмаса", age: "7+", dim: "14.4 × 14.4 см", emoji: "🧠", wholesaleEur: 8.0, msrpEur: 16.99,
    desc: `Подредете пръчиците една над друга! Пет хоризонтални пръчици трябва да легнат върху пет вертикални — успявате ли да ги кръстосате правилно? Компактна логическа игра за път със 120 задачи.

• Игрално поле, 10 цветни пръчици и книжка със задачи и решения
• За един играч от 7 години — подходяща и за възрастни
• Развива концентрацията, решаването на проблеми и логиката`,
    images: H(`10ec7d75a08cf9c7bf9bd68a00985f41bd7ed2b8657f85c1eafe7eac4e705163.jpeg`) },

  { shipsFrom: "Франция", supplierMinimum: 100, supplierUrl: F("p_px4azmnnmm"), name: "Плюшено зайче с тежест (47 см)", category: "Ролеви игри", material: "Плюш", age: "3+", dim: "47 см", emoji: "🐰", wholesaleEur: 23.5, msrpEur: 47.0,
    desc: `Голямо плюшено зайче с тежест, високо 47 см. Приятната тежест го прави уютно за гушкане и успокояващо преди сън, а мекият плюш е нежен на допир. Идва в подаръчна кутия.

• Височина 47 см
• С тежест — успокоява и дава чувство за сигурност
• Мек плюш, в подаръчна кутия`,
    images: H(`d870cf195778f5b9f84f37d460d74b0daf16efc2a87afbf924105ed9d3115d6c.jpeg`) },

  { ...MH, supplierUrl: F("p_zjk4mq99k5"), name: "Детска площадка 7-в-1 с пързалка и тунел (кремава)", category: "Катерушки и меки игри", material: "HDPE пластмаса", age: "1-6", dim: "186 × 153 × 111 см", emoji: "🛝", wholesaleEur: 135.41, msrpEur: 399.48,
    desc: `Детска площадка 7-в-1, която превръща всяко място в игрище — у дома или на двора. Има пързалка, тунел за пълзене, далекоглед, баскетболен кош и игра с хвърляне на халки за активна и въображаема игра.

• 7-в-1: пързалка, стълба, тунел, далекоглед, кош, халки и кутия за играчки
• Изработена от гладка и безопасна HDPE пластмаса
• Пързалка със зона за спиране
• Стълбата укрепва мускулите на краката и ръцете
• За игра на закрито и на открито
• Издържа до 30 кг, за деца от 1 до 6 години

Пързалка 160 × 31 × 55 см · платформа 31 × 37 × 55 см · кутия за играчки 44 × 36 × 19 см. В комплекта има топка и инструкция.`,
    images: H(`c3aafcbedd0e5704f170145e00a8b1d5604d5f47dc79ca98ebe97f9db2889ca2.jpeg 4f08d29f684f78f9a2bd9260b3f17a21ac1661f38d8fb6c29b09b73061c6da8e.jpeg a08f6defb230df8a16779dda2c7daea044acf0c606231265041c5829f2aa70f0.jpeg 1cfae3f29eaf52feaae18e664d1a88d3230bb89c7f5eb1844bcf69713485c5e9.jpeg ec27fe57a9ba3a057ec7e356d0eac3111db2949811f8c6b545efee8b95033050.jpeg d4b36af9c17c13880ef923455419153dcffef672082271ff54e0799ec7483f03.jpeg 7f66ffb35a32e5b5747adce15f50b4a870f3800a77500d97ce158a1155912696.jpeg de4938b2152380a4411cc2b535c4193a0c0871223ea5f03ad71ebcb6dbf5df8a.jpeg 94b8694737381c08cfd2c4994657849fa9d9361f4725a96a5f4f63b002af9607.jpeg`) },

  { ...VINT, supplierUrl: F("p_guftxpuxck"), name: "Пъзел с пръчици „Сафари“", category: "Пъзели", material: "Дърво", age: "3+", dim: "12 × 12.5 см", emoji: "🦁", wholesaleEur: 6.55, msrpEur: 14.95,
    desc: `Дървен пъзел с пръчици на тема сафари, ръчно изработен в Испания. Включва 3 двустранни дъски — общо 6 различни пъзела в един продукт. Детето възстановява всяка рисунка, като подрежда пръчиците в правилния ред, и така развива концентрацията, фината моторика и логическото мислене.

• 6 пъзела в един (3 двустранни дъски)
• Ръчно изработен от дърво в Испания
• Размер 12 × 12.5 см — удобен и за път`,
    images: H(`e3526eee61a1aa83f2af27afc99410bc98c5fd89399c0cf1b5dd75748cc6275a.png fed4b8ac72e6463cf297abe2febb0f83ec5d7b29dbe006b5d5ac36d55ecf6ed1.png`) },

  { ...VINT, supplierUrl: F("p_jbdpg7tvbq"), name: "Пъзел с пръчици „Транспорт“", category: "Пъзели", material: "Дърво", age: "3+", dim: "12 × 12.5 см", emoji: "🚗", wholesaleEur: 6.55, msrpEur: 14.95,
    desc: `Дървен пъзел с пръчици на тема транспорт, ръчно изработен в Испания. Включва 3 двустранни дъски — общо 6 различни пъзела в един продукт. Детето възстановява всяка рисунка, като подрежда пръчиците в правилния ред, и така развива концентрацията, фината моторика и логическото мислене.

• 6 пъзела в един (3 двустранни дъски)
• Ръчно изработен от дърво в Испания
• Размер 12 × 12.5 см — удобен и за път`,
    images: H(`1c80e19a1365b01d21cdc60dbc0ca64fc38e29c7ea10f74e7915d3f0362c8391.png debb8888c10db443387b0d37d006e9bd6172848a21864a10ec38a28706d20102.png`) },

  { ...VINT, supplierUrl: F("p_qabt2efnfz"), name: "Магнитна книга-пъзел „Магазини“", category: "Пъзели", material: "Картон с магнити", age: "3+", dim: "18 × 18 × 1.5 см", emoji: "🧲", wholesaleEur: 7.42, msrpEur: 16.95,
    desc: `Магнитна книга с 3 пъзела с нарастваща трудност — от 9, 12 и 16 части — на тема магазините в квартала. Компактният формат е идеален за път и за забавление без екран.

• 3 магнитни пъзела: 9, 12 и 16 части
• Частите не се губят — залепват за страницата
• Удобна за път, размер 18 × 18 см`,
    images: H(`0d6b48492bc5bc289bbb2a2d3ad0b220932a31b9acbf80ff6afb19f649f86674.png f3bcc7b35610feba9b58f1e0dfa8ae3ffb51d86534ac20187cc5b728ea5cc859.png`) },

  { ...VINT, supplierUrl: F("p_n6fwvezyjb"), name: "Магнитна книга „Истории – Ежедневие“", category: "Образователни", material: "Картон с магнити", age: "3+", dim: "18 × 18 × 1.5 см", emoji: "🧲", wholesaleEur: 7.42, msrpEur: 16.95,
    desc: `Магнитна книжка с 3 различни сцени от ежедневието на децата и над 40 магнита за многократна употреба. Детето подрежда героите и предметите и измисля свои истории — игра, която развива творчеството, въображението и речта.

• 3 сцени и над 40 магнита
• Насърчава свободната игра и разказването на истории
• Удобна за път, размер 18 × 18 см`,
    images: H(`dbbf329720ec200febbe706e7da9bee829f2bbb117e6929ad9a7421957793fef.png 4568a70bb96ac4e907c47a50dae5f3fdc97d2e178d7138bb7b0f23a75cf42ea1.png 1f5977a71a15d484aaf7fffda2d5fdad355568c1e4663d8d07b579519acc774d.png`) },

  { ...VINT, supplierUrl: F("p_t68cvhy5jr"), name: "Нощна лампа „Катеричка“ с име по желание", category: "Образователни", material: "Дърво", age: "3+", dim: "16.7 × 16.9 × 6 см", emoji: "🐿️", wholesaleEur: 12.61, msrpEur: 29.0,
    desc: `Нощна лампа във формата на катеричка, изработена в Испания. Можете да я персонализирате с името на детето — в комплекта има букви и символи за надпис.

• Размер 16.7 × 16.9 × 6 см, поле за надпис 11 × 6 см
• Комплект букви и символи за персонализиране
• Работи с 3 батерии AAA или адаптер (не са включени)`,
    images: H(`9d99aa3bf1b2f81c20f76ce5076cc0bbc3ec6ee9d5e8f3c3904b9a1e4261005c.png db20f7be71e49abe22eedf8ad6556fb4b3636e648eee7d921d0dcab3b4c3c311.png e4cc1a4ca6fb576e3db38e8e277eeb2a531534cbc1f57257f4963a886d964643.jpeg b2c945facd8a465261d00aeff6449ffebe5452647b92226ffe75d49928ff97e6.jpeg f68234259dcd79b43e743e6c86f577786a2ed75648e941af5040089ef4a57b3d.png e95eca4cb77d96199e30a78254d2832a3991d42e948f1d73eded80968e8a81b4.png`) },

  { ...BUSY, supplierUrl: F("p_ezqhc8sdqn"), name: "BusyKids Монтесори комплект (12–18 месеца)", category: "Монтесори", material: "Дърво", age: "12-18 мес.", dim: "", emoji: "🎁", wholesaleEur: 34.5, msrpEur: 69.0,
    variants: [{ label: "Комплект", options: ["№1", "№2"] }],
    desc: `Монтесори комплект за ранното развитие на детето от 12 до 18 месеца. Съдържа пет различни играчки, книжка с ярки цветове и наръчник за родителя с идеи как да играете заедно.

Комплект №1 включва:
• Цветни рингове на стойка — учат цветовете и координацията
• Сортер със сменяеми плочки — развива сортирането и логиката
• Чашки за редене — баланс и пространствено мислене
• Сортер „Сезони“ — цветове, форми и годишните времена
• Чукче с щипки — сила, точност и чувство за ритъм
• Книжка за цветовете и наръчник за родители

Готов подарък от здрави и безопасни материали. Наличен в два варианта на комплекта (№1 и №2) с различни играчки.`,
    images: H(`e5d66c08107cb8ef533f4f26e0c7c24f6470c428533b133281d6b08d632e2e72.jpeg 74de3d2eeff588462f63a0ff6d7c11f6b4cd0ff8a863287c6aac05353eb969f5.jpeg afa41c5ad4c409bcf178f239d63c0ef46a853d4d9a56ca3e345b7b6ca70d5adc.jpeg 1f9bb4b2f4c1539882be4c25f1e1ff11343dbbdc22c77368d6adeff6b355addd.jpeg 81f5391e4c753300f6629090dac83ec0327b8db6cb41f83f48a80528d54be1a8.jpeg c68c1fa57dcf8d28ca0263ee962e63bc856c1f1d87a8fa48bbefa060f2602414.jpeg abe9f09dfea59a776338e7c9052e13003c703397977ef2b2c9b36aa66c8d2fb3.jpeg f0098ef8b496aef25ee832a3a5b5186faa4d52316ee560828e214e6776d3b5e1.jpeg cdec70d345f4fba39fea5711578ef3ec1a64c2b3e6e07cd95701932d2375676d.jpeg 2c98a574a7ac9512109a1900b16627ac8a6598733bcb3d21d866e4bd051974d8.jpeg 2dc542be1abdbe1da65648f4986e670814c4c30af75857d735d417b17f320442.jpeg 7a6910745397fdf8b394d25d2ea710c5b3998b8303ac8094b97929477ba14d96.jpeg 4205bd36bde4c7cde7bc8346c373ccede613747a687b24e4a5d829468878f0f8.jpeg 03203e3aedbff4002a555638bbc9dc67057d7157e89008e508097a66b5421ebf.jpeg 20739745f582b8d0a82120d48e01b559d9095a0e8c9293d5c14918940bfdfa8c.jpeg d3f7933faa253609158461259744353e072ca78cc4fd30864310a2cd8d699ef0.jpeg 594879af7888112a96987a02276d5e207350326bbc106c31dec91735ab43e8a2.jpeg 590dad8fe0127ff71f89a725bf2ecff9a73b50978010fd35b1ff64d568f3d274.jpeg 94344309e403ce6289bba3cd3ccfe19e3c09ccad0bf5caa9bacb50beab817f43.jpeg 00b1dd2c0bcca7f5159160133a27fc34e36431b72647827723e417b10e5a38f6.jpeg 2d850cc275c52d6356d287129b057648a78863a49b104b5ed96efb0968b45776.jpeg c394ab37712fee951d86d9fccdd3b0a4e474ccc0cf6322d01eddc875b88fea0f.jpeg c8611bb49fbc2eff52823a9f0329b0101f1f70bc2695d6b4c5272ffcc1ea12bb.jpeg bd2927953e1ea051f2caac70e4e9d943d9baa0a5eab507c1e13d7b85f488c605.jpeg 80dd0e71045268f37707eaa8d90e07ddf25bfae4dcef9fb346420a3ac8ec4834.jpeg`) },

  { ...BUSY, supplierUrl: F("p_488pygpywh"), name: "BusyKids Монтесори комплект (24–36 месеца, 69 части)", category: "Монтесори", material: "Дърво", age: "2-3", dim: "", emoji: "🎁", wholesaleEur: 37.5, msrpEur: 75.0,
    desc: `Монтесори комплект от 69 части за деца от 24 до 36 месеца, който помага на детето да се развива хармонично чрез игра.

Комплектът включва:
• Сортер с геометрични форми — логика, форми и цветове
• Пъзел с числа — първи стъпки в математиката
• Пирамида-къщичка — сетива, моторика и творчество
• Книжка с числа — числа и развитие на речта
• Логически блокчета с животни — координация, търпение и концентрация
• Игра „Раче“ — моторика, форми и цветове
• Наръчник за родители с идеи и съвети

Всяка играчка е от качествени и безопасни материали. Чудесен подарък за всяко дете.`,
    images: H(`29589f1c097b885d587bf88e21a27079aaa8b6a01ba4d0c432bf3bc101769d6c.jpeg 254c61c8cb3ead79d9045c5ee8cf7395f9a2028ce003a2bb2a361175dadb82f6.jpeg 653d1f62f8c3fea06603146f1a12e912914d1d750d3e77567e1d454637da72a0.jpeg 3e4ec64b0bf0accdf44b7838df47d809b8c55ba83401f1d09b0f3bd679469d3e.jpeg bff105117e0b2426a41765fdd92696cf4d5b6e38c4a6f95f088723a306e744b4.jpeg c68c1fa57dcf8d28ca0263ee962e63bc856c1f1d87a8fa48bbefa060f2602414.jpeg 3c61d9ea679dfa114c24f37987e6d2698da38e142e88917d4f3f008d6b5c18c9.jpeg c47c3c6bd02d20bd16203bcb7f868e12f9e1e0ba5a3bf3b913b21f81fcac41fb.jpeg 0079044d5b714b3e8bcd92df1f8d8f8e90888e50079d11f68b27ab88b4baa89d.png 32fb326860732a0a95fe9d2ebf7e04023887c578d55312b8e03789c26958b79e.png eb849e065dc56e846f11ec92b12d82eea8f827b885ac3d724242176bbeb824a7.jpeg 200fbb2d121103797fb5883f44c51c09f247f92d39c1365c2d15f0f4bab33738.jpeg 80275d064729358a1efc6f0af53536e2a9039be36d671c44bae70c455ce9fc70.jpeg cd6acd0f9532be31ee89eb04aad13797c71215d97dbc11f28c469f74fa780dae.jpeg 641ed9b30af16f54ebb8c8630cfb00394458d6bf80667b73bc7489c6a129922f.jpeg 9c8bec93e6e0fe360b00c2295664e22c1eae9e980f230b770833a44d1c7b7a9c.jpeg e9604246f966c55dfa20552a37a3e4800e6abdf57b5323b03588e70e7a94a003.jpeg d14759dff9e3ab7ce4d389545e6e3347bb4bcb95da6e0adb8b1e077b546cad0c.jpeg c2875274dd7a1d5aae32e362aa8168181ac73d60786ac96da8c0dd5c74f6cbee.jpeg e4ef10257c2fff3b1ad3daaa68fecf4f5aa481b5503ec5ac914dd38c940a7314.jpeg 22de37088733c85a7ae579e6fa074c733d8e82fba39b7525b29588fbff85f6f5.jpeg`) },

  { ...BUSY, supplierUrl: F("p_wgar9mwkn7"), name: "BusyKids Монтесори куб с активности", category: "Монтесори", material: "Дърво", age: "1+", dim: "", emoji: "🎲", wholesaleEur: 9.5, msrpEur: 19.0,
    desc: `Многофункционален куб за развитие по метода на Мария Монтесори — 5 страни, 5 различни занимания. Всяка страна е ново предизвикателство за малкия изследовател.

• Огледало — себепознание, фокусиране на погледа и емоционално развитие
• Лабиринт — фина моторика, координация око-ръка и пространствено въображение
• Сортер — форми, цветове и логическо мислене
• Зъбни колела — първи стъпки в механиката и причинно-следствените връзки
• Безопасни материали, приятни на допир, и ярък дизайн`,
    images: H(`1c667eefc90c2830a6db4e72b8ec4af2d2ff7d2fb8b71089ffecc5262f41bff4.jpeg d12004eb32dd2c390bfc07c9135f174431d9c6c8e98eb71a5fbda07308612dd8.jpeg 8a31ff263deb616d5564b0226ec204388884890e1a3d5e25db0253e2847b7f3c.jpeg 135d3bc2f788c09704fe8db618af9981826ac1631b96a4ed9998dcf8b0719cb3.jpeg e58c0c40d90e08d962886342479053e8edf7f89c3798ca240f9743c20a071f80.jpeg ed7ef761ea01666b8546f27d4cffe227cc2918cb401306013e944a2e5f1b4953.jpeg 013ad93b7ba41f1054a6405d4702b3a715d6d21dc44558f65ae2d6eaca80d5cd.jpeg 6233d3b05a4a99c5a87457bfdadf2237d633a8581826ea6fa7ce86e464efb175.jpeg fd28ae6ad4e54b0821ebb3f42ee6c72a83f8b5d0b6078c124887e6c3ac5bac37.jpeg 8c63e7f4e715f791efd8ad4f897852c63fc5f29c29cd9520fa11198edbc85b59.jpeg 16d9ac3e6aa26a37a8f00c6455bb0323951dfe29705e15564839383c157afb7f.jpeg`) },

  { ...KIKA, supplierUrl: F("p_39d64xrnbj"), name: "Проходилка 3-в-1 Play & Grow (синя)", category: "Каталки и возила", material: "Пластмаса", age: "12 мес.+", dim: "", emoji: "🚶", wholesaleEur: 22.66, msrpEur: 49.9,
    desc: `Многофункционална проходилка 3-в-1 — проходилка, маса с активности и висяща маса за игра. Помага на детето да прохожда уверено, а интерактивният панел с музика и светлини го забавлява.

• 3-в-1: проходилка, маса с активности и висяща маса за игра
• Интерактивен панел с музика и светлини
• Кошничка с 3 цветни топки и пиано-слонче
• Нехлъзгаща се дръжка с регулируема височина от 43.5 до 46 см
• Задните колела се заключват
• Пианото работи с 3 батерии AAA (не са включени)
• За деца от 12 месеца`,
    images: H(`120ad06039ee2d513bd6c7ebab6c6f76ccd6fab1deb1596a27cff052d54fa139.jpeg 94a515d9d50dd69b8971108f18aa28d05731c06337d733d08ad03f1e21cb30b7.jpeg 1dda3fed43650ec16d0b419528062ff18ae425fbcac4690bfe75c2d68bfb4b69.jpeg 62f882dbd4a4d5d0973951bb2ebe7fe8469fb6b147baae6beda3f0dd5e921d4d.jpeg 77b685f4d1160f33eb818c5c9827acae3358e0c004bc1dd64d960888a2b378f3.jpeg d484b4afd0bea5972c63774f9df42d26dbe1990b07de056a9e5adbe32163ae84.jpeg 7a4c0dd99e1c489390bdbdb5d4489876dceee482588f23aeb0f72aa8670dd3df.jpeg f8c4be9c65ddaf8ed71d31200be14bdd4d146bb9474d55257630f7b4cce83eae.jpeg 72a11f9d6329975c3fedea8c85444ebc15e30af0d4dd89f5cf47db91618ceaa9.jpeg f979a69b541e6185809d6a53d587b83014b92695047985bd84910fdd0cdf687f.jpeg`) },

  { ...KIKA, supplierUrl: F("p_dewvaj5ynv"), name: "Тротинетка-возило Treo 2-в-1", category: "Каталки и возила", material: "Пластмаса, метал, PU колела", age: "1+", dim: "70 × 30.5 × 26.5 см (сгъната)", emoji: "🛴", wholesaleEur: 44.26, msrpEur: 79.9,
    variants: [{ label: "Цвят", options: ["Бежов", "Ментов"] }],
    desc: `Тротинетка и возило в едно, което расте заедно с детето — от 12 месеца се кара като возило, а от 24 месеца като тротинетка.

• 2-в-1: возило и тротинетка
• Максимално тегло: 20 кг като возило, 50 кг като тротинетка
• Регулируема гумена дръжка
• Седалка с височина 24, 27 или 31 см
• Бутон за заключване на кормилото при каране като возило
• Тихи PU колела със светлини
• Скрита задна спирачка и нехлъзгаща се платформа
• Сгъва се компактно`,
    images: H(`ed025e2eaa967295d652c885f964bee636c6c2ed9661e17ff28124266de01c41.jpeg 5b51806b6062a0ba4e159588933c73fbffea8aa680164dd78805eed9e18f60e4.jpeg 6c90d79a3c39c65f279021a229d8d21a2c79da887117c2c611fbf26128f7f7cc.jpeg b8b84636328ee48fab1a0943302aed40f117a794e422d19a3e82bee7df805c43.jpeg cf87ebd0527626d0191a801bcd2be8c494d5113bfef13cc8ebb7fa5b5b8487bd.jpeg 9590cf7fff7440e1130a8164fb38f764e536d74757f6c9b8849a957dc35f7fbd.jpeg 6480323d62de99e7be2d03db218c6af6a73856f90e9a0ff752a5a3f525cb69a4.jpeg 57ff9da1d8b7fe4ecd98434fa86d0e9787a545d2c80520869e53130da1c8902b.jpeg 2711ea09ea1df73b4b9d989ec9fdce23d80cb769a967933901b4b368b58be88d.jpeg 81a7aafd1c72771aed5b3a89be1cb4ea54c0ba792453264c3ff0a72f025b7aa1.jpeg b5cc78cdd275899c11b8874257189850fa277e0ebd511a36a4729185314c3068.jpeg a220f6443733ccc6c81fce956103f670e94d5094ed1eb6083a90b8b0292e94c8.jpeg 3734068897305e22a777a46f268a8f24f123a136bce0d4e2c89457a231918a38.jpeg 990a54989186a1be488a47b14005c32f485da9ab38f4e4a894f23aa5c335eb35.jpeg afac52b964a7adbeafd6ae6c0010b86c8996a29fd841bfe373a9cc1c8e654b44.jpeg d96366a0a401679078583ef10223d31eeecab28aa0d5921166d5267572d77edf.jpeg 43be0c6d93c28c7fb541759018dc1d11e0a2d436598bc5f68e0012f28fbe4f11.jpeg 7d0c4719a18c85c90f6183eb1df003ea0f94b832a2fc677586a595b789157a16.jpeg 397491980aca3d1fac600248ce1af7e0ca1769bb9b0e713b12473c2d7ac4fa71.jpeg 5804e52998dd112c9424a5ff8e80928cb3b53c705b90d82a47695bedd2b1097d.jpeg 92944ca0bab6d3e2503c35e993fb8bbaac193969c80ad571ce9d556df89b5b2a.jpeg 11372248aec5b360ced6a42f9b8b0e512a83004b0404b0f22c4a66eef0272f2b.jpeg df4e4e218a9769e850533fda3eaa6a8f618ed0a1da25f72e5f8c0abd93ee7ea9.jpeg cbb825b592f151fe58349030e495fcb696751eaffc68ddbbb770c425ec9e4418.jpeg 290e663d0a8c2ffca5565d0c2cd7cfe5ac9cff7afc39acc9250858bf93255402.jpeg`) },

  { ...KIKA, supplierUrl: F("p_hm28cxcq9f"), name: "Акумулаторна кола Volkswagen E-Buggy 12V (розова)", category: "Каталки и возила", material: "Пластмаса, EVA колела", age: "3+", dim: "98 × 56.5 × 47 см", emoji: "🚙", wholesaleEur: 150.37, msrpEur: 269.0,
    desc: `Лицензирана акумулаторна кола Volkswagen E-Buggy в розово — за първите самостоятелни разходки с много стил.

• Батерия 12V 4.5Ah, 2 мотора по 25W
• Дистанционно управление 2.4G за родителите
• Кожена седалка и EVA колела
• Амортисьори на четирите колела
• USB / MP3, LED светлини и индикатор за батерията`,
    images: H(`92ec9c8cb8c0e5fe00adfde7f308db96517a778594b136876ff9fd68912639b9.jpeg 4f7ad1f2d27a24d3ef8f9662c69725e29f42fc37f28bfa68fa8d9fb6afefe3c1.jpeg 0638cbf967ed3320a7b1874ee87239a164cc1c9f48adf416e4a2fa85fc7f2fbf.jpeg 1bc252cda5d4f9f6a782cacb1b99602b1e03d283e357b1762d108ac5c72cf8e3.jpeg 764dd5de4af9fb813371c6d964bd0a471ae722b555d6dca797e0afe37ad1f281.jpeg e6c68de5bef5ce22f6d05aeb8d140242ac4cfd21a1732d8e4ac21027c1b0cbdf.jpeg 934d02e7c6df8b82f0772f1ff7602d941d5c2170c3dcb513adfa4ecdc370244c.jpeg 76c17f7e431b46483b40d83546d3ddb012f56d14e3cbfaf4ed4178404ee11289.jpeg 008a50a56f09aca67eb708813f265da36e157a3660da2f4bd0552143dd588adc.jpeg 2abbbdae0754cdf0afe8b8906b6ea001c121c8a117f238c3609c7109132b7007.jpeg 56a5d899ef4d01be921876276ce6af5cb7346cdb5a90b0faae749430f6d7b211.jpeg b1ffb2a0f3ed8aeac04dff40f021d2253ceae4aac612c1b6ffe08774b7088175.jpeg f5f434f0145e6bccb9b366b761202f9ce4aa4917cb0c584d59cc9fd0cf2b56ab.jpeg 671b0f7770e3eef81f26a1ee097aae2ebca01f13859bc12329a88ff6f16455ef.jpeg 7c29ecbf26c36247c366c45fc14da3a88a49d46b821a772838ea03ceef3cf4f4.jpeg d2bbf4a3496e541749a7f7143bd8ec4ac93288607fe1c98aefe16603358b8248.jpeg 15b63be2080fc5f13814e4c57e535ebee6244ed9c604fef8e066b2de8b2625b6.jpeg ce5e9da082d693017ce9a9797d8753a796b915b1bc967bc89c34966726c3a442.jpeg 2fe0206de5efd42de7061163d8009aa20d985ccf48023e163588b66b427360ac.jpeg 095a54b9dbecbd434686806c1ccf3a7d2a67157fdc84fabfb04c64015f8c3032.jpeg 31b43d535da998c5de11117c1a568ccec75fa1700106056037384e11944719b2.jpeg 0e93cd9b02d1183e089d3eb3fc51d65029611ccff3a4e317144cd2b4c85d1623.jpeg ce34c2cbc37d6dd2f31d9ec1cbe1fdaa28ecea7638b5a2c547fba7fa74bb48f4.jpeg 071f7ea7957c72380c8c44a549a59b951561be5086a6573acf37010182b35dd3.jpeg 045b5605b680b47194f0b44f2f5b4fa23bbf62bdf57e6f3fab9431826648f217.jpeg a60541aecc7529330c995c3c344dd80ca31cd73ebea5e5a1da372455ce8e891d.jpeg dc93a25949f87f0095534e36f3b6fe121e2989eeda35d2e9491b744255c312c4.jpeg 09057014ff3ec4dc2f2360ca2e409634148ee4cbd66903dcdcf148a6b0e15897.jpeg 408d7c72fed8782be7f0e81796f44dcedcee58cafda85c07bc43c3771a4dbd18.jpeg 5392906de88974db14491992582547583482ac9c693278754c1deadb1611af7b.jpeg 6be544b389707ff20518268bcc79d775ade811102d7ed7006d2fe02f25531bf9.jpeg 109856fb6fd8349f16460db92b2e81d535dd9ee561267c7fbd6ea5f25b2aa071.jpeg 151013499102a6f9184e22b13192d8004137acba1e0e19e8a689211fba8db7ab.jpeg 5f84dd83f64ad0f22819489b1f7a85be2e234bc46fa4b28ad59bf8cf0a85be83.jpeg 5a410de85d9502e233c0c432b99197f1eef5477c904c1e8e0d3ccf5c40025b84.jpeg 224715d54736d7b4937bab4f721e4a438d87416b23d872560e35950f88676b6f.jpeg e0030c3a022caf990c937a9ba932a569d16f7045ed6350ea2651ae2a1f773465.jpeg 4f5f07baead14260d87401093d6721b36abfe208fa70cf8cc62d31cc6711db89.jpeg 71d9c5569a62dd5035d7953e49068394623f13f6ad17be6f499750111865d91b.jpeg`) },

  { ...KIKA, supplierUrl: F("p_6atpbsu75v"), name: "Акумулаторна кола Mercedes-Benz G63 AMG 6×6 24V (черна)", category: "Каталки и возила", material: "Пластмаса, EVA колела", age: "3+", dim: "120 × 68 × 61 см", emoji: "🚙", wholesaleEur: 204.02, msrpEur: 369.0,
    desc: `Лицензиран Mercedes-Benz G63 AMG 6×6 — мощна акумулаторна кола с шест колела за големи приключения.

• Батерия 24V 7Ah, 2 мотора по 200W
• Две скорости — ниска и висока
• Дистанционно управление 2.4G за родителите
• Кожена седалка, EVA колела и амортисьори на шестте колела
• Две отварящи се врати и багажник
• Светлини, музика, MP3 / USB / слот за TF карта, индикатор за батерията`,
    images: H(`6edf66a9ac94750cac3ed965f5cf276a6c06a16a6bea838e90803b3a1c1998a8.jpeg 17d3e2645671a6c0ade99b4bed4bd66edf3807ff07823a447e942dd0a8d64b85.jpeg c83688f03aad3b47ba25a95a2926b9eddbba7b35a59e85f7bfe2f49492f34343.jpeg 63295f44b0432857b9cb93944b5f3dcf4a1d506eb0455d7bf48aadbf5405efb5.jpeg 8fbbc283739ca90a91c5fa4d7a125c1af565fdfc219503169b10728659c0db24.jpeg 28fd0cfba6c6f47ebe2b1dd3917d4f507912da9b66f5399abfb3f2a883b3a593.jpeg 949e8468af6e92079b6681316b3478b1631c72f30ed836408a3a8eb11550e832.jpeg`) },

  { ...KIKA, supplierUrl: F("p_7dq67v97ts"), name: "Дървена детска палатка „Розова къщичка“ с мек килим", category: "Ролеви игри", material: "Тополово дърво, полиестер", age: "3+", dim: "120 × 120 × 160 см", emoji: "⛺", wholesaleEur: 20.65, msrpEur: 45.0,
    desc: `Детска палатка тийпи с дървена конструкция и весела щампа на цветна къщичка с изрязани врата и прозорче. Уютно кътче за игра, четене и почивка в детската стая.

• Мек килим 120 × 120 см и чанта за съхранение в комплекта
• Бързо и лесно сглобяване
• Само за игра на закрито
• Отговаря на стандарта EN 71-1/2/3/8
• Конструкция от тополово дърво, текстил и пълнеж от полиестер`,
    images: H(`0f62c8f351c969bb4029ff76f32afe8fcbdf1acb8d1e942c3451c375c910f107.jpeg c1246fe2658de745825009781979657fb7f1338d239c671b77b12d83025b5803.jpeg 2b47342d28fae50fd3390b355fd2bd6c71af18a87548fe05446f3b31aa499c29.jpeg`) },

  { ...KIKA, supplierUrl: F("p_2g3xpehn8k"), name: "Кола за яздене Blinky (синя, 1–3 г.)", category: "Каталки и возила", material: "Алуминиева рама, светещи колела", age: "1-3", dim: "", emoji: "🛵", wholesaleEur: 24.95, msrpEur: 49.9,
    desc: `Лека кола за яздене, която развива усета за баланс и координация. Подходяща за каране вкъщи и навън.

• Висококачествена алуминиева рама
• Седалката се мести напред и назад
• Ограничено завъртане на кормилото за безопасност
• Мека седалка със заоблени ръбове и нехлъзгащи се дръжки
• Устойчиви светещи колела и държач за шише
• За деца от 1 до 3 години`,
    images: H(`d6cc4986f04c939b05c7dd1cc44b8829e6a89d1f37684c18b8ff1d80f89cb186.jpeg 474debb6497d76a73fa92384f6112bc50f29ff8de6f96565c1ad2aa117a9a7f1.jpeg bc0a6e4f459c902f519add3cb7067d869a7dafb8e44eba270f3aa96d0270e69e.jpeg fbd25bfabac43784de1fff05debe66f798e759695e94d4b8e979d2e907e85649.jpeg 5b889f440bd07b47f00b7152600a380dffe75507d31aead9ae21fa8c33db6637.jpeg aa5fffed0c427ae20c454c69d82b0f94f2f17d58424c4d14b56d1437018ed1b6.jpeg 0c27aa65fcd7912bf9deb8c0eee95e0329a8f2b4fee4926288507575b9808021.jpeg c5ad02f58510cd60ffc127933c7505750fca800c740dd94e0b0bdcb0b92f765f.jpeg 3a8f7c490cc0999f350d4f59520f814162f806c1bba92e4e27873f75226121b0.jpeg`) },

  { ...MH, supplierUrl: F("p_r37ncf4qkp"), name: "Електрически детски трактор с ремарке (зелен)", category: "Каталки и возила", material: "Пластмаса, метал", age: "3-8", dim: "139 × 58 × 55 см", emoji: "🚜", wholesaleEur: 133.64, msrpEur: 332.28,
    desc: `Детски електрически трактор със сваляемо ремарке — децата превозват играчки, пясък или листа и се потапят в ролеви игри на строители и фермери.

• Сваляемо ремарке за превоз и съхранение
• Два режима — детето кара само или родителят управлява с дистанционното
• Шест колела с добро сцепление за различни терени
• Батерия 12V 4.5Ah — до 60 минути каране
• Плавно потегляне за повече безопасност
• Реалистични звуци, светлини и MP3 музика
• Скорост 3–5 км/ч, издържа до 30 кг
• Изисква сглобяване

Ремарке: 51.5 × 52 × 32 см · седалка: 29 × 19.5 см · обхват на дистанционното до 15 м.`,
    images: H(`5ef456276cd891637861abce919e6827282ca9e70234e93d105ba88898ce971f.jpeg 6fff839e14e6c75afe13224722eeaa23f3d75470101d30c28b5ea3d84318784f.jpeg c8c218bc33f29a3cfddd19504a92e09ca5966b6c3ae139884b96d693f708c75b.jpeg 2b366422c88bde8ba1633c70b326b0cf98597abc9967e97483b0a5f0c3f9525b.jpeg db073450959e6e99640a255e4f35f63e5d3ab133999ee019b0fdcd858747da53.jpeg 70d30c3d387791106abad009ca77c89dc3b723a68caf591e428f3cdb9491b413.jpeg 9837f25d3bcb77346918d493fb473330220522f6ec8a1c6a996c483358c74a50.jpeg 1de7d318fcea73ae24ce24f0afc8ce3cc1b01516d4fd2c0c3bf80c9cd2a67223.jpeg 0e3d97b323e30ba83369da913ea7718fec3146fff30625993343accc4b8200e2.jpeg`) },

  { ...MH, supplierUrl: F("p_gzswvzue9d"), name: "Електрическа кола UTV с багажник, 2 мотора (зелена)", category: "Каталки и возила", material: "Пластмаса, метал", age: "3-8", dim: "105 × 60 × 60 см", emoji: "🚙", wholesaleEur: 153.02, msrpEur: 376.68,
    desc: `Електрическа кола в стил UTV за малки изследователи — часове забавление и приключения. Два мотора 12V осигуряват плавно каране, а работещият багажник позволява истинско товарене.

• Два мотора за плавно каране навън
• Функционален електрически багажник за ролеви игри
• Дистанционно управление за родителите
• Плавно потегляне без резки движения
• Амортисьори на четирите колела
• Музика през USB, TF карта и MP3
• Скорост 1.8–3.7 км/ч, около 45 минути каране, издържа до 30 кг

Седалка: 33 × 18 см, височина 16 см · колела Ø 25 см · батерия 12V 4.5Ah.`,
    images: H(`53c1fe3225f71a73cce0427f9ee59afe83f9ab716b33e0765cce3c5558065161.jpeg e1846916ac5c8c940f4ec3f7d2a830ca2fc20ba64d3e91629666d976d0803ada.jpeg 7fbfd5b152fb9231646ab457f22f433ea6713f6ff85fe43b08ac19d21fa813ed.jpeg b687776970388d16e02939347812040fb3d3ba2d9324cfec3ace843a0e95dc1b.jpeg 196eff34c1add3418659c6f3f63fcd6ae7f5f756899270fdd1fee2cf4931cdff.jpeg 440bb2379d2757db8042dff8bb1cc5336ae81f555fa21c60f04b05f3ef48562e.jpeg b9422274064829fb2d3308f382991f689783e898480d072a83797872c8b83087.jpeg 241090dae8f830d1560aca314c11faf6fcbcc910f1fdc2ed3247cb4255add012.jpeg 15e4737e3164d550acbeceec442939c7ff09762925c2641396dbc02519527e01.jpeg`) },
];

const raw = await fs.readFile(".env.local", "utf8");
const get = (k) => (raw.match(new RegExp("^" + k + '="?([^"\\n]+)"?', "m")) || [])[1];
process.env.DATABASE_URL = get("DATABASE_URL");
process.env.BLOB_READ_WRITE_TOKEN = get("BLOB_READ_WRITE_TOKEN");

const { PrismaClient } = await import("@prisma/client");
const { put } = await import("@vercel/blob");
const prisma = new PrismaClient();

const eurToBgn = (eur) => Math.round(eur * 1.95583 * 100) / 100;
const rand = (n = 4) => Math.random().toString(36).slice(2, 2 + n);
const MAP = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sht",ъ:"a",ь:"y",ю:"yu",я:"ya" };
const slugify = (name) => [...name.toLowerCase()].map((c) => MAP[c] ?? c).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, "") + "-" + rand(5);

// Web-sized JPEG of the original Faire photo (long side ≤ 1600 px).
async function toBlob(id, hash, n) {
  const res = await fetch(`https://cdn.faire.com/fastly/${hash}?format=jpg&width=1600&fit=bounds`);
  if (!res.ok) throw new Error(`img ${res.status} ${hash}`);
  if (!(res.headers.get("content-type") || "").startsWith("image/")) throw new Error(`not image ${hash}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const { url } = await put(`uploads/${id}-${n}-${Date.now()}-${rand(4)}.jpg`, buf, { access: "public", addRandomSuffix: false, contentType: "image/jpeg" });
  return url;
}

const existing = await prisma.product.findMany({ select: { supplierUrl: true } });
const have = new Set(existing.map((e) => (e.supplierUrl || "").match(/p_[a-z0-9]+/i)?.[0]).filter(Boolean));

for (const p of products) {
  const sid = p.supplierUrl.match(/p_[a-z0-9]+/i)[0];
  if (have.has(sid)) { console.log(`SKIP (exists) ${p.name}`); continue; }
  const id = slugify(p.name);
  const urls = [];
  for (let i = 0; i < p.images.length; i++) urls.push(await toBlob(id, p.images[i], i + 1));
  if (urls.length !== p.images.length) throw new Error("image count mismatch " + p.name);
  await prisma.product.create({
    data: {
      id, name: p.name, price: eurToBgn(p.msrpEur), cost: eurToBgn(p.wholesaleEur), emoji: p.emoji,
      images: JSON.stringify(urls), category: p.category, material: p.material, age: p.age, tag: "Ново",
      dim: p.dim, desc: p.desc, variants: p.variants ? JSON.stringify(p.variants) : null, stock: 10, active: false, promo: false, supplierUrl: p.supplierUrl,
      shipsFrom: p.shipsFrom, supplierMinimum: p.supplierMinimum, rating: 4.8, reviews: 0, sortOrder: 0,
    },
  });
  console.log(`OK ${id} · ${p.msrpEur}€ (cost ${p.wholesaleEur}€) · ${urls.length} снимки`);
}
await prisma.$disconnect();
