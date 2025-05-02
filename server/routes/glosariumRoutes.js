const express = require('express');
const router = express.Router();
const db = require('../config/db');

// **Get All About Data**
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM halaman_glosarium');
        console.log(rows); // Debug log
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch halaman_glosarium data.' });
    }
});


// **Get About Data by ID**
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM halaman_glosarium WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'halaman_glosarium data not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch halaman_glosarium data.' });
    }
});

// Tambahkan middleware upload untuk route PUT
router.put('/:id', async (req, res) => {
    console.log('Data yang diterima:', req.body); // Debug log untuk melihat data
    try {
        const { judul, isi } = req.body;
        const id = req.params.id; // Pastikan ID diterima dengan benar

        const [result] = await db.query(
            'UPDATE halaman_glosarium SET judul = ?, isi = ? WHERE id = ?',
            [judul, isi, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'halaman_glosarium data not found.' });
        }

        res.json({ success: true, message: 'halaman_glosarium data updated successfully.' });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update halaman_glosarium data.', error: error.message });
    }
});



module.exports = router;
