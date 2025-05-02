import React, { useEffect, useState } from 'react';

const Glosarium = () => {
    const [words, setWords] = useState([]);
    const [expandedCard, setExpandedCard] = useState(null);
    const [formData, setFormData] = useState({
        judul: '',
        isi: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKamusData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/halaman_glosarium');
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

    useEffect(() => {
        fetch('http://localhost:5000/api/words')
            .then(res => res.json())
            .then(data => {
                const transformedData = data.map(word => {
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
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div className="w-full flex flex-col items-center bg-emerald-700 min-h-screen p-4">
            <div className="w-full max-w-4xl">
                <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white">
                    {formData.judul}
                </h1>
                <p className="mb-4 text-base md:text-lg text-white">
                    {formData.isi}
                </p>
                <WordCards 
                    words={words} 
                    expandedCard={expandedCard} 
                    setExpandedCard={setExpandedCard} 
                />
            </div>
        </div>
    );
};

const WordCards = ({ words, expandedCard, setExpandedCard }) => (
    <div className="space-y-4">
        {words.map((word, index) => (
            <Card 
                key={`all-${index}`}
                word={word}
                index={index}
                expandedCard={expandedCard}
                setExpandedCard={setExpandedCard}
            />
        ))}
    </div>
);

const Card = ({ word, index, expandedCard, setExpandedCard }) => (
    <div
        className="card p-4 shadow-lg rounded-lg bg-white cursor-pointer transition-all duration-300 hover:shadow-xl"
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
                <h3 className="text-lg md:text-xl font-semibold text-green-700 mt-4">Examples</h3>
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

export default Glosarium;