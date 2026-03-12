const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  maxCapacity: {
    type: Number,
    default: 20
  },
  currentBookings: {
    type: Number,
    default: 0
  }
});

const poolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '수영장 이름을 입력해주세요'],
    trim: true
  },
  address: {
    type: String,
    required: [true, '주소를 입력해주세요'],
    trim: true
  },
  city: {
    type: String,
    required: [true, '도시를 입력해주세요'],
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  facilities: [{
    type: String
  }],
  operatingHours: {
    open: {
      type: String,
      default: '06:00'
    },
    close: {
      type: String,
      default: '22:00'
    }
  },
  timeSlots: [timeSlotSchema],
  pricePerSession: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pool', poolSchema);
