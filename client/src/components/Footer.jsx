import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaArrowUp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHandsHelping,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-r from-green-50 to-green-100 text-black border-t border-gray-300 mt-12 select-none">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Government Info */}
        <div className="hover:shadow-md transition-shadow p-3 rounded cursor-pointer">
          <h3 className="text-2xl font-bold mb-3 text-green-800 flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-700" /> Government of Jharkhand
          </h3>
          <p className="text-sm leading-relaxed mb-4">
            "Empowering Communities, Building Futures"
            <br /> Committed to transparent, efficient, and citizen-friendly governance.
          </p>
          <div className="flex space-x-5 mt-6 text-gray-600">
            {[{
                icon: FaFacebookF,
                href: "https://facebook.com/jharkhandgov",
                color: "hover:text-blue-700",
              },
              { icon: FaTwitter, href: "https://twitter.com/jharkhandgov", color: "hover:text-sky-400" },
              { icon: FaYoutube, href: "https://youtube.com/jharkhandgov", color: "hover:text-red-600" },
              { icon: FaLinkedinIn, href: "https://linkedin.com/company/jharkhandgov", color: "hover:text-blue-800" },
            ].map(({ icon: Icon, href, color }, idx) => (
              <a
                key={idx}
                href={href}
                className={`transition-colors ${color} cursor-pointer`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="hover:shadow-md transition-shadow p-3 rounded cursor-pointer">
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
            <FaInfoCircle className="text-green-700" /> Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {[{ name: "About Us", href: "/about" },
              { name: "Departments", href: "/departments" },
              { name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Terms of Service", href: "/terms" }
            ].map(({ name, href }) => (
              <li key={name}>
                <a
                  href={href}
                  className="block hover:text-green-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600 rounded"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Responsibility */}
        <div className="hover:shadow-md transition-shadow p-3 rounded cursor-pointer">
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
            <FaHandsHelping className="text-green-700" /> Social Responsibility
          </h4>
          <ul className="space-y-2 text-sm">
            {[
              "Clean & Green Jharkhand",
              "Digital Governance Initiatives",
              "Women & Child Development",
              "Smart City Projects",
            ].map((item) => (
              <li key={item} className="hover:text-green-700 cursor-pointer transition-colors">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div className="hover:shadow-md transition-shadow p-3 rounded cursor-pointer">
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
            <FaUsers className="text-green-700" /> Contact Us
          </h4>
          <p className="text-sm flex items-center gap-2 cursor-pointer">
            <FaPhoneAlt className="text-green-700" /> +91 12345 67890
          </p>
          <p className="text-sm flex items-center gap-2 cursor-pointer">
            <FaEnvelope className="text-green-700" /> support@jharkhand.gov.in
          </p>
          <p className="text-sm flex items-center gap-2 cursor-pointer">
            <FaMapMarkerAlt className="text-green-700" /> Ranchi, Jharkhand
          </p>

          <div className="mt-5">
            <h5 className="font-semibold mb-2">Stay Updated</h5>
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white py-2 rounded transition-colors cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            ) : (
              <p className="text-green-700 font-semibold transition-all duration-500">Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-200 py-5 text-center text-sm text-gray-800 relative">
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="absolute right-6 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-green-700 hover:bg-green-800 text-white transition-colors cursor-pointer"
        >
          <FaArrowUp />
        </button>
        © {new Date().getFullYear()} Government of Jharkhand. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
