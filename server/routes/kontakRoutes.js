const express = require('express');
const router = express.Router();
const db = require('../config/db');

// **Get Contact Info**
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM contacts LIMIT 1'); // Ambil hanya satu data kontak (karena ini untuk halaman)
        res.json({ success: true, data: rows[0] || null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch contact info.' });
    }
});

// Backend - Express.js
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { judul_halaman, paragraf, alamat, jam_kerja, kontak, link_gmap } = req.body;
    try {
        const query = `
            UPDATE contacts
            SET judul_halaman = ?, paragraf = ?, alamat = ?, jam_kerja = ?, kontak = ?, link_gmap = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [
            judul_halaman, paragraf, alamat, jam_kerja, kontak, link_gmap, id
        ]);
        if (result.affectedRows > 0) {
            res.json({ success: true, data: req.body });
        } else {
            res.status(404).json({ success: false, message: 'Kontak not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update kontak' });
    }
});


// **Add New Contact Info**
// (Opsional jika Anda ingin menambahkan data baru, meski untuk halaman kontak biasanya hanya ada satu data.)
router.post('/', async (req, res) => {
    const { judul_halaman, paragraf, alamat, jam_kerja, kontak, link_gmap } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO contacts (judul_halaman, paragraf, alamat, jam_kerja, kontak, link_gmap, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [judul_halaman, paragraf, alamat, jam_kerja, kontak, link_gmap]
        );

        res.status(201).json({ success: true, message: 'New contact info added successfully.', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to add new contact info.' });
    }
});

module.exports = router;
