import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../index.css';

const Navbar = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    useEffect(() => {
        if (!loading && user && user.role === 'admin' && window.location.pathname === '/') {
            navigate('/admin/overview');
        }
    }, [user, loading, navigate]);  

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsServiceOpen(false);
    };

    const toggleServiceDropdown = (e) => {
        e.stopPropagation();
        setIsServiceOpen(!isServiceOpen);
    };

    const closeDropdowns = () => {
        setIsServiceOpen(false);
        setIsAccountOpen(false);
        setIsMobileMenuOpen(false);
    };
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <nav className="relative w-full bg-emerald-700 border-emerald-200 dark:border-emerald-600 dark:bg-emerald-700 z-50">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo dan Title Container */}
                    <div className="flex items-center flex-wrap">
                        <div className="flex-shrink-0">
                            <img
                                src="/images/logo.png"
                                className="h-8 w-8 sm:h-10 sm:w-10"
                                alt="alikhlas logo"
                            />
                        </div>
                        <h1 className="ml-2 text-lg sm:text-xl md:text-2xl font-semibold text-white truncate max-w-[200px] sm:max-w-full">
                            Pondok Pesantren Modern Al-Ikhlas Putri
                        </h1>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-emerald-600 focus:outline-none"
                            onClick={toggleMobileMenu}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="text-white hover:bg-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                                onClick={closeDropdowns}
                            >
                                Beranda
                            </Link>
                            
                            {/* Service Dropdown - Desktop */}
                            <div className="relative inline-block">
                                <button
                                    className="text-white hover:bg-emerald-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                                    onClick={toggleServiceDropdown}
                                >
                                    Layanan
                                    <svg
                                        className="ml-1 h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {isServiceOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1">
                                            <Link
                                                to="/dictionaries"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-100"
                                                onClick={closeDropdowns}
                                            >
                                                Kamus
                                            </Link>
                                            <Link
                                                to="/glosarium"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-100"
                                                onClick={closeDropdowns}
                                            >
                                                Glosarium
                                            </Link>
                                            <Link
                                                to="/blog"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-100"
                                                onClick={closeDropdowns}
                                            >
                                                Blog
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/contact"
                                className="text-white hover:bg-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                                onClick={closeDropdowns}
                            >
                                Kontak
                            </Link>
                            <Link
                                to="/about"
                                className="text-white hover:bg-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                                onClick={closeDropdowns}
                            >
                                Tentang Kami
                            </Link>
                            <Link
                                to="/login"
                                className="text-white hover:bg-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                                onClick={closeDropdowns}
                            >
                                Admin
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden relative z-50`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-emerald-700">
                        <Link
                            to="/"
                            className="text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={closeDropdowns}
                        >
                            Beranda
                        </Link>
                        
                        {/* Service Dropdown - Mobile */}
                        <div className="relative">
                            <button
                                className="text-white hover:bg-emerald-600 w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                                onClick={toggleServiceDropdown}
                            >
                                Layanan
                                <svg
                                    className={`h-4 w-4 transform ${isServiceOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {isServiceOpen && (
                                <div className="mt-2 space-y-1 bg-emerald-600">
                                    <Link
                                        to="/dictionaries"
                                        className="block pl-6 pr-4 py-2 text-base font-medium text-white hover:bg-emerald-500"
                                        onClick={closeDropdowns}
                                    >
                                        Kamus
                                    </Link>
                                    <Link
                                        to="/glosarium"
                                        className="block pl-6 pr-4 py-2 text-base font-medium text-white hover:bg-emerald-500"
                                        onClick={closeDropdowns}
                                    >
                                        Glosarium
                                    </Link>
                                    <Link
                                        to="/blog"
                                        className="block pl-6 pr-4 py-2 text-base font-medium text-white hover:bg-emerald-500"
                                        onClick={closeDropdowns}
                                    >
                                        Blog
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/contact"
                            className="text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={closeDropdowns}
                        >
                            Kontak
                        </Link>
                        <Link
                            to="/about"
                            className="text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={closeDropdowns}
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            to="/login"
                            className="text-white hover:bg-emerald-600 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={closeDropdowns}
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;