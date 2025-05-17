import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineLocationOn, MdOutlineMail } from "react-icons/md";
import { Link } from "react-router-dom";
import logoImg from '../../../assets/logoDark.webp';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Logo & About */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <img src={logoImg} alt="Nexsy Logo" className="w-10 h-10 rounded" />
            <h2 className="text-2xl font-bold text-white">Nexsy</h2>
          </div>
          <p className="text-sm leading-relaxed">
            Discover and launch tech products. Empowering creators and explorers across web apps, AI tools, software, games, and mobile apps.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><MdOutlineMail className="text-indigo-400" /> support@nexsy.com</li>
            <li className="flex items-center gap-2"><FaPhoneAlt className="text-indigo-400" /> +1 245-548-652</li>
            <li className="flex items-center gap-2"><MdOutlineLocationOn className="text-indigo-400" /> 320 NYC, New York, USA</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/submit" className="hover:text-indigo-400 transition">Submit a Product</Link></li>
            <li><Link to="/products" className="hover:text-indigo-400 transition">Explore</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition">Login / Register</Link></li>
            <li><Link to="/premium" className="hover:text-indigo-400 transition">Premium Plans</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-indigo-400 transition" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="hover:text-indigo-400 transition" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="hover:text-indigo-400 transition" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-indigo-400 transition" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} <span className="font-medium text-white">Nexsy</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
