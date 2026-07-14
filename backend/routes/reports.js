const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

// Get daily report
router.get('/daily', protect, adminOnly, async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD format

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    // Activities for the specific date
    const [activities] = await pool.execute(`
      SELECT h.*, t.tool_name, t.tool_number, p.part_number, p.part_name
      FROM inout_history h
      LEFT JOIN tools t ON h.tool_id = t.id
      LEFT JOIN parts p ON h.part_id = p.id
      WHERE DATE(h.created_at) = ?
      ORDER BY h.created_at DESC
    `, [date]);

    let issuedCount = 0;
    let returnedCount = 0;
    
    activities.forEach(activity => {
      if (activity.action === 'OUT') issuedCount++;
      if (activity.action === 'IN') returnedCount++;
    });

    // Currently damaged total (from tools table)
    const [damagedResult] = await pool.execute("SELECT COUNT(*) as damagedCount FROM tools WHERE status = 'Damaged'");
    const damagedCount = damagedResult[0].damagedCount;

    res.json({
      issuedCount,
      returnedCount,
      damagedCount,
      activities
    });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    res.status(500).json({ message: 'Server error fetching daily report', debug: error.message });
  }
});

// Get monthly report
router.get('/monthly', protect, adminOnly, async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: 'Month and year are required' });
  }

  try {
    // Group by tool
    const [summaryRows] = await pool.execute(`
      SELECT 
        t.tool_name,
        SUM(CASE WHEN h.action = 'OUT' THEN 1 ELSE 0 END) as totalIssues,
        SUM(CASE WHEN h.action = 'IN' THEN 1 ELSE 0 END) as totalReturns,
        SUM(CASE WHEN h.action = 'IN' AND h.condition_status = 'Damaged' THEN 1 ELSE 0 END) as damagedReturns
      FROM inout_history h
      LEFT JOIN tools t ON h.tool_id = t.id
      WHERE MONTH(h.created_at) = ? AND YEAR(h.created_at) = ?
      GROUP BY t.id, t.tool_name
    `, [month, year]);

    let totalIssues = 0;
    let totalReturns = 0;
    let mostIssuedTool = null;
    let maxIssues = -1;

    const summary = summaryRows.map(row => {
      const issues = parseInt(row.totalIssues) || 0;
      const returns = parseInt(row.totalReturns) || 0;
      
      totalIssues += issues;
      totalReturns += returns;
      
      if (issues > maxIssues) {
        maxIssues = issues;
        mostIssuedTool = row.tool_name;
      }

      return {
        toolName: row.tool_name || 'Unknown Tool',
        totalIssues: issues,
        totalReturns: returns,
        damagedReturns: parseInt(row.damagedReturns) || 0
      };
    });

    res.json({
      summary,
      totalIssues,
      totalReturns,
      mostIssuedTool: mostIssuedTool || 'N/A'
    });
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    res.status(500).json({ message: 'Server error fetching monthly report' });
  }
});

module.exports = router;
