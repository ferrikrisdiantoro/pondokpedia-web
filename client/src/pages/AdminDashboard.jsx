import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    // State untuk mengontrol menu yang terbuka
    const [openMenu, setOpenMenu] = useState(null);
    const [activeContent, setActiveContent] = useState('/admin/overview'); // Default ke "overview"
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Kontrol visibilitas sidebar

    useEffect(() => {
        if (!loading && user?.role === 'admin' && window.location.pathname === '/') {
            navigate('/admin/overview'); // Pastikan admin diarahkan ke halaman dashboard
        }
    }, [loading, user, navigate]);

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const changeActiveContent = (content) => {
        setActiveContent(content);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`${
                    isSidebarOpen ? 'w-64' : 'w-20'
                } bg-emerald-900 text-white flex flex-col transition-all duration-300`}
            >
                <div className="p-6 text-center font-bold text-2xl border-b border-emerald-700">
                    {isSidebarOpen ? 'Admin Dashboard' : 'AD'}
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-4">
                    {/* Dashboard Menu */}
                    <div>
                        <button
                            onClick={() => toggleMenu('dashboard')}
                            className="flex items-center w-full px-4 py-2 hover:bg-emerald-700 rounded-lg transition-all duration-300"
                        >
                            <span className="flex items-center">
                                <img
                                    src="/images/svg/db.svg"
                                    alt="Dashboard Icon"
                                    className="w-6 h-6 mr-2"
                                />
                                {isSidebarOpen && 'Dashboard'}
                            </span>
                        </button>
                        {openMenu === 'dashboard' && isSidebarOpen && (
                            <div className="ml-6 mt-2 space-y-2 p-2 rounded-lg bg-emerald-600">
                                <a
                                    onClick={() => {
                                        navigate('/admin/overview');
                                        setActiveContent('Overview');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Overview
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Content Management Menu */}
                    <div>
                        <button
                            onClick={() => toggleMenu('content')}
                            className="flex items-center w-full px-4 py-2 hover:bg-emerald-700 rounded-lg transition-all duration-300"
                        >
                            <span className="flex items-center">
                                <img
                                    src="/images/svg/wo.svg"
                                    alt="Kata Icon"
                                    className="w-6 h-6 mr-2"
                                />
                                {isSidebarOpen && 'Manajemen Kata'}
                            </span>
                        </button>
                        {openMenu === 'content' && isSidebarOpen && (
                            <div className="ml-6 mt-2 space-y-2 bg-emerald-600 p-2 rounded-lg">
                                <a
                                    onClick={() => {
                                        navigate('/admin/allwords');
                                        setActiveContent('AllWords');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Semua Kata
                                </a>
                                <a
                                    onClick={() => {
                                        navigate('/admin/addwords');
                                        setActiveContent('AddWords');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Tambah Kata
                                </a>
                            </div>
                        )}
                    </div>

                    {/* User Management Menu */}
                    <div>
                        <button
                            onClick={() => toggleMenu('userManagement')}
                            className="flex items-center w-full px-4 py-2 hover:bg-emerald-700 rounded-lg transition-all duration-300"
                        >
                            <span className="flex items-center">
                            <img src="/images/svg/us.svg" alt="Pengguna Icon" className="w-6 h-6 mr-2" />
                                {isSidebarOpen && 'Manajemen Pengguna'}
                            </span>
                        </button>
                        {openMenu === 'userManagement' && isSidebarOpen && (
                            <div className="ml-6 mt-2 space-y-2 bg-emerald-600 p-2 rounded-lg">
                                <a
                                    onClick={() => {
                                        navigate('/admin/allusers');
                                        setActiveContent('AllUsers');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Semua Pengguna
                                </a>
                                <a
                                    onClick={() => {
                                        navigate('/admin/adduser');
                                        setActiveContent('AddUser');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Tambah Pengguna
                                </a>
                            </div>
                        )}
                    </div>

                    {/* User Management Menu */}
                    <div>
                        <button
                            onClick={() => toggleMenu('Konten')}
                            className="flex items-center w-full px-4 py-2 hover:bg-emerald-700 rounded-lg transition-all duration-300"
                        >
                            <span className="flex items-center">
                            <img src="/images/svg/co.svg" alt="Pesan Icon" className="w-6 h-6 mr-2" />
                                {isSidebarOpen && 'Manajemen Konten'}
                            </span>
                        </button>
                        {openMenu === 'Konten' && isSidebarOpen && (
                            <div className="ml-6 mt-2 space-y-2 bg-emerald-600 p-2 rounded-lg">
                                <a
                                    onClick={() => {
                                        navigate('/admin/adminkamus');
                                        setActiveContent('AdminKamus');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Halaman Kamus
                                </a>
                                <a
                                    onClick={() => {
                                        navigate('/admin/adminglosarium');
                                        setActiveContent('AdminGlosarium');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Halaman Glosarium
                                </a>
                                <a
                                    onClick={() => {
                                        navigate('/admin/adminlogin');
                                        setActiveContent('AdminLogin');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Halaman Login
                                </a>
                                <a
                                    onClick={() => {
                                        navigate('/admin/banner');
                                        setActiveContent('Banner');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Halaman Beranda Banner
                                </a>
                                <a
                                    onClick={() => {
                                        navigate('/admin/admincontact');
                                        setActiveContent('AdminContact');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Halaman Kontak
                                </a>
                                <a
                                    onClick={() => {
                                        navigate('/admin/adminabout');
                                        setActiveContent('AdminAbout');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Halaman Tentang Kami
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Blog Management Menu */}
                    <div>
                        <button
                            onClick={() => toggleMenu('Blog')}
                            className="flex items-center w-full px-4 py-2 hover:bg-emerald-700 rounded-lg transition-all duration-300"
                        >
                            <span className="flex items-center">
                            <img src="/images/svg/bl.svg" alt="Pesan Icon" className="w-6 h-6 mr-2" />
                                {isSidebarOpen && 'Manajemen Blog'}
                            </span>
                        </button>
                        {openMenu === 'Blog' && isSidebarOpen && (
                            <div className="ml-6 mt-2 space-y-2 bg-emerald-600 p-2 rounded-lg">
                                <a
                                    onClick={() => {
                                        navigate('/admin/allblog');
                                        setActiveContent('AllBlog');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Semua Blog
                                </a>
                                <a
                                    onClick={() => {
                                        navigate('/admin/addblog');
                                        setActiveContent('AddBlog');
                                    }}
                                    className="block cursor-pointer hover:bg-emerald-700 p-2 rounded-lg ml-2"
                                >
                                    Tambah Blog
                                </a>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-emerald-700">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-300"
                    >
                        {isSidebarOpen ? 'Logout' : <span className="material-icons">logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={toggleSidebar}
                        className="bg-emerald-900 text-white p-2 rounded-lg hover:bg-emerald-700 transition-all duration-300"
                    >
                        {isSidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
                    </button>
                </div>

                <div className="max-w-screen-xl mx-auto">
                    <Outlet /> {/* Konten utama */}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
