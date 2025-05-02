import React, { useState, useEffect } from 'react';

const About = () => {
    const [formData, setformData] = useState(null);

    // Mengambil data dari API saat komponen dimuat
    useEffect(() => {
        const fetchformData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/about'); // Ganti dengan URL API yang sesuai
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    setformData(data.data[0]); // Ambil data pertama dari hasil query
                }
            } catch (error) {
                console.error('Error fetching about data:', error);
            }
        };

        fetchformData();
    }, []);

    // Menampilkan loading state atau pesan error jika data tidak ditemukan
    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
<section className="py-24 relative w-full mx-auto bg-emerald-700 min-h-screen">
<div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
    <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
        <div
            className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
            <div className="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex">
            {formData.gambar1 && typeof formData.gambar1 === 'string' && (
                <img
                    src={`http://localhost:5000${formData.gambar1}`}
                    alt="Gambar 1"
                    className="sm:ml-0 ml-auto rounded-xl object-cover"
                />
            )}
            </div>
            {formData.gambar2 && typeof formData.gambar2 === 'string' && (
                <img
                    src={`http://localhost:5000${formData.gambar2}`}
                    alt="Gambar 2"
                    className="sm:ml-0 ml-auto rounded-xl object-cover"
                />
            )}
        </div>
        <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
                <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                    <h2
                        className="text-white text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                        {formData.judul_halaman}</h2>
                    <p className="text-white text-base font-normal leading-relaxed lg:text-start text-center">
                    {formData.paragraf}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</section>
                                    
    );
};

export default About;
