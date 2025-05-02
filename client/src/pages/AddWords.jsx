import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/kata';

const AddWords = () => {
    const [kataList, setKataList] = useState([]);
    const [formData, setFormData] = useState({
        kata_id: '',
        kata_en: '',
        kata_ar: '',
        kalimat_id: [{ id: '', en: '', ar: '' }],  // Menyimpan array untuk kalimat_id dan kalimat_ar
    });
    const [editingId, setEditingId] = useState(null);

    // Fetch all data
    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/kata');
            console.log(response.data); // Periksa apakah properti sesuai
            setKataList(response.data.data); // Gunakan respons yang sesuai
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = (e, index, field) => {
        const { value } = e.target;
        const newKalimat = [...formData.kalimat_id];
        newKalimat[index] = { ...newKalimat[index], [field]: value };
        setFormData({ ...formData, kalimat_id: newKalimat });
    };

    const validateForm = () => {
        // Validasi untuk memastikan kata_id dan kata_ar tidak kosong
        if (!formData.kata_id || !formData.kata_en || !formData.kata_ar) {
            alert('Kata ID, Kata EN dan Kata Arabic harus diisi!');
            return false;
        }
    
        // Validasi untuk memastikan kalimat_id dan kalimat_ar memiliki nilai
        for (let i = 0; i < formData.kalimat_id.length; i++) {
            if (!formData.kalimat_id[i].id || !formData.kalimat_id[i].en || !formData.kalimat_id[i].ar) {
                alert(`Kalimat ID ${i + 1}, Kalimat EN ${i + 1} dan Kalimat Arabic ${i + 1} harus diisi!`);
                return false;
            }
        }
        return true;
    };

    const prepareDataForBackend = () => {
        const data = {
            kata_id: formData.kata_id,
            kata_en: formData.kata_en,
            kata_ar: formData.kata_ar,
        };
    
        // Konversi kalimat_id menjadi kalimat_id1, kalimat_id2, dll.
        formData.kalimat_id.forEach((kalimat, index) => {
            data[`kalimat_id${index + 1}`] = kalimat.id;
            data[`kalimat_en${index + 1}`] = kalimat.en;
            data[`kalimat_ar${index + 1}`] = kalimat.ar;
        });
    
        return data;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) return;
    
        const preparedData = prepareDataForBackend();
    
        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, preparedData);
            } else {
                await axios.post(API_URL, preparedData);
            }
            fetchData();
            setEditingId(null);
            resetForm();
        } catch (error) {
            console.error("Error submitting form:", error.response ? error.response.data : error.message);
        }
    };
    

    // Fungsi untuk mereset form
    const resetForm = () => {
        setFormData({
            kata_id: '',
            kata_en: '',
            kata_ar: '',
            kalimat_id: [{ id: '', en: '', ar: '' }], // Reset ke form awal dengan satu set kalimat
        });
    };

    // Fungsi untuk menghapus semua isi form
    const handleClear = () => {
        resetForm();
    };

    // Fungsi untuk menambah kalimat baru
    const handleAddKalimat = () => {
        if (formData.kalimat_id.length < 6) {
            setFormData({
                ...formData,
                kalimat_id: [...formData.kalimat_id, { id: '', en: '', ar: '' }],
            });
        } else {
            alert('Maksimal 6 kalimat yang dapat ditambahkan');
        }
    };


    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Tambah Kata</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="kata_id"
                    value={formData.kata_id}
                    onChange={(e) => setFormData({ ...formData, kata_id: e.target.value })}
                    placeholder="Kata Bahasa Indonesia"
                    className="border p-2 w-full"
                    required
                />
                <input
                    name="kata_en"
                    value={formData.kata_en}
                    onChange={(e) => setFormData({ ...formData, kata_en: e.target.value })}
                    placeholder="Kata Bahasa Inggris"
                    className="border p-2 w-full"
                    required
                />
                <input
                    name="kata_ar"
                    value={formData.kata_ar}
                    onChange={(e) => setFormData({ ...formData, kata_ar: e.target.value })}
                    placeholder="Kata Bahasa Arab"
                    className="border p-2 w-full"
                    required
                />
                {formData.kalimat_id.map((kalimat, index) => (
                    <div key={index} className="flex space-x-4">
                        <input
                            name={`kalimat_id${index + 1}`}
                            value={kalimat.id}
                            onChange={(e) => handleChange(e, index, 'id')}
                            placeholder={`Kalimat dalam Bahasa Indonesia ${index + 1}`}
                            className="border p-2 w-full"
                            required
                        />
                        <input
                            name={`kalimat_en${index + 1}`}
                            value={kalimat.en}
                            onChange={(e) => handleChange(e, index, 'en')}
                            placeholder={`Kalimat dalam Bahasa Inggris ${index + 1}`}
                            className="border p-2 w-full"
                            required
                        />
                        <input
                            name={`kalimat_ar${index + 1}`}
                            value={kalimat.ar}
                            onChange={(e) => handleChange(e, index, 'ar')}
                            placeholder={`Kalimat dalam Bahasa Arab ${index + 1}`}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddKalimat}
                    className="bg-green-600 text-white px-4 py-2 rounded mt-2"
                >
                    Tambah Kalimat
                </button>
                <div className="flex space-x-4 mt-4">
                    <button
                        type="submit"
                        className="bg-emerald-600 text-white px-4 py-2 rounded"
                    >
                        {editingId ? 'Update' : 'Tambah'}
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default AddWords;
