import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center flex-shrink-0 mb-2">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          星途成长方舟
        </span>
      </h1>
    </header>
  );
};

export default Header;
