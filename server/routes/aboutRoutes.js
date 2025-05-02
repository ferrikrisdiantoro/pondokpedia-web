const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Koneksi database
const multer = require('multer');
const path = require('path');

// **Get All About Data**
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM about');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch about data.' });
    }
});

// **Get About Data by ID**
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM about WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'About data not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch about data.' });
    }
});

// **Create New About Data**
router.post('/', async (req, res) => {
    const { judul_halaman, paragraf, gambar1, gambar2 } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO about (judul_halaman, paragraf, gambar1, gambar2) VALUES (?, ?, ?, ?)',
            [judul_halaman, paragraf, gambar1, gambar2]
        );
        res.status(201).json({ success: true, message: 'About data created successfully.', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create about data.' });
    }
});

const upload = multer({
    dest: path.join(__dirname, '../public/images/about/'),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only images are allowed.'));
        }
        cb(null, true);
    },
});

// Tambahkan middleware upload untuk route PUT
router.put('/:id', upload.fields([{ name: 'gambar1' }, { name: 'gambar2' }]), async (req, res) => {
    try {
        const { judul_halaman, paragraf } = req.body;
        const gambar1 = req.files.gambar1 ? `/images/about/${req.files.gambar1[0].filename}` : null;
        const gambar2 = req.files.gambar2 ? `/images/about/${req.files.gambar2[0].filename}` : null;

        const [result] = await db.query(
            'UPDATE about SET judul_halaman = ?, paragraf = ?, gambar1 = ?, gambar2 = ? WHERE id = ?',
            [judul_halaman, paragraf, gambar1, gambar2, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'About data not found.' });
        }

        res.json({ success: true, message: 'About data updated successfully.' });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update about data.', error: error.message });
    }
});


// **Delete About Data by ID**
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM about WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'About data not found.' });
        }
        res.json({ success: true, message: 'About data deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete about data.' });
    }
});

module.exports = router;
