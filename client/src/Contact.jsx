import React, { useState, useEffect } from 'react';

const Contact = () => {
    const [contactData, setContactData] = useState(null); // State untuk data kontak
    const [loading, setLoading] = useState(true); // State untuk indikator loading
    const [error, setError] = useState(null); // State untuk menangani error

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/kontak'); // Endpoint GET
                if (!response.ok) {
                    throw new Error('Failed to fetch contact data');
                }
                const result = await response.json();
                setContactData(result.data); // Menyimpan data ke state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Hentikan loading
            }
        };

        fetchContactData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Indikator loading
    }

    if (error) {
        return <div>Error: {error}</div>; // Menampilkan error jika ada
    }

    if (!contactData) {
        return <div>No contact data available</div>; // Jika data kosong
    }

    return (
        <div className="w-full mx-auto bg-emerald-700 min-h-screen">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
                <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-white">{contactData.judul_halaman}</h2>
                    <p className="mt-4 text-lg text-white">{contactData.paragraf}</p>
                </div>
                <div className="mt-16 lg:mt-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="rounded-lg overflow-hidden">
                            <iframe
                                src={contactData.link_gmap}
                                width="100%"
                                height="480"
                                style={{ border: '0' }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                        <div>
                            <div className="max-w-full mx-auto rounded-lg overflow-hidden">
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-medium text-white">Alamat Pondok</h3>
                                    <p className="mt-1 text-white">{contactData.alamat}</p>
                                </div>
                                <div className="border-t border-gray-200 px-6 py-4">
                                    <h3 className="text-lg font-medium text-white">Jam Kerja</h3>
                                    <p className="mt-1 text-white">{contactData.jam_kerja}</p>
                                </div>
                                <div className="border-t border-gray-200 px-6 py-4">
                                    <h3 className="text-lg font-medium text-white">Kontak</h3>
                                    <div className="mt-2 space-y-1">
                                        {contactData.kontak.split(' ').map((item, index) => (
                                            <p key={index} className="text-white">{item}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
