const router = require('express').Router();
const Payment = require('../models/Payment');
const Student = require('../models/Student');

// GET all payments (recent)
router.get('/', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const payments = await Payment.find()
      .populate('student', 'name class')
      .sort({ paymentDate: -1 })
      .limit(parseInt(limit));
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET payments by student
router.get('/student/:id', async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.params.id })
      .sort({ year: -1, month: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST record payment
router.post('/', async (req, res) => {
  try {
    const { studentId, amount, month, year, note, type } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const payment = new Payment({ student: studentId, amount, month, year, note, type: type || 'regular' });
    const saved = await payment.save();
    await saved.populate('student', 'name class');
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
