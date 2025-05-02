import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blog');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setBlogs(data.data);
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    const fetchBanners = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/banner');
        setBanners(response.data.data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };
    fetchBanners();
    fetchBlogs();
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveIndex((prevIndex) => (prevIndex + 1) % 3),
    onSwipedRight: () => setActiveIndex((prevIndex) => (prevIndex - 1 + 3) % 3),
  });

  return (
    <div className="w-full flex flex-col bg-emerald-700 min-h-screen">
      {/* Section 1: Carousel - Perbaikan responsivitas */}
      <section className="w-full py-4 sm:py-8">
        <div {...handlers} className="relative w-full sm:w-11/12 mx-auto rounded-lg px-2 sm:px-0">
          {/* Carousel Wrapper */}
          <div className="relative h-48 sm:h-56 md:h-96 overflow-hidden rounded-lg">
            {/* Slides */}
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`duration-700 ease-in-out absolute w-full h-full ${
                  activeIndex === index ? 'block' : 'hidden'
                }`}
              >
                <img
                  src={`http://localhost:5000${banners[0]?.[`banner${index + 1}`]}`}
                  className="absolute block w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full bg-white/50 ${
                  activeIndex === index ? 'bg-white' : ''
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          {/* Arrows */}
          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none"
            onClick={() => setActiveIndex((activeIndex - 1 + 3) % 3)}
          >
            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
              </svg>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none"
            onClick={() => setActiveIndex((activeIndex + 1) % 3)}
          >
            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* Section 2: Blog - Perbaikan responsivitas */}
      <section className="px-4 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-16">
            Postingan Terbaru
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogs.length > 0 ? (
              blogs.slice(0, 3).map((blog) => (
                <div
                  key={blog.id}
                  className="group bg-white border border-gray-300 rounded-2xl overflow-hidden h-full"
                >
                  <div className="h-48 bg-gray-200">
                    <img
                      src={`http://localhost:5000${blog.gambar}`}
                      alt="Blog"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col h-full">
                    <span className="text-emerald-600 font-medium mb-3">
                      {new Intl.DateTimeFormat("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(blog.waktu))}
                    </span>
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-md">
                        {blog.jenis || "General"}
                      </span>
                    </div>
                    <h4 className="text-xl text-gray-900 font-medium mb-4">{blog.judul}</h4>
                    <p
                      className="text-gray-500 mb-6 flex-grow"
                      dangerouslySetInnerHTML={{
                        __html: blog.isi.length > 100 ? `${blog.isi.slice(0, 100)}...` : blog.isi,
                      }}
                    />
                    <div className="mt-auto">
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-lg text-emerald-600 font-semibold hover:underline"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">Loading...</p>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Layanan Website - Perbaikan responsivitas */}
      <section className="w-full py-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6 sm:mb-8">
            Layanan Website
          </h2>
          
          {/* Card container with responsive flex layout */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-20 justify-center">
            {/* Card 1 */}
            <div className="bg-white shadow-lg border p-2 w-full sm:w-1/2 max-w-sm rounded-lg overflow-hidden mx-auto">
              <div className="aspect-video">
                <img src="/images/dict.png" className="w-full h-full object-cover rounded-lg" alt="Kamus" />
              </div>
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-xl font-bold">Kamus Arab Indonesia</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed mb-4">
                  Kamus ini menyediakan terjemahan dari bahasa Arab ke bahasa Indonesia dengan mudah dan cepat. 
                  Dirancang untuk membantu pelajar, akademisi, dan siapa saja yang ingin memahami makna kata dalam konteks yang sesuai.
                </p>
                <Link
                  to="/dictionaries"
                  className="inline-block w-full px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-semibold bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  Lihat
                </Link>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white shadow-lg border p-2 w-full sm:w-1/2 max-w-sm rounded-lg overflow-hidden mx-auto">
              <div className="aspect-video">
                <img src="/images/glos.png" className="w-full h-full object-cover rounded-lg" alt="Glosarium" />
              </div>
              <div className="p-4 sm:p-6 text-center">
                <h3 className="text-xl font-bold">Glosarium</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed mb-4">
                  Glosarium ini berisi daftar istilah penting beserta penjelasannya, dirancang untuk membantu Anda memahami konsep-konsep kunci secara mendalam dan jelas.
                </p>
                <Link
                  to="/glosarium"
                  className="inline-block w-full px-5 py-2.5 rounded-lg text-white text-sm tracking-wider font-semibold bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  Lihat
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;