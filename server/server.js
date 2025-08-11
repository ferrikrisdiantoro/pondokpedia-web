const express = require('express');
const cors = require('cors');
const dictionaryRoutes = require('./routes/dictionary');
const authRoutes = require('./routes/authRoutes');
const kataRoutes = require('./routes/kataRoutes');
const userRoutes = require('./routes/userRoutes');
const kontakRoutes = require('./routes/kontakRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const blogRoutes = require('./routes/blogRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const kamusRoutes = require('./routes/kamusRoutes');
const glosariumRoutes = require('./routes/glosariumRoutes');
const loginpageRoutes = require('./routes/loginpageRoutes');
const predictRoutes = require('./api/predict');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/api', dictionaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/kata', kataRoutes);
app.use('/api/user', userRoutes);
app.use('/api/kontak', kontakRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/halaman_kamus', kamusRoutes);
app.use('/api/halaman_glosarium', glosariumRoutes);
app.use('/api/halaman_login', loginpageRoutes);
app.use('/api/predict', predictRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error("Error:", err);  // Tambahkan log untuk memeriksa error
  res.status(500).json({ message: "Something went wrong!" });
});

