import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    // Fetch data detail blog
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blog/${id}`);
        const data = await response.json();
        if (data.success) {
          setBlog(data.data);
        }
      } catch (error) {
        console.error("Error fetching blog detail:", error);
      }
    };

    // Fetch data sidebar
    const fetchSidebarData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blog");
        const data = await response.json();

        if (data.success && data.data.length > 0) {
          // Ambil kategori unik
          const uniqueCategories = [
            "Semua",
            ...new Set(data.data.map((blog) => blog.jenis)),
          ];
          setCategories(uniqueCategories);

          // Ambil 3 postingan terbaru
          const sortedBlogs = data.data.sort(
            (a, b) => new Date(b.waktu) - new Date(a.waktu)
          );
          setRecentPosts(sortedBlogs.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
      }
    };

    fetchBlog();
    fetchSidebarData();
  }, [id]);

  // Tampilkan loading jika data belum selesai di-fetch
  if (!blog || categories.length === 0 || recentPosts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-emerald-700 min-h-full grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Konten Utama */}
      <div className="lg:col-span-3">
        <h1 className="text-4xl font-bold text-white">{blog.judul}</h1>
        <span className="text-sm text-gray-300 mt-2">
          {new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(blog.waktu))}
        </span>
        <span className="ml-2 inline-block px-3 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-md">
          {blog.jenis || "General"}
        </span>
        {/* Gambar Blog */}
        <div className="overflow-hidden rounded-lg mt-2">
          <img
            src={`http://localhost:5000${blog.gambar}`}
            alt={blog.judul}
            className="w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[500px] object-cover rounded-lg"
          />
        </div>
        <div
          className="bg-white p-6 rounded-lg mt-6"
          dangerouslySetInnerHTML={{ __html: blog.isi }}
        />
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        {/* Postingan Terbaru */}
        <div className="bg-emerald-500 p-4 rounded-lg text-white">
          <h3 className="text-xl font-semibold mb-4">Postingan Terbaru</h3>
          {recentPosts.map((post) => (
            <div
            key={post.id}
            className="mb-4 cursor-pointer p-4 rounded-lg transition-colors duration-300 hover:bg-emerald-700"
            onClick={() => navigate(`/blog/${post.id}`)}
          >
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
  );
};

export default BlogDetail;
