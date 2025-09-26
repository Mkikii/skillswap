import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-2">&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        <div className="flex justify-center space-x-4 text-lg">
          <a href="#" className="hover:text-blue-400 transition-colors"><i className='bx bxl-twitter'></i></a>
          <a href="#" className="hover:text-blue-400 transition-colors"><i className='bx bxl-linkedin'></i></a>
          <a href="#" className="hover:text-blue-400 transition-colors"><i className='bx bxl-github'></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
