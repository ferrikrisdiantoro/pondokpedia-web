const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Koneksi database
const multer = require('multer');
const path = require('path');

// **Get All Blog Data**
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM blog');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch blog data.' });
    }
});

router.get('/count', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) AS count FROM blog');
        res.json({ count: rows[0].count });  // Mengembalikan jumlah kata
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error counting blog' });
    }
});

// **Get Blog by ID**
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM blog WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Blog not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch blog data.' });
    }
});

// Konfigurasi multer untuk upload gambar
const upload = multer({
    dest: path.join(__dirname, '../public/images/blog/'),
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only images are allowed.'));
        }
        cb(null, true);
    },
})

// **Create New Blog Data**
router.post('/', upload.single('gambar'), async (req, res) => {
    console.log(req.file);  // Log informasi tentang file yang diterima
    const { judul, isi, jenis } = req.body;
    const gambar = req.file ? `/images/blog/${req.file.filename}` : null;

    try {
        const [result] = await db.query(
            'INSERT INTO blog (judul, isi, jenis, gambar) VALUES (?, ?, ?, ?)',
            [judul, isi, jenis, gambar]
        );

        res.status(201).json({ success: true, message: 'Blog created successfully.', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create blog.' });
    }
});

;

// **Update Blog Data by ID**
router.put('/:id', upload.single('gambar'), async (req, res) => {
    try {
        const { judul, isi, jenis } = req.body;
        let gambar = req.file ? `/images/blog/${req.file.filename}` : req.body.gambar_lama;

        const [result] = await db.query(
            'UPDATE blog SET judul = ?, isi = ?, jenis = ?, gambar = ? WHERE id = ?',
            [judul, isi, jenis, gambar, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Blog not found.' });
        }

        res.json({ success: true, message: 'Blog updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update blog.' });
    }
});


// **Delete Blog Data by ID**
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM blog WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Blog not found.' });
        }
        res.json({ success: true, message: 'Blog deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete blog.' });
    }
});

module.exports = router;
