import React, { useState, useEffect } from 'react';

const AdminKamus = () => {
    const [formData, setFormData] = useState({
        judul: '',
        isi: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mengambil data dari API saat komponen dimuat
    useEffect(() => {
        const fetchKamusData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/halaman_kamus');
                const data = await response.json();
                console.log(data); // Debugging line to check the API response
    
                if (data.success && data.data && data.data.length > 0) {
                    setFormData(data.data[0]);  // Assuming the API returns an array with data[0]
                    setLoading(false);
                } else {
                    setLoading(false);
                    setError('Data tidak ditemukan.');
                }
            } catch (error) {
                console.error('Error fetching halaman_kamus data:', error);
                setLoading(false);
                setError('Terjadi kesalahan saat mengambil data.');
            }
        };
    
        fetchKamusData();
    }, []);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = () => {
        setFormData({
            judul: '',
            isi: '',
        });
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const dataToSend = {
            judul: formData.judul,
            isi: formData.isi,
        };
    
        try {
            const response = await fetch(`http://localhost:5000/api/halaman_kamus/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
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
                <h2 className="text-2xl font-bold mb-4">Edit Halaman Kamus</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="judul_halaman" className="block mb-1 font-medium">Judul Halaman</label>
                            <input
                                type="text"
                                id="judul"
                                name="judul"
                                value={formData.judul}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="paragraf" className="block mb-1 font-medium">Paragraf</label>
                            <textarea
                                id="isi"
                                name="isi"
                                value={formData.isi}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <button
                            type="reset"
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                            onClick={handleReset}
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

export default AdminKamus;
