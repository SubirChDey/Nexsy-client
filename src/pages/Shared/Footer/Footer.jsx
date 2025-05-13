import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo & Description */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <img src="/logo.png" alt="Nexsy Logo" className="w-8 h-8" />
            <h2 className="text-xl font-semibold tracking-wide">Nexsy</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Discover and launch tech products. Empowering creators and explorers across web apps, AI tools, software, games, and mobile apps.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-400">📧 support@nexsy.com</p>
          <p className="text-sm text-gray-400">📞 +1 245-548-652</p>
          <p className="text-sm text-gray-400">📍 320 New York City, New York, USA 52487</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition">Submit a Product</a></li>
            <li><a href="#" className="hover:text-white transition">Explore</a></li>
            <li><a href="#" className="hover:text-white transition">Login / Register</a></li>
            <li><a href="#" className="hover:text-white transition">Premium Plans</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-gray-400 text-xl">
            <a href="#" className="hover:text-white transition" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" className="hover:text-white transition" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>

      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} <span className="font-medium">Nexsy</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
