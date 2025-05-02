const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

function validateData(req, res, next) {
    const { name, email, password, role } = req.body;

    // Memeriksa jika name, email, password, atau role kosong
    if (!name || !email || !password || !role) {
        return res.status(400).json({
            message: 'Invalid data. "name", "email", "password", and "role" are required.'
        });
    }

    console.log('Validated Data:', req.body);
    next();
}


// **Get All Users**
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email, role FROM users');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
});

router.get('/count', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) AS count FROM users');
        console.log('Query result:', rows);  // Menambahkan log untuk memeriksa hasil query
        if (rows[0].count > 0) {
            res.json({ count: rows[0].count });
        } else {
            res.json({ count: 0 });  // Return 0 instead of an error
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error counting users' });
    }
});

// **Get Single User**
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
});

// **Create User**
router.post('/', validateData, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Enkripsi password sebelum disimpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan data user ke database dengan password yang sudah dienkripsi
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create user.' });
    }
});

// **Update User**
router.put('/:id', async (req, res) => {
    const { name, email, role, password } = req.body;

    // Validasi data
    if (!name || !email || !role) {
        return res.status(400).json({ success: false, message: 'Name, email, and role are required.' });
    }

    // Cek apakah password diperlukan untuk update (jika password tidak diubah, bisa diabaikan)
    const dataToUpdate = { name, email, role };

    // Jika password diberikan, hash password dan tambahkan ke dataToUpdate
    if (password) {
        // Misalnya menggunakan bcrypt untuk hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
        dataToUpdate.password = hashedPassword;
    }

    try {
        const [result] = await db.query('UPDATE users SET ? WHERE id = ?', [dataToUpdate, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json({ success: true, message: 'User updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
});




// **Delete User**
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
});







module.exports = router;
