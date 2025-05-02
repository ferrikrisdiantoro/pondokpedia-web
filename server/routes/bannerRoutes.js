const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Koneksi database
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// **Get All Banners**
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM banners');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch banners.' });
    }
});

// **Get Banner by ID**
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM banners WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Banner not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch banner data.' });
    }
});

// Setup multer untuk upload gambar
const upload = multer({
    dest: path.join(__dirname, '../public/images/banner/'),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only images are allowed.'));
        }
        cb(null, true);
    },
});

// **Update Banner**
router.put('/:id', upload.fields([{ name: 'banner1' }, { name: 'banner2' }, { name: 'banner3' }]), async (req, res) => {
    try {
        const { id } = req.params;
        const { banner1_lama, banner2_lama, banner3_lama } = req.body;
        let banner1 = banner1_lama;
        let banner2 = banner2_lama;
        let banner3 = banner3_lama;

        // Jika ada gambar baru untuk banner1
        if (req.files['banner1']) {
            const ext = path.extname(req.files['banner1'][0].originalname);
            const newFilename = `banner1-${Date.now()}${ext}`;
            const newPath = path.join(__dirname, '../public/images/banner/', newFilename);
            fs.renameSync(req.files['banner1'][0].path, newPath);  // Pindahkan file ke lokasi yang benar
            banner1 = `/images/banner/${newFilename}`; // Update URL gambar
        }

        // Jika ada gambar baru untuk banner2
        if (req.files['banner2']) {
            const ext = path.extname(req.files['banner2'][0].originalname);
            const newFilename = `banner2-${Date.now()}${ext}`;
            const newPath = path.join(__dirname, '../public/images/banner/', newFilename);
            fs.renameSync(req.files['banner2'][0].path, newPath);  // Pindahkan file ke lokasi yang benar
            banner2 = `/images/banner/${newFilename}`; // Update URL gambar
        }

        // Jika ada gambar baru untuk banner3
        if (req.files['banner3']) {
            const ext = path.extname(req.files['banner3'][0].originalname);
            const newFilename = `banner3-${Date.now()}${ext}`;
            const newPath = path.join(__dirname, '../public/images/banner/', newFilename);
            fs.renameSync(req.files['banner3'][0].path, newPath);  // Pindahkan file ke lokasi yang benar
            banner3 = `/images/banner/${newFilename}`; // Update URL gambar
        }

        // Update data banner di database
        const [result] = await db.query('UPDATE banners SET banner1 = ?, banner2 = ?, banner3 = ? WHERE id = ?', [banner1, banner2, banner3, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Banner not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Banner updated successfully',
            data: { id, banner1, banner2, banner3 }, // Kembalikan data banner yang baru
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update banner', error: error.message });
    }
});

module.exports = router;
