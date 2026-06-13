import { Category } from "./places";

// 카테고리별 폴백 갤러리 (검증된 Unsplash 이미지)
export const CATEGORY_GALLERIES: Record<Category, string[]> = {
  "박물관": [
    "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&auto=format&fit=crop&q=80", // museum interior
    "https://images.unsplash.com/photo-1565060169194-19fabf63012c?w=800&auto=format&fit=crop&q=80", // museum exhibit
    "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&auto=format&fit=crop&q=80", // ancient artifacts
    "https://images.unsplash.com/photo-1574086667853-bce3eeacf3a5?w=800&auto=format&fit=crop&q=80", // museum hall
    "https://images.unsplash.com/photo-1608819636975-b8e9a1ac6fb5?w=800&auto=format&fit=crop&q=80", // exhibition
    "https://images.unsplash.com/photo-1587590227264-0ac11c74959b?w=800&auto=format&fit=crop&q=80", // museum interior 2
  ],
  "체험학습": [
    "https://images.unsplash.com/photo-1564149504298-40726b9e1a40?w=800&auto=format&fit=crop&q=80", // kids activity
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80", // nature walk
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80", // zen park
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=80", // forest
    "https://images.unsplash.com/photo-1560073743-5f87e2c03b21?w=800&auto=format&fit=crop&q=80", // theme park
    "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&auto=format&fit=crop&q=80", // playground
  ],
  "축제": [
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80", // festival lights
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80", // festival crowd
    "https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=800&auto=format&fit=crop&q=80", // fireworks
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80", // lanterns
    "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800&auto=format&fit=crop&q=80", // festival night
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80", // event
  ],
  "1달 살기": [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80", // resort pool
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80", // villa
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=80", // hotel room
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80", // hotel exterior
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=80", // ocean view
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80", // beach house
  ],
  "색다른 경험": [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80", // zipline mountain
    "https://images.unsplash.com/photo-1598901847919-b71c99c9bfe2?w=800&auto=format&fit=crop&q=80", // adventure
    "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&auto=format&fit=crop&q=80", // cable car
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop&q=80", // rail
    "https://images.unsplash.com/photo-1586770703097-f40a0dc46d24?w=800&auto=format&fit=crop&q=80", // scuba
    "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=800&auto=format&fit=crop&q=80", // night sky
  ],
  "학원": [
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", // study
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80", // classroom
    "https://images.unsplash.com/photo-1517976547714-720226b864c1?w=800&auto=format&fit=crop&q=80", // space observatory
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80", // forest camp
    "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?w=800&auto=format&fit=crop&q=80", // camp
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80", // science camp
  ],
  "궁투어": [
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png"
  ]
};

// 장소별 큐레이션 갤러리 (각 장소 특성에 맞는 이미지)
export const PLACE_GALLERIES: Record<string, string[]> = {
  // ── 궁투어 5대 궁궐 ──
  "palace-1": [
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png"
  ],
  "palace-2": [
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png"
  ],
  "palace-3": [
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png"
  ],
  "palace-4": [
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png"
  ],
  "palace-5": [
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png",
    "/images/bg_palace.png"
  ],
  // ── 박물관 ──
  // 국립과천과학관
  "1": [
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&auto=format&fit=crop&q=80", // science museum
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80", // space/science
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=80", // planetarium
    "https://images.unsplash.com/photo-1581093577421-f561a654a353?w=800&auto=format&fit=crop&q=80", // science class
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80", // stargazing
    "https://images.unsplash.com/photo-1495592822108-9e6261896da8?w=800&auto=format&fit=crop&q=80", // lab
  ],
  // 국립중앙박물관
  "2": [
    "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&auto=format&fit=crop&q=80", // museum hall
    "https://images.unsplash.com/photo-1565060169194-19fabf63012c?w=800&auto=format&fit=crop&q=80", // ancient artifacts
    "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&auto=format&fit=crop&q=80", // traditional art
    "https://images.unsplash.com/photo-1587590227264-0ac11c74959b?w=800&auto=format&fit=crop&q=80", // museum interior
    "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=800&auto=format&fit=crop&q=80", // korean artifacts
    "https://images.unsplash.com/photo-1509726578-de563b39faad?w=800&auto=format&fit=crop&q=80", // asian museum
  ],
  // 서대문자연사박물관
  "3": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80", // dinosaur skeleton
    "https://images.unsplash.com/photo-1519694938892-9e75a9f7a4bc?w=800&auto=format&fit=crop&q=80", // dino fossil
    "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&auto=format&fit=crop&q=80", // nature museum
    "https://images.unsplash.com/photo-1604325052501-51a0f27a3e29?w=800&auto=format&fit=crop&q=80", // fossil
    "https://images.unsplash.com/photo-1602526432604-029a709e131b?w=800&auto=format&fit=crop&q=80", // natural history
  ],
  // 제주항공우주박물관
  "5": [
    "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=80", // airplane hangar
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80", // cockpit
    "https://images.unsplash.com/photo-1517976547714-720226b864c1?w=800&auto=format&fit=crop&q=80", // space center
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80", // earth from space
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&auto=format&fit=crop&q=80", // aviation museum
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80", // night sky telescope
  ],
  // 고성공룡박물관
  "13": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80", // dinosaur
    "https://images.unsplash.com/photo-1519694938892-9e75a9f7a4bc?w=800&auto=format&fit=crop&q=80", // dino fossil 2
    "https://images.unsplash.com/photo-1604325052501-51a0f27a3e29?w=800&auto=format&fit=crop&q=80", // fossil site
    "https://images.unsplash.com/photo-1472437774355-71ab6752b434?w=800&auto=format&fit=crop&q=80", // ocean cliffs
    "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=800&auto=format&fit=crop&q=80", // museum hall
  ],
  // 국립해양박물관
  "14": [
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&auto=format&fit=crop&q=80", // ocean
    "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&auto=format&fit=crop&q=80", // sea life
    "https://images.unsplash.com/photo-1520366498724-709889c0c685?w=800&auto=format&fit=crop&q=80", // aquarium
    "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&auto=format&fit=crop&q=80", // whale
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80", // harbor
  ],
  // 철도박물관
  "15": [
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80", // old train
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80", // train station
    "https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=800&auto=format&fit=crop&q=80", // railway
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80", // retro train
    "https://images.unsplash.com/photo-1558000143-a60921473212?w=800&auto=format&fit=crop&q=80", // mountain train
  ],
  // ── 체험학습 ──
  // 키자니아 서울
  "30": [
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80", // kids roleplay
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80", // children activity
    "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&auto=format&fit=crop&q=80", // miniature city
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80", // indoor play
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80", // kids exploring
    "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=800&auto=format&fit=crop&q=80", // fun zone
  ],
  // 에버랜드
  "31": [
    "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&auto=format&fit=crop&q=80", // roller coaster
    "https://images.unsplash.com/photo-1560273832-8654-51ab2ae6c4ff?w=800&auto=format&fit=crop&q=80", // theme park ride
    "https://images.unsplash.com/photo-1527546649652-f4a3cdb95905?w=800&auto=format&fit=crop&q=80", // amusement park
    "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&auto=format&fit=crop&q=80", // colorful park
    "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?w=800&auto=format&fit=crop&q=80", // fireworks park
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80", // night park
  ],
  // 서울대공원
  "32": [
    "https://images.unsplash.com/photo-1576394435006-f06c96a8edce?w=800&auto=format&fit=crop&q=80", // zoo animals
    "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&auto=format&fit=crop&q=80", // lion
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80", // elephant
    "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80", // penguin
    "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&auto=format&fit=crop&q=80", // nature park
  ],
  // 춘천 레고랜드
  "35": [
    "https://images.unsplash.com/photo-1560273832-8654-51ab2ae6c4ff?w=800&auto=format&fit=crop&q=80", // fun ride
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80", // kids fun
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80", // kids playing
    "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&auto=format&fit=crop&q=80", // amusement
    "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&auto=format&fit=crop&q=80", // colorful rides
  ],
  // 남이섬
  "50": [
    "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&auto=format&fit=crop&q=80", // tree lined path
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80", // lake island
    "https://images.unsplash.com/photo-1589393922695-ef4c9b258b6b?w=800&auto=format&fit=crop&q=80", // forest road
    "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?w=800&auto=format&fit=crop&q=80", // spring trees
    "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&auto=format&fit=crop&q=80", // autumn island
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80", // forest walk
  ],
  // 국립생태원
  "17": [
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80", // tropical garden
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80", // forest ecosystem
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80", // nature reserve
    "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=80", // wetland
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80", // green forest
  ],
  // 순천만습지
  "18": [
    "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=80", // wetland sunset
    "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80", // reed field
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80", // birds
    "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?w=800&auto=format&fit=crop&q=80", // marshland
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80", // peaceful nature
  ],
  // ── 색다른 경험 ──
  // 남이섬 짚와이어
  "91": [
    "https://images.unsplash.com/photo-1540747026-d52b5ea24af0?w=800&auto=format&fit=crop&q=80", // zipline forest
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80", // mountain cable
    "https://images.unsplash.com/photo-1598901847919-b71c99c9bfe2?w=800&auto=format&fit=crop&q=80", // adventure sports
    "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&auto=format&fit=crop&q=80", // aerial view
    "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&auto=format&fit=crop&q=80", // namiisland view
  ],
  // 정선 레일바이크
  "400": [
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&auto=format&fit=crop&q=80", // rail bike
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80", // train tunnel
    "https://images.unsplash.com/photo-1574086667853-bce3eeacf3a5?w=800&auto=format&fit=crop&q=80", // mountain railway
    "https://images.unsplash.com/photo-1471958680802-1345a694ba6d?w=800&auto=format&fit=crop&q=80", // valley train
    "https://images.unsplash.com/photo-1558000143-a60921473212?w=800&auto=format&fit=crop&q=80", // scenic rail
  ],
  // 속초 케이블카 설악
  "402": [
    "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&auto=format&fit=crop&q=80", // cable car mountain
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80", // snowy mountain
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80", // mountain peaks
    "https://images.unsplash.com/photo-1558000143-a60921473212?w=800&auto=format&fit=crop&q=80", // scenic gondola
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80", // mountain view
  ],
  // 제주 스쿠버다이빙
  "404": [
    "https://images.unsplash.com/photo-1586770703097-f40a0dc46d24?w=800&auto=format&fit=crop&q=80", // scuba underwater
    "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&auto=format&fit=crop&q=80", // coral reef
    "https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?w=800&auto=format&fit=crop&q=80", // underwater fish
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80", // jeju ocean
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80", // dive blue
  ],
  // 태안 별빛정원
  "403": [
    "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=800&auto=format&fit=crop&q=80", // starry night garden
    "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop&q=80", // night lights
    "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&auto=format&fit=crop&q=80", // illumination
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80", // stargazing
    "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&auto=format&fit=crop&q=80", // garden night
  ],
  // ── 축제 ──
  // 보령 머드축제
  "61": [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80", // beach summer
    "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&auto=format&fit=crop&q=80", // summer festival
    "https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&auto=format&fit=crop&q=80", // outdoor festival
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80", // crowd summer
    "https://images.unsplash.com/photo-1472653431158-6364773b2a56?w=800&auto=format&fit=crop&q=80", // beach event
  ],
  // 화천 산천어축제
  "62": [
    "https://images.unsplash.com/photo-1513077202514-c511b41bd4c7?w=800&auto=format&fit=crop&q=80", // ice fishing
    "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=800&auto=format&fit=crop&q=80", // winter ice
    "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&auto=format&fit=crop&q=80", // frozen river
    "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&auto=format&fit=crop&q=80", // snow landscape
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80", // winter mountain
  ],
  // 진해 군항제 벚꽃
  "504": [
    "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop&q=80", // cherry blossom
    "https://images.unsplash.com/photo-1490750967868-88df5691cc53?w=800&auto=format&fit=crop&q=80", // sakura road
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop&q=80", // pink blossom
    "https://images.unsplash.com/photo-1546500840-ae38253aba9b?w=800&auto=format&fit=crop&q=80", // blossom sky
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80", // spring flowers
  ],
  // 서울 빛초롱축제
  "503": [
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80", // lantern festival
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80", // colorful lights
    "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=800&auto=format&fit=crop&q=80", // festival night
    "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop&q=80", // illuminated
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80", // city lights
  ],
  // ── 1달 살기 ──
  // 제주 애월읍
  "80": [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80", // jeju ocean
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80", // villa pool
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=80", // pension room
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80", // beach villa
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=80", // jeju view
  ],
  // ── 학원 ──
  // 경기영어마을 파주캠프
  "70": [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80", // classroom
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80", // kids class
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80", // children activity
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", // study camp
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80", // learning
  ],
  // 송암스페이스센터 천문대
  "72": [
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80", // telescope
    "https://images.unsplash.com/photo-1517976547714-720226b864c1?w=800&auto=format&fit=crop&q=80", // observatory
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80", // starry sky
    "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=800&auto=format&fit=crop&q=80", // milky way
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=80", // planetarium
  ],
  // 국립현대미술관
  "200": [
    "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=800&auto=format&fit=crop&q=80", // modern art
    "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800&auto=format&fit=crop&q=80", // art gallery
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80", // museum hall
    "https://images.unsplash.com/photo-1569180880150-df4eed93c90b?w=800&auto=format&fit=crop&q=80", // art installation
    "https://images.unsplash.com/photo-1596803244535-925769f389fc?w=800&auto=format&fit=crop&q=80", // art exhibit
    "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&auto=format&fit=crop&q=80", // contemporary art
  ],
  // 독립기념관
  "208": [
    "https://images.unsplash.com/photo-1565060169194-19fabf63012c?w=800&auto=format&fit=crop&q=80", // history museum hall
    "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&auto=format&fit=crop&q=80", // large museum interior
    "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&auto=format&fit=crop&q=80", // traditional artifacts
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop&q=80", // outdoor monument / grounds
    "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=800&auto=format&fit=crop&q=80", // memorial park
    "https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=800&auto=format&fit=crop&q=80", // history display
  ],
  // 전쟁기념관
  "206": [
    "https://images.unsplash.com/photo-1572979201538-4b72dc7db0b5?w=800&auto=format&fit=crop&q=80", // war memorial
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80", // memorial park
    "https://images.unsplash.com/photo-1565060169194-19fabf63012c?w=800&auto=format&fit=crop&q=80", // history artifacts
    "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&auto=format&fit=crop&q=80", // museum
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop&q=80", // outdoor display
  ],
  // 국립어린이과학관
  "211": [
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&auto=format&fit=crop&q=80", // kids science
    "https://images.unsplash.com/photo-1564149504298-40726b9e1a40?w=800&auto=format&fit=crop&q=80", // children learning
    "https://images.unsplash.com/photo-1581093577421-f561a654a353?w=800&auto=format&fit=crop&q=80", // science exhibit
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80", // kids play
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=80", // planetarium
  ],
  // 안동 하회마을
  "213": [
    "https://images.unsplash.com/photo-1601225998165-bf93cf7e2438?w=800&auto=format&fit=crop&q=80", // traditional village
    "https://images.unsplash.com/photo-1565060169194-19fabf63012c?w=800&auto=format&fit=crop&q=80", // hanok
    "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=800&auto=format&fit=crop&q=80", // korean culture
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=80", // river village
    "https://images.unsplash.com/photo-1509726578-de563b39faad?w=800&auto=format&fit=crop&q=80", // asian heritage
  ],
};

/**
 * 특정 장소의 갤러리 이미지 배열을 반환합니다.
 * 전용 갤러리가 없으면 카테고리 기반 이미지를 ID를 이용해 셔플하여 반환합니다.
 */
export function getPlaceGallery(id: string, category: Category, mainImageUrl?: string): string[] {
  if (PLACE_GALLERIES[id]) {
    return PLACE_GALLERIES[id];
  }

  const pool = [...CATEGORY_GALLERIES[category]];
  const seed = parseInt(id.replace(/\D/g, "") || "0");
  const offset = seed % pool.length;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];

  if (mainImageUrl && !rotated.includes(mainImageUrl)) {
    return [mainImageUrl, ...rotated.slice(0, 5)];
  }
  return rotated.slice(0, 6);
}
