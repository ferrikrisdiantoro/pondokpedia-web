const express = require('express');
const router = express.Router();
const { getWords } = require('../controllers/dictionaryController');

// Route to fetch 200 words
router.get('/words', getWords);

module.exports = router;
