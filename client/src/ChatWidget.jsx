import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import axios from "axios";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { text: "Halo! Selamat datang di Pondok Pesantren Modern Al-Ikhlas Putri. Ada yang bisa saya bantu?", fromUser: false }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newHistory = [...chatHistory, { text: message, fromUser: true }];
    setChatHistory(newHistory);
    setIsTyping(true);

    // Simulate API call - replace with your actual API
    setTimeout(async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/predict", {
          text: message,
        });
        const botMessage = response.data.predicted_answer;
        
        // // Demo response for now
        // const botMessage = "Terima kasih atas pertanyaan Anda. Tim kami akan segera membantu Anda.";

        setChatHistory([
          ...newHistory,
          { text: botMessage, fromUser: false },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setChatHistory([
          ...newHistory,
          { text: "Maaf, terjadi kesalahan. Silakan coba lagi.", fromUser: false },
        ]);
      }
      setIsTyping(false);
    }, 1500);

    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 rounded-full shadow-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-110 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-300" />
          ) : (
            <MessageCircle className="w-6 h-6 transition-transform duration-300" />
          )}
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">1</span>
          </div>
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Butuh bantuan?
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Chat Assistant</h3>
                  <p className="text-emerald-100 text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-emerald-600 p-2 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full opacity-10 -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500 rounded-full opacity-10 -ml-12 -mb-12"></div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50 relative">
            <div className="p-4 space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end space-x-2 ${
                    msg.fromUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!msg.fromUser && (
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-emerald-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                      msg.fromUser
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div className={`text-xs mt-1 ${msg.fromUser ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  {msg.fromUser && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-end space-x-2 justify-start">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-100 px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  className="w-full border border-gray-200 rounded-full px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 transition-all duration-200"
                  placeholder="Tulis pesan Anda..."
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isTyping}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-3 rounded-full hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button 
                onClick={() => setMessage("Bagaimana cara mendaftar?")}
                className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full hover:bg-emerald-100 transition-colors duration-200"
              >
                Cara Mendaftar
              </button>
              <button 
                onClick={() => setMessage("Apa saja fasilitas yang tersedia?")}
                className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full hover:bg-emerald-100 transition-colors duration-200"
              >
                Fasilitas
              </button>
              <button 
                onClick={() => setMessage("Berapa biaya pendaftaran?")}
                className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full hover:bg-emerald-100 transition-colors duration-200"
              >
                Biaya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}