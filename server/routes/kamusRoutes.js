const express = require('express');
const router = express.Router();
const db = require('../config/db');

// **Get All About Data**
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM halaman_kamus');
        console.log(rows); // Debug log
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch halaman_kamus data.' });
    }
});


// **Get About Data by ID**
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM halaman_kamus WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'halaman_kamus data not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch halaman_kamus data.' });
    }
});

// Tambahkan middleware upload untuk route PUT
router.put('/:id', async (req, res) => {
    console.log('Data yang diterima:', req.body); // Debug log untuk melihat data
    try {
        const { judul, isi } = req.body;
        const id = req.params.id; // Pastikan ID diterima dengan benar

        const [result] = await db.query(
            'UPDATE halaman_kamus SET judul = ?, isi = ? WHERE id = ?',
            [judul, isi, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'halaman_kamus data not found.' });
        }

        res.json({ success: true, message: 'halaman_kamus data updated successfully.' });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update halaman_kamus data.', error: error.message });
    }
});



module.exports = router;
