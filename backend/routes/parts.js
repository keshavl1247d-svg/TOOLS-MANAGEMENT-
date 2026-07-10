const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all parts
router.get('/', protect, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM parts ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching parts:', error);
    res.status(500).json({ message: 'Server error fetching parts' });
  }
});

// Get single part
router.get('/:id', protect, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM parts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Part not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching part:', error);
    res.status(500).json({ message: 'Server error fetching part' });
  }
});

// Add a new part (admin only)
router.post('/', protect, adminOnly, upload.single('photo'), async (req, res) => {
  const { part_number, part_name, quantity, location, status } = req.body;
  const photo = req.file ? req.file.path : null;

  if (!part_number || !part_name) {
    return res.status(400).json({ message: 'Part number and name are required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO parts (part_number, part_name, quantity, location, status, photo) VALUES (?, ?, ?, ?, ?, ?)',
      [part_number, part_name, quantity || 0, location || null, status || 'Available', photo]
    );
    res.status(201).json({ message: 'Part created', id: result.insertId });
  } catch (error) {
    console.error('Error creating part:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Part number already exists' });
    }
    res.status(500).json({ message: 'Server error creating part' });
  }
});

// Edit a part (admin only)
router.put('/:id', protect, adminOnly, upload.single('photo'), async (req, res) => {
  const { part_number, part_name, quantity, location, status } = req.body;
  
  if (!part_number || !part_name) {
    return res.status(400).json({ message: 'Part number and name are required' });
  }

  try {
    if (req.file) {
      const photo = req.file.path;
      await pool.execute(
        'UPDATE parts SET part_number = ?, part_name = ?, quantity = ?, location = ?, status = ?, photo = ? WHERE id = ?',
        [part_number, part_name, quantity, location, status, photo, req.params.id]
      );
    } else {
      await pool.execute(
        'UPDATE parts SET part_number = ?, part_name = ?, quantity = ?, location = ?, status = ? WHERE id = ?',
        [part_number, part_name, quantity, location, status, req.params.id]
      );
    }
    res.json({ message: 'Part updated successfully' });
  } catch (error) {
    console.error('Error updating part:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Part number already exists' });
    }
    res.status(500).json({ message: 'Server error updating part' });
  }
});

// Delete a part (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.execute('DELETE FROM parts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Error deleting part:', error);
    res.status(500).json({ message: 'Server error deleting part' });
  }
});

module.exports = router;
