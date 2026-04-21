const express = require('express');
const router = express.Router();
const multer = require('multer');
const Member = require('../models/Member');

// Multer config — saves to uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// POST /api/members
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, roll, year, degree, aboutProject,
            hobbies, certificate, internship, aboutAim } = req.body;
    const member = new Member({
      name, roll, year, degree, aboutProject,
      hobbies: hobbies ? hobbies.split(',') : [],
      certificate, internship, aboutAim,
      image: req.file ? req.file.filename : '',
    });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/members
router.get('/', async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

// GET /api/members/:id
router.get('/:id', async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(404).json({ error: 'Not found' });
  res.json(member);
});

module.exports = router;