const db = require('../config/db');

exports.getWords = async (req, res) => {
  const query = `
    SELECT *
    FROM kamus_pesantren
    LIMIT 200;
  `;

  try {
    // Gunakan destructuring untuk hasil query
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Error fetching data' });
  }
};
