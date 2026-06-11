const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/auth');

// Get history
router.get('/', protect, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const offset = (page - 1) * limit;

  try {
    const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM inout_history');
    const total = countResult[0].total;

    const [rows] = await pool.execute(`
      SELECT h.*, t.tool_name, t.tool_number, p.part_number, p.part_name
      FROM inout_history h
      LEFT JOIN tools t ON h.tool_id = t.id
      LEFT JOIN parts p ON h.part_id = p.id
      ORDER BY h.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit.toString(), offset.toString()]); // limit/offset as string prevents parsing issues in some mysql2 versions if not configured right, but passing as numbers usually works if setup allows. Actually let's just pass numbers, mysql2 supports it natively if using execute or we can format it. 
    // Wait, execute with LIMIT ? OFFSET ? sometimes throws in mysql2 if strict mode, better to cast or just inject if validated:
    // Let's use the standard query for pagination parameters to be safe, or simply string interpolation since they are parsed as int above.
    
    // Safer way:
    const [historyRows] = await pool.execute(`
      SELECT h.*, t.tool_name, t.tool_number, p.part_number, p.part_name
      FROM inout_history h
      LEFT JOIN tools t ON h.tool_id = t.id
      LEFT JOIN parts p ON h.part_id = p.id
      ORDER BY h.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);

    res.json({
      data: historyRows,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
});

// Issue a tool (OUT)
router.post('/issue', protect, async (req, res) => {
  const { tool_id, part_id, person_name, notes } = req.body;

  if (!tool_id || !person_name) {
    return res.status(400).json({ message: 'Tool and Person Name are required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      'UPDATE tools SET status = ? WHERE id = ?',
      ['OUT', tool_id]
    );

    await connection.execute(
      'INSERT INTO inout_history (tool_id, part_id, action, person_name, condition_status, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [tool_id, part_id || null, 'OUT', person_name, 'Good', notes || null]
    );

    await connection.commit();
    res.status(201).json({ message: 'Tool issued successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error issuing tool:', error);
    res.status(500).json({ message: 'Server error issuing tool' });
  } finally {
    connection.release();
  }
});

// Return a tool (IN)
router.post('/return', protect, async (req, res) => {
  const { tool_id, part_id, person_name, condition_status, notes } = req.body;

  if (!tool_id || !person_name || !condition_status) {
    return res.status(400).json({ message: 'Tool, Person Name, and Condition are required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const toolStatus = condition_status === 'Damaged' ? 'Damaged' : 'IN';

    await connection.execute(
      'UPDATE tools SET status = ? WHERE id = ?',
      [toolStatus, tool_id]
    );

    await connection.execute(
      'INSERT INTO inout_history (tool_id, part_id, action, person_name, condition_status, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [tool_id, part_id || null, 'IN', person_name, condition_status, notes || null]
    );

    await connection.commit();
    res.status(201).json({ message: 'Tool returned successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error returning tool:', error);
    res.status(500).json({ message: 'Server error returning tool' });
  } finally {
    connection.release();
  }
});

module.exports = router;
