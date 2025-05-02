const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Koneksi database
const multer = require('multer');
const path = require('path');

// **Get All About Data**
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM halaman_login');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch halaman_login data.' });
    }
});

// **Get About Data by ID**
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM halaman_login WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'halaman_login data not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch halaman_login data.' });
    }
});

const upload = multer({
    dest: path.join(__dirname, '../public/images/halaman_login/'),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only images are allowed.'));
        }
        cb(null, true);
    },
});


// Tambahkan middleware upload untuk route PUT
router.put('/:id', upload.fields([{ name: 'gambar' }]), async (req, res) => {
    try {
        const gambar = req.files.gambar
        ? `/images/halaman_login/${req.files.gambar[0].filename}`
        : null;

        console.log('File path to save:', gambar);

        const [result] = await db.query(
            'UPDATE halaman_login SET gambar = ? WHERE id = ?',
            [gambar, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'halaman_login data not found.' });
        }

        res.json({ success: true, message: 'halaman_login data updated successfully.' });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to update halaman_login data.', error: error.message });
    }
});



// **Delete About Data by ID**
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM halaman_login WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'halaman_login data not found.' });
        }
        res.json({ success: true, message: 'halaman_login data deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete halaman_login data.' });
    }
});

module.exports = router;
