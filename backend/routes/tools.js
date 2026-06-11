const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

// Get all tools with linked part info
router.get('/', protect, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT t.*, p.part_number, p.part_name 
      FROM tools t 
      LEFT JOIN parts p ON t.part_id = p.id 
      ORDER BY t.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ message: 'Server error fetching tools' });
  }
});

// Get single tool
router.get('/:id', protect, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT t.*, p.part_number, p.part_name 
      FROM tools t 
      LEFT JOIN parts p ON t.part_id = p.id 
      WHERE t.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching tool:', error);
    res.status(500).json({ message: 'Server error fetching tool' });
  }
});

// Add a new tool (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { tool_number, tool_name, part_id, status } = req.body;

  if (!tool_number || !tool_name) {
    return res.status(400).json({ message: 'Tool number and name are required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO tools (tool_number, tool_name, part_id, status) VALUES (?, ?, ?, ?)',
      [tool_number, tool_name, part_id || null, status || 'IN']
    );
    res.status(201).json({ message: 'Tool created', id: result.insertId });
  } catch (error) {
    console.error('Error creating tool:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Tool number already exists' });
    }
    res.status(500).json({ message: 'Server error creating tool' });
  }
});

// Edit a tool (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { tool_number, tool_name, part_id, status } = req.body;
  
  if (!tool_number || !tool_name) {
    return res.status(400).json({ message: 'Tool number and name are required' });
  }

  try {
    await pool.execute(
      'UPDATE tools SET tool_number = ?, tool_name = ?, part_id = ?, status = ? WHERE id = ?',
      [tool_number, tool_name, part_id || null, status, req.params.id]
    );
    res.json({ message: 'Tool updated successfully' });
  } catch (error) {
    console.error('Error updating tool:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Tool number already exists' });
    }
    res.status(500).json({ message: 'Server error updating tool' });
  }
});

// Delete a tool (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await pool.execute('DELETE FROM tools WHERE id = ?', [req.params.id]);
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Error deleting tool:', error);
    res.status(500).json({ message: 'Server error deleting tool' });
  }
});

module.exports = router;
