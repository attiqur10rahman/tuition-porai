const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'tuition-porai-secret-2026'

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Not authenticated. Please log in.' })

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User not found. Please log in again.' })

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session. Please log in again.' })
  }
}
