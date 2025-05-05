import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Gamepad2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Gamepad2 className="w-8 h-8 text-primary" />
              <span className="text-xl font-heading font-bold gradient-text">FF Shop BD</span>
            </Link>
            <p className="text-muted-foreground">
              Your trusted marketplace for Free Fire accounts in Bangladesh. Find the perfect account with rare skins and high levels.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/accounts" className="text-muted-foreground hover:text-primary transition-colors">Accounts</Link></li>
              <li><Link to="/sellers" className="text-muted-foreground hover:text-primary transition-colors">Sellers</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-heading font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Facebook className="w-5 h-5 text-primary" />
                <a href="https://www.facebook.com/mroppy69" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Facebook</a>
              </li>
              <li className="flex items-center space-x-2">
                <Instagram className="w-5 h-5 text-primary" />
                <a href="https://www.instagram.com/mroppy21/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Instagram</a>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <a href="https://m.me/mroppy69" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Messenger</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Free Fire Account Shop Bangladesh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;