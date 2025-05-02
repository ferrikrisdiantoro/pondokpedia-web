import React, { useState, useEffect } from 'react';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        gambar: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLoginData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/halaman_login');
                const result = await response.json();
                console.log('Result:', result); // Debug respons API
                if (result.success) {
                    setFormData(result.data[0]); // Pastikan data benar
                } else {
                    setError('Failed to fetch halaman_login data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchLoginData();
    }, []);
    
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        if (formData.gambar instanceof File) formDataToSend.append('gambar', formData.gambar);
        try {
            const response = await fetch(`http://localhost:5000/api/halaman_login/${formData.id}`, {
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
                <h2 className="text-2xl font-bold mb-4">Edit Halaman Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="gambar" className="block mb-1 font-medium">Gambar Halaman Login</label>
                            <input
                                type="file"
                                id="gambar"
                                name="gambar"
                                onChange={handleFileChange}
                                className="w-full border rounded-lg p-2"
                            />
                            {formData.gambar && typeof formData.gambar === 'string' && (
                                <img src={formData.gambar} alt="Gambar Halaman Login" className="mt-2 w-32" />
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

export default AdminLogin;
