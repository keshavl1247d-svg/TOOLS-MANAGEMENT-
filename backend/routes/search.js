const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const { type, q } = req.query;

  if (!type || !q) {
    return res.status(400).json({ message: 'Search type and query are required' });
  }

  const searchTerm = `%${q}%`;
  let query = '';
  let queryParams = [];

  try {
    if (type === 'part_number') {
      query = `
        SELECT p.id as part_id, p.part_number, p.part_name, p.quantity, p.location, p.status, p.photo,
               t.tool_name, t.tool_number
        FROM parts p
        LEFT JOIN tools t ON p.id = t.part_id
        WHERE p.part_number LIKE ?
      `;
      queryParams = [searchTerm];
    } else if (type === 'tool_name') {
      query = `
        SELECT t.id as tool_id, t.tool_number, t.tool_name, t.status as tool_status,
               p.part_number, p.part_name, p.quantity, p.location, p.photo
        FROM tools t
        LEFT JOIN parts p ON t.part_id = p.id
        WHERE t.tool_name LIKE ? OR t.tool_number LIKE ?
      `;
      queryParams = [searchTerm, searchTerm];
    } else if (type === 'part_name') {
      query = `
        SELECT p.id as part_id, p.part_number, p.part_name, p.quantity, p.location, p.status, p.photo,
               t.tool_name, t.tool_number
        FROM parts p
        LEFT JOIN tools t ON p.id = t.part_id
        WHERE p.part_name LIKE ?
      `;
      queryParams = [searchTerm];
    } else {
      return res.status(400).json({ message: 'Invalid search type' });
    }

    const [rows] = await pool.execute(query, queryParams);

    // Normalize results to match frontend expectations
    const results = rows.map(row => ({
      partNo: row.part_number,
      partName: row.part_name,
      toolName: row.tool_name,
      location: row.location,
      quantity: row.quantity,
      status: row.tool_status || row.status, // use tool status if searching by tool, else part status
      photo: row.photo
    }));

    res.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

module.exports = router;
