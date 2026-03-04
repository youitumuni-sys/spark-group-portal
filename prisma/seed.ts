import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 既存データ削除
  await prisma.favorite.deleteMany();
  await prisma.pointHistory.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.diary.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.event.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken.deleteMany();

  // ユーザー
  const pw = await bcrypt.hash('admin123', 12);
  await prisma.user.create({ data: { email: 'admin@spark-group.jp', nickname: '管理者', passwordHash: pw, role: 'ADMIN' } });
  const testUser = await prisma.user.create({ data: { email: 'user@example.com', nickname: 'テストユーザー', passwordHash: await bcrypt.hash('user123', 12), role: 'USER', points: 3500 } });

  // ============================================================
  // 店舗 — 3ブランド × 各2店舗
  // ============================================================
  const shops = [
    { name: '大奥 梅田店', slug: 'ohoku-umeda', area: '梅田', genre: 'ホテヘル', address: '大阪府大阪市北区兎我野町11-20 新大同ビル2F', phone: '06-6367-6000', openTime: '9:00', closeTime: 'ラスト', description: '大阪梅田エリアの高級人妻専門店。上品な大人の女性が極上のおもてなしをお届けします。', images: ['https://img2.cityheaven.net/img/shop/k/ooku_ume/shps1650_2_20260228015109pc.jpeg?cache02=1&imgopt=y'], features: ['完全個室', 'VIPルーム完備', '駅チカ'], access: '泉の広場M-14番出口よりスグ' },
    { name: '大奥 難波店', slug: 'ohoku-namba', area: '難波', genre: 'ホテヘル', address: '大阪府大阪市浪速区難波中1-11-8 サウスなんば302号', phone: '06-4397-0093', openTime: '9:00', closeTime: 'ラスト', description: '難波エリアの大奥ブランド。落ち着いた雰囲気の中で贅沢なひとときを。', images: ['https://img2.cityheaven.net/img/shop/k/ooku_nam/shps3108_2_20260105021350pc.jpeg?cache02=1&imgopt=y'], features: ['完全個室', '深夜営業'], access: '各線難波駅・6番出口徒歩1分・31番出口徒歩2分' },
    { name: 'ぷるるん小町 梅田店', slug: 'pururun-umeda', area: '梅田', genre: 'ホテヘル', address: '大阪府大阪市北区兎我野町11-20 新大同ビル2F', phone: '06-6366-7777', openTime: '10:00', closeTime: '翌5:00', description: '梅田エリアの人気店。可愛い女の子が多数在籍する話題のお店です。', images: ['https://img2.cityheaven.net/img/shop/k/pururun-komachi_umeda/shps1700000418_1_20260302003311pc.jpeg?cache02=1&imgopt=y'], features: ['深夜営業', 'イベント多数', '初回割引あり'], access: '各線「梅田駅」徒歩5分、泉の広場からTEL' },
    { name: 'ぷるるん小町 京橋店', slug: 'pururun-kyobashi', area: '京橋', genre: 'ホテヘル', address: '大阪府大阪市都島区東野田町3-12-9 京橋プルトンビル804号室', phone: '06-6355-4944', openTime: '10:00', closeTime: 'ラスト', description: '京橋エリアのぷるるん小町。アットホームな雰囲気でお迎えします。', images: ['https://img2.cityheaven.net/img/shop/k/pururun-komachi_kyobashi/shps1700000845_1_20260301235006pc.jpeg?cache02=1&imgopt=y'], features: ['アットホーム', '初回割引あり'], access: 'JR京橋駅、京阪京橋駅最寄り' },
    { name: 'スパーク 梅田店', slug: 'spark-umeda', area: '梅田', genre: 'ホテヘル', address: '大阪府大阪市北区兎我野町11-20 新大同ビル2F', phone: '06-6362-4000', openTime: '10:00', closeTime: '翌5:00', description: '完全リニューアル！最強素人集団を体感せよ。未経験の女の子が多数在籍。', images: ['https://img2.cityheaven.net/img/shop/k/spark_umeda/shps1199_1_20260228055308pc.jpeg?cache02=1&imgopt=y'], features: ['リニューアルOPEN', '素人専門', '新人多数'], access: '各線「梅田駅」徒歩5分、泉の広場からTEL' },
    { name: 'スパーク 日本橋店', slug: 'spark-nihonbashi', area: '日本橋', genre: 'ホテヘル', address: '大阪府大阪市中央区日本橋1-8-4 月光マンション201号', phone: '06-4708-1133', openTime: '10:00', closeTime: '翌3:00', description: '日本橋エリアのスパークブランド。フレッシュな出会いをお約束します。', images: ['https://img2.cityheaven.net/img/shop/k/spark_nihonbashi/shps1521_1_20260228023819pc.jpeg?cache02=1&imgopt=y'] },
    { name: 'ぷるるんマダム 難波店', slug: 'pururun-madam-namba', area: '難波', genre: 'ホテヘル', address: '大阪府大阪市浪速区難波中1-11-8 サウスなんば302号', phone: '06-6684-9066', openTime: '9:00', closeTime: 'ラスト', description: '難波エリアのぷるるんマダム。大人の色気と癒しをお届けします。', images: ['https://img2.cityheaven.net/img/shop/k/pururun-madamu_nanba/shps1710004547_2_20260301014553pc.jpeg?cache02=1&imgopt=y'], features: ['入会金無料', '予約受付9:30〜'] },
    { name: 'ぷるるんマダム 十三店', slug: 'pururun-madam-juso', area: '十三', genre: 'ホテヘル', address: '大阪府大阪市淀川区十三東1-20-18 ネオハイツ新淀川506号室', phone: '06-6195-1006', openTime: '10:00', closeTime: '22:00', description: '十三エリアのぷるるんマダム。グランドオープン記念イベント開催中！', images: ['https://img2.cityheaven.net/img/shop/k/pururun-madamu_juso/shps1710056861_1_20260210151819pc.jpeg?cache02=1&imgopt=y'], features: ['グランドオープン', '入会金無料', 'ポイント5倍'] },
    { name: '大奥 日本橋店', slug: 'ohoku-nihonbashi', area: '日本橋', genre: 'ホテヘル', address: '大阪府大阪市中央区日本橋1-9-2 第2阪奈ビル1F', phone: '06-6214-0009', openTime: '8:00', closeTime: 'ラスト', description: '日本橋エリアの大奥ブランド。上品な大人の女性が極上のおもてなしをお届けします。', images: ['https://img2.cityheaven.net/img/shop/k/ooku_nihombashi/shps1710023220_1_20260225225421pc.jpeg?cache02=1&imgopt=y'], features: ['完全個室', '駅チカ'] },
  ];

  const createdShops = [];
  for (const s of shops) {
    createdShops.push(await prisma.shop.create({ data: { ...s, isActive: true } }));
  }

  // ============================================================
  // キャスト — 各ブランドの実キャスト画像を使用
  // ============================================================
  const staff = [
    // 大奥 梅田店 (0) — 確認済み実URL
    { si: 0, name: 'れおな', age: 35, h: 163, b: 86, w: 57, hp: 85, bl: 'A', img: 'https://umeda.oh-oku.jp/system/cache/cast/592/180_270_592_1.jpg', isNew: true },
    { si: 0, name: 'しおり', age: 36, h: 158, b: 84, w: 56, hp: 84, bl: 'O', img: 'https://umeda.oh-oku.jp/system/cache/cast/1037/180_270_1037_1.jpg', isNew: true },
    { si: 0, name: 'のどか', age: 31, h: 160, b: 88, w: 58, hp: 86, bl: 'B', img: 'https://umeda.oh-oku.jp/system/cache/cast/1098/180_270_1098_1.jpg', isNew: false },
    { si: 0, name: 'ゆら', age: 22, h: 165, b: 90, w: 59, hp: 88, bl: 'A', img: 'https://umeda.oh-oku.jp/system/cache/cast/1189/180_270_1189_1.jpg', isNew: false },
    { si: 0, name: 'せいか', age: 27, h: 162, b: 85, w: 57, hp: 85, bl: 'AB', img: 'https://umeda.oh-oku.jp/system/cache/cast/1188/180_270_1188_1.jpg', isNew: false },
    { si: 0, name: 'ことの', age: 34, h: 156, b: 87, w: 58, hp: 87, bl: 'O', img: 'https://umeda.oh-oku.jp/system/cache/cast/1065/180_270_1065_2.jpg', isNew: false },
    { si: 0, name: 'さやか', age: 28, h: 161, b: 89, w: 60, hp: 88, bl: 'A', img: 'https://umeda.oh-oku.jp/system/cache/cast/1187/180_270_1187_1.jpg', isNew: false },
    { si: 0, name: 'ゆめ', age: 26, h: 159, b: 86, w: 57, hp: 85, bl: 'B', img: 'https://umeda.oh-oku.jp/system/cache/cast/1186/180_270_1186_1.jpg', isNew: false },
    // 大奥 難波店 (1) — 確認済み実URL
    { si: 1, name: 'さえ', age: 31, h: 164, b: 85, w: 56, hp: 84, bl: 'O', img: 'https://umeda.oh-oku.jp/system/cache/cast/1185/180_270_1185_1.jpg', isNew: true },
    { si: 1, name: 'ゆう', age: 32, h: 157, b: 88, w: 59, hp: 87, bl: 'A', img: 'https://umeda.oh-oku.jp/system/cache/cast/1183/180_270_1183_1.jpg', isNew: true },
    { si: 1, name: 'ゆか', age: 37, h: 160, b: 84, w: 55, hp: 83, bl: 'B', img: 'https://umeda.oh-oku.jp/system/cache/cast/1182/180_270_1182_1.jpg', isNew: false },
    { si: 1, name: 'みや', age: 30, h: 158, b: 87, w: 58, hp: 86, bl: 'AB', img: 'https://umeda.oh-oku.jp/system/cache/cast/1181/180_270_1181_1.jpg', isNew: false },
    { si: 1, name: 'みゆ', age: 35, h: 163, b: 86, w: 57, hp: 85, bl: 'A', img: 'https://umeda.oh-oku.jp/system/cache/cast/1179/180_270_1179_1.jpg', isNew: false },
    { si: 1, name: 'まなみ', age: 35, h: 166, b: 89, w: 59, hp: 88, bl: 'O', img: 'https://umeda.oh-oku.jp/system/cache/cast/1177/180_270_1177_1.jpg', isNew: false },
    { si: 1, name: 'りな', age: 40, h: 161, b: 85, w: 56, hp: 84, bl: 'B', img: 'https://umeda.oh-oku.jp/system/cache/cast/1176/180_270_1176_1.jpg', isNew: false },
    { si: 1, name: 'ひなみ', age: 36, h: 159, b: 87, w: 58, hp: 86, bl: 'A', img: 'https://umeda.oh-oku.jp/system/cache/cast/1175/180_270_1175_1.jpg', isNew: false },
    // ぷるるん小町 梅田店 (2) — 確認済み実URL
    { si: 2, name: 'みわ', age: 24, h: 158, b: 86, w: 57, hp: 85, bl: 'A', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/192_1.jpg', isNew: true },
    { si: 2, name: 'あんり', age: 25, h: 162, b: 84, w: 55, hp: 83, bl: 'O', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/198_1.jpg', isNew: true },
    { si: 2, name: 'えれん', age: 25, h: 160, b: 85, w: 56, hp: 84, bl: 'B', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/1142_1.jpg', isNew: false },
    { si: 2, name: 'まいこ', age: 22, h: 155, b: 83, w: 54, hp: 82, bl: 'A', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/1131_1.jpg', isNew: false },
    { si: 2, name: 'なのか', age: 28, h: 163, b: 87, w: 58, hp: 86, bl: 'AB', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/200_1.jpg', isNew: false },
    { si: 2, name: 'ゆい', age: 28, h: 159, b: 86, w: 57, hp: 85, bl: 'O', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/388_1.jpg', isNew: false },
    { si: 2, name: 'さよ', age: 20, h: 157, b: 82, w: 53, hp: 81, bl: 'B', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/915_1.jpg', isNew: false },
    { si: 2, name: 'さえこ', age: 31, h: 161, b: 88, w: 58, hp: 87, bl: 'A', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/759_1.jpg', isNew: false },
    // ぷるるん小町 京橋店 (3) — 確認済み実URL
    { si: 3, name: 'さほ', age: 25, h: 160, b: 85, w: 56, hp: 84, bl: 'O', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/852_1.jpg', isNew: true },
    { si: 3, name: 'ぱふ', age: 25, h: 156, b: 84, w: 55, hp: 83, bl: 'A', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/246_1.jpg', isNew: true },
    { si: 3, name: 'しえる', age: 26, h: 163, b: 86, w: 57, hp: 85, bl: 'B', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/199_1.jpg', isNew: false },
    { si: 3, name: 'かすみ', age: 24, h: 158, b: 83, w: 54, hp: 82, bl: 'AB', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/1510_1.jpg', isNew: false },
    { si: 3, name: 'おもち', age: 20, h: 155, b: 82, w: 53, hp: 81, bl: 'O', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/1509_1.jpg', isNew: false },
    { si: 3, name: 'てまり', age: 26, h: 164, b: 87, w: 58, hp: 86, bl: 'A', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/1508_1.jpg', isNew: false },
    { si: 3, name: 'どれみ', age: 20, h: 157, b: 81, w: 52, hp: 80, bl: 'B', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/1507_1.jpg', isNew: false },
    { si: 3, name: 'けい', age: 30, h: 161, b: 88, w: 59, hp: 87, bl: 'A', img: 'https://umeda.pururun-komachi.com/upload/pc/cast/1506_1.jpg', isNew: false },
    // スパーク 梅田店 (4) — 確認済み実URL
    { si: 4, name: 'ゆのん', age: 22, h: 160, b: 84, w: 56, hp: 83, bl: 'A', img: 'https://umeda.spark-spark.com/upload/sp/cast/1192_1.jpg', isNew: true },
    { si: 4, name: 'くらら', age: 21, h: 158, b: 83, w: 55, hp: 82, bl: 'O', img: 'https://umeda.spark-spark.com/upload/sp/cast/916_1.jpg', isNew: true },
    { si: 4, name: 'せりな', age: 23, h: 162, b: 85, w: 57, hp: 84, bl: 'B', img: 'https://umeda.spark-spark.com/upload/sp/cast/1160_1.jpg', isNew: false },
    { si: 4, name: 'ありす', age: 20, h: 155, b: 82, w: 54, hp: 81, bl: 'A', img: 'https://umeda.spark-spark.com/upload/sp/cast/833_1.jpg', isNew: false },
    { si: 4, name: 'ひめ', age: 22, h: 163, b: 84, w: 55, hp: 83, bl: 'AB', img: 'https://umeda.spark-spark.com/upload/sp/cast/993_1.jpg', isNew: false },
    { si: 4, name: 'ちか', age: 21, h: 157, b: 83, w: 54, hp: 82, bl: 'O', img: 'https://umeda.spark-spark.com/upload/sp/cast/716_1.jpg', isNew: false },
    { si: 4, name: 'かな', age: 24, h: 161, b: 86, w: 57, hp: 85, bl: 'B', img: 'https://umeda.spark-spark.com/upload/sp/cast/809_1.jpg', isNew: false },
    { si: 4, name: 'はな', age: 22, h: 159, b: 84, w: 55, hp: 83, bl: 'A', img: 'https://umeda.spark-spark.com/upload/sp/cast/513_1.jpg', isNew: false },
    // スパーク 日本橋店 (5) — 確認済み実URL
    { si: 5, name: 'ましろ', age: 20, h: 156, b: 82, w: 53, hp: 81, bl: 'O', img: 'https://umeda.spark-spark.com/upload/sp/cast/1178_1.jpg', isNew: true },
    { si: 5, name: 'あやね', age: 21, h: 160, b: 83, w: 54, hp: 82, bl: 'A', img: 'https://umeda.spark-spark.com/upload/sp/cast/1183_1.jpg', isNew: true },
    { si: 5, name: 'なみ', age: 22, h: 163, b: 85, w: 56, hp: 84, bl: 'B', img: 'https://umeda.spark-spark.com/upload/sp/cast/1379_1.jpg', isNew: false },
    { si: 5, name: 'もあ', age: 20, h: 155, b: 81, w: 52, hp: 80, bl: 'AB', img: 'https://umeda.spark-spark.com/upload/sp/cast/1377_1.jpg', isNew: false },
    { si: 5, name: 'いぶき', age: 23, h: 162, b: 84, w: 55, hp: 83, bl: 'A', img: 'https://umeda.spark-spark.com/upload/sp/cast/1376_1.jpg', isNew: false },
    { si: 5, name: 'める', age: 21, h: 158, b: 83, w: 54, hp: 82, bl: 'O', img: 'https://umeda.spark-spark.com/upload/sp/cast/1375_1.jpg', isNew: false },
    { si: 5, name: 'なゆた', age: 22, h: 161, b: 85, w: 56, hp: 84, bl: 'B', img: 'https://umeda.spark-spark.com/upload/sp/cast/1374_1.jpg', isNew: false },
    { si: 5, name: 'びび', age: 20, h: 157, b: 82, w: 53, hp: 81, bl: 'A', img: 'https://umeda.spark-spark.com/upload/sp/cast/1373_1.jpg', isNew: false },
    // ぷるるんマダム 難波店 (6)
    { si: 6, name: 'りこ', age: 33, h: 160, b: 87, w: 58, hp: 86, bl: 'O', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0041244618_0000000000pc.jpg?cache02=1&imgopt=y', isNew: true },
    { si: 6, name: 'みさき', age: 35, h: 162, b: 88, w: 59, hp: 87, bl: 'A', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0041244614_0000000000pc.jpg?cache02=1&imgopt=y', isNew: true },
    { si: 6, name: 'かおり', age: 38, h: 158, b: 85, w: 57, hp: 84, bl: 'B', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0041244606_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 6, name: 'ちなつ', age: 30, h: 164, b: 86, w: 58, hp: 85, bl: 'A', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0041244601_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 6, name: 'まりえ', age: 36, h: 156, b: 84, w: 56, hp: 83, bl: 'O', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0041244596_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 6, name: 'あかね', age: 32, h: 161, b: 89, w: 60, hp: 88, bl: 'AB', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0041244590_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 6, name: 'えみり', age: 34, h: 159, b: 86, w: 57, hp: 85, bl: 'A', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0041244582_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 6, name: 'じゅり', age: 29, h: 163, b: 87, w: 58, hp: 86, bl: 'B', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_nanba/grpb0041244577_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    // ぷるるんマダム 十三店 (7)
    { si: 7, name: 'つばさ', age: 31, h: 160, b: 86, w: 57, hp: 85, bl: 'O', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0041254432_0000000000pc.jpg?cache02=1&imgopt=y', isNew: true },
    { si: 7, name: 'ゆきな', age: 34, h: 158, b: 85, w: 56, hp: 84, bl: 'A', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0041254426_0000000000pc.jpg?cache02=1&imgopt=y', isNew: true },
    { si: 7, name: 'れん', age: 28, h: 163, b: 84, w: 55, hp: 83, bl: 'B', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0041254421_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 7, name: 'ひかり', age: 33, h: 155, b: 83, w: 54, hp: 82, bl: 'A', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0041254417_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 7, name: 'なお', age: 36, h: 162, b: 88, w: 59, hp: 87, bl: 'O', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0041254413_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 7, name: 'あいか', age: 30, h: 157, b: 85, w: 56, hp: 84, bl: 'AB', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0041254406_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 7, name: 'みなみ', age: 32, h: 161, b: 87, w: 58, hp: 86, bl: 'B', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0041254401_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 7, name: 'かれん', age: 29, h: 159, b: 86, w: 57, hp: 85, bl: 'A', img: 'https://img2.cityheaven.net/img/girls/k/pururun-madamu_juso/grpb0041254396_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    // 大奥 日本橋店 (8)
    { si: 8, name: 'あゆみ', age: 37, h: 161, b: 87, w: 58, hp: 86, bl: 'O', img: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0041214025_0000000000pc.jpg?cache02=1&imgopt=y', isNew: true },
    { si: 8, name: 'なつき', age: 34, h: 158, b: 86, w: 57, hp: 85, bl: 'A', img: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0041214019_0000000000pc.jpg?cache02=1&imgopt=y', isNew: true },
    { si: 8, name: 'まき', age: 39, h: 163, b: 88, w: 59, hp: 87, bl: 'B', img: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0041214013_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 8, name: 'ゆきえ', age: 36, h: 155, b: 85, w: 56, hp: 84, bl: 'A', img: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0041214007_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 8, name: 'さくら', age: 33, h: 160, b: 84, w: 55, hp: 83, bl: 'AB', img: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0041214001_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 8, name: 'はるか', age: 35, h: 162, b: 86, w: 57, hp: 85, bl: 'O', img: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0041213995_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 8, name: 'みく', age: 31, h: 157, b: 83, w: 54, hp: 82, bl: 'B', img: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0041213989_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
    { si: 8, name: 'ちひろ', age: 38, h: 164, b: 89, w: 60, hp: 88, bl: 'A', img: 'https://img2.cityheaven.net/img/girls/k/ooku_nihombashi/grpb0041213983_0000000000pc.jpg?cache02=1&imgopt=y', isNew: false },
  ];

  const createdStaff = [];
  for (const s of staff) {
    createdStaff.push(await prisma.staff.create({
      data: {
        shopId: createdShops[s.si].id, name: s.name, age: s.age, height: s.h,
        bust: s.b, waist: s.w, hip: s.hp, bloodType: s.bl,
        profile: `${s.name}です。よろしくお願いします。`,
        images: [s.img], isNew: s.isNew, isActive: true,
      },
    }));
  }

  // イベント（モックデータと同じ11件）
  const now = new Date();
  const events = [
    { si: 0, title: '期間限定イベント！！', desc: 'オールタイム終日開催の期間限定割引イベント。全コースでお得に遊べます！', image: 'https://img2.cityheaven.net/img/shop/k/ooku_ume/shps1650_2_20260228015109pc.jpeg?cache02=1&imgopt=y', daysAgo: 5, daysEnd: 25 },
    { si: 1, title: '【新規割】大奥を初めての方はこの価格で！！', desc: '初回限定で全コース4,000円OFF。60分11,000円・75分13,500円〜。スタッフへ「新規割」とお伝えください。', image: 'https://img2.cityheaven.net/img/shop/k/ooku_nam/shps3108_2_20260105021350pc.jpeg?cache02=1&imgopt=y', daysAgo: 30, daysEnd: 30 },
    { si: 2, title: '月間イベント開催中です！！', desc: 'イベントコース：75分通常12,000円→8,980円、100分通常14,000円→13,000円。入会金・パネル指名料込み。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-komachi_umeda/shps1700000418_1_20260301072810pc.jpeg?cache02=1&imgopt=y', daysAgo: 1, daysEnd: 29 },
    { si: 3, title: '🔰ご新規様限定割引', desc: '60分5,980円〜の超特価！初回来店のお客様限定。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-komachi_kyobashi/shps1700000845_1_20260301004551pc.jpeg?cache02=1&imgopt=y', daysAgo: 30, daysEnd: 30 },
    { si: 3, title: '🌸オールタイムイベント', desc: '75分8,980円〜。時間帯を問わずいつでも利用可能な常設割引。ぷるトン祭（2の付く日）も併催中。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-komachi_kyobashi/shps1700000845_1_20260301004551pc.jpeg?cache02=1&imgopt=y', daysAgo: 10, daysEnd: 20 },
    { si: 5, title: '♥ 新規割 FIRST TIME DISCOUNT 最大7,000円OFF', desc: '初回利用者限定。60分10,000円（通常16,000円）。クレジットカード決済対応。', image: 'https://img2.cityheaven.net/img/shop/k/spark_nihonbashi/shps1521_1_20260228023819pc.jpeg?cache02=1&imgopt=y', daysAgo: 30, daysEnd: 30 },
    { si: 6, title: "3月イベント『春マン開』75分8,500円", desc: '難波店限定の月間超特価イベント。通常より3,000円以上割引。全女性が選び放題。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-madamu_nanba/shps1710004547_2_20260301014553pc.jpeg?cache02=1&imgopt=y', daysAgo: 1, daysEnd: 30 },
    { si: 6, title: 'オプション無料で使い放題♪', desc: '全オプション（電マ・バイブ・即尺・顔射等）が無料で利用可能な常設特典。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-madamu_nanba/shps1710004547_2_20260301014553pc.jpeg?cache02=1&imgopt=y', daysAgo: 30, daysEnd: 60 },
    { si: 7, title: '🎉グランドオープン記念イベント', desc: 'オープン記念の大特価！次回使えるクーポン配布中。地域最安値でのご案内。', image: 'https://img2.cityheaven.net/img/shop/k/pururun-madamu_juso/shps1710056861_1_20260210151819pc.jpeg?cache02=1&imgopt=y', daysAgo: 20, daysEnd: 10 },
    { si: 8, title: '日本橋店限定【朝割】開催中！', desc: '早朝8:00〜9:59受付限定の特別割引。「初回予約半額DAY」も限定開催中。', image: 'https://img2.cityheaven.net/img/shop/k/ooku_nihombashi/shps1710023220_1_20260225225421pc.jpeg?cache02=1&imgopt=y', daysAgo: 10, daysEnd: 20 },
    { si: 8, title: '5が付く日限定 -【大還元祭】-', desc: '大奥梅田・難波・日本橋の全店舗で毎月5・15・25日に開催する3店合同イベント。', image: 'https://img2.cityheaven.net/img/shop/k/ooku_nihombashi/shps1710023220_1_20260225225421pc.jpeg?cache02=1&imgopt=y', daysAgo: 1, daysEnd: 30 },
  ];
  for (const ev of events) {
    await prisma.event.create({ data: { shopId: createdShops[ev.si].id, title: ev.title, description: ev.desc, image: ev.image, startDate: new Date(now.getTime() - ev.daysAgo * 864e5), endDate: new Date(now.getTime() + ev.daysEnd * 864e5) } });
  }

  // レビュー
  const reviews = [
    { comment: '初めて利用しましたが、とても丁寧な対応で大満足でした。', rating: 5 },
    { comment: '雰囲気がとても良く、リラックスできました。キャストの方も優しくて安心。', rating: 5 },
    { comment: '清潔感があり、サービスも充実。友人にも勧めたいです。', rating: 4 },
    { comment: 'コスパが良い。次回は指名で利用したいです。', rating: 4 },
    { comment: '期待以上の対応でした。キャストの笑顔が印象的。', rating: 5 },
    { comment: '全体的に満足。待ち時間がもう少し短いと嬉しい。', rating: 3 },
    { comment: 'とても素敵な時間を過ごせました。来月も伺います。', rating: 5 },
    { comment: '初回でしたが丁寧に説明してくれて安心できました。', rating: 4 },
  ];
  for (let i = 0; i < reviews.length; i++) {
    const si = i * 6;
    if (si < createdStaff.length) {
      await prisma.review.create({ data: { userId: testUser.id, staffId: createdStaff[si].id, shopId: createdShops[Math.floor(si / 8)].id, rating: reviews[i].rating, comment: reviews[i].comment } });
    }
  }

  // 写メ日記
  const diaries = ['今日も出勤してます♪','お休みの日のカフェ巡り','新しいヘアスタイルにしました！','昨日のお礼♪','寒い日のおすすめコーデ','最近ハマってるスキンケア'];
  for (let i = 0; i < 6; i++) {
    const si = i * 8;
    if (si < createdStaff.length) {
      const imgUrl = staff[si]?.img ?? '';
      await prisma.diary.create({ data: { staffId: createdStaff[si].id, title: diaries[i], content: `${diaries[i]}について書きました♪`, images: [imgUrl], viewCount: 50 + Math.floor(Math.random() * 200), likeCount: 5 + Math.floor(Math.random() * 30), isPublished: true } });
    }
  }

  // クーポン
  await prisma.coupon.create({ data: { code: 'WELCOME2026', title: '初回限定 2,000円OFF', description: '初めてご利用のお客様限定。', discountType: 'FIXED', discountValue: 2000, startDate: now, endDate: new Date(now.getTime() + 90 * 864e5), isActive: true } });
  await prisma.coupon.create({ data: { code: 'SPARK500', title: 'スパーク限定 500円OFF', description: 'スパーク梅田・日本橋でご利用可能。', discountType: 'FIXED', discountValue: 500, shopId: createdShops[4].id, startDate: now, endDate: new Date(now.getTime() + 30 * 864e5), isActive: true } });
  await prisma.coupon.create({ data: { code: 'GROUP10', title: 'グループ横断 10%OFF', description: '大奥・ぷるるん・スパーク全店舗対象。60分以上のコース限定。', discountType: 'PERCENTAGE', discountValue: 10, minAmount: 15000, startDate: now, endDate: new Date(now.getTime() + 60 * 864e5), isActive: true } });

  // 出勤スケジュール（本日 + 明日）
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const scheduleSlots = ['10:00-15:00', '12:00-18:00', '14:00-20:00', '16:00-22:00', '18:00-翌0:00', '20:00-翌2:00'];
  for (let i = 0; i < createdStaff.length; i++) {
    // 約70%のキャストが今日出勤
    if (Math.random() < 0.7) {
      const slot = scheduleSlots[i % scheduleSlots.length].split('-');
      await prisma.schedule.create({ data: { staffId: createdStaff[i].id, date: today, startTime: slot[0], endTime: slot[1], isConfirmed: true } });
    }
    // 約50%のキャストが明日出勤
    if (Math.random() < 0.5) {
      const slot = scheduleSlots[(i + 2) % scheduleSlots.length].split('-');
      await prisma.schedule.create({ data: { staffId: createdStaff[i].id, date: tomorrow, startTime: slot[0], endTime: slot[1], isConfirmed: true } });
    }
  }

  // お気に入り（テストユーザーが各ブランドから1人ずつ）
  await prisma.favorite.create({ data: { userId: testUser.id, staffId: createdStaff[0].id } });  // 大奥 れおな
  await prisma.favorite.create({ data: { userId: testUser.id, staffId: createdStaff[16].id } }); // ぷるるん みわ
  await prisma.favorite.create({ data: { userId: testUser.id, staffId: createdStaff[32].id } }); // スパーク ゆのん
  await prisma.favorite.create({ data: { userId: testUser.id, staffId: createdStaff[3].id } });  // 大奥 ゆら

  // 予約履歴
  const pastDays = [3, 7, 14, 21, 30];
  const durations = [60, 90, 60, 120, 60];
  const resStaff = [0, 16, 32, 3, 24]; // 各ブランドのキャスト
  for (let i = 0; i < 5; i++) {
    const dt = new Date(now.getTime() - pastDays[i] * 864e5);
    dt.setHours(14 + i, 0, 0, 0);
    await prisma.reservation.create({
      data: {
        userId: testUser.id,
        staffId: createdStaff[resStaff[i]].id,
        shopId: createdStaff[resStaff[i]].shopId,
        dateTime: dt,
        duration: durations[i],
        status: 'COMPLETED',
      },
    });
  }
  // 未来の予約1件
  const futureDate = new Date(now.getTime() + 2 * 864e5);
  futureDate.setHours(18, 0, 0, 0);
  await prisma.reservation.create({
    data: {
      userId: testUser.id,
      staffId: createdStaff[16].id,
      shopId: createdStaff[16].shopId,
      dateTime: futureDate,
      duration: 90,
      status: 'CONFIRMED',
    },
  });

  // ポイント履歴
  const pointReasons = [
    { amount: 500, reason: '来店ポイント（大奥 梅田）', daysAgo: 3 },
    { amount: 1000, reason: '来店ポイント（ぷるるん 梅田）', daysAgo: 7 },
    { amount: 200, reason: 'レビュー投稿ボーナス', daysAgo: 7 },
    { amount: 500, reason: '来店ポイント（スパーク 梅田）', daysAgo: 14 },
    { amount: 300, reason: 'お気に入り登録ボーナス', daysAgo: 14 },
    { amount: 500, reason: '来店ポイント（大奥 梅田）', daysAgo: 21 },
    { amount: 500, reason: '来店ポイント（ぷるるん 京橋）', daysAgo: 30 },
  ];
  for (const ph of pointReasons) {
    await prisma.pointHistory.create({
      data: {
        userId: testUser.id,
        amount: ph.amount,
        reason: ph.reason,
        createdAt: new Date(now.getTime() - ph.daysAgo * 864e5),
      },
    });
  }

  console.log('Seed completed');
  console.log(`  Shops: ${createdShops.length}, Staff: ${createdStaff.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
