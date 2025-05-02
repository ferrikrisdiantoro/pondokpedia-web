import React, { useState, useEffect } from 'react';

const Dictionaries = () => {
    const [words, setWords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCard, setExpandedCard] = useState(null);
    const [formData, setFormData] = useState({
        judul: '',
        isi: '',
    });
    const [loading, setLoading] = useState(true);

    // Fetch data dari API
    useEffect(() => {
        fetch('http://localhost:5000/api/words')
            .then((res) => res.json())
            .then((data) => {
                const transformedData = data.map((word) => {
                    const sentences = [];
                    for (let i = 1; i <= 6; i++) {
                        const indonesian = word[`kalimat_id${i}`];
                        const english = word[`kalimat_en${i}`];
                        const arabic = word[`kalimat_ar${i}`];
                        if (indonesian || english || arabic) {
                            sentences.push({
                                indonesian: indonesian || '',
                                english: english || '',
                                arabic: arabic || ''
                            });
                        }
                    }
                    return { ...word, kalimat: sentences };
                });
                setWords(transformedData);
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    useEffect(() => {
        const fetchKamusData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/halaman_kamus');
                const data = await response.json();
                
                if (data?.success && data?.data?.length > 0) {
                    const kamusData = data.data[0];
                    setFormData({
                        id: kamusData.id,
                        judul: kamusData.judul,
                        isi: kamusData.isi
                    });
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching halaman_kamus data:', error);
                setLoading(false);
            }
        };
    
        fetchKamusData();
    }, []);

    const filteredWords = words.filter((word) =>
        word.kata_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full flex flex-col items-center bg-emerald-700 min-h-screen p-4">
            <div className="w-full max-w-4xl">
                <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
                    {formData.judul}
                </h1>
                <p className="mb-4 text-base md:text-lg text-white">
                    {formData.isi}
                </p>
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filteredWords={filteredWords}
                    expandedCard={expandedCard}
                    setExpandedCard={setExpandedCard}
                />
            </div>
        </div>
    );
};

const SearchBar = ({ searchTerm, setSearchTerm, filteredWords, expandedCard, setExpandedCard }) => (
    <div className="w-full">
        <form className="relative mb-6" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg 
                        className="w-4 h-4 text-gray-500" 
                        aria-hidden="true" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 20 20"
                    >
                        <path 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>
                <input 
                    type="search" 
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Cari Kata"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                    type="submit" 
                    className="text-white absolute end-2.5 bottom-2.5 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                    Search
                </button>
            </div>
        </form>

        {searchTerm && (
            <div className="mt-4">
                {filteredWords.length > 0 ? (
                    filteredWords.map((word, index) => (
                        <Card
                            key={`search-${index}`}
                            word={word}
                            index={index}
                            expandedCard={expandedCard}
                            setExpandedCard={setExpandedCard}
                        />
                    ))
                ) : (
                    <p className="text-white text-center">No words found.</p>
                )}
            </div>
        )}
    </div>
);

const Card = ({ word, index, expandedCard, setExpandedCard }) => (
    <div
        className="card mb-4 p-4 shadow-lg rounded-lg bg-white cursor-pointer"
        onClick={() => setExpandedCard(expandedCard === index ? null : index)}
    >
        <h2 className="text-xl md:text-2xl font-bold text-green-700">{word.kata_id}</h2>
        {expandedCard === index && (
            <div className="mt-4">
                <div className="flex flex-col md:flex-row justify-center items-center text-green-600 font-semibold my-4 space-y-2 md:space-y-0">
                    <span className="md:mx-4">{word.kata_id}</span>
                    <span className="hidden md:inline">|</span>
                    <span className="md:mx-4">{word.kata_en}</span>
                    <span className="hidden md:inline">|</span>
                    <span className="md:mx-4">{word.kata_ar}</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-green-700 mt-4">Contoh Kalimat</h3>
                <div className="overflow-x-auto mt-4">
                    <table className="w-full border-collapse border border-green-300">
                        <thead>
                            <tr>
                                <th className="border border-green-300 p-2 text-sm md:text-base">Terjemah</th>
                                <th className="border border-green-300 p-2 text-sm md:text-base">Translate</th>
                                <th className="border border-green-300 p-2 text-sm md:text-base">اَلْعَرَبِيَّةُ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {word.kalimat.map((sentence, i) => (
                                <tr key={i}>
                                    <td className="border border-green-300 p-2 text-sm md:text-base">{sentence.indonesian}</td>
                                    <td className="border border-green-300 p-2 text-sm md:text-base">{sentence.english}</td>
                                    <td className="border border-green-300 p-2 text-sm md:text-base">{sentence.arabic}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
);

export default Dictionaries;