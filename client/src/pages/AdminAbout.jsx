import React, { useState, useEffect } from 'react';

const AdminAbout = () => {
    const [formData, setFormData] = useState({
        judul_halaman: '',
        paragraf: '',
        gambar1: '',
        gambar2: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/about');
                const result = await response.json();
                console.log('Result:', result); // Debug respons API
                if (result.success) {
                    setFormData(result.data[0]); // Pastikan data benar
                } else {
                    setError('Failed to fetch about data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchAboutData();
    }, []);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('judul_halaman', formData.judul_halaman);
        formDataToSend.append('paragraf', formData.paragraf);
        if (formData.gambar1 instanceof File) formDataToSend.append('gambar1', formData.gambar1);
        if (formData.gambar2 instanceof File) formDataToSend.append('gambar2', formData.gambar2);

        try {
            const response = await fetch(`http://localhost:5000/api/about/${formData.id}`, {
                method: 'PUT',
                body: formDataToSend,
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
                <h2 className="text-2xl font-bold mb-4">Edit About</h2>
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
                            <label htmlFor="gambar1" className="block mb-1 font-medium">Gambar 1</label>
                            <input
                                type="file"
                                id="gambar1"
                                name="gambar1"
                                onChange={handleFileChange}
                                className="w-full border rounded-lg p-2"
                            />
                            {formData.gambar1 && typeof formData.gambar1 === 'string' && (
                                <img src={formData.gambar1} alt="Gambar 1" className="mt-2 w-32" />
                            )}
                        </div>
                        <div>
                            <label htmlFor="gambar2" className="block mb-1 font-medium">Gambar 2</label>
                            <input
                                type="file"
                                id="gambar2"
                                name="gambar2"
                                onChange={handleFileChange}
                                className="w-full border rounded-lg p-2"
                            />
                            {formData.gambar2 && typeof formData.gambar2 === 'string' && (
                                <img src={formData.gambar2} alt="Gambar 2" className="mt-2 w-32" />
                            )}
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

export default AdminAbout;
