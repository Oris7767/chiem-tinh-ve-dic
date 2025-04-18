
import { useState } from 'react';
import { Bot } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleChatBot}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-primary text-white shadow-lg hover:bg-amber-600 transition-all z-50"
        aria-label="Open Chat Bot"
      >
        <Bot size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 md:p-0">
          <div className="relative w-full max-w-3xl h-[80vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 bg-primary text-white">
              <h3 className="font-semibold">
                {language === 'vi' ? 'Trợ lý ảo số học Vệ Đà' : 'Vedic Numerology Assistant'}
              </h3>
              <button 
                onClick={toggleChatBot}
                className="text-white hover:text-amber-200"
              >
                ✕
              </button>
            </div>
            <div className="flex-grow">
              <iframe
                src="https://monica.im/share/bot?botId=beSkoO74"
                className="w-full h-full border-0"
                title="Vedic Numerology Chat Bot"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
