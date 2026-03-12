const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pool',
    required: true
  },
  bookingDate: {
    type: Date,
    required: [true, '예약 날짜를 선택해주세요']
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  price: {
    type: Number,
    required: true
  },
  participants: {
    type: Number,
    default: 1,
    min: 1
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// 인덱스 추가 (조회 성능 향상)
bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ pool: 1, bookingDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
