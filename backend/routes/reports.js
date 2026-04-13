const router = require('express').Router();
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const Profile = require('../models/Profile');

// GET financial summary for current month
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const activeStudents = await Student.find({ isActive: true });
    const expected = activeStudents.reduce((sum, s) => sum + s.monthlyFee, 0);

    const payments = await Payment.find({ month, year }).populate('student', 'name class');
    const collected = payments.reduce((sum, p) => sum + p.amount, 0);

    // Dues: students who paid less than fee
    let totalDues = 0;
    let totalAdvance = 0;
    for (const student of activeStudents) {
      const paid = payments
        .filter(p => p.student && p.student._id.toString() === student._id.toString())
        .reduce((sum, p) => sum + p.amount, 0);
      if (paid < student.monthlyFee) totalDues += student.monthlyFee - paid;
      if (paid > student.monthlyFee) totalAdvance += paid - student.monthlyFee;
    }

    // New students this month
    const newStudents = await Student.countDocuments({
      createdAt: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1)
      }
    });

    const profile = await Profile.findOne();
    const monthlyTarget = profile ? profile.monthlyTarget : 0;

    res.json({ expected, collected, dues: totalDues, advance: totalAdvance, newStudents, monthlyTarget, month, year });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET monthly breakdown (last 6 months)
router.get('/monthly', async (req, res) => {
  try {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ month: d.getMonth() + 1, year: d.getFullYear() });
    }

    const data = await Promise.all(months.map(async ({ month, year }) => {
      const payments = await Payment.find({ month, year });
      const collected = payments.reduce((sum, p) => sum + p.amount, 0);
      const students = await Student.find({ isActive: true });
      const expected = students.reduce((sum, s) => sum + s.monthlyFee, 0);
      return { month, year, collected, expected };
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET per-student dues report
router.get('/dues', async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const students = await Student.find({ isActive: true });
    const payments = await Payment.find({ month, year });

    const report = students.map(s => {
      const paid = payments
        .filter(p => p.student.toString() === s._id.toString())
        .reduce((sum, p) => sum + p.amount, 0);
      return {
        _id: s._id,
        name: s.name,
        class: s.class,
        monthlyFee: s.monthlyFee,
        paid,
        due: Math.max(0, s.monthlyFee - paid),
        advance: Math.max(0, paid - s.monthlyFee),
        status: paid >= s.monthlyFee ? 'paid' : paid > 0 ? 'partial' : 'unpaid'
      };
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
