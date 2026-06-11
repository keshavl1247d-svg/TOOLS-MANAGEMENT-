const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, async (req, res) => {
  try {
    // Get tool stats
    const [toolStats] = await pool.execute(`
      SELECT 
        COUNT(*) as totalTools,
        SUM(CASE WHEN status = 'IN' THEN 1 ELSE 0 END) as inTools,
        SUM(CASE WHEN status = 'OUT' THEN 1 ELSE 0 END) as outTools,
        SUM(CASE WHEN status = 'Damaged' THEN 1 ELSE 0 END) as damagedTools
      FROM tools
    `);

    // Available stock count (from parts table)
    const [partStats] = await pool.execute(`
      SELECT SUM(quantity) as availableStock FROM parts WHERE status = 'Available'
    `);

    // Recent 8 activity entries
    const [recentActivity] = await pool.execute(`
      SELECT h.*, t.tool_name, t.tool_number, p.part_number, p.part_name
      FROM inout_history h
      LEFT JOIN tools t ON h.tool_id = t.id
      LEFT JOIN parts p ON h.part_id = p.id
      ORDER BY h.created_at DESC
      LIMIT 8
    `);

    res.json({
      totalTools: parseInt(toolStats[0].totalTools) || 0,
      inTools: parseInt(toolStats[0].inTools) || 0,
      outTools: parseInt(toolStats[0].outTools) || 0,
      damagedTools: parseInt(toolStats[0].damagedTools) || 0,
      availableStock: parseInt(partStats[0].availableStock) || 0,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

module.exports = router;
