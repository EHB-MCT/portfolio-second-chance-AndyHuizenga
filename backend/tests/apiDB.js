const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/osc-data', async (req, res) => {
  const { x, y, z } = req.body;

  try {
    // Save the OSC data to the database
    const insertQuery = `
      INSERT INTO osc_data (x, y, z)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    const result = await db.one(insertQuery, [x, y, z]);

    res.status(201).json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
module.exports.db = db;
