
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <img 
              src="/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png" 
              alt="Votive Logo" 
              className="h-16 mr-4"
            />
            <div>
              <div className="text-xl font-serif font-semibold text-gray-900 mb-2">
                Số học Vệ Đà
              </div>
              <p className="text-gray-500 max-w-md">
                Khám phá ý nghĩa sâu sắc đằng sau những con số trong cuộc sống của bạn dựa trên nguyên lý cổ đại của số học Vệ Đà.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-6 mb-4">
              <a href="https://www.facebook.com/votive.edu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://x.com/VotiveAstrology" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://t.me/votiveacademy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-700 transition-colors">
                <span className="sr-only">Telegram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.21-1.59.15-.15 2.71-2.48 2.76-2.69.01-.04.01-.19-.07-.27-.08-.08-.21-.05-.3-.03-.13.03-2.2 1.4-6.22 4.12-.59.4-1.12.6-1.59.58-.53-.01-1.54-.3-2.28-.55-.92-.31-1.64-.47-1.58-.99.03-.27.28-.53.77-.8 3.03-1.31 5.03-2.17 6.03-2.6 2.86-1.21 3.47-1.42 3.87-1.43.09 0 .28.02.4.12.11.09.13.22.14.33 0 .07 0 .2 0 .31z" />
                </svg>
              </a>
            </div>
            
            <div className="text-gray-500 text-sm">
              &copy; {currentYear} chiemtinhvedavn. Bảo lưu mọi quyền.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
