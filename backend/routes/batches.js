const router = require('express').Router();
const Batch = require('../models/Batch');
const Student = require('../models/Student');

// GET all batches with student count
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find().sort({ createdAt: -1 });
    const enriched = await Promise.all(batches.map(async (b) => {
      const count = await Student.countDocuments({ batch: b._id, isActive: true });
      return { ...b.toObject(), studentCount: count };
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single batch with students
router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) return res.status(404).json({ message: 'Batch not found' });
    const students = await Student.find({ batch: batch._id, isActive: true });
    res.json({ ...batch.toObject(), students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create batch
router.post('/', async (req, res) => {
  try {
    const batch = new Batch(req.body);
    const saved = await batch.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update batch
router.put('/:id', async (req, res) => {
  try {
    const updated = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Batch not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE batch
router.delete('/:id', async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    await Student.updateMany({ batch: req.params.id }, { batch: null });
    res.json({ message: 'Batch deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
