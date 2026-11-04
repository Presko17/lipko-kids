// Batch import from Faire (2026-11-04). Price = MSRP, cost = wholesale (both €, stored in лв).
// Every product photo from Faire's full gallery is uploaded to Vercel Blob. Created as hidden drafts.
import { promises as fs } from "fs";

const H = (s) => s.trim().split(/\s+/);
const MH = { shipsFrom: "Германия", supplierMinimum: 100 };
const ODEAS = { shipsFrom: "Украйна", supplierMinimum: 17.87 };

const products = [
  {
    ...MH,
    supplierUrl: "https://www.faire.com/product/p_mcvqdqsk7g",
    name: "Монтесори катерушка 7-в-1 (триъгълник, арка и пързалка, цветна)",
    category: "Катерушки и меки игри",
    material: "Борова дървесина, многослоен шперплат",
    age: "1.5-4",
    dim: "168 × 62.5 × 57 см",
    emoji: "🧗",
    wholesaleEur: 105.13,
    msrpEur: 255.48,
    desc: `Комплект за катерене на закрито 7-в-1, който събужда желанието за приключения у децата. Включва триъгълник за катерене, мрежа, арка и двустранна пързалка, а цветните хватки правят играта още по-интересна. Изработен от гладка, безопасна борова дървесина и се вписва във всяка стая.

• 7-в-1 дизайн с много възможности за игра
• Двустранна рампа — пързалка от едната страна, стена за катерене от другата
• Арката служи за катерене или като люлка и развива баланса
• Издържа до 50 кг — могат да играят две деца едновременно
• Развива моториката при деца от 18 до 48 месеца
• Изисква сглобяване

Размери: арка 90 × 52 × 45 см · рампа 88 × 36.5 см · триъгълник 62.5 × 65 × 57 см.`,
    images: H(`c25b49101371bec3da365cff655a9c0c20f55f7b3bbe8b5f0695d219d7294234.jpeg fe3c5fc15a39d24e06d1845eb70bd870e0e9bd44155a1bac4cd644b87ef454ed.jpeg 34f97c0df1f717352f682aed251ec743617505a2cb95db2f453e4e8bcff758c5.jpeg 1c67f3b3c2b78c643b3af6477d8dffa2d4fd06fffe67c8205a0f3c884d931bcd.jpeg 394fafdbdc056f88d164b1c0f5b2626ef46a95426b4c3eb86843de42ebe8c616.jpeg 86280bde40ba8403d3f80ad6f2e5b1a3ebfe30c1cb2a4c3209d06ee4ff73016d.jpeg f3a76ee9b12ba2e142e89b036fb5e50bbd223d34774584ba2bb26dd8a951ca95.jpeg d76dc4eac6c1a6ce1dbea67cc9b2fcc9ad0ae33a922c3cc54ed7b01a841703a8.jpeg 5ea843f01a80e3cd5eeb66144c5c2d9b00422c3bae3a7b9be3887cd92fb26808.jpeg`),
  },
  {
    ...MH,
    supplierUrl: "https://www.faire.com/product/p_mq2ru532n2",
    name: "Монтесори катерушка 5-в-1 с рампа и мостче (цветна)",
    category: "Катерушки и меки игри",
    material: "Борова дървесина, шперплат",
    age: "1.5-4",
    dim: "178 × 64.5 × 63 см",
    emoji: "🧗",
    wholesaleEur: 94.57,
    msrpEur: 217.08,
    desc: `Многофункционален комплект за катерене 5-в-1 по метода Монтесори — триъгълник за катерене, арка-люлка, рампа за катерене и пързалка. Изработен от масивна дървесина с гладка повърхност, той дава на детето идеалното място за катерене вкъщи и изгражда увереност.

• Триъгълна стълба, арка-люлка и пързалка с хватки за катерене
• Сгъваем — лесно се прибира
• Ъгълът на пързалката се регулира за различни игри
• Издържа до 50 кг, за деца от 18 до 48 месеца
• Изисква сглобяване

Размери: арка 68 × 42 × 36 см · рампа 99 × 38.5 см · триъгълник 78 × 64.5 × 63 см (сгънат 64.5 × 21.5 × 73 см).`,
    images: H(`21c08ffaa643ced3df24a9e2077863cb728e632d03ee1ee7d6a3a3c914876a59.jpeg 4777b03776de19ff5eb5d76eea16fa810d5fcdc8cc687f714472dd9898fdfded.jpeg 20be53ab87ee11336a3ebf0211a50ff59152c5d448cea65ef943be48ffbeb37f.jpeg 7d2f7cf16a04ae1ec24bd412d365feae7d953ceaa14a9ec3d7c4199ff4b683c6.jpeg fe88b02c6685f104ac79e91d32eebd86a0462af6b64f1f3b1cbd228b054b7aea.jpeg 47264075591f5f8a1bf054fb1c5a4a422559574ca281ab779b42b200bb102679.jpeg f609d4d5b9e342be7150ed723add87e9a52f7526a5ecc76a9b3d2a55fdc470dc.jpeg dab86b95bd200c0c0f3718a50562242bca70ade56c6475d4d1994f9a9b03ff18.jpeg 29470939c50a4ad2db19e5a0dd0a5f407e2c89e0c4dabeae836fff8c5eb3c9c4.jpeg`),
  },
  {
    ...MH,
    supplierUrl: "https://www.faire.com/product/p_tgxwsttha5",
    name: "Катерушка за вкъщи 6-в-1 с пързалка (естествено дърво)",
    category: "Катерушки и меки игри",
    material: "Шперплат с топола, боров фурнир",
    age: "3-6",
    dim: "108 × 120 × 59 см",
    emoji: "🧗",
    wholesaleEur: 116.87,
    msrpEur: 321.48,
    desc: `Катерушка 6-в-1 от естествено, небоядисано дърво, на която децата изразходват енергията си и развиват баланс и координация. Включва стълба, мрежа, халки и пързалка — катерене, пързаляне и изследване на безопасно място у дома.

• Стълба, мрежа, халки и пързалка в една конструкция
• Двустранен панел — гладка пързалка или стена за катерене
• Развива силата на тялото, баланса и координацията
• Естествено дърво без боя, със заоблени ръбове
• Стабилна триъгълна конструкция, издържа до 50 кг
• Стои самостоятелно, не се закрепва за стената — сглобява се за около час

Пързалка (вътрешен размер): 125 × 36.5 см · хватки 11 × 6 см · халки Ø 9.5 см.`,
    images: H(`27d75c52dee0aa80671f4ebd6789d5ab72fae5f91233c78bbdee6b9e7d08d227.jpeg 10abfccbed599e97a56bfe00ad41c0310955d4db041a79b1b27ade497603edc5.jpeg 1eb8556178e7aab09e6bfaee0f4cff360302272eb499fba82db408f8fff6c8c4.jpeg 8be50db1c431e17b9a0a41e94e196474fc11c9e87720a6daa4da620804de167e.jpeg 50a348d95988e9c273b15fe98a36f1c7d70eb0ccf7145dacd344c3df69261b1f.jpeg 286b24911f8ffba5a13fcff98946584d9171f47fe7f618cf523ba0ec52860d96.jpeg 3d37477e88fb5599b1e5c1224d4bfa78e9924de5b7de41a36829947e30f88003.jpeg 520dc257fc78d16bab8257843a0ca00b77026e062584fdbec95e993cb128b4a0.jpeg 66744db11f21584cd86bc9df9343d5bc7272000dfbf8200dd9339795e3d265da.jpeg`),
  },
  {
    ...MH,
    supplierUrl: "https://www.faire.com/product/p_d4ayjnwp95",
    name: "Сгъваема катерушка 3-в-1 със стълба и пързалка",
    category: "Катерушки и меки игри",
    material: "Борова дървесина, многослоен шперплат",
    age: "1.5-4",
    dim: "175 × 70 × 89 см",
    emoji: "🧗",
    wholesaleEur: 84.21,
    msrpEur: 287.88,
    desc: `Превърнете дома в площадка за приключения с катерушката 3-в-1 по метода Монтесори. Има регулируема стълба и двустранна пързалка, която служи и като стена за катерене. Изработена е от гладка многослойна борова дървесина, сгъва се и се прибира лесно.

• Стълба с четири стъпала и пързалка за активна игра
• Пързалката се обръща и става стена за катерене
• Сгъваема, с регулируем ъгъл на игра
• Издържа до 50 кг — подходяща за две деца от 1.5 до 4 години
• Изисква сглобяване

Пързалка: 114 × 43.5 см · сгъната: 70 × 53 × 30 см.`,
    images: H(`63b2604f49b79a71ee3b073f31be27583322d17e6d1a2a99483ad43b40dd9065.jpeg 1cfdcd9a972f2b09974ac138a5bd97f3af29e4227edafa10c2d0eec9e21da333.jpeg 917f9e586528822ded8211ff3f81edbe1619d2e39366ab0f2bad6ac6ac36bde0.jpeg ffa09c9cff7719e305db4701b7d634ab9d69aece0db9c4f460ad3fa373cceb45.jpeg 5dee3a6b3a6e928e691228b3f493c0eeaebc445504dcf915470e17ace2193dd9.jpeg d9d77add3e76fe1de9cefe273208a91bdc0383650193204440cf0c72dfa53cd7.jpeg 619ee127465c4a41661f92b6059c4790c0dc1ba0de0027437e7593def2209a14.jpeg 5001712aad50621fc2089ee8ea248b9bac86147b9cac0fc892459cce99c082b2.jpeg 4f24ba39a5f1923db6364ad0287c6e40d683949036a69662339207c9300480cb.jpeg`),
  },
  {
    ...MH,
    supplierUrl: "https://www.faire.com/product/p_xz4um7y22u",
    name: "Меки блокове за катерене с рипсено покритие (5 части)",
    category: "Катерушки и меки игри",
    material: "Пяна, рипсено кадифе",
    age: "1.5-8",
    dim: "85 × 48 × 32 см (най-голямата част)",
    emoji: "🧱",
    wholesaleEur: 88.73,
    msrpEur: 272.28,
    desc: `Комплект от 5 меки блока, с които детето строи безопасни замъци и тунели. Блоковете насърчават пълзенето, катеренето и баланса, развиват координацията и увереността и вдъхновяват творческа игра.

• 5 различни форми за строене и игра
• Меко рипсено покритие и плътна пяна
• Развиват моториката чрез пълзене, катерене и редене
• Приглушени тонове — синьо, розово и бежово
• Леки и лесни за преместване, със заоблени ръбове
• Издържат до 45 кг

Части: арка 85 × 48 × 32 см · свод 54 × 48 × 33 см · полукръг 34 × 48 × 17 см · трапец 31.8 × 48 × 16 см · четвърт кръг 32.3 × 48 × 20.5 см.`,
    images: H(`43ef421bd3ab435d4f8418da7f1a74920c16be1ebdc98e49683d0b65cf61c9f4.jpeg efd82a066ae0337a78941210ef424267eb50dd5c9d5fb9f60ec3d038ff9d4f5e.jpeg 59c0feeb0be7f899ccc815805f7055e8c87e3bb078d96e17761f8af0c1927517.jpeg f5d0093b944077b8efcdc6492f4a0be9fc790472a00c206a6c576a8b07c866fd.jpeg 54dd206de6e2d4819dd6f3b13060a5c24cfe97aeb9adc05a98bfea368f034ac6.jpeg f421fb46cbb9bafdcd7b5485f3eabd6fad4b24d3ef2a020c4cce4247c286d986.jpeg 71b1d38037b61bb0c5f38ff08770ab6c993835b1e047d9e365da9a0fbf290f55.jpeg 773e8382f1bffdc5345ed23f8764c9ef7eb3c3248fbe6321f86582f8403f8527.jpeg 3f4168cfe89172924bfff3e219f83d6242850d8c6371f9e53c15f2e43797f95c.jpeg`),
  },
  {
    ...MH,
    supplierUrl: "https://www.faire.com/product/p_txqstvzgt2",
    name: "Меки блокове за игра в пастелни цветове (12 части)",
    category: "Катерушки и меки игри",
    material: "Рипсено кадифе, пяна 28D",
    age: "3-6",
    dim: "160 × 40 × 40 см (подредени)",
    emoji: "🧱",
    wholesaleEur: 112.7,
    msrpEur: 287.88,
    desc: `Голям комплект меки блокове, с който децата остават активни и в дъждовните дни. Големите меки части насърчават катеренето и пълзенето и вдъхновяват творческа игра. Заоблените ръбове и скритите ципове осигуряват безопасно приземяване.

• 12 части за строене на замъци и много други
• Меко рипсено покритие в пастелни цветове
• Плътна пяна 28D — стабилна и безопасна повърхност
• Калъфите на големите блокове се свалят и перат в пералня
• Доставят се вакуумирани и се разгъват напълно за един ден
• Подходящи за вкъщи, детска градина или игрална зала
• Издържат до 45 кг, за деца до 120 см ръст

Части: 4 квадрата 40 × 40 × 10 см · стъпало · петоъгълник · 2 арки · цилиндър · трапец · триъгълник · полукръг.`,
    images: H(`b66c8bee8ab8930da7ddee7c3d65b8a4d5c913784323512387440219ab200987.jpeg 731d8beb6b6057232cdbf474e09a13a645855be3c6799d1e201973ba46a351e0.jpeg 0828fabbf1815a35f681105673fbb2d7290ff0e45a5a326e70c6397480ae84ac.jpeg 63ae5060effe28822203204ff555b7302ed6aa9342df081cec21d0d889ad7980.jpeg 451761ec733090b3ee78bd8e3e9f03a5532fe7de2b3a4bb23abfbef62b384374.jpeg e9cbe0398018b1471517f732bbbde3aea95f5df84ad4e42c60fe19263e871bef.jpeg 25f9f0d770e67c71954d4092995f1c64ee05aa2554e0e23eade90472638e1436.jpeg 614139a751b14725e2e90c39a80679a0dffa4c8919c48ada1662dbe3ab66d23b.jpeg 795575710d09f40089cf74829d4d734666bf1f733f5914427cf8b62bcde51de3.jpeg`),
  },
  {
    ...ODEAS,
    supplierUrl: "https://www.faire.com/product/p_6ztj6a9j75",
    name: "Монтесори пъзел „Зайчета“",
    category: "Пъзели",
    material: "Брезов шперплат",
    age: "3+",
    dim: "23.5 × 11.5 см",
    emoji: "🧩",
    wholesaleEur: 10.9,
    msrpEur: 21.8,
    desc: `Пъзел-сортер, който развива въображението и говора при деца от 3 години. Състои се от дървена рамка и части с различна големина: татко заек, мама заек, две зайчета, таралеж, язовец, кошници с ябълки и зеле и вратата на заешката къщичка.

Детето подрежда частите една върху друга — първо зайчетата, после мама и татко заек с кошниците и накрая таралежа, язовеца и вратата.

• Изработен от здрав и безопасен брезов шперплат
• Рисунките са дело на детски илюстратор
• Развива сетивата, фината моторика, въображението и говора
• Чудесен за първите ролеви игри
• Произведен в Украйна`,
    images: H(`f19d61aeb5b1db6b63c6e67bd0276aca63210ac970db08e99c31918533364933.jpeg 33e244a7d2ce201139591cb699f4f5a934b24a7b418208df57ed8373937bd9d6.jpeg 732fdca0dc76b58c5755ac58933e6ee79dc02eda2fbe7c3b4d68a5a4e335d5b5.jpeg 1d7a1cf62cc9db19f122123955e1cebeecd9b33f2f9ff00ce8e00e408e103bd7.jpeg a10f5860ad8db734324e8d6e687b7fb2f5e283e03c2df19581cd2799aa0b785a.jpeg 429b528ff9398d9e91604a9e3432b17b5722f9b3b319e1d293a5f063ecfea785.jpeg 489b2d6844710fa736253eabb6e54a314820d91f4e6d2eab1c1c5c697dac44eb.jpeg 7d2e634a5942a990925db1ff4d93f2a0ecd0bd84f0c27c85fe20a8afeea5fa09.jpeg c104887b8e692f86c42caa8fdeb2766df272ee4d50d711fe4522a7bc5a98aa72.jpeg 95ebbcbe10263193413edfb40101c5f3e0fdbe040b44365275136e276abb8af8.jpeg 6d9756fe515f83bca5f6ead34769fda37bf29a2b14c213793c770a0bf6118445.jpeg`),
  },
  {
    ...ODEAS,
    supplierUrl: "https://www.faire.com/product/p_f69p4qjacd",
    name: "Дървен двуслоен пъзел с насекоми",
    category: "Пъзели",
    material: "Брезов шперплат",
    age: "3+",
    dim: "25 × 17 см",
    emoji: "🐞",
    wholesaleEur: 13.94,
    msrpEur: 27.88,
    desc: `Необичаен вариант на една от най-полезните образователни играчки — пъзела. Пъзелът има два слоя, които се подреждат върху дървена основа. Развива логиката и въображението, тренира паметта, вниманието, фината моторика и координацията око-ръка.

Рисунките на насекомите са нарисувани с акварел от детски илюстратор и изглеждат максимално реалистично, така че събуждат любопитството на детето.

• Два слоя върху дървена основа
• Изработен от здрав и безопасен брезов шперплат
• Развива сетивата и фината моторика на ръцете
• За деца от 3 години
• Произведен в Украйна`,
    images: H(`870c15845c7c10db0f0d18476aa97108dbe2943e0309d13eaff7c82003b2f762.jpeg 0ef9fab77938fc9118881ba01d85fbcba0d2ba108212f69948ea0873a65635fe.jpeg 094c509e27314a3ea4b41c53bb4a214f53175b75edc342d31027375ddbdc8069.jpeg 5f567670df4df1261b52a67159748ae34a9814442b582894dc7b213e64566945.jpeg 75fec93f651cf7a82ff5a2a9a3a699a936de5ef75d3e9af922459e7049f6d238.jpeg fed705348061784ef8eda648921a51eed88f5f370034c63e9659abe38c9254a9.jpeg`),
  },
  {
    ...ODEAS,
    supplierUrl: "https://www.faire.com/product/p_4qt2s4q86p",
    name: "Дървена игра за нанизване „Геометрични форми“",
    category: "Монтесори",
    material: "Орех, бреза, клен и ясен с ленено масло",
    age: "18 мес.+",
    dim: "Части от 4 до 6 см (8 бр.)",
    emoji: "🪢",
    wholesaleEur: 14.83,
    msrpEur: 28.6,
    desc: `Класическа игра за нанизване с геометрични форми, която развива фината моторика и координацията око-ръка. Детето прекарва връвта през дупките на дървените части и създава свои комбинации — чудесно занимание за въображението и творчеството.

• Изработена от 4 вида дърво: орех, бреза, клен и ясен
• Всички части са покрити с ленено масло
• 8 части с различни геометрични форми, от 4 до 6 см
• Идва в подаръчна опаковка
• Безопасна играчка за деца от 18 месеца
• Произведена в Украйна`,
    images: H(`91a50d105a1888652af74d92bf08d70d45f1647a3ea8dc5aea0d726d499e5f9c.jpeg 8475745a2d38590d1e15c14c9b9576c34715b97ead337b37fb620ea5fa6f988e.jpeg e9c2818b06cec7d02f3df4f90dedcf4cd83c3992bb3ec7de25275a78262ac03a.jpeg 480cbb3d119e9dd64d73355dc87a1cce56adbd3429b36c3f34d911655ea3c68e.jpeg 89fef52acd36ad60c442409cb7adf1f8d2b28bb81846b8a85d7ed55967f048aa.jpeg 9b646fcc05941c9a1e139d5afd93679ed95d674e12b780f0073c5f6c6e093775.jpeg 9e9b6802a6a3d7cdca2afe7bc435130874a760163b28f53bfdce15dbf6abb5fa.jpeg 613cd778d714689fa8cc990fbeb65f31ba7690b0cfad52356a9f6970770dbb84.jpeg`),
  },
  {
    ...ODEAS,
    supplierUrl: "https://www.faire.com/product/p_3gtn49p8ys",
    name: "Дървен пъзел „Транспорт“ (Монтесори)",
    category: "Пъзели",
    material: "Брезов шперплат, нетоксични бои на водна основа",
    age: "3+",
    dim: "33 × 23 см",
    emoji: "🚂",
    wholesaleEur: 18.32,
    msrpEur: 36.64,
    desc: `На пръв поглед проста, но изключително полезна играчка. Докато играе, детето развива логическото мислене и зрително-двигателната координация, различава предметите по контура им, сравнява ги и укрепва пръстите си. Чрез опити и грешки то се учи да сортира и запомня имената на превозните средства и средата, в която се движат.

• Изработен от брезов шперплат
• Оцветен с нетоксични бои на водна основа
• Рисунките са акварели на детски илюстратор
• Чудесен за игра у дома и в детската градина
• Произведен в Украйна`,
    images: H(`c187d65890b4a3177cacf9896cc3a5b6ac98af4c00ba164a2bea1d8c16ad0166.jpeg 9e1b2d8ae36343d32fba1ace992166480a257cd062acaebc13f11b8d8ddff949.jpeg 12826209f8fc01e2f892d1806350d991978385dcc8c5973471edc25d60c68ba6.jpeg ed3eb3e7f13f7dbed82834e7131652009852f0d96ef9893a379b2a58c97feb27.jpeg 423d84b00ea873bdc716abf5b478047b98d2dae2be1b9d9d0ffc48dfa1934d7d.jpeg 6dc2401bcf2eb3e59e8558ffeaf5e6589b703bb93d0d837f041fb281d093bec1.jpeg 663a647e9f2300ec14ba7a5983d774f78fce72ab86dec8ae871892c0191e10c6.jpeg 8eb671525d6dd2a73e31817b0dac51d7c5d3a4d64954831094107ac4a0083d1c.jpeg`),
  },
  {
    shipsFrom: "Украйна",
    supplierMinimum: 88.47,
    supplierUrl: "https://www.faire.com/product/p_6a9gn5ej3w",
    name: "Пъзел „Намери и покажи – Пингвини“ (100 части)",
    category: "Пъзели",
    material: "Картон",
    age: "6+",
    dim: "33 × 47 см (кутия 22 × 18 × 6 см)",
    emoji: "🐧",
    wholesaleEur: 6.54,
    msrpEur: 11.78,
    desc: `Двойно предизвикателство в една кутия: първо детето нарежда пъзела, а после търси скритите предмети в цветната, богата на детайли картина с пингвини. Играта развива концентрацията, наблюдателността и паметта, учи на търпение и внимание към детайла.

• 100 части, готов размер 33 × 47 см
• Изработен от здрав, екологичен картон — може да се нарежда много пъти
• Подходящ за самостоятелна игра или с цялото семейство
• За момичета и момчета от 6 години
• Произведен в Украйна`,
    images: H(`52b019a5ccca851f86a1499078dbdbed84bbfc609ddb56c0c10071f5bd43d60c.jpeg f0e7a705ac17278e0ad68e2d1963c455a73778061557296c948e4be53682324e.jpeg e3de4ca264b5a264b0aca358e5ca0c6ed5a0b372015f2637cc0611624b7fdd7e.jpeg 2d0e292faf5f4452676b14cf2925c6d9055bf814c15d4c944e7556e5e0bba961.jpeg 1ffb1f4e1d4595ea6885daa94135f02766e15d48a7bdc8ebc4a6d0e09fdaade9.jpeg 45a19c6a89cd775a3851ec4ebdefc757f944934363f1c1f7a16907f7ce4642da.jpeg f28b10cb421655b345bd8a64307671f55a7cc14915b9f63263f30bff504e21a9.jpeg`),
  },
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
      dim: p.dim, desc: p.desc, stock: 10, active: false, promo: false, supplierUrl: p.supplierUrl,
      shipsFrom: p.shipsFrom, supplierMinimum: p.supplierMinimum, rating: 4.8, reviews: 0, sortOrder: 0,
    },
  });
  console.log(`OK ${id} · ${p.msrpEur}€ (cost ${p.wholesaleEur}€) · ${urls.length} снимки`);
}
await prisma.$disconnect();
