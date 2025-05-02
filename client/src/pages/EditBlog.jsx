import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill style

const EditBlog = () => {
    const { id } = useParams(); // Mengambil ID dari parameter URL
    const [judul, setJudul] = useState('');
    const [isi, setIsi] = useState('');
    const [jenis, setJenis] = useState('');
    const [gambar, setGambar] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/blog/${id}`);
                const { judul, isi, jenis, gambar } = response.data.data;
                setJudul(judul);
                setIsi(isi);
                setJenis(jenis);
                setGambar(gambar); // Set gambar dari API
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };
        fetchBlog();
    }, [id]);    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('judul', judul);
        formData.append('isi', isi);
        formData.append('jenis', jenis);
        
        // Tambahkan gambar lama atau baru ke formData
        if (gambar && gambar instanceof File) {
            formData.append('gambar', gambar); // Jika file baru dipilih
        } else if (gambar && typeof gambar === 'string') {
            formData.append('gambar_lama', gambar); // Kirim gambar lama
        }
    
        try {
            await axios.put(`http://localhost:5000/api/blog/${id}`, formData);
            navigate('/admin/allblog');
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded">
            <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Judul */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Judul</label>
                    <input
                        type="text"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        className="w-full border px-4 py-2 rounded"
                        required
                    />
                </div>

                {/* Jenis */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Jenis</label>
                    <input
                        type="text"
                        value={jenis}
                        onChange={(e) => setJenis(e.target.value)}
                        className="w-full border px-4 py-2 rounded"
                        required
                    />
                </div>

                {/* Isi */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Isi</label>
                    <ReactQuill value={isi} onChange={setIsi} className="bg-white rounded" />
                </div>

                {/* Gambar */}
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Gambar</label>
                    {gambar && typeof gambar === "string" && (
                        <img
                            src={`http://localhost:5000${gambar}`}
                            alt="Preview Gambar"
                            className="w-32 h-32 object-cover mb-2 rounded"
                        />
                    )}
                    <input
                        type="file"
                        onChange={(e) => setGambar(e.target.files[0])}
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>
                {/* Submit */}
                <button
                    type="submit"
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                >
                    Update Blog
                </button>
            </form>
        </div>
    );
};

export default EditBlog;
