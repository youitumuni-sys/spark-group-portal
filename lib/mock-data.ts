// ============================================================
// mock-data.ts — Static mock data for rendering without Prisma/DB
// Mirrors the shapes returned by Prisma queries in app/page.tsx & app/mypage/page.tsx
// ============================================================

const now = new Date();
const day = 24 * 60 * 60 * 1000;

function daysAgo(n: number) { return new Date(now.getTime() - n * day); }
function daysFromNow(n: number) { return new Date(now.getTime() + n * day); }
function todayAt(h: number, m = 0) {
  const d = new Date(); d.setHours(h, m, 0, 0); return d;
}

// ============================================================
// 1. Shops
// ============================================================

export const shops = [
  {
    id: 'clshop001',
    name: '大奥 梅田店',
    slug: 'ohoku-umeda',
    area: '梅田',
    genre: 'ホテヘル',
    address: '大阪府大阪市北区兎我野町11-20 新大同ビル2F',
    phone: '06-6367-6000',
    openTime: '9:00',
    closeTime: 'ラスト',
    description: '大阪梅田エリアの高級人妻専門店。上品な大人の女性が極上のおもてなしをお届けします。',
    images: ['https://img2.cityheaven.net/img/shop/k/ooku_ume/shps1650_2_20260228015109pc.jpeg?cache02=1&imgopt=y'],
    features: ['完全個室', 'VIPルーム完備', '駅チカ'],
    access: '泉の広場M-14番出口よりスグ',
    website: 'https://umeda.oh-oku.jp/top/',
    isActive: true,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(1),
  },
  {
    id: 'clshop002',
    name: '大奥 難波店',
    slug: 'ohoku-namba',
    area: '難波',
    genre: 'ホテヘル',
    address: '大阪府大阪市浪速区難波中1-11-8 サウスなんば302号',
    phone: '06-4397-0093',
    openTime: '9:00',
    closeTime: 'ラスト',
    description: '難波エリアの大奥ブランド。落ち着いた雰囲気の中で贅沢なひとときを。',
    images: ['https://img2.cityheaven.net/img/shop/k/ooku_nam/shps3108_2_20260105021350pc.jpeg?cache02=1&imgopt=y'],
    features: ['完全個室', '深夜営業'],
    access: '各線難波駅・6番出口徒歩1分・31番出口徒歩2分',
    website: 'https://nanba.oh-oku.jp/top/',
    isActive: true,
    createdAt: daysAgo(110),
    updatedAt: daysAgo(2),
  },
  {
    id: 'clshop003',
    name: 'ぷるるん小町 梅田店',
    slug: 'pururun-umeda',
    area: '梅田',
    genre: 'ホテヘル',
    address: '大阪府大阪市北区兎我野町11-20 新大同ビル2F',
    phone: '06-6366-7777',
    openTime: '10:00',
    closeTime: '翌5:00',
    description: '梅田エリアの人気店。可愛い女の子が多数在籍する話題のお店です。',
    images: ['https://img2.cityheaven.net/img/shop/k/pururun-komachi_umeda/shps1700000418_1_20260302003311pc.jpeg?cache02=1&imgopt=y'],
    features: ['深夜営業', 'イベント多数', '初回割引あり'],
    access: '各線「梅田駅」徒歩5分、泉の広場からTEL',
    website: 'https://umeda.pururun-komachi.com/',
    isActive: true,
    createdAt: daysAgo(100),
    updatedAt: daysAgo(1),
  },
  {
    id: 'clshop004',
    name: 'ぷるるん小町 京橋店',
    slug: 'pururun-kyobashi',
    area: '京橋',
    genre: 'ホテヘル',
    address: '大阪府大阪市都島区東野田町3-12-9 京橋プルトンビル804号室',
    phone: '06-6355-4944',
    openTime: '10:00',
    closeTime: 'ラスト',
    description: '京橋エリアのぷるるん小町。アットホームな雰囲気でお迎えします。',
    images: ['https://img2.cityheaven.net/img/shop/k/pururun-komachi_kyobashi/shps1700000845_1_20260301235006pc.jpeg?cache02=1&imgopt=y'],
    features: ['アットホーム', '初回割引あり'],
    access: 'JR京橋駅、京阪京橋駅最寄り',
    website: 'https://kyobashi.pururun-komachi.com/',
    isActive: true,
    createdAt: daysAgo(95),
    updatedAt: daysAgo(3),
  },
  {
    id: 'clshop005',
    name: 'スパーク 梅田店',
    slug: 'spark-umeda',
    area: '梅田',
    genre: 'ホテヘル',
    address: '大阪府大阪市北区兎我野町11-20 新大同ビル2F',
    phone: '06-6362-4000',
    openTime: '10:00',
    closeTime: '翌5:00',
    description: '完全リニューアル！最強素人集団を体感せよ。未経験の女の子が多数在籍。',
    images: ['https://img2.cityheaven.net/img/shop/k/spark_umeda/shps1199_1_20260228055308pc.jpeg?cache02=1&imgopt=y'],
    features: ['リニューアルOPEN', '素人専門', '新人多数'],
    access: '各線「梅田駅」徒歩5分、泉の広場からTEL',
    website: 'https://umeda.spark-spark.com/',
    isActive: true,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(1),
  },
  {
    id: 'clshop006',
    name: 'スパーク 日本橋店',
    slug: 'spark-nihonbashi',
    area: '日本橋',
    genre: 'ホテヘル',
    address: '大阪府大阪市中央区日本橋1-8-4 月光マンション201号',
    phone: '06-4708-1133',
    openTime: '10:00',
    closeTime: '翌3:00',
    description: '日本橋エリアのスパークブランド。フレッシュな出会いをお約束します。',
    images: ['https://img2.cityheaven.net/img/shop/k/spark_nihonbashi/shps1521_1_20260228023819pc.jpeg?cache02=1&imgopt=y'],
    features: ['素人専門', '駅チカ'],
    access: '地下鉄日本橋駅7番出口最寄り',
    website: 'https://nihonbashi.spark-spark.com/',
    isActive: true,
    createdAt: daysAgo(50),
    updatedAt: daysAgo(2),
  },
  {
    id: 'clshop007',
    name: 'ぷるるんマダム 難波店',
    slug: 'pururun-madam-namba',
    area: '難波',
    genre: 'ホテヘル',
    address: '大阪府大阪市浪速区難波中1-11-8 サウスなんば302号',
    phone: '06-6684-9066',
    openTime: '9:00',
    closeTime: 'ラスト',
    description: '難波エリアのぷるるんマダム。大人の色気と癒しをお届けします。',
    images: ['https://img2.cityheaven.net/img/shop/k/pururun-madamu_nanba/shps1710004547_2_20260301014553pc.jpeg?cache02=1&imgopt=y'],
    features: ['入会金無料', '予約受付9:30〜'],
    access: '各線難波駅・6番出口徒歩1分',
    website: 'https://nanba.pururun-komachi.com/',
    isActive: true,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    id: 'clshop008',
    name: 'ぷるるんマダム 十三店',
    slug: 'pururun-madam-juso',
    area: '十三',
    genre: 'ホテヘル',
    address: '大阪府大阪市淀川区十三東1-20-18 ネオハイツ新淀川506号室',
    phone: '06-6195-1006',
    openTime: '10:00',
    closeTime: '22:00',
    description: '十三エリアのぷるるんマダム。グランドオープン記念イベント開催中！',
    images: ['https://img2.cityheaven.net/img/shop/k/pururun-madamu_juso/shps1710056861_1_20260210151819pc.jpeg?cache02=1&imgopt=y'],
    features: ['グランドオープン', '入会金無料', 'ポイント5倍'],
    access: '十三駅より徒歩3分',
    website: 'https://juso.pururun-komachi.com/',
    isActive: true,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: 'clshop009',
    name: '大奥 日本橋店',
    slug: 'ohoku-nihonbashi',
    area: '日本橋',
    genre: 'ホテヘル',
    address: '大阪府大阪市中央区日本橋1-9-2 第2阪奈ビル1F',
    phone: '06-6214-0009',
    openTime: '8:00',
    closeTime: 'ラスト',
    description: '日本橋エリアの大奥ブランド。上品な大人の女性が極上のおもてなしをお届けします。',
    images: ['https://img2.cityheaven.net/img/shop/k/ooku_nihombashi/shps1710023220_1_20260225225421pc.jpeg?cache02=1&imgopt=y'],
    features: ['完全個室', '駅チカ'],
    access: '地下鉄日本橋駅7番出口最寄り',
    website: 'https://nipponbashi.oh-oku.jp/',
    isActive: true,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
  },
];

// ============================================================
// ヘブンキャスト一覧（各店舗の先頭5名 + 在籍数）
// ============================================================
type HeavenCast = { name: string; image: string; age?: number; bust?: number; waist?: number; hip?: number };
export const heavenCasts: Record<string, { total: number; casts: HeavenCast[] }> = {
  'clshop001': { total: 150, casts: [
    { name: 'れおな', age: 35, bust: 89, waist: 56, hip: 85, image: 'https://img2.cityheaven.net/img/girls/k/ooku_ume/grpb0041051909_0000000000pc.jpg?cache02=1771538860&imgopt=y' },
    { name: 'しおり', age: 36, bust: 89, waist: 57, hip: 87, image: 'https://img2.cityheaven.net/img/girls/k/ooku_ume/grpb0056484068_0000000000pc.jpg?cache02=1772406518&imgopt=y' },
    { name: 'るか', age: 28, bust: 91, waist: 56, hip: 85, image: 'https://img2.cityheaven.net/img/girls/k/ooku_ume/grpb0060554301_0000000000pc.jpg?cache02=1772367701&imgopt=y' },
    { name: 'しいな', age: 37, bust: 89, waist: 54, hip: 84, image: 'https://img2.cityheaven.net/img/girls/k/ooku_ume/grpb0060100053_0000000000pc.jpg?cache02=1772331103&imgopt=y' },
    { name: 'まいこ', age: 31, bust: 91, waist: 56, hip: 87, image: 'https://img2.cityheaven.net/img/girls/k/ooku_ume/grpb0050693704_0000000000pc.jpg?cache02=1772335907&imgopt=y' },
    { name: 'るい', age: 40, bust: 82, waist: 54, hip: 84, image: 'https://img2.cityheaven.net/img/girls/k/ooku_ume/grpb0051891189_0000000000pc.jpg?cache02=1772353067&imgopt=y' },
    { name: 'えりか', age: 34, bust: 85, waist: 55, hip: 83, image: 'https://img2.cityheaven.net/img/girls/k/ooku_ume/grpb0051525472_0000000000pc.jpg?cache02=1772413847&imgopt=y' },
    { name: 'ことの', age: 34, bust: 86, waist: 55, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/ooku_ume/grpb0058354038_0000000000pc.jpg?cache02=1772301889&imgopt=y' },
  ]},
  'clshop002': { total: 94, casts: [
    { name: '五十嵐 らめ', age: 35, bust: 83, waist: 57, hip: 82, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nam/grpb0023295379_0000000000pc.jpg?cache02=1772384169&imgopt=y' },
    { name: '櫻 えれん', age: 35, bust: 127, waist: 61, hip: 96, image: 'https://img2.cityheaven.net/img/icon/exist_limit_profile_2.png?cache02=1539328868&imgopt=y' },
    { name: '神崎 みお', age: 38, bust: 83, waist: 57, hip: 82, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nam/grpb0052322810_0000000000pc.jpg?cache02=1769876511&imgopt=y' },
    { name: '本橋 りえ', age: 34, bust: 83, waist: 56, hip: 85, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nam/grpb0052299290_0000000000pc.jpg?cache02=1761931255&imgopt=y' },
    { name: '村雨 りょうこ', age: 36, bust: 87, waist: 56, hip: 88, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nam/grpb0061091731_0000000000pc.jpg?cache02=1755307055&imgopt=y' },
    { name: '源 しずか', age: 38, bust: 86, waist: 58, hip: 87, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nam/grpb0052244865_0000000000pc.jpg?cache02=1763351163&imgopt=y' },
    { name: '浜崎 れみ', age: 38, bust: 85, waist: 58, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nam/grpb0056747887_0000000000pc.jpg?cache02=1748226820&imgopt=y' },
    { name: '黒木 なつみ', age: 38, bust: 85, waist: 58, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nam/grpb0052726976_0000000000pc.jpg?cache02=1763600103&imgopt=y' },
  ]},
  'clshop003': { total: 100, casts: [
    { name: 'みわ', age: 34, bust: 100, waist: 64, hip: 98, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grpb0013433272_0000000000pc.jpg?cache02=1772375270&imgopt=y' },
    { name: 'ゆい', age: 25, bust: 89, waist: 59, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grpb0053522431_0000000000pc.jpg?cache02=1772274436&imgopt=y' },
    { name: 'あんり', age: 31, bust: 90, waist: 61, hip: 90, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grpb0043778650_0000000000pc.jpg?cache02=1772338400&imgopt=y' },
    { name: 'えれん', age: 30, bust: 86, waist: 55, hip: 84, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grpb0061263177_0000000000pc.jpg?cache02=1770033539&imgopt=y' },
    { name: 'まいこ', age: 24, bust: 88, waist: 61, hip: 89, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grpb0060792823_0000000000pc.jpg?cache02=1770033568&imgopt=y' },
    { name: 'なのか', age: 21, bust: 92, waist: 60, hip: 88, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grpb0025938187_0000000000pc.jpg?cache02=1772410842&imgopt=y' },
    { name: 'ふう', age: 28, bust: 89, waist: 61, hip: 90, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grpb0039632385_0000000000pc.jpg?cache02=1772353129&imgopt=y' },
    { name: 'さよ', age: 26, bust: 103, waist: 59, hip: 90, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grpb0059166137_0000000000pc.jpg?cache02=1771591564&imgopt=y' },
  ]},
  'clshop004': { total: 71, casts: [
    { name: 'あおい', age: 27, bust: 86, waist: 56, hip: 87, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grpb0060410381_0000000000pc.jpg?cache02=1772188841&imgopt=y' },
    { name: 'みゆ', age: 22, bust: 81, waist: 54, hip: 82, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grpb0062049514_0000000000pc.jpg?cache02=1772189012&imgopt=y' },
    { name: 'じゅん', age: 20, bust: 93, waist: 59, hip: 85, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grpb0054706768_0000000000pc.jpg?cache02=1769875604&imgopt=y' },
    { name: 'れいな', age: 29, bust: 85, waist: 57, hip: 87, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grpb0061071024_0000000000pc.jpg?cache02=1771737823&imgopt=y' },
    { name: 'ゆうき', age: 24, bust: 93, waist: 60, hip: 90, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grpb0064384385_0000000000pc.jpg?cache02=1772288068&imgopt=y' },
    { name: 'ひよこ', age: 35, bust: 86, waist: 58, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grpb0025404356_0000000000pc.jpg?cache02=1764496793&imgopt=y' },
    { name: 'こより', age: 30, bust: 87, waist: 59, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grpb0056857323_0000000000pc.jpg?cache02=1772009816&imgopt=y' },
    { name: 'さな', age: 27, bust: 98, waist: 62, hip: 90, image: 'https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grpb0051543919_0000000000pc.jpg?cache02=1771210305&imgopt=y' },
  ]},
  'clshop005': { total: 78, casts: [
    { name: 'せりな', age: 23, bust: 88, waist: 54, hip: 85, image: 'https://img2.cityheaven.net/img/girls/k/spark_umeda/grpb0062286386_0000000000pc.jpg?cache02=1772314294&imgopt=y' },
    { name: 'くらら', age: 22, bust: 83, waist: 53, hip: 82, image: 'https://img2.cityheaven.net/img/girls/k/spark_umeda/grpb0059767587_0000000000pc.jpg?cache02=1764579710&imgopt=y' },
    { name: 'ゆのん', age: 22, bust: 86, waist: 55, hip: 84, image: 'https://img2.cityheaven.net/img/girls/k/spark_umeda/grpb0063189206_0000000000pc.jpg?cache02=1772308849&imgopt=y' },
    { name: 'ありす', age: 22, bust: 85, waist: 55, hip: 86, image: 'https://img2.cityheaven.net/img/icon/exist_limit_profile_2.png?cache02=1539328868&imgopt=y' },
    { name: 'ひめ', age: 18, bust: 83, waist: 55, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/spark_umeda/grpb0060830713_0000000000pc.jpg?cache02=1772314318&imgopt=y' },
    { name: 'かな', age: 22, bust: 83, waist: 54, hip: 83, image: 'https://img2.cityheaven.net/img/girls/k/spark_umeda/grpb0059061000_0000000000pc.jpg?cache02=1766694314&imgopt=y' },
    { name: 'ちか', age: 24, bust: 89, waist: 54, hip: 80, image: 'https://img2.cityheaven.net/img/girls/k/spark_umeda/grpb0053637690_0000000000pc.jpg?cache02=1766693716&imgopt=y' },
    { name: 'はな', age: 22, bust: 85, waist: 54, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/spark_umeda/grpb0050451267_0000000000pc.jpg?cache02=1761931098&imgopt=y' },
  ]},
  'clshop006': { total: 102, casts: [
    { name: 'ひめ', age: 22, bust: 87, waist: 54, hip: 84, image: 'https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grpb0064809575_0000000000pc.jpg?cache02=1772347770&imgopt=y' },
    { name: 'びび', age: 22, bust: 91, waist: 54, hip: 84, image: 'https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grpb0064792284_0000000000pc.jpg?cache02=1772270695&imgopt=y' },
    { name: 'れいな', age: 22, bust: 81, waist: 54, hip: 83, image: 'https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grpb0064748945_0000000000pc.jpg?cache02=1772087426&imgopt=y' },
    { name: 'みゅう', age: 23, bust: 91, waist: 55, hip: 84, image: 'https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grpb0036379387_0000000000pc.jpg?cache02=1772352708&imgopt=y' },
    { name: 'はるな', age: 18, bust: 82, waist: 54, hip: 81, image: 'https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grpb0060080337_0000000000pc.jpg?cache02=1772214284&imgopt=y' },
    { name: 'ゆめか', age: 18, bust: 83, waist: 54, hip: 83, image: 'https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grpb0052410908_0000000000pc.jpg?cache02=1772335973&imgopt=y' },
    { name: 'りあ', age: 21, bust: 90, waist: 54, hip: 84, image: 'https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grpb0057158443_0000000000pc.jpg?cache02=1772360504&imgopt=y' },
    { name: 'らみぃ', age: 18, bust: 85, waist: 56, hip: 83, image: 'https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grpb0060052247_0000000000pc.jpg?cache02=1772101113&imgopt=y' },
  ]},
  'clshop007': { total: 87, casts: [
    { name: 'るい', age: 40, bust: 90, waist: 59, hip: 92, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0048491427_0000000000pc.jpg?cache02=1772415051&imgopt=y' },
    { name: 'ゆめか', age: 45, bust: 80, waist: 57, hip: 80, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0043731061_0000000000pc.jpg?cache02=1772301804&imgopt=y' },
    { name: 'じゅんな', age: 40, bust: 94, waist: 59, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0051372518_0000000000pc.jpg?cache02=1772301820&imgopt=y' },
    { name: 'ほなみ', age: 41, bust: 89, waist: 59, hip: 92, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0055261904_0000000000pc.jpg?cache02=1767783136&imgopt=y' },
    { name: 'みなみ', age: 28, bust: 85, waist: 56, hip: 93, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0060510964_0000000000pc.jpg?cache02=1769876435&imgopt=y' },
    { name: 'きみえ', age: 43, bust: 112, waist: 62, hip: 99, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0053239376_0000000000pc.jpg?cache02=1752553637&imgopt=y' },
    { name: 'あん', age: 42, bust: 85, waist: 59, hip: 90, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0052290165_0000000000pc.jpg?cache02=1768611842&imgopt=y' },
    { name: 'きょうか', age: 40, bust: 88, waist: 59, hip: 89, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0053654391_0000000000pc.jpg?cache02=1737015903&imgopt=y' },
  ]},
  'clshop008': { total: 19, casts: [
    { name: 'まりあ', age: 44, bust: 86, waist: 58, hip: 88, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0064450733_0000000000pc.jpg?cache02=1772414847&imgopt=y' },
    { name: 'せな', age: 37, bust: 90, waist: 60, hip: 88, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0064693971_0000000000pc.jpg?cache02=1772414859&imgopt=y' },
    { name: 'りりか', age: 24, bust: 89, waist: 60, hip: 87, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0064753533_0000000000pc.jpg?cache02=1772412885&imgopt=y' },
    { name: 'ひなの', age: 29, bust: 84, waist: 59, hip: 83, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0064720552_0000000000pc.jpg?cache02=1772412902&imgopt=y' },
    { name: 'くみ', age: 41, bust: 94, waist: 62, hip: 90, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0064670398_0000000000pc.jpg?cache02=1772412917&imgopt=y' },
    { name: 'きょうか', age: 33, bust: 98, waist: 63, hip: 92, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0064468296_0000000000pc.jpg?cache02=1772414910&imgopt=y' },
    { name: 'ともえ', age: 45, bust: 110, waist: 65, hip: 103, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0064722680_0000000000pc.jpg?cache02=1772414919&imgopt=y' },
    { name: 'そら', age: 27, bust: 105, waist: 63, hip: 101, image: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0064508790_0000000000pc.jpg?cache02=1772412948&imgopt=y' },
  ]},
  'clshop009': { total: 80, casts: [
    { name: '雪平 なぎさ', age: 37, bust: 96, waist: 58, hip: 87, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0060051861_0000000000pc.jpg?cache02=1770198074&imgopt=y' },
    { name: '神木 ゆい', age: 31, bust: 81, waist: 55, hip: 83, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0060583111_0000000000pc.jpg?cache02=1770199335&imgopt=y' },
    { name: '月島 みゆ', age: 32, bust: 85, waist: 56, hip: 86, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0058602433_0000000000pc.jpg?cache02=1770199449&imgopt=y' },
    { name: '双葉 なち', age: 36, bust: 83, waist: 58, hip: 88, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0061782316_0000000000pc.jpg?cache02=1770199571&imgopt=y' },
    { name: '美咲 ほのか', age: 33, bust: 90, waist: 56, hip: 87, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0062245488_0000000000pc.jpg?cache02=1770199772&imgopt=y' },
    { name: '藍沢 ひびき', age: 34, bust: 92, waist: 57, hip: 85, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0062287176_0000000000pc.jpg?cache02=1768113791&imgopt=y' },
    { name: '滝沢 じゅん', age: 40, bust: 82, waist: 56, hip: 83, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0061942341_0000000000pc.jpg?cache02=1770199873&imgopt=y' },
    { name: '日高 あかり', age: 32, bust: 81, waist: 56, hip: 84, image: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0060311444_0000000000pc.jpg?cache02=1755764889&imgopt=y' },
  ]},
};

// ============================================================
// CityHeaven口コミ（heaven-data.json から自動読み込み）
// npm run scrape で更新
// ============================================================
import heavenData from './heaven-data.json';
import shopImageData from './shop-images.json';

// 店舗画像URLをスクレイピング結果で上書き（CityHeavenがURLを定期変更するため）
const _shopImages = shopImageData as Record<string, string>;
for (const shop of shops) {
  if (_shopImages[shop.id]) {
    shop.images = [_shopImages[shop.id]];
  }
}

type HeavenReview = { score: string; title: string; date: string; comment?: string };
type HeavenShopData = { reviews: { totalCount: number; reviews: HeavenReview[] }; casts: { total: number; casts: HeavenCast[] }; diaries: unknown[] };
const hd = heavenData as Record<string, HeavenShopData>;

export const heavenReviews: Record<string, { totalCount: number; reviews: HeavenReview[] }> =
  Object.fromEntries(Object.entries(hd).map(([k, v]) => [k, v.reviews]));

// CityHeaven店舗URL（口コミ「もっと見る」リンク用）
export const heavenUrls: Record<string, string> = {
  clshop001: 'https://www.cityheaven.net/osaka/A2701/A270101/ooku_ume/',
  clshop002: 'https://www.cityheaven.net/osaka/A2702/A270201/ooku_nam/',
  clshop003: 'https://www.cityheaven.net/osaka/A2701/A270101/pururun-komachi_umeda/',
  clshop004: 'https://www.cityheaven.net/osaka/A2701/A270105/pururun-komachi_kyobashi/',
  clshop005: 'https://www.cityheaven.net/osaka/A2701/A270101/spark_umeda/',
  clshop006: 'https://www.cityheaven.net/osaka/A2701/A270104/spark_nihonbashi/',
  clshop007: 'https://www.cityheaven.net/osaka/A2702/A270201/pururun-madamu_nanba/',
  clshop008: 'https://www.cityheaven.net/osaka/A2701/A270103/pururun-madamu_juso/',
  clshop009: 'https://www.cityheaven.net/osaka/A2702/A270202/ooku_nihombashi/',
};

// Helper to look up a shop by id
const shopById = (id: string) => shops.find((s) => s.id === id)!;

// ============================================================
// 2. Staff (14 members across 6 shops)
// ============================================================

export const staff = [
  // -- 大奥 梅田 (clshop001) --
  { id: 'clstaff001', shopId: 'clshop001', name: 'れおな', age: 35, height: 163, bust: 86, waist: 57, hip: 85, bloodType: 'A', hobby: 'ヨガ', profile: 'れおなです。癒しの空間をお届けします。よろしくお願いします。', images: ['https://umeda.oh-oku.jp/system/cache/cast/592/180_270_592_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(10), updatedAt: daysAgo(1), shop: shopById('clshop001') },
  { id: 'clstaff002', shopId: 'clshop001', name: 'しおり', age: 36, height: 158, bust: 84, waist: 56, hip: 84, bloodType: 'O', hobby: '読書', profile: 'しおりと申します。穏やかなひとときを一緒に過ごしましょう。', images: ['https://umeda.oh-oku.jp/system/cache/cast/1037/180_270_1037_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(8), updatedAt: daysAgo(1), shop: shopById('clshop001') },
  { id: 'clstaff003', shopId: 'clshop001', name: 'のどか', age: 31, height: 160, bust: 88, waist: 58, hip: 86, bloodType: 'B', hobby: 'カフェ巡り', profile: 'のどかです。笑顔には自信あります！', images: ['https://umeda.oh-oku.jp/system/cache/cast/1098/180_270_1098_1.jpg'], scheduleNote: null, isNew: false, isActive: true, createdAt: daysAgo(60), updatedAt: daysAgo(3), shop: shopById('clshop001') },
  // -- 大奥 難波 (clshop002) --
  { id: 'clstaff004', shopId: 'clshop002', name: 'さえ', age: 31, height: 164, bust: 85, waist: 56, hip: 84, bloodType: 'O', hobby: '映画鑑賞', profile: 'さえです。大人の癒しをお届けします。', images: ['https://umeda.oh-oku.jp/system/cache/cast/1185/180_270_1185_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(7), updatedAt: daysAgo(1), shop: shopById('clshop002') },
  { id: 'clstaff005', shopId: 'clshop002', name: 'ゆう', age: 32, height: 157, bust: 88, waist: 59, hip: 87, bloodType: 'A', hobby: '料理', profile: 'ゆうです。おっとりしてますが情熱的です。', images: ['https://umeda.oh-oku.jp/system/cache/cast/1183/180_270_1183_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(6), updatedAt: daysAgo(1), shop: shopById('clshop002') },
  // -- ぷるるん小町 梅田 (clshop003) --
  { id: 'clstaff006', shopId: 'clshop003', name: 'みわ', age: 24, height: 158, bust: 86, waist: 57, hip: 85, bloodType: 'A', hobby: 'ネイル', profile: 'みわです♪ ぷるるんの看板娘を目指してます！', images: ['https://umeda.pururun-komachi.com/upload/pc/cast/192_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(12), updatedAt: daysAgo(1), shop: shopById('clshop003') },
  { id: 'clstaff007', shopId: 'clshop003', name: 'あんり', age: 25, height: 162, bust: 84, waist: 55, hip: 83, bloodType: 'O', hobby: 'ダンス', profile: 'あんりです。元気いっぱいで会いに来てね！', images: ['https://umeda.pururun-komachi.com/upload/pc/cast/198_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(11), updatedAt: daysAgo(2), shop: shopById('clshop003') },
  { id: 'clstaff008', shopId: 'clshop003', name: 'えれん', age: 25, height: 160, bust: 85, waist: 56, hip: 84, bloodType: 'B', hobby: 'スキンケア', profile: 'えれんです。お肌ツルツルですよ♪', images: ['https://umeda.pururun-komachi.com/upload/pc/cast/1142_1.jpg'], scheduleNote: null, isNew: false, isActive: true, createdAt: daysAgo(50), updatedAt: daysAgo(2), shop: shopById('clshop003') },
  // -- ぷるるん小町 京橋 (clshop004) --
  { id: 'clstaff009', shopId: 'clshop004', name: 'さほ', age: 25, height: 160, bust: 85, waist: 56, hip: 84, bloodType: 'O', hobby: 'アニメ', profile: 'さほだよ！一緒に楽しい時間を過ごそうね。', images: ['https://umeda.pururun-komachi.com/upload/pc/cast/852_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(9), updatedAt: daysAgo(1), shop: shopById('clshop004') },
  { id: 'clstaff010', shopId: 'clshop004', name: 'かすみ', age: 24, height: 158, bust: 83, waist: 54, hip: 82, bloodType: 'AB', hobby: '写真', profile: 'かすみです。ミステリアスって言われます。', images: ['https://umeda.pururun-komachi.com/upload/pc/cast/1510_1.jpg'], scheduleNote: null, isNew: false, isActive: true, createdAt: daysAgo(45), updatedAt: daysAgo(3), shop: shopById('clshop004') },
  // -- スパーク 梅田 (clshop005) --
  { id: 'clstaff011', shopId: 'clshop005', name: 'ゆのん', age: 22, height: 160, bust: 84, waist: 56, hip: 83, bloodType: 'A', hobby: 'カラオケ', profile: 'ゆのんです！未経験だけど頑張ります♪', images: ['https://umeda.spark-spark.com/upload/sp/cast/1192_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(5), updatedAt: daysAgo(1), shop: shopById('clshop005') },
  { id: 'clstaff012', shopId: 'clshop005', name: 'くらら', age: 21, height: 158, bust: 83, waist: 55, hip: 82, bloodType: 'O', hobby: 'ショッピング', profile: 'くららだよ〜。天然って言われるけど、ちゃんとしてるよ！', images: ['https://umeda.spark-spark.com/upload/sp/cast/916_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(4), updatedAt: daysAgo(1), shop: shopById('clshop005') },
  // -- スパーク 日本橋 (clshop006) --
  { id: 'clstaff013', shopId: 'clshop006', name: 'ましろ', age: 20, height: 156, bust: 82, waist: 53, hip: 81, bloodType: 'O', hobby: 'ゲーム', profile: 'ましろです。ゲーム好きな方、話しましょ！', images: ['https://umeda.spark-spark.com/upload/sp/cast/1178_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(3), updatedAt: daysAgo(1), shop: shopById('clshop006') },
  { id: 'clstaff014', shopId: 'clshop006', name: 'あやね', age: 21, height: 160, bust: 83, waist: 54, hip: 82, bloodType: 'A', hobby: 'ピアノ', profile: 'あやねです。おっとり系ですがよろしくね。', images: ['https://umeda.spark-spark.com/upload/sp/cast/1183_1.jpg'], scheduleNote: null, isNew: true, isActive: true, createdAt: daysAgo(3), updatedAt: daysAgo(1), shop: shopById('clshop006') },
];

// Helper to look up staff by id
const staffById = (id: string) => staff.find((s) => s.id === id)!;

// ============================================================
// 3. Diaries — CityHeaven写メ日記 (12 entries)
// ============================================================

export const diaries = [
  {
    id: 'cldiary001', staffId: '', title: '昨日のお礼とタイプな男性🫢', content: '', images: ['https://img2.cityheaven.net/img/girls/k/ooku_ume/grdr0064557436_0782829090pc.jpg?cache02=1772099744&imgopt=y'], videoUrl: null, viewCount: 187, likeCount: 24, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'せいか', shopName: '大奥 梅田店', shopId: 'clshop001', time: '2/27 22:30',
  },
  {
    id: 'cldiary002', staffId: '', title: 'ありがとうございました', content: '', images: ['https://img2.cityheaven.net/img/girls/k/ooku_ume/grdr0030445366_0783152931pc.jpg?cache02=1772198828&imgopt=y'], videoUrl: null, viewCount: 142, likeCount: 18, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'つばき', shopName: '大奥 梅田店', shopId: 'clshop001', time: '2/27 22:27',
  },
  {
    id: 'cldiary003', staffId: '', title: '昨日は村田沙耶香さん『コンビニ人間』を📕', content: '', images: ['https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grdr0061263177_0783156621pc.jpg?cache02=1772199340&imgopt=y'], videoUrl: null, viewCount: 210, likeCount: 31, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'えれん', shopName: 'ぷるるん小町 梅田店', shopId: 'clshop003', time: '2/27 22:35',
  },
  {
    id: 'cldiary004', staffId: '', title: '明日はイベント日！', content: '', images: ['https://img2.cityheaven.net/img/girls/k/pururun-komachi_umeda/grdr0063550201_0783157009pc.jpg?cache02=1772199134&imgopt=y'], videoUrl: null, viewCount: 95, likeCount: 12, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'こよみ', shopName: 'ぷるるん小町 梅田店', shopId: 'clshop003', time: '2/27 22:32',
  },
  {
    id: 'cldiary005', staffId: '', title: '★最強イベント★', content: '', images: ['https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grdr0063700506_0783156039pc.jpg?cache02=1772199027&imgopt=y'], videoUrl: null, viewCount: 128, likeCount: 16, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'ももか', shopName: 'ぷるるん小町 京橋店', shopId: 'clshop004', time: '2/27 22:30',
  },
  {
    id: 'cldiary006', staffId: '', title: '⋆͛📢明日はお得なぷるるんの日🈳❤️', content: '', images: ['https://img2.cityheaven.net/img/girls/k/pururun-komachi_kyobashi/grdr0031876174_0783104487pc.jpg?cache02=1772181444&imgopt=y'], videoUrl: null, viewCount: 163, likeCount: 22, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'らお', shopName: 'ぷるるん小町 京橋店', shopId: 'clshop004', time: '2/27 22:15',
  },
  {
    id: 'cldiary007', staffId: '', title: '必須🩷🩷🩷【お礼写メ日記】', content: '', images: ['https://img2.cityheaven.net/img/girls/k/spark_umeda/grdr0060830713_0783133650pc.jpg?cache02=1772191116&imgopt=y'], videoUrl: null, viewCount: 245, likeCount: 38, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'ひめ', shopName: 'スパーク 梅田店', shopId: 'clshop005', time: '2/27 20:18',
  },
  {
    id: 'cldiary008', staffId: '', title: 'こっち来て？❤️', content: '', images: ['https://img2.cityheaven.net/img/girls/k/spark_umeda/grdr0063189206_0783123862pc.jpg?cache02=1772188626&imgopt=y'], videoUrl: null, viewCount: 198, likeCount: 29, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'ゆのん', shopName: 'スパーク 梅田店', shopId: 'clshop005', time: '2/27 19:45',
  },
  {
    id: 'cldiary009', staffId: '', title: '自己紹介🫶', content: '', images: ['https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grdr0064778685_0783147647pc.jpg?cache02=1772196152&imgopt=y'], videoUrl: null, viewCount: 76, likeCount: 8, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'あんな', shopName: 'スパーク 日本橋店', shopId: 'clshop006', time: '2/27 21:42',
  },
  {
    id: 'cldiary010', staffId: '', title: '本指名様ありがとう💕', content: '', images: ['https://img2.cityheaven.net/img/girls/k/spark_nihonbashi/grdr0064748945_0783145906pc.jpg?cache02=1772195992&imgopt=y'], videoUrl: null, viewCount: 112, likeCount: 15, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'れいな', shopName: 'スパーク 日本橋店', shopId: 'clshop006', time: '2/27 21:39',
  },
  {
    id: 'cldiary011', staffId: '', title: '‪(*ᴗ͈ˬᴗ͈)ꕤ*.ﾟ', content: '', images: ['https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grdr0048491427_0783150425pc.jpg?cache02=1772197931&imgopt=y'], videoUrl: null, viewCount: 89, likeCount: 11, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'るい', shopName: 'ぷるるんマダム 難波店', shopId: 'clshop007', time: '2/27 22:12',
  },
  {
    id: 'cldiary012', staffId: '', title: 'このお店に決めた理由♡', content: '', images: ['https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grdr0064450733_0783147511pc.jpg?cache02=1772195742&imgopt=y'], videoUrl: null, viewCount: 134, likeCount: 19, isPublished: true, createdAt: daysAgo(0), updatedAt: daysAgo(0),
    castName: 'まりあ', shopName: 'ぷるるんマダム 十三店', shopId: 'clshop008', time: '2/27 22:03',
  },
];

// ============================================================
// 4. Events (4 active)
// ============================================================

export const events = [
  // 大奥 梅田
  {
    id: 'clevent001', shopId: 'clshop001', title: '期間限定イベント！！', description: 'オールタイム終日開催の期間限定割引イベント。全コースでお得に遊べます！', image: 'https://img2.cityheaven.net/img/shop/k/ooku_ume/shps1650_2_20260228015109pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(5), endDate: daysFromNow(25), isActive: true, createdAt: daysAgo(5),
    shop: shopById('clshop001'),
  },
  // 大奥 難波
  {
    id: 'clevent002', shopId: 'clshop002', title: '【新規割】大奥を初めての方はこの価格で！！', description: '初回限定で全コース4,000円OFF。60分11,000円・75分13,500円〜。スタッフへ「新規割」とお伝えください。', image: 'https://img2.cityheaven.net/img/shop/k/ooku_nam/shps3108_2_20260105021350pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(30), endDate: daysFromNow(30), isActive: true, createdAt: daysAgo(30),
    shop: shopById('clshop002'),
  },
  // ぷるるん小町 梅田
  {
    id: 'clevent003', shopId: 'clshop003', title: '月間イベント開催中です！！', description: 'イベントコース：75分通常12,000円→8,980円、100分通常14,000円→13,000円。入会金・パネル指名料込み。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-komachi_umeda/shps1700000418_1_20260301072810pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(1), endDate: daysFromNow(29), isActive: true, createdAt: daysAgo(1),
    shop: shopById('clshop003'),
  },
  // ぷるるん小町 京橋
  {
    id: 'clevent004', shopId: 'clshop004', title: '🔰ご新規様限定割引', description: '60分5,980円〜の超特価！初回来店のお客様限定。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-komachi_kyobashi/shps1700000845_1_20260301004551pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(30), endDate: daysFromNow(30), isActive: true, createdAt: daysAgo(30),
    shop: shopById('clshop004'),
  },
  {
    id: 'clevent005', shopId: 'clshop004', title: '🌸オールタイムイベント', description: '75分8,980円〜。時間帯を問わずいつでも利用可能な常設割引。ぷるトン祭（2の付く日）も併催中。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-komachi_kyobashi/shps1700000845_1_20260301004551pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(10), endDate: daysFromNow(20), isActive: true, createdAt: daysAgo(10),
    shop: shopById('clshop004'),
  },
  // スパーク 日本橋
  {
    id: 'clevent006', shopId: 'clshop006', title: '♥ 新規割 FIRST TIME DISCOUNT 最大7,000円OFF', description: '初回利用者限定。60分10,000円（通常16,000円）。クレジットカード決済対応。', image: 'https://img2.cityheaven.net/img/shop/k/spark_nihonbashi/shps1521_1_20260228023819pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(30), endDate: daysFromNow(30), isActive: true, createdAt: daysAgo(30),
    shop: shopById('clshop006'),
  },
  // ぷるるんマダム 難波
  {
    id: 'clevent007', shopId: 'clshop007', title: "3月イベント『春マン開』75分8,500円", description: '難波店限定の月間超特価イベント。通常より3,000円以上割引。全女性が選び放題。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-madamu_nanba/shps1710004547_2_20260301014553pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(1), endDate: daysFromNow(30), isActive: true, createdAt: daysAgo(1),
    shop: shopById('clshop007'),
  },
  {
    id: 'clevent008', shopId: 'clshop007', title: 'オプション無料で使い放題♪', description: '全オプション（電マ・バイブ・即尺・顔射等）が無料で利用可能な常設特典。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-madamu_nanba/shps1710004547_2_20260301014553pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(30), endDate: daysFromNow(60), isActive: true, createdAt: daysAgo(30),
    shop: shopById('clshop007'),
  },
  // ぷるるんマダム 十三
  {
    id: 'clevent009', shopId: 'clshop008', title: '🎉グランドオープン記念イベント', description: 'オープン記念の大特価！次回使えるクーポン配布中。地域最安値でのご案内。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-madamu_juso/shps1710056861_1_20260210151819pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(20), endDate: daysFromNow(10), isActive: true, createdAt: daysAgo(20),
    shop: shopById('clshop008'),
  },
  // 大奥 日本橋
  {
    id: 'clevent010', shopId: 'clshop009', title: '日本橋店限定【朝割】開催中！', description: '早朝8:00〜9:59受付限定の特別割引。「初回予約半額DAY」も限定開催中。', image: 'https://img2.cityheaven.net/img/shop/k/ooku_nihombashi/shps1710023220_1_20260225225421pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(10), endDate: daysFromNow(20), isActive: true, createdAt: daysAgo(10),
    shop: shopById('clshop009'),
  },
  {
    id: 'clevent011', shopId: 'clshop009', title: '5が付く日限定 -【大還元祭】-', description: '大奥梅田・難波・日本橋の全店舗で毎月5・15・25日に開催する3店合同イベント。', image: 'https://img2.cityheaven.net/img/shop/k/ooku_nihombashi/shps1710023220_1_20260225225421pc.jpeg?cache02=1&imgopt=y', startDate: daysAgo(1), endDate: daysFromNow(30), isActive: true, createdAt: daysAgo(1),
    shop: shopById('clshop009'),
  },
];

// ============================================================
// 5. User (1 demo user)
// ============================================================

export const user = {
  id: 'cluser001',
  email: 'demo@example.com',
  passwordHash: null,
  nickname: 'タカシ',
  image: null,
  emailVerified: null,
  points: 8500,
  role: 'USER' as const,
  createdAt: daysAgo(90),
  updatedAt: daysAgo(1),
};

// ============================================================
// 6. Reviews (6 reviews)
// ============================================================

export const reviews = [
  {
    id: 'clreview001', userId: 'cluser001', staffId: 'clstaff001', shopId: 'clshop001', rating: 5, comment: '初めて利用しましたが、とても丁寧な対応で大満足でした。れおなさんの笑顔に癒されました。', isPublished: true, createdAt: daysAgo(3),
    user: { id: 'cluser001', nickname: 'タカシ', image: null },
    staff: staffById('clstaff001'),
    shop: shopById('clshop001'),
  },
  {
    id: 'clreview002', userId: 'cluser001', staffId: 'clstaff006', shopId: 'clshop003', rating: 5, comment: '雰囲気がとても良く、リラックスできました。みわさんも優しくて安心。', isPublished: true, createdAt: daysAgo(7),
    user: { id: 'cluser001', nickname: 'タカシ', image: null },
    staff: staffById('clstaff006'),
    shop: shopById('clshop003'),
  },
  {
    id: 'clreview003', userId: 'cluser001', staffId: 'clstaff011', shopId: 'clshop005', rating: 4, comment: '清潔感があり、サービスも充実。友人にも勧めたいです。', isPublished: true, createdAt: daysAgo(14),
    user: { id: 'cluser001', nickname: 'タカシ', image: null },
    staff: staffById('clstaff011'),
    shop: shopById('clshop005'),
  },
  {
    id: 'clreview004', userId: 'cluser001', staffId: 'clstaff004', shopId: 'clshop002', rating: 4, comment: 'コスパが良い。さえさんの接客が素晴らしく、次回は指名で利用したいです。', isPublished: true, createdAt: daysAgo(21),
    user: { id: 'cluser001', nickname: 'タカシ', image: null },
    staff: staffById('clstaff004'),
    shop: shopById('clshop002'),
  },
  {
    id: 'clreview005', userId: 'cluser001', staffId: 'clstaff009', shopId: 'clshop004', rating: 5, comment: '期待以上の対応でした。さほさんの笑顔が印象的で楽しい時間でした。', isPublished: true, createdAt: daysAgo(28),
    user: { id: 'cluser001', nickname: 'タカシ', image: null },
    staff: staffById('clstaff009'),
    shop: shopById('clshop004'),
  },
  {
    id: 'clreview006', userId: 'cluser001', staffId: 'clstaff013', shopId: 'clshop006', rating: 3, comment: '全体的に満足。待ち時間がもう少し短いと嬉しいですが、ましろさんは良かったです。', isPublished: true, createdAt: daysAgo(30),
    user: { id: 'cluser001', nickname: 'タカシ', image: null },
    staff: staffById('clstaff013'),
    shop: shopById('clshop006'),
  },
];

// ============================================================
// 7. Favorites (4 entries)
// ============================================================

export const favorites = [
  { id: 'clfav001', userId: 'cluser001', staffId: 'clstaff001', createdAt: daysAgo(5), staff: { ...staffById('clstaff001'), shop: shopById('clshop001') } },
  { id: 'clfav002', userId: 'cluser001', staffId: 'clstaff006', createdAt: daysAgo(10), staff: { ...staffById('clstaff006'), shop: shopById('clshop003') } },
  { id: 'clfav003', userId: 'cluser001', staffId: 'clstaff011', createdAt: daysAgo(15), staff: { ...staffById('clstaff011'), shop: shopById('clshop005') } },
  { id: 'clfav004', userId: 'cluser001', staffId: 'clstaff003', createdAt: daysAgo(20), staff: { ...staffById('clstaff003'), shop: shopById('clshop001') } },
];

// ============================================================
// 8. Reservations (5 entries — mixed statuses)
// ============================================================

export const reservations = [
  {
    id: 'clres001', userId: 'cluser001', staffId: 'clstaff006', shopId: 'clshop003',
    dateTime: daysFromNow(2), duration: 90, status: 'CONFIRMED' as const, note: null,
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
    staff: staffById('clstaff006'), shop: shopById('clshop003'),
  },
  {
    id: 'clres002', userId: 'cluser001', staffId: 'clstaff001', shopId: 'clshop001',
    dateTime: daysAgo(3), duration: 60, status: 'COMPLETED' as const, note: null,
    createdAt: daysAgo(5), updatedAt: daysAgo(3),
    staff: staffById('clstaff001'), shop: shopById('clshop001'),
  },
  {
    id: 'clres003', userId: 'cluser001', staffId: 'clstaff011', shopId: 'clshop005',
    dateTime: daysAgo(7), duration: 60, status: 'COMPLETED' as const, note: null,
    createdAt: daysAgo(10), updatedAt: daysAgo(7),
    staff: staffById('clstaff011'), shop: shopById('clshop005'),
  },
  {
    id: 'clres004', userId: 'cluser001', staffId: 'clstaff004', shopId: 'clshop002',
    dateTime: daysAgo(14), duration: 120, status: 'COMPLETED' as const, note: '遅れる可能性あり',
    createdAt: daysAgo(16), updatedAt: daysAgo(14),
    staff: staffById('clstaff004'), shop: shopById('clshop002'),
  },
  {
    id: 'clres005', userId: 'cluser001', staffId: 'clstaff009', shopId: 'clshop004',
    dateTime: daysAgo(21), duration: 60, status: 'CANCELLED' as const, note: '予定変更のため',
    createdAt: daysAgo(23), updatedAt: daysAgo(21),
    staff: staffById('clstaff009'), shop: shopById('clshop004'),
  },
];

// ============================================================
// 9. Point History (5 entries)
// ============================================================

export const pointHistory = [
  { id: 'clpoint001', userId: 'cluser001', amount: 500, reason: '来店ポイント（大奥 梅田）', relatedId: 'clres002', createdAt: daysAgo(3) },
  { id: 'clpoint002', userId: 'cluser001', amount: 1000, reason: '来店ポイント（ぷるるん 梅田）', relatedId: null, createdAt: daysAgo(7) },
  { id: 'clpoint003', userId: 'cluser001', amount: 200, reason: 'レビュー投稿ボーナス', relatedId: 'clreview002', createdAt: daysAgo(7) },
  { id: 'clpoint004', userId: 'cluser001', amount: 500, reason: '来店ポイント（スパーク 梅田）', relatedId: 'clres003', createdAt: daysAgo(14) },
  { id: 'clpoint005', userId: 'cluser001', amount: 300, reason: 'お気に入り登録ボーナス', relatedId: null, createdAt: daysAgo(15) },
];

// ============================================================
// 10. Coupons (2 active)
// ============================================================

export const coupons = [
  {
    id: 'clcoupon001', code: 'WELCOME2026', title: '初回限定 2,000円OFF',
    description: '初めてご利用のお客様限定。全店舗対象。',
    discountType: 'FIXED' as const, discountValue: 2000, minAmount: null, maxUses: null, usedCount: 42,
    shopId: null, shop: null,
    startDate: daysAgo(30), endDate: daysFromNow(60), isActive: true, createdAt: daysAgo(30),
  },
  {
    id: 'clcoupon002', code: 'SPARK500', title: 'スパーク限定 500円OFF',
    description: 'スパーク梅田・日本橋でご利用可能。',
    discountType: 'FIXED' as const, discountValue: 500, minAmount: null, maxUses: 100, usedCount: 15,
    shopId: 'clshop005', shop: shopById('clshop005'),
    startDate: daysAgo(10), endDate: daysFromNow(20), isActive: true, createdAt: daysAgo(10),
  },
];

// ============================================================
// 11. Schedules (for availability board — today's schedules)
// ============================================================

export const schedules = [
  { id: 'clsched001', staffId: 'clstaff001', date: todayAt(0), startTime: '10:00', endTime: '18:00', isConfirmed: true, createdAt: daysAgo(1) },
  { id: 'clsched002', staffId: 'clstaff003', date: todayAt(0), startTime: '12:00', endTime: '20:00', isConfirmed: true, createdAt: daysAgo(1) },
  { id: 'clsched003', staffId: 'clstaff004', date: todayAt(0), startTime: '14:00', endTime: '22:00', isConfirmed: true, createdAt: daysAgo(1) },
  { id: 'clsched004', staffId: 'clstaff006', date: todayAt(0), startTime: '10:00', endTime: '16:00', isConfirmed: true, createdAt: daysAgo(1) },
  { id: 'clsched005', staffId: 'clstaff009', date: todayAt(0), startTime: '16:00', endTime: '翌0:00', isConfirmed: true, createdAt: daysAgo(1) },
  { id: 'clsched006', staffId: 'clstaff011', date: todayAt(0), startTime: '11:00', endTime: '19:00', isConfirmed: true, createdAt: daysAgo(1) },
  { id: 'clsched007', staffId: 'clstaff012', date: todayAt(0), startTime: '14:00', endTime: '22:00', isConfirmed: true, createdAt: daysAgo(1) },
  { id: 'clsched008', staffId: 'clstaff013', date: todayAt(0), startTime: '12:00', endTime: '20:00', isConfirmed: true, createdAt: daysAgo(1) },
  { id: 'clsched009', staffId: 'clstaff014', date: todayAt(0), startTime: '18:00', endTime: '翌2:00', isConfirmed: true, createdAt: daysAgo(1) },
];

// ============================================================
// Derived / pre-joined data for homepage queries
// ============================================================

/** Staff flagged isNew with shop relation — for "New Face" carousel */
export const newStaff = staff.filter((s) => s.isNew && s.isActive);

/** Brand rankings — real data from each site */
export const brandRankings = {
  ohoku: [
    { rank: 1, name: 'しおり', image: 'https://umeda.oh-oku.jp/system/cache/cast/1037/180_270_1037_1.jpg' },
    { rank: 2, name: 'しいな', image: 'https://umeda.oh-oku.jp/system/cache/cast/1087/180_270_1087_1.jpg' },
    { rank: 3, name: 'るか', image: 'https://umeda.oh-oku.jp/system/cache/cast/1094/180_270_1094_1.jpg' },
    { rank: 4, name: 'ことの', image: 'https://umeda.oh-oku.jp/system/cache/cast/1065/180_270_1065_1.jpg' },
    { rank: 5, name: 'まいこ', image: 'https://umeda.oh-oku.jp/system/cache/cast/888/180_270_888_1.jpg' },
    { rank: 6, name: 'えりか', image: 'https://umeda.oh-oku.jp/system/cache/cast/923/180_270_923_1.jpg' },
    { rank: 7, name: 'けい', image: 'https://umeda.oh-oku.jp/system/cache/cast/1108/180_270_1108_1.jpg' },
    { rank: 8, name: 'ねね', image: 'https://umeda.oh-oku.jp/system/cache/cast/1167/180_270_1167_1.jpg' },
    { rank: 9, name: '佳奈', image: 'https://umeda.oh-oku.jp/system/cache/cast/186/180_270_186_1.jpg' },
    { rank: 10, name: 'のどか', image: 'https://umeda.oh-oku.jp/system/cache/cast/1098/180_270_1098_1.jpg' },
  ],
  pururun: [
    { rank: 1, name: 'あんり', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/198_1.jpg' },
    { rank: 2, name: 'えれん', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/1142_1.jpg' },
    { rank: 3, name: 'まいこ', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/1131_1.jpg' },
    { rank: 4, name: 'なのか', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/200_1.jpg' },
    { rank: 5, name: 'ゆい', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/388_1.jpg' },
    { rank: 6, name: 'さよ', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/915_1.jpg' },
    { rank: 7, name: 'さえこ', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/759_1.jpg' },
    { rank: 8, name: 'さほ', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/852_1.jpg' },
    { rank: 9, name: 'ぱふ', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/246_1.jpg' },
    { rank: 10, name: 'しえる', image: 'https://umeda.pururun-komachi.com/upload/pc/cast/199_1.jpg' },
  ],
  spark: [
    { rank: 1, name: 'ゆのん', image: 'https://umeda.spark-spark.com/upload/sp/cast/1192_1.jpg' },
    { rank: 2, name: 'くらら', image: 'https://umeda.spark-spark.com/upload/sp/cast/916_1.jpg' },
    { rank: 3, name: 'せりな', image: 'https://umeda.spark-spark.com/upload/sp/cast/1160_1.jpg' },
    { rank: 4, name: 'ありす', image: 'https://umeda.spark-spark.com/upload/sp/cast/833_1.jpg' },
    { rank: 5, name: 'ひめ', image: 'https://umeda.spark-spark.com/upload/sp/cast/993_1.jpg' },
    { rank: 6, name: 'ちか', image: 'https://umeda.spark-spark.com/upload/sp/cast/716_1.jpg' },
    { rank: 7, name: 'かな', image: 'https://umeda.spark-spark.com/upload/sp/cast/809_1.jpg' },
    { rank: 8, name: 'はな', image: 'https://umeda.spark-spark.com/upload/sp/cast/513_1.jpg' },
    { rank: 9, name: 'ましろ', image: 'https://umeda.spark-spark.com/upload/sp/cast/1178_1.jpg' },
    { rank: 10, name: 'あやね', image: 'https://umeda.spark-spark.com/upload/sp/cast/1183_1.jpg' },
  ],
};

/** Monthly ranking — kept for backward compat with existing components */
export const monthlyRanking = staff
  .filter((s) => s.isActive)
  .slice(0, 5)
  .map((s, i) => ({ ...s, _count: { reviews: [8, 6, 5, 4, 3][i] || 2 } }));

/** Newcomer ranking — new & active staff with _count.reviews */
export const newcomerRanking = staff
  .filter((s) => s.isNew && s.isActive)
  .slice(0, 5)
  .map((s, i) => ({ ...s, _count: { reviews: [5, 4, 3, 2, 1][i] || 1 } }));

/** Staff available now — with today's schedule attached */
export const availableNow = schedules.map((sched) => {
  const s = staffById(sched.staffId);
  return { ...s, schedules: [sched] };
});

/** Cast invitations — LINE notification-style messages from on-duty cast */
const invitationMessages = [
  { staffId: 'clstaff001', message: '今日はお天気もいいし、一緒にまったり過ごしませんか？待ってるね♪', minutesAgo: 3 },
  { staffId: 'clstaff006', message: '今日ネイル新しくしたの！見に来てくれたら嬉しいな〜♪', minutesAgo: 8 },
  { staffId: 'clstaff011', message: '今日めっちゃ暇なの…誰か遊びに来て〜！特別サービスしちゃうかも？', minutesAgo: 12 },
  { staffId: 'clstaff003', message: '久しぶりに出勤してます！新しいアロマ仕入れたから試してみない？', minutesAgo: 18 },
  { staffId: 'clstaff013', message: 'ゲームの話できる人来てほしい！最近ハマってるゲームがあるの♪', minutesAgo: 25 },
  { staffId: 'clstaff012', message: '今日は夜まで出勤だよ〜！お仕事終わりに寄ってくれたら嬉しいな', minutesAgo: 32 },
];

export const castInvitations = invitationMessages.map((inv) => {
  const s = staffById(inv.staffId);
  const sched = schedules.find((sc) => sc.staffId === inv.staffId);
  return {
    ...s,
    schedules: sched ? [sched] : [],
    message: inv.message,
    minutesAgo: inv.minutesAgo,
  };
});

/** Video staff — 10 active staff for ShortVideoFeed & AiConcierge */
export const videoStaff = staff.filter((s) => s.isActive).slice(0, 10);

/** Aggregate counts for mypage */
export const reviewCount = reviews.length;
export const favoriteCount = favorites.length;
export const visitCount = reservations.filter((r) => r.status === 'COMPLETED').length;

/** Mypage reviews (top 3) with staff + shop */
export const userReviews = reviews.slice(0, 3).map((r) => ({
  ...r,
  staff: staffById(r.staffId),
  shop: shopById(r.shopId),
}));

/** AI Match candidates — 10 active staff with shop */
export const matchCandidates = staff.filter((s) => s.isActive).slice(0, 10);
