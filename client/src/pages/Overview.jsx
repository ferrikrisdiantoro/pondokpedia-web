import React, { useEffect, useState } from 'react';

const Overview = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [totalBlogs, setTotalBlogs] = useState(0);

    useEffect(() => {
        fetchData();  // Ambil data saat halaman dimuat
    }, []);

    const fetchData = async () => {
        try {
            const [userResponse, wordResponse, blogResponse] = await Promise.all([
                fetch('http://localhost:5000/api/user/count'),
                fetch('http://localhost:5000/api/kata/count'),
                fetch('http://localhost:5000/api/blog/count'),
            ]);
    
            // Debugging: Cek apakah response adalah JSON
            const userText = await userResponse.text(); // Ambil sebagai teks dulu
            console.log('User response:', userText); // Log respons teks
            const wordText = await wordResponse.text();
            console.log('Word response:', wordText);
            const blogText = await blogResponse.text();
            console.log('Word response:', blogText);
    
            const userData = JSON.parse(userText);  // Ubah ke JSON jika valid
            const wordData = JSON.parse(wordText);
            const blogData = JSON.parse(blogText);
    
            setTotalUsers(userData.count);  
            setTotalWords(wordData.count);
            setTotalBlogs(blogData.count);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };
    

    return (
        <div className="p-6 text-center text-white">
            <div className="flex flex-wrap justify-center gap-4">
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-emerald-800 dark:border-emerald-700">
                    <img src="/images/svg/us.svg" alt="Pengguna Icon" className="w-6 h-6" />
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{totalUsers}</h5>
                    </a>
                    <p className="mb-3 font-normal text-white dark:text-white">Total Semua User yang Ada</p>
                </div>
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-emerald-800 dark:border-emerald-700">
                    <img src="/images/svg/wo.svg" alt="Kata Icon" className="w-6 h-6" />
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{totalWords}</h5>
                    </a>
                    <p className="mb-3 font-normal text-white dark:text-white">Total Semua Kata yang Ada</p>
                </div>
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-emerald-800 dark:border-emerald-700">
                    <img src="/images/svg/bl.svg" alt="Kata Icon" className="w-6 h-6" />
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{totalBlogs}</h5>
                    </a>
                    <p className="mb-3 font-normal text-white dark:text-white">Total Blog Kata yang Ada</p>
                </div>
            </div>
            </div>

    );
};

export default Overview;
