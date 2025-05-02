const express = require('express');
const router = express.Router();
const db = require('../config/db');

const validateData = (req, res, next) => {
    console.log("Request Body Received:", req.body); // Debugging
    const { kata_id, kata_en, kata_ar, kalimat_id1, kalimat_en1, kalimat_ar1 } = req.body;
    if (!kata_id || !kata_en || !kata_ar || !kalimat_id1 || !kalimat_en1 || !kalimat_ar1) {
        return res.status(400).json({ 
            message: 'Invalid data. "kata_id", "kata_en", "kata_ar", "kalimat_id1", "kalimat_en1" and "kalimat_ar1" are required.' 
        });
    }
    next();
};

// Get All Data
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM kamus_pesantren');
        console.log(rows); // Cek data yang dikembalikan dari database
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch data.' });
    }
});

router.get('/count', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) AS count FROM kamus_pesantren');
        res.json({ count: rows[0].count });  // Mengembalikan jumlah kata
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error counting kata' });
    }
});

// Get Single Data
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM kamus_pesantren WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Data not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch data.' });
    }
});

// Create Data
router.post('/', validateData, async (req, res) => {
    try {
        const {
            kata_id, kata_en, kata_ar,
            kalimat_id1, kalimat_en1, kalimat_ar1,
            kalimat_id2, kalimat_en2, kalimat_ar2,
            kalimat_id3, kalimat_en3, kalimat_ar3,
            kalimat_id4, kalimat_en4, kalimat_ar4,
            kalimat_id5, kalimat_en5, kalimat_ar5,
            kalimat_id6, kalimat_en6, kalimat_ar6,
        } = req.body;

        // Defaultkan nilai kosong menjadi NULL
        const data = [
            kata_id, kata_en, kata_ar,
            kalimat_id1 || null, kalimat_en1 || null, kalimat_ar1 || null,
            kalimat_id2 || null, kalimat_en2 || null, kalimat_ar2 || null,
            kalimat_id3 || null, kalimat_en3 || null, kalimat_ar3 || null,
            kalimat_id4 || null, kalimat_en4 || null, kalimat_ar4 || null,
            kalimat_id5 || null, kalimat_en5 || null, kalimat_ar5 || null,
            kalimat_id6 || null, kalimat_en6 || null, kalimat_ar6 || null,
        ];

        const query = `
            INSERT INTO kamus_pesantren (
                kata_id, kata_en, kata_ar,
                kalimat_id1, kalimat_en1, kalimat_ar1,
                kalimat_id2, kalimat_en2, kalimat_ar2,
                kalimat_id3, kalimat_en3, kalimat_ar3,
                kalimat_id4, kalimat_en4, kalimat_ar4,
                kalimat_id5, kalimat_en5, kalimat_ar5,
                kalimat_id6, kalimat_en6, kalimat_ar6
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, data);
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error("Error executing query:", error.message);
        res.status(500).json({ success: false, message: 'Failed to create data.' });
    }
});


// Update Data
router.put('/:id', validateData, async (req, res) => {
    try {
        const data = req.body;
        const [result] = await db.query('UPDATE kamus_pesantren SET ? WHERE id = ?', [data, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Data not found.' });
        }
        res.json({ success: true, message: 'Data updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update data.' });
    }
});

// Delete Data
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM kamus_pesantren WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Data not found.' });
        }
        res.json({ success: true, message: 'Data deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete data.' });
    }
});




module.exports = router;
