const router = require('express').Router();
const Student = require('../models/Student');
const Payment = require('../models/Payment');

// GET all students
router.get('/', async (req, res) => {
  try {
    const { search, active } = req.query;
    let query = {};
    if (active !== undefined) query.isActive = active === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };

    const students = await Student.find(query).populate('batch', 'name').sort({ createdAt: -1 });

    // Attach payment summary
    const enriched = await Promise.all(students.map(async (s) => {
      const now = new Date();
      const payments = await Payment.find({ student: s._id });
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const currentMonthPaid = payments
        .filter(p => p.month === now.getMonth() + 1 && p.year === now.getFullYear())
        .reduce((sum, p) => sum + p.amount, 0);
      const due = Math.max(0, s.monthlyFee - currentMonthPaid);
      const advance = Math.max(0, currentMonthPaid - s.monthlyFee);
      return { ...s.toObject(), totalPaid, currentMonthPaid, due, advance };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('batch', 'name');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const payments = await Payment.find({ student: student._id }).sort({ year: -1, month: -1 });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const now = new Date();
    const currentMonthPaid = payments
      .filter(p => p.month === now.getMonth() + 1 && p.year === now.getFullYear())
      .reduce((sum, p) => sum + p.amount, 0);
    const due = Math.max(0, student.monthlyFee - currentMonthPaid);
    const advance = Math.max(0, currentMonthPaid - student.monthlyFee);

    res.json({ ...student.toObject(), totalPaid, currentMonthPaid, due, advance, payments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create student
router.post('/', async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update student
router.put('/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    await Payment.deleteMany({ student: req.params.id });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
