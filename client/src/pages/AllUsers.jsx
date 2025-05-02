import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, selectedRole]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user');
            setUsers(response.data.data);
            setFilteredUsers(response.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const filterUsers = () => {
        let filtered = [...users];

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedRole) {
            filtered = filtered.filter(user => user.role === selectedRole);
        }

        setFilteredUsers(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search term changes
    };

    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            await axios.patch(`http://localhost:5000/api/user/${userId}`, { role: newRole });
            fetchUsers(); // Fetch users again to get the updated data
        } catch (error) {
            console.error("Error updating role:", error);
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * entriesPerPage;
    const indexOfFirstUser = indexOfLastUser - entriesPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/user/${id}`);
        fetchUsers();
    };

    const handleEdit = (id) => {
        navigate(`/admin/editusers/${id}`);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Tabel Pengguna</h1>

            {/* Search and Filter Section */}
            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Cari Pengguna"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border px-4 py-2 rounded"
                />
                <select
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
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
                <thead className="text-xs text-white uppercase bg-emerald-50 dark:bg-emerald-700 dark:text-white">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nomor</th>
                        <th scope="col" className="px-6 py-3">Nama</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => (
                        <tr key={user.id} className="odd:bg-white odd:dark:bg-emerald-900 even:bg-emerald-50 even:dark:bg-emerald-800 border-b dark:border-emerald-700">
                            <td className="px-6 py-4">{index + 1 + (currentPage - 1) * entriesPerPage}</td>
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => handleEdit(user.id)}
                                    type="button"
                                    className="focus:outline-none text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-900"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
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
                    <span className="text-sm text-gray-600">Total Pengguna: {filteredUsers.length}</span>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
