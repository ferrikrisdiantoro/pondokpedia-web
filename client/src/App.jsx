import React from 'react';
import 'flowbite';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Home';
import Dictionaries from './Dictionaries';
import Glosarium from './Glosarium';
import About from './About';
import ChatWidget from './ChatWidget';
import Contact from './Contact';
import Blog from './Blog';
import BlogDetail from './BlogDetail';
import LoginPage from './LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import AllWords from './pages/AllWords';
import EditWords from './pages/EditWords';
import EditUsers from './pages/EditUsers';
import AddWords from './pages/AddWords';
import AllUsers from './pages/AllUsers';
import AddUsers from './pages/AddUsers';
import Banner from './pages/Banner';
import Overview from './pages/Overview';
import AdminContact from './pages/AdminContact';
import AdminLogin from './pages/AdminLogin';
import AdminKamus from './pages/AdminKamus';
import AdminGlosarium from './pages/AdminGlosarium';
import AdminAbout from './pages/AdminAbout';
import AllBlog from './pages/AllBlog';
import AddBlog from './pages/AddBlog';
import EditBlog from './pages/EditBlog';
import AdminRoute from './routes/AdminRoute';
import './index.css';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppWithRouter />
            </Router>
        </AuthProvider>
    );
};

const AppWithRouter = () => {
    const location = useLocation(); // Mendapatkan rute saat ini

    // Tidak render Navbar jika di halaman admin dashboard
    const shouldShowNavbar = !location.pathname.startsWith('/admin');

    return (
        <>
            {shouldShowNavbar && <Navbar />}
            <ChatWidget />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dictionaries" element={<Dictionaries />} />
                <Route path="/glosarium" element={<Glosarium />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Rute Admin yang dilindungi */}
                <Route
                    path="/admin/*"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                >
                    <Route path="allwords" element={<AllWords />} />
                    <Route path="editwords/:id" element={<EditWords />} />
                    <Route path="editusers/:id" element={<EditUsers />} />
                    <Route path="addwords" element={<AddWords />} />
                    <Route path="allusers" element={<AllUsers />} />
                    <Route path="adduser" element={<AddUsers />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="banner" element={<Banner />} />
                    <Route path="admincontact" element={<AdminContact />} />
                    <Route path="adminlogin" element={<AdminLogin />} />
                    <Route path="adminkamus" element={<AdminKamus />} />
                    <Route path="adminglosarium" element={<AdminGlosarium />} />
                    <Route path="adminabout" element={<AdminAbout />} />
                    <Route path="allblog" element={<AllBlog />} />
                    <Route path="addblog" element={<AddBlog />} />
                    <Route path="editblog/:id" element={<EditBlog />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
