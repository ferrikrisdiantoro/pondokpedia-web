import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Gunakan fungsi login dari context
    const navigate = useNavigate();
    const [formData, setformData] = useState(null);

    // Fungsi untuk menangani perubahan input
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            console.log('Login response data:', response.data);
    
            if (response.data && response.data.token && response.data.user) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
    
                login(response.data.user); // Simpan user ke context
    
                if (response.data.user.role === 'admin') {
                    navigate('/admin/overview'); // Arahkan ke dashboard admin
                } else {
                    navigate('/'); // Arahkan ke halaman utama
                }
            } else {
                console.error('Invalid data received:', response.data);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.message || 'Error logging in');
        }
    };
    
    // Mengambil data dari API saat komponen dimuat
    useEffect(() => {
        const fetchformData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/halaman_login'); // Ganti dengan URL API yang sesuai
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    setformData(data.data[0]); // Ambil data pertama dari hasil query
                }
            } catch (error) {
                console.error('Error fetching halaman_login data:', error);
            }
        };

        fetchformData();
    }, []);
    
    
    
    return (
        <section
            style={{
                backgroundImage: formData?.gambar // Gunakan optional chaining
                ? `url(http://localhost:5000${formData.gambar})`
                : '',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh", // Latar belakang mencakup seluruh layar
                position: "relative", // Untuk memungkinkan overlay absolute
            }}
        >
            {/* Overlay transparan emerald */}
            <div
                style={{
                    backgroundColor: "rgba(16, 185, 129, 0.3)", // Emerald dengan transparansi
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1, // Overlay berada di atas background
                }}
            ></div>

            <div
                className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
                style={{
                    position: "relative",
                    zIndex: 2, // Konten berada di atas overlay
                }}
            >
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="/images/logo.png" alt="alikhlas logo" />
                    Pondok Pesantren Modern Al-Ikhlas Putri
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-emerald-800 dark:border-emerald-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Masuk Halaman Admin
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    id="email"
                                    onChange={handleChange}
                                    className="bg-emerald-50 border border-emerald-300 text-gray-900 rounded-lg focus:ring-emerald-600 focus:border-emerald-600 block w-full p-2.5 dark:bg-emerald-700 dark:border-emerald-600 dark:placeholder-white dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                                    placeholder="Masukan Email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Kata Sandi
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={handleChange}
                                    name="password"
                                    id="password"
                                    placeholder="Masukan Kata Sandi"
                                    className="bg-emerald-50 border border-emerald-300 text-gray-900 rounded-lg focus:ring-emerald-600 focus:border-emerald-600 block w-full p-2.5 dark:bg-emerald-700 dark:border-emerald-600 dark:placeholder-white dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
                            >
                                Masuk
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
