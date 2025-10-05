import React from 'react';
import { Cloud, Navigation } from 'lucide-react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <Cloud size={20} />
          </div>
          <div>
            <div>ClimoPilot</div>
            <div className="tagline">Plan for Extreme Weather with NASA Climate Data</div>
          </div>
        </div>
        <div className="header-info">
          <Navigation size={16} />
          <span>Powered by NASA Earth Observation Data</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
