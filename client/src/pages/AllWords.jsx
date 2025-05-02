import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/kata';

const AllWords = () => {
    const [kataList, setKataList] = useState([]);
    const [filteredKata, setFilteredKata] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(5); // Default entries per page
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const navigate = useNavigate();

    // Fetch all data
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchTerm, kataList]);

    const fetchData = async () => {
        try {
            const response = await axios.get(API_URL);
            setKataList(response.data.data); 
            setFilteredKata(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const filterData = () => {
        let filtered = kataList;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.kata_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.kata_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                [...Array(6)].some((_, i) => 
                    item[`kalimat_ar${i + 1}`]?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        setFilteredKata(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search term changes
    };

    // Pagination logic
    const indexOfLastItem = currentPage * entriesPerPage;
    const indexOfFirstItem = indexOfLastItem - entriesPerPage;
    const currentKata = filteredKata.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredKata.length / entriesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEdit = (id) => {
        navigate(`/admin/editwords/${id}`);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
    };

    return (
        <div className="w-full px-4">
            <div className="overflow-hidden p-4">
                    <h2 className="text-2xl font-bold mb-4">Daftar Kata</h2>

                {/* Search and Entries Section */}
                <div className="mb-4 mt-4 flex gap-4">
                    <input
                        type="text"
                        placeholder="Cari Kata"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border px-4 py-2 rounded"
                    />
                    <label class=" p2-4 py-2">Show Entries: </label>
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
                </div>

                {/* Table */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-white dark:text-white">
                        <thead class="text-xs text-white uppercase bg-emerald-50 dark:bg-emerald-700 dark:text-white">
                            <tr>
                                <th scope="col" class="px-6 py-3">No</th>
                                <th scope="col" class="px-6 py-3">Kata Bahasa Indonesia</th>
                                <th scope="col" class="px-6 py-3">Kata Bahasa Inggris</th>
                                <th scope="col" class="px-6 py-3">Kata Bahasa Arab</th>
                                {[...Array(6)].map((_, i) => (
                                    <th key={`kalimat_id${i + 1}`} scope="col" class="px-6 py-3">{`Kalimat Bahasa Indoensia ${i + 1}`}</th>
                                ))}
                                {[...Array(6)].map((_, i) => (
                                    <th key={`kalimat_en${i + 1}`} scope="col" class="px-6 py-3">{`Kalimat Bahasa Inggris ${i + 1}`}</th>
                                ))}
                                {[...Array(6)].map((_, i) => (
                                    <th key={`kalimat_ar${i + 1}`} scope="col" class="px-6 py-3">{`Kalimat Bahasa Arab ${i + 1}`}</th>
                                ))}
                                <th scope="col" class="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentKata.map((item, index) => (
                                <tr key={item.id} class="odd:bg-white odd:dark:bg-emerald-900 even:bg-emerald-50 even:dark:bg-emerald-800 border-b dark:border-emerald-700">
                                    <td class="px-6 py-4">{index + 1}</td>
                                    <td class="px-6 py-4">{item.kata_id}</td>
                                    <td class="px-6 py-4">{item.kata_en}</td>
                                    <td class="px-6 py-4">{item.kata_ar}</td>
                                    {[...Array(6)].map((_, i) => (
                                        <td key={`kalimat_id${i + 1}`} class="px-6 py-4">
                                            {item[`kalimat_id${i + 1}`]}
                                        </td>
                                    ))}
                                    {[...Array(6)].map((_, i) => (
                                        <td key={`kalimat_en${i + 1}`} class="px-6 py-4">
                                            {item[`kalimat_en${i + 1}`]}
                                        </td>
                                    ))}
                                    {[...Array(6)].map((_, i) => (
                                        <td key={`kalimat_ar${i + 1}`} class="px-6 py-4">
                                            {item[`kalimat_ar${i + 1}`]}
                                        </td>
                                    ))}
                                    <td class="px-6 py-4">
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            type="button"
                                            className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            type="button"
                                            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
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
                        <span className="text-sm text-emerald-600">Total Kata: {filteredKata.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllWords;
