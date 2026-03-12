const express = require('express');
const Pool = require('../models/Pool');
const router = express.Router();

// 모든 수영장 조회 (필터링 가능)
router.get('/', async (req, res) => {
  try {
    const { city, district, search } = req.query;
    let query = { isActive: true };

    if (city) {
      query.city = city;
    }
    if (district) {
      query.district = district;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const pools = await Pool.find(query).sort({ createdAt: -1 });
    res.json(pools);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// 특정 수영장 조회
router.get('/:id', async (req, res) => {
  try {
    const pool = await Pool.findById(req.params.id);
    if (!pool) {
      return res.status(404).json({ message: '수영장을 찾을 수 없습니다.' });
    }
    res.json(pool);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// 수영장 생성 (관리자용)
router.post('/', require('../middleware/auth'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: '관리자만 수영장을 등록할 수 있습니다.' });
    }

    const pool = new Pool(req.body);
    await pool.save();
    res.status(201).json(pool);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

// 도시 목록 조회
router.get('/cities/list', async (req, res) => {
  try {
    const cities = await Pool.distinct('city', { isActive: true });
    res.json(cities.sort());
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

module.exports = router;
