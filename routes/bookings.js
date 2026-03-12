const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Pool = require('../models/Pool');
const auth = require('../middleware/auth');
const router = express.Router();

// 예약 생성
router.post('/', [
  auth,
  body('pool').notEmpty().withMessage('수영장을 선택해주세요'),
  body('bookingDate').notEmpty().withMessage('예약 날짜를 선택해주세요'),
  body('timeSlot.startTime').notEmpty().withMessage('시작 시간을 선택해주세요'),
  body('timeSlot.endTime').notEmpty().withMessage('종료 시간을 선택해주세요')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pool: poolId, bookingDate, timeSlot, participants = 1, notes } = req.body;

    // 수영장 확인
    const pool = await Pool.findById(poolId);
    if (!pool) {
      return res.status(404).json({ message: '수영장을 찾을 수 없습니다.' });
    }

    // 중복 예약 확인 (같은 날짜, 같은 시간대)
    const existingBooking = await Booking.findOne({
      user: req.user._id,
      pool: poolId,
      bookingDate: new Date(bookingDate),
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: '이미 예약된 시간대입니다.' });
    }

    // 해당 시간대의 예약 수 확인
    const timeSlotBookings = await Booking.countDocuments({
      pool: poolId,
      bookingDate: new Date(bookingDate),
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    // 시간대별 최대 인원 확인
    const selectedTimeSlot = pool.timeSlots.find(
      ts => ts.startTime === timeSlot.startTime && ts.endTime === timeSlot.endTime
    );

    if (selectedTimeSlot && timeSlotBookings >= selectedTimeSlot.maxCapacity) {
      return res.status(400).json({ message: '해당 시간대는 만석입니다.' });
    }

    const booking = new Booking({
      user: req.user._id,
      pool: poolId,
      bookingDate: new Date(bookingDate),
      timeSlot,
      participants,
      price: pool.pricePerSession * participants,
      notes
    });

    await booking.save();
    await booking.populate('pool', 'name address');

    res.status(201).json({
      message: '예약이 완료되었습니다.',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// 사용자 예약 목록 조회
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('pool', 'name address city')
      .sort({ bookingDate: -1, createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// 특정 예약 조회
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('pool')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    // 본인 예약만 조회 가능
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '예약 정보에 접근할 수 없습니다.' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// 예약 취소
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: '예약을 찾을 수 없습니다.' });
    }

    // 본인 예약만 취소 가능
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: '예약을 취소할 권한이 없습니다.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: '이미 취소된 예약입니다.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: '예약이 취소되었습니다.', booking });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// 특정 수영장의 날짜별 예약 가능 시간대 조회
router.get('/availability/:poolId', async (req, res) => {
  try {
    const { poolId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: '날짜를 입력해주세요.' });
    }

    const pool = await Pool.findById(poolId);
    if (!pool) {
      return res.status(404).json({ message: '수영장을 찾을 수 없습니다.' });
    }

    const bookings = await Booking.find({
      pool: poolId,
      bookingDate: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    });

    // 각 시간대별 예약 수 계산
    const availability = pool.timeSlots.map(slot => {
      const bookingCount = bookings.filter(
        b => b.timeSlot.startTime === slot.startTime
      ).length;

      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxCapacity: slot.maxCapacity,
        currentBookings: bookingCount,
        available: bookingCount < slot.maxCapacity
      };
    });

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

module.exports = router;
