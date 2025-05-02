import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

const EditUsers = () => {
    const { id } = useParams(); // Ambil ID dari URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user', // Default role
        password: ''
    });

    const [loading, setLoading] = useState(true);

    // Fetch data untuk user tertentu berdasarkan ID
    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log('Fetching user with ID:', id); // Log ID
                const response = await axios.get(`${API_URL}/${id}`);
                console.log('Fetched User Data:', response.data); // Log data user
                setFormData(response.data.data);  // Mengambil data dari response.data.data
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);
    
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const updatedData = {
            name: formData.name,
            email: formData.email,
            role: formData.role
        };
        
        if (formData.password) {
            updatedData.password = formData.password;
        }

        console.log('Data to be sent:', updatedData);

    
        // Mengirim data ke API
        axios.put(`http://localhost:5000/api/user/${id}`, updatedData)
            .then(response => {
                console.log('User updated successfully:', response.data);
                navigate(`/admin/allusers`);
            })
            .catch(error => {
                console.log('Error updating user:', error.response.data);
            });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block mb-1 font-medium">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg p-2"
                            >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/allusers')}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                        >
                            Cancel
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

export default EditUsers;
