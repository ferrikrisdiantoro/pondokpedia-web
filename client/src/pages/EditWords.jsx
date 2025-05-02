import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/kata';

const EditWords = () => {
    const { id } = useParams(); // Ambil ID dari URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        kata_id: '',
        kata_en: '',
        kata_ar: '',
        kalimat_id1: '',
        kalimat_id2: '',
        kalimat_id3: '',
        kalimat_id4: '',
        kalimat_id5: '',
        kalimat_id6: '',
        kalimat_en1: '',
        kalimat_en2: '',
        kalimat_en3: '',
        kalimat_en4: '',
        kalimat_en5: '',
        kalimat_en6: '',
        kalimat_ar1: '',
        kalimat_ar2: '',
        kalimat_ar3: '',
        kalimat_ar4: '',
        kalimat_ar5: '',
        kalimat_ar6: '',
    });

    const [loading, setLoading] = useState(true);

    // Fetch data untuk kata tertentu berdasarkan ID
    useEffect(() => {
        const fetchKata = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                console.log('API Response:', response.data);
                setFormData(response.data.data);
            } catch (error) {
                console.error('Error fetching kata:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchKata();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/${id}`, formData);
            alert('Data berhasil diperbarui!');
            navigate('/admin/allwords'); // Kembali ke halaman tabel
        } catch (error) {
            console.error('Error updating data:', error);
            alert('Gagal memperbarui data.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4">Edit Kata</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Kata ID dan Kata Arabic */}
                        <div>
                            <label htmlFor="kata_id" className="block mb-1 font-medium">Kata ID</label>
                            <input
                                type="text"
                                id="kata_id"
                                name="kata_id"
                                value={formData.kata_id}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="kata_id" className="block mb-1 font-medium">Kata EN</label>
                            <input
                                type="text"
                                id="kata_en"
                                name="kata_en"
                                value={formData.kata_en}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="kata_ar" className="block mb-1 font-medium">Kata Arabic</label>
                            <input
                                type="text"
                                id="kata_ar"
                                name="kata_ar"
                                value={formData.kata_ar}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>

                        {/* Loop untuk kalimat ID dan kalimat Arabic */}
                        {[...Array(6)].map((_, i) => (
                            <div className="grid grid-cols-2 gap-4" key={`kalimat-${i + 1}`}>
                                <div>
                                    <label
                                        htmlFor={`kalimat_id${i + 1}`}
                                        className="block mb-1 font-medium"
                                    >
                                        Kalimat ID {i + 1}
                                    </label>
                                    <input
                                        type="text"
                                        id={`kalimat_id${i + 1}`}
                                        name={`kalimat_id${i + 1}`}
                                        value={formData[`kalimat_id${i + 1}`]}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor={`kalimat_en${i + 1}`}
                                        className="block mb-1 font-medium"
                                    >
                                        Kalimat EN {i + 1}
                                    </label>
                                    <input
                                        type="text"
                                        id={`kalimat_en${i + 1}`}
                                        name={`kalimat_en${i + 1}`}
                                        value={formData[`kalimat_en${i + 1}`]}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor={`kalimat_ar${i + 1}`}
                                        className="block mb-1 font-medium"
                                    >
                                        Kalimat Arabic {i + 1}
                                    </label>
                                    <input
                                        type="text"
                                        id={`kalimat_ar${i + 1}`}
                                        name={`kalimat_ar${i + 1}`}
                                        value={formData[`kalimat_ar${i + 1}`]}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg p-2"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/allwords')}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditWords;
