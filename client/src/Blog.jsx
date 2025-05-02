import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blog");
        const data = await response.json();
  
        if (data.success && data.data.length > 0) {
          // Urutkan data berdasarkan waktu terbaru
          const sortedBlogs = data.data.sort(
            (a, b) => new Date(b.waktu) - new Date(a.waktu)
          );
  
          setBlogs(sortedBlogs);
  
          // Kategori unik
          const uniqueCategories = [
            "Semua",
            ...new Set(sortedBlogs.map((blog) => blog.jenis)),
          ];
          setCategories(uniqueCategories);
  
          // Ambil 3 postingan terbaru
          setRecentPosts(sortedBlogs.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  // Filter blogs berdasarkan kategori
  const filteredBlogs =
    selectedCategory === "Semua"
      ? blogs
      : blogs.filter((blog) => blog.jenis === selectedCategory);

  return (
    <div className="w-full mx-auto p-6 bg-emerald-700">
      {/* Judul Halaman */}
      <h2 className="text-4xl font-bold text-center mb-8 text-white">
        Semua Postingan
      </h2>

      {/* Layout Kontainer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Konten Utama */}
        <div className="lg:col-span-3 space-y-8">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col lg:flex-row"
              onClick={() => navigate(`/blog/${blog.id}`)}
            >
              {/* Gambar Blog */}
              <div className="w-full lg:w-1/3 aspect-[16/9] overflow-hidden rounded-lg">
                <img
                  src={`http://localhost:5000${blog.gambar}`}
                  alt={blog.judul}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Detail Postingan */}
              <div className="flex-1 ml-4">
                <h3 className="text-2xl font-bold mb-2">{blog.judul}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">
                    {new Intl.DateTimeFormat("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(blog.waktu))}
                  </span>
                  <span className="ml-2 px-2 py-1 bg-gray-300 text-gray-700 rounded">
                    {blog.jenis}
                  </span>
                </p>
                <p className="text-gray-700">
                  {blog.isi.length > 300
                    ? `${blog.isi.replace(/<[^>]+>/g, "").slice(0, 300)}...`
                    : blog.isi.replace(/<[^>]+>/g, "")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Kategori */}
          <div className="bg-emerald-500 p-4 rounded-lg text-white">
            <h3 className="text-xl font-semibold mb-4">Kategori</h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li
                key={index}
                className={`cursor-pointer px-3 py-1 rounded-lg ${
                  selectedCategory === category
                    ? "bg-emerald-800 font-bold" // Warna background untuk kategori aktif
                    : "hover:bg-emerald-600" // Warna saat hover
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>              
              ))}
            </ul>
          </div>

            {/* Postingan Terbaru */}
            <div className="bg-emerald-500 p-4 rounded-lg text-white">
                <h3 className="text-xl font-semibold mb-4">Postingan Terbaru</h3>
                {recentPosts.map((post) => (
                <div key={post.id} className="mb-4 mb-4 cursor-pointer p-4 rounded-lg transition-colors duration-300 hover:bg-emerald-700" onClick={() => navigate(`/blog/${post.id}`)}>
                    <h4 className="text-lg font-bold">{post.judul}</h4>
                    <span className="text-sm mr-2">
                    {new Intl.DateTimeFormat("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        }).format(new Date(post.waktu))}
                    </span>
                    <span className="inline-block mt-1 px-2 py-1 bg-green-700 text-sm rounded">
                    {post.jenis}
                    </span>
                    <p className="text-white">
                    {post.isi.length > 100
                        ? `${post.isi.replace(/<[^>]+>/g, "").slice(0, 100)}...`
                        : post.isi.replace(/<[^>]+>/g, "")}
                    </p>
                </div>
                ))}
            </div>
        </aside>
      </div>
    </div>
  );
};

export default Blog;
