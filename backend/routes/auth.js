const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'tuition-porai-secret-2026'

// Generate token
const genToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' })

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, tutionName, phone } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'An account with this email already exists' })

    const user = await User.create({ name, email, password, tutionName: tutionName || name + "'s Tuition", phone })
    res.status(201).json({
      token: genToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, tutionName: user.tutionName, monthlyTarget: user.monthlyTarget }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'No account found with this email' })

    const match = await user.comparePassword(password)
    if (!match) return res.status(401).json({ message: 'Incorrect password' })

    res.json({
      token: genToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, tutionName: user.tutionName, monthlyTarget: user.monthlyTarget }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/auth/me (update profile)
router.put('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const { name, tutionName, phone, monthlyTarget } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, tutionName, phone, monthlyTarget },
      { new: true }
    ).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
