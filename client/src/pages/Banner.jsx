import React, { useState, useEffect } from 'react';

const Banner = () => {
    const [formData, setFormData] = useState({
        banner1: '',
        banner2: '',
        banner3: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBannerData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/banner');
                const result = await response.json();
                if (result.success) {
                    setFormData(result.data[0]); // Pastikan data benar
                } else {
                    setError('Failed to fetch banner data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBannerData();
    }, []);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('banner1', formData.banner1);
        formDataToSend.append('banner2', formData.banner2);
        formDataToSend.append('banner3', formData.banner3);

        try {
            const response = await fetch(`http://localhost:5000/api/banner/${formData.id}`, {
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
            alert('Banner berhasil diperbarui!');
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
                <h2 className="text-2xl font-bold mb-4">Edit Banner</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        {/* Banner 1 */}
                        <div>
                            <label htmlFor="banner1" className="block mb-1 font-medium">Banner 1</label>
                            <input
                                type="file"
                                id="banner1"
                                name="banner1"
                                onChange={handleFileChange}
                                className="w-full border rounded-lg p-2"
                            />
                            {formData.banner1 && typeof formData.banner1 === 'string' && (
                                <img src={formData.banner1} alt="Banner 1" className="mt-2 w-32" />
                            )}
                        </div>

                        {/* Banner 2 */}
                        <div>
                            <label htmlFor="banner2" className="block mb-1 font-medium">Banner 2</label>
                            <input
                                type="file"
                                id="banner2"
                                name="banner2"
                                onChange={handleFileChange}
                                className="w-full border rounded-lg p-2"
                            />
                            {formData.banner2 && typeof formData.banner2 === 'string' && (
                                <img src={formData.banner2} alt="Banner 2" className="mt-2 w-32" />
                            )}
                        </div>

                        {/* Banner 3 */}
                        <div>
                            <label htmlFor="banner3" className="block mb-1 font-medium">Banner 3</label>
                            <input
                                type="file"
                                id="banner3"
                                name="banner3"
                                onChange={handleFileChange}
                                className="w-full border rounded-lg p-2"
                            />
                            {formData.banner3 && typeof formData.banner3 === 'string' && (
                                <img src={formData.banner3} alt="Banner 3" className="mt-2 w-32" />
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

export default Banner;
