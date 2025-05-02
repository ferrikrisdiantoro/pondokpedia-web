import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Fungsi untuk menghapus tag HTML dari teks
const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
};

const AllBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJenis, setSelectedJenis] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        filterBlogs();
    }, [searchTerm, selectedJenis]);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/blog');
            setBlogs(response.data.data);
            setFilteredBlogs(response.data.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const filterBlogs = () => {
        let filtered = [...blogs];

        if (searchTerm) {
            filtered = filtered.filter(blog =>
                blog.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.jenis.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedJenis) {
            filtered = filtered.filter(blog => blog.jenis === selectedJenis);
        }

        setFilteredBlogs(filtered);
    };

    const truncateText = (text, maxLength) => {
        const cleanText = stripHtml(text);
        return cleanText.length > maxLength ? cleanText.slice(0, maxLength) + '...' : cleanText;
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleJenisChange = (e) => {
        setSelectedJenis(e.target.value);
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/blog/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/editblog/${id}`);
    };

    // Pagination logic
    const indexOfLastBlog = currentPage * entriesPerPage;
    const indexOfFirstBlog = indexOfLastBlog - entriesPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const totalPages = Math.ceil(filteredBlogs.length / entriesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Tabel Blog</h1>

            {/* Search and Filter Section */}
            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Cari Blog"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border px-4 py-2 rounded"
                />
                <select
                    value={selectedJenis}
                    onChange={handleJenisChange}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">All Types</option>
                    <option value="technology">Technology</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="education">Education</option>
                </select>
                <label className="p2-4 py-2">Show Entries: </label>
                <select
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    className="border px-4 py-2 rounded"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
                <Link to="/admin/addblog" className="px-4 py-2 bg-green-500 text-white rounded">Add Blog</Link>
            </div>

            {/* Table */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-white dark:text-white">
                    <thead className="text-xs text-white uppercase bg-emerald-50 dark:bg-emerald-700 dark:text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nomor</th>
                            <th scope="col" className="px-6 py-3">Gambar</th>
                            <th scope="col" className="px-6 py-3">Judul</th>
                            <th scope="col" className="px-6 py-3">Jenis</th>
                            <th scope="col" className="px-6 py-3">Isi</th>
                            <th scope="col" className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBlogs.map((blog, index) => (
                            <tr key={blog.id} className="odd:bg-white odd:dark:bg-emerald-900 even:bg-emerald-50 even:dark:bg-emerald-800 border-b dark:border-emerald-700">
                                <td className="px-6 py-4">{index + 1 + (currentPage - 1) * entriesPerPage}</td>
                                <td className="px-6 py-4">
                                <img
                                    src={blog.gambar ? `http://localhost:5000${blog.gambar}` : 'default-image.jpg'}
                                    alt={blog.judul}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                </td>
                                <td className="px-6 py-4">{blog.judul}</td>
                                <td className="px-6 py-4">{blog.jenis}</td>
                                <td className="px-6 py-4">{truncateText(blog.isi, 50)}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEdit(blog.id)}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded me-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-emerald-500 text-white rounded"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-emerald-500 text-white rounded"
                    >
                        Next
                    </button>
                </div>
                <div>
                    <span className="text-sm text-gray-600">Total Blogs: {filteredBlogs.length}</span>
                </div>
            </div>
        </div>
    );
};

export default AllBlog;
