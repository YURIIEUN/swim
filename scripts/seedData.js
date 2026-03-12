const mongoose = require('mongoose');
require('dotenv').config();
const Pool = require('../models/Pool');
const User = require('../models/User');

// 한국 주요 도시의 수영장 샘플 데이터
const samplePools = [
  {
    name: '강남구립 수영장',
    address: '서울특별시 강남구 테헤란로 123',
    city: '서울',
    district: '강남구',
    phone: '02-1234-5678',
    description: '강남구 중심가에 위치한 현대적인 수영장입니다. 깨끗한 시설과 전문 강사진이 준비되어 있습니다.',
    facilities: ['사우나', '자쿠지', '락커룸', '주차장'],
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    timeSlots: [
      { startTime: '06:00', endTime: '08:00', maxCapacity: 30 },
      { startTime: '08:00', endTime: '10:00', maxCapacity: 30 },
      { startTime: '10:00', endTime: '12:00', maxCapacity: 25 },
      { startTime: '12:00', endTime: '14:00', maxCapacity: 25 },
      { startTime: '14:00', endTime: '16:00', maxCapacity: 30 },
      { startTime: '16:00', endTime: '18:00', maxCapacity: 30 },
      { startTime: '18:00', endTime: '20:00', maxCapacity: 25 },
      { startTime: '20:00', endTime: '22:00', maxCapacity: 20 }
    ],
    pricePerSession: 15000,
    isActive: true
  },
  {
    name: '송파 올림픽 수영장',
    address: '서울특별시 송파구 올림픽로 300',
    city: '서울',
    district: '송파구',
    phone: '02-2345-6789',
    description: '올림픽 공원 내에 위치한 대형 수영장입니다. 올림픽 규격 풀과 다양한 프로그램을 제공합니다.',
    facilities: ['올림픽 규격 풀', '다이빙대', '사우나', '피트니스', '주차장'],
    operatingHours: {
      open: '05:00',
      close: '23:00'
    },
    timeSlots: [
      { startTime: '05:00', endTime: '07:00', maxCapacity: 40 },
      { startTime: '07:00', endTime: '09:00', maxCapacity: 40 },
      { startTime: '09:00', endTime: '11:00', maxCapacity: 35 },
      { startTime: '11:00', endTime: '13:00', maxCapacity: 35 },
      { startTime: '13:00', endTime: '15:00', maxCapacity: 40 },
      { startTime: '15:00', endTime: '17:00', maxCapacity: 40 },
      { startTime: '17:00', endTime: '19:00', maxCapacity: 35 },
      { startTime: '19:00', endTime: '21:00', maxCapacity: 30 },
      { startTime: '21:00', endTime: '23:00', maxCapacity: 25 }
    ],
    pricePerSession: 20000,
    isActive: true
  },
  {
    name: '서초구립 수영장',
    address: '서울특별시 서초구 서초대로 396',
    city: '서울',
    district: '서초구',
    phone: '02-2155-6789',
    description: '서초구 중심에 위치한 현대적인 수영장입니다. 직장인들을 위한 저녁 시간대 프로그램이 인기입니다.',
    facilities: ['25m 풀', '사우나', '피트니스', '주차장', '카페'],
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    timeSlots: [
      { startTime: '06:00', endTime: '08:00', maxCapacity: 25 },
      { startTime: '08:00', endTime: '10:00', maxCapacity: 25 },
      { startTime: '10:00', endTime: '12:00', maxCapacity: 20 },
      { startTime: '12:00', endTime: '14:00', maxCapacity: 20 },
      { startTime: '14:00', endTime: '16:00', maxCapacity: 25 },
      { startTime: '16:00', endTime: '18:00', maxCapacity: 25 },
      { startTime: '18:00', endTime: '20:00', maxCapacity: 30 },
      { startTime: '20:00', endTime: '22:00', maxCapacity: 25 }
    ],
    pricePerSession: 16000,
    isActive: true
  },
  {
    name: '마포구립 수영장',
    address: '서울특별시 마포구 월드컵북로 396',
    city: '서울',
    district: '마포구',
    phone: '02-3153-7890',
    description: '홍대 인근에 위치한 젊은 분위기의 수영장입니다. 다양한 수영 프로그램과 이벤트를 제공합니다.',
    facilities: ['25m 풀', '어린이 풀', '사우나', '락커룸', '주차장'],
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    timeSlots: [
      { startTime: '06:00', endTime: '08:00', maxCapacity: 28 },
      { startTime: '08:00', endTime: '10:00', maxCapacity: 28 },
      { startTime: '10:00', endTime: '12:00', maxCapacity: 22 },
      { startTime: '12:00', endTime: '14:00', maxCapacity: 22 },
      { startTime: '14:00', endTime: '16:00', maxCapacity: 28 },
      { startTime: '16:00', endTime: '18:00', maxCapacity: 28 },
      { startTime: '18:00', endTime: '20:00', maxCapacity: 30 },
      { startTime: '20:00', endTime: '22:00', maxCapacity: 25 }
    ],
    pricePerSession: 14000,
    isActive: true
  },
  {
    name: '용산구립 수영장',
    address: '서울특별시 용산구 한강대로 405',
    city: '서울',
    district: '용산구',
    phone: '02-2199-8901',
    description: '한강 근처에 위치한 수영장입니다. 수영 후 한강공원 산책을 즐길 수 있습니다.',
    facilities: ['50m 풀', '사우나', '자쿠지', '피트니스', '주차장'],
    operatingHours: {
      open: '05:30',
      close: '22:30'
    },
    timeSlots: [
      { startTime: '05:30', endTime: '07:30', maxCapacity: 35 },
      { startTime: '07:30', endTime: '09:30', maxCapacity: 35 },
      { startTime: '09:30', endTime: '11:30', maxCapacity: 30 },
      { startTime: '11:30', endTime: '13:30', maxCapacity: 30 },
      { startTime: '13:30', endTime: '15:30', maxCapacity: 35 },
      { startTime: '15:30', endTime: '17:30', maxCapacity: 35 },
      { startTime: '17:30', endTime: '19:30', maxCapacity: 32 },
      { startTime: '19:30', endTime: '21:30', maxCapacity: 28 },
      { startTime: '21:30', endTime: '22:30', maxCapacity: 20 }
    ],
    pricePerSession: 18000,
    isActive: true
  },
  {
    name: '종로구립 수영장',
    address: '서울특별시 종로구 세종대로 175',
    city: '서울',
    district: '종로구',
    phone: '02-2148-9012',
    description: '도심 한복판에 위치한 수영장입니다. 접근성이 뛰어나 직장인들에게 인기입니다.',
    facilities: ['25m 풀', '사우나', '락커룸', '주차장'],
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    timeSlots: [
      { startTime: '06:00', endTime: '08:00', maxCapacity: 24 },
      { startTime: '08:00', endTime: '10:00', maxCapacity: 24 },
      { startTime: '10:00', endTime: '12:00', maxCapacity: 20 },
      { startTime: '12:00', endTime: '14:00', maxCapacity: 20 },
      { startTime: '14:00', endTime: '16:00', maxCapacity: 24 },
      { startTime: '16:00', endTime: '18:00', maxCapacity: 24 },
      { startTime: '18:00', endTime: '20:00', maxCapacity: 28 },
      { startTime: '20:00', endTime: '22:00', maxCapacity: 22 }
    ],
    pricePerSession: 15000,
    isActive: true
  },
  {
    name: '강동구립 수영장',
    address: '서울특별시 강동구 천호대로 1017',
    city: '서울',
    district: '강동구',
    phone: '02-3425-0123',
    description: '강동구 주민들을 위한 친근한 수영장입니다. 가족 단위 이용객에게 최적화된 시설입니다.',
    facilities: ['25m 풀', '어린이 풀', '사우나', '주차장'],
    operatingHours: {
      open: '07:00',
      close: '21:00'
    },
    timeSlots: [
      { startTime: '07:00', endTime: '09:00', maxCapacity: 26 },
      { startTime: '09:00', endTime: '11:00', maxCapacity: 26 },
      { startTime: '11:00', endTime: '13:00', maxCapacity: 22 },
      { startTime: '13:00', endTime: '15:00', maxCapacity: 22 },
      { startTime: '15:00', endTime: '17:00', maxCapacity: 26 },
      { startTime: '17:00', endTime: '19:00', maxCapacity: 26 },
      { startTime: '19:00', endTime: '21:00', maxCapacity: 24 }
    ],
    pricePerSession: 13000,
    isActive: true
  },
  {
    name: '노원구립 수영장',
    address: '서울특별시 노원구 노원로 1234',
    city: '서울',
    district: '노원구',
    phone: '02-2116-1234',
    description: '노원구의 대표 수영장입니다. 넓은 주차장과 다양한 프로그램을 제공합니다.',
    facilities: ['50m 풀', '어린이 풀', '사우나', '피트니스', '주차장'],
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    timeSlots: [
      { startTime: '06:00', endTime: '08:00', maxCapacity: 32 },
      { startTime: '08:00', endTime: '10:00', maxCapacity: 32 },
      { startTime: '10:00', endTime: '12:00', maxCapacity: 28 },
      { startTime: '12:00', endTime: '14:00', maxCapacity: 28 },
      { startTime: '14:00', endTime: '16:00', maxCapacity: 32 },
      { startTime: '16:00', endTime: '18:00', maxCapacity: 32 },
      { startTime: '18:00', endTime: '20:00', maxCapacity: 30 },
      { startTime: '20:00', endTime: '22:00', maxCapacity: 25 }
    ],
    pricePerSession: 17000,
    isActive: true
  },
  {
    name: '은평구립 수영장',
    address: '서울특별시 은평구 은평로 195',
    city: '서울',
    district: '은평구',
    phone: '02-351-2345',
    description: '은평구 주민들을 위한 쾌적한 수영장입니다. 깨끗한 시설과 친절한 서비스로 유명합니다.',
    facilities: ['25m 풀', '사우나', '락커룸', '주차장'],
    operatingHours: {
      open: '06:30',
      close: '21:30'
    },
    timeSlots: [
      { startTime: '06:30', endTime: '08:30', maxCapacity: 23 },
      { startTime: '08:30', endTime: '10:30', maxCapacity: 23 },
      { startTime: '10:30', endTime: '12:30', maxCapacity: 20 },
      { startTime: '12:30', endTime: '14:30', maxCapacity: 20 },
      { startTime: '14:30', endTime: '16:30', maxCapacity: 23 },
      { startTime: '16:30', endTime: '18:30', maxCapacity: 23 },
      { startTime: '18:30', endTime: '20:30', maxCapacity: 25 },
      { startTime: '20:30', endTime: '21:30', maxCapacity: 18 }
    ],
    pricePerSession: 13500,
    isActive: true
  },
  {
    name: '강서구립 수영장',
    address: '서울특별시 강서구 화곡로 395',
    city: '서울',
    district: '강서구',
    phone: '02-2600-3456',
    description: '강서구에 위치한 현대적인 수영장입니다. 최신 시설과 전문 강사진을 갖추고 있습니다.',
    facilities: ['25m 풀', '어린이 풀', '사우나', '피트니스', '주차장'],
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    timeSlots: [
      { startTime: '06:00', endTime: '08:00', maxCapacity: 27 },
      { startTime: '08:00', endTime: '10:00', maxCapacity: 27 },
      { startTime: '10:00', endTime: '12:00', maxCapacity: 23 },
      { startTime: '12:00', endTime: '14:00', maxCapacity: 23 },
      { startTime: '14:00', endTime: '16:00', maxCapacity: 27 },
      { startTime: '16:00', endTime: '18:00', maxCapacity: 27 },
      { startTime: '18:00', endTime: '20:00', maxCapacity: 29 },
      { startTime: '20:00', endTime: '22:00', maxCapacity: 24 }
    ],
    pricePerSession: 14500,
    isActive: true
  },
  {
    name: '영등포구립 수영장',
    address: '서울특별시 영등포구 당산로 123',
    city: '서울',
    district: '영등포구',
    phone: '02-2670-4567',
    description: '영등포구 중심에 위치한 수영장입니다. 직장인들을 위한 저녁 시간대가 특히 인기입니다.',
    facilities: ['25m 풀', '사우나', '자쿠지', '주차장'],
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    timeSlots: [
      { startTime: '06:00', endTime: '08:00', maxCapacity: 25 },
      { startTime: '08:00', endTime: '10:00', maxCapacity: 25 },
      { startTime: '10:00', endTime: '12:00', maxCapacity: 21 },
      { startTime: '12:00', endTime: '14:00', maxCapacity: 21 },
      { startTime: '14:00', endTime: '16:00', maxCapacity: 25 },
      { startTime: '16:00', endTime: '18:00', maxCapacity: 25 },
      { startTime: '18:00', endTime: '20:00', maxCapacity: 30 },
      { startTime: '20:00', endTime: '22:00', maxCapacity: 26 }
    ],
    pricePerSession: 15500,
    isActive: true
  },
  {
    name: '부산 해운대 수영장',
    address: '부산광역시 해운대구 해운대해변로 264',
    city: '부산',
    district: '해운대구',
    phone: '051-3456-7890',
    description: '해운대 해변 근처에 위치한 수영장입니다. 바다를 바라보며 수영할 수 있는 특별한 경험을 제공합니다.',
    facilities: ['야외 풀', '실내 풀', '사우나', '카페', '주차장'],
    operatingHours: {
      open: '06:00',
      close: '21:00'
    },
    timeSlots: [
      { startTime: '06:00', endTime: '08:00', maxCapacity: 25 },
      { startTime: '08:00', endTime: '10:00', maxCapacity: 25 },
      { startTime: '10:00', endTime: '12:00', maxCapacity: 20 },
      { startTime: '12:00', endTime: '14:00', maxCapacity: 20 },
      { startTime: '14:00', endTime: '16:00', maxCapacity: 25 },
      { startTime: '16:00', endTime: '18:00', maxCapacity: 25 },
      { startTime: '18:00', endTime: '20:00', maxCapacity: 20 },
      { startTime: '20:00', endTime: '21:00', maxCapacity: 15 }
    ],
    pricePerSession: 18000,
    isActive: true
  },
  {
    name: '인천 송도 수영장',
    address: '인천광역시 연수구 송도과학로 123',
    city: '인천',
    district: '연수구',
    phone: '032-4567-8901',
    description: '송도 신도시에 위치한 최신식 수영장입니다. 가족 단위 이용객에게 최적화된 시설입니다.',
    facilities: ['어린이 풀', '성인 풀', '사우나', '락커룸', '주차장'],
    operatingHours: {
      open: '07:00',
      close: '22:00'
    },
    timeSlots: [
      { startTime: '07:00', endTime: '09:00', maxCapacity: 30 },
      { startTime: '09:00', endTime: '11:00', maxCapacity: 30 },
      { startTime: '11:00', endTime: '13:00', maxCapacity: 25 },
      { startTime: '13:00', endTime: '15:00', maxCapacity: 25 },
      { startTime: '15:00', endTime: '17:00', maxCapacity: 30 },
      { startTime: '17:00', endTime: '19:00', maxCapacity: 30 },
      { startTime: '19:00', endTime: '21:00', maxCapacity: 25 },
      { startTime: '21:00', endTime: '22:00', maxCapacity: 20 }
    ],
    pricePerSession: 12000,
    isActive: true
  },
  {
    name: '대전 유성온천 수영장',
    address: '대전광역시 유성구 유성대로 123',
    city: '대전',
    district: '유성구',
    phone: '042-5678-9012',
    description: '온천수를 활용한 특별한 수영장입니다. 건강과 힐링을 동시에 즐길 수 있습니다.',
    facilities: ['온천 풀', '일반 풀', '사우나', '찜질방', '주차장'],
    operatingHours: {
      open: '06:00',
      close: '22:00'
    },
    timeSlots: [
      { startTime: '06:00', endTime: '08:00', maxCapacity: 25 },
      { startTime: '08:00', endTime: '10:00', maxCapacity: 25 },
      { startTime: '10:00', endTime: '12:00', maxCapacity: 20 },
      { startTime: '12:00', endTime: '14:00', maxCapacity: 20 },
      { startTime: '14:00', endTime: '16:00', maxCapacity: 25 },
      { startTime: '16:00', endTime: '18:00', maxCapacity: 25 },
      { startTime: '18:00', endTime: '20:00', maxCapacity: 20 },
      { startTime: '20:00', endTime: '22:00', maxCapacity: 15 }
    ],
    pricePerSession: 14000,
    isActive: true
  },
  {
    name: '광주 무등산 수영장',
    address: '광주광역시 북구 무등로 456',
    city: '광주',
    district: '북구',
    phone: '062-6789-0123',
    description: '무등산 자락에 위치한 자연 친화적 수영장입니다. 시원한 공기와 함께 수영을 즐길 수 있습니다.',
    facilities: ['야외 풀', '실내 풀', '사우나', '주차장'],
    operatingHours: {
      open: '07:00',
      close: '21:00'
    },
    timeSlots: [
      { startTime: '07:00', endTime: '09:00', maxCapacity: 20 },
      { startTime: '09:00', endTime: '11:00', maxCapacity: 20 },
      { startTime: '11:00', endTime: '13:00', maxCapacity: 18 },
      { startTime: '13:00', endTime: '15:00', maxCapacity: 18 },
      { startTime: '15:00', endTime: '17:00', maxCapacity: 20 },
      { startTime: '17:00', endTime: '19:00', maxCapacity: 20 },
      { startTime: '19:00', endTime: '21:00', maxCapacity: 15 }
    ],
    pricePerSession: 10000,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swimming-pool', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB 연결 성공');

    // 기존 데이터 삭제 (선택사항)
    await Pool.deleteMany({});
    console.log('🗑️  기존 수영장 데이터 삭제 완료');

    // 샘플 데이터 삽입
    const pools = await Pool.insertMany(samplePools);
    console.log(`✅ ${pools.length}개의 수영장 데이터가 추가되었습니다.`);

    // 관리자 계정 생성 (선택사항)
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const admin = new User({
        name: '관리자',
        email: 'admin@example.com',
        password: 'admin123',
        phone: '010-0000-0000',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ 관리자 계정이 생성되었습니다. (이메일: admin@example.com, 비밀번호: admin123)');
    }

    console.log('🎉 데이터 시딩이 완료되었습니다!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

seedDatabase();
