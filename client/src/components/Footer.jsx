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

  const socialLinks = [
    {
      icon: FaFacebookF,
      href: "https://facebook.com/jharkhandgov",
      color: "hover:text-blue-700",
      label: "Facebook",
    },
    {
      icon: FaTwitter,
      href: "https://twitter.com/jharkhandgov",
      color: "hover:text-sky-500",
      label: "Twitter",
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com/jharkhandgov",
      color: "hover:text-red-600",
      label: "YouTube",
    },
    {
      icon: FaLinkedinIn,
      href: "https://linkedin.com/company/jharkhandgov",
      color: "hover:text-blue-800",
      label: "LinkedIn",
    },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Departments", href: "/departments" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  const socialResponsibility = [
    "Clean & Green Jharkhand",
    "Digital Governance Initiatives",
    "Women & Child Development",
    "Smart City Projects",
  ];

  return (
    <footer className="bg-gradient-to-b from-green-50 to-green-100 text-gray-800 border-t border-green-200 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Government Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-800 flex items-center gap-2.5">
              <FaMapMarkerAlt className="text-green-700 shrink-0" size={20} />
              Government of Jharkhand
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              "Empowering Communities, Building Futures"
              <br />
              Committed to transparent, efficient, and citizen-friendly governance.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map(({ icon: Icon, href, color, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`text-gray-500 transition-colors duration-200 ${color}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-green-800 flex items-center gap-2">
              <FaInfoCircle className="text-green-700 shrink-0" size={16} />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ name, href }) => (
                <li key={name}>
                  <a
                    href={href}
                    className="text-sm text-gray-700 hover:text-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-1 rounded"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Responsibility */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-green-800 flex items-center gap-2">
              <FaHandsHelping className="text-green-700 shrink-0" size={16} />
              Social Responsibility
            </h4>
            <ul className="space-y-2.5">
              {socialResponsibility.map((item) => (
                <li
                  key={item}
                  className="text-sm text-gray-700 hover:text-green-700 transition-colors duration-200 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-green-800 flex items-center gap-2">
              <FaUsers className="text-green-700 shrink-0" size={16} />
              Contact Us
            </h4>
            <div className="space-y-2.5 text-sm text-gray-700">
              <p className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-green-700 shrink-0" size={14} />
                +91 12345 67890
              </p>
              <p className="flex items-center gap-2.5">
                <FaEnvelope className="text-green-700 shrink-0" size={14} />
                support@jharkhand.gov.in
              </p>
              <p className="flex items-center gap-2.5">
                <FaMapMarkerAlt className="text-green-700 shrink-0" size={14} />
                Ranchi, Jharkhand
              </p>
            </div>

            <div className="pt-2">
              <h5 className="text-sm font-semibold text-green-800 mb-2.5">
                Stay Updated
              </h5>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-shadow"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2.5 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-1"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <p className="text-sm font-medium text-green-700">
                  Thank you for subscribing!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-green-200/80 border-t border-green-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative flex items-center justify-center">
          <p className="text-sm text-gray-700 text-center">
            © {new Date().getFullYear()} Government of Jharkhand. All Rights Reserved.
          </p>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-green-700 hover:bg-green-800 text-white shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-1"
          >
            <FaArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;