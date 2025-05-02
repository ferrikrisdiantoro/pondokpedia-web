import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddBlog = () => {
    const [judul, setJudul] = useState('');
    const [isi, setIsi] = useState('');
    const [jenis, setJenis] = useState('');
    const [gambar, setGambar] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('judul', judul);
        formData.append('isi', isi);
        formData.append('jenis', jenis);
    
        if (gambar) {
            formData.append('gambar', gambar);
        } else {
            console.error("Gambar tidak dipilih!");
            return;  // Jika gambar tidak ada, hentikan pengiriman data
        }
    
        try {
            await axios.post('http://localhost:5000/api/blog', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ini penting untuk mengirimkan file
                }
            });
            navigate('/admin/allblog');
        } catch (error) {
            console.error('Error adding blog:', error);
        }
    };
    

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Tambah Blog</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="judul" className="block mb-1 font-medium">Judul</label>
                            <input
                                type="text"
                                id="judul"
                                name="judul"
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="jenis" className="block mb-1 font-medium">Jenis</label>
                            <input
                                type="text"
                                id="jenis"
                                name="jenis"
                                value={jenis}
                                onChange={(e) => setJenis(e.target.value)}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="isi" className="block mb-1 font-medium">Isi</label>
                            <ReactQuill
                                id="isi"
                                value={isi}
                                onChange={setIsi}
                                className="bg-white rounded-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="gambar" className="block mb-1 font-medium">Gambar</label>
                            <input
                                type="file"
                                id="gambar"
                                name="gambar"
                                onChange={(e) => setGambar(e.target.files[0])}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <button
                            type="reset"
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                            onClick={() => {
                                setJudul('');
                                setJenis('');
                                setIsi('');
                                setGambar(null);
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg"
                        >
                            Tambah Blog
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBlog;
