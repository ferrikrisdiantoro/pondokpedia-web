import React, { useState, useEffect } from 'react';

const AdminContact = () => {
    const [formData, setFormData] = useState({
        id: '',
        judul_halaman: '',
        paragraf: '',
        alamat: '',
        jam_kerja: '',
        kontak: '',
        link_gmap: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/kontak');
                const result = await response.json();
                if (result.success) {
                    setFormData({
                        id: result.data.id, // Tambahkan id ke formData
                        judul_halaman: result.data.judul_halaman,
                        paragraf: result.data.paragraf,
                        alamat: result.data.alamat,
                        jam_kerja: result.data.jam_kerja,
                        kontak: result.data.kontak,
                        link_gmap: result.data.link_gmap,
                    });
                } else {
                    setError('Failed to fetch contact data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContactData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/kontak/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response from server:', errorText);
                throw new Error('Gagal menyimpan perubahan.');
            }

            const result = await response.json();
            console.log('Success:', result);
            alert('Data berhasil disimpan!');
        } catch (error) {
            console.error('An error occurred:', error.message);
            alert('Terjadi kesalahan saat menyimpan data.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Edit Halaman Kontak</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="judul_halaman" className="block mb-1 font-medium">Judul Halaman</label>
                            <input
                                type="text"
                                id="judul_halaman"
                                name="judul_halaman"
                                value={formData.judul_halaman}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="paragraf" className="block mb-1 font-medium">Paragraf</label>
                            <textarea
                                id="paragraf"
                                name="paragraf"
                                value={formData.paragraf}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="alamat" className="block mb-1 font-medium">Alamat</label>
                            <textarea
                                id="alamat"
                                name="alamat"
                                value={formData.alamat}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="jam_kerja" className="block mb-1 font-medium">Jam Kerja</label>
                            <input
                                type="text"
                                id="jam_kerja"
                                name="jam_kerja"
                                value={formData.jam_kerja}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="kontak" className="block mb-1 font-medium">Kontak</label>
                            <textarea
                                id="kontak"
                                name="kontak"
                                value={formData.kontak}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="link_gmap" className="block mb-1 font-medium">Link Google Maps</label>
                            <input
                                type="text"
                                id="link_gmap"
                                name="link_gmap"
                                value={formData.link_gmap}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <button
                            type="reset"
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                            onClick={() => window.location.reload()}
                        >
                            Reset
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

export default AdminContact;
