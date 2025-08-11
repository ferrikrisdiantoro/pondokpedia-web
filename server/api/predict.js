const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Teks tidak boleh kosong.' });

    // Panggil Python API untuk cari jawaban
    const response = await axios.post('http://localhost:8000/get_answer', { text });

    if (response.data.error) {
      return res.status(200).json({ answer: response.data.error });
    }

    return res.json({
      predicted_answer: response.data.answer
    });


  } catch (err) {
    console.error('Error saat memanggil API Python:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;
